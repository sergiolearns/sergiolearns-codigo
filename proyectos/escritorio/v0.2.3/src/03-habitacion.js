/* ===================== 03 · habitación =====================
   Lo que no se mueve. v0.2.3 (E56): el cuarto de Sergio, INSPIRADO en el suyo y LIMPIO (decisión de Sergio, 5 nov):
   la distribución de sus fotos (material/v0.2.3/fotos/), los muebles que importan y los colores de la paleta.
   Crece a 3,90 × 4,70 m y gana el pasillo de la entrada (0,95 × 1,10 m) con el altillo encima: la puerta está al fondo
   del pasillo. Al fondo del cuarto, la ventana con la mesa delante y el armario de tres puertas con su espejo; a la
   izquierda, la mesita de dos cajones, el corcho, la cama con el cabecero gris y el cuadro de la calle con la camiseta
   del Mundial 2018; a la derecha, la estantería, la pizarra y el zapatero blanco con la PS5 Pro y la tele; en la pared
   del pasillo, el sillón con su lámpara de pie, el cuadro de la ciudad entre la niebla y la balda de los trofeos.
   Las medidas salen de una sola tabla: material/v0.2.3/scripts/plano.py (y su plano.salida.json).
   Los grupos que no se mueven llevan userData.quieto: al cargar, sus piezas se juntan por material (módulo 14). */
const SALA = { x0: -2.65, x1: 1.25, z0: -1.2, z1: 3.5, alto: 2.6 };
const PASILLO = { x0: 0.30, x1: 1.25, z0: 3.5, z1: 4.6, alto: 2.0 };   // la entrada: dos o tres pasos, con el altillo encima
const FONDO = SALA.z1;                         // la pared del sillón (y la boca del pasillo)
const SALA_CX = (SALA.x0 + SALA.x1) / 2, SALA_CZ = (SALA.z0 + SALA.z1) / 2, SALA_W = SALA.x1 - SALA.x0, SALA_D = SALA.z1 - SALA.z0;
const VENTANA = { x0: -0.8, x1: 0.8, y0: 1.0, y1: 2.1 };
const PUERTA_X = 0.35;                          // bisagra de la puerta, al fondo del pasillo: se abre hacia dentro y queda contra el tabique
// Zonas de choque del suelo (de plano.py: mueble + 0,22 m de radio de la persona) y puntos a los que se camina
const RADIO_PERSONA = 0.22;
const OBSTACULOS = [   // [nombre, x0, x1, z0, z1] sin agrandar (el radio se suma al comprobar)
  ['mesa', -0.95, 0.95, -1.2, 0.025], ['armario', -2.62, -1.47, -1.2, -0.62], ['mesita', -2.65, -2.2, 0.25, 0.7],
  ['cama', -2.65, -0.7, 0.75, 2.1], ['sillon', -2.2, -1.4, 2.75, 3.45], ['lampara-pie', -2.6, -2.3, 3.15, 3.45],
  ['mesa-aux', -1.3, -0.9, 3.05, 3.45], ['zapatero', 0.88, 1.25, 2.35, 3.25]
];
// Dónde puede estar el centro de la persona: el cuarto y el pasillo encogidos por su radio (unión de dos rectángulos)
const ZONAS_LIBRES = [
  [SALA.x0 + RADIO_PERSONA, SALA.x1 - RADIO_PERSONA, SALA.z0 + RADIO_PERSONA, SALA.z1 - RADIO_PERSONA],
  [PASILLO.x0 + RADIO_PERSONA, PASILLO.x1 - RADIO_PERSONA, SALA.z1 - 0.5, PASILLO.z1 - RADIO_PERSONA]
];
const PUNTOS = {
  silla: { pos: [0, 0.55], mira: [0, 1.0, -1.2], sentado: true, nombre: 'la silla' },
  ventana: { pos: [-0.6, 0.42], mira: [0, 1.5, -1.6], nombre: 'la ventana' },
  estanteria: { pos: [0.6, 0.45], mira: [1.25, 1.45, -0.4], nombre: 'la estantería' },
  pizarra: { pos: [0.3, 1.15], mira: [1.25, 1.42, 1.15], nombre: 'la pizarra' },
  tele: { pos: [-0.05, 2.75], mira: [1.1, 1.45, 2.8], nombre: 'el rincón de juegos' },
  puerta: { pos: [0.9, 3.55], mira: [0.78, 1.2, 4.6], nombre: 'la puerta' },
  sillon: { pos: [-1.8, 2.42], mira: [-1.8, 0.55, 3.1], nombre: 'el sillón' },
  cama: { pos: [-0.35, 1.4], mira: [-1.5, 0.6, 1.4], nombre: 'la cama' },
  mesita: { pos: [-1.85, 0.42], mira: [-2.42, 0.62, 0.47], nombre: 'la mesita' },
  armario: { pos: [-2.05, 0.0], mira: [-2.05, 1.1, -0.62], nombre: 'el armario' },
  corcho: { pos: [-1.5, 0.15], mira: [-2.65, 1.48, 0.05], nombre: 'el corcho' }
};

/* ---------- paredes, suelo y techo ---------- */
const wallM = mat(0x2B2740, { r: 0.9 });
const sueloTex = texFrom(512, 512, (c, w, h) => {
  // tarima: tablas de 12 cm con vetas (como la de la foto, en un tono de la paleta)
  let s = 5; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let y = 0; y < h; y += 32) {
    let x = -rnd() * 200;
    while (x < w) {
      const l = 160 + rnd() * 180, t = rnd();
      c.fillStyle = `rgb(${84 + t * 14},${70 + t * 10},${72 + t * 8})`; c.fillRect(x, y, l, 31);
      c.fillStyle = 'rgba(30,27,46,.18)'; for (let k = 0; k < 4; k++) c.fillRect(x + rnd() * l, y + 4 + rnd() * 22, 30 + rnd() * 60, 1);
      c.fillStyle = 'rgba(20,18,33,.5)'; c.fillRect(x, y, 2, 31); x += l;
    }
    c.fillStyle = 'rgba(20,18,33,.55)'; c.fillRect(0, y + 31, w, 1);
  }
});
sueloTex.wrapS = sueloTex.wrapT = THREE.RepeatWrapping; sueloTex.repeat.set(SALA_W / 1.6, SALA_D / 1.6);
const floorM = new THREE.MeshLambertMaterial({ map: sueloTex });
plano(SALA_W, SALA_D, floorM, SALA_CX, 0, SALA_CZ, -Math.PI / 2);
{ const t2 = sueloTex.clone(); t2.repeat.set((PASILLO.x1 - PASILLO.x0) / 1.6, (PASILLO.z1 - PASILLO.z0) / 1.6); t2.offset.set(0.3, 0.1);
  plano(PASILLO.x1 - PASILLO.x0, PASILLO.z1 - PASILLO.z0, new THREE.MeshLambertMaterial({ map: t2 }), (PASILLO.x0 + PASILLO.x1) / 2, 0, (PASILLO.z0 + PASILLO.z1) / 2, -Math.PI / 2); }
const techoM = mat(0x26223A, { r: 0.95 });
plano(SALA_W, SALA_D, techoM, SALA_CX, SALA.alto, SALA_CZ, Math.PI / 2);
plano(PASILLO.x1 - PASILLO.x0, PASILLO.z1 - PASILLO.z0, techoM, (PASILLO.x0 + PASILLO.x1) / 2, PASILLO.alto, (PASILLO.z0 + PASILLO.z1) / 2, Math.PI / 2);   // el techo bajo del pasillo (el altillo)
plano(SALA_D, SALA.alto, wallM, SALA.x0, SALA.alto / 2, SALA_CZ, 0, Math.PI / 2);                                   // izquierda
plano(PASILLO.z1 - SALA.z0, SALA.alto, wallM, SALA.x1, SALA.alto / 2, (SALA.z0 + PASILLO.z1) / 2, 0, -Math.PI / 2);  // derecha (sigue por el pasillo)
plano(PASILLO.x0 - SALA.x0, SALA.alto, wallM, (SALA.x0 + PASILLO.x0) / 2, SALA.alto / 2, FONDO, 0, Math.PI);         // la pared del sillón
plano(PASILLO.z1 - PASILLO.z0, PASILLO.alto, wallM, PASILLO.x0, PASILLO.alto / 2, (PASILLO.z0 + PASILLO.z1) / 2, 0, Math.PI / 2);   // el tabique del pasillo
function paredConHueco(z, giro, hx0, hx1, hy0, hy1, x0 = SALA.x0, x1 = SALA.x1, alto = SALA.alto) {
  const r = giro ? Math.PI : 0;
  if (hx0 - x0 > 0.001) plano(hx0 - x0, alto, wallM, (x0 + hx0) / 2, alto / 2, z, 0, r);
  if (x1 - hx1 > 0.001) plano(x1 - hx1, alto, wallM, (hx1 + x1) / 2, alto / 2, z, 0, r);
  if (hy0 > 0) plano(hx1 - hx0, hy0, wallM, (hx0 + hx1) / 2, hy0 / 2, z, 0, r);
  if (alto - hy1 > 0.001) plano(hx1 - hx0, alto - hy1, wallM, (hx0 + hx1) / 2, (hy1 + alto) / 2, z, 0, r);
}
paredConHueco(SALA.z0, false, VENTANA.x0, VENTANA.x1, VENTANA.y0, VENTANA.y1);
paredConHueco(PASILLO.z1, true, PUERTA_X, PUERTA_X + 0.85, 0, 2.0, PASILLO.x0, PASILLO.x1, PASILLO.alto + 0.001);
const rodapieM = mat(0x1E1B2E);
box(SALA_W, 0.08, 0.012, rodapieM, SALA_CX, 0.04, SALA.z0 + 0.006);
box(PASILLO.x0 - SALA.x0, 0.08, 0.012, rodapieM, (SALA.x0 + PASILLO.x0) / 2, 0.04, FONDO - 0.006);
box(0.012, 0.08, PASILLO.z1 - SALA.z0, rodapieM, SALA.x1 - 0.006, 0.04, (SALA.z0 + PASILLO.z1) / 2); box(0.012, 0.08, SALA_D, rodapieM, SALA.x0 + 0.006, 0.04, SALA_CZ);
box(0.012, 0.08, PASILLO.z1 - PASILLO.z0, rodapieM, PASILLO.x0 + 0.006, 0.04, (PASILLO.z0 + PASILLO.z1) / 2);

