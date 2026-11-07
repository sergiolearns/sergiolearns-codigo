/* ===================== 11 · la ventana: el paisaje en 3D (E33, E42) =====================
   Fuera es la hora REAL de Canarias (zona IANA Atlantic/Canary), o la que pongas en el reloj (E52).
   v0.2.2: el paisaje ya no son planos pintados que se desplazaban al girar (paralaje falso, fallo 10): son
   objetos con volumen a su distancia real y la perspectiva hace sola el paralaje correcto:
     el edificio de enfrente, con volumen (6,5 m; v0.2.3) · el poste y los cables en catenaria con las palomas
     (4 m) · el barrio: 26 edificios con ventanas, depósitos de agua, antenas, tendederos con ropa que se mece y una
     chimenea con humo (8-22 m) · la ciudad, en una sola malla (35-80 m) · la montaña con su carretera y las luces
     de los coches (200 m) · el cielo en una cúpula (400 m) con el sol, la luna con su fase real, estrellas, nubes y
     un avión de vez en cuando · la lluvia en 3D y las gotas en el cristal.
   Sin luces de fuera: materiales sin luz con su color por hora y cada cara sombreada al construirla (colores por
   vértice). Las texturas de las fachadas se repintan cada 10 minutos (ventanas que se encienden); lo vivo, unas
   30 veces por segundo y solo si la cámara mira hacia la ventana. Con «reducir movimiento», todo quieto.
   Boceto: material/v0.2.2/bocetos/06-paisaje-3d.svg · fragmento F6. Para probar: ?hora=21, ?lluvia=1, ?palomas=1. */

/* ---------- la hora de Canarias (o la del reloj, E52: se guarda en el navegador) ---------- */
let HORA_FORZADA = PARAMS.has('hora') ? clamp(parseFloat(PARAMS.get('hora')) || 0, 0, 23.999) : (() => { const g = guardado.get('hora', null); return typeof g === 'number' ? clamp(g, 0, 23.999) : null; })();
let LLUVIA_FORZADA = PARAMS.has('lluvia') ? PARAMS.get('lluvia') !== '0' : null;
const fmtCanarias = (() => { try { return new Intl.DateTimeFormat('en-GB', { timeZone: 'Atlantic/Canary', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }); } catch (e) { return null; } })();
function horaReal() {
  const ahora = new Date(); let y, m, d, h;
  if (fmtCanarias) {
    const p = {}; fmtCanarias.formatToParts(ahora).forEach(x => { p[x.type] = x.value; });
    y = +p.year; m = +p.month; d = +p.day; h = (+p.hour) + (+p.minute) / 60 + (+p.second) / 3600;
  } else { y = ahora.getFullYear(); m = ahora.getMonth() + 1; d = ahora.getDate(); h = ahora.getHours() + ahora.getMinutes() / 60 + ahora.getSeconds() / 3600; }
  return { h, y, m, d };
}
function ahoraCanarias() { const t = horaReal(); if (HORA_FORZADA !== null) t.h = HORA_FORZADA; return t; }
function horaTexto(h = ahoraCanarias().h) { const hh = Math.floor(h), mm = Math.floor((h - hh) * 60); return hh + ':' + String(mm).padStart(2, '0'); }
function momentoDelDia(h) { return h >= 7 && h < 12 ? 'mañana' : h >= 12 && h < 16 ? 'mediodía' : h >= 16 && h < 20 ? 'tarde' : 'noche'; }
// E52: poner la hora a mano (null vuelve a la real). No se guarda si viene de la dirección (?hora=)
function ponHora(h, guardar = true) {
  HORA_FORZADA = h === null ? null : ((h % 24) + 24) % 24;
  if (guardar && !PARAMS.has('hora')) guardado.set('hora', HORA_FORZADA);
  ventanaEstado.minuto = -1;
}

