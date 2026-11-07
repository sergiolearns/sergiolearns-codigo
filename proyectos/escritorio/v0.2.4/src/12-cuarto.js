/* ===================== 12 · el cuarto: caminar y que todo sirva (E48-E52, E55, E56) =====================
   «El cuarto de Sergio» (E57). Se recorre:
   · Clic en un sitio (un mueble): se camina hasta él por el camino más corto (A* en una rejilla de 5 cm, tensado) y,
     en el último tramo, la vista ya va girando hacia el mueble (v0.2.3: antes se paraba y después giraba).
   · WASD: caminar libre. Colisiones: un círculo (la persona, 0,22 m) contra rectángulos (los muebles) y la silla.
     v0.2.3: el suelo es el cuarto MÁS el pasillo de la entrada (una unión de dos rectángulos).
   · Esc solo SALE de algo (v0.2.3, E56-22): de la silla, de la cama, del sillón, de lo que tienes en la mano o de lo que
     miras de cerca. Nunca te lleva a la silla: ir a un sitio es siempre un clic (o WASD).
   · Mirar de cerca (E56-23): si desde donde estás se ve bien, se mira desde ahí; solo se camina si hace falta.
   Fragmentos F1 (colisiones) y F2 (A*) en material/v0.2.2/fragmentos.md; lo nuevo, en material/v0.2.3/fragmentos.md. */

const tramo = (e, a, b) => clamp((e - a) / (b - a), 0, 1);   // la parte de una animación entre a y b, de 0 a 1

/* ---------- colisiones: un círculo contra rectángulos, dentro del cuarto o del pasillo ---------- */
const sillaTapada = { x: 0, z: 0.3, r: 0.28 };            // la silla, metida bajo la mesa, cuando estás de pie
function dentroZonas(x, z) {
  // el punto de las zonas libres más cercano a (x, z): si está dentro de alguna, él mismo
  let mejor = null, dm = Infinity;
  for (const [a, b, c, d] of ZONAS_LIBRES) { const qx = clamp(x, a, b), qz = clamp(z, c, d), dd = (qx - x) ** 2 + (qz - z) ** 2; if (dd < dm) { dm = dd; mejor = [qx, qz]; } }
  return mejor;
}
function empujaFuera(x, z) {
  // Para cada rectángulo: el punto del rectángulo más cercano al centro, q = (clamp(x, x0, x1), clamp(z, z0, z1)).
  // Si |c − q| < R, se empuja el centro a lo largo de (c − q) lo que falta hasta R. Si el centro está dentro
  // (|c − q| = 0), se sale por el lado más cercano. Tres pasadas bastan para las esquinas entre dos muebles.
  const R = RADIO_PERSONA;
  for (let k = 0; k < 3; k++) {
    [x, z] = dentroZonas(x, z);
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
  if (!ZONAS_LIBRES.some(([a, b, c, d]) => x >= a && x <= b && z >= c && z <= d)) return false;
  for (const [, x0, x1, z0, z1] of OBSTACULOS) if (Math.hypot(x - clamp(x, x0, x1), z - clamp(z, z0, z1)) < R) return false;
  return Math.hypot(x - sillaTapada.x, z - sillaTapada.z) >= R + sillaTapada.r;
}

/* ---------- A* en una rejilla de 5 cm (la misma cuenta que scripts/plano.py), sobre el cuarto y el pasillo ---------- */
const REJ = { h: 0.05, x0: SALA.x0, z0: SALA.z0 };
REJ.nx = Math.round((SALA.x1 - SALA.x0) / REJ.h); REJ.nz = Math.round((PASILLO.z1 - SALA.z0) / REJ.h);
REJ.libre = new Uint8Array(REJ.nx * REJ.nz);
for (let j = 0; j < REJ.nz; j++) for (let i = 0; i < REJ.nx; i++) REJ.libre[j * REJ.nx + i] = esLibre(REJ.x0 + (i + 0.5) * REJ.h, REJ.z0 + (j + 0.5) * REJ.h) ? 1 : 0;
const celda = (x, z) => [clamp(Math.floor((x - REJ.x0) / REJ.h), 0, REJ.nx - 1), clamp(Math.floor((z - REJ.z0) / REJ.h), 0, REJ.nz - 1)];
const centroCelda = (i, j) => [REJ.x0 + (i + 0.5) * REJ.h, REJ.z0 + (j + 0.5) * REJ.h];
function rectaLibre(a, b) { const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.02)); for (let k = 0; k <= n; k++) if (!esLibre(a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n)) return false; return true; }
function camino(a, b) {
  // f(n) = g(n) + h(n): g = lo andado (1 en recto, √2 en diagonal), h = la distancia en línea recta hasta el final.
  const [ai, aj] = celda(...a), [bi, bj] = celda(...b), N = REJ.nx * REJ.nz, A = aj * REJ.nx + ai, B = bj * REJ.nx + bi;
  const g = new Float32Array(N).fill(Infinity), padre = new Int32Array(N).fill(-1), cerrado = new Uint8Array(N), abiertos = [[0, A]];
  g[A] = 0;
  while (abiertos.length) {
    let mi = 0; for (let k = 1; k < abiertos.length; k++) if (abiertos[k][0] < abiertos[mi][0]) mi = k;
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
  for (let i = 0; i < pts.length - 1;) { let j = pts.length - 1; while (j > i + 1 && !rectaLibre(pts[i], pts[j])) j--; tenso.push(pts[j]); i = j; }
  return tenso;
}
// el punto libre más cercano a (x, z) (para ir a mirar algo de cerca: delante de la cosa, donde se pueda estar)
function libreCerca(x, z) {
  if (esLibre(x, z)) return [x, z];
  for (let r = 0.05; r < 1.5; r += 0.05) for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2, px = x + Math.cos(a) * r, pz = z + Math.sin(a) * r; if (esLibre(px, pz)) return [px, pz]; }
  return [jug.pos.x, jug.pos.z];
}