/* ---------- la ventana: marco, alféizar, parteluz, cristal y el estor (lo de fuera está en el módulo 11) ---------- */
const marcoM = mat(0x2E2A42, { r: 0.55 });
{
  const { x0, x1, y0, y1 } = VENTANA, w = x1 - x0, h = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, z = SALA.z0;
  plano(w, 0.12, wallM, cx, y0, z - 0.06, -Math.PI / 2, 0); plano(w, 0.12, mat(0x1A1729), cx, y1, z - 0.06, Math.PI / 2, 0);
  plano(0.12, h, wallM, x0, cy, z - 0.06, 0, Math.PI / 2); plano(0.12, h, wallM, x1, cy, z - 0.06, 0, -Math.PI / 2);
  box(w + 0.08, 0.05, 0.05, marcoM, cx, y1 - 0.025, z - 0.1); box(w + 0.08, 0.05, 0.05, marcoM, cx, y0 + 0.025, z - 0.1);
  box(0.05, h, 0.05, marcoM, x0 + 0.025, cy, z - 0.1); box(0.05, h, 0.05, marcoM, x1 - 0.025, cy, z - 0.1);
  box(0.04, h - 0.05, 0.04, marcoM, cx, cy, z - 0.1);
  box(w + 0.14, 0.03, 0.17, mat(0x3A3552, { r: 0.5 }), cx, y0 - 0.012, z + 0.03);
}
const cristal = plano(VENTANA.x1 - VENTANA.x0, VENTANA.y1 - VENTANA.y0, new THREE.MeshBasicMaterial({ color: 0xC9C5DC, transparent: true, opacity: 0.05, depthWrite: false }), 0, (VENTANA.y0 + VENTANA.y1) / 2, SALA.z0 - 0.1);
// el estor (como el de la foto): un cajón arriba y una tela que baja; oscurece el cuarto de día (E49)
const estorCaja = rbox(VENTANA.x1 - VENTANA.x0 + 0.16, 0.09, 0.1, 0.02, mat(0x5A566E, { r: 0.6 }), 0, VENTANA.y1 + 0.08, SALA.z0 + 0.06);
const estorTex = texFrom(256, 256, (c, w, h) => { c.fillStyle = '#4A4660'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.04)'; for (let y = 0; y < h; y += 6) c.fillRect(0, y, w, 2); });
const estorTela = new THREE.Mesh(new THREE.PlaneGeometry(VENTANA.x1 - VENTANA.x0 + 0.1, 1), new THREE.MeshStandardMaterial({ map: estorTex, roughness: 0.95, side: THREE.DoubleSide }));
estorTela.geometry.translate(0, -0.5, 0); estorTela.position.set(0, VENTANA.y1 + 0.04, SALA.z0 + 0.05); estorTela.scale.y = 0.06; scene.add(estorTela);
const estorBarra = box(VENTANA.x1 - VENTANA.x0 + 0.12, 0.02, 0.02, mat(0x2E2A42), 0, VENTANA.y1 + 0.04 - 0.06, SALA.z0 + 0.05);

/* ---------- la mesa elevable (como la de la foto: tablero gris, patas en T) y la cajonera (E45) ---------- */
const deskM = mat(0x5A566E, { r: 0.6 }), pataM = mat(0xE8E6F5, { r: 0.45, m: 0.2 });
const tablero = rbox(1.9, 0.035, 0.75, 0.01, deskM, 0, 0.7225, -0.35);
[-0.88, 0.88].forEach(x => {
  rbox(0.06, 0.68, 0.06, 0.01, pataM, x, 0.36, -0.35);                 // columna
  rbox(0.07, 0.03, 0.7, 0.012, pataM, x, 0.015, -0.35);                // pie
  rbox(0.05, 0.04, 0.66, 0.01, pataM, x, 0.68, -0.35);                 // travesaño bajo el tablero
});
rbox(1.7, 0.05, 0.05, 0.01, pataM, 0, 0.68, -0.62);
const MANDO_MESA = rbox(0.09, 0.025, 0.035, 0.008, mat(0x2E2A42, { r: 0.4 }), 0.78, 0.69, 0.018);   // los botones de subir y bajar
// cajonera bajo la mesa, a la izquierda: cajón de arriba (material, la pista) y cajón de archivo (las carpetas, de pie)
const CAJONERA = { x: -0.62, z0: -0.68, z1: 0.0, w: 0.48, alto: 0.66 };
const cajoneraM = mat(0x3A3552, { r: 0.6 }), frenteM = mat(0xEEECF7, { r: 0.5 });
rbox(CAJONERA.w, CAJONERA.alto, CAJONERA.z1 - CAJONERA.z0 - 0.02, 0.012, cajoneraM, CAJONERA.x, CAJONERA.alto / 2 + 0.02, (CAJONERA.z0 + CAJONERA.z1) / 2 - 0.02);
[[-0.2, 0.02], [0.2, 0.02], [-0.2, -0.64], [0.2, -0.64]].forEach(([dx, dz]) => cyl(0.018, 0.018, 0.02, mat(0x1E1B2E), CAJONERA.x + dx, 0.01, dz));
// cajón de arriba: el «material» (una caja con su frente, notas y la tarjeta de la pista)
const cajonArriba = new THREE.Group(); cajonArriba.position.set(CAJONERA.x, 0.57, 0); scene.add(cajonArriba);
const cajonArribaFrente = rbox(CAJONERA.w - 0.02, 0.13, 0.02, 0.01, frenteM, 0, 0, 0.0, cajonArriba);
const cajonArribaTirador = rbox(0.16, 0.014, 0.02, 0.006, mat(0x2E2A42, { m: 0.5, r: 0.35 }), 0, 0.03, 0.02, cajonArriba);
box(CAJONERA.w - 0.06, 0.006, 0.5, mat(0x26223A), 0, -0.05, -0.26, cajonArriba);
box(0.006, 0.09, 0.5, mat(0x26223A), -(CAJONERA.w - 0.06) / 2, -0.01, -0.26, cajonArriba); box(0.006, 0.09, 0.5, mat(0x26223A), (CAJONERA.w - 0.06) / 2, -0.01, -0.26, cajonArriba);
// v0.2.3 (E56-16, decisión de Sergio): la calculadora de los exámenes, dos pósits y la tarjeta de la pista (que ahora se lee: módulo 12)
[[0xF5C06B, -0.15, -0.36], [0xA99EF5, -0.12, -0.4]].forEach(([c, x, z]) => box(0.07, 0.008, 0.07, mat(c, { r: 0.9 }), x, -0.042, z, cajonArriba));
const calculadora = new THREE.Group(); calculadora.position.set(-0.11, -0.039, -0.16); calculadora.rotation.y = 0.12; cajonArriba.add(calculadora);
rbox(0.08, 0.016, 0.155, 0.008, mat(0x2E2A42, { r: 0.45 }), 0, 0, 0, calculadora);
box(0.06, 0.002, 0.03, mat(0x9CB89A, { r: 0.3, e: 0x9CB89A, ei: 0.15 }), 0, 0.009, -0.05, calculadora);                         // la pantalla
for (let i = 0; i < 4; i++) for (let j = 0; j < 5; j++) box(0.012, 0.003, 0.01, mat(i === 3 && j > 2 ? 0xFF6B4A : 0x5A566E, { r: 0.5 }), -0.025 + i * 0.0167, 0.009, -0.012 + j * 0.017, calculadora);
const pistaTex = texFrom(512, 320, (c, w, h) => {
  c.fillStyle = '#FBF8EF'; c.fillRect(0, 0, w, h); c.fillStyle = '#C93F22'; c.fillRect(0, 0, w, 14);
  c.fillStyle = '#2E2A42'; c.font = '700 64px ' + MANO; c.fillText('Pista', 34, 92);
  c.font = '600 44px ' + MANO; c.fillText('Lo que no se ve también', 34, 170); c.fillText('está: busca en el PC.', 34, 222);
  c.fillStyle = '#5A566E'; c.font = '600 32px ' + MANO; c.fillText('(cuenta para un logro en la v0.3)', 34, 284);
});
const pistaCarta = plano(0.15, 0.094, new THREE.MeshLambertMaterial({ map: pistaTex }), 0.07, -0.043, -0.3, -Math.PI / 2, 0, cajonArriba);
pistaCarta.rotation.z = 0.08;
// cajón de archivo (el que se usa desde la v0.1, ahora en la cajonera): las carpetas van de pie (módulo 04)
const drawer = new THREE.Group(); drawer.position.set(CAJONERA.x, 0.26, 0); scene.add(drawer);
const drawerFront = rbox(CAJONERA.w - 0.02, 0.39, 0.02, 0.01, frenteM, 0, 0, 0.0, drawer);
const drawerHandle = rbox(0.18, 0.016, 0.022, 0.007, mat(0xFF6B4A, { e: 0xFF6B4A, ei: 0.2, r: 0.4 }), 0, 0.13, 0.021, drawer);
box(CAJONERA.w - 0.06, 0.008, 0.62, mat(0x26223A), 0, -0.17, -0.32, drawer);
box(0.008, 0.33, 0.62, mat(0x26223A), -(CAJONERA.w - 0.06) / 2, -0.01, -0.32, drawer); box(0.008, 0.33, 0.62, mat(0x26223A), (CAJONERA.w - 0.06) / 2, -0.01, -0.32, drawer);
box(CAJONERA.w - 0.06, 0.33, 0.008, mat(0x26223A), 0, -0.01, -0.63, drawer);
[-1, 1].forEach(s => box(0.006, 0.006, 0.6, mat(0x8E8AA3, { m: 0.6 }), s * (CAJONERA.w - 0.08) / 2, 0.15, -0.32, drawer));   // los raíles de las carpetas colgantes
// papelera bajo la mesa (derecha), como en la foto
{ const p = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.3, 28, 1, true), mat(0x1E1B2E, { r: 0.7, side: THREE.DoubleSide })); p.position.set(0.6, 0.15, -0.32); scene.add(p); cyl(0.1, 0.1, 0.01, mat(0x1E1B2E), 0.6, 0.005, -0.32); }

/* ---------- monitor moderno (E46): marco fino, pie en columna; apagado al entrar (E51) ---------- */
const screenTex = texFrom(1024, 592);
const bezel = rbox(0.66, 0.39, 0.022, 0.008, mat(0x141221, { r: 0.35, m: 0.2 }), 0, 1.06, -0.597);
rbox(0.3, 0.2, 0.03, 0.02, mat(0x1E1B2E, { r: 0.4 }), 0, 1.06, -0.615);       // la caja de atrás
const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.64, 0.37), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }));
screen.position.set(0, 1.065, -0.5855); scene.add(screen);
rbox(0.045, 0.27, 0.025, 0.01, mat(0x8E8AA3, { r: 0.35, m: 0.5 }), 0, 0.87, -0.635);
const pieMonitor = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.115, 0.012, 40), mat(0x8E8AA3, { r: 0.35, m: 0.5 })); pieMonitor.scale.z = 0.65; pieMonitor.position.set(0, 0.746, -0.6); scene.add(pieMonitor);
const screenLight = new THREE.PointLight(0xA99EF5, 0, 0, 2); screenLight.position.set(0, 1.06, -0.4); scene.add(screenLight);

/* ---------- teclado español (fallo 7): cada tecla con su letra; la que pulsas se hunde ----------
   Una sola malla: las teclas se juntan en una geometría (mergeGeometries) y cada vértice lleva el número
   de su tecla (aTecla). El sombreador baja la tecla i según uPres[i] (0 arriba, 1 hundida). Las letras
   van en un atlas: cada fila del teclado es una fila del lienzo, y cada tecla, su trozo (ancho = sus unidades). */