/* ---------- el cielo según la hora: horas clave e interpolación (la tabla de la v0.2.1) ---------- */
const CLAVES = [
  [0.0, '#0E0C1A', '#2A2346', '#15121F', 0.55, 1], [6.6, '#1A1733', '#4A3A66', '#1B1828', 0.35, 1],
  [7.8, '#3E4C8C', '#FF9B80', '#2B2638', 0.20, 0.6], [9.5, '#6F96D6', '#EFE2D2', '#4A4560', 0.05, 0],
  [13.0, '#4F86D9', '#CFE3F5', '#5A566E', 0.0, 0], [16.5, '#6A8BCC', '#F2D3A0', '#4E4862', 0.02, 0],
  [18.6, '#4638B8', '#FF6B4A', '#2E2A42', 0.25, 0.4], [19.5, '#26224F', '#7A4E7E', '#1E1B2E', 0.5, 1],
  [21.0, '#110F20', '#2C2448', '#16131F', 0.65, 1], [24.0, '#0E0C1A', '#2A2346', '#15121F', 0.55, 1]
];
function rgbDe(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function mezclaHex(a, b, t) { const A = rgbDe(a), B = rgbDe(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); }
function cieloA(h) {
  h = ((h % 24) + 24) % 24;
  for (let i = 0; i < CLAVES.length - 1; i++) {
    const a = CLAVES[i], b = CLAVES[i + 1];
    if (h >= a[0] && h <= b[0]) {
      let t = (h - a[0]) / (b[0] - a[0]); t = t * t * (3 - 2 * t);
      return { arriba: mezclaHex(a[1], b[1], t), abajo: mezclaHex(a[2], b[2], t), edif: mezclaHex(a[3], b[3], t), ventanas: lerp(a[4], b[4], t), farolas: lerp(a[5], b[5], t) };
    }
  }
}
const SOL = { sale: 7.83, pone: 18.92 };
function alturaSol(h) { return h >= SOL.sale && h <= SOL.pone ? Math.sin(Math.PI * (h - SOL.sale) / (SOL.pone - SOL.sale)) : -1; }
const MES_SINODICO = 29.530588853;
function edadLuna(fecha = new Date()) { const dias = (fecha - Date.UTC(2000, 0, 6, 18, 14)) / 86400000; return ((dias % MES_SINODICO) + MES_SINODICO) % MES_SINODICO; }
function iluminadaLuna(edad) { return (1 - Math.cos(2 * Math.PI * edad / MES_SINODICO)) / 2; }
function semilla(s) { s = (Math.abs(Math.floor(s)) % 2147483646) + 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
function llueveA(t) {
  if (LLUVIA_FORZADA !== null) return LLUVIA_FORZADA;
  const r = semilla((t.y * 10000 + t.m * 100 + t.d) * 10 + Math.floor(t.h / 3)); r(); r();
  return r() < 0.1;
}

/* ---------- utilidades: cajas con sombra en los vértices y texturas de fachada ---------- */
const fuera = new THREE.Group(); scene.add(fuera);
const SOMBRA_CARA = [0.78, 0.66, 1.0, 0.5, 0.9, 0.6];   // +x, −x, arriba, abajo, +z (mira al cuarto), −z
// una caja cuyas caras llevan ya su sombra (colores por vértice) y cuyas UV se escalan con su tamaño (ventanas del mismo tamaño en todas)
function cajaFuera(w, h, d, x, y, z, celda, desp = [0, 0], tinte = [1, 1, 1]) {
  const g = new THREE.BoxGeometry(w, h, d), uv = g.attributes.uv, col = [];
  for (let i = 0; i < uv.count; i++) {
    const cara = Math.floor(i / 4), lado = cara === 0 || cara === 1 ? d : w;
    if (cara === 2 || cara === 3) uv.setXY(i, 0.01 + uv.getX(i) * 0.02, 0.97 + uv.getY(i) * 0.02);   // el tejado: un trozo liso del lienzo
    else uv.setXY(i, desp[0] + uv.getX(i) * lado / celda, desp[1] + uv.getY(i) * h / celda);
    const s = SOMBRA_CARA[cara]; col.push(s * tinte[0], s * tinte[1], s * tinte[2]);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.translate(x, y, z); return g;
}
function colorVert(g, s) { const c = []; for (let i = 0; i < g.attributes.position.count; i++) c.push(s, s, s); g.setAttribute('color', new THREE.Float32BufferAttribute(c, 3)); g.deleteAttribute && g.attributes.uv; return g; }
const matFuera = (o = {}) => new THREE.MeshBasicMaterial(Object.assign({ vertexColors: true, fog: false, toneMapped: false }, o));
// el lienzo de una fachada: el color de la pared y una rejilla de ventanas (encendidas según la hora y la «costumbre» de cada una)
function fachadaTex(n, ventW, ventH) {
  const t = texFrom(256, 256); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.userData.n = n; t.userData.vw = ventW; t.userData.vh = ventH; return t;
}
function pintaFachada(t, est, bloque, mezcla, semillaBase) {
  const c = t.userData.g, n = t.userData.n, cel = 256 / n, pared = mezclaHex(est.edif, est.abajo, mezcla);
  c.fillStyle = mezclaHex(pared, '#FAFAF7', 0.06); c.fillRect(0, 0, 256, 256);
  c.fillStyle = mezclaHex(pared, '#000000', 0.25); c.fillRect(0, 0, 10, 10);   // el tejado (esquina de arriba a la izquierda: v alta)
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const id = semillaBase + i * 131 + j * 17, r = semilla(id * 7919 + bloque * 31); r();
    const luz = est.ventanas > 0.02 && r() < est.ventanas;
    const x = i * cel + cel * (1 - t.userData.vw) / 2, y = j * cel + cel * (1 - t.userData.vh) / 2;
    c.fillStyle = luz ? (r() < 0.15 ? '#B9B0F5' : '#F5C06B') : mezclaHex(pared, '#000000', 0.32);
    c.fillRect(x, y, cel * t.userData.vw, cel * t.userData.vh);
  }
  t.needsUpdate = true;
}

/* ---------- el cielo: una cúpula con un degradado por altura, el sol, la luna, estrellas ---------- */
const cupula = new THREE.Mesh(new THREE.SphereGeometry(420, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2 + 0.2), new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, toneMapped: false, depthWrite: false }));
cupula.geometry.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(cupula.geometry.attributes.position.count * 3), 3));
cupula.renderOrder = -30; fuera.add(cupula);
function pintaCupula(arriba, abajo) {
  const pos = cupula.geometry.attributes.position, col = cupula.geometry.attributes.color, A = new THREE.Color(arriba), B = new THREE.Color(abajo), c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) { const e = clamp(pos.getY(i) / 420, 0, 1); c.lerpColors(B, A, Math.pow(e, 0.45)); col.setXYZ(i, c.r, c.g, c.b); }
  col.needsUpdate = true;
}
const estrellas = (() => {
  const r = semilla(11), N = 260, p = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { const az = -Math.PI / 2 + (r() - 0.5) * 2.2, el = 0.08 + r() * 0.9; p[i * 3] = Math.sin(az + Math.PI / 2) * Math.cos(el) * 400; p[i * 3 + 1] = Math.sin(el) * 400; p[i * 3 + 2] = -Math.abs(Math.cos(az + Math.PI / 2)) * Math.cos(el) * 400 - 20; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const m = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xE8E6F5, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false })); m.renderOrder = -29; fuera.add(m); return m;
})();
const disco = (tam, tex) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(tam, tam), new THREE.MeshBasicMaterial({ map: tex, transparent: true, fog: false, toneMapped: false, depthWrite: false })); m.renderOrder = -28; fuera.add(m); return m; };
const solTex = texFrom(128, 128, (c, w, h) => { const g = c.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,241,201,1)'); g.addColorStop(0.28, 'rgba(255,241,201,1)'); g.addColorStop(0.32, 'rgba(255,225,170,.5)'); g.addColorStop(1, 'rgba(255,225,170,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
const solM = disco(26, solTex);
const lunaTex = texFrom(128, 128);
const lunaM = disco(13, lunaTex);
function pintaLuna(edad) {
  const c = lunaTex.userData.g, R = 30, x = 64, y = 64, luz = iluminadaLuna(edad); c.clearRect(0, 0, 128, 128);
  const halo = c.createRadialGradient(x, y, 0, x, y, 64); halo.addColorStop(0, 'rgba(232,230,245,' + 0.25 * luz + ')'); halo.addColorStop(1, 'rgba(232,230,245,0)'); c.fillStyle = halo; c.fillRect(0, 0, 128, 128);
  c.fillStyle = 'rgba(232,230,245,.12)'; c.beginPath(); c.arc(x, y, R, 0, Math.PI * 2); c.fill();
  const crece = edad < MES_SINODICO / 2, k = Math.cos(2 * Math.PI * edad / MES_SINODICO);
  c.fillStyle = '#E8E6F5'; c.beginPath(); c.arc(x, y, R, -Math.PI / 2, Math.PI / 2, !crece); c.ellipse(x, y, Math.abs(k) * R, R, 0, Math.PI / 2, -Math.PI / 2, (k > 0) === crece); c.fill();
  lunaTex.needsUpdate = true;
}
// un punto del cielo (acimut desde el frente, elevación) a la distancia d, mirando a la ventana
function enCielo(az, el, d, m) { m.position.set(Math.sin(az) * Math.cos(el) * d, Math.sin(el) * d, -Math.cos(az) * Math.cos(el) * d); m.lookAt(0, 1.2, 0); }

/* ---------- la montaña del fondo con su carretera (luces de los coches) ---------- */
const montana = (() => {
  const W = 700, N = 120, g = new THREE.PlaneGeometry(W, 1, N, 1), p = g.attributes.position, r = semilla(41);
  const alto = []; for (let i = 0; i <= N; i++) { const x = i / N; alto.push(26 + Math.sin(x * 7.1) * 9 + Math.sin(x * 17.3 + 1) * 4 + Math.sin(x * 41) * 1.6 + r() * 1.2); }
  for (let i = 0; i < p.count; i++) { const col = i % (N + 1), arriba = i < N + 1; p.setY(i, arriba ? alto[col] : -40); }
  g.translate(0, 0, -210); colorVert(g, 1);
  const m = new THREE.Mesh(g, matFuera()); m.renderOrder = -27; fuera.add(m);
  // la carretera: una curva que sube por la ladera (los coches la recorren)
  const via = []; for (let k = 0; k <= 60; k++) { const x = -260 + k * 8.5; via.push(v3(x, 6 + Math.sin(k * 0.21) * 3 + (k % 20 < 10 ? (k % 10) * 0.9 : (10 - k % 10) * 0.9) + k * 0.12, -205)); }
  return { m, alto, via };
})();
const curvaVia = new THREE.CatmullRomCurve3(montana.via);
const coches = Array.from({ length: 9 }, (_, i) => {
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 6), new THREE.MeshBasicMaterial({ color: i % 2 ? 0xFFE9B0 : 0xFF6B4A, fog: false, toneMapped: false })); m.renderOrder = -26; fuera.add(m);
  return { m, f: i / 9, v: (0.004 + (i % 3) * 0.0015) * (i % 2 ? 1 : -1) };
});