/* ---------- caminar hasta un punto (con un clic) ---------- */
const caminar = { activo: false, teclas: new Set(), vel: 1.35, correr: false };
function angulo(a) { return Math.atan2(-a[0], -a[1]); }       // rumbo de la cámara para mirar en la dirección (dx, dz)
function corto(desde, hasta) { let d = hasta - desde; d -= Math.round(d / (2 * Math.PI)) * 2 * Math.PI; return desde + d; }
// v0.2.3 (E56-24): un solo movimiento. Durante el camino la vista sigue la dirección del paso y, en el último 35 %,
// se va girando hacia lo que se quiere mirar (mira = [x, y, z]); antes se paraba y después giraba
async function caminaHasta(dest, mira = null) {
  const a = [jug.pos.x, jug.pos.z], ruta = camino(a, dest);
  let largo = 0; for (let i = 1; i < ruta.length; i++) largo += Math.hypot(ruta[i][0] - ruta[i - 1][0], ruta[i][1] - ruta[i - 1][1]);
  const final = mira ? anglesTo(v3(dest[0], DE_PIE, dest[1]), v3(...mira)) : null;
  if (largo < 0.03) { if (final) await miraA(mira, 450); return; }
  caminar.activo = true;
  rig.foco = { yaw: cam.yaw, pitch: cam.pitch, pos: jug.pos.clone(), fov: 62, rate: 9, paralaje: 0 };
  const dur = reduced ? 1 : largo / caminar.vel * 1000 + 300;
  const enS = s => { let r = s * largo; for (let i = 1; i < ruta.length; i++) { const l = Math.hypot(ruta[i][0] - ruta[i - 1][0], ruta[i][1] - ruta[i - 1][1]); if (r <= l || i === ruta.length - 1) { const f = l ? clamp(r / l, 0, 1) : 1; return [lerp(ruta[i - 1][0], ruta[i][0], f), lerp(ruta[i - 1][1], ruta[i][1], f)]; } r -= l; } };
  let yPaso = cam.yaw;
  await anim(dur, e => {
    const [x, z] = enS(e), [x2, z2] = enS(Math.min(1, e + 0.06));
    jug.pos.set(x, DE_PIE + (reduced ? 0 : Math.sin(e * largo * 7) * 0.01 * (1 - tramo(e, 0.85, 1))), z); rig.foco.pos.copy(jug.pos);   // el paso: los ojos suben y bajan un centímetro
    if (Math.hypot(x2 - x, z2 - z) > 1e-3) yPaso = corto(yPaso, angulo([x2 - x, z2 - z]));
    const f = final ? curva.suave(tramo(e, 0.65, 1)) : 0;
    rig.foco.yaw = final ? lerp(yPaso, corto(yPaso, final.yaw), f) : yPaso;
    rig.foco.pitch = final ? lerp(-0.08, final.pitch, f) : -0.08;
  }, curva.suave);
  jug.pos.y = DE_PIE; caminar.activo = false;
  if (final) { cam.yaw = rig.foco.yaw; cam.pitch = rig.foco.pitch; }
}
// girar hacia un punto con una animación por tiempo (no por fotogramas: con pocos fps también llega entera)
function miraA(p, dur = 650) {
  const a = anglesTo(ojos(), v3(...p)), y0 = cam.yaw, p0 = cam.pitch, y1 = corto(cam.yaw, a.yaw);
  rig.foco = { yaw: y0, pitch: p0, pos: ojos(), fov: 62, rate: 40, paralaje: 0 };
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
  await caminaHasta(P.pos, P.mira);
  jug.en = n; sueltaFoco(); cambia('libre');
  return true;
}
// lo de la mesa, de pie (E56-17): si no llegas, vas al lado de la mesa más cercano a lo que quieres coger (no te sientas)
async function irALaMesa(c) {
  if (jug.sentado) return true;
  const izq = Math.hypot(c.x - PUNTOS.ventana.pos[0], c.z - PUNTOS.ventana.pos[1]), der = Math.hypot(c.x - PUNTOS.estanteria.pos[0], c.z - PUNTOS.estanteria.pos[1]);
  const n = izq < der ? 'ventana' : 'estanteria';
  cambia('ocupado'); setHover(null);
  if (enSillon.si) await levantaDelSillon();
  anuncia('Vas a la mesa, de pie.');
  await caminaHasta(PUNTOS[n].pos, [c.x, c.y, c.z]);
  jug.en = 'mesa-' + n; sueltaFoco(); cambia('libre'); return true;
}

/* ---------- levantarse de la silla y sentarse: un solo movimiento cada uno (E44, E56-24) ---------- */
async function levantate() {
  if (!jug.sentado) return;
  const p0 = BASE.clone(), p1 = v3(0, DE_PIE, 0.95);
  jug.sentado = false; jug.en = null; jug.pos.copy(p0);
  rig.foco = { yaw: cam.yaw, pitch: cam.pitch, pos: p0.clone(), fov: 62, rate: 10, paralaje: 0 };
  const yaw0 = sillaGiro.rotation.y, pi0 = cam.pitch;
  await anim(reduced ? 1 : 1150, e => {
    // te echas un poco adelante, te levantas y das un paso atrás; la silla rueda hacia atrás y la metes bajo la mesa
    const s = curva.suave(e);
    rig.foco.pos.set(0, lerp(p0.y, p1.y, curva.suave(tramo(e, 0, 0.7))), lerp(p0.z, p1.z, s) - Math.sin(Math.PI * tramo(e, 0, 0.5)) * 0.05); jug.pos.copy(rig.foco.pos);
    silla.position.z = e < 0.5 ? lerp(0.45, 0.72, curva.sale(tramo(e, 0, 0.5))) : lerp(0.72, sillaTapada.z, curva.suave(tramo(e, 0.55, 1)));
    sillaGiro.rotation.y = lerp(yaw0, 0, curva.suave(tramo(e, 0.4, 1)));
    rig.foco.pitch = lerp(pi0, -0.1, s);
  });
  jug.pos.copy(p1); sueltaFoco();
  anuncia('De pie. Camina con W, A, S y D, o haz clic en un mueble. Para sentarte, clic en la silla.');
}
async function sientate() {
  if (jug.sentado) return;
  const vuelta = gesto.estado; cambia('ocupado'); setHover(null);
  if (enSillon.si) await levantaDelSillon();
  await caminaHasta([0, 0.95], [0, 1.0, -1.2]);
  const p0 = jug.pos.clone(), y0 = cam.yaw, yaw1 = corto(cam.yaw, 0), pi0 = cam.pitch;
  rig.foco = { yaw: y0, pitch: pi0, pos: p0.clone(), fov: 62, rate: 10, paralaje: 0 };
  await anim(reduced ? 1 : 1150, e => {
    // sacas la silla, la giras hacia ti y te sientas mientras la acercas a la mesa
    silla.position.z = e < 0.4 ? lerp(sillaTapada.z, 0.7, curva.suave(tramo(e, 0, 0.4))) : lerp(0.7, 0.45, curva.suave(tramo(e, 0.45, 1)));
    rig.foco.yaw = lerp(y0, yaw1, curva.suave(tramo(e, 0, 0.45)));
    rig.foco.pos.lerpVectors(p0, BASE, curva.suave(tramo(e, 0.2, 1)));
    rig.foco.pitch = lerp(pi0, -0.12, curva.suave(e));
  });
  jug.sentado = true; jug.en = 'silla'; jug.pos.copy(BASE); sueltaFoco(); rig.rumbo = yaw1;
  cambia(vuelta === 'ocupado' ? 'ocupado' : 'libre');
}
registrar('silla', { nombre: 'Silla · sentarse a la mesa', mallas: sillaGiro.children.slice(0, 2), lugar: 'cualquiera', activo: () => gesto.estado === 'libre' && !jug.sentado,
  alClic: async () => { await sientate(); cambia('libre'); anuncia('Sentado a la mesa. Esc para levantarte.'); } });

/* ---------- caminar libre con WASD ---------- */
function corrMovimiento(dt) {
  const T = caminar.teclas; if (!T.size || gesto.estado !== 'libre' || caminar.activo) return;
  if (jug.sentado) { if (T.has('w') || T.has('s')) { cambia('ocupado'); levantate().then(() => cambia('libre')); } return; }
  if (enSillon.si) { cambia('ocupado'); levantaDelSillon().then(() => cambia('libre')); return; }
  let f = (T.has('w') ? 1 : 0) - (T.has('s') ? 1 : 0), l = (T.has('d') ? 1 : 0) - (T.has('a') ? 1 : 0); if (!f && !l) return;
  const n = Math.hypot(f, l); f /= n; l /= n;
  const v = caminar.vel * (caminar.correr ? 1.7 : 1);              // v0.2.4: Mayús corre (2,3 m/s)
  const y = cam.yaw, vx = (-Math.sin(y) * f + Math.cos(y) * l) * v * dt, vz = (-Math.cos(y) * f - Math.sin(y) * l) * v * dt;
  const [x, z] = empujaFuera(jug.pos.x + vx, jug.pos.z + vz);
  jug.pos.x = x; jug.pos.z = z; jug.en = null;
  if (rig.foco && rig.foco.rate === 4) sueltaFoco();
}
function corrSilla() { if (jug.sentado) sillaGiro.rotation.y = cam.yaw; }