const TECLADO = [
  [['º', 1, 'Backquote'], ['1', 1, 'Digit1'], ['2', 1, 'Digit2'], ['3', 1, 'Digit3'], ['4', 1, 'Digit4'], ['5', 1, 'Digit5'], ['6', 1, 'Digit6'], ['7', 1, 'Digit7'], ['8', 1, 'Digit8'], ['9', 1, 'Digit9'], ['0', 1, 'Digit0'], ["'", 1, 'Minus'], ['¡', 1, 'Equal'], ['⌫', 2, 'Backspace']],
  [['⇥', 1.5, 'Tab'], ['Q', 1, 'KeyQ'], ['W', 1, 'KeyW'], ['E', 1, 'KeyE'], ['R', 1, 'KeyR'], ['T', 1, 'KeyT'], ['Y', 1, 'KeyY'], ['U', 1, 'KeyU'], ['I', 1, 'KeyI'], ['O', 1, 'KeyO'], ['P', 1, 'KeyP'], ['`', 1, 'BracketLeft'], ['+', 1, 'BracketRight'], ['↵', 1.5, 'Enter']],
  [['Bloq', 1.75, 'CapsLock'], ['A', 1, 'KeyA'], ['S', 1, 'KeyS'], ['D', 1, 'KeyD'], ['F', 1, 'KeyF'], ['G', 1, 'KeyG'], ['H', 1, 'KeyH'], ['J', 1, 'KeyJ'], ['K', 1, 'KeyK'], ['L', 1, 'KeyL'], ['Ñ', 1, 'Semicolon'], ['´', 1, 'Quote'], ['Ç', 1, 'Backslash'], ['', 1.25, 'Enter']],
  [['⇧', 1.25, 'ShiftLeft'], ['<', 1, 'IntlBackslash'], ['Z', 1, 'KeyZ'], ['X', 1, 'KeyX'], ['C', 1, 'KeyC'], ['V', 1, 'KeyV'], ['B', 1, 'KeyB'], ['N', 1, 'KeyN'], ['M', 1, 'KeyM'], [',', 1, 'Comma'], ['.', 1, 'Period'], ['-', 1, 'Slash'], ['⇧', 2.75, 'ShiftRight']],
  [['Ctrl', 1.25, 'ControlLeft'], ['', 1.25, 'MetaLeft'], ['Alt', 1.25, 'AltLeft'], ['', 6.25, 'Space'], ['AltGr', 1.25, 'AltRight'], ['Fn', 1.25, 'ContextMenu'], ['Ctrl', 1.25, 'ControlRight'], ['Esc', 1.25, 'Escape']]
];
const teclado3d = new THREE.Group(); teclado3d.position.set(0, 0.749, -0.2); scene.add(teclado3d);
const TECLADO_Z = -0.2;                        // se aparta hacia el monitor al abrir una carpeta (fallo 5)
const tecladoBase = rbox(0.47, 0.016, 0.16, 0.006, mat(0x1E1B2E, { r: 0.5 }), 0, 0, 0, teclado3d);
const KU = 0.0303, TECLA_POR_CODIGO = {}, TECLAS = [];
const atlasTeclas = texFrom(1024, 384, (c, w, h) => {
  c.fillStyle = '#3A3552'; c.fillRect(0, 0, w, h);
  TECLADO.forEach((fila, f) => { let u = 0; fila.forEach(([et, an, cod]) => {
    const x = u * 64, y = f * 64, cw = an * 64;
    c.fillStyle = cod === 'Space' ? '#5B4BDB' : '#3A3552'; c.fillRect(x, y, cw, 64);
    c.fillStyle = 'rgba(255,255,255,.07)'; c.fillRect(x + 4, y + 4, cw - 8, 3);
    if (et) { c.fillStyle = cod === 'Escape' ? '#FF9B80' : '#E8E6F5'; c.font = (et.length > 1 && et.length < 4 || et === 'Bloq' || et === 'AltGr' ? '600 20px ' : '600 32px ') + MONO; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(et, x + cw / 2, y + 34); }
    u += an;
  }); });
});
const teclasMesh = (() => {
  const geos = []; let idx = 0;
  TECLADO.forEach((fila, f) => { let u = -7.5; fila.forEach(([et, an, cod]) => {
    const w = an * KU - 0.004, g = new THREE.BoxGeometry(w, 0.009, KU - 0.004);
    const uv = g.attributes.uv, x0 = (u + 7.5) * 64 / 1024, x1 = (u + 7.5 + an) * 64 / 1024, y0 = 1 - (f + 1) * 64 / 384, y1 = 1 - f * 64 / 384;
    for (let k = 0; k < uv.count; k++) {
      if (k >= 8 && k < 12) { const a = uv.getX(k), b = uv.getY(k); uv.setXY(k, x0 + a * (x1 - x0), y0 + b * (y1 - y0)); }   // la cara de arriba: su trozo del atlas
      else uv.setXY(k, 1015 / 1024, 375 / 384);                                                                                  // los lados: el color de la tecla
    }
    g.translate((u + an / 2) * KU, 0.0125, -0.061 + f * KU);
    g.setAttribute('aTecla', new THREE.Float32BufferAttribute(new Array(g.attributes.position.count).fill(idx), 1));
    geos.push(g); (TECLA_POR_CODIGO[cod] = TECLA_POR_CODIGO[cod] || []).push(idx); TECLAS.push(cod); idx++; u += an;
  }); });
  const m = new THREE.MeshStandardMaterial({ map: atlasTeclas, roughness: 0.55 });
  const uni = { uPres: { value: new Array(72).fill(0) } };
  m.onBeforeCompile = sh => {
    sh.uniforms.uPres = uni.uPres;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aTecla;\nuniform float uPres[72];')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed.y -= uPres[int(aTecla + 0.5)] * 0.0055;');
  };
  const mesh = new THREE.Mesh(mergeGeometries(geos), m); mesh.userData.uni = uni; teclado3d.add(mesh); return mesh;
})();
const space = tecladoBase;   // nombre de la v0.2 (lo usa el registro del teclado)
const kbHit = box(0.47, 0.04, 0.16, new THREE.MeshBasicMaterial({ visible: false }), 0, 0.012, 0, teclado3d);
const keyPress = {};
// pressKey('KeyA'): hunde esa tecla (y las dos de la Intro ISO). Con un número, una tecla cualquiera (compatibilidad)
function pressKey(cod) {
  const lista = typeof cod === 'number' ? [((cod % TECLAS.length) + TECLAS.length) % TECLAS.length] : (TECLA_POR_CODIGO[cod] || []);
  lista.forEach(i => { keyPress[i] = performance.now(); });
}
function updateKeys(now) {
  const p = teclasMesh.userData.uni.uPres.value;
  for (const k in keyPress) {
    const dt = now - keyPress[k];
    p[k] = dt < 70 ? 1 : (dt < 170 ? 1 - (dt - 70) / 100 : 0);
    if (dt >= 170) delete keyPress[k];
  }
}
/* el ratón de la mesa: con la rueda encima se ajusta la sensibilidad (E37) */
const raton = new THREE.Group(); raton.position.set(0.34, 0.75, -0.2); scene.add(raton);
const ratonCuerpo = new THREE.Mesh(new THREE.CapsuleGeometry(0.026, 0.04, 6, 16), mat(0x1E1B2E, { r: 0.4 })); ratonCuerpo.rotation.x = Math.PI / 2; ratonCuerpo.scale.set(1, 1, 0.5); raton.add(ratonCuerpo);
const ratonRueda = cyl(0.007, 0.007, 0.006, mat(0x5A566E, { r: 0.4 }), 0, 0.014, -0.022, raton, 16); ratonRueda.rotation.z = Math.PI / 2;
const ratonLeds = [0, 1, 2, 3, 4].map(i => box(0.004, 0.003, 0.006, mat(0x3A3552, { e: 0xFF6B4A, ei: 0 }), -0.012 + i * 0.006, 0.013, 0.02, raton));
plano(0.26, 0.22, mat(0x26223A, { r: 0.95 }), 0.36, MESA_Y + 0.001, -0.2, -Math.PI / 2);   // alfombrilla

/* ---------- flexo clásico de brazo articulado (cambio de Sergio, 4 nov: «menos futurista») ---------- */
const metalM = () => mat(0x2E2A42, { m: 0.45, r: 0.4 });
const lampBase = cyl(0.075, 0.08, 0.025, metalM(), -0.66, 0.7525, -0.6, scene, 36);
const flexo = (() => {
  // dos brazos: de la base (A) al codo (B) y del codo a la cabeza (C). Cada brazo es un cilindro que va de un punto a otro
  const A = v3(-0.66, 0.765, -0.6), B = v3(-0.6, 1.08, -0.62), C = v3(-0.44, 1.2, -0.59);
  const brazo = (p, q, r = 0.009) => { const d = q.clone().sub(p), m = cyl(r, r, d.length(), metalM(), 0, 0, 0, scene, 12); m.position.copy(p).add(q).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(v3(0, 1, 0), d.normalize()); return m; };
  brazo(A, B); brazo(B, C);
  const muelle = (p, q) => { const d = q.clone().sub(p), m = cyl(0.004, 0.004, d.length() * 0.7, mat(0x8E8AA3, { m: 0.7, r: 0.3 }), 0, 0, 0, scene, 8); m.position.copy(p).lerp(q, 0.5).add(v3(0.018, 0, 0)); m.quaternion.setFromUnitVectors(v3(0, 1, 0), d.normalize()); };
  muelle(A, B); muelle(B, C);
  [A, B, C].forEach(p => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.015, 14, 10), mat(0x5A566E, { m: 0.5, r: 0.35 })); s.position.copy(p); scene.add(s); });
  return { A, B, C };
})();
const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.085, 0.11, 32, 1, true), mat(0x1E1B2E, { r: 0.45, m: 0.3, side: THREE.DoubleSide }));
shade.position.set(-0.42, 1.15, -0.58); shade.rotation.z = -0.25; scene.add(shade);
const shadeInterior = new THREE.Mesh(new THREE.CylinderGeometry(0.029, 0.083, 0.108, 32, 1, true), mat(0xF7F1D9, { r: 0.8, side: THREE.BackSide })); shadeInterior.position.copy(shade.position); shadeInterior.rotation.copy(shade.rotation); scene.add(shadeInterior);
const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.024, 20, 12), mat(0xF5C06B, { e: 0xF5C06B, ei: 2.2 })); bulb.position.set(-0.425, 1.12, -0.58); scene.add(bulb);
const lampLight = new THREE.PointLight(0xF5C06B, 2.4, 0, 2); lampLight.position.set(-0.42, 1.06, -0.55); scene.add(lampLight);
const hemi = new THREE.HemisphereLight(0xA99EF5, 0x1E1B2E, 0.75); scene.add(hemi);
// interruptor de balancín en la base del flexo
const switchBox = box(0.034, 0.012, 0.022, mat(0x1E1B2E, { r: 0.5 }), -0.66, 0.768, -0.545);
const rocker = new THREE.Group(); rocker.position.set(-0.66, 0.775, -0.545); scene.add(rocker);
const rockerMesh = box(0.022, 0.006, 0.016, mat(0xFAFAF7, { r: 0.4 }), 0, 0, 0, rocker); rocker.rotation.x = -0.28;
// polvo: puntos que flotan en el haz del flexo
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
    const y = 0.78 + ((b + s * 0.012 * v) % 1) * 0.3, r = 0.03 + (1.1 - y) * 0.4 * a, ang = c * Math.PI * 2 + s * 0.15 * v;
    pos[i * 3] = -0.42 + Math.cos(ang) * r; pos[i * 3 + 1] = y; pos[i * 3 + 2] = -0.58 + Math.sin(ang) * r;
  }
  polvo.p.geometry.attributes.position.needsUpdate = true;
}

/* ---------- la luz de techo: colgante con pantalla de tela (cambio de Sergio, 4 nov) ---------- */
const LUZ_TECHO = { x: -0.65, z: 1.25, y: 2.12 };
const techoG = new THREE.Group(); techoG.userData.quieto = true; techoG.position.set(LUZ_TECHO.x, 0, LUZ_TECHO.z); scene.add(techoG);
cyl(0.06, 0.06, 0.02, mat(0xEEECF7, { r: 0.6 }), 0, SALA.alto - 0.01, 0, techoG);
cyl(0.003, 0.003, SALA.alto - LUZ_TECHO.y - 0.12, mat(0x1E1B2E), 0, (SALA.alto + LUZ_TECHO.y + 0.12) / 2, 0, techoG);
const telaTecho = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.25, 0.26, 40, 1, true), mat(0xEEECF7, { r: 0.95, side: THREE.DoubleSide, e: 0xFFE2B8, ei: 0.0 }));
telaTecho.position.y = LUZ_TECHO.y; techoG.add(telaTecho);
[[0.21, 0.13], [0.25, -0.13]].forEach(([r, dy]) => { const a = new THREE.Mesh(new THREE.TorusGeometry(r, 0.005, 6, 48), mat(0x1E1B2E)); a.rotation.x = Math.PI / 2; a.position.y = LUZ_TECHO.y + dy; techoG.add(a); });
const bombillaTecho = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 10), mat(0xFFE2B8, { e: 0xFFE2B8, ei: 2 })); bombillaTecho.position.y = LUZ_TECHO.y - 0.02; techoG.add(bombillaTecho);
const techo = new THREE.PointLight(0xFFEBD2, 1.3, 0, 1.6); techo.position.set(LUZ_TECHO.x, LUZ_TECHO.y - 0.08, LUZ_TECHO.z); scene.add(techo);
const techoAtras = new THREE.PointLight(0xC9C5DC, 0.45, 0, 2); techoAtras.position.set(-0.6, 2.3, 2.9); scene.add(techoAtras);
// el interruptor de la pared, junto a la puerta

