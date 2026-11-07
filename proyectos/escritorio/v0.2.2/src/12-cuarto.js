/* ===================== 12 · el cuarto: caminar y que todo sirva (E48, E49, E50, E52, E55) =====================
   Se rompe la regla de Five Nights at Freddy's: «Descubre el cuarto de Sergio».
   · Clic en un sitio (un mueble): se camina hasta él por el camino más corto (A* en una rejilla de 5 cm,
     tensado después) y se hace su animación al llegar: el armario abre sus puertas, el sillón te sienta,
     la cama te tumba y te da el móvil, la tele se enciende…
   · WASD: caminar libre. Las colisiones son un círculo (la persona, 0,22 m) contra rectángulos en el suelo
     (los muebles, sacados del plano) y la silla. La física de verdad, en la v0.4 (E38).
   · Esc o la silla devuelven a la mesa. Fragmentos F1 (colisiones) y F2 (A*) en material/v0.2.2/fragmentos.md. */

/* ---------- colisiones: un círculo contra rectángulos ---------- */
const sillaTapada = { x: 0, z: 0.3, r: 0.28 };            // la silla, metida bajo la mesa, cuando estás de pie
function empujaFuera(x, z) {
  // Para cada rectángulo: el punto del rectángulo más cercano al centro, q = (clamp(x, x0, x1), clamp(z, z0, z1)).
  // Si |c − q| < R, se empuja el centro a lo largo de (c − q) lo que falta hasta R. Si el centro está dentro
  // (|c − q| = 0), se sale por el lado más cercano. Tres pasadas bastan para las esquinas entre dos muebles.
  const R = RADIO_PERSONA;
  for (let k = 0; k < 3; k++) {
    x = clamp(x, SALA.x0 + R, SALA.x1 - R); z = clamp(z, SALA.z0 + R, SALA.z1 - R);
    for (const [, x0, x1, z0, z1] of OBSTACULOS) {
      const qx = clamp(x, x0, x1), qz = clamp(z, z0, z1), dx = x - qx, dz = z - qz, d = Math.hypot(dx, dz);
      if (d >= R) continue;
      if (d > 1e-6) { x = qx + dx / d * R; z = qz + dz / d * R; }
      else { const o = [[x - x0, -1, 0], [x1 - x, 1, 0], [z - z0, 0, -1], [z1 - z, 0, 1]].sort((a, b) => a[0] - b[0])[0]; x += o[1] * (o[0] + R); z += o[2] * (o[0] + R); }
    }
    const dx = x - sillaTapada.x, dz = z - sillaTapada.z, d = Math.hypot(dx, dz), Rs = R + sillaTapada.r;
    if (d < Rs && d > 1e-6) { x = sillaTapada.x + dx / d * Rs; z = sillaTapada.z + dz / d * Rs; }
  }
  return [x, z];
}
function esLibre(x, z) {
  const R = RADIO_PERSONA;
  if (x < SALA.x0 + R || x > SALA.x1 - R || z < SALA.z0 + R || z > SALA.z1 - R) return false;
  for (const [, x0, x1, z0, z1] of OBSTACULOS) if (Math.hypot(x - clamp(x, x0, x1), z - clamp(z, z0, z1)) < R) return false;
  return Math.hypot(x - sillaTapada.x, z - sillaTapada.z) >= R + sillaTapada.r;
}

/* ---------- A* en una rejilla de 5 cm (la misma cuenta que scripts/plano.py) ---------- */
const REJ = { h: 0.05 };
REJ.nx = Math.round((SALA.x1 - SALA.x0) / REJ.h); REJ.nz = Math.round((SALA.z1 - SALA.z0) / REJ.h);
REJ.libre = new Uint8Array(REJ.nx * REJ.nz);
for (let j = 0; j < REJ.nz; j++) for (let i = 0; i < REJ.nx; i++) REJ.libre[j * REJ.nx + i] = esLibre(SALA.x0 + (i + 0.5) * REJ.h, SALA.z0 + (j + 0.5) * REJ.h) ? 1 : 0;
const celda = (x, z) => [clamp(Math.floor((x - SALA.x0) / REJ.h), 0, REJ.nx - 1), clamp(Math.floor((z - SALA.z0) / REJ.h), 0, REJ.nz - 1)];
const centroCelda = (i, j) => [SALA.x0 + (i + 0.5) * REJ.h, SALA.z0 + (j + 0.5) * REJ.h];
function rectaLibre(a, b) { const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.02)); for (let k = 0; k <= n; k++) if (!esLibre(a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n)) return false; return true; }
function camino(a, b) {
  // f(n) = g(n) + h(n): g = lo andado (1 en recto, √2 en diagonal), h = la distancia en línea recta hasta el final.
  // Con h admisible (nunca se pasa), el primer camino que llega al final es el más corto de la rejilla.
  const [ai, aj] = celda(...a), [bi, bj] = celda(...b), N = REJ.nx * REJ.nz, A = aj * REJ.nx + ai, B = bj * REJ.nx + bi;
  const g = new Float32Array(N).fill(Infinity), padre = new Int32Array(N).fill(-1), cerrado = new Uint8Array(N), abiertos = [[0, A]];
  g[A] = 0;
  while (abiertos.length) {
    let mi = 0; for (let k = 1; k < abiertos.length; k++) if (abiertos[k][0] < abiertos[mi][0]) mi = k;   // la cola: una lista basta (unas 6.000 celdas)
    const [, u] = abiertos.splice(mi, 1)[0]; if (cerrado[u]) continue; cerrado[u] = 1; if (u === B) break;
    const ui = u % REJ.nx, uj = (u / REJ.nx) | 0;
    for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) {
      if (!di && !dj) continue; const vi = ui + di, vj = uj + dj; if (vi < 0 || vj < 0 || vi >= REJ.nx || vj >= REJ.nz) continue;
      const v = vj * REJ.nx + vi; if (!REJ.libre[v] && v !== B) continue;
      const ng = g[u] + (di && dj ? Math.SQRT2 : 1);
      if (ng < g[v]) { g[v] = ng; padre[v] = u; abiertos.push([ng + Math.hypot(vi - bi, vj - bj), v]); }
    }
  }
  if (!cerrado[B]) return [a, b];
  const ruta = []; for (let u = padre[B]; u !== -1 && u !== A; u = padre[u]) ruta.push(centroCelda(u % REJ.nx, (u / REJ.nx) | 0));
  const pts = [a, ...ruta.reverse(), b], tenso = [pts[0]];
  for (let i = 0; i < pts.length - 1;) { let j = pts.length - 1; while (j > i + 1 && !rectaLibre(pts[i], pts[j])) j--; tenso.push(pts[j]); i = j; }   // tensar: quitar los puntos que sobran
  return tenso;
}

