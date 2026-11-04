/* ===================== 05 · cámara =====================
   giro = rumbo + mirada. La mirada sigue al ratón como en la v0.1 (±1,05 rad);
   el rumbo crece mientras el ratón está en el borde (o con A/D y las flechas),
   y así se puede dar la vuelta entera y ver la puerta. Un «foco» fija la cámara
   en un sitio (la pizarra, el libro abierto, el monitor). */
const cam = { pos: BASE.clone(), yaw: 0, pitch: -0.12, fov: 62 };
const rig = { rumbo: 0, mx: 0, my: 0, foco: null, teclaGiro: 0, sensib: 1, bordeListo: false };
const BORDE = 0.86, VEL_BORDE = 1.6, VEL_TECLA = 1.8;
function anglesTo(from, to) { const d = to.clone().sub(from); return { yaw: Math.atan2(-d.x, -d.z), pitch: Math.asin(d.y / d.length()) }; }
function enfoca(punto, desde = BASE, fov = 50, extra = {}) {
  const a = anglesTo(desde, punto);
  // el giro más corto desde donde mira ahora (evita dar la vuelta entera)
  let yaw = a.yaw; while (yaw - cam.yaw > Math.PI) yaw -= 2 * Math.PI; while (yaw - cam.yaw < -Math.PI) yaw += 2 * Math.PI;
  rig.foco = Object.assign({ yaw, pitch: a.pitch, pos: desde.clone(), fov }, extra);
}
function sueltaFoco() {
  // al soltar el foco, el rumbo pasa a ser el giro actual menos la mirada, para que no haya salto
  if (rig.foco) rig.rumbo = cam.yaw + rig.mx * 1.05;
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
    if (puedeGirar && Math.abs(rig.mx) > BORDE) rig.rumbo -= Math.sign(rig.mx) * VEL_BORDE * ((Math.abs(rig.mx) - BORDE) / (1 - BORDE)) * dt;
    rig.rumbo -= rig.teclaGiro * VEL_TECLA * dt;
    ty = rig.rumbo - rig.mx * 1.05 * rig.sensib;
    tp = rig.my > 0 ? -0.12 + rig.my * 0.75 : -0.12 + rig.my * 0.85;
    tpos = BASE; tfov = 62;
  }
  const rate = f && f.rate ? f.rate : 5;
  const k = reduced ? 1 : 1 - Math.exp(-dt * rate);      // suavizado exponencial: igual de suave a 30 o a 144 fps
  cam.yaw += (ty - cam.yaw) * k; cam.pitch += (tp - cam.pitch) * k; cam.fov += (tfov - cam.fov) * k; cam.pos.lerp(tpos, k);
  const respira = reduced || f ? 0 : Math.sin(performance.now() / 1400) * 0.004;
  camera.position.set(cam.pos.x, cam.pos.y + respira, cam.pos.z);
  const cp = Math.cos(cam.pitch);
  camera.lookAt(cam.pos.x - Math.sin(cam.yaw) * cp, cam.pos.y + respira + Math.sin(cam.pitch), cam.pos.z - Math.cos(cam.yaw) * cp);
  if (Math.abs(camera.fov - cam.fov) > 0.01) { camera.fov = cam.fov; camera.updateProjectionMatrix(); }
}