/* ---------- torre moderna (E46): cantos redondeados, frente con ventiladores, lateral de cristal ---------- */
const tower = rbox(0.2, 0.48, 0.42, 0.018, mat(0x1E1B2E, { r: 0.4, m: 0.25 }), 0.82, 0.98, -0.429);
// dos ventiladores en el frente de malla, con un anillo violeta que gira despacio (corrTorre en el módulo 12)
const ventiladores = [0.84, 0.945].map(y => {
  const g = new THREE.Group(); g.position.set(0.82, y, -0.2172); scene.add(g);
  g.add(new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.004, 8, 40), mat(0x5B4BDB, { e: 0xA99EF5, ei: 0.9 })));
  for (let k = 0; k < 3; k++) { const p = box(0.04, 0.012, 0.002, mat(0x2E2A42), 0, 0, 0, g); p.geometry.translate(0.02, 0, 0); p.rotation.z = k * Math.PI * 2 / 3; }
  return g;
});
const cristalLateral = plano(0.36, 0.38, new THREE.MeshStandardMaterial({ color: 0x0E0C16, roughness: 0.1, metalness: 0.4, transparent: true, opacity: 0.85 }), 0.719, 0.98, -0.43, 0, -Math.PI / 2);
// v0.2.3: sin luz propia dentro de la torre (una luz más que calcular en cada píxel del cuarto): el brillo es de los ventiladores
const slot = box(0.16, 0.012, 0.003, mat(0x141221, { e: 0xFF6B4A, ei: 0 }), 0.82, 1.1, -0.2185);
const led = new THREE.Mesh(new THREE.SphereGeometry(0.005, 12, 8), mat(0xFF6B4A, { e: 0xFF6B4A, ei: 1.2 })); led.position.set(0.89, 1.17, -0.218); scene.add(led);
const ejectBtn = rbox(0.022, 0.008, 0.006, 0.002, mat(0x5A566E, { r: 0.4 }), 0.885, 1.08, -0.218);
const powerBtn = cyl(0.012, 0.012, 0.006, mat(0x3A3552, { r: 0.4, e: 0x5B4BDB, ei: 0.3 }), 0.775, 1.17, -0.218); powerBtn.rotation.x = Math.PI / 2;
const usbPort = box(0.03, 0.012, 0.004, mat(0x0E0C16, { e: 0xFF6B4A, ei: 0 }), 0.87, 0.97, -0.2185);
usbPort.position.y = 1.03;   // el puerto, arriba a la derecha del frente
const tray = new THREE.Group(); tray.position.set(0.82, 1.1, -0.287); scene.add(tray);
const trayMesh = box(0.15, 0.008, 0.13, mat(0x2E2A42, { r: 0.5, e: 0xFF6B4A, ei: 0 }), 0, 0, 0, tray);
const TRAY_CERRADA = -0.287, TRAY_ABIERTA = -0.152;

/* ---------- estantería en la pared derecha, sobre la mesa ---------- */
const shelfM = mat(0x3A3552, { r: 0.6 });
const ESTANTE = { x: SALA.x1, z0: -1.0, z1: 0.25, y: { 1: 1.3, 2: 1.68 }, fondo: 0.24 };
[1, 2].forEach(f => {
  rbox(ESTANTE.fondo, 0.025, ESTANTE.z1 - ESTANTE.z0, 0.006, shelfM, ESTANTE.x - ESTANTE.fondo / 2, ESTANTE.y[f], (ESTANTE.z0 + ESTANTE.z1) / 2);
  [ESTANTE.z0 + 0.08, ESTANTE.z1 - 0.08].forEach(z => box(0.12, 0.06, 0.012, mat(0x5A566E, { m: 0.3 }), ESTANTE.x - 0.06, ESTANTE.y[f] - 0.04, z));
});

/* ---------- el cuadro de la calle (pared izquierda, sobre el cabecero) y la camiseta del Mundial 2018 (E56-8) ---------- */
const POSTER = { x: SALA.x0 + 0.012, y: 1.55, z: 1.42, w: 1.05, h: 0.8 };
const posterTex = texFrom(880, 656, (c, w, h) => {
  // una calle de ciudad en blanco y negro con un autobús rojo de dos pisos (inventada, sin marcas)
  const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#D8D6DE'); g.addColorStop(1, '#8E8AA3'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  let s = 3; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let x = -20; x < w; x += 70 + rnd() * 40) {         // fachadas
    const top = 40 + rnd() * 160, ancho = 90 + rnd() * 70, gris = 90 + rnd() * 80;
    c.fillStyle = `rgb(${gris},${gris},${gris + 6})`; c.fillRect(x, top, ancho, h);
    c.fillStyle = 'rgba(30,27,46,.35)'; for (let yy = top + 20; yy < h - 200; yy += 38) for (let xx = x + 10; xx < x + ancho - 20; xx += 26) c.fillRect(xx, yy, 14, 22);
  }
  c.fillStyle = '#5A566E'; c.fillRect(0, h - 170, w, 170); c.fillStyle = '#C9C5DC'; for (let x = 0; x < w; x += 80) c.fillRect(x, h - 90, 44, 6);
  const bx = 150, by = h - 360;
  c.fillStyle = '#C2362B'; rr(c, bx, by, 260, 250, 18); c.fill();
  c.fillStyle = '#1E1B2E'; for (let k = 0; k < 4; k++) { c.fillRect(bx + 18 + k * 60, by + 24, 48, 52); c.fillRect(bx + 18 + k * 60, by + 120, 48, 52); }
  c.fillStyle = '#FAFAF7'; c.fillRect(bx, by + 92, 260, 8); c.fillStyle = '#1E1B2E'; c.beginPath(); c.arc(bx + 55, by + 250, 26, 0, Math.PI * 2); c.arc(bx + 205, by + 250, 26, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#F5C06B'; c.fillRect(bx + 236, by + 210, 18, 12);
  c.strokeStyle = '#2E2A42'; c.lineWidth = 3; c.beginPath(); c.moveTo(560, h - 170); c.lineTo(560, 120); c.stroke();
  c.fillStyle = '#2E2A42'; c.fillRect(540, 110, 40, 14);
  c.strokeStyle = 'rgba(250,250,247,.8)'; c.lineWidth = 16; c.strokeRect(8, 8, w - 16, h - 16);
});
const posterMesh = plano(POSTER.w, POSTER.h, new THREE.MeshLambertMaterial({ map: posterTex }), POSTER.x, POSTER.y, POSTER.z, 0, Math.PI / 2);
const marcoPoster = box(0.015, POSTER.h + 0.04, POSTER.w + 0.04, mat(0x8E8AA3, { m: 0.5, r: 0.4 }), SALA.x0 + 0.004, POSTER.y, POSTER.z);
const camiseta = (() => {
  // de la foto 06: amarilla, cuello redondo azul marino y, a cada lado del pecho, tres cuñas en diagonal (rayitas rojas,
  // azul marino, rayitas rojas), como unas alas. Sin escudos, logotipos, marcas ni textos (boceto 05)
  const g = new THREE.Group(); g.position.set(SALA.x0 + 0.06, 1.56, POSTER.z + 0.12); g.rotation.y = Math.PI / 2; scene.add(g);
  const s = new THREE.Shape();
  s.moveTo(-0.11, 0.21); s.quadraticCurveTo(0, 0.165, 0.11, 0.21); s.lineTo(0.15, 0.2); s.lineTo(0.235, 0.1); s.lineTo(0.185, 0.045); s.lineTo(0.13, 0.085);
  s.lineTo(0.125, -0.27); s.quadraticCurveTo(0, -0.285, -0.125, -0.27); s.lineTo(-0.13, 0.085); s.lineTo(-0.185, 0.045); s.lineTo(-0.235, 0.1); s.lineTo(-0.15, 0.2); s.closePath();
  const X0 = -0.235, Y0 = -0.285, W = 0.47, Hh = 0.5;
  const tex = texFrom(512, 544, (c, w, h) => {
    const X = x => (x - X0) / W * w, Y = y => h - (y - Y0) / Hh * h;
    c.fillStyle = '#F5D02A'; c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(0,0,0,.05)'; for (let y = 0; y < h; y += 4) c.fillRect(0, y, w, 1);            // el tejido
    c.strokeStyle = '#1E2A5A'; c.lineWidth = 18; c.beginPath(); c.moveTo(X(-0.11), Y(0.21)); c.quadraticCurveTo(X(0), Y(0.15), X(0.11), Y(0.21)); c.stroke();   // el cuello
    [-1, 1].forEach(lado => {
      const borde = X(lado * 0.13);
      ['raya', '#1E2A5A', 'raya'].forEach((col, k) => {
        const y0 = Y(0.06 - k * 0.055), alto = 0.042 / Hh * h, punta = X(lado * 0.02);
        c.save(); c.beginPath(); c.moveTo(borde, y0); c.lineTo(punta, y0 + alto * 0.85); c.lineTo(borde, y0 + alto); c.closePath(); c.clip();
        if (col === 'raya') { c.fillStyle = '#C2362B'; c.fillRect(0, 0, w, h); c.strokeStyle = '#1E2A5A'; c.lineWidth = 2.4; for (let i = -40; i < 80; i++) { c.beginPath(); c.moveTo(i * 9, y0 - 40); c.lineTo(i * 9 - 18, y0 + 80); c.stroke(); } }
        else { c.fillStyle = col; c.fillRect(0, 0, w, h); }
        c.restore();
      });
    });
  });
  const geo = new THREE.ShapeGeometry(s, 10); const pos = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i); uv.setXY(i, (x - X0) / W, (y - Y0) / Hh); pos.setZ(i, Math.cos(x * 9) * 0.008 + (y < -0.1 ? 0.01 * (-0.1 - y) * 6 : 0)); }   // un poco de caída
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ map: tex, side: THREE.DoubleSide })); g.add(m);
  const percha = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.003, 6, 16, Math.PI * 1.4), mat(0x8E8AA3, { m: 0.6 })); percha.position.y = 0.25; g.add(percha);
  const barra = cyl(0.003, 0.003, 0.3, mat(0x8E8AA3, { m: 0.6 }), 0, 0.205, -0.003, g, 8); barra.rotation.z = Math.PI / 2;
  return { g, m };
})();

/* ---------- la pizarra, en la pared derecha (el lienzo y los rotuladores están en el módulo 09) ---------- */
const PIZ = { x: SALA.x1 - 0.022, z: 1.15, y: 1.45, w: 1.3, h: 0.853 };
const boardFrame = rbox(0.02, 0.92, 1.36, 0.008, mat(0x8E8AA3, { r: 0.5, m: 0.3 }), SALA.x1 - 0.01, PIZ.y, PIZ.z);
const boardTray = box(0.06, 0.012, 1.1, mat(0x8E8AA3, { r: 0.5, m: 0.3 }), SALA.x1 - 0.035, 0.985, PIZ.z);

/* ---------- el pasillo de la entrada (E56-9): la puerta al fondo, el altillo encima y el perchero ---------- */
const door = new THREE.Group(); door.position.set(PUERTA_X, 0, PASILLO.z1 - 0.01); scene.add(door);
const doorSlab = rbox(0.85, 2.0, 0.04, 0.008, mat(0xE8E6F5, { r: 0.6 }), 0.425, 1.0, 0, door);
const doorPanelM = mat(0xD8D5E6, { r: 0.7 });
// la puerta de cuarterones de la foto 01: uno alto arriba, uno estrecho en medio y uno abajo
box(0.6, 0.86, 0.006, doorPanelM, 0.425, 1.47, -0.022, door); box(0.6, 0.16, 0.006, doorPanelM, 0.425, 0.86, -0.022, door); box(0.6, 0.56, 0.006, doorPanelM, 0.425, 0.4, -0.022, door);
const doorKnob = new THREE.Group(); doorKnob.position.set(0.77, 1.0, -0.04); door.add(doorKnob);
const knobMesh = rbox(0.11, 0.018, 0.018, 0.008, mat(0x5A566E, { m: 0.7, r: 0.3 }), -0.04, 0, 0, doorKnob);
cyl(0.024, 0.024, 0.012, mat(0x5A566E, { m: 0.7, r: 0.3 }), 0, 0, 0.012, doorKnob).rotation.x = Math.PI / 2;
const notaTex = texFrom(256, 200, (c, w, h) => {
  c.fillStyle = '#F7F1D9'; c.fillRect(0, 0, w, h);
  c.fillStyle = '#2E2A42'; c.font = '700 46px ' + MANO; c.fillText('Volver', 30, 80); c.fillText('a la web', 30, 132);
  c.strokeStyle = '#C93F22'; c.lineWidth = 5; c.beginPath(); c.moveTo(150, 170); c.lineTo(220, 170); c.lineTo(205, 158); c.moveTo(220, 170); c.lineTo(205, 182); c.stroke();
});
const nota = plano(0.16, 0.125, new THREE.MeshLambertMaterial({ map: notaTex }), 0.425, 1.62, -0.027, 0, Math.PI, door); nota.rotation.z = 0.04;
{ const frameM = mat(0xD8D5E6, { r: 0.6 }), z = PASILLO.z1;
  box(0.04, 2.0, 0.06, frameM, PUERTA_X - 0.02, 1.0, z); box(0.04, 2.0, 0.06, frameM, PUERTA_X + 0.87, 1.0, z); }