/* ---------- caminar hasta un punto (con un clic) ---------- */
const caminar = { activo: false, teclas: new Set(), vel: 1.35 };
function angulo(a) { return Math.atan2(-a[0], -a[1]); }       // rumbo de la cámara para mirar en la dirección (dx, dz)
function corto(desde, hasta) { let d = hasta - desde; d -= Math.round(d / (2 * Math.PI)) * 2 * Math.PI; return desde + d; }
async function caminaHasta(dest) {
  const a = [jug.pos.x, jug.pos.z], ruta = camino(a, dest);
  let largo = 0; for (let i = 1; i < ruta.length; i++) largo += Math.hypot(ruta[i][0] - ruta[i - 1][0], ruta[i][1] - ruta[i - 1][1]);
  if (largo < 0.03) return;
  caminar.activo = true;
  rig.foco = { yaw: cam.yaw, pitch: cam.pitch, pos: jug.pos.clone(), fov: 62, rate: 7, paralaje: 0 };
  const dur = reduced ? 1 : largo / caminar.vel * 1000 + 250;
  const enS = s => { let r = s * largo; for (let i = 1; i < ruta.length; i++) { const l = Math.hypot(ruta[i][0] - ruta[i - 1][0], ruta[i][1] - ruta[i - 1][1]); if (r <= l || i === ruta.length - 1) { const f = l ? clamp(r / l, 0, 1) : 1; return [lerp(ruta[i - 1][0], ruta[i][0], f), lerp(ruta[i - 1][1], ruta[i][1], f), i]; } r -= l; } };
  await anim(dur, e => {
    const [x, z] = enS(e), [x2, z2] = enS(Math.min(1, e + 0.06));
    jug.pos.set(x, DE_PIE + (reduced ? 0 : Math.sin(e * largo * 7) * 0.012), z); rig.foco.pos.copy(jug.pos);   // el paso: los ojos suben y bajan un centímetro
    if (Math.hypot(x2 - x, z2 - z) > 1e-3) rig.foco.yaw = corto(cam.yaw, angulo([x2 - x, z2 - z]));
    rig.foco.pitch = -0.08;
  }, curva.suave);
  jug.pos.y = DE_PIE; caminar.activo = false;
}
// girar hacia un punto con una animación por tiempo (no por fotogramas: con pocos fps también llega entera)
function miraA(p, dur = 650) {
  const a = anglesTo(jug.pos, v3(...p)), y0 = cam.yaw, p0 = cam.pitch, y1 = corto(cam.yaw, a.yaw);
  rig.foco = { yaw: y0, pitch: p0, pos: jug.pos.clone(), fov: 62, rate: 40, paralaje: 0 };
  return anim(reduced ? 1 : dur, e => { rig.foco.yaw = lerp(y0, y1, e); rig.foco.pitch = lerp(p0, a.pitch, e); }, curva.suave).then(() => { cam.yaw = y1; cam.pitch = a.pitch; });
}
// irA('cama') → camina hasta allí (levantándose si estabas sentado) y mira hacia el mueble. Devuelve si llegó
async function irA(n) {
  if (n === 'silla') { if (!jug.sentado) await sientate(); return true; }
  const P = PUNTOS[n]; if (!P) return false;
  if (jug.en === n && !caminar.activo) return true;
  if (gesto.estado !== 'libre' && gesto.estado !== 'ocupado') return false;
  cambia('ocupado'); setHover(null);
  if (enSillon.si) await levantaDelSillon();
  if (jug.sentado) await levantate();
  anuncia('Vas hacia ' + P.nombre + '.');
  await caminaHasta(P.pos);
  await miraA(P.mira);
  jug.en = n; sueltaFoco(); cambia('libre');
  return true;
}
/* ---------- levantarse de la silla y sentarse (la silla se ve, rueda y gira contigo: E44) ---------- */
async function levantate() {
  if (!jug.sentado) return;
  const p0 = BASE.clone(), p1 = v3(0, DE_PIE, 0.95);
  jug.sentado = false; jug.en = null; jug.pos.copy(p0);
  rig.foco = { yaw: cam.yaw, pitch: cam.pitch, pos: p0.clone(), fov: 62, rate: 9, paralaje: 0 };
  const yaw0 = sillaGiro.rotation.y;
  await anim(reduced ? 1 : 850, e => {
    rig.foco.pos.lerpVectors(p0, p1, curva.suave(e)); jug.pos.copy(rig.foco.pos);
    silla.position.z = lerp(0.45, 0.72, curva.sale(Math.min(1, e * 1.6)));       // al levantarte la silla rueda hacia atrás…
    rig.foco.pitch = lerp(cam.pitch, -0.1, e);
  });
  await anim(reduced ? 1 : 520, e => { silla.position.z = lerp(0.72, sillaTapada.z, e); sillaGiro.rotation.y = lerp(yaw0, 0, e); }, curva.suave);   // …y la metes bajo la mesa
  jug.pos.copy(p1); sueltaFoco();
  anuncia('De pie. Camina con W, A, S y D, o haz clic en un mueble. Esc vuelve a la silla.');
}
async function sientate() {
  if (jug.sentado) return;
  const vuelta = gesto.estado; cambia('ocupado'); setHover(null);
  if (enSillon.si) await levantaDelSillon();
  await caminaHasta([0, 0.95]);
  const p0 = jug.pos.clone(), y0 = cam.yaw, yaw1 = corto(cam.yaw, 0);
  rig.foco = { yaw: y0, pitch: cam.pitch, pos: p0.clone(), fov: 62, rate: 9, paralaje: 0 };
  await anim(reduced ? 1 : 420, e => { silla.position.z = lerp(sillaTapada.z, 0.7, e); rig.foco.yaw = lerp(y0, yaw1, e); }, curva.suave);   // sacas la silla…
  await anim(reduced ? 1 : 750, e => { rig.foco.pos.lerpVectors(p0, BASE, curva.suave(e)); silla.position.z = lerp(0.7, 0.45, e); rig.foco.pitch = lerp(-0.1, -0.12, e); });   // …y te sientas
  jug.sentado = true; jug.en = 'silla'; jug.pos.copy(BASE); sueltaFoco(); rig.rumbo = yaw1;
  cambia(vuelta === 'ocupado' ? 'ocupado' : 'libre');
}
// la silla: con un clic (de pie) te sientas
registrar('silla', { nombre: 'Silla · sentarse a la mesa', mallas: sillaGiro.children.slice(0, 2), lugar: 'cualquiera', activo: () => gesto.estado === 'libre' && !jug.sentado,
  alClic: async () => { await sientate(); cambia('libre'); anuncia('Sentado a la mesa.'); } });