/* ---------- el sillón: sentarse a leer los libros de 2º (E49, E50) ---------- */
const enSillon = { si: false };
const OJOS_SILLON = v3(-1.8, 1.02, 3.0);
async function sientateEnSillon() {
  cambia('ocupado');
  const p0 = jug.pos.clone(); rig.foco = { yaw: cam.yaw, pitch: cam.pitch, pos: p0.clone(), fov: 62, rate: 9, paralaje: 0 };
  const y0 = cam.yaw, y1 = corto(cam.yaw, 0.2), pi0 = cam.pitch;   // mirando hacia la ventana, un poco hacia la mesita de los libros
  // te das la vuelta y te dejas caer: la curva «retroceso» baja un poco de más y se recoloca (el cojín cede)
  await anim(reduced ? 1 : 1300, e => { rig.foco.pos.lerpVectors(p0, OJOS_SILLON, curva.retroceso(tramo(e, 0.15, 1))); rig.foco.yaw = lerp(y0, y1, curva.suave(tramo(e, 0, 0.6))); rig.foco.pitch = lerp(pi0, -0.2, curva.suave(e)); });
  enSillon.si = true; jug.pos.copy(OJOS_SILLON); jug.en = 'sillon'; sueltaFoco(); cambia('libre');
  anuncia('En el sillón. A tu izquierda, en la mesita, los libros de 2º con su guía docente; detrás, la lámpara para leer. Esc para levantarte.');
}
async function levantaDelSillon() {
  if (!enSillon.si) return;
  const p0 = jug.pos.clone(), p1 = v3(PUNTOS.sillon.pos[0], DE_PIE, PUNTOS.sillon.pos[1]);
  rig.foco = { yaw: cam.yaw, pitch: cam.pitch, pos: p0.clone(), fov: 62, rate: 9, paralaje: 0 };
  const pi0 = cam.pitch;
  await anim(reduced ? 1 : 800, e => { const s = curva.suave(e); rig.foco.pos.set(lerp(p0.x, p1.x, s), lerp(p0.y, p1.y, curva.suave(tramo(e, 0, 0.75))), lerp(p0.z, p1.z, s)); rig.foco.pitch = lerp(pi0, -0.1, s); });
  enSillon.si = false; jug.pos.copy(p1); jug.en = 'sillon'; sueltaFoco();
}
registrar('sillon', { nombre: 'Sillón · sentarse a leer', mallas: sillonG.children.slice(0, 3), lugar: 'sillon', alcance: 0, activo: () => gesto.estado === 'libre' && !enSillon.si,
  alClic: () => sientateEnSillon() });

/* ---------- las lámparas: la lamparita de la mesita y la de pie del sillón (E56-14, pared del sillón) ---------- */
const lamparas = { mesita: { on: false, luz: luzMesita, pantalla: lamparitaPantalla, bombilla: lamparitaBombilla, max: 0.9 }, pie: { on: false, luz: luzLectura, pantalla: lamparaPiePantalla, bombilla: lamparaPieBombilla, max: 1.3 } };
function alternaLampara(k) {
  const L = lamparas[k]; L.on = !L.on; const on = L.on, i0 = L.luz.intensity;
  anim(reduced ? 1 : 260, e => { L.luz.intensity = lerp(i0, on ? L.max : 0, e); L.pantalla.material.emissiveIntensity = (on ? e : 1 - e) * 0.55; L.bombilla.material.emissiveIntensity = (on ? e : 1 - e) * 2.2; }, curva.sale);
  anuncia((k === 'mesita' ? 'Lamparita de la mesita ' : 'Lámpara de pie ') + (on ? 'encendida.' : 'apagada.'));
}
registrar('lamparita', { nombre: 'Lamparita de la mesita', mallas: [lamparitaBase, lamparitaPantalla], lugar: 'mesita', alcance: 1.6, alClic: () => alternaLampara('mesita') });
registrar('lampara-pie', { nombre: 'Lámpara de pie · para leer', mallas: [lamparaPiePantalla, lamparaPieG.children[1]], lugar: 'sillon', alcance: 1.9, alClic: () => alternaLampara('pie') });
// los dos interruptores de la pared junto a la cama: el izquierdo, la lamparita; el derecho, la luz de techo
registrar('interruptores-cama', { nombre: 'Interruptores: lamparita y luz de techo', mallas: [interruptoresCama, ...teclasCama], lugar: 'mesita', alcance: 1.7,
  alClic: (o, hit) => { const derecho = hit && hit.point ? hit.point.z > MESITA.z1 - 0.12 : false; const t = teclasCama[derecho ? 1 : 0]; anim(160, e => { t.rotation.z = 0.25 * Math.sin(Math.PI * e); }); if (derecho) alternaLuzTecho(); else alternaLampara('mesita'); } });

/* ---------- la hoja que viene a la vista: agenda, recuerdos, libreta y la tarjeta de la pista (E56-13, 15, 16) ----------
   Una sola «hoja» para todo lo que se lee de papel: sale de su sitio, vuela a la vista y vuelve con Esc. Sin luz propia
   (se lee igual con la habitación a oscuras). Cada papel puede traer sus gestos (la agenda pasa de semana y abre enlaces). */
const hojaTex = texFrom(720, 960);
const hojaPlano = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: hojaTex, side: THREE.DoubleSide, toneMapped: false }));
hojaPlano.visible = false; scene.add(hojaPlano);
const papel = { origen: null, extra: null, alVolver: null, clave: null, tam: [0.21, 0.28] };
async function abrePapel({ dibuja, origen, tam = [0.21, 0.28], extra = null, alVolver = null, clave = null, texto = '' }) {
  cambia('ocupado'); setHover(null);
  const [w, h] = tam, c = hojaTex.userData.canvas; c.width = Math.round(720 * (w > h ? w / h : 1)); c.height = Math.round(720 * (w > h ? 1 : h / w));
  hojaTex.userData.g = c.getContext('2d'); hojaTex.dispose();
  redibuja(hojaTex, dibuja);
  Object.assign(papel, { origen, extra, alVolver, clave, tam, dibuja });
  const p0 = origen(), dir = camera.getWorldDirection(new THREE.Vector3()), dist = 0.3 * Math.max(1, h / 0.28), p1 = camera.position.clone().addScaledVector(dir, dist);
  hojaPlano.visible = true; hojaPlano.position.copy(p0); hojaPlano.quaternion.copy(camera.quaternion); hojaPlano.scale.set(w * 0.2, h * 0.2, 1);
  await anim(reduced ? 1 : 650, e => { hojaPlano.position.lerpVectors(p0, p1, e); hojaPlano.position.y += Math.sin(e * Math.PI) * 0.08; hojaPlano.quaternion.copy(camera.quaternion); hojaPlano.scale.set(w * lerp(0.2, 1, e), h * lerp(0.2, 1, e), 1); }, curva.suave);
  cambia('papel'); anuncia(texto);
}
function rePapel() { redibuja(hojaTex, papel.dibuja); }
function papelBajo() { raycaster.setFromCamera(ndc, camera); const h = raycaster.intersectObject(hojaPlano)[0]; return h ? h.uv : null; }
modo('papel', {
  punto: () => (papel.extra && papel.extra.punto ? papel.extra.punto(papelBajo()) : ['punto']),
  move() { actualizaPunto(); },
  up() { if (papel.extra && papel.extra.clic) papel.extra.clic(papelBajo()); },
  wheel(e) { if (papel.extra && papel.extra.rueda) papel.extra.rueda(e); },
  tecla(e) { return !!(papel.extra && papel.extra.tecla && papel.extra.tecla(e)); },
  async esc() {
    cambia('ocupado'); const p0 = hojaPlano.position.clone(), p1 = papel.origen(), [w, h] = papel.tam;
    await anim(reduced ? 1 : 550, e => { hojaPlano.position.lerpVectors(p0, p1, e); hojaPlano.scale.set(w * lerp(1, 0.2, e), h * lerp(1, 0.2, e), 1); }, curva.suave);
    hojaPlano.visible = false;
    if (papel.alVolver) await papel.alVolver();
    sueltaFoco(); cambia('libre'); if (papel.clave) devuelveFoco(papel.clave);
  }
});