/* ---------- la ciudad (35-80 m): una sola malla con todos los edificios ---------- */
const BARRIO = (() => {
  const r = semilla(2026), lejos = [], cerca = [];
  for (let x = -70; x < 70;) { const w = 4 + r() * 8, alto = 5 + r() * 9 + (r() < 0.12 ? 6 : 0), z = -38 - r() * 40; lejos.push({ x, w, alto, z, d: 6 + r() * 8, aviso: alto > 15 }); x += w + r() * 1.5; }
  for (let x = -26; x < 26;) {
    // más bajos que en la primera prueba (tapaban el cielo y la ciudad): la azotea más alta, 3,8 m sobre los ojos
    const w = 2.6 + r() * 3.8, techo = 0.4 + r() * 3.4, z = -9 - r() * 15;
    cerca.push({ x, w, techo, z, d: 5 + r() * 5, deposito: r() < 0.6, antena: r() < 0.35, tendedero: r() < 0.3, chimenea: r() < 0.12, c: r() });
    x += w + 0.4 + r() * 1.2;
  }
  return { lejos, cerca };
})();
const TEX_CIUDAD = fachadaTex(8, 0.42, 0.5), TEX_BARRIO = fachadaTex(4, 0.5, 0.56);
// los colores de las fachadas canarias (como la fachada naranja que se ve en la foto de Sergio), relativos al blanco
const TINTES = [[1.25, 1.02, 0.78], [1.18, 1.16, 1.1], [1.25, 0.86, 0.7], [1.0, 0.98, 1.12], [1.2, 1.1, 0.86]];
const ciudadMesh = (() => {
  const g = mergeGeometries(BARRIO.lejos.map((b, i) => cajaFuera(b.w, b.alto + 30, b.d, b.x + b.w / 2, (b.alto - 30) / 2, b.z, 3.2, [i * 0.37, 0], TINTES[i % TINTES.length].map(v => 0.85 + (v - 1) * 0.6))));
  const m = new THREE.Mesh(g, matFuera({ map: TEX_CIUDAD })); m.renderOrder = -25; fuera.add(m); return m;
})();
const luzAviso = BARRIO.lejos.filter(b => b.aviso).map(b => {
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 6), new THREE.MeshBasicMaterial({ color: 0xFF3B2A, fog: false, toneMapped: false }));
  m.position.set(b.x + b.w / 2, b.alto + 0.5, b.z); m.renderOrder = -24; fuera.add(m); return m;
});
/* ---------- el barrio (8-22 m): edificios, depósitos de agua, antenas, tendederos y una chimenea ---------- */
const barrioMesh = (() => {
  const g = mergeGeometries(BARRIO.cerca.map((b, i) => cajaFuera(b.w, b.techo + 16, b.d, b.x + b.w / 2, (b.techo - 16) / 2, b.z - b.d / 2, 2.4, [i * 0.29, 0.13], TINTES[Math.floor(b.c * TINTES.length)])));
  const m = new THREE.Mesh(g, matFuera({ map: TEX_BARRIO })); m.renderOrder = -23; fuera.add(m); return m;
})();
const extrasMesh = (() => {
  const geos = [];
  BARRIO.cerca.forEach(b => {
    geos.push(colorVert(new THREE.BoxGeometry(b.w + 0.2, 0.35, 0.2).translate(b.x + b.w / 2, b.techo + 0.17, b.z), 0.95));   // el pretil de cada azotea
    if (b.deposito) { const x = b.x + 0.5 + b.c * (b.w - 1); geos.push(colorVert(new THREE.CylinderGeometry(0.45, 0.45, 0.9, 14).translate(x, b.techo + 0.75, b.z - 1.2), 0.85)); geos.push(colorVert(new THREE.BoxGeometry(1.1, 0.3, 1.1).translate(x, b.techo + 0.15, b.z - 1.2), 0.7)); }
    if (b.antena) { const x = b.x + b.w - 0.4; geos.push(colorVert(new THREE.CylinderGeometry(0.03, 0.03, 1.8, 5).translate(x, b.techo + 0.9, b.z - 0.6), 0.6)); geos.push(colorVert(new THREE.BoxGeometry(0.9, 0.04, 0.04).translate(x, b.techo + 1.5, b.z - 0.6), 0.6)); geos.push(colorVert(new THREE.BoxGeometry(0.6, 0.04, 0.04).translate(x, b.techo + 1.2, b.z - 0.6), 0.6)); }
    if (b.chimenea) geos.push(colorVert(new THREE.BoxGeometry(0.5, 1.1, 0.5).translate(b.x + 0.6, b.techo + 0.55, b.z - 2), 0.75));
  });
  const m = new THREE.Mesh(mergeGeometries(geos.map(g => { g.deleteAttribute('uv'); g.deleteAttribute('normal'); return g; })), matFuera()); m.renderOrder = -22; fuera.add(m); return m;
})();
// la ropa tendida: prendas que se mecen (cada una con su ritmo)
const ropa = [];
BARRIO.cerca.filter(b => b.tendedero).forEach((b, k) => {
  const y = b.techo + 1.2, z = b.z - 2.2;
  const cuerda = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, b.w - 0.6, 4), matFuera({ vertexColors: false, color: 0x2E2A42 })); cuerda.rotation.z = Math.PI / 2; cuerda.position.set(b.x + b.w / 2, y, z); cuerda.renderOrder = -21; fuera.add(cuerda);
  ['#FAFAF7', '#A99EF5', '#FF9B80', '#9CC3FF'].slice(0, 2 + (k % 3)).forEach((c, i) => {
    const g = new THREE.Group(); g.position.set(b.x + 0.6 + i * 0.75, y, z); fuera.add(g);
    const p = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.6).translate(0, -0.3, 0), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide, fog: false, toneMapped: false })); p.renderOrder = -21; g.add(p);
    ropa.push({ g, p, base: c, fase: i * 1.7 + k });
  });
});
// el humo de la chimenea: partículas que suben y se abren
const humo = (() => {
  const b = BARRIO.cerca.find(x => x.chimenea) || BARRIO.cerca[3], o = v3(b.x + 0.6, b.techo + 1.15, b.z - 2), N = 40, p = new Float32Array(N * 3), sem = [];
  for (let i = 0; i < N; i++) sem.push([Math.random(), Math.random()]);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const tex = texFrom(64, 64, (c, w, h) => { const gr = c.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(232,230,245,.9)'); gr.addColorStop(1, 'rgba(232,230,245,0)'); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
  const m = new THREE.Points(g, new THREE.PointsMaterial({ map: tex, size: 1.2, transparent: true, opacity: 0.3, depthWrite: false, fog: false })); m.renderOrder = -20; fuera.add(m);
  return { m, p, sem, o, N };
})();
// gente: siluetas que aparecen en alguna ventana encendida y se van
const siluetas = BARRIO.cerca.slice(2, 6).map((b, i) => {
  const s = new THREE.Shape(); s.absellipse(0, 0.55, 0.16, 0.18, 0, Math.PI * 2); const cuerpo = new THREE.Shape(); cuerpo.moveTo(-0.3, 0); cuerpo.quadraticCurveTo(0, 0.55, 0.3, 0); cuerpo.lineTo(-0.3, 0);
  const g = mergeGeometries([new THREE.ShapeGeometry(s), new THREE.ShapeGeometry(cuerpo)]);
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0x15121F, transparent: true, opacity: 0, fog: false, toneMapped: false, depthWrite: false }));
  m.position.set(b.x + 0.8 + i * 0.3, b.techo - 1.9 - i * 0.6, b.z + 0.03); m.renderOrder = -19; fuera.add(m);
  return { m, t0: 0, dur: 0 };
});