/* ---------- caminar libre con WASD ---------- */
const _f = new THREE.Vector3();
function corrMovimiento(dt) {
  const T = caminar.teclas; if (!T.size || gesto.estado !== 'libre' || caminar.activo) return;
  if (jug.sentado) { if (T.has('w') || T.has('s')) { cambia('ocupado'); levantate().then(() => cambia('libre')); } return; }
  if (enSillon.si) { cambia('ocupado'); levantaDelSillon().then(() => cambia('libre')); return; }
  let f = (T.has('w') ? 1 : 0) - (T.has('s') ? 1 : 0), l = (T.has('d') ? 1 : 0) - (T.has('a') ? 1 : 0); if (!f && !l) return;
  const n = Math.hypot(f, l); f /= n; l /= n;
  const y = cam.yaw, vx = (-Math.sin(y) * f + Math.cos(y) * l) * caminar.vel * dt, vz = (-Math.cos(y) * f - Math.sin(y) * l) * caminar.vel * dt;
  const [x, z] = empujaFuera(jug.pos.x + vx, jug.pos.z + vz);
  jug.pos.x = x; jug.pos.z = z; jug.en = null;
  if (rig.foco && rig.foco.rate === 4) sueltaFoco();
}
function corrSilla() { if (jug.sentado && !rig.foco) sillaGiro.rotation.y = cam.yaw; else if (jug.sentado) sillaGiro.rotation.y = cam.yaw; }

/* ---------- el sillón: sentarse a leer los libros de 2º (E49, E50) ---------- */
const enSillon = { si: false };
const OJOS_SILLON = v3(-2.0, 1.05, 2.6);
async function sientateEnSillon() {
  cambia('ocupado');
  const p0 = jug.pos.clone(); rig.foco = { yaw: cam.yaw, pitch: cam.pitch, pos: p0.clone(), fov: 62, rate: 8, paralaje: 0 };
  const y0 = cam.yaw, y1 = corto(cam.yaw, -0.35);
  // te das la vuelta y te dejas caer: la curva «retroceso» baja un poco de más y se recoloca (el cojín cede)
  await anim(reduced ? 1 : 1100, e => { rig.foco.pos.lerpVectors(p0, OJOS_SILLON, curva.retroceso(e)); rig.foco.yaw = lerp(y0, y1, curva.suave(e)); rig.foco.pitch = lerp(-0.08, -0.22, e); });
  enSillon.si = true; jug.pos.copy(OJOS_SILLON); jug.en = 'sillon'; sueltaFoco(); cambia('libre');
  anuncia('En el sillón. A tu derecha, en la mesita, los libros de 2º con su guía docente. WASD o Esc para levantarte.');
}
async function levantaDelSillon() {
  if (!enSillon.si) return;
  const p0 = jug.pos.clone(), p1 = v3(PUNTOS.sillon.pos[0], DE_PIE, PUNTOS.sillon.pos[1]);
  rig.foco = { yaw: cam.yaw, pitch: cam.pitch, pos: p0.clone(), fov: 62, rate: 8, paralaje: 0 };
  await anim(reduced ? 1 : 700, e => { rig.foco.pos.lerpVectors(p0, p1, curva.suave(e)); });
  enSillon.si = false; jug.pos.copy(p1); jug.en = 'sillon'; sueltaFoco();
}
registrar('sillon', { nombre: 'Sillón · sentarse a leer', mallas: sillonG.children.slice(0, 3), lugar: 'sillon', alcance: 0, activo: () => gesto.estado === 'libre' && !enSillon.si,
  alClic: () => sientateEnSillon() });

