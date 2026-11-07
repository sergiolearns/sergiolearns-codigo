/* ===================== 03 · habitación =====================
   Lo que no se mueve. v0.2.1 (E33, E34): habitación de 2,95 × 3,80 m con la
   ventana detrás del monitor, la estantería en la pared derecha, el póster y la
   puerta detrás, y la cama, el corcho, los trofeos, el sillón y el armario.
   Las medidas salen de una sola tabla: material/v0.2.1/scripts/plano.py. */
const SALA = { x0: -1.2, x1: 1.75, z0: -1.2, z1: 2.6, alto: 2.6 };
const FONDO = SALA.z1;                         // pared de atrás: 2,05 m detrás de la silla
const SALA_CX = (SALA.x0 + SALA.x1) / 2, SALA_CZ = (SALA.z0 + SALA.z1) / 2, SALA_W = SALA.x1 - SALA.x0, SALA_D = SALA.z1 - SALA.z0;
const VENTANA = { x0: -0.8, x1: 0.8, y0: 1.0, y1: 2.1 };
const PUERTA_X = 0.25;                          // bisagra de la puerta (antes 0,03)
const wallM = mat(0x221E33), floorM = mat(0x16131F);
plano(SALA_W, SALA_D, floorM, SALA_CX, 0, SALA_CZ, -Math.PI / 2);
plano(SALA_W, SALA_D, mat(0x1E1B2E), SALA_CX, SALA.alto, SALA_CZ, Math.PI / 2);
plano(SALA_D, SALA.alto, wallM, SALA.x0, SALA.alto / 2, SALA_CZ, 0, Math.PI / 2);     // izquierda
plano(SALA_D, SALA.alto, wallM, SALA.x1, SALA.alto / 2, SALA_CZ, 0, -Math.PI / 2);    // derecha
// pared de enfrente con el hueco de la ventana (cuatro trozos alrededor)
function paredConHueco(z, giro, hx0, hx1, hy0, hy1) {
  const sgn = giro ? -1 : 1, r = giro ? Math.PI : 0;
  plano(hx0 - SALA.x0, SALA.alto, wallM, (SALA.x0 + hx0) / 2, SALA.alto / 2, z, 0, r);
  plano(SALA.x1 - hx1, SALA.alto, wallM, (hx1 + SALA.x1) / 2, SALA.alto / 2, z, 0, r);
  if (hy0 > 0) plano(hx1 - hx0, hy0, wallM, (hx0 + hx1) / 2, hy0 / 2, z, 0, r);
  plano(hx1 - hx0, SALA.alto - hy1, wallM, (hx0 + hx1) / 2, (hy1 + SALA.alto) / 2, z, 0, r);
  return sgn;
}
paredConHueco(SALA.z0, false, VENTANA.x0, VENTANA.x1, VENTANA.y0, VENTANA.y1);
paredConHueco(FONDO, true, PUERTA_X, PUERTA_X + 0.85, 0, 2.0);
box(SALA_W, 0.08, 0.01, mat(0x1E1B2E), SALA_CX, 0.04, SALA.z0 + 0.01);
box(0.01, 0.08, SALA_D, mat(0x1E1B2E), SALA.x1 - 0.006, 0.04, SALA_CZ);
box(0.01, 0.08, SALA_D, mat(0x1E1B2E), SALA.x0 + 0.006, 0.04, SALA_CZ);