/* ---------- la agenda de la mochila: una semana por página (E56-15, decisión de Sergio) ----------
   Se abre en la semana de hoy; ← → (o la rueda, o un clic en las esquinas) pasan de semana, desde la anterior hasta la
   del examen de FP1. Un clic en una línea con «→» abre ese artículo en la web; solo llevan enlace los que ya han salido
   (lo programado no se enlaza: la regla A3 de la web). */
const DIA = 86400000;
function lunesDe(f) { const d = new Date(f.getFullYear(), f.getMonth(), f.getDate()); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d; }
function isoDe(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'], DIAS_L = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const agenda = { semana: 0, filas: [] };
function hoyCanarias() { const t = horaReal(); return new Date(t.y, t.m - 1, t.d); }
function semanasAgenda() {
  const ini = new Date(lunesDe(hoyCanarias()).getTime() - 7 * DIA), ult = lunesDe(new Date(2027, 0, 8)), n = Math.round((ult - ini) / (7 * DIA)) + 1;
  return { ini, n };
}
function dibujaAgenda(c, w, h) {
  const { ini, n } = semanasAgenda(), lunes = new Date(ini.getTime() + agenda.semana * 7 * DIA), hoy = isoDe(hoyCanarias());
  c.fillStyle = '#FBF8EF'; c.fillRect(0, 0, w, h);
  c.fillStyle = '#C2362B'; c.fillRect(92, 0, 3, h);
  const dom = new Date(lunes.getTime() + 6 * DIA);
  c.fillStyle = '#1E1B2E'; cabe(c, 'Semana del ' + lunes.getDate() + (lunes.getMonth() !== dom.getMonth() ? ' ' + MESES[lunes.getMonth()] : '') + ' al ' + dom.getDate() + ' ' + MESES[dom.getMonth()], 120, 90, w - 160, 46, '600', DISP);
  c.fillStyle = '#5A566E'; c.font = '500 24px ' + BODY; c.fillText('Lo que sale en la web y los exámenes · ' + (agenda.semana + 1) + ' de ' + n, 120, 128);
  agenda.filas = [];
  for (let d = 0; d < 7; d++) {
    const f = new Date(lunes.getTime() + d * DIA), iso = isoDe(f), y0 = 170 + d * 104, items = AGENDA.filter(a => a[0] === iso);
    c.fillStyle = 'rgba(47,95,208,.16)'; c.fillRect(40, y0 + 100, w - 80, 2);
    if (iso === hoy) { c.fillStyle = 'rgba(255,107,74,.12)'; c.fillRect(40, y0 + 4, w - 80, 96); }
    c.fillStyle = iso === hoy ? '#C2362B' : '#5A566E'; c.font = '700 40px ' + MANO; c.fillText(DIAS_L[d] + ' ' + f.getDate(), 112, y0 + 60);
    items.slice(0, 2).forEach(([, t, url], k) => {
      const conEnlace = !!url && publicado(iso), y = y0 + (items.length > 1 ? 44 + k * 42 : 62);
      c.fillStyle = conEnlace ? '#4638B8' : (iso < hoy ? '#8E8AA3' : '#1E1B2E');
      cabe(c, t + (conEnlace ? '  →' : ''), 230, y, w - 280, 36, '700', MANO);
      agenda.filas.push({ y0: y - 36, y1: y + 8, url: conEnlace ? url : '', t });
    });
    if (!items.length) { c.fillStyle = 'rgba(142,138,163,.5)'; c.font = '600 30px ' + MANO; c.fillText('—', 230, y0 + 62); }
  }
  c.fillStyle = '#8E8AA3'; c.font = '500 22px ' + BODY; c.textAlign = 'center';
  c.fillText((agenda.semana > 0 ? '← ' : '') + 'otra semana: flechas o clic en las esquinas' + (agenda.semana < n - 1 ? ' →' : ''), w / 2, h - 30); c.textAlign = 'left';
}
function agendaFila(uv) { if (!uv) return null; const y = (1 - uv.y) * hojaTex.userData.canvas.height; return agenda.filas.find(f => y >= f.y0 && y <= f.y1) || null; }
function agendaPasa(d) {
  const { n } = semanasAgenda(), s = clamp(agenda.semana + d, 0, n - 1); if (s === agenda.semana) return;
  agenda.semana = s; rePapel();
  const q0 = hojaPlano.quaternion.clone(); if (!reduced) anim(260, e => { hojaPlano.quaternion.copy(q0).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.sin(Math.PI * e) * 0.25 * -d, 0))); }, curva.suave);
  const { ini } = semanasAgenda(), l = new Date(ini.getTime() + agenda.semana * 7 * DIA);
  anuncia('Semana del ' + l.getDate() + ' de ' + MESES[l.getMonth()] + ': ' + (AGENDA.filter(a => { const f = new Date(a[0] + 'T00:00'); return f >= l && f < new Date(l.getTime() + 7 * DIA); }).map(a => fechaCorta(a[0]) + ', ' + a[1]).join('. ') || 'nada apuntado') + '.');
}
const agendaExtra = {
  punto: uv => { const f = agendaFila(uv); if (f && f.url) return ['enlace', 'Abrir en la web']; if (uv && (uv.x < 0.18 || uv.x > 0.82) && uv.y < 0.14) return ['pagina', 'Otra semana']; return ['punto']; },
  clic: uv => { const f = agendaFila(uv); if (f && f.url) { window.open(f.url, '_blank', 'noopener'); return; } if (uv && uv.y < 0.14) agendaPasa(uv.x < 0.5 ? -1 : 1); },
  rueda: e => agendaPasa(e.deltaY > 0 ? 1 : -1),
  tecla: e => { if (e.key === 'ArrowRight' || e.key === 'PageDown') { agendaPasa(1); return true; } if (e.key === 'ArrowLeft' || e.key === 'PageUp') { agendaPasa(-1); return true; } if (e.key === 'Enter') { const f = agenda.filas.find(x => x.url); if (f) window.open(f.url, '_blank', 'noopener'); return true; } return false; }
};
// v0.2.4 (E59-3): la agenda sale POR LA ABERTURA: se levanta la solapa, la agenda sube por arriba (sin atravesar la tela)
// y desde ahí vuela a la vista; al guardarla, vuelve a la agenda, baja dentro y la solapa se cierra
const AGENDA_FUERA = v3(0, 0.27, -0.06);
async function abreMochila() {
  cambia('ocupado'); setHover(null);
  await miraA([mochilaG.position.x, 0.65, mochilaG.position.z], 450);
  await anim(reduced ? 1 : 450, e => { mochilaTapa.rotation.x = -1.9 * e; }, curva.retroceso);
  await anim(reduced ? 1 : 420, e => { agendaG.position.lerpVectors(AGENDA_DENTRO, AGENDA_FUERA, e); agendaG.rotation.x = -0.5 * e; }, curva.sale);
  agenda.semana = 1; agendaG.visible = false;
  await abrePapel({ dibuja: dibujaAgenda, origen: () => mochilaG.localToWorld(AGENDA_FUERA.clone()), extra: agendaExtra, clave: 'mochila',
    alVolver: async () => { agendaG.visible = true; await anim(reduced ? 1 : 380, e => { agendaG.position.lerpVectors(AGENDA_FUERA, AGENDA_DENTRO, e); agendaG.rotation.x = -0.5 * (1 - e); }, curva.suave); await anim(reduced ? 1 : 350, e => { mochilaTapa.rotation.x = -1.9 * (1 - e); }, curva.suave); },
    texto: 'La agenda de la mochila, en la semana de hoy. Flechas: otra semana. Intro: abre lo que ya ha salido. Esc para guardarla.' });
}
registrar('mochila', { nombre: 'Mochila · la agenda', mallas: [mochila, mochilaSolapa], lugar: 'cama', alcance: 1.6, alClic: () => abreMochila() });