/* ---------- la cama y el móvil (E49 y la puerta de la versión móvil, E53) ---------- */
const movil = { pausaFin: 0, ult: 0, vibra: 0, abierto: false };
const OJOS_BORDE = v3(-0.8, 0.98, 1.42), OJOS_TUMBADO = v3(-2.1, 0.8, 1.42);
function dibujaMovil(t) {
  const c = movilTex.userData.g, w = 256, h = 512;
  c.fillStyle = '#141221'; c.fillRect(0, 0, w, h);
  if (!movil.abierto) { c.fillStyle = 'rgba(201,197,220,.06)'; c.fillRect(0, 0, w, h); movilTex.needsUpdate = true; return; }
  c.fillStyle = '#E8E6F5'; c.font = '600 54px ' + DISP; c.textAlign = 'center'; c.fillText(horaTexto(), w / 2, 78);
  c.font = '500 15px ' + BODY; c.fillStyle = '#C9C5DC'; c.fillText('Canarias · ' + momentoDelDia(ahoraCanarias().h), w / 2, 102);
  c.textAlign = 'left'; c.font = '600 15px ' + MONO; c.fillStyle = '#A99EF5'; c.fillText('sergio@learns', 18, 140);
  NOVEDADES.forEach(([f, txt], i) => { const y = 160 + i * 46; c.fillStyle = 'rgba(232,230,245,.08)'; rr(c, 12, y, w - 24, 38, 8); c.fill(); c.fillStyle = '#F5C06B'; c.font = '600 12px ' + MONO; c.fillText(f, 22, y + 16); c.fillStyle = '#E8E6F5'; c.font = '400 13px ' + BODY; c.fillText(txt.slice(0, 30), 22, y + 31); });
  // la pausa: un círculo que se vacía (5 minutos)
  const cx = w / 2, cy = 430, R = 44, resta = Math.max(0, movil.pausaFin - Date.now()), f = resta / 300000;
  c.strokeStyle = 'rgba(255,107,74,.25)'; c.lineWidth = 7; c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.stroke();
  if (resta > 0) { c.strokeStyle = '#FF6B4A'; c.beginPath(); c.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * f); c.stroke(); }
  c.fillStyle = '#FAFAF7'; c.font = '600 22px ' + MONO; c.textAlign = 'center';
  c.fillText(resta > 0 ? Math.floor(resta / 60000) + ':' + String(Math.floor(resta / 1000) % 60).padStart(2, '0') : '5:00', cx, cy + 8);
  c.font = '500 12px ' + BODY; c.fillStyle = '#C9C5DC'; c.fillText(resta > 0 ? 'pausa · toca para parar' : 'toca: pausa de 5 min', cx, cy + 66);
  movilTex.needsUpdate = true;
}
dibujaMovil(0);
async function acuestate() {
  cambia('ocupado'); setHover(null);
  const p0 = jug.pos.clone(); rig.foco = { yaw: cam.yaw, pitch: cam.pitch, pos: p0.clone(), fov: 62, rate: 8, paralaje: 0 };
  const y0 = cam.yaw;   // sentado en el borde de los pies, de espaldas al cabecero…
  await anim(reduced ? 1 : 800, e => { rig.foco.pos.lerpVectors(p0, OJOS_BORDE, curva.suave(e)); rig.foco.yaw = lerp(y0, corto(y0, -Math.PI / 2), e); rig.foco.pitch = lerp(cam.pitch, -0.15, e); });
  // …y te echas hacia atrás: la cabeza va a la almohada y la vista sube al techo
  const yT = corto(rig.foco.yaw, -Math.PI / 2);
  await anim(reduced ? 1 : 1100, e => { const s = curva.suave(e); rig.foco.pos.lerpVectors(OJOS_BORDE, OJOS_TUMBADO, s); rig.foco.pitch = lerp(-0.15, 1.2, s); rig.foco.yaw = lerp(rig.foco.yaw, yT, e); });
  jug.pos.copy(OJOS_TUMBADO); jug.en = 'cama';
  // el móvil sube de la mesita a la cara (en la mano: un poco a la derecha y mirando a los ojos)
  movil.abierto = true; dibujaMovil(0);
  const m0 = movilG.position.clone(), q0 = movilG.quaternion.clone();
  camera.updateMatrixWorld();
  const dest = v3(-1.96, 1.06, 1.45), q1 = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(dest, OJOS_TUMBADO, v3(-1, 0, 0))).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0)));
  await anim(reduced ? 1 : 800, e => { movilG.position.lerpVectors(m0, dest, e); movilG.position.y += Math.sin(e * Math.PI) * 0.08; movilG.quaternion.slerpQuaternions(q0, q1, e); }, curva.suave);
  { const a = anglesTo(OJOS_TUMBADO, dest), y0 = rig.foco.yaw, p0 = rig.foco.pitch, y1 = corto(y0, a.yaw); rig.foco.rate = 40; await anim(reduced ? 1 : 500, e => { rig.foco.yaw = lerp(y0, y1, e); rig.foco.pitch = lerp(p0, a.pitch, e); }, curva.suave); rig.foco.paralaje = 0.03; }
  cambia('cama');
  anuncia('Tumbado en la cama, con el móvil: la hora, lo nuevo de la web y una pausa de 5 minutos (clic en el círculo o Intro). Esc para levantarte.');
}
function sobreCirculo() { raycaster.setFromCamera(ndc, camera); const h = raycaster.intersectObject(movilPantalla)[0]; return !!(h && h.uv && h.uv.y < 0.3); }
function alternaPausa() { movil.pausaFin = movil.pausaFin > Date.now() ? 0 : Date.now() + 300000; dibujaMovil(0); anuncia(movil.pausaFin ? 'Pausa de 5 minutos: el móvil vibrará al acabar.' : 'Pausa parada.'); }
modo('cama', {
  punto: () => (sobreCirculo() ? ['mano', 'Pausa de 5 minutos'] : ['punto']),
  move() { actualizaPunto(); }, up() { if (sobreCirculo()) alternaPausa(); },
  tecla(e) { if (e.key === 'Enter' || e.key === 'e' || e.key === 'E' || e.key === ' ') { alternaPausa(); return true; } return false; },
  async esc() {
    cambia('ocupado'); movil.abierto = false;
    const p0 = movilG.position.clone(), q0 = movilG.quaternion.clone(), m1 = v3(-2.18, MESITA.alto + 0.006, 0.32), q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0.5));
    anim(reduced ? 1 : 700, e => { movilG.position.lerpVectors(p0, m1, e); movilG.quaternion.slerpQuaternions(q0, q1, e); }, curva.suave).then(() => dibujaMovil(0));
    const fin = v3(PUNTOS.cama.pos[0], DE_PIE, PUNTOS.cama.pos[1]);
    rig.foco = { yaw: cam.yaw, pitch: cam.pitch, pos: OJOS_TUMBADO.clone(), fov: 62, rate: 8, paralaje: 0 };
    const y0 = cam.yaw;
    await anim(reduced ? 1 : 900, e => { rig.foco.pos.lerpVectors(OJOS_TUMBADO, OJOS_BORDE, curva.suave(e)); rig.foco.pitch = lerp(1.2, -0.1, e); });
    await anim(reduced ? 1 : 700, e => { rig.foco.pos.lerpVectors(OJOS_BORDE, fin, curva.suave(e)); rig.foco.yaw = lerp(y0, corto(y0, -Math.PI / 2), e); });
    jug.pos.copy(fin); jug.en = 'cama'; sueltaFoco(); cambia('libre'); devuelveFoco('cama');
  }
});
function corrMovil(t) {
  if (movil.pausaFin && Date.now() >= movil.pausaFin) {           // fin de la pausa: el móvil vibra y la luz del techo parpadea una vez
    movil.pausaFin = 0; movil.vibra = t;
    if (luzTecho.on) { const i0 = techo.intensity; anim(500, e => { techo.intensity = i0 * (0.4 + 0.6 * Math.abs(Math.cos(e * Math.PI))); }); }
    anuncia('Fin de la pausa.');
  }
  if (movil.vibra && t - movil.vibra < 900 && !reduced) movilCuerpo.position.x = Math.sin(t / 18) * 0.002; else movilCuerpo.position.x = 0;
  if (movil.abierto && t - movil.ult > 250) { movil.ult = t; dibujaMovil(t); }
}
registrar('cama', { nombre: 'Cama · tumbarse con el móvil', mallas: [camaG.children[1], camaG.userData.manta], lugar: 'cama', alcance: 0, alClic: () => acuestate() });
registrar('movil', { nombre: 'Móvil · lo nuevo de la web y una pausa', mallas: [movilCuerpo, movilPantalla], lugar: 'cama', alcance: 0, alClic: () => acuestate() });