/* ---------- el edificio de enfrente (v0.2.3, E56-10): con volumen y sin plantas ----------
   Antes: el pretil de un ático con macetas encima y una fachada PLANA con las ventanas pintadas («parece plano»).
   Ahora (boceto 06): un bloque de cuatro plantas al otro lado de la calle (su fachada, a 6,5 m de la ventana), con los
   marcos de las ventanas que SOBRESALEN 6 cm, los cristales metidos, persianas a medias, dos balcones con su losa y su
   barandilla, la cornisa, la barandilla de la azotea, la caseta de la escalera, un depósito, una antena, un bajante y un
   aparato de aire. Todo en una malla con la sombra de cada cara en sus colores (como el resto del paisaje) y los
   cristales en otras dos (los que se encienden por la tarde y los que no). */
const ENFRENTE = { x0: -7, x1: 7, z: -6.5, techo: 0.55, fondo: 9, piso: 3 };   // su azotea, algo por debajo de los ojos: se ve la azotea y, detrás, el barrio
function cajaV(w, h, d, x, y, z, s) { const g = new THREE.BoxGeometry(w, h, d), c = []; for (let i = 0; i < g.attributes.position.count; i++) { const k = SOMBRA_CARA[Math.floor(i / 4)] * s; c.push(k, k, k); } g.setAttribute('color', new THREE.Float32BufferAttribute(c, 3)); g.deleteAttribute('uv'); g.deleteAttribute('normal'); return g.translate(x, y, z); }
const enfrente = (() => {
  const E = ENFRENTE, geos = [], cristalesA = [], cristalesB = [], r = semilla(56);
  geos.push(cajaV(E.x1 - E.x0, 40, E.fondo, (E.x0 + E.x1) / 2, E.techo - 20, E.z - E.fondo / 2, 1.0));                 // el bloque
  geos.push(cajaV(E.x1 - E.x0 + 0.5, 0.3, 0.5, (E.x0 + E.x1) / 2, E.techo + 0.15, E.z - 0.15, 1.12));                   // la cornisa
  for (let x = E.x0 + 0.1; x <= E.x1; x += 0.18) geos.push(cajaV(0.025, 0.7, 0.025, x, E.techo + 0.65, E.z - 0.2, 0.6));   // la barandilla de la azotea
  geos.push(cajaV(E.x1 - E.x0, 0.04, 0.05, (E.x0 + E.x1) / 2, E.techo + 1.0, E.z - 0.2, 0.6));
  for (let z = E.z - 1; z > E.z - E.fondo; z -= 0.9) geos.push(cajaV(E.x1 - E.x0 - 0.4, 0.005, 0.03, (E.x0 + E.x1) / 2, E.techo + 0.003, z, 0.82));   // las juntas del suelo de la azotea
  geos.push(cajaV(2.2, 2.4, 2.0, -3.6, E.techo + 1.2, E.z - 3.2, 1.0), cajaV(2.4, 0.12, 2.2, -3.6, E.techo + 2.46, E.z - 3.2, 0.8));   // la caseta de la escalera
  { const g = new THREE.CylinderGeometry(0.55, 0.55, 1.2, 14); geos.push(colorVert(g, 0.92).translate(3.2, E.techo + 0.75, E.z - 2.6)); geos.push(cajaV(1.3, 0.15, 1.3, 3.2, E.techo + 0.08, E.z - 2.6, 0.7)); }   // el depósito
  geos.push(colorVert(new THREE.CylinderGeometry(0.03, 0.03, 2.4, 5), 0.55).translate(5.0, E.techo + 1.2, E.z - 1.5), cajaV(1.0, 0.04, 0.04, 5.0, E.techo + 2.1, E.z - 1.5, 0.55), cajaV(0.7, 0.04, 0.04, 5.0, E.techo + 1.8, E.z - 1.5, 0.55));
  { const g = new THREE.CylinderGeometry(0.06, 0.06, 40, 6); geos.push(colorVert(g, 0.82).translate(E.x1 - 0.5, E.techo - 20, E.z + 0.1)); }   // el bajante
  // las plantas: cinco ventanas por planta; cada una con su marco que sobresale, su cristal metido y, a veces, la persiana
  for (let p = 0; p < 4; p++) {
    const yc = E.techo - 1.6 - p * E.piso;
    for (let i = 0; i < 5; i++) {
      const xc = E.x0 + 1.6 + i * 2.7, w = 1.2, h = 1.5, marco = 0.12;
      geos.push(cajaV(w + 2 * marco, marco, 0.12, xc, yc + h / 2 + marco / 2, E.z + 0.06, 1.18), cajaV(w + 2 * marco, marco, 0.18, xc, yc - h / 2 - marco / 2, E.z + 0.09, 1.2));   // dintel y alféizar
      geos.push(cajaV(marco, h, 0.12, xc - w / 2 - marco / 2, yc, E.z + 0.06, 1.1), cajaV(marco, h, 0.12, xc + w / 2 + marco / 2, yc, E.z + 0.06, 1.1));
      const persiana = r() < 0.4 ? 0.25 + r() * 0.5 : 0;
      if (persiana) geos.push(cajaV(w, h * persiana, 0.02, xc, yc + h / 2 - h * persiana / 2, E.z + 0.02, 0.88));
      const cristal = new THREE.PlaneGeometry(w, h * (1 - persiana)).translate(xc, yc - h * persiana / 2, E.z + 0.008);
      (r() < 0.45 ? cristalesB : cristalesA).push(cristal);
      if ((p === 1 || p === 2) && (i === 1 || i === 3)) {                                                                          // dos balcones por planta, en la 2ª y la 3ª
        geos.push(cajaV(w + 0.6, 0.1, 0.95, xc, yc - h / 2 - 0.05, E.z + 0.47, 1.05));
        geos.push(cajaV(w + 0.6, 0.04, 0.04, xc, yc - h / 2 + 0.85, E.z + 0.93, 0.5));
        for (let b = -(w + 0.6) / 2; b <= (w + 0.6) / 2 + 0.01; b += 0.12) geos.push(cajaV(0.02, 0.85, 0.02, xc + b, yc - h / 2 + 0.43, E.z + 0.93, 0.5));
      }
      if (p === 1 && i === 2) geos.push(cajaV(0.8, 0.5, 0.35, xc, yc - h / 2 - 0.45, E.z + 0.18, 0.9));                           // un aparato de aire
    }
  }
  geos.forEach(g => { for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'color') g.deleteAttribute(k); });
  const m = new THREE.Mesh(mergeGeometries(geos.map(g => g.index ? g.toNonIndexed() : g)), matFuera()); m.renderOrder = -18; fuera.add(m);
  const mA = new THREE.Mesh(mergeGeometries(cristalesA), new THREE.MeshBasicMaterial({ color: 0x3A3436, fog: false, toneMapped: false })); mA.renderOrder = -17; fuera.add(mA);
  const mB = new THREE.Mesh(mergeGeometries(cristalesB), new THREE.MeshBasicMaterial({ color: 0x3A3436, fog: false, toneMapped: false })); mB.renderOrder = -17; fuera.add(mB);
  return { m, mA, mB };
})();
// cables de la luz: catenarias y(x) = y_min + a·(cosh((x − x_m)/a) − 1), ahora tubos de verdad colgados del poste
const CABLES = [{ yMin: 2.55, a: 9, xm: -0.4, z: -4.0 }, { yMin: 2.8, a: 11, xm: -0.2, z: -4.05 }, { yMin: 2.38, a: 8, xm: -0.7, z: -3.95 }];
const POSTE = 1.9;
function yCable(cb, x) { return cb.yMin + cb.a * (Math.cosh((x - cb.xm) / cb.a) - 1); }
const postes = (() => { const g = colorVert(new THREE.CylinderGeometry(0.07, 0.09, 16, 8), 1).translate(POSTE, 3.2 - 8, -4.0); const g2 = colorVert(new THREE.BoxGeometry(0.9, 0.06, 0.06), 1).translate(POSTE, 3.0, -4.0); g.deleteAttribute('uv'); g.deleteAttribute('normal'); g2.deleteAttribute('uv'); g2.deleteAttribute('normal'); const m = new THREE.Mesh(mergeGeometries([g, g2]), matFuera()); m.renderOrder = -16; fuera.add(m); return m; })();
const cablesMesh = (() => {
  const geos = CABLES.map(cb => { const pts = []; for (let x = -9; x <= POSTE; x += 0.25) pts.push(v3(x, yCable(cb, x), cb.z)); const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.012, 4, false); g.deleteAttribute('uv'); g.deleteAttribute('normal'); return colorVert(g, 0.4); });
  const m = new THREE.Mesh(mergeGeometries(geos), matFuera()); m.renderOrder = -16; fuera.add(m); return m;
})();