/* la ventana: marco, alféizar, parteluz y cristal (lo de fuera está en el módulo 11) */
const marcoM = mat(0x2E2A42, { r: 0.55 });
{
  const { x0, x1, y0, y1 } = VENTANA, w = x1 - x0, h = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, z = SALA.z0;
  // el grosor del muro (12 cm): cuatro caras interiores del hueco
  plano(w, 0.12, wallM, cx, y0, z - 0.06, -Math.PI / 2, 0); plano(w, 0.12, mat(0x1A1729), cx, y1, z - 0.06, Math.PI / 2, 0);
  plano(0.12, h, wallM, x0, cy, z - 0.06, 0, Math.PI / 2); plano(0.12, h, wallM, x1, cy, z - 0.06, 0, -Math.PI / 2);
  box(w + 0.08, 0.05, 0.05, marcoM, cx, y1 - 0.025, z - 0.1); box(w + 0.08, 0.05, 0.05, marcoM, cx, y0 + 0.025, z - 0.1);
  box(0.05, h, 0.05, marcoM, x0 + 0.025, cy, z - 0.1); box(0.05, h, 0.05, marcoM, x1 - 0.025, cy, z - 0.1);
  box(0.04, h - 0.05, 0.04, marcoM, cx, cy, z - 0.1);                           // parteluz: dos hojas
  box(w + 0.14, 0.03, 0.17, mat(0x3A3552, { r: 0.5 }), cx, y0 - 0.012, z + 0.03);   // alféizar
}
const cristal = plano(VENTANA.x1 - VENTANA.x0, VENTANA.y1 - VENTANA.y0, new THREE.MeshBasicMaterial({ color: 0xC9C5DC, transparent: true, opacity: 0.05, depthWrite: false }), 0, (VENTANA.y0 + VENTANA.y1) / 2, SALA.z0 - 0.1);

/* mesa */
const deskM = mat(0x2E2A42, { r: 0.7 });
box(1.9, 0.04, 0.75, deskM, 0, 0.72, -0.35);
[[-0.9, -0.69], [0.9, -0.69], [-0.9, -0.02], [0.9, -0.02]].forEach(p => box(0.04, 0.7, 0.04, mat(0x2E2A42), p[0], 0.35, p[1]));
box(0.5, 0.1, 0.02, deskM, -0.7, 0.65, 0.015);
box(0.5, 0.1, 0.02, deskM, 0.7, 0.65, 0.015);

/* monitor */
const screenTex = texFrom(1024, 592);
const bezel = box(0.68, 0.41, 0.03, mat(0x1E1B2E, { r: 0.5 }), 0, 1.06, -0.6);
const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.64, 0.37), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }));
screen.position.set(0, 1.06, -0.584); scene.add(screen);
box(0.05, 0.24, 0.04, mat(0x5A566E, { r: 0.5, m: 0.3 }), 0, 0.86, -0.63);
box(0.24, 0.012, 0.16, mat(0x5A566E, { r: 0.5, m: 0.3 }), 0, 0.746, -0.62);
const screenLight = new THREE.PointLight(0xA99EF5, 1.2, 0, 2); screenLight.position.set(0, 1.06, -0.4); scene.add(screenLight);

/* teclado: una sola malla instanciada; las teclas se hunden al escribir */
box(0.46, 0.018, 0.15, mat(0x1E1B2E, { r: 0.55 }), 0, 0.749, -0.2);
const KC = 14, KR = 4;
const keys = new THREE.InstancedMesh(new THREE.BoxGeometry(0.026, 0.01, 0.026), mat(0x3A3552, { r: 0.6 }), KC * KR); scene.add(keys);
const keyBase = [], dummy = new THREE.Object3D();
for (let r = 0; r < KR; r++) for (let c = 0; c < KC; c++) {
  const kx = -0.198 + c * 0.0305 + (r % 2) * 0.008, kz = -0.248 + r * 0.032;
  keyBase.push([kx, 0.762, kz]); dummy.position.set(kx, 0.762, kz); dummy.updateMatrix(); keys.setMatrixAt(r * KC + c, dummy.matrix);
}
const space = box(0.17, 0.01, 0.026, mat(0x5B4BDB, { r: 0.55, e: 0x5B4BDB, ei: 0.15 }), 0, 0.762, -0.12);
const kbHit = box(0.46, 0.04, 0.15, new THREE.MeshBasicMaterial({ visible: false }), 0, 0.765, -0.2);
const keyPress = {};
function pressKey(i) { i = ((i % (KC * KR)) + KC * KR) % (KC * KR); keyPress[i] = performance.now(); }
function updateKeys(now) {
  let any = false;
  for (const k in keyPress) {
    const dt = now - keyPress[k], d = dt < 70 ? -0.006 : (dt < 160 ? -0.006 * (1 - (dt - 70) / 90) : 0);
    const b = keyBase[k]; dummy.position.set(b[0], b[1] + d, b[2]); dummy.updateMatrix(); keys.setMatrixAt(+k, dummy.matrix); any = true;
    if (dt >= 160) delete keyPress[k];
  }
  if (any) keys.instanceMatrix.needsUpdate = true;
}
/* el ratón de la mesa: con la rueda encima se ajusta la sensibilidad (E37). Sus cinco LED dicen el nivel */
const raton = new THREE.Group(); raton.position.set(0.33, 0.75, -0.2); scene.add(raton);
const ratonCuerpo = box(0.055, 0.022, 0.09, mat(0x1E1B2E, { r: 0.4 }), 0, 0, 0, raton);
const ratonRueda = cyl(0.007, 0.007, 0.006, mat(0x5A566E, { r: 0.4 }), 0, 0.012, -0.022, raton, 16); ratonRueda.rotation.z = Math.PI / 2;
const ratonLeds = [0, 1, 2, 3, 4].map(i => box(0.004, 0.003, 0.006, mat(0x3A3552, { e: 0xFF6B4A, ei: 0 }), -0.012 + i * 0.006, 0.0115, 0.02, raton));