/* ---------- la mochila: la agenda de lo que viene (E49) ---------- */
const hojaTex = texFrom(720, 960);
const hojaPlano = new THREE.Mesh(new THREE.PlaneGeometry(0.21, 0.28), new THREE.MeshBasicMaterial({ map: hojaTex, side: THREE.DoubleSide, toneMapped: false }));   // sin luz: se lee igual con la habitación a oscuras hojaPlano.visible = false; scene.add(hojaPlano);
function dibujaAgenda(c, w, h) {
  c.fillStyle = '#FBF8EF'; c.fillRect(0, 0, w, h);
  c.fillStyle = 'rgba(47,95,208,.14)'; for (let y = 150; y < h; y += 56) c.fillRect(40, y, w - 80, 2);
  c.fillStyle = '#C2362B'; c.fillRect(90, 0, 3, h);
  c.fillStyle = '#1E1B2E'; c.font = '600 54px ' + DISP; c.fillText('Agenda', 120, 96);
  c.fillStyle = '#5A566E'; c.font = '500 26px ' + BODY; c.fillText('lo que viene en la web y los exámenes', 120, 134);
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  AGENDA.forEach(([iso, t], i) => {
    const [y, m, d] = iso.split('-').map(Number), f = new Date(y, m - 1, d), pasado = f < hoy, dias = Math.round((f - hoy) / 86400000), yy = 196 + i * 56;
    c.fillStyle = pasado ? '#8E8AA3' : '#1E1B2E'; c.font = '700 40px ' + MANO; c.fillText(fechaCorta(iso), 110, yy);
    c.font = '700 38px ' + MANO; c.fillText(t, 240, yy);
    if (pasado) { c.strokeStyle = '#8E8AA3'; c.lineWidth = 2; c.beginPath(); c.moveTo(250, yy - 10); c.lineTo(250 + c.measureText(t).width, yy - 10); c.stroke(); }
    else if (dias <= 7) { c.fillStyle = '#C93F22'; c.font = '700 26px ' + MANO; c.fillText(dias === 0 ? '¡hoy!' : 'en ' + dias + ' d', w - 120, yy); }
  });
}
redibuja(hojaTex, dibujaAgenda);
async function abreMochila() {
  cambia('ocupado'); setHover(null);
  await miraA([-1.12, 0.65, 1.22], 450);
  await anim(reduced ? 1 : 450, e => { mochilaTapa.rotation.x = -1.9 * e; }, curva.retroceso);
  redibuja(hojaTex, dibujaAgenda);
  const p0 = mochilaG.localToWorld(v3(0, 0.1, 0)), dir = camera.getWorldDirection(new THREE.Vector3()), p1 = camera.position.clone().addScaledVector(dir, 0.3);
  hojaPlano.visible = true; hojaPlano.position.copy(p0); hojaPlano.quaternion.copy(camera.quaternion);
  await anim(reduced ? 1 : 700, e => { hojaPlano.position.lerpVectors(p0, p1, e); hojaPlano.position.y += Math.sin(e * Math.PI) * 0.1; hojaPlano.quaternion.copy(camera.quaternion); }, curva.suave);
  cambia('papel'); anuncia('La agenda de la mochila: ' + AGENDA.map(a => fechaCorta(a[0]) + ', ' + a[1]).join('. ') + '. Esc para guardarla.');
}
modo('papel', {
  punto: () => ['punto'],
  async esc() {
    cambia('ocupado'); const p0 = hojaPlano.position.clone(), p1 = mochilaG.localToWorld(v3(0, 0.1, 0));
    await anim(reduced ? 1 : 600, e => { hojaPlano.position.lerpVectors(p0, p1, e); hojaPlano.scale.setScalar(1 - 0.5 * e); }, curva.suave);
    hojaPlano.visible = false; hojaPlano.scale.setScalar(1);
    await anim(reduced ? 1 : 350, e => { mochilaTapa.rotation.x = -1.9 * (1 - e); }, curva.suave);
    sueltaFoco(); cambia('libre'); devuelveFoco('mochila');
  }
});
registrar('mochila', { nombre: 'Mochila · la agenda', mallas: [mochila, mochilaSolapa], lugar: 'cama', alcance: 0, alClic: () => abreMochila() });