/* ---------- las palomas, con cuerpo: llegan volando, se posan en un cable, cabecean y se van ---------- */
function creaPaloma() {
  const g = new THREE.Group(), gris = new THREE.MeshBasicMaterial({ color: 0x8E8AA3, fog: false, toneMapped: false }), oscuro = new THREE.MeshBasicMaterial({ color: 0x6E6A84, fog: false, toneMapped: false });
  const cuerpo = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), gris); cuerpo.scale.set(1.6, 1, 1); cuerpo.position.y = 0.1; g.add(cuerpo);
  const cuello = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), new THREE.MeshBasicMaterial({ color: 0x5B7F78, fog: false, toneMapped: false })); cuello.position.set(0.11, 0.16, 0); g.add(cuello);
  const cabeza = new THREE.Group(); cabeza.position.set(0.14, 0.21, 0); g.add(cabeza);
  cabeza.add(new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), gris));
  const pico = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.04, 6), new THREE.MeshBasicMaterial({ color: 0xC9C5DC, fog: false })); pico.rotation.z = -Math.PI / 2; pico.position.x = 0.05; cabeza.add(pico);
  const cola = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.015, 0.08), oscuro); cola.position.set(-0.19, 0.1, 0); cola.rotation.z = 0.25; g.add(cola);
  const alas = [-1, 1].map(s => { const p = new THREE.Group(); p.position.set(0.02, 0.15, s * 0.06); g.add(p); const a = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.012, 0.22).translate(-0.02, 0, s * 0.11), oscuro); p.add(a); p.userData.s = s; return p; });
  g.scale.setScalar(1.15); g.visible = false; g.traverse(m => { m.renderOrder = -15; }); fuera.add(g);
  return { g, cabeza, alas };
}
const palomas = { lista: [], proxima: 0, piezas: [creaPaloma(), creaPaloma(), creaPaloma()] };
function programaPaloma(t) { palomas.proxima = t + (PARAMS.has('palomas') ? 1500 : 12000 + Math.random() * 26000); }
function nuevaPaloma(t) {
  const pieza = palomas.piezas.find(p => !p.g.visible); if (!pieza) return;
  const cb = CABLES[Math.floor(Math.random() * CABLES.length)], x = -1.6 + Math.random() * 2.6, deIzq = Math.random() < 0.5;
  palomas.lista.push({ pieza, fase: 'llega', t0: t, dur: 2400, desde: v3(deIzq ? -7 : 6, 3.4 + Math.random() * 0.6, cb.z - 1.5), cb, x, mira: deIzq ? 1 : -1, quieta: 6000 + Math.random() * 9000 });
  pieza.g.visible = true;
}
const _pc = new THREE.Vector3(), _pd = new THREE.Vector3();
function corrPalomas(t, h, lluvia) {
  const diurna = h > 7.6 && h < 19.2 && !lluvia;
  if (!palomas.proxima) programaPaloma(t);
  if (diurna && t > palomas.proxima && palomas.lista.length < 3) { nuevaPaloma(t); programaPaloma(t); }
  if (reduced && diurna && !palomas.lista.length) { nuevaPaloma(t); const p = palomas.lista[0]; if (p) { p.fase = 'posada'; p.quieta = 1e12; } }
  palomas.lista = palomas.lista.filter(p => {
    const { g, cabeza, alas } = p.pieza, e = (t - p.t0) / (p.dur || 1), posada = v3(p.x, yCable(p.cb, p.x) + 0.005, p.cb.z);
    let aleteo = 0;
    if (p.fase === 'llega') {
      const f = Math.min(1, e), q = curva.sale(f); _pc.copy(p.desde).lerp(posada, 0.5); _pc.y = Math.max(p.desde.y, posada.y) + 0.8;
      bezier2(p.desde, _pc, posada, q, g.position); aleteo = f < 0.92 ? 1 : 0;
      if (f >= 1) { p.fase = 'posada'; p.t0 = t; }
    } else if (p.fase === 'posada') {
      g.position.copy(posada);
      cabeza.position.x = 0.14 + (reduced ? 0 : (Math.sin(t / 260) > 0.6 ? 0.02 : 0));        // el cabeceo
      if (!reduced && Math.random() < 0.002) p.mira *= -1;
      if (t - p.t0 > p.quieta || !diurna) { p.fase = 'se va'; p.t0 = t; p.dur = 2000; }
    } else {
      const f = Math.min(1, e); g.position.set(p.x + p.mira * f * 7, posada.y + Math.sin(f * Math.PI * 0.5) * 2.2, p.cb.z - f * 2); aleteo = 1;
      if (f >= 1) { g.visible = false; return false; }
    }
    g.rotation.y = p.mira > 0 ? 0 : Math.PI;
    const ang = aleteo && !reduced ? Math.sin(t / 45) * 0.9 : -0.05;
    alas.forEach(a => { a.rotation.x = a.userData.s * ang; });
    return true;
  });
}

