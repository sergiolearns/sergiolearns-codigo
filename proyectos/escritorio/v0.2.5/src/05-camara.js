/* ===================== 05 · cámara =====================
   giro = rumbo + mirada. La mirada sigue al ratón como en la v0.1 (±1,05 rad);
   el rumbo crece mientras el ratón está en el borde (o con A/D y las flechas),
   y así se puede dar la vuelta entera y ver la puerta. Un «foco» fija la cámara
   en un sitio (la pizarra, el libro abierto, el monitor). */
const cam = { pos: BASE.clone(), yaw: 0, pitch: -0.12, fov: 62 };
// v0.2.2 (E48): la persona. Sentada, los ojos están en BASE como desde la v0.1; de pie, en (x, DE_PIE, z) y se camina
const jug = { sentado: true, pos: BASE.clone(), en: 'silla' };   // en: el último sitio al que se fue (o null si se caminó libre)
const rig = { fovLee: null, rumbo: 0, mx: 0, my: 0, foco: null, teclaGiro: 0, sensib: 1, bordeListo: false, pj: -0.12 };
const BORDE = 0.86, VEL_BORDE = 1.6, VEL_TECLA = 1.8;
/* Sensibilidad (E37): cinco niveles; se cambia con la rueda sobre el ratón de la mesa y se guarda.
   El nivel 2 es la v0.2; desde la v0.2.1 se empieza en el 3. El factor f multiplica cuánto gira la
   mirada con el ratón (±1,05·f rad, hasta ±1,6), la velocidad del borde y lo rápido que la cámara alcanza al ratón. */
const SENS = { factores: [0.8, 1.0, 1.25, 1.5, 1.8], nivel: clamp(guardado.get('sensibilidad', 3), 1, 5) };
const sensF = () => SENS.factores[SENS.nivel - 1];
function anglesTo(from, to) { const d = to.clone().sub(from); return { yaw: Math.atan2(-d.x, -d.z), pitch: Math.asin(d.y / d.length()) }; }
function ojos() { return jug.sentado ? BASE.clone() : jug.pos.clone(); }   // dónde están los ojos ahora (sentado o de pie)
function enfoca(punto, desde = ojos(), fov = 50, extra = {}) {
  const a = anglesTo(desde, punto);
  // el giro más corto desde donde mira ahora (evita dar la vuelta entera)
  let yaw = a.yaw; while (yaw - cam.yaw > Math.PI) yaw -= 2 * Math.PI; while (yaw - cam.yaw < -Math.PI) yaw += 2 * Math.PI;
  rig.foco = Object.assign({ yaw, pitch: a.pitch, pos: desde.clone(), fov }, extra);
}
function sueltaFoco() {
  // al soltar el foco, el rumbo pasa a ser el giro actual menos la mirada, para que no haya salto
  if (rig.foco) rig.rumbo = cam.yaw + rig.mx * Math.min(1.6, 1.05 * sensF()) * rig.sensib;
  rig.pj = cam.pitch;                                   // v0.2.4: la inclinación del modo juego sigue donde estaba
  rig.foco = null;
}
function rumboACero() {
  // Esc en LIBRE: vuelve a mirar a la mesa por el camino corto
  const n = Math.round(rig.rumbo / (2 * Math.PI)) * 2 * Math.PI;
  rig.rumbo -= n; cam.yaw -= n;
  const r0 = rig.rumbo; anim(600, e => { rig.rumbo = r0 * (1 - e); });
}
function aplicaCamara(dt) {
  let ty, tp, tpos, tfov;
  const f = rig.foco;
  if (f) { ty = f.yaw - rig.mx * (f.paralaje ?? 0.04); tp = f.pitch + rig.my * (f.paralaje ?? 0.03); tpos = f.pos; tfov = f.fov; }
  else {
    // el borde gira solo cuando no se está haciendo otra cosa con el ratón
    // solo si el ratón ha entrado en el borde estando libre (si acabas de soltar un disco junto al borde, no gira solo)
    if (Math.abs(rig.mx) <= BORDE) rig.bordeListo = gesto.estado === 'libre';
    const puedeGirar = rig.bordeListo && gesto.estado === 'libre' && !gesto.pulsado && !teclado.activo;
    const fs = sensF();
    if (puedeGirar && Math.abs(rig.mx) > BORDE) rig.rumbo -= Math.sign(rig.mx) * VEL_BORDE * fs * ((Math.abs(rig.mx) - BORDE) / (1 - BORDE)) * dt;
    rig.rumbo -= rig.teclaGiro * VEL_TECLA * dt;
    ty = rig.rumbo - rig.mx * Math.min(1.6, 1.05 * fs) * rig.sensib;
    tp = clamp(rig.my > 0 ? -0.12 + rig.my * 0.75 * fs : -0.12 + rig.my * 0.85 * fs, -1.2, 1.15);
    if (control.bloqueado) { ty = rig.rumbo; tp = rig.pj ?? cam.pitch; }   // v0.2.4 (modo juego): la cabeza va donde la lleva el ratón
    tpos = jug.sentado ? BASE : jug.pos; tfov = 62;
  }
  if (rig.fovLee) tfov = rig.fovLee;   // v0.2.5 (regla 5): al leer un papel o mirar el móvil, la vista se cierra (enfocas)
  const rate = f && f.rate ? f.rate : (f ? 5 : control.bloqueado ? 40 : 5 + 3 * (sensF() - 1));   // capturado: casi sin suavizado, como un juego
  const k = reduced ? 1 : 1 - Math.exp(-dt * rate);      // suavizado exponencial: igual de suave a 30 o a 144 fps
  cam.yaw += (ty - cam.yaw) * k; cam.pitch += (tp - cam.pitch) * k; cam.fov += (tfov - cam.fov) * (reduced ? 1 : 1 - Math.exp(-dt * 7)); cam.pos.lerp(tpos, k);
  const respira = reduced || f ? 0 : Math.sin(performance.now() / 1400) * 0.004;
  camera.position.set(cam.pos.x, cam.pos.y + respira, cam.pos.z);
  const cp = Math.cos(cam.pitch);
  camera.lookAt(cam.pos.x - Math.sin(cam.yaw) * cp, cam.pos.y + respira + Math.sin(cam.pitch), cam.pos.z - Math.cos(cam.yaw) * cp);
  if (Math.abs(camera.fov - cam.fov) > 0.01) { camera.fov = cam.fov; camera.updateProjectionMatrix(); }
}