/* ---------- el armario: abre sus puertas (E50); dentro, lo que se llenará con la personalización (v0.3) ---------- */
let armarioAbierto = 0;
function puertasArmario(abrir) { const a0 = armarioAbierto, a1 = abrir ? 1 : 0; armarioAbierto = a1; return anim(reduced ? 1 : (abrir ? 900 : 650), e => { const f = lerp(a0, a1, e); armarioPuertas.forEach(({ p, lado }, i) => { p.rotation.y = -lado * 1.75 * f * (i === 1 ? 0.0 + 1 : 1); }); }, abrir ? curva.retroceso : curva.suave); }
registrar('armario', { nombre: 'Armario · abrirlo', mallas: armarioPuertas.map(p => p.hoja), lugar: 'armario', alcance: 0, brilloK: 0.35, puntero: 'mano',
  alClic: async () => {
    cambia('ocupado'); setHover(null); mirarDesde = 'armario';
    puertasArmario(true);
    enfoca(v3(-1.87, 1.15, -0.9), v3(-1.75, 1.55, -0.05), 58, { paralaje: 0.03, rate: 3.5 });
    await espera(reduced ? 0 : 700);
    modos.mirar.extra = { alSalir: () => puertasArmario(false) };
    cambia('mirar'); anuncia('El armario abierto: ropa colgada y una caja de personalización, que se llenará con los logros en la v0.3. Esc para cerrarlo.');
  } });