/* ---------- nubes y un avión ---------- */
const nubes = (() => {
  const r = semilla(5), lista = [];
  for (let i = 0; i < 10; i++) {
    const g = new THREE.Group(), m = new THREE.MeshBasicMaterial({ color: 0xFAFAF7, transparent: true, opacity: 0.8, fog: false, toneMapped: false, depthWrite: false });
    for (let k = 0; k < 5; k++) { const s = new THREE.Mesh(new THREE.SphereGeometry(6 + r() * 7, 10, 6), m); s.scale.y = 0.42; s.position.set((k - 2) * 8 + r() * 4, r() * 3, r() * 6); g.add(s); }
    g.position.set(-240 + r() * 480, 70 + r() * 70, -230 - r() * 120); g.traverse(x => { x.renderOrder = -27; }); fuera.add(g);
    lista.push({ g, m, v: 0.6 + r() * 0.8, lluvia: i >= 5 });
  }
  return lista;
})();
const avion = (() => {
  const g = new THREE.Group(), m = new THREE.MeshBasicMaterial({ color: 0x5A566E, fog: false, toneMapped: false });
  g.add(new THREE.Mesh(new THREE.CapsuleGeometry(0.6, 5, 4, 8).rotateZ(Math.PI / 2), m));
  g.add(new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 7), m));
  const luzR = new THREE.Mesh(new THREE.SphereGeometry(0.5, 6, 4), new THREE.MeshBasicMaterial({ color: 0xFF3B2A, fog: false, toneMapped: false })); luzR.position.z = 3.5; g.add(luzR);
  const luzB = new THREE.Mesh(new THREE.SphereGeometry(0.5, 6, 4), new THREE.MeshBasicMaterial({ color: 0xFAFAF7, fog: false, toneMapped: false })); luzB.position.x = -3; g.add(luzB);
  g.scale.setScalar(1.6); g.visible = false; g.traverse(x => { x.renderOrder = -26; }); fuera.add(g);
  return { g, luzR, luzB, t0: -1e9 };
})();