/* ---------- los cajones de la mesita: recuerdos de 1º y la libreta de ideas (decisión de Sergio, 5 nov) ---------- */
function dibujaRecuerdos(c, w, h) {
  c.fillStyle = '#FBF8EF'; c.fillRect(0, 0, w, h); c.fillStyle = '#C2362B'; c.fillRect(60, 64, 80, 8);
  c.fillStyle = '#1E1B2E'; c.font = '600 54px ' + DISP; c.fillText('Primero de GCID', 60, 140);
  c.fillStyle = '#5A566E'; cabe(c, 'Lo que salió de cada asignatura en la web', 60, 186, w - 120, 28, '500', BODY);
  LIBROS.filter(b => b.curso === 1).forEach((b, i) => {
    const y = 270 + i * 112;
    c.fillStyle = b.color; c.fillRect(60, y - 44, 10, 74);
    c.fillStyle = '#1E1B2E'; c.font = '600 40px ' + DISP; c.fillText(b.code, 92, y);
    c.fillStyle = '#2E2A42'; cabe(c, b.sub, 92, y + 36, w - 340, 28, '500', BODY);
    c.fillStyle = b.estado === 'Completa' ? '#16794B' : '#C2362B'; c.font = '600 28px ' + BODY; c.textAlign = 'right'; c.fillText(b.estado.toLowerCase(), w - 60, y); c.textAlign = 'left';
  });
  c.fillStyle = '#1E1B2E'; c.font = '600 32px ' + DISP; c.fillText('Artículos en la web', 60, 740);
  c.fillStyle = '#2E2A42'; cabe(c, CARPETAS.filter(f => f.n).map(f => f.nombre + ' ' + f.n).join(' · '), 60, 790, w - 120, 28, '500', BODY);
  c.fillStyle = '#4638B8'; c.font = '700 36px ' + MANO; c.fillText('El primer año, ya en la web.', 60, 880);
}
const IDEAS = [['oct', 'Un juez de ejercicios, como VPL (E17)'], ['3 nov', 'Mi escritorio en 3D, como FNAF (M14)'], ['3 nov', 'Discos = simulacros; USB = simuladores'],
  ['4 nov', 'Sergio Bot en el vapor de la taza'], ['4 nov', 'Una ventana con la hora de Canarias'], ['4 nov', 'Caminar por el cuarto'], ['5 nov', '«El cuarto de Sergio»: el nombre nuevo']];
function dibujaLibreta(c, w, h) {
  c.fillStyle = '#FBF8EF'; c.fillRect(0, 0, w, h);
  c.fillStyle = 'rgba(47,95,208,.14)'; for (let y = 200; y < h - 40; y += 86) c.fillRect(40, y + 22, w - 80, 2);
  c.fillStyle = '#C2362B'; c.fillRect(150, 0, 3, h);
  c.fillStyle = '#1E1B2E'; c.font = '600 50px ' + DISP; c.fillText('Libreta de ideas', 60, 100);
  c.fillStyle = '#5A566E'; c.font = '500 24px ' + BODY; c.fillText('lo que se me ocurre para la web, con su fecha', 60, 142);
  IDEAS.forEach(([f, t], i) => { const y = 214 + i * 86; c.fillStyle = '#C2362B'; c.font = '700 34px ' + MANO; c.fillText(f, 58, y); c.fillStyle = '#2E2A42'; cabe(c, t, 172, y, w - 210, 36, '700', MANO); });
}
// el contenido de cada cajón: una cajita de cartulinas (recuerdos) y la libreta
{
  const [c1, c2] = mesitaCajones;
  rbox(0.16, 0.05, 0.22, 0.006, mat(0xF7F1D9, { r: 0.8 }), 0, 0.025, 0, c1.cont); box(0.14, 0.004, 0.2, mat(0xFBF8EF, { r: 0.9 }), 0, 0.052, 0, c1.cont);
  rbox(0.15, 0.016, 0.21, 0.004, mat(0x4638B8, { r: 0.6 }), 0, 0.008, 0, c2.cont); box(0.14, 0.004, 0.012, mat(0xFF6B4A, { r: 0.6 }), 0, 0.017, 0.07, c2.cont);
}
const cajonMesita = [{ titulo: 'Recuerdos de 1º', dibuja: dibujaRecuerdos, texto: 'Recuerdos de 1º: FP1, FP2 e IC2, completas en la web; IC1, en curso.' },
                     { titulo: 'La libreta de ideas', dibuja: dibujaLibreta, texto: 'La libreta de ideas: ' + IDEAS.map(i => i[0] + ', ' + i[1]).join('. ') + '.' }];
function cajonMesitaMueve(i, abrir) { const C = mesitaCajones[i], a0 = C.abierto; C.abierto = abrir ? 1 : 0; return anim(reduced ? 1 : (abrir ? 520 : 420), e => { C.g.position.x = C.x0 + 0.27 * lerp(a0, C.abierto, e); }, abrir ? curva.retroceso : curva.suave); }
mesitaCajones.forEach((C, i) => {
  registrar('mesita-cajon-' + (i + 1), { nombre: 'Mesita · ' + (i ? 'cajón de abajo' : 'cajón de arriba'), mallas: [C.frente, C.tirador], puntero: 'mano', lugar: 'mesita', alcance: 1.6,
    alClic: async () => {
      if (C.abierto) { cajonMesitaMueve(i, false); return; }
      cambia('ocupado'); await cajonMesitaMueve(i, true);
      await abrePapel({ dibuja: cajonMesita[i].dibuja, extra: cajonMesita[i].extra || null, origen: () => C.cont.localToWorld(v3(0, 0.05, 0)), clave: 'mesita-cajon-' + (i + 1),
        alVolver: () => cajonMesitaMueve(i, false), texto: cajonMesita[i].texto + ' Esc para guardarlo.' });
    } });
});

/* ---------- el cajón de arriba de la mesa: la tarjeta de la pista se coge y se lee (E56-16) ---------- */
function dibujaPista(c, w, h) { const t = pistaTex.userData.canvas; c.drawImage(t, 0, 0, w, h); }
registrar('pista', { nombre: 'Tarjeta · una pista', mallas: [pistaCarta], lugar: 'mesa', activo: () => gesto.estado === 'libre' && cajonArribaM.obj > 0.1,
  alClic: () => abrePapel({ dibuja: dibujaPista, tam: [0.24, 0.15], origen: () => pistaCarta.getWorldPosition(new THREE.Vector3()), clave: 'cajon-arriba',
    texto: 'La tarjeta: «Pista. Lo que no se ve también está: busca en el PC». Cuenta para un logro en la v0.3. Esc para dejarla.' }) });