const pasillo = plano(0.85, 2.0, new THREE.MeshBasicMaterial({ color: 0xFFE9C9 }), PUERTA_X + 0.425, 1.0, PASILLO.z1 + 0.22, 0, Math.PI);
const pasilloLuz = new THREE.PointLight(0xFFE2B8, 0, 0, 2); pasilloLuz.position.set(PUERTA_X + 0.42, 1.3, PASILLO.z1 - 0.15); scene.add(pasilloLuz);
box(0.02, 2.0, 0.22, mat(0x221E33), PUERTA_X, 1.0, PASILLO.z1 + 0.11); box(0.02, 2.0, 0.22, mat(0x221E33), PUERTA_X + 0.85, 1.0, PASILLO.z1 + 0.11);
// el altillo: un armario blanco de dos puertas encima del pasillo (foto 01), con sus pomos
const altilloG = new THREE.Group(); altilloG.userData.quieto = true; scene.add(altilloG);
{ const blanco = mat(0xEEECF7, { r: 0.55 }), w = PASILLO.x1 - PASILLO.x0, cx = (PASILLO.x0 + PASILLO.x1) / 2;
  box(w, 0.04, 1.1, blanco, cx, PASILLO.alto + 0.02, (PASILLO.z0 + PASILLO.z1) / 2, altilloG);               // el fondo, que es el techo del pasillo
  [0, 1].forEach(i => { rbox(w / 2 - 0.008, SALA.alto - PASILLO.alto - 0.05, 0.02, 0.004, mat(0xFAFAF7, { r: 0.5 }), PASILLO.x0 + w / 4 + i * w / 2, (PASILLO.alto + SALA.alto) / 2 + 0.01, PASILLO.z0 - 0.012, altilloG);
    const pomo = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 8), mat(0xC9C5DC, { m: 0.6, r: 0.3 })); pomo.position.set(cx + (i ? 0.06 : -0.06), PASILLO.alto + 0.2, PASILLO.z0 - 0.03); altilloG.add(pomo); });
  box(w + 0.04, 0.03, 0.06, blanco, cx, PASILLO.alto + 0.01, PASILLO.z0 - 0.01, altilloG);                   // el canto de abajo
}
// el perchero de la pared del pasillo, con una sola chaqueta (la foto tenía mucha ropa: sobra)
const percheroG = new THREE.Group(); percheroG.userData.quieto = true; scene.add(percheroG);
{ rbox(0.02, 0.06, 0.42, 0.006, mat(0x8E7A62, { r: 0.7 }), SALA.x1 - 0.012, 1.66, 4.0, percheroG);
  [-0.15, 0, 0.15].forEach(dz => { const p = cyl(0.008, 0.008, 0.06, mat(0x8E8AA3, { m: 0.6 }), SALA.x1 - 0.045, 1.66, 4.0 + dz, percheroG, 8); p.rotation.z = Math.PI / 2; });
  const chaqueta = rbox(0.1, 0.62, 0.36, 0.05, mat(0x2E2A42, { r: 0.95 }), SALA.x1 - 0.08, 1.33, 4.15, percheroG); chaqueta.rotation.z = 0.04; }

/* ---------- alfombra ---------- */
const alfombraTex = texFrom(256, 330, (c, w, h) => { c.fillStyle = '#2E2A60'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(169,158,245,.35)'; c.lineWidth = 6; c.strokeRect(14, 14, w - 28, h - 28); c.fillStyle = 'rgba(255,107,74,.25)'; for (let y = 40; y < h - 30; y += 26) c.fillRect(30, y, w - 60, 3); });
plano(1.3, 1.4, new THREE.MeshLambertMaterial({ map: alfombraTex }), -0.05, 0.004, 1.75, -Math.PI / 2);

/* ---------- la cama (cabecero en la pared izquierda): colores de la paleta (E56-5) ---------- */
const CAMA = { x0: -2.65, x1: -0.7, z0: 0.75, z1: 2.1, alto: 0.55 };
const camaG = new THREE.Group(); camaG.userData.quieto = true; scene.add(camaG);
{
  const cx = (CAMA.x0 + CAMA.x1) / 2, cz = (CAMA.z0 + CAMA.z1) / 2, l = CAMA.x1 - CAMA.x0, w = CAMA.z1 - CAMA.z0;
  rbox(l - 0.06, 0.3, w, 0.02, mat(0xEEECF7, { r: 0.6 }), cx + 0.03, 0.17, cz, camaG);                        // canapé blanco
  rbox(l - 0.1, 0.18, w - 0.06, 0.05, mat(0xFAFAF7, { r: 0.95 }), cx + 0.03, 0.41, cz, camaG);                // colchón con su funda crema
  const manta = rbox(l - 0.5, 0.04, w + 0.03, 0.02, mat(0x5A566E, { r: 0.95 }), cx + 0.26, 0.51, cz, camaG);  // manta gris…
  box(0.05, 0.042, w + 0.035, mat(0xFF6B4A, { r: 0.95 }), CAMA.x0 + 0.27 + 0.03, 0.512, cz, camaG);            // …con una franja coral en el embozo
  box(0.12, 0.03, w - 0.02, mat(0xFAFAF7, { r: 0.95 }), CAMA.x0 + 0.42, 0.515, cz, camaG);                     // la sábana doblada sobre la manta
  [cz - 0.3, cz + 0.3].forEach(z => rbox(0.32, 0.11, 0.5, 0.05, mat(0xA99EF5, { r: 0.95 }), CAMA.x0 + 0.24, 0.54, z, camaG));   // cojines violeta claro
  rbox(0.06, 1.05, w + 0.04, 0.02, mat(0x8E8AA3, { r: 0.9 }), CAMA.x0 + 0.03, 0.525, cz, camaG);           // cabecero gris (como el real)
  camaG.userData.manta = manta;
}

/* ---------- la mesita blanca de dos cajones (E56-13, E56-14): balda perforada, lamparita, móvil e interruptores ---------- */
const MESITA = { x0: -2.65, x1: -2.2, z0: 0.25, z1: 0.7, alto: 0.55 };
const mesitaG = new THREE.Group(); mesitaG.userData.quieto = true; scene.add(mesitaG);
const mesitaCajones = [];   // los dos cajones (grupos que salen hacia el cuarto, +x)
{
  const cx = (MESITA.x0 + MESITA.x1) / 2, cz = (MESITA.z0 + MESITA.z1) / 2, w = MESITA.x1 - MESITA.x0, d = MESITA.z1 - MESITA.z0, blanco = mat(0xEEECF7, { r: 0.55 });
  // el cuerpo, abierto por delante (+x): arriba, abajo, fondo, laterales y la balda entre los cajones
  box(w, 0.02, d, blanco, cx, MESITA.alto - 0.01, cz, mesitaG); box(w, 0.03, d, blanco, cx, 0.035, cz, mesitaG); box(0.012, MESITA.alto, d, blanco, MESITA.x0 + 0.006, MESITA.alto / 2, cz, mesitaG);
  box(w, MESITA.alto, 0.012, blanco, cx, MESITA.alto / 2, MESITA.z0 + 0.006, mesitaG); box(w, MESITA.alto, 0.012, blanco, cx, MESITA.alto / 2, MESITA.z1 - 0.006, mesitaG);
  box(w - 0.02, 0.012, d - 0.024, blanco, cx, 0.29, cz, mesitaG);
  [[0.415, 0.235], [0.165, 0.235]].forEach(([y, alto], i) => {
    const g = new THREE.Group(); g.position.set(MESITA.x1, y, cz); scene.add(g);
    const frente = rbox(0.02, alto - 0.012, d - 0.03, 0.006, mat(0xFAFAF7, { r: 0.5 }), -0.01, 0, 0, g);
    const tirador = rbox(0.012, 0.012, 0.12, 0.004, mat(0x8E8AA3, { m: 0.5, r: 0.35 }), 0.002, alto / 2 - 0.04, 0, g);
    const fondoM = mat(0xE8E6F5, { r: 0.7 });
    box(w - 0.06, 0.008, d - 0.06, fondoM, -(w - 0.06) / 2 - 0.02, -alto / 2 + 0.03, 0, g);                          // el fondo del cajón
    box(w - 0.06, alto - 0.06, 0.008, fondoM, -(w - 0.06) / 2 - 0.02, 0, -(d - 0.06) / 2, g); box(w - 0.06, alto - 0.06, 0.008, fondoM, -(w - 0.06) / 2 - 0.02, 0, (d - 0.06) / 2, g);
    box(0.008, alto - 0.06, d - 0.06, fondoM, -(w - 0.06) - 0.02, 0, 0, g);
    mesitaCajones.push({ g, frente, tirador, alto, abierto: 0, x0: MESITA.x1, cont: new THREE.Group() });
    g.add(mesitaCajones[i].cont); mesitaCajones[i].cont.position.set(-(w - 0.06) / 2 - 0.02, -alto / 2 + 0.035, 0);
  });
  // encima: la balda perforada contra la pared, con el cargador del reloj y la funda de los auriculares (foto 04)
  const perforadaTex = texFrom(256, 96, (c, w2, h2) => { c.fillStyle = '#FAFAF7'; c.fillRect(0, 0, w2, h2); c.fillStyle = '#C9C5DC'; for (let x = 10; x < w2; x += 14) for (let y = 10; y < h2; y += 14) { c.beginPath(); c.arc(x + ((y / 14) % 2) * 7, y, 3, 0, Math.PI * 2); c.fill(); } });
  const bx = MESITA.x0 + 0.08, bz = MESITA.z0 + 0.3, by = MESITA.alto + 0.13;
  box(0.13, 0.012, 0.28, [blanco, blanco, new THREE.MeshLambertMaterial({ map: perforadaTex }), blanco, blanco, blanco], bx, by, bz, mesitaG);
  [-0.13, 0.13].forEach(dz => box(0.12, 0.13, 0.012, blanco, bx, MESITA.alto + 0.065, bz + dz, mesitaG));
  rbox(0.05, 0.012, 0.05, 0.01, mat(0xFAFAF7, { r: 0.4 }), bx, by + 0.012, bz - 0.07, mesitaG);                                  // el cargador del reloj
  rbox(0.038, 0.01, 0.044, 0.008, mat(0x1E1B2E, { r: 0.35 }), bx, by + 0.023, bz - 0.07, mesitaG);                              // el reloj encima
  rbox(0.05, 0.026, 0.06, 0.012, mat(0xFAFAF7, { r: 0.35 }), bx, by + 0.019, bz + 0.07, mesitaG);                               // la funda de los auriculares
}
// la lamparita (antes un tubo que no se entendía, E56-4): base de cerámica tinta, pantalla de tela crema y su bombilla
const LAMPARITA = v3(MESITA.x1 - 0.12, MESITA.alto, MESITA.z0 + 0.1);
const lamparitaG = new THREE.Group(); lamparitaG.position.copy(LAMPARITA); scene.add(lamparitaG);
const lamparitaBase = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.045, 0], [0.05, 0.03], [0.042, 0.08], [0.02, 0.13], [0.012, 0.16], [0, 0.16]].map(([x, y]) => new THREE.Vector2(x, y)), 24), mat(0x2E2A42, { r: 0.35, m: 0.1 }));
lamparitaG.add(lamparitaBase);
const lamparitaPantalla = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.085, 0.11, 28, 1, true), mat(0xFAFAF7, { r: 0.95, side: THREE.DoubleSide, e: 0xF5C06B, ei: 0 }));
lamparitaPantalla.position.y = 0.2; lamparitaG.add(lamparitaPantalla);
const lamparitaBombilla = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 8), mat(0xF5C06B, { e: 0xF5C06B, ei: 0 })); lamparitaBombilla.position.y = 0.18; lamparitaG.add(lamparitaBombilla);
const luzMesita = new THREE.PointLight(0xF5C06B, 0, 0, 2); luzMesita.position.set(LAMPARITA.x + 0.05, LAMPARITA.y + 0.2, LAMPARITA.z + 0.05); scene.add(luzMesita);
// los dos interruptores de la pared junto a la cama (foto 04): el de la izquierda, la lamparita; el de la derecha, la luz de techo
const interruptoresCama = rbox(0.012, 0.08, 0.13, 0.006, mat(0xEEECF7, { r: 0.5 }), SALA.x0 + 0.006, 0.98, MESITA.z1 - 0.12);
const teclasCama = [-1, 1].map(s => rbox(0.008, 0.05, 0.05, 0.004, mat(0xFAFAF7, { r: 0.4 }), SALA.x0 + 0.014, 0.98, MESITA.z1 - 0.12 + s * 0.031));
// el móvil (E49, y la puerta de la versión móvil, E53): pantalla de lienzo; se dibuja en el módulo 12
const movilTex = texFrom(256, 512);
const MOVIL_CASA = { pos: v3(MESITA.x1 - 0.1, MESITA.alto + 0.006, MESITA.z1 - 0.1), rot: new THREE.Euler(-Math.PI / 2, 0, 0.5) };
const movilG = new THREE.Group(); movilG.position.copy(MOVIL_CASA.pos); movilG.rotation.copy(MOVIL_CASA.rot); scene.add(movilG);
const movilCuerpo = rbox(0.075, 0.155, 0.009, 0.008, mat(0x141221, { r: 0.3, m: 0.4 }), 0, 0, 0, movilG);
const movilPantalla = plano(0.068, 0.145, new THREE.MeshBasicMaterial({ map: movilTex, toneMapped: false }), 0, 0, 0.0047, 0, 0, movilG);
// la mochila negra, a los pies de la cama
const mochilaG = new THREE.Group(); mochilaG.position.set(-1.12, CAMA.alto + 0.02, 1.35); mochilaG.rotation.set(0, 0.5, 0); scene.add(mochilaG);
const mochilaM = mat(0x16141F, { r: 0.85 });
const mochila = rbox(0.32, 0.12, 0.44, 0.05, mochilaM, 0, 0.06, 0, mochilaG);
const mochilaTapa = new THREE.Group(); mochilaTapa.position.set(0, 0.12, -0.2); mochilaG.add(mochilaTapa);
const mochilaSolapa = rbox(0.3, 0.025, 0.2, 0.02, mat(0x1E1B2E, { r: 0.85 }), 0, 0.01, 0.1, mochilaTapa);
rbox(0.06, 0.02, 0.36, 0.008, mat(0x2E2A42), -0.1, 0.125, 0.0, mochilaG); rbox(0.06, 0.02, 0.36, 0.008, mat(0x2E2A42), 0.1, 0.125, 0.0, mochilaG);
box(0.2, 0.004, 0.008, mat(0xFF6B4A, { e: 0xFF6B4A, ei: 0.1 }), 0, 0.122, 0.17, mochilaG);