/* ---------- la lluvia en 3D y las gotas en el cristal ---------- */
const lluvia3d = (() => {
  const N = 500, p = new Float32Array(N * 6), sem = [];
  for (let i = 0; i < N; i++) sem.push([Math.random() * 9 - 4.5, Math.random(), -1.5 - Math.random() * 7, 0.7 + Math.random() * 0.6]);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const m = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0xC9C5DC, transparent: true, opacity: 0.45, fog: false })); m.renderOrder = -14; m.visible = false; fuera.add(m);
  return { m, p, sem, N };
})();
const gotasTex = texFrom(512, 352);
const gotasM = new THREE.Mesh(new THREE.PlaneGeometry(VENTANA.x1 - VENTANA.x0, VENTANA.y1 - VENTANA.y0), new THREE.MeshBasicMaterial({ map: gotasTex, transparent: true, fog: false, depthWrite: false, toneMapped: false }));
gotasM.position.set(0, (VENTANA.y0 + VENTANA.y1) / 2, SALA.z0 - 0.105); gotasM.renderOrder = -10; scene.add(gotasM);
const cristalGotas = Array.from({ length: 46 }, () => ({ x: Math.random(), y: Math.random(), r: 1.5 + Math.random() * 3.5, v: Math.random() < 0.25 ? 0.02 + Math.random() * 0.05 : 0, t0: Math.random() * 20000 }));
let lluviaPintada = null;
function corrLluvia(t, llueve) {
  const L = lluvia3d, gg = gotasTex.userData.g, W = 512, H = 352;
  if (!llueve) { if (lluviaPintada !== false) { L.m.visible = false; gg.clearRect(0, 0, W, H); gotasTex.needsUpdate = true; lluviaPintada = false; } return; }
  if (reduced && lluviaPintada === true) return;
  lluviaPintada = true; L.m.visible = true;
  const s = reduced ? 0 : t / 1000;
  for (let i = 0; i < L.N; i++) {
    const [x, b, z, v] = L.sem[i], y = 4.2 - ((b + s * 0.9 * v) % 1) * 6, xx = x + y * 0.08;   // caen algo inclinadas por el viento
    L.p.set([xx, y, z, xx - 0.03, y - 0.28 * v, z], i * 6);
  }
  L.m.geometry.attributes.position.needsUpdate = true;
  gg.clearRect(0, 0, W, H);
  cristalGotas.forEach(d => {
    const vida = ((t - d.t0) % 20000) / 20000, y = (d.y + (reduced ? 0 : d.v * vida * 8)) % 1, X = d.x * W, Y = y * H;
    if (d.v) { gg.strokeStyle = 'rgba(232,230,245,.12)'; gg.lineWidth = d.r * 0.8; gg.beginPath(); gg.moveTo(X, Math.max(0, Y - 30)); gg.lineTo(X, Y); gg.stroke(); }
    gg.fillStyle = 'rgba(232,230,245,.28)'; gg.beginPath(); gg.arc(X, Y, d.r, 0, Math.PI * 2); gg.fill();
    gg.fillStyle = 'rgba(255,255,255,.55)'; gg.beginPath(); gg.arc(X - d.r * 0.3, Y - d.r * 0.35, d.r * 0.35, 0, Math.PI * 2); gg.fill();
  });
  gotasTex.needsUpdate = true;
}