/* ---------- la cama y el móvil (E49 y la puerta de la versión móvil, E53) ---------- */
const movil = { ult: 0, vibra: 0, abierto: false, app: null, sel: 0, zonas: [], enMano: false };
const OJOS_BORDE = v3(-0.88, 0.98, 1.42), OJOS_TUMBADO = v3(-2.22, 0.8, 1.42), MOVIL_CARA = v3(-1.98, 1.06, 1.45);
// v0.2.4: el dibujo del móvil y sus apps están en 12-usos.js (dibujaMovil, telPunto, telClic, telTecla)
// v0.2.3 (E56-24): tumbarse en UN movimiento: una curva de Bézier de pie → borde de la cama → almohada; el giro y la
// mirada al techo se reparten por tramos que se solapan, y el móvil empieza a subir antes de que acabes de tumbarte
async function acuestate() {
  cambia('ocupado'); setHover(null);
  const p0 = jug.pos.clone(), y0 = cam.yaw, pi0 = cam.pitch, yB = corto(y0, -Math.PI / 2);
  rig.foco = { yaw: y0, pitch: pi0, pos: p0.clone(), fov: 62, rate: 10, paralaje: 0 };
  const _p = new THREE.Vector3();
  const subeMovil = (async () => {
    await espera(reduced ? 0 : 1350);
    movil.abierto = true; dibujaMovil(0);
    const m0 = movilG.position.clone(), q0 = movilG.quaternion.clone();
    const q1 = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(MOVIL_CARA, OJOS_TUMBADO, v3(-1, 0, 0))).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0)));
    await anim(reduced ? 1 : 900, e => { movilG.position.lerpVectors(m0, MOVIL_CARA, e); movilG.position.y += Math.sin(e * Math.PI) * 0.08; movilG.quaternion.slerpQuaternions(q0, q1, e); }, curva.suave);
  })();
  await anim(reduced ? 1 : 2100, e => {
    bezier2(p0, OJOS_BORDE, OJOS_TUMBADO, curva.suave(e), _p); rig.foco.pos.copy(_p);
    rig.foco.yaw = lerp(y0, yB, curva.suave(tramo(e, 0, 0.45)));
    rig.foco.pitch = e < 0.4 ? lerp(pi0, -0.15, curva.suave(tramo(e, 0, 0.4))) : lerp(-0.15, 1.15, curva.suave(tramo(e, 0.35, 1)));
  }, curva.lineal);
  await subeMovil;
  jug.pos.copy(OJOS_TUMBADO); jug.en = 'cama';
  { const a = anglesTo(OJOS_TUMBADO, MOVIL_CARA), y1 = rig.foco.yaw, p1 = rig.foco.pitch, y2 = corto(y1, a.yaw); rig.foco.rate = 30; await anim(reduced ? 1 : 450, e => { rig.foco.yaw = lerp(y1, y2, e); rig.foco.pitch = lerp(p1, a.pitch, e); }, curva.suave); rig.foco.paralaje = 0.03; }
  cambia('cama');
  movil.app = null; dibujaMovil(0);
  anuncia('Tumbado en la cama, con el móvil: Linterna, Cámara, Estudio, Web, Mapa y Ajustes. Flechas e Intro, o clic. Esc para levantarte.');
}
modo('cama', {
  // v0.2.4: tumbado, el móvil es el de siempre con sus apps (la pausa de 5 minutos ya no está: la sustituye Estudio)
  punto: () => telPunto(), move() { actualizaPunto(); }, up() { telClic(); },
  tecla(e) { return telTecla(e); },
  async esc() {
    // levantarse, también en un movimiento: almohada → borde → de pie, mientras el móvil vuelve a la mesita
    cambia('ocupado'); movil.abierto = false;
    const p0 = movilG.position.clone(), q0 = movilG.quaternion.clone(), q1 = new THREE.Quaternion().setFromEuler(MOVIL_CASA.rot);
    anim(reduced ? 1 : 700, e => { movilG.position.lerpVectors(p0, MOVIL_CASA.pos, e); movilG.quaternion.slerpQuaternions(q0, q1, e); }, curva.suave).then(() => dibujaMovil(0));
    const fin = v3(PUNTOS.cama.pos[0], DE_PIE, PUNTOS.cama.pos[1]), y0 = cam.yaw, pi0 = cam.pitch, _p = new THREE.Vector3();
    rig.foco = { yaw: y0, pitch: pi0, pos: OJOS_TUMBADO.clone(), fov: 62, rate: 10, paralaje: 0 };
    await anim(reduced ? 1 : 1700, e => {
      bezier2(OJOS_TUMBADO, OJOS_BORDE, fin, curva.suave(e), _p); rig.foco.pos.copy(_p);
      rig.foco.pitch = lerp(pi0, -0.1, curva.suave(tramo(e, 0, 0.6)));
      rig.foco.yaw = lerp(y0, corto(y0, -Math.PI / 2), curva.suave(tramo(e, 0.4, 1)));
    }, curva.lineal);
    jug.pos.copy(fin); jug.en = 'cama'; sueltaFoco(); cambia('libre'); devuelveFoco('cama');
  }
});
registrar('cama', { nombre: 'Cama · tumbarse con el móvil', mallas: [camaG.children[1], camaG.userData.manta], lugar: 'cama', alcance: 0, alClic: () => acuestate() });
registrar('movil', { nombre: 'Móvil · tecla M desde cualquier sitio', mallas: [movilCuerpo, movilPantalla], lugar: 'cualquiera', activo: () => gesto.estado === 'libre', alClic: () => sacaMovil() });

/* ---------- el armario: se abre la puerta que tocas (E56-12); el espejo refleja (E56-11) ---------- */
const SECCION = [{ mira: v3(-2.3, 1.25, -0.95), nombre: 'la barra con la ropa colgada' }, { mira: v3(-2.0, 1.25, -0.95), nombre: 'la ropa colgada y la doblada' }, { mira: v3(-1.66, 1.0, -0.95), nombre: 'las baldas y la caja de personalización' }];
// v0.2.4 (E59-6): la puerta de la izquierda se abría 100° y atravesaba la pared y el corcho. Ahora cada puerta tiene su
// tope: la de la izquierda, 77° (1,35 rad: su canto queda a 3,4 cm del corcho; cuenta en material/v0.2.4/fragmentos.md, F2);
// las otras dos, 100° (no tienen nada al lado). El retroceso de la curva no pasa del tope
const TOPE_PUERTA = [1.35, 1.75, 1.75];
function puertaArmario(i, abrir) { const P = armarioPuertas[i], a0 = P.abierta; P.abierta = abrir ? 1 : 0; return anim(reduced ? 1 : (abrir ? 850 : 600), e => { P.p.rotation.y = -P.lado * TOPE_PUERTA[i] * Math.min(1, lerp(a0, P.abierta, e)); }, abrir ? curva.retroceso : curva.suave); }
armarioPuertas.forEach((P, i) => {
  registrar(i === 1 ? 'armario' : 'armario-' + (i + 1), { nombre: 'Armario · ' + ['puerta de la izquierda', 'puerta del espejo', 'puerta de la derecha'][i], mallas: [P.hoja, P.tirador], lugar: 'armario', alcance: 1.7, brilloK: 0.35, puntero: 'mano',
    alClic: async () => {
      if (P.abierta) { puertaArmario(i, false); return; }
      cambia('ocupado'); setHover(null); mirarDesde = i === 1 ? 'armario' : 'armario-' + (i + 1);
      puertaArmario(i, true);
      enfoca(SECCION[i].mira, ojos(), 56, { paralaje: 0.03, rate: 3.5 });
      await espera(reduced ? 0 : 650);
      modos.mirar.extra = { alSalir: () => puertaArmario(i, false) };
      cambia('mirar'); anuncia('Abres la ' + ['puerta de la izquierda', 'puerta del espejo', 'puerta de la derecha'][i] + ' del armario: ' + SECCION[i].nombre + '. En la v0.3 aquí se guardará lo que personalices. Esc para cerrarla.');
    } });
});
// el espejo: un Reflector dibuja el cuarto otra vez desde el otro lado del cristal (365 llamadas más). Para que no
// cueste: a 256 × 512, solo si estás de pie a menos de 2,8 m y uno de cada dos fotogramas; si no, se queda con el
// último dibujo (al cargar se hace uno desde delante del armario, para que nunca salga negro)
const espejoEst = { n: 0, render: espejo.onBeforeRender, veces: 0 };
espejo.onBeforeRender = function (r, s, c) {
  if (c !== camera || !$('#os').hidden || jug.sentado) return;
  if (camera.position.distanceTo(espejo.getWorldPosition(_vEsp)) > 2.8 || (espejoEst.n++ % 2) !== 0) return;
  espejoEst.render.call(this, r, s, c); espejoEst.veces++;
};
function espejoInicial() {
  const p = camera.position.clone(), q = camera.quaternion.clone();
  camera.position.set(-2.05, 1.62, 0.3); camera.lookAt(-2.05, 1.2, -0.62); camera.updateMatrixWorld();
  try { espejoEst.render.call(espejo, renderer, scene, camera); } catch (e) { /* sin espejo: no pasa nada */ }
  camera.position.copy(p); camera.quaternion.copy(q); camera.updateMatrixWorld();
}
const _vEsp = new THREE.Vector3();