/* ---------- el corcho (pared izquierda, sobre la mesita) ---------- */
const CORCHO_POS = { x: SALA.x0 + 0.02, y: 1.48, z: 0.05, w: 1.0, h: 0.62 };
const corchoTex = texFrom(1024, 666, (c, w, h) => dibujaCorcho(c, w, h));
const corchoMarco = box(0.02, CORCHO_POS.h + 0.04, CORCHO_POS.w + 0.04, mat(0x5A566E, { r: 0.6 }), SALA.x0 + 0.01, CORCHO_POS.y, CORCHO_POS.z);
const corchoMesh = plano(CORCHO_POS.w, CORCHO_POS.h, new THREE.MeshLambertMaterial({ map: corchoTex }), SALA.x0 + 0.021, CORCHO_POS.y, CORCHO_POS.z, 0, Math.PI / 2);
function dibujaCorcho(c, w, h) {
  let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  c.fillStyle = '#B98A55'; c.fillRect(0, 0, w, h);
  for (let i = 0; i < 2600; i++) { c.fillStyle = rnd() < 0.5 ? 'rgba(90,55,25,.18)' : 'rgba(255,230,190,.14)'; c.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 4, 2 + rnd() * 3); }
  const ancho = 220, alto = 190, cols = 4;
  CORCHO.forEach((it, i) => {
    const col = i % cols, fila = Math.floor(i / cols);
    const x = 30 + col * 246 + (fila % 2) * 18 + (rnd() - 0.5) * 16, y = 26 + fila * 212 + (rnd() - 0.5) * 12, giro = (rnd() - 0.5) * 0.12;
    c.save(); c.translate(x + ancho / 2, y + alto / 2); c.rotate(giro); c.translate(-ancho / 2, -alto / 2);
    c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 8; c.shadowOffsetY = 3;
    if (it.tipo === 'foto') {
      c.fillStyle = '#FBF8EF'; c.fillRect(0, 0, ancho, alto); c.shadowColor = 'transparent';
      c.fillStyle = it.color; c.fillRect(12, 12, ancho - 24, 112);
      c.fillStyle = 'rgba(255,255,255,.18)'; c.beginPath(); c.arc(60, 52, 22, 0, Math.PI * 2); c.fill();
      c.fillStyle = 'rgba(20,18,33,.35)'; c.beginPath(); c.moveTo(12, 124); c.lineTo(90, 70); c.lineTo(140, 104); c.lineTo(170, 84); c.lineTo(ancho - 12, 124); c.fill();
      c.fillStyle = '#2E2A42'; c.font = '700 30px ' + MANO; cabe(c, it.t, 14, 152, ancho - 28, 30, '700', MANO);
      c.font = '600 22px ' + MANO; wrap(c, it.s, 14, 176, ancho - 24, 20);
    } else if (it.tipo === 'entrada') {
      c.fillStyle = it.color; c.fillRect(0, 30, ancho, 120); c.shadowColor = 'transparent';
      c.fillStyle = '#FBF8EF'; c.fillRect(ancho - 52, 30, 52, 120);
      c.fillStyle = '#B98A55'; for (let yy = 36; yy < 150; yy += 14) { c.beginPath(); c.arc(ancho - 52, yy, 3, 0, Math.PI * 2); c.fill(); }
      c.fillStyle = '#FAFAF7'; cabe(c, it.t, 14, 66, ancho - 76, 24, '600', DISP);
      c.font = '500 17px ' + BODY; wrap(c, it.s, 14, 94, ancho - 76, 21);
      c.save(); c.translate(ancho - 20, 138); c.rotate(-Math.PI / 2); c.fillStyle = '#2E2A42'; c.font = '600 15px ' + BODY; c.fillText('ADMITE 1', 0, 0); c.restore();
    } else {
      c.fillStyle = it.color; c.fillRect(20, 10, ancho - 40, ancho - 40); c.shadowColor = 'transparent';
      c.fillStyle = '#2E2A42'; cabe(c, it.t, 34, 52, ancho - 72, 30, '700', MANO);
      c.font = '600 24px ' + MANO; wrap(c, it.s, 34, 86, ancho - 72, 25);
    }
    c.restore();
    c.fillStyle = '#FF6B4A'; c.beginPath(); c.arc(x + ancho / 2, y + 8, 7, 0, Math.PI * 2); c.fill();
    c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.arc(x + ancho / 2 - 2, y + 6, 2.5, 0, Math.PI * 2); c.fill();
  });
  const lx = 30 + 1 * 246 + 18, ly = 26 + 2 * 212;
  c.strokeStyle = 'rgba(30,27,46,.55)'; c.setLineDash([10, 8]); c.lineWidth = 3; c.strokeRect(lx, ly, 470, 170); c.setLineDash([]);
  c.fillStyle = 'rgba(30,27,46,.75)'; c.font = '700 38px ' + MANO; c.fillText('Aquí irán tus logros', lx + 30, ly + 74); c.font = '600 28px ' + MANO; c.fillText('(llegan en la v0.3)', lx + 30, ly + 114);
}

/* ---------- el armario de tres puertas con marco y espejo (E56-1, 7, 11, 12) ----------
   Foto 05, limpia: sin cajas encima. Dentro, a la izquierda (detrás de dos puertas), la barra con la ropa colgada y la
   doblada debajo; a la derecha, baldas con ropa, dos cosas y la caja «Personalización» (E28, v0.3: boceto 07).
   Cada puerta se abre sola (antes, las tres a la vez). El espejo de la del centro refleja de verdad (Reflector). */