/* ---------- el rincón de juegos (E55): la tele se enciende con un «próximamente» ---------- */
const tele = { on: false, ult: 0 };
function dibujaTele(t) {
  const c = teleTex.userData.g, w = 960, h = 544;
  if (!tele.on) { c.fillStyle = '#07060C'; c.fillRect(0, 0, w, h); const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, 'rgba(201,197,220,.06)'); g.addColorStop(1, 'rgba(201,197,220,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); teleTex.needsUpdate = true; return; }
  c.fillStyle = '#141221'; c.fillRect(0, 0, w, h);
  // una serpiente de píxeles que da vueltas (el primer juego llegará en la v0.3, E25)
  const cel = 32, cols = 30, filas = 17, n = reduced ? 0 : Math.floor(t / 140);
  c.fillStyle = 'rgba(169,158,245,.05)'; for (let i = 0; i < cols; i++) for (let j = 0; j < filas; j++) c.fillRect(i * cel + 1, j * cel + 1, cel - 2, cel - 2);
  const per = 2 * (cols - 4) + 2 * (filas - 4), pos = k => { k = ((k % per) + per) % per; if (k < cols - 4) return [2 + k, 2]; k -= cols - 4; if (k < filas - 4) return [cols - 2, 2 + k]; k -= filas - 4; if (k < cols - 4) return [cols - 2 - k, filas - 2]; k -= cols - 4; return [2, filas - 2 - k]; };
  for (let k = 0; k < 9; k++) { const [i, j] = pos(n - k); c.fillStyle = k ? 'rgba(91,211,154,' + (1 - k / 10) + ')' : '#5BD39A'; c.fillRect(i * cel + 3, j * cel + 3, cel - 6, cel - 6); }
  const [mi, mj] = pos(n + 14); c.fillStyle = '#FF6B4A'; c.fillRect(mi * cel + 8, mj * cel + 8, cel - 16, cel - 16);
  c.fillStyle = 'rgba(20,18,33,.86)'; rr(c, 180, 170, 600, 210, 24); c.fill();
  dibujaIcono(c, 'mando', 210, 200, 70, '#A99EF5', 2);
  c.fillStyle = '#FAFAF7'; c.font = '600 46px ' + DISP; c.fillText('Rincón de juegos', 300, 240);
  c.fillStyle = '#C9C5DC'; c.font = '500 26px ' + BODY; c.fillText('Próximamente: el primer juego (v0.3),', 214, 310); c.fillText('que se jugará aquí y en el PC.', 214, 346);
  teleTex.needsUpdate = true;
}
dibujaTele(0);
function enciendeTele(on) { tele.on = on; consolaLed.material.emissiveIntensity = on ? 2 : 0; anim(reduced ? 1 : 400, e => { teleLuz.intensity = (on ? e : 1 - e) * 0.9; }); dibujaTele(performance.now()); }
async function verTele() {
  cambia('ocupado'); setHover(null); mirarDesde = 'tele';
  if (!tele.on) enciendeTele(true);
  enfoca(v3(1.02, 1.4, 2.45), v3(-0.05, 1.5, 2.45), 50, { paralaje: 0.03, rate: 3.5 });
  await espera(reduced ? 0 : 450);
  modos.mirar.extra = { alSalir: () => enciendeTele(false) };
  cambia('mirar'); anuncia('La tele del rincón de juegos: próximamente, el primer juego (llega en la v0.3). Esc para apagarla.');
}
registrar('tele', { nombre: 'Tele · rincón de juegos', mallas: [teleMarco, telePantalla], lugar: 'tele', alcance: 0, alClic: () => verTele() });
registrar('mando', { nombre: 'Mando de la consola', mallas: [mandoCuerpo, consolaCuerpo], lugar: 'tele', alcance: 0, alClic: () => verTele() });
function corrTele(t) { if (tele.on && t - tele.ult > 70) { tele.ult = t; dibujaTele(t); } }

/* ---------- la luz de techo y su interruptor junto a la puerta ---------- */
const luzTecho = { on: true };
function alternaLuzTecho() {
  luzTecho.on = !luzTecho.on; const on = luzTecho.on, i0 = techo.intensity;
  anim(160, e => { teclaPared.rotation.x = (on ? -1 : 1) * 0.2 * (1 - e) + (on ? 0.0 : 0.0); }, curva.retroceso);
  anim(reduced ? 1 : 420, e => { techo.intensity = lerp(i0, on ? 1.3 : 0, e); telaTecho.material.emissiveIntensity = lerp(on ? 0 : 0.35, on ? 0.35 : 0, e); bombillaTecho.material.emissiveIntensity = on ? 2 * e : 2 * (1 - e); }, curva.suave);
  hemi.intensity += on ? 0.25 : -0.25;
  anuncia(on ? 'Luz de techo encendida.' : 'Luz de techo apagada.');
}
telaTecho.material.emissiveIntensity = 0.35;
registrar('interruptor', { nombre: 'Interruptor de la luz de techo', mallas: [interruptorPared, teclaPared], lugar: 'puerta', alcance: 1.8, alClic: () => alternaLuzTecho() });
registrar('luz-techo', { nombre: 'Luz de techo (su interruptor está junto a la puerta)', mallas: [telaTecho], lugar: 'puerta', alcance: 0, alClic: () => alternaLuzTecho() });

/* ---------- la ventana y el estor (E49): el estor baja y sube; oscurece el cuarto de día ---------- */
function estor(bajar) {
  const s0 = estorTela.scale.y, s1 = bajar ? VENTANA.y1 - VENTANA.y0 + 0.12 : 0.06, e0 = ventanaEstado.estor;
  return anim(reduced ? 1 : 1400, e => { estorTela.scale.y = lerp(s0, s1, e); estorBarra.position.y = VENTANA.y1 + 0.04 - estorTela.scale.y; ventanaEstado.estor = lerp(e0, bajar ? 1 : 0, e); ventanaEstado.minuto = -1; }, curva.suave);
}
registrar('estor', { nombre: 'Estor · bajar o subir', mallas: [estorCaja, estorTela, estorBarra], lugar: 'cualquiera', alClic: () => { const bajar = ventanaEstado.estor < 0.5; estor(bajar); anuncia(bajar ? 'Bajas el estor.' : 'Subes el estor.'); } });
registraMirar('ventana', 'Ventana · hora de Canarias', [cristal], v3(0, 1.55, -1.6), v3(-0.3, 1.58, 0.1), 52,
  'La ventana. Fuera, el barrio en 3D a la hora de Canarias: palomas, nubes, ropa tendida, la montaña con sus coches. Esc para volver.', { lugar: 'ventana', alcance: 0 });

/* ---------- el reloj: cambiar la hora (E52) ----------
   Arrastrar alrededor del reloj gira la aguja de los minutos (una vuelta = una hora); la rueda, de 15 en 15
   minutos; doble clic, la hora real (las agujas giran hasta ella). Se guarda en el navegador. Teclado: ← → y R. */
const relojMano = { activo: false, ang: 0, ultClic: 0 };
function anguloEnReloj() {
  const c = aPantalla(relojG.getWorldPosition(new THREE.Vector3())), x = (ndc.x + 1) / 2, y = (1 - ndc.y) / 2;
  return Math.atan2((x - c[0]) * camera.aspect, -(y - c[1]));   // 0 arriba (las 12), crece en el sentido de las agujas
}
function sumaMinutos(m) { ponHora(ahoraCanarias().h + m / 60); anuncia('Las ' + horaTexto() + ' (' + momentoDelDia(ahoraCanarias().h) + '). Doble clic en el reloj o R: la hora real.'); }
const relojExtra = {
  punto: () => ['girar', HORA_FORZADA !== null ? 'Hora puesta · doble clic: real' : 'Arrastra las agujas'],
  down() {
    const t = performance.now();
    if (t - relojMano.ultClic < 380) { ponHora(null); anuncia('Vuelve la hora real de Canarias: las ' + horaTexto() + '.'); relojMano.ultClic = 0; return; }
    relojMano.ultClic = t; relojMano.activo = true; relojMano.ang = anguloEnReloj();
  },
  move() {
    if (!relojMano.activo) return;
    const a = anguloEnReloj(); let d = a - relojMano.ang; d -= Math.round(d / (2 * Math.PI)) * 2 * Math.PI;
    if (Math.abs(d) > 0.002) { ponHora(ahoraCanarias().h + d / (2 * Math.PI)); relojMano.ang = a; }
  },
  up() { if (relojMano.activo && HORA_FORZADA !== null) anuncia('Las ' + horaTexto() + '. Doble clic: la hora real.'); relojMano.activo = false; },
  wheel(e) { sumaMinutos(e.deltaY < 0 ? 15 : -15); },
  tecla(e) {
    if (e.key === 'ArrowRight' || e.key === '+') { sumaMinutos(15); return true; }
    if (e.key === 'ArrowLeft' || e.key === '-') { sumaMinutos(-15); return true; }
    if (e.key === 'r' || e.key === 'R') { ponHora(null); anuncia('La hora real de Canarias: las ' + horaTexto() + '.'); return true; }
    return false;
  }
};
registrar('reloj', { nombre: 'Reloj · cambiar la hora', mallas: [esfera, relojCaja], puntero: 'lupa', brilloK: 0.35, lugar: 'cualquiera',
  alClic: () => {
    mirarDesde = 'reloj'; const desde = ojos().lerp(v3(RELOJ.x, RELOJ.y, RELOJ.z), 0.35);
    miraDeCerca(v3(RELOJ.x, RELOJ.y, RELOJ.z), desde, 32, 'El reloj marca las ' + horaTexto() + (HORA_FORZADA !== null ? ' (hora puesta por ti)' : ' en Canarias') + '. Arrastra alrededor para mover las agujas, rueda: 15 minutos, doble clic o R: la hora real. Esc para volver.');
    modos.mirar.extra = relojExtra;
  } });

/* ---------- lo que se mira de cerca: corcho, póster, trofeos ---------- */
registraMirar('corcho', 'Corcho · la historia de la web', [corchoMesh, corchoMarco], v3(SALA.x0, CORCHO_POS.y, CORCHO_POS.z), v3(-1.45, 1.45, 0.05), 50,
  'El corcho, con la historia de la web en fotos y entradas: ' + CORCHO.map(c => c.t + ', ' + c.s).join('. ') + '. Aquí irán los logros en la v0.3. Esc para volver.', { lugar: 'corcho', alcance: 0 });
registraMirar('poster', 'Póster de la ciudad', [posterMesh, marcoPoster], v3(SALA.x0, POSTER.y, POSTER.z), v3(-0.6, 1.55, 1.4), 52,
  'El póster: una calle de ciudad en blanco y negro con un autobús rojo, y la camiseta amarilla colgada delante. Esc para volver.', { lugar: 'cama', alcance: 0 });
registraMirar('trofeos', 'Estantería de trofeos (v0.3)', peanas, v3(-2.0, 1.65, FONDO), v3(-1.3, 1.5, 2.3), 50,
  'La estantería de trofeos, vacía de momento: los logros llegan en la v0.3. Esc para volver.', { lugar: 'sillon', alcance: 2.2 });

/* ---------- la torre: los ventiladores giran despacio ---------- */
function corrTorre(dt) { if (!reduced) ventiladores.forEach((v, i) => { v.rotation.z += dt * (1.2 + i * 0.3); }); }
window.__slJug = () => ({ sentado: jug.sentado, en: jug.en, pos: jug.pos.toArray().map(v => +v.toFixed(3)), sillon: enSillon.si, silla: +silla.position.z.toFixed(3) });
window.__slCamino = (a, b) => camino(a, b).map(p => p.map(v => +v.toFixed(2)));
window.__slIrA = n => irA(n);
window.__slLibre = (x, z) => esLibre(x, z);
window.__slEmpuja = (x, z) => empujaFuera(x, z).map(v => +v.toFixed(3));