/* ---------- el rincón de juegos (E55): la tele se enciende con un «próximamente» ---------- */
const tele = { on: false, ult: 0 };
function dibujaTele(t) {
  const c = teleTex.userData.g, w = 960, h = 544;
  if (!tele.on) { c.fillStyle = '#07060C'; c.fillRect(0, 0, w, h); const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, 'rgba(201,197,220,.06)'); g.addColorStop(1, 'rgba(201,197,220,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); teleTex.needsUpdate = true; return; }
  c.fillStyle = '#141221'; c.fillRect(0, 0, w, h);
  const cel = 32, cols = 30, filas = 17, n = reduced ? 0 : Math.floor(t / 140);
  c.fillStyle = 'rgba(169,158,245,.05)'; for (let i = 0; i < cols; i++) for (let j = 0; j < filas; j++) c.fillRect(i * cel + 1, j * cel + 1, cel - 2, cel - 2);
  const per = 2 * (cols - 4) + 2 * (filas - 4), pos = k => { k = ((k % per) + per) % per; if (k < cols - 4) return [2 + k, 2]; k -= cols - 4; if (k < filas - 4) return [cols - 2, 2 + k]; k -= filas - 4; if (k < cols - 4) return [cols - 2 - k, filas - 2]; k -= cols - 4; return [2, filas - 2 - k]; };
  for (let k = 0; k < 9; k++) { const [i, j] = pos(n - k); c.fillStyle = k ? 'rgba(91,211,154,' + (1 - k / 10) + ')' : '#5BD39A'; c.fillRect(i * cel + 3, j * cel + 3, cel - 6, cel - 6); }
  const [mi, mj] = pos(n + 14); c.fillStyle = '#FF6B4A'; c.fillRect(mi * cel + 8, mj * cel + 8, cel - 16, cel - 16);
  c.fillStyle = 'rgba(20,18,33,.86)'; rr(c, 180, 170, 600, 210, 24); c.fill();
  dibujaIcono(c, 'mando', 210, 200, 70, '#A99EF5', 2);
  c.fillStyle = '#FAFAF7'; c.font = '600 46px ' + DISP; c.fillText('Rincón de juegos', 300, 240);
  c.fillStyle = '#C9C5DC'; c.font = '500 26px ' + BODY; c.fillText('Coge el mando para jugar a', 214, 310); c.fillText('«Caza de bugs».', 214, 346);
  teleTex.needsUpdate = true;
}
dibujaTele(0);
function enciendeTele(on) { tele.on = on; consolaLed.material.emissiveIntensity = on ? 2 : 0; anim(reduced ? 1 : 400, e => { teleLuz.intensity = (on ? e : 1 - e) * 0.9; }); if (!(on && JB.activo)) dibujaTele(performance.now()); }
async function verTele() {
  cambia('ocupado'); setHover(null); mirarDesde = 'tele';
  if (!tele.on) enciendeTele(true);
  const lejos = ojos().distanceTo(v3(1.02, 1.5, 2.8)) > 2.8;
  if (lejos || jug.sentado) { await irA('tele'); cambia('ocupado'); }
  enfoca(v3(1.02, 1.42, 2.8), ojos(), 50, { paralaje: 0.03, rate: 3.5 });
  await espera(reduced ? 0 : 450);
  modos.mirar.extra = { alSalir: () => enciendeTele(false) };
  cambia('mirar'); anuncia('La tele del rincón de juegos: próximamente, el primer juego (llega en la v0.3). Esc para apagarla.');
}
registrar('tele', { nombre: 'Tele · rincón de juegos', mallas: [teleMarco, telePantalla], lugar: 'cualquiera', alClic: () => verTele() });
registrar('mando', { nombre: 'PS5 Pro y sus mandos', mallas: [mandoBlanco.cuerpo, mandoNegro.cuerpo, consolaCuerpo], lugar: 'tele', alcance: 1.8, alClic: () => verTele() });
function corrTele(t) { if (tele.on && !JB.activo && t - tele.ult > 70) { tele.ult = t; dibujaTele(t); } }

/* ---------- la luz de techo y sus interruptores (junto al pasillo y junto a la cama) ---------- */
const luzTecho = { on: true };
function alternaLuzTecho() {
  luzTecho.on = !luzTecho.on; const on = luzTecho.on, i0 = techo.intensity;
  anim(160, e => { teclaPared.rotation.x = (on ? -1 : 1) * 0.2 * Math.sin(Math.PI * e); });
  anim(reduced ? 1 : 420, e => { techo.intensity = lerp(i0, on ? 1.3 : 0, e); telaTecho.material.emissiveIntensity = lerp(on ? 0 : 0.35, on ? 0.35 : 0, e); bombillaTecho.material.emissiveIntensity = on ? 2 * e : 2 * (1 - e); }, curva.suave);
  hemi.intensity += on ? 0.25 : -0.25;
  anuncia(on ? 'Luz de techo encendida.' : 'Luz de techo apagada.');
}
telaTecho.material.emissiveIntensity = 0.35;
registrar('interruptor', { nombre: 'Interruptor de la luz de techo', mallas: [interruptorPared, teclaPared], lugar: 'puerta', alcance: 1.8, alClic: () => alternaLuzTecho() });
registrar('luz-techo', { nombre: 'Luz de techo (interruptores: junto al pasillo y junto a la cama)', mallas: [telaTecho], lugar: 'cualquiera', alClic: () => alternaLuzTecho() });

/* ---------- el estor (E49, E56-18): baja y sube; de día oscurece el cuarto ---------- */
function estor(bajar) {
  const s0 = estorTela.scale.y, s1 = bajar ? VENTANA.y1 - VENTANA.y0 + 0.12 : 0.06, e0 = ventanaEstado.estor;
  return anim(reduced ? 1 : 1400, e => { estorTela.scale.y = lerp(s0, s1, e); estorBarra.position.y = VENTANA.y1 + 0.04 - estorTela.scale.y; ventanaEstado.estor = lerp(e0, bajar ? 1 : 0, e); ventanaEstado.minuto = -1; }, curva.suave);
}
estorBarra.userData.noJuntar = true;
registrar('estor', { nombre: 'Estor · bajarlo o subirlo (de día oscurece el cuarto)', mallas: [estorCaja, estorTela, estorBarra], lugar: 'cualquiera',
  alClic: () => { const bajar = ventanaEstado.estor < 0.5; estor(bajar); anuncia(bajar ? 'Bajas el estor: entra menos luz.' : 'Subes el estor.'); } });

/* ---------- mirar de cerca desde donde estés (E56-23) ----------
   ¿Se ve bien desde aquí? (1) a menos de 2,9 m, (2) de frente: el ángulo entre la normal de la cosa y la dirección hacia
   los ojos, menos de 60° (coseno > 0,5), y (3) nada delante: un rayo de los ojos al centro no choca con otra cosa antes.
   Si se cumple, la vista gira y se acerca (el campo de visión se ajusta al tamaño: fov = 2·atan(tamaño·0,75 / distancia)).
   Si no, se camina hasta el punto libre más cercano delante de la cosa y se mira desde allí. */
const _rayo = new THREE.Raycaster();
function seVeDesde(ojo, punto, normal, mallas) {
  const d = ojo.distanceTo(punto); if (d > 2.9) return false;
  const haciaOjo = ojo.clone().sub(punto).normalize(); if (haciaOjo.dot(normal) < 0.5) return false;
  _rayo.set(ojo, punto.clone().sub(ojo).normalize()); _rayo.far = d - 0.05;
  const golpes = _rayo.intersectObjects(scene.children, true).filter(h => h.object.isMesh && h.object.visible && !mallas.includes(h.object) && h.object !== hojaPlano && h.object.name !== 'quietos-ignora');
  return !golpes.some(h => h.distance > 0.15 && h.distance < d - 0.12);
}
async function miraCosa({ clave, punto, normal, tam, texto, extra = null }) {
  const o = objetos.get(clave);
  cambia('ocupado'); setHover(null); mirarDesde = clave;
  if (!seVeDesde(ojos(), punto, normal, o.mallas)) {
    const dist = clamp(tam * 1.5, 0.9, 1.6), q = libreCerca(punto.x + normal.x * dist, punto.z + normal.z * dist);
    if (enSillon.si) await levantaDelSillon();
    if (jug.sentado) await levantate();
    await caminaHasta(q, punto.toArray());
    jug.en = null;
  }
  const d = ojos().distanceTo(punto), fov = clamp(2 * Math.atan(tam * 0.75 / d) * 180 / Math.PI, 20, 55);
  enfoca(punto, ojos(), fov, { paralaje: 0.03, rate: 3.6 });
  await espera(reduced ? 0 : 450);
  modos.mirar.extra = extra; cambia('mirar'); anuncia(texto);
}
function registraMirarCerca(clave, nombre, mallas, punto, normal, tam, texto, extra = {}) {
  registrar(clave, Object.assign({ nombre, mallas, puntero: 'lupa', brilloK: 0.35, lugar: 'cualquiera',
    alClic: () => miraCosa({ clave, punto, normal, tam, texto, extra: extra.mirarExtra || null }) }, extra));
}
registraMirarCerca('ventana', 'Ventana · hora de Canarias', [cristal], v3(0, 1.55, SALA.z0), v3(0, 0, 1), 1.4,
  'La ventana. Fuera, el barrio en 3D a la hora de Canarias: el edificio de enfrente, palomas, nubes, ropa tendida, la montaña con sus coches. Esc para volver.');
registraMirarCerca('corcho', 'Corcho · la historia de la web', [corchoMesh, corchoMarco], v3(SALA.x0, CORCHO_POS.y, CORCHO_POS.z), v3(1, 0, 0), 1.0,
  'El corcho, con la historia de la web en fotos y entradas: ' + CORCHO.map(c => c.t + ', ' + c.s).join('. ') + '. Aquí irán los logros en la v0.3. Esc para volver.');
registraMirarCerca('poster', 'Cuadro de la calle', [posterMesh, marcoPoster], v3(SALA.x0, POSTER.y, POSTER.z), v3(1, 0, 0), 1.05,
  'El cuadro de la calle, en blanco y negro con un autobús rojo de dos pisos: el 20. Esc para volver.');
// v0.2.4 (E59-4): la camiseta se coge y se inspecciona como cualquier objeto (arrastra para girarla: por detrás, el 18)
camiseta.g.userData.noJuntar = true;
registrar('camiseta', { nombre: 'Camiseta de Colombia · Mundial 2018', mallas: [camiseta.m, camiseta.espalda], raiz: camiseta.g, movil: true, tipo: 'ropa', lugar: 'camiseta', alcance: 1.9,
  insp: { dist: 0.62, rot: new THREE.Euler(0, 0, 0) },
  alUsar: o => { anuncia('La camiseta amarilla de Colombia del Mundial 2018. Por detrás, el 18.'); empujaGiro(Math.PI, 0); $('#velo').classList.add('on'); insp.o = o; } });
registraMirarCerca('cuadro-niebla', 'Cuadro · la ciudad entre la niebla', [cuadroNiebla, cuadroNieblaCanto], v3(CUADRO_NIEBLA.x, CUADRO_NIEBLA.y, FONDO), v3(0, 0, -1), 0.6,
  'El cuadro de la ciudad entre la niebla, con su rascacielos de aguja. Esc para volver.');
registraMirarCerca('trofeos', 'Balda de trofeos (v0.3)', peanas, v3((TROFEOS.x0 + TROFEOS.x1) / 2, TROFEOS.y + 0.1, FONDO), v3(0, 0, -1), 0.9,
  'La balda de los trofeos, vacía de momento: los logros llegan en la v0.3. Esc para volver.');

/* ---------- el reloj: cambiar la hora (E52) ----------
   Arrastrar alrededor del reloj gira la aguja de los minutos (una vuelta = una hora); la rueda, de 15 en 15
   minutos; doble clic, la hora real (las agujas giran hasta ella). Se guarda en el navegador. Teclado: ← → y R. */
const relojMano = { activo: false, ang: 0, ultClic: 0 };
function anguloEnReloj() {
  const c = aPantalla(relojG.getWorldPosition(new THREE.Vector3())), x = (ndc.x + 1) / 2, y = (1 - ndc.y) / 2;
  return Math.atan2((x - c[0]) * camera.aspect, -(y - c[1]));
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
  alClic: () => miraCosa({ clave: 'reloj', punto: v3(RELOJ.x, RELOJ.y, RELOJ.z), normal: v3(0, 0, 1), tam: 0.5, extra: relojExtra,
    texto: 'El reloj marca las ' + horaTexto() + (HORA_FORZADA !== null ? ' (hora puesta por ti)' : ' en Canarias') + '. Arrastra alrededor para mover las agujas, rueda: 15 minutos, doble clic o R: la hora real. Esc para volver.' }) });