/* lámpara con su interruptor (E09) y el polvo en la luz */
const metalM = () => mat(0x5A566E, { m: 0.3, r: 0.4 });
const lampBase = box(0.14, 0.02, 0.14, metalM(), -0.62, 0.75, -0.6);
box(0.016, 0.45, 0.016, metalM(), -0.62, 0.975, -0.6);
box(0.22, 0.016, 0.016, metalM(), -0.52, 1.2, -0.6);
const shade = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.11, 32, 1, true), mat(0xFF6B4A, { r: 0.55, side: THREE.DoubleSide })); shade.position.set(-0.42, 1.15, -0.6); scene.add(shade);
const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.026, 20, 12), mat(0xF5C06B, { e: 0xF5C06B, ei: 2.2 })); bulb.position.set(-0.42, 1.11, -0.6); scene.add(bulb);
const lampLight = new THREE.PointLight(0xF5C06B, 2.6, 0, 2); lampLight.position.set(-0.42, 1.06, -0.55); scene.add(lampLight);
const hemi = new THREE.HemisphereLight(0xA99EF5, 0x1E1B2E, 0.75); scene.add(hemi);
const techo = new THREE.PointLight(0xC9C5DC, 0.9, 0, 2); techo.position.set(0.25, 2.45, 0.8); scene.add(techo);
const techoAtras = new THREE.PointLight(0xC9C5DC, 0.55, 0, 2); techoAtras.position.set(0.3, 2.35, 2.0); scene.add(techoAtras);   // la habitación es más honda
// interruptor: una pieza que bascula sobre su eje (x)
const switchBox = box(0.034, 0.012, 0.022, mat(0x2E2A42, { r: 0.5 }), -0.62, 0.765, -0.546);
const rocker = new THREE.Group(); rocker.position.set(-0.62, 0.772, -0.546); scene.add(rocker);
const rockerMesh = box(0.022, 0.006, 0.016, mat(0xFAFAF7, { r: 0.4 }), 0, 0, 0, rocker); rocker.rotation.x = -0.28;
// polvo: puntos que flotan en el haz de la lámpara
const polvo = (() => {
  const N = 90, pos = new Float32Array(N * 3), sem = [];
  for (let i = 0; i < N; i++) { sem.push([Math.random(), Math.random(), Math.random(), 0.3 + Math.random()]); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const tex = texFrom(32, 32, (c, w, h) => { const gr = c.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, 'rgba(255,240,210,1)'); gr.addColorStop(1, 'rgba(255,240,210,0)'); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
  const m = new THREE.PointsMaterial({ size: 0.006, map: tex, transparent: true, depthWrite: false, opacity: 0.55, blending: THREE.AdditiveBlending });
  const p = new THREE.Points(g, m); scene.add(p);
  return { p, pos, sem, N };
})();
function corrPolvo(t, encendida) {
  polvo.p.visible = encendida; if (!encendida) return;
  const { pos, sem, N } = polvo, s = reduced ? 0 : t / 1000;
  for (let i = 0; i < N; i++) {
    const [a, b, c, v] = sem[i];
    const y = 0.78 + ((b + s * 0.012 * v) % 1) * 0.3;
    const r = 0.03 + (1.1 - y) * 0.4 * a;
    const ang = c * Math.PI * 2 + s * 0.15 * v;
    pos[i * 3] = -0.42 + Math.cos(ang) * r; pos[i * 3 + 1] = y; pos[i * 3 + 2] = -0.58 + Math.sin(ang) * r;
  }
  polvo.p.geometry.attributes.position.needsUpdate = true;
}

/* torre: disquetera, puerto USB, botón de expulsar, botón de encendido y LED */
const tower = box(0.2, 0.46, 0.4, mat(0x1E1B2E, { r: 0.45, m: 0.2 }), 0.82, 0.97, -0.42);
const slot = box(0.16, 0.022, 0.003, mat(0x141221, { e: 0xFF6B4A, ei: 0 }), 0.82, 1.1, -0.2185);
for (let v = 0; v < 6; v++) box(0.12, 0.004, 0.002, mat(0x3A3552), 0.82, 0.83 + v * 0.022, -0.219);
const led = new THREE.Mesh(new THREE.SphereGeometry(0.006, 12, 8), mat(0xFF6B4A, { e: 0xFF6B4A, ei: 1.2 })); led.position.set(0.885, 1.16, -0.218); scene.add(led);
const ejectBtn = box(0.022, 0.008, 0.006, mat(0x5A566E, { r: 0.4 }), 0.885, 1.08, -0.218);
const powerBtn = cyl(0.011, 0.011, 0.006, mat(0x3A3552, { r: 0.4, e: 0x5B4BDB, ei: 0.3 }), 0.775, 1.16, -0.218); powerBtn.rotation.x = Math.PI / 2;
const usbPort = box(0.03, 0.012, 0.004, mat(0x0E0C16, { e: 0xFF6B4A, ei: 0 }), 0.87, 0.97, -0.2185);
const tray = new THREE.Group(); tray.position.set(0.82, 1.1, -0.287); scene.add(tray);
const trayMesh = box(0.15, 0.008, 0.13, mat(0x2E2A42, { r: 0.5, e: 0xFF6B4A, ei: 0 }), 0, 0, 0, tray);
const TRAY_CERRADA = -0.287, TRAY_ABIERTA = -0.152;

/* estantería, ahora en la pared derecha (E34): dos baldas a la altura de los ojos */
const shelfM = mat(0x3A3552, { r: 0.6 });
const ESTANTE = { x: SALA.x1, z0: -0.95, z1: 0.5, y: { 1: 1.3, 2: 1.68 }, fondo: 0.24 };
[1, 2].forEach(f => {
  box(ESTANTE.fondo, 0.025, ESTANTE.z1 - ESTANTE.z0, shelfM, ESTANTE.x - ESTANTE.fondo / 2, ESTANTE.y[f], (ESTANTE.z0 + ESTANTE.z1) / 2);
  [ESTANTE.z0 + 0.08, ESTANTE.z1 - 0.08].forEach(z => box(0.12, 0.06, 0.012, mat(0x5A566E, { m: 0.3 }), ESTANTE.x - 0.06, ESTANTE.y[f] - 0.04, z));
});

/* póster (físico: un póster impreso, sin terminal), ahora en la pared de atrás */
const posterTex = texFrom(512, 720, (c, w, h) => {
  c.fillStyle = '#1E1B2E'; c.fillRect(0, 0, w, h);
  c.strokeStyle = '#FF6B4A'; c.lineWidth = 6; c.strokeRect(20, 20, w - 40, h - 40);
  c.fillStyle = '#FAFAF7'; c.font = '600 72px ' + DISP; c.fillText('sergio', 52, 160);
  c.fillStyle = '#A99EF5'; c.fillText('learns', 52, 236); c.fillStyle = '#FF6B4A'; c.fillText('_', 52 + c.measureText('learns').width + 4, 236);
  c.fillStyle = '#E8E6F5'; c.font = '500 30px ' + BODY; c.fillText('Aprendiendo', 52, 360); c.fillText('en público', 52, 400);
  c.fillStyle = '#C9C5DC'; c.font = '400 24px ' + BODY; c.fillText('Ciencia e Ingeniería de Datos', 52, 470); c.fillText('Gran Canaria · 2026', 52, 506);
  c.fillStyle = '#8E8AA3'; c.font = '400 20px ' + BODY; c.fillText('desde marzo de 2026 · 332 entradas', 52, 640);
});
const posterMesh = plano(0.4, 0.56, new THREE.MeshStandardMaterial({ map: posterTex, roughness: 0.6 }), -0.02, 1.43, FONDO - 0.006, 0, Math.PI);

/* marco de la pizarra y su bandeja (la pizarra en sí está en el módulo 09) */
const boardFrame = box(0.02, 0.92, 1.36, mat(0x5A566E, { r: 0.5 }), -1.19, 1.45, -0.35);
const boardTray = box(0.06, 0.012, 1.1, mat(0x5A566E, { r: 0.5 }), -1.165, 0.985, -0.35);

/* la puerta (detrás): bisagra en x = 0,25, se abre hacia dentro */
const door = new THREE.Group(); door.position.set(PUERTA_X, 0, FONDO - 0.01); scene.add(door);
const doorSlab = box(0.85, 2.0, 0.04, mat(0x3A3552, { r: 0.65 }), 0.425, 1.0, 0, door);
const doorPanelM = mat(0x2E2A42, { r: 0.7 });
box(0.6, 0.7, 0.006, doorPanelM, 0.425, 1.45, -0.022, door); box(0.6, 0.7, 0.006, doorPanelM, 0.425, 0.55, -0.022, door);
const doorKnob = new THREE.Group(); doorKnob.position.set(0.77, 1.0, -0.04); door.add(doorKnob);
const knobMesh = box(0.11, 0.018, 0.018, mat(0xC9C5DC, { m: 0.7, r: 0.3 }), -0.04, 0, 0, doorKnob);
cyl(0.024, 0.024, 0.012, mat(0xC9C5DC, { m: 0.7, r: 0.3 }), 0, 0, 0.012, doorKnob).rotation.x = Math.PI / 2;
const notaTex = texFrom(256, 200, (c, w, h) => {
  c.fillStyle = '#F7F1D9'; c.fillRect(0, 0, w, h);
  c.fillStyle = '#2E2A42'; c.font = '700 46px ' + MANO; c.fillText('Volver', 30, 80); c.fillText('a la web', 30, 132);
  c.strokeStyle = '#C93F22'; c.lineWidth = 5; c.beginPath(); c.moveTo(150, 170); c.lineTo(220, 170); c.lineTo(205, 158); c.moveTo(220, 170); c.lineTo(205, 182); c.stroke();
});
const nota = plano(0.16, 0.125, new THREE.MeshStandardMaterial({ map: notaTex, roughness: 0.9 }), 0.425, 1.62, -0.027, 0, Math.PI, door); nota.rotation.z = 0.04;
const frameM = mat(0x2E2A42, { r: 0.6 });
box(0.04, 2.04, 0.06, frameM, PUERTA_X - 0.02, 1.02, FONDO); box(0.04, 2.04, 0.06, frameM, PUERTA_X + 0.87, 1.02, FONDO); box(0.93, 0.04, 0.06, frameM, PUERTA_X + 0.425, 2.02, FONDO);
const pasillo = plano(0.85, 2.0, new THREE.MeshBasicMaterial({ color: 0xFFE9C9 }), PUERTA_X + 0.425, 1.0, FONDO + 0.22, 0, Math.PI);
const pasilloLuz = new THREE.PointLight(0xFFE2B8, 0, 0, 2); pasilloLuz.position.set(PUERTA_X + 0.42, 1.3, FONDO - 0.1); scene.add(pasilloLuz);
const luzPuerta = new THREE.PointLight(0xC9C5DC, 0.5, 0, 2); luzPuerta.position.set(PUERTA_X + 0.42, 1.8, FONDO - 0.6); scene.add(luzPuerta);
box(0.02, 2.0, 0.22, mat(0x221E33), PUERTA_X, 1.0, FONDO + 0.11); box(0.02, 2.0, 0.22, mat(0x221E33), PUERTA_X + 0.85, 1.0, FONDO + 0.11);

/* ---------- muebles nuevos (E34): en su sitio con formas sencillas; sus funciones, en la v0.3 ---------- */
// alfombra bajo la silla
const alfombraTex = texFrom(256, 330, (c, w, h) => { c.fillStyle = '#2E2A60'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(169,158,245,.35)'; c.lineWidth = 6; c.strokeRect(14, 14, w - 28, h - 28); c.fillStyle = 'rgba(255,107,74,.25)'; for (let y = 40; y < h - 30; y += 26) c.fillRect(30, y, w - 60, 3); });
plano(1.08, 1.4, new THREE.MeshStandardMaterial({ map: alfombraTex, roughness: 0.95 }), 0.26, 0.004, 0.75, -Math.PI / 2);
// cama a lo largo de la pared izquierda, con el cabecero en la de atrás
const CAMA = { x0: -1.2, x1: -0.32, z0: 0.72, z1: 2.6 };
const camaG = new THREE.Group(); scene.add(camaG);
{
  const cx = (CAMA.x0 + CAMA.x1) / 2, cz = (CAMA.z0 + CAMA.z1) / 2, w = CAMA.x1 - CAMA.x0, l = CAMA.z1 - CAMA.z0;
  box(w, 0.24, l, mat(0x2E2A42, { r: 0.7 }), cx, 0.14, cz, camaG);
  box(w - 0.04, 0.17, l - 0.08, mat(0xE8E6F5, { r: 0.95 }), cx, 0.345, cz - 0.01, camaG);
  const manta = box(w + 0.02, 0.035, 1.3, mat(0x4638B8, { r: 0.92 }), cx, 0.445, CAMA.z0 + 0.64, camaG);
  box(w + 0.02, 0.012, 0.06, mat(0xFF6B4A, { r: 0.9 }), cx, 0.466, CAMA.z0 + 1.27, camaG);   // la vuelta de la sábana
  box(0.58, 0.1, 0.3, mat(0xFAFAF7, { r: 0.95 }), cx, 0.49, CAMA.z1 - 0.24, camaG);          // almohada
  box(w, 0.95, 0.05, mat(0x2E2A42, { r: 0.7 }), cx, 0.475, CAMA.z1 - 0.03, camaG);            // cabecero
  camaG.userData.manta = manta;
}
// corcho encima de la cama: la historia de la web en fotos y entradas (los logros, en la v0.3)
const CORCHO_POS = { x: SALA.x0 + 0.02, y: 1.375, z: 1.65, w: 1.0, h: 0.65 };
const corchoTex = texFrom(1024, 666, (c, w, h) => dibujaCorcho(c, w, h));
const corchoMarco = box(0.02, CORCHO_POS.h + 0.04, CORCHO_POS.w + 0.04, mat(0x5A566E, { r: 0.6 }), SALA.x0 + 0.01, CORCHO_POS.y, CORCHO_POS.z);
const corchoMesh = plano(CORCHO_POS.w, CORCHO_POS.h, new THREE.MeshStandardMaterial({ map: corchoTex, roughness: 0.95 }), SALA.x0 + 0.021, CORCHO_POS.y, CORCHO_POS.z, 0, Math.PI / 2);
function dibujaCorcho(c, w, h) {
  // corcho: un fondo con grano (pseudoaleatorio con semilla, para que salga igual siempre)
  let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  c.fillStyle = '#B98A55'; c.fillRect(0, 0, w, h);
  for (let i = 0; i < 2600; i++) { c.fillStyle = rnd() < 0.5 ? 'rgba(90,55,25,.18)' : 'rgba(255,230,190,.14)'; c.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 4, 2 + rnd() * 3); }
  const ancho = 220, alto = 190, cols = 4;
  CORCHO.forEach((it, i) => {
    const col = i % cols, fila = Math.floor(i / cols);
    const x = 30 + col * 246 + (fila % 2) * 18 + (rnd() - 0.5) * 16, y = 26 + fila * 212 + (rnd() - 0.5) * 12, giro = (rnd() - 0.5) * 0.12;
    c.save(); c.translate(x + ancho / 2, y + alto / 2); c.rotate(giro); c.translate(-ancho / 2, -alto / 2);
    c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 8; c.shadowOffsetY = 3;
    if (it.tipo === 'foto') {                       // foto instantánea: marco crema y la foto en color
      c.fillStyle = '#FBF8EF'; c.fillRect(0, 0, ancho, alto); c.shadowColor = 'transparent';
      c.fillStyle = it.color; c.fillRect(12, 12, ancho - 24, 112);
      c.fillStyle = 'rgba(255,255,255,.18)'; c.beginPath(); c.arc(60, 52, 22, 0, Math.PI * 2); c.fill();
      c.fillStyle = 'rgba(20,18,33,.35)'; c.beginPath(); c.moveTo(12, 124); c.lineTo(90, 70); c.lineTo(140, 104); c.lineTo(170, 84); c.lineTo(ancho - 12, 124); c.fill();
      c.fillStyle = '#2E2A42'; c.font = '700 30px ' + MANO; c.fillText(it.t, 14, 152);
      c.font = '600 22px ' + MANO; wrap(c, it.s, 14, 176, ancho - 24, 20);
    } else if (it.tipo === 'entrada') {             // entrada de concierto: talón con agujeros
      c.fillStyle = it.color; c.fillRect(0, 30, ancho, 120); c.shadowColor = 'transparent';
      c.fillStyle = '#FBF8EF'; c.fillRect(ancho - 52, 30, 52, 120);
      c.fillStyle = '#B98A55'; for (let yy = 36; yy < 150; yy += 14) { c.beginPath(); c.arc(ancho - 52, yy, 3, 0, Math.PI * 2); c.fill(); }
      c.fillStyle = '#FAFAF7'; c.font = '600 24px ' + DISP; c.fillText(it.t, 14, 66);
      c.font = '500 17px ' + BODY; wrap(c, it.s, 14, 94, ancho - 76, 21);
      c.save(); c.translate(ancho - 20, 138); c.rotate(-Math.PI / 2); c.fillStyle = '#2E2A42'; c.font = '600 15px ' + BODY; c.fillText('ADMITE 1', 0, 0); c.restore();
    } else {                                        // nota adhesiva
      c.fillStyle = it.color; c.fillRect(20, 10, ancho - 40, ancho - 40); c.shadowColor = 'transparent';
      c.fillStyle = '#2E2A42'; c.font = '700 30px ' + MANO; c.fillText(it.t, 34, 52);
      c.font = '600 24px ' + MANO; wrap(c, it.s, 34, 86, ancho - 72, 25);
    }
    c.restore();
    c.fillStyle = '#FF6B4A'; c.beginPath(); c.arc(x + ancho / 2, y + 8, 7, 0, Math.PI * 2); c.fill();
    c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.arc(x + ancho / 2 - 2, y + 6, 2.5, 0, Math.PI * 2); c.fill();
  });
  // el hueco de los logros
  const lx = 30 + 1 * 246 + 18, ly = 26 + 2 * 212;
  c.strokeStyle = 'rgba(30,27,46,.55)'; c.setLineDash([10, 8]); c.lineWidth = 3; c.strokeRect(lx, ly, 470, 170); c.setLineDash([]);
  c.fillStyle = 'rgba(30,27,46,.75)'; c.font = '700 38px ' + MANO; c.fillText('Aquí irán tus logros', lx + 30, ly + 74); c.font = '600 28px ' + MANO; c.fillText('(llegan en la v0.3)', lx + 30, ly + 114);
}
// estantería de trofeos en la pared derecha, encima del sillón (vacía hasta los logros de la v0.3)
const TROFEOS = { x: SALA.x1, z: 1.1, w: 0.7 };
const trofeosG = new THREE.Group(); scene.add(trofeosG);
const peanas = [];
[1.5, 1.8].forEach((y, f) => {
  box(0.18, 0.02, TROFEOS.w, shelfM, TROFEOS.x - 0.09, y, TROFEOS.z, trofeosG);
  for (let i = 0; i < 3; i++) peanas.push(box(0.07, 0.035, 0.07, mat(0x1E1B2E, { r: 0.4 }), TROFEOS.x - 0.09, y + 0.028, TROFEOS.z - 0.22 + i * 0.22, trofeosG));
});
const placaTex = texFrom(256, 64, (c, w, h) => { c.fillStyle = '#C9C5DC'; c.fillRect(0, 0, w, h); c.fillStyle = '#2E2A42'; c.font = '600 26px ' + BODY; c.textAlign = 'center'; c.fillText('Logros · v0.3', w / 2, 42); });
plano(0.16, 0.04, new THREE.MeshStandardMaterial({ map: placaTex, roughness: 0.4, metalness: 0.3 }), TROFEOS.x - 0.181, 1.475, TROFEOS.z, 0, -Math.PI / 2, trofeosG);
// sillón contra la pared derecha
const sillonG = new THREE.Group(); scene.add(sillonG);
const SILLON = { x0: 1.0, x1: SALA.x1, z0: 0.72, z1: 1.48 };
{
  const cz = (SILLON.z0 + SILLON.z1) / 2, wz = SILLON.z1 - SILLON.z0, M = mat(0xD9651C, { r: 0.9 }), M2 = mat(0xC2552E, { r: 0.9 });
  box(0.7, 0.26, wz - 0.04, M2, 1.39, 0.13, cz, sillonG);
  box(0.52, 0.12, wz - 0.24, M, 1.33, 0.32, cz, sillonG);
  box(0.18, 0.58, wz, M2, 1.65, 0.55, cz, sillonG);
  [SILLON.z0 + 0.06, SILLON.z1 - 0.06].forEach(z => box(0.7, 0.22, 0.12, M2, 1.39, 0.37, z, sillonG));
  const cojin = box(0.08, 0.22, 0.26, mat(0xE8E6F5, { r: 0.95 }), 1.53, 0.5, cz + 0.12, sillonG); cojin.rotation.z = 0.35; cojin.rotation.x = 0.12;
}
// armario: la personalización (ropa, temas), en la v0.3
const armarioG = new THREE.Group(); scene.add(armarioG);
const ARMARIO = { x0: 1.2, x1: SALA.x1, z0: 1.65, z1: 2.55 };
{
  const cx = (ARMARIO.x0 + ARMARIO.x1) / 2, cz = (ARMARIO.z0 + ARMARIO.z1) / 2;
  box(ARMARIO.x1 - ARMARIO.x0, 2.0, ARMARIO.z1 - ARMARIO.z0, mat(0x2A2640, { r: 0.6 }), cx, 1.0, cz, armarioG);
  box(0.006, 1.92, 0.004, mat(0x141221), ARMARIO.x0 - 0.002, 1.0, cz, armarioG);
  [cz - 0.05, cz + 0.05].forEach(z => box(0.02, 0.16, 0.016, mat(0xC9C5DC, { m: 0.7, r: 0.3 }), ARMARIO.x0 - 0.012, 1.05, z, armarioG));
}
// la mochila, apoyada en el armario
const mochila = box(0.14, 0.38, 0.3, mat(0x4638B8, { r: 0.85 }), 1.08, 0.19, 2.2); mochila.rotation.z = 0.08;
box(0.03, 0.12, 0.22, mat(0x5B4BDB, { r: 0.85 }), 1.0, 0.13, 2.2);
// reloj de pared con la hora de Canarias (lo mueve el módulo 11)
const RELOJ = { x: 1.25, y: 1.85, z: SALA.z0 };
const relojG = new THREE.Group(); relojG.position.set(RELOJ.x, RELOJ.y, RELOJ.z + 0.02); scene.add(relojG);
const esferaTex = texFrom(256, 256, (c, w, h) => {
  c.fillStyle = '#FAFAF7'; c.beginPath(); c.arc(128, 128, 126, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#1E1B2E'; c.font = '600 30px ' + DISP; c.textAlign = 'center'; c.textBaseline = 'middle';
  for (let i = 1; i <= 12; i++) { const a = i / 12 * Math.PI * 2; c.fillText(String(i), 128 + Math.sin(a) * 98, 128 - Math.cos(a) * 98); }
  c.fillStyle = '#8E8AA3'; c.font = '500 15px ' + BODY; c.fillText('Canarias', 128, 168);
});
const relojCaja = cyl(0.135, 0.135, 0.03, mat(0x1E1B2E, { r: 0.4 }), 0, 0, 0, relojG, 40); relojCaja.rotation.x = Math.PI / 2;
const esfera = plano(0.25, 0.25, new THREE.MeshStandardMaterial({ map: esferaTex, roughness: 0.5 }), 0, 0, 0.016, 0, 0, relojG);
const aguja = (l, a, color) => { const g = new THREE.Group(); g.position.z = 0.019 + a; relojG.add(g); box(a > 0.002 ? 0.004 : 0.008, l, 0.002, mat(color), 0, l / 2 - 0.012, 0, g); return g; };
const agujaH = aguja(0.065, 0, 0x1E1B2E), agujaM = aguja(0.095, 0.002, 0x1E1B2E), agujaS = aguja(0.1, 0.004, 0xFF6B4A);