const ARMARIO = { x0: -2.62, x1: -1.47, z0: -1.2, z1: -0.62, alto: 2.0 };
const armarioG = new THREE.Group(); armarioG.userData.quieto = true; scene.add(armarioG);
const armarioPuertas = [];
let espejo = null;
{
  const { x0, x1, z0, z1, alto } = ARMARIO, w = x1 - x0, d = z1 - z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, blanco = mat(0xEEECF7, { r: 0.55 });
  box(w, alto, 0.02, blanco, cx, alto / 2, z0 + 0.01, armarioG); box(0.02, alto, d, blanco, x0 + 0.01, alto / 2, cz, armarioG); box(0.02, alto, d, blanco, x1 - 0.01, alto / 2, cz, armarioG);
  box(w, 0.02, d, blanco, cx, alto - 0.01, cz, armarioG); box(w, 0.06, d, blanco, cx, 0.03, cz, armarioG);
  box(w - 0.04, alto - 0.08, 0.01, mat(0xD8D5E6, { r: 0.9 }), cx, alto / 2, z0 + 0.025, armarioG);       // el fondo por dentro, claro
  const pw = w / 3, xd = x0 + 2 * pw;                                                                  // la división: dos puertas a la izquierda, una a la derecha
  box(0.018, alto - 0.08, d - 0.04, blanco, xd, alto / 2, cz, armarioG);
  // izquierda: la barra, las perchas y la ropa de colores (foto 05; en la v0.3, los «conjuntos» del cuarto)
  cyl(0.01, 0.01, 2 * pw - 0.06, mat(0x8E8AA3, { m: 0.7, r: 0.3 }), (x0 + xd) / 2, 1.72, cz, armarioG).rotation.z = Math.PI / 2;
  [0x2E2A42, 0xFAFAF7, 0xFAFAF7, 0x3A3552, 0x5A566E, 0x16794B, 0xFF9B80, 0xF5D02A, 0xC2362B, 0xC2362B, 0x4638B8].forEach((c, i) => {
    const largo = 0.56 + (i % 3) * 0.07, x = x0 + 0.08 + i * ((2 * pw - 0.14) / 10);
    const r = rbox(0.045, largo, 0.4, 0.02, mat(c, { r: 0.95 }), x, 1.7 - largo / 2, cz + 0.01, armarioG); r.rotation.y = (i % 2 ? 0.06 : -0.05);
    const p = new THREE.Mesh(new THREE.TorusGeometry(0.018, 0.002, 4, 10, Math.PI), mat(0x8E8AA3, { m: 0.6 })); p.position.set(x, 1.735, cz); p.rotation.y = Math.PI / 2; armarioG.add(p);
  });
  box(2 * pw - 0.04, 0.02, d - 0.04, blanco, (x0 + xd) / 2, 0.6, cz, armarioG);                       // la balda de abajo, con la ropa doblada
  [[0x1E1B2E, 0.12], [0x5A566E, 0.35], [0x2F5FD0, 0.58]].forEach(([c, dx]) => rbox(0.2, 0.09, 0.3, 0.015, mat(c, { r: 0.95 }), x0 + dx, 0.655, cz + 0.02, armarioG));
  // derecha: tres baldas
  [0.5, 0.98, 1.46].forEach(y => box(pw - 0.04, 0.02, d - 0.04, blanco, xd + pw / 2, y, cz, armarioG));
  [[0xFAFAF7, -0.07, 0.07], [0x2E2A42, 0.08, 0.07]].forEach(([c, dx, alto2]) => rbox(0.13, alto2, 0.28, 0.012, mat(c, { r: 0.95 }), xd + pw / 2 + dx, 0.99 + alto2 / 2 + 0.01, cz + 0.02, armarioG));
  rbox(0.08, 0.12, 0.08, 0.01, mat(0xA99EF5, { r: 0.6 }), xd + pw / 2 - 0.08, 1.53, cz + 0.05, armarioG); rbox(0.07, 0.1, 0.07, 0.01, mat(0xF5C06B, { r: 0.6 }), xd + pw / 2 + 0.05, 1.52, cz + 0.05, armarioG);
  const cajaPersonal = rbox(0.3, 0.2, 0.3, 0.01, mat(0xF7F1D9, { r: 0.8 }), xd + pw / 2, 0.61, cz, armarioG);
  const etiq = texFrom(256, 128, (c, w2, h2) => { c.fillStyle = '#F7F1D9'; c.fillRect(0, 0, w2, h2); c.fillStyle = '#2E2A42'; c.font = '700 40px ' + MANO; c.fillText('Personalización', 14, 56); c.font = '600 30px ' + MANO; c.fillStyle = '#C93F22'; c.fillText('se llena en la v0.3', 14, 100); });
  plano(0.26, 0.13, new THREE.MeshLambertMaterial({ map: etiq }), xd + pw / 2, 0.61, cz + 0.151, 0, 0, armarioG);
  // las tres puertas, con su marco en relieve: la de la izquierda y la del centro giran sobre su lado izquierdo; la de la derecha, sobre el derecho
  [[x0, 1], [x0 + pw, 1], [x1, -1]].forEach(([bx, lado], i) => {
    const p = new THREE.Group(); p.position.set(bx, 0, z1 + 0.012); armarioG.add(p);
    const hoja = rbox(pw - 0.006, alto - 0.04, 0.022, 0.006, blanco, lado * pw / 2, alto / 2, 0, p);
    const marcoM = mat(0xE2E0EC, { r: 0.6 });
    if (i !== 1) [[0.0, 0.62], [0.0, -0.62]].forEach(() => {});
    if (i === 1) {
      // el espejo: refleja de verdad, a baja resolución y solo cuando se mira (módulo 12)
      espejo = new Reflector(new THREE.PlaneGeometry(pw - 0.1, alto - 0.5), { clipBias: 0.003, textureWidth: 256, textureHeight: 512, color: 0xB8B4C8 });
      espejo.position.set(pw / 2, alto / 2, 0.0125); p.add(espejo);
    } else {
      // el marco en relieve de la foto: un rectángulo de listones
      const mw = pw - 0.1, mh = alto - 0.3, lx = lado * pw / 2;
      box(mw, 0.02, 0.008, marcoM, lx, alto / 2 + mh / 2, 0.014, p); box(mw, 0.02, 0.008, marcoM, lx, alto / 2 - mh / 2, 0.014, p);
      box(0.02, mh, 0.008, marcoM, lx - mw / 2, alto / 2, 0.014, p); box(0.02, mh, 0.008, marcoM, lx + mw / 2, alto / 2, 0.014, p);
    }
    const tirador = rbox(0.012, 0.16, 0.02, 0.004, mat(0x8E8AA3, { m: 0.6 }), lado * (pw - 0.04), 1.05, 0.02, p);
    armarioPuertas.push({ p, hoja, tirador, lado, abierta: 0 });
  });
}

/* ---------- la pared del sillón (E56-6): el sillón, la lámpara de pie, la mesita con los libros de 2º, el cuadro de la niebla y la balda de trofeos ---------- */
const SILLON = { x0: -2.2, x1: -1.4, z0: 2.75, z1: 3.45 };
const sillonG = new THREE.Group(); sillonG.userData.quieto = true; scene.add(sillonG);
{
  const cx = (SILLON.x0 + SILLON.x1) / 2, M = mat(0xA99EF5, { r: 0.92 }), M2 = mat(0x8E8AA3, { r: 0.92 });   // gris violeta de la paleta, con el asiento violeta claro (E56-5)
  rbox(0.8, 0.26, 0.7, 0.04, M2, cx, 0.17, 3.08, sillonG);                     // base
  rbox(0.58, 0.12, 0.56, 0.05, M, cx, 0.36, 3.02, sillonG);                     // cojín del asiento
  rbox(0.8, 0.6, 0.18, 0.06, M2, cx, 0.6, 3.36, sillonG);                       // respaldo (contra la pared, mirando a la ventana)
  [SILLON.x0 + 0.07, SILLON.x1 - 0.07].forEach(x => rbox(0.13, 0.26, 0.7, 0.05, M2, x, 0.42, 3.08, sillonG));
  const cojin = rbox(0.3, 0.26, 0.09, 0.04, mat(0xFF6B4A, { r: 0.95 }), cx + 0.17, 0.56, 3.2, sillonG); cojin.rotation.set(0.25, 0, -0.2);   // el cojín coral
  [[SILLON.x0 + 0.06, 2.78], [SILLON.x1 - 0.06, 2.78], [SILLON.x0 + 0.06, 3.38], [SILLON.x1 - 0.06, 3.38]].forEach(([x, z]) => cyl(0.015, 0.012, 0.05, mat(0x1E1B2E), x, 0.025, z, sillonG));
}
// la lámpara de pie para leer, en la esquina
const LAMPARA_PIE = v3(-2.45, 0, 3.3);
const lamparaPieG = new THREE.Group(); lamparaPieG.userData.quieto = true; lamparaPieG.position.copy(LAMPARA_PIE); scene.add(lamparaPieG);
cyl(0.13, 0.14, 0.025, mat(0x2E2A42, { r: 0.4, m: 0.3 }), 0, 0.012, 0, lamparaPieG, 28);
cyl(0.012, 0.012, 1.42, mat(0x2E2A42, { r: 0.4, m: 0.3 }), 0, 0.72, 0, lamparaPieG, 10);
const lamparaPiePantalla = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.17, 0.24, 30, 1, true), mat(0xFAFAF7, { r: 0.95, side: THREE.DoubleSide, e: 0xF5C06B, ei: 0 }));
lamparaPiePantalla.position.y = 1.52; lamparaPieG.add(lamparaPiePantalla);
const lamparaPieBombilla = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 8), mat(0xF5C06B, { e: 0xF5C06B, ei: 0 })); lamparaPieBombilla.position.y = 1.47; lamparaPieG.add(lamparaPieBombilla);
const luzLectura = new THREE.PointLight(0xF5C06B, 0, 0, 2); luzLectura.position.set(LAMPARA_PIE.x + 0.15, 1.4, LAMPARA_PIE.z - 0.25); scene.add(luzLectura);
// la mesita auxiliar con los libros de 2º (la pila está en el módulo 04)
const MESA_AUX = { x0: -1.3, x1: -0.9, z0: 3.05, z1: 3.45, alto: 0.5 };
const mesaAuxG = new THREE.Group(); mesaAuxG.userData.quieto = true; scene.add(mesaAuxG);
{
  const cx = (MESA_AUX.x0 + MESA_AUX.x1) / 2, cz = (MESA_AUX.z0 + MESA_AUX.z1) / 2;
  rbox(0.4, 0.025, 0.4, 0.008, mat(0x2E2A42, { r: 0.5 }), cx, MESA_AUX.alto - 0.0125, cz, mesaAuxG);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => box(0.025, MESA_AUX.alto - 0.025, 0.025, mat(0x8E8AA3, { m: 0.5, r: 0.4 }), cx + a * 0.17, (MESA_AUX.alto - 0.025) / 2, cz + b * 0.17, mesaAuxG));
  box(0.36, 0.015, 0.36, mat(0x2E2A42, { r: 0.6 }), cx, 0.16, cz, mesaAuxG);
}
// el cuadro de la ciudad entre la niebla (foto 03): un rascacielos con aguja entre la bruma (dibujo propio)
const CUADRO_NIEBLA = { x: -1.8, y: 1.6, z: FONDO - 0.02, w: 0.6, h: 0.6 };
const nieblaTex = texFrom(512, 512, (c, w, h) => {
  const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#D6CFBF'); g.addColorStop(0.55, '#C9C1B1'); g.addColorStop(1, '#A69E90'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  let s = 11; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let capa = 0; capa < 3; capa++) {                       // tres capas de edificios, más claras cuanto más lejos
    c.fillStyle = ['rgba(120,112,100,.35)', 'rgba(95,88,80,.55)', 'rgba(70,64,58,.8)'][capa];
    for (let x = -10; x < w;) { const an = 18 + rnd() * 40, al = 60 + rnd() * (90 + capa * 40); c.fillRect(x, h - 120 - al + capa * 40, an, al + 200); x += an + rnd() * 6; }
  }
  // el rascacielos con su aguja, en el centro
  c.fillStyle = 'rgba(62,57,52,.9)'; c.fillRect(236, 170, 40, 260); c.fillRect(244, 130, 24, 50); c.fillRect(251, 90, 10, 50); c.fillRect(255, 40, 2, 60);
  const bruma = c.createLinearGradient(0, h * 0.45, 0, h); bruma.addColorStop(0, 'rgba(214,207,191,0)'); bruma.addColorStop(1, 'rgba(214,207,191,.75)'); c.fillStyle = bruma; c.fillRect(0, 0, w, h);
});
const cuadroNiebla = plano(CUADRO_NIEBLA.w, CUADRO_NIEBLA.h, new THREE.MeshLambertMaterial({ map: nieblaTex }), CUADRO_NIEBLA.x, CUADRO_NIEBLA.y, CUADRO_NIEBLA.z, 0, Math.PI);
const cuadroNieblaCanto = box(CUADRO_NIEBLA.w, CUADRO_NIEBLA.h, 0.03, mat(0xC9C1B4, { r: 0.8 }), CUADRO_NIEBLA.x, CUADRO_NIEBLA.y, FONDO - 0.004);
// la balda de los trofeos (vacía hasta la v0.3, E26)
const TROFEOS = { x0: -1.25, x1: -0.35, y: 1.45, z: FONDO };
const trofeosG = new THREE.Group(); trofeosG.userData.quieto = true; scene.add(trofeosG);
const peanas = [];
rbox(TROFEOS.x1 - TROFEOS.x0, 0.025, 0.18, 0.005, mat(0x3A3552, { r: 0.6 }), (TROFEOS.x0 + TROFEOS.x1) / 2, TROFEOS.y, FONDO - 0.09, trofeosG);
[TROFEOS.x0 + 0.08, TROFEOS.x1 - 0.08].forEach(x => box(0.012, 0.08, 0.14, mat(0x5A566E, { m: 0.3, r: 0.5 }), x, TROFEOS.y - 0.05, FONDO - 0.08, trofeosG));
for (let i = 0; i < 3; i++) peanas.push(rbox(0.08, 0.035, 0.08, 0.01, mat(0x1E1B2E, { r: 0.4 }), TROFEOS.x0 + 0.17 + i * 0.28, TROFEOS.y + 0.03, FONDO - 0.09));
const placaTex = texFrom(256, 64, (c, w, h) => { c.fillStyle = '#C9C5DC'; c.fillRect(0, 0, w, h); c.fillStyle = '#2E2A42'; c.font = '600 26px ' + BODY; c.textAlign = 'center'; c.fillText('Logros · v0.3', w / 2, 42); });
plano(0.16, 0.04, new THREE.MeshLambertMaterial({ map: placaTex }), (TROFEOS.x0 + TROFEOS.x1) / 2, TROFEOS.y - 0.025, FONDO - 0.181, 0, Math.PI);
// el interruptor de la luz de techo, junto a la boca del pasillo
const interruptorPared = rbox(0.08, 0.08, 0.012, 0.006, mat(0xEEECF7, { r: 0.5 }), 0.15, 1.1, FONDO - 0.006);
const teclaPared = rbox(0.03, 0.045, 0.008, 0.004, mat(0xFAFAF7, { r: 0.4 }), 0.15, 1.1, FONDO - 0.014);