/* ---------- pintar según la hora (cada minuto, o al cambiar la hora en el reloj) ---------- */
const luzVentana = new THREE.DirectionalLight(0xFFF1DE, 0); luzVentana.position.set(0.6, 2.6, -3.5); luzVentana.target.position.set(0, 0.7, 0); scene.add(luzVentana, luzVentana.target);
const ventanaEstado = { minuto: -1, lluvia: null, h: 0, ultVivo: 0, momento: '', dia: 0, bloque: -1, est: null, estor: 0 };
const _ca = new THREE.Color();
function tinta(m, hex) { m.material.color.set(hex); }
function repintaFuera(t0) {
  const est = cieloA(t0.h), llueve = llueveA(t0), sol = alturaSol(t0.h);
  ventanaEstado.est = est;
  const arriba = llueve ? mezclaHex(est.arriba, '#5A566E', 0.45) : est.arriba, abajo = llueve ? mezclaHex(est.abajo, '#8E8AA3', 0.4) : est.abajo;
  pintaCupula(arriba, abajo);
  const noche = clamp(-sol * 3 + (sol < 0 ? 0.6 : 0), 0, 1) * (t0.h > 12 ? (t0.h > 19.3 ? 1 : 0) : (t0.h < 7.4 ? 1 : 0));
  estrellas.material.opacity = llueve ? 0 : 0.85 * noche;
  // el sol recorre un arco de izquierda a derecha; de noche, la luna con su fase real
  solM.visible = sol > -0.04; lunaM.visible = !solM.visible && !llueve;
  if (solM.visible) { const f = (t0.h - SOL.sale) / (SOL.pone - SOL.sale); enCielo(lerp(-0.75, 0.75, f), 0.04 + Math.max(sol, 0) * 0.5, 380, solM); solM.material.opacity = llueve ? 0.25 : 1; }
  if (lunaM.visible) { pintaLuna(edadLuna(new Date())); enCielo(0.35, 0.32, 380, lunaM); }
  // cada capa: el color de los edificios a esa hora, mezclado con el del horizonte según la distancia (la bruma)
  const bruma = d => 1 - Math.exp(-d / 90);
  tinta(montana.m, mezclaHex(mezclaHex(est.edif, '#FAFAF7', 0.1), abajo, 0.62));
  tinta(extrasMesh, mezclaHex(mezclaHex(est.edif, '#FAFAF7', 0.25), abajo, bruma(14)));
  tinta(enfrente.m, mezclaHex(mezclaHex(est.edif, '#E5D3C3', 0.55), '#FAFAF7', 0.12)); tinta(cablesMesh, mezclaHex(est.edif, '#000000', 0.2));
  tinta(postes, mezclaHex(est.edif, '#000000', 0.35));
  enfrente.mA.material.color.set(mezclaHex(est.edif, '#1E1B2E', 0.65)); enfrente.mB.material.color.set(est.ventanas > 0.15 ? '#F5C06B' : mezclaHex(est.edif, '#1E1B2E', 0.55));
  ropa.forEach(r => r.p.material.color.set(mezclaHex(r.base, est.edif, 0.45)));
  nubes.forEach(n => { n.g.visible = !n.lluvia || llueve; n.m.color.set(llueve ? mezclaHex(est.edif, '#8E8AA3', 0.5) : mezclaHex(abajo, '#FAFAF7', 0.55)); n.m.opacity = llueve ? 0.92 : 0.7; });
  palomas.piezas.forEach(p => p.g.traverse(m => { if (m.material && m.material.color && !m.userData.c0) m.userData.c0 = m.material.color.getHex(); if (m.userData.c0 !== undefined) { _ca.setHex(m.userData.c0); m.material.color.set(mezclaHex('#' + _ca.getHexString(), est.edif, 0.35)); } }));
  const bloque = Math.floor(t0.h * 6);
  if (bloque !== ventanaEstado.bloque || ventanaEstado.lluvia !== llueve) {   // las ventanas, cada 10 minutos
    ventanaEstado.bloque = bloque;
    pintaFachada(TEX_CIUDAD, est, bloque, 0.42, 100); pintaFachada(TEX_BARRIO, est, bloque, bruma(14), 50000);
  }
  luzAviso.forEach(m => { m.visible = est.farolas > 0.3; });
  coches.forEach(c => { c.m.visible = est.farolas > 0.2; });
  // la luz de la habitación: de día entra por la ventana (menos con el estor bajado); de noche, algo de luz fría
  const dia = clamp((sol + 0.1) / 0.5, 0, 1) * (llueve ? 0.55 : 1), filtro = 1 - ventanaEstado.estor * 0.8;
  luzVentana.color.set(mezclaHex('#A99EF5', mezclaHex(est.abajo, '#FFFFFF', 0.5), dia)); luzVentana.intensity = (0.12 + dia * 1.5) * filtro;
  ventanaEstado.dia = dia * 0.85 * filtro; techoAtras.intensity = 0.4 + dia * 0.45 * filtro;
  hemi.intensity = (lamparaOn ? 0.62 : 0.32) + ventanaEstado.dia + (luzTecho.on ? 0.25 : 0); hemi.color.set(mezclaHex('#A99EF5', est.arriba, 0.5 * dia));
  ventanaEstado.lluvia = llueve; ventanaEstado.h = t0.h; ventanaEstado.momento = momentoDelDia(t0.h);
}
function corrVentana(t, dt) {
  const t0 = ahoraCanarias(), minuto = Math.floor(t0.h * 60);
  if (minuto !== ventanaEstado.minuto) { ventanaEstado.minuto = minuto; repintaFuera(t0); }
  corrReloj(t0, dt);
  // solo se mueve lo de fuera si se puede ver (la cámara mira hacia la ventana y la ventana está delante)
  const mirando = Math.cos(cam.yaw) > -0.2 && cam.pos.z > SALA.z0 - 0.1 || (rig.foco && rig.foco.pos.z < 0.6);
  fuera.visible = mirando || ventanaEstado.estor < 0.98;
  if (!mirando || reduced) { if (reduced && ventanaEstado.ultVivo === 0) { ventanaEstado.ultVivo = 1; corrPalomas(t, t0.h, ventanaEstado.lluvia); corrLluvia(t, ventanaEstado.lluvia); } return; }
  const s = t / 1000;
  nubes.forEach(n => { n.g.position.x += n.v * dt; if (n.g.position.x > 280) n.g.position.x = -280; });
  const aviso = Math.floor(t / 900) % 2 === 0; luzAviso.forEach(m => { m.material.color.setHex(aviso ? 0xFF3B2A : 0x5A1810); });
  ropa.forEach(r => { r.g.rotation.x = Math.sin(s * 1.6 + r.fase) * 0.25 + 0.1; r.g.rotation.z = Math.sin(s * 1.1 + r.fase * 2) * 0.08; });
  coches.forEach(c => { c.f = (c.f + c.v * dt * 3 + 1) % 1; curvaVia.getPointAt(c.f, c.m.position); });
  // humo: cada partícula sube, se abre y se deshace
  { const H = humo; for (let i = 0; i < H.N; i++) { const [a, b] = H.sem[i], f = (b + s * 0.08) % 1; H.p.set([H.o.x + Math.sin(f * 5 + a * 9) * 0.4 * f + f * 0.9, H.o.y + f * 3.2, H.o.z + Math.cos(a * 7) * 0.3 * f], i * 3); } H.m.geometry.attributes.position.needsUpdate = true; H.m.visible = !ventanaEstado.lluvia; }
  // el avión: cruza el cielo cada pocos minutos (de noche se ven sus luces que parpadean)
  if (t - avion.t0 > 150000) avion.t0 = t;
  { const f = (t - avion.t0) / 60000; avion.g.visible = f < 1; if (avion.g.visible) { avion.g.position.set(lerp(-320, 320, f), 95 - f * 25, -300); avion.g.rotation.set(0, 0, -0.05); const b = Math.floor(t / 600) % 2 === 0; avion.luzR.visible = b; avion.luzB.visible = !b; } }
  // gente en las ventanas: alguien se asoma de vez en cuando (solo si hay luz)
  const est = ventanaEstado.est;
  siluetas.forEach((p, i) => {
    if (!p.dur && est && est.ventanas > 0.2 && Math.random() < 0.0015) { p.t0 = t; p.dur = 6000 + Math.random() * 6000; }
    const f = p.dur ? (t - p.t0) / p.dur : 1; p.m.material.opacity = p.dur ? 0.85 * Math.min(1, f * 5, (1 - f) * 5) : 0; if (f >= 1) p.dur = 0;
  });
  if (t - ventanaEstado.ultVivo > 33) { ventanaEstado.ultVivo = t; corrPalomas(t, t0.h, ventanaEstado.lluvia); corrLluvia(t, ventanaEstado.lluvia); }
}
/* ---------- el reloj de pared: muestra la hora (la real o la que pongas) ---------- */
const relojMostrado = { h: null };
function corrReloj(t0, dt) {
  // las agujas persiguen a la hora con un suavizado: al cambiarla o al volver a la real giran, no saltan
  const obj = t0.h; if (relojMostrado.h === null || reduced) relojMostrado.h = obj;
  let dif = obj - relojMostrado.h; dif -= Math.round(dif / 24) * 24;
  relojMostrado.h += dif * (1 - Math.exp(-dt * 6));
  const h = ((relojMostrado.h % 24) + 24) % 24, hh = h % 12, mm = (h * 60) % 60, ss = (horaReal().h * 3600) % 60;
  agujaH.rotation.z = -hh / 12 * Math.PI * 2; agujaM.rotation.z = -mm / 60 * Math.PI * 2; agujaS.rotation.z = -(reduced ? 0 : Math.floor(ss)) / 60 * Math.PI * 2;
}
window.__slHora = () => { const t = ahoraCanarias(); return { hora: +t.h.toFixed(3), momento: momentoDelDia(t.h), lluvia: llueveA(t), luna: +iluminadaLuna(edadLuna()).toFixed(2), forzada: HORA_FORZADA !== null }; };
// para los guiones de grabar.js: cambiar la hora y la lluvia sin recargar (__slFuerza(21.5, true); null vuelve a la real). No se guarda
window.__slFuerza = (h, lluvia) => { ponHora(h === null ? null : clamp(+h, 0, 23.999), false); if (lluvia !== undefined) LLUVIA_FORZADA = lluvia; palomas.lista.forEach(p => { p.pieza.g.visible = false; }); palomas.lista = []; palomas.proxima = 0; lluviaPintada = null; relojMostrado.h = null; return window.__slHora(); };
