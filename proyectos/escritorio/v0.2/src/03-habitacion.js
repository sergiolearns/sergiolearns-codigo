/* ===================== 03 · habitación =====================
   Lo que no se mueve: paredes (con el hueco de la puerta), mesa, monitor, teclado,
   torre, lámpara, estantería, póster, marco de la pizarra y la puerta. */
const wallM = mat(0x221E33), floorM = mat(0x16131F);
const FONDO = 1.8;   // pared de atrás: 1,25 m detrás de la silla, para que la puerta se vea entera al girarse
plano(2.45, 3.0, floorM, 0.025, 0, 0.3, -Math.PI / 2);
plano(2.45, 2.6, wallM, 0.025, 1.3, -1.2);
plano(3.0, 2.6, wallM, -1.2, 1.3, 0.3, 0, Math.PI / 2);
plano(3.0, 2.6, wallM, 1.25, 1.3, 0.3, 0, -Math.PI / 2);
plano(2.45, 3.0, mat(0x1E1B2E), 0.025, 2.6, 0.3, Math.PI / 2);
// pared de atrás con el hueco de la puerta (x de 0,03 a 0,88; alto 2,0)
plano(1.23, 2.6, wallM, -0.585, 1.3, FONDO, 0, Math.PI);
plano(0.37, 2.6, wallM, 1.065, 1.3, FONDO, 0, Math.PI);
plano(0.85, 0.6, wallM, 0.455, 2.3, FONDO, 0, Math.PI);
box(2.45, 0.08, 0.01, mat(0x1E1B2E), 0.025, 0.04, -1.19);
box(2.45, 0.01, 0.005, mat(0xFF6B4A, { e: 0xFF6B4A, ei: 0.35 }), 0.025, 0.95, -1.195);

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
box(0.055, 0.02, 0.09, mat(0x1E1B2E, { r: 0.4 }), 0.33, 0.75, -0.2); // ratón

/* lámpara con su interruptor (E09) y el polvo en la luz */
const metalM = () => mat(0x5A566E, { m: 0.3, r: 0.4 });
const lampBase = box(0.14, 0.02, 0.14, metalM(), -0.62, 0.75, -0.6);
box(0.016, 0.45, 0.016, metalM(), -0.62, 0.975, -0.6);
box(0.22, 0.016, 0.016, metalM(), -0.52, 1.2, -0.6);
const shade = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.11, 32, 1, true), mat(0xFF6B4A, { r: 0.55, side: THREE.DoubleSide })); shade.position.set(-0.42, 1.15, -0.6); scene.add(shade);
const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.026, 20, 12), mat(0xF5C06B, { e: 0xF5C06B, ei: 2.2 })); bulb.position.set(-0.42, 1.11, -0.6); scene.add(bulb);
const lampLight = new THREE.PointLight(0xF5C06B, 2.6, 0, 2); lampLight.position.set(-0.42, 1.06, -0.55); scene.add(lampLight);
const hemi = new THREE.HemisphereLight(0xA99EF5, 0x1E1B2E, 0.75); scene.add(hemi);
const techo = new THREE.PointLight(0xC9C5DC, 0.9, 0, 2); techo.position.set(0.2, 2.45, 0.8); scene.add(techo);   // para que la pared de atrás no quede negra
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
    const y = 0.78 + ((b + s * 0.012 * v) % 1) * 0.3;           // sube despacio y vuelve a empezar
    const r = 0.03 + (1.1 - y) * 0.4 * a;                         // el cono se abre hacia abajo
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

/* estantería */
const shelfM = mat(0x3A3552, { r: 0.6 });
box(1.45, 0.025, 0.24, shelfM, 0, 1.62, -1.08);
box(1.45, 0.025, 0.24, shelfM, 0, 2.0, -1.08);

/* póster (físico: un póster impreso, sin terminal) */
const posterTex = texFrom(512, 720, (c, w, h) => {
  c.fillStyle = '#1E1B2E'; c.fillRect(0, 0, w, h);
  c.strokeStyle = '#FF6B4A'; c.lineWidth = 6; c.strokeRect(20, 20, w - 40, h - 40);
  c.fillStyle = '#FAFAF7'; c.font = '600 72px ' + DISP; c.fillText('sergio', 52, 160);
  c.fillStyle = '#A99EF5'; c.fillText('learns', 52, 236); c.fillStyle = '#FF6B4A'; c.fillText('_', 52 + c.measureText('learns').width + 4, 236);
  c.fillStyle = '#E8E6F5'; c.font = '500 30px ' + BODY; c.fillText('Aprendiendo', 52, 360); c.fillText('en público', 52, 400);
  c.fillStyle = '#C9C5DC'; c.font = '400 24px ' + BODY; c.fillText('Ciencia e Ingeniería de Datos', 52, 470); c.fillText('Gran Canaria · 2026', 52, 506);
});
plano(0.5, 0.7, new THREE.MeshStandardMaterial({ map: posterTex, roughness: 0.6 }), 1.24, 1.5, -0.3, 0, -Math.PI / 2);

/* marco de la pizarra y su bandeja (la pizarra en sí está en el módulo 09) */
const boardFrame = box(0.02, 0.92, 1.36, mat(0x5A566E, { r: 0.5 }), -1.19, 1.45, -0.35);
const boardTray = box(0.06, 0.012, 1.1, mat(0x5A566E, { r: 0.5 }), -1.165, 0.985, -0.35);

/* la puerta (detrás): bisagra en x = 0,03, se abre hacia dentro */
const door = new THREE.Group(); door.position.set(0.03, 0, FONDO - 0.01); scene.add(door);
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
// marco y la luz del pasillo detrás
const frameM = mat(0x2E2A42, { r: 0.6 });
box(0.04, 2.04, 0.06, frameM, 0.01, 1.02, FONDO); box(0.04, 2.04, 0.06, frameM, 0.9, 1.02, FONDO); box(0.93, 0.04, 0.06, frameM, 0.455, 2.02, FONDO);
const pasillo = plano(0.85, 2.0, new THREE.MeshBasicMaterial({ color: 0xFFE9C9 }), 0.455, 1.0, FONDO + 0.22, 0, Math.PI);
const pasilloLuz = new THREE.PointLight(0xFFE2B8, 0, 0, 2); pasilloLuz.position.set(0.45, 1.3, FONDO - 0.1); scene.add(pasilloLuz);
const luzPuerta = new THREE.PointLight(0xC9C5DC, 0.5, 0, 2); luzPuerta.position.set(0.45, 1.8, FONDO - 0.6); scene.add(luzPuerta);
box(0.02, 2.0, 0.22, mat(0x221E33), 0.03, 1.0, FONDO + 0.11); box(0.02, 2.0, 0.22, mat(0x221E33), 0.88, 1.0, FONDO + 0.11);
// un perchero con la mochila, para que la pared de atrás no esté vacía
box(0.4, 0.03, 0.04, mat(0x5A566E), -0.55, 1.62, FONDO - 0.02);
const mochila = box(0.3, 0.38, 0.14, mat(0x4638B8, { r: 0.85 }), -0.55, 1.36, FONDO - 0.08); mochila.rotation.z = 0.03;
box(0.22, 0.12, 0.03, mat(0x5B4BDB, { r: 0.85 }), -0.55, 1.28, FONDO - 0.155);