/* ---------- la torre: los ventiladores giran despacio ---------- */
function corrTorre(dt) { if (!reduced) ventiladores.forEach((v, i) => { v.rotation.z += dt * (1.2 + i * 0.3); }); }
window.__slJug = () => ({ sentado: jug.sentado, en: jug.en, pos: jug.pos.toArray().map(v => +v.toFixed(3)), sillon: enSillon.si, silla: +silla.position.z.toFixed(3) });
window.__slCamino = (a, b) => camino(a, b).map(p => p.map(v => +v.toFixed(2)));
window.__slIrA = n => irA(n);
window.__slLibre = (x, z) => esLibre(x, z);
window.__slEmpuja = (x, z) => empujaFuera(x, z).map(v => +v.toFixed(3));
window.__slEspejo = () => espejoEst.veces;
window.__slArmario = () => armarioPuertas.map(P => +P.p.rotation.y.toFixed(2));
window.__slLamparas = () => ({ mesita: lamparas.mesita.on, pie: lamparas.pie.on, techo: luzTecho.on });
window.__slMesita = () => mesitaCajones.map(C => +(C.g.position.x - C.x0).toFixed(3));
window.__slPila = () => PILA.map(b => b.clave.replace('libro-', '') + '@' + b.raiz.position.y.toFixed(3));
window.__slClics = () => clics.slice(-4);
window.__slSemana = d => { if (d) agendaPasa(d); return agenda.semana; };