/* ---------- el rincón de juegos (E55, E56-2, E56-3): el zapatero blanco, la PS5 Pro, dos DualSense y la tele en su brazo ---------- */
const MUEBLE_TV = { x0: 0.88, x1: 1.25, z0: 2.35, z1: 3.25, alto: 0.55 };
const rinconG = new THREE.Group(); rinconG.userData.quieto = true; scene.add(rinconG);
{
  const cx = (MUEBLE_TV.x0 + MUEBLE_TV.x1) / 2, cz = (MUEBLE_TV.z0 + MUEBLE_TV.z1) / 2, w = MUEBLE_TV.x1 - MUEBLE_TV.x0, d = MUEBLE_TV.z1 - MUEBLE_TV.z0;
  rbox(w, MUEBLE_TV.alto, d, 0.01, mat(0xEEECF7, { r: 0.55 }), cx, MUEBLE_TV.alto / 2, cz, rinconG);
  [-1, 1].forEach(s => {                                                       // dos puertas lisas, con su tirador
    rbox(0.012, MUEBLE_TV.alto - 0.06, d / 2 - 0.02, 0.004, mat(0xFAFAF7, { r: 0.5 }), MUEBLE_TV.x0 - 0.004, MUEBLE_TV.alto / 2, cz + s * d / 4, rinconG);
    rbox(0.012, 0.1, 0.012, 0.004, mat(0x8E8AA3, { m: 0.5, r: 0.35 }), MUEBLE_TV.x0 - 0.014, MUEBLE_TV.alto / 2 + 0.08, cz + s * 0.04, rinconG);
  });
}
/* La PS5 Pro tumbada (boceto 04; medidas aproximadas 388 × 216 × 89 mm): dos tapas blancas curvas, el cuerpo negro
   y la franja central negra con sus tres rayas. Sin logotipos ni marcas. El lado largo va a lo largo de la pared. */
const consola = new THREE.Group(); consola.userData.quieto = true; consola.position.set(1.06, MUEBLE_TV.alto + 0.012, 2.95); consola.rotation.y = Math.PI / 2; scene.add(consola);
const PS5 = { L: 0.388, D: 0.216, H: 0.089 };
const consolaCuerpo = rbox(PS5.L - 0.03, PS5.H - 0.03, PS5.D - 0.03, 0.01, mat(0x141221, { r: 0.4 }), 0, PS5.H / 2, 0, consola);
{
  // una tapa: un perfil curvo (más grueso en el centro) extruido a lo ancho
  const perfil = new THREE.Shape(); perfil.moveTo(-PS5.L / 2, 0); perfil.lineTo(PS5.L / 2, 0); perfil.lineTo(PS5.L / 2, 0.008); perfil.quadraticCurveTo(0, 0.026, -PS5.L / 2, 0.008); perfil.closePath();
  const geo = new THREE.ExtrudeGeometry(perfil, { depth: PS5.D, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 2, curveSegments: 12 }); geo.translate(0, 0, -PS5.D / 2);
  const blanco = mat(0xFAFAF7, { r: 0.35 });
  const arriba = new THREE.Mesh(geo, blanco); arriba.position.y = PS5.H - 0.018; consola.add(arriba);
  const abajo = new THREE.Mesh(geo, blanco); abajo.rotation.x = Math.PI; abajo.position.y = 0.018; consola.add(abajo);
  // la franja central negra y sus tres rayas, en las dos tapas
  [PS5.H + 0.008, -0.002].forEach(y => { box(0.052, 0.006, PS5.D + 0.008, mat(0x1E1B2E, { r: 0.4 }), 0, y, 0, consola); [-0.015, 0, 0.015].forEach(x => box(0.006, 0.007, PS5.D + 0.009, mat(0x0E0C16, { r: 0.3 }), x, y, 0, consola)); });
  box(PS5.L - 0.06, 0.01, PS5.D - 0.08, mat(0xEEECF7, { r: 0.5 }), 0, -0.012, 0, consola);                     // la peana
}
const consolaLed = box(0.03, 0.004, 0.004, mat(0x3A3552, { e: 0x9CC3FF, ei: 0 }), PS5.L / 2 - 0.03, PS5.H / 2, PS5.D / 2 - 0.004, consola);
// dos DualSense: uno blanco (centro negro) y otro negro (boceto 04)
function creaMando(cuerpoC, centroC) {
  const g = new THREE.Group(); g.userData.quieto = true;
  const s = new THREE.Shape(), k = 0.001;   // el contorno de arriba, en milímetros (16 cm de ancho)
  s.moveTo(-60 * k, 32 * k); s.quadraticCurveTo(0, 44 * k, 60 * k, 32 * k); s.quadraticCurveTo(80 * k, 28 * k, 78 * k, 4 * k); s.lineTo(70 * k, -50 * k);
  s.quadraticCurveTo(66 * k, -66 * k, 50 * k, -62 * k); s.quadraticCurveTo(36 * k, -34 * k, 0, -30 * k); s.quadraticCurveTo(-36 * k, -34 * k, -50 * k, -62 * k);
  s.quadraticCurveTo(-66 * k, -66 * k, -70 * k, -50 * k); s.lineTo(-78 * k, 4 * k); s.quadraticCurveTo(-80 * k, 28 * k, -60 * k, 32 * k);
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.022, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.006, bevelSegments: 3, curveSegments: 10 }); geo.rotateX(-Math.PI / 2);
  const cuerpo = new THREE.Mesh(geo, mat(cuerpoC, { r: 0.4 })); g.add(cuerpo);
  const centro = rbox(0.07, 0.008, 0.045, 0.006, mat(centroC, { r: 0.35 }), 0, 0.03, -0.01, g);
  rbox(0.05, 0.004, 0.028, 0.004, mat(cuerpoC, { r: 0.3 }), 0, 0.035, -0.016, g);                               // el panel táctil
  [-0.022, 0.022].forEach(x => { cyl(0.009, 0.009, 0.012, mat(0x1E1B2E, { r: 0.5 }), x, 0.034, 0.012, g, 14); });   // las palancas
  [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([a, b]) => { cyl(0.004, 0.004, 0.004, mat(0x5A566E, { r: 0.4 }), 0.055 + a * 0.009, 0.032, -0.005 + b * 0.009, g, 10); box(0.006, 0.004, 0.006, mat(0x5A566E, { r: 0.4 }), -0.055 + a * 0.009, 0.032, -0.005 + b * 0.009, g); });
  return { g, cuerpo };
}
const mandoBlanco = creaMando(0xFAFAF7, 0x1E1B2E), mandoNegro = creaMando(0x2A2738, 0x141221);
const mandoG = mandoBlanco.g; mandoG.position.set(1.0, MUEBLE_TV.alto + 0.012, 2.55); mandoG.rotation.y = -Math.PI / 2 + 0.35; scene.add(mandoG);
mandoNegro.g.position.set(1.1, MUEBLE_TV.alto + 0.012, 2.47); mandoNegro.g.rotation.y = -Math.PI / 2 - 0.2; scene.add(mandoNegro.g);
const mandoCuerpo = mandoBlanco.cuerpo;
const teleTex = texFrom(960, 544);
const teleG = new THREE.Group(); teleG.position.set(1.02, 1.5, 2.8); teleG.rotation.y = -Math.PI / 2; scene.add(teleG);
const teleMarco = rbox(0.98, 0.57, 0.04, 0.01, mat(0x141221, { r: 0.35 }), 0, 0, -0.02, teleG);
const telePantalla = plano(0.95, 0.54, new THREE.MeshBasicMaterial({ map: teleTex, toneMapped: false }), 0, 0, 0.0015, 0, 0, teleG);
box(0.03, 0.18, 0.12, mat(0x1E1B2E, { m: 0.4 }), SALA.x1 - 0.015, 1.5, 2.8); box(0.2, 0.03, 0.03, mat(0x1E1B2E, { m: 0.4 }), SALA.x1 - 0.12, 1.5, 2.8);
const teleLuz = new THREE.PointLight(0x9CC3FF, 0, 2.5, 2); teleLuz.position.set(0.8, 1.5, 2.8); scene.add(teleLuz);


/* ---------- la silla de oficina con ruedas (E44): gira contigo y se aparta al levantarte ---------- */
const silla = new THREE.Group(); silla.position.set(0, 0, 0.45); scene.add(silla);
const sillaGiro = new THREE.Group(); silla.add(sillaGiro);   // la parte de arriba (gira); la estrella de abajo no
{
  const negro = mat(0x16141F, { r: 0.7 }), gris = mat(0x2E2A42, { r: 0.5, m: 0.3 }), cromo = mat(0x8E8AA3, { m: 0.7, r: 0.3 });
  for (let k = 0; k < 5; k++) {
    const a = k * Math.PI * 2 / 5, pata = rbox(0.3, 0.025, 0.04, 0.01, gris, Math.cos(a) * 0.15, 0.065, Math.sin(a) * 0.15, silla); pata.rotation.y = -a;
    const r = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 8), negro); r.position.set(Math.cos(a) * 0.29, 0.027, Math.sin(a) * 0.29); silla.add(r);
  }
  cyl(0.025, 0.025, 0.36, cromo, 0, 0.26, 0, silla);
  rbox(0.5, 0.08, 0.48, 0.04, negro, 0, 0.47, 0, sillaGiro);                       // asiento
  const respaldo = rbox(0.46, 0.6, 0.07, 0.05, negro, 0, 0.86, 0.24, sillaGiro); respaldo.rotation.x = -0.12;
  rbox(0.08, 0.2, 0.06, 0.02, gris, 0, 0.58, 0.23, sillaGiro);
  [-0.27, 0.27].forEach(x => { rbox(0.03, 0.18, 0.03, 0.01, gris, x, 0.58, 0.02, sillaGiro); rbox(0.06, 0.03, 0.26, 0.012, negro, x, 0.68, 0.0, sillaGiro); });
}

/* ---------- reloj de pared con la hora de Canarias (o la que pongas, E52) ---------- */
const RELOJ = { x: 1.03, y: 1.85, z: SALA.z0 };
const relojG = new THREE.Group(); relojG.position.set(RELOJ.x, RELOJ.y, RELOJ.z + 0.02); scene.add(relojG);
const esferaTex = texFrom(256, 256, (c, w, h) => {
  c.fillStyle = '#FAFAF7'; c.beginPath(); c.arc(128, 128, 126, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#1E1B2E'; c.font = '600 30px ' + DISP; c.textAlign = 'center'; c.textBaseline = 'middle';
  for (let i = 1; i <= 12; i++) { const a = i / 12 * Math.PI * 2; c.fillText(String(i), 128 + Math.sin(a) * 98, 128 - Math.cos(a) * 98); }
  c.fillStyle = '#8E8AA3'; c.font = '500 15px ' + BODY; c.fillText('Canarias', 128, 168);
});
const relojCaja = cyl(0.12, 0.12, 0.03, mat(0x1E1B2E, { r: 0.4 }), 0, 0, 0, relojG, 40); relojCaja.rotation.x = Math.PI / 2;
const esfera = plano(0.22, 0.22, new THREE.MeshStandardMaterial({ map: esferaTex, roughness: 0.5 }), 0, 0, 0.016, 0, 0, relojG);
const aguja = (l, a, color) => { const g = new THREE.Group(); g.position.z = 0.019 + a; relojG.add(g); box(a > 0.002 ? 0.004 : 0.008, l, 0.002, mat(color), 0, l / 2 - 0.012, 0, g); return g; };
const agujaH = aguja(0.058, 0, 0x1E1B2E), agujaM = aguja(0.085, 0.002, 0x1E1B2E), agujaS = aguja(0.09, 0.004, 0xFF6B4A);
