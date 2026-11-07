/* ===================== 03 · habitación =====================
   Lo que no se mueve. v0.2.2 (E44-E47, E55): el cuarto de Sergio a partir de su foto desde la puerta,
   escalado para caminar (3,75 × 4,30 m). Al fondo, la ventana con la mesa delante y el armario; a la
   izquierda, la cama, la mesita, el corcho y el póster; a la derecha, la estantería, la pizarra y el
   rincón de juegos; junto a la puerta, el sillón y los trofeos. Modelos más modernos hechos con three.js
   (torre, monitor, flexo, silla con ruedas, luz de techo con pantalla de tela); en la v0.4, de Blender.
   Las medidas salen de una sola tabla: material/v0.2.2/scripts/plano.py (y su plano.salida.json). */
const SALA = { x0: -2.5, x1: 1.25, z0: -1.2, z1: 3.1, alto: 2.6 };
const FONDO = SALA.z1;                         // pared de la puerta
const SALA_CX = (SALA.x0 + SALA.x1) / 2, SALA_CZ = (SALA.z0 + SALA.z1) / 2, SALA_W = SALA.x1 - SALA.x0, SALA_D = SALA.z1 - SALA.z0;
const VENTANA = { x0: -0.8, x1: 0.8, y0: 1.0, y1: 2.1 };
const PUERTA_X = -0.25;                         // bisagra de la puerta (se abre hacia dentro, sin tocar nada: plano.py)
// Zonas de choque del suelo (de plano.py: mueble + 0,22 m de radio de la persona) y puntos a los que se camina
const RADIO_PERSONA = 0.22;
const OBSTACULOS = [   // [nombre, x0, x1, z0, z1] sin agrandar (el radio se suma al comprobar)
  ['mesa', -0.95, 0.95, -1.2, 0.025], ['armario', -2.45, -1.3, -1.2, -0.62], ['mesita', -2.5, -2.05, 0.2, 0.65],
  ['cama', -2.5, -0.55, 0.72, 2.07], ['sillon', -2.4, -1.6, 2.3, 3.05], ['mesa-aux', -1.55, -1.2, 2.55, 2.95], ['mueble-tv', 0.85, 1.25, 2.0, 2.9]
];
const PUNTOS = {
  silla: { pos: [0, 0.55], mira: [0, 1.0, -1.2], sentado: true, nombre: 'la silla' },
  ventana: { pos: [-0.62, 0.38], mira: [0, 1.5, -1.6], nombre: 'la ventana' },
  estanteria: { pos: [0.62, 0.42], mira: [1.25, 1.45, -0.4], nombre: 'la estantería' },
  pizarra: { pos: [0.3, 1.15], mira: [1.25, 1.42, 1.15], nombre: 'la pizarra' },
  tele: { pos: [-0.05, 2.45], mira: [1.1, 1.4, 2.45], nombre: 'el rincón de juegos' },
  puerta: { pos: [0.2, 2.3], mira: [0.2, 1.2, 3.1], nombre: 'la puerta' },
  sillon: { pos: [-0.85, 2.45], mira: [-2.0, 0.6, 2.65], nombre: 'el sillón' },
  cama: { pos: [-0.3, 1.4], mira: [-1.5, 0.6, 1.4], nombre: 'la cama' },
  armario: { pos: [-1.62, 0.02], mira: [-1.87, 1.1, -0.62], nombre: 'el armario' },
  corcho: { pos: [-1.35, 0.1], mira: [-2.5, 1.38, 0.0], nombre: 'el corcho' }
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
const floorM = new THREE.MeshStandardMaterial({ map: sueloTex, roughness: 0.75 });
plano(SALA_W, SALA_D, floorM, SALA_CX, 0, SALA_CZ, -Math.PI / 2);
plano(SALA_W, SALA_D, mat(0x26223A, { r: 0.95 }), SALA_CX, SALA.alto, SALA_CZ, Math.PI / 2);
plano(SALA_D, SALA.alto, wallM, SALA.x0, SALA.alto / 2, SALA_CZ, 0, Math.PI / 2);     // izquierda
plano(SALA_D, SALA.alto, wallM, SALA.x1, SALA.alto / 2, SALA_CZ, 0, -Math.PI / 2);    // derecha
function paredConHueco(z, giro, hx0, hx1, hy0, hy1) {
  const r = giro ? Math.PI : 0;
  plano(hx0 - SALA.x0, SALA.alto, wallM, (SALA.x0 + hx0) / 2, SALA.alto / 2, z, 0, r);
  plano(SALA.x1 - hx1, SALA.alto, wallM, (hx1 + SALA.x1) / 2, SALA.alto / 2, z, 0, r);
  if (hy0 > 0) plano(hx1 - hx0, hy0, wallM, (hx0 + hx1) / 2, hy0 / 2, z, 0, r);
  plano(hx1 - hx0, SALA.alto - hy1, wallM, (hx0 + hx1) / 2, (hy1 + SALA.alto) / 2, z, 0, r);
}
paredConHueco(SALA.z0, false, VENTANA.x0, VENTANA.x1, VENTANA.y0, VENTANA.y1);
paredConHueco(FONDO, true, PUERTA_X, PUERTA_X + 0.85, 0, 2.0);
const rodapieM = mat(0x1E1B2E);
box(SALA_W, 0.08, 0.012, rodapieM, SALA_CX, 0.04, SALA.z0 + 0.006); box(SALA_W, 0.08, 0.012, rodapieM, SALA_CX, 0.04, FONDO - 0.006);
box(0.012, 0.08, SALA_D, rodapieM, SALA.x1 - 0.006, 0.04, SALA_CZ); box(0.012, 0.08, SALA_D, rodapieM, SALA.x0 + 0.006, 0.04, SALA_CZ);

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
[[0xF5C06B, -0.12, -0.1], [0xA99EF5, -0.08, -0.14], [0xFF9B80, 0.1, -0.3]].forEach(([c, x, z]) => box(0.07, 0.008, 0.07, mat(c, { r: 0.9 }), x, -0.042, z, cajonArriba));
cyl(0.005, 0.005, 0.13, mat(0x2F5FD0, { r: 0.4 }), 0.05, -0.04, -0.12, cajonArriba).rotation.z = Math.PI / 2;
const pistaTex = texFrom(320, 200, (c, w, h) => { c.fillStyle = '#FBF8EF'; c.fillRect(0, 0, w, h); c.fillStyle = '#C93F22'; c.fillRect(0, 0, w, 10); c.fillStyle = '#2E2A42'; c.font = '700 40px ' + MANO; c.fillText('Pista', 22, 62); c.font = '600 28px ' + MANO; c.fillText('Lo que no se ve también', 22, 110); c.fillText('está: busca en el PC.', 22, 146); c.fillStyle = '#8E8AA3'; c.font = '600 22px ' + MANO; c.fillText('(cuenta para un logro en la v0.3)', 22, 184); });
const pistaCarta = plano(0.13, 0.08, new THREE.MeshStandardMaterial({ map: pistaTex, roughness: 0.9 }), 0.0, -0.043, -0.3, -Math.PI / 2, 0, cajonArriba);
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
const LUZ_TECHO = { x: -0.6, z: 1.05, y: 2.12 };
const techoG = new THREE.Group(); techoG.position.set(LUZ_TECHO.x, 0, LUZ_TECHO.z); scene.add(techoG);
cyl(0.06, 0.06, 0.02, mat(0xEEECF7, { r: 0.6 }), 0, SALA.alto - 0.01, 0, techoG);
cyl(0.003, 0.003, SALA.alto - LUZ_TECHO.y - 0.12, mat(0x1E1B2E), 0, (SALA.alto + LUZ_TECHO.y + 0.12) / 2, 0, techoG);
const telaTecho = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.25, 0.26, 40, 1, true), mat(0xEEECF7, { r: 0.95, side: THREE.DoubleSide, e: 0xFFE2B8, ei: 0.0 }));
telaTecho.position.y = LUZ_TECHO.y; techoG.add(telaTecho);
[[0.21, 0.13], [0.25, -0.13]].forEach(([r, dy]) => { const a = new THREE.Mesh(new THREE.TorusGeometry(r, 0.005, 6, 48), mat(0x1E1B2E)); a.rotation.x = Math.PI / 2; a.position.y = LUZ_TECHO.y + dy; techoG.add(a); });
const bombillaTecho = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 10), mat(0xFFE2B8, { e: 0xFFE2B8, ei: 2 })); bombillaTecho.position.y = LUZ_TECHO.y - 0.02; techoG.add(bombillaTecho);
const techo = new THREE.PointLight(0xFFEBD2, 1.3, 0, 1.6); techo.position.set(LUZ_TECHO.x, LUZ_TECHO.y - 0.08, LUZ_TECHO.z); scene.add(techo);
const techoAtras = new THREE.PointLight(0xC9C5DC, 0.45, 0, 2); techoAtras.position.set(-0.4, 2.3, 2.4); scene.add(techoAtras);
// el interruptor de la pared, junto a la puerta
const interruptorPared = rbox(0.08, 0.08, 0.012, 0.006, mat(0xEEECF7, { r: 0.5 }), 0.78, 1.1, FONDO - 0.006);
const teclaPared = rbox(0.03, 0.045, 0.008, 0.004, mat(0xFAFAF7, { r: 0.4 }), 0.78, 1.1, FONDO - 0.014);

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
const brilloInterior = new THREE.PointLight(0xA99EF5, 0.25, 0.5, 2); brilloInterior.position.set(0.82, 0.95, -0.43); scene.add(brilloInterior);
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

/* ---------- el póster de ciudad (pared izquierda, sobre la cama) y la camiseta amarilla ---------- */
const POSTER = { x: SALA.x0 + 0.012, y: 1.52, z: 1.4, w: 1.1, h: 0.82 };
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
  // el autobús
  const bx = 150, by = h - 360;
  c.fillStyle = '#C2362B'; rr(c, bx, by, 260, 250, 18); c.fill();
  c.fillStyle = '#1E1B2E'; for (let k = 0; k < 4; k++) { c.fillRect(bx + 18 + k * 60, by + 24, 48, 52); c.fillRect(bx + 18 + k * 60, by + 120, 48, 52); }
  c.fillStyle = '#FAFAF7'; c.fillRect(bx, by + 92, 260, 8); c.fillStyle = '#1E1B2E'; c.beginPath(); c.arc(bx + 55, by + 250, 26, 0, Math.PI * 2); c.arc(bx + 205, by + 250, 26, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#F5C06B'; c.fillRect(bx + 236, by + 210, 18, 12);
  c.strokeStyle = '#2E2A42'; c.lineWidth = 3; c.beginPath(); c.moveTo(560, h - 170); c.lineTo(560, 120); c.stroke();   // una farola
  c.fillStyle = '#2E2A42'; c.fillRect(540, 110, 40, 14);
  c.strokeStyle = 'rgba(250,250,247,.8)'; c.lineWidth = 16; c.strokeRect(8, 8, w - 16, h - 16);
});
const posterMesh = plano(POSTER.w, POSTER.h, new THREE.MeshStandardMaterial({ map: posterTex, roughness: 0.55 }), POSTER.x, POSTER.y, POSTER.z, 0, Math.PI / 2);
const marcoPoster = box(0.015, POSTER.h + 0.04, POSTER.w + 0.04, mat(0x8E8AA3, { m: 0.5, r: 0.4 }), SALA.x0 + 0.004, POSTER.y, POSTER.z);
const camiseta = (() => {
  // camiseta amarilla colgada de una percha delante del póster, como en la foto (lisa, sin escudos ni marcas)
  const g = new THREE.Group(); g.position.set(SALA.x0 + 0.05, 1.55, POSTER.z + 0.18); g.rotation.y = Math.PI / 2; scene.add(g);
  const s = new THREE.Shape(); s.moveTo(-0.13, 0.2); s.lineTo(-0.05, 0.22); s.quadraticCurveTo(0, 0.18, 0.05, 0.22); s.lineTo(0.13, 0.2); s.lineTo(0.22, 0.1); s.lineTo(0.17, 0.05); s.lineTo(0.12, 0.09); s.lineTo(0.12, -0.24); s.lineTo(-0.12, -0.24); s.lineTo(-0.12, 0.09); s.lineTo(-0.17, 0.05); s.lineTo(-0.22, 0.1); s.closePath();
  const tex = texFrom(256, 256, (c, w, h) => { c.fillStyle = '#F5D02A'; c.fillRect(0, 0, w, h); c.fillStyle = '#2F5FD0'; c.fillRect(0, 0, w, 18); c.strokeStyle = '#C2362B'; c.lineWidth = 10; c.beginPath(); c.moveTo(20, 140); c.lineTo(90, 90); c.moveTo(166, 90); c.lineTo(236, 140); c.stroke(); c.strokeStyle = '#2F5FD0'; c.lineWidth = 8; c.beginPath(); c.moveTo(20, 158); c.lineTo(90, 108); c.moveTo(166, 108); c.lineTo(236, 158); c.stroke(); });
  const geo = new THREE.ShapeGeometry(s); const pos = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + 0.22) / 0.44, (pos.getY(i) + 0.24) / 0.46);
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, side: THREE.DoubleSide })); g.add(m);
  const percha = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.003, 6, 16, Math.PI * 1.4), mat(0x8E8AA3, { m: 0.6 })); percha.position.y = 0.25; g.add(percha);
  return { g, m };
})();

/* ---------- la pizarra, ahora en la pared derecha (el lienzo y los rotuladores están en el módulo 09) ---------- */
const PIZ = { x: SALA.x1 - 0.022, z: 1.15, y: 1.45, w: 1.3, h: 0.853 };
const boardFrame = rbox(0.02, 0.92, 1.36, 0.008, mat(0x8E8AA3, { r: 0.5, m: 0.3 }), SALA.x1 - 0.01, PIZ.y, PIZ.z);
const boardTray = box(0.06, 0.012, 1.1, mat(0x8E8AA3, { r: 0.5, m: 0.3 }), SALA.x1 - 0.035, 0.985, PIZ.z);

/* ---------- la puerta (pared de la puerta, z1): bisagra en x = −0,25, se abre hacia dentro ---------- */
const door = new THREE.Group(); door.position.set(PUERTA_X, 0, FONDO - 0.01); scene.add(door);
const doorSlab = rbox(0.85, 2.0, 0.04, 0.008, mat(0xE8E6F5, { r: 0.6 }), 0.425, 1.0, 0, door);
const doorPanelM = mat(0xD8D5E6, { r: 0.7 });
box(0.6, 0.7, 0.006, doorPanelM, 0.425, 1.45, -0.022, door); box(0.6, 0.7, 0.006, doorPanelM, 0.425, 0.55, -0.022, door);
const doorKnob = new THREE.Group(); doorKnob.position.set(0.77, 1.0, -0.04); door.add(doorKnob);
const knobMesh = rbox(0.11, 0.018, 0.018, 0.008, mat(0x5A566E, { m: 0.7, r: 0.3 }), -0.04, 0, 0, doorKnob);
cyl(0.024, 0.024, 0.012, mat(0x5A566E, { m: 0.7, r: 0.3 }), 0, 0, 0.012, doorKnob).rotation.x = Math.PI / 2;
const notaTex = texFrom(256, 200, (c, w, h) => {
  c.fillStyle = '#F7F1D9'; c.fillRect(0, 0, w, h);
  c.fillStyle = '#2E2A42'; c.font = '700 46px ' + MANO; c.fillText('Volver', 30, 80); c.fillText('a la web', 30, 132);
  c.strokeStyle = '#C93F22'; c.lineWidth = 5; c.beginPath(); c.moveTo(150, 170); c.lineTo(220, 170); c.lineTo(205, 158); c.moveTo(220, 170); c.lineTo(205, 182); c.stroke();
});
const nota = plano(0.16, 0.125, new THREE.MeshStandardMaterial({ map: notaTex, roughness: 0.9 }), 0.425, 1.62, -0.027, 0, Math.PI, door); nota.rotation.z = 0.04;
const frameM = mat(0xD8D5E6, { r: 0.6 });
box(0.04, 2.04, 0.06, frameM, PUERTA_X - 0.02, 1.02, FONDO); box(0.04, 2.04, 0.06, frameM, PUERTA_X + 0.87, 1.02, FONDO); box(0.93, 0.04, 0.06, frameM, PUERTA_X + 0.425, 2.02, FONDO);
const pasillo = plano(0.85, 2.0, new THREE.MeshBasicMaterial({ color: 0xFFE9C9 }), PUERTA_X + 0.425, 1.0, FONDO + 0.22, 0, Math.PI);
const pasilloLuz = new THREE.PointLight(0xFFE2B8, 0, 0, 2); pasilloLuz.position.set(PUERTA_X + 0.42, 1.3, FONDO - 0.1); scene.add(pasilloLuz);
const luzPuerta = new THREE.PointLight(0xC9C5DC, 0.35, 0, 2); luzPuerta.position.set(PUERTA_X + 0.42, 1.8, FONDO - 0.6); scene.add(luzPuerta);
box(0.02, 2.0, 0.22, mat(0x221E33), PUERTA_X, 1.0, FONDO + 0.11); box(0.02, 2.0, 0.22, mat(0x221E33), PUERTA_X + 0.85, 1.0, FONDO + 0.11);

/* ---------- alfombra ---------- */
const alfombraTex = texFrom(256, 330, (c, w, h) => { c.fillStyle = '#2E2A60'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(169,158,245,.35)'; c.lineWidth = 6; c.strokeRect(14, 14, w - 28, h - 28); c.fillStyle = 'rgba(255,107,74,.25)'; for (let y = 40; y < h - 30; y += 26) c.fillRect(30, y, w - 60, 3); });
plano(1.3, 1.4, new THREE.MeshStandardMaterial({ map: alfombraTex, roughness: 0.95 }), -0.1, 0.004, 1.7, -Math.PI / 2);

/* ---------- la cama (pared izquierda, con el cabecero en ella, como en la foto) ---------- */
const CAMA = { x0: -2.5, x1: -0.55, z0: 0.72, z1: 2.07, alto: 0.55 };
const camaG = new THREE.Group(); scene.add(camaG);
{
  const cx = (CAMA.x0 + CAMA.x1) / 2, cz = (CAMA.z0 + CAMA.z1) / 2, l = CAMA.x1 - CAMA.x0, w = CAMA.z1 - CAMA.z0;
  rbox(l - 0.06, 0.3, w, 0.02, mat(0xEEECF7, { r: 0.6 }), cx + 0.03, 0.17, cz, camaG);                        // canapé blanco
  rbox(l - 0.1, 0.18, w - 0.06, 0.05, mat(0xE8E6F5, { r: 0.95 }), cx + 0.03, 0.41, cz, camaG);                // colchón
  const manta = rbox(l - 0.48, 0.04, w + 0.03, 0.02, mat(0x2F4FB8, { r: 0.95 }), cx + 0.25, 0.51, cz, camaG);  // la manta azul de la foto
  [cz - 0.3, cz + 0.3].forEach(z => rbox(0.32, 0.11, 0.5, 0.05, mat(0x9CC3FF, { r: 0.95 }), CAMA.x0 + 0.27, 0.54, z, camaG));   // almohadas
  rbox(0.06, 1.05, w + 0.04, 0.02, mat(0x8E8AA3, { r: 0.8 }), CAMA.x0 + 0.03, 0.525, cz, camaG);           // cabecero gris
  camaG.userData.manta = manta;
}
// la mesita blanca con el despertador, una lámpara pequeña y el móvil
const MESITA = { x0: -2.5, x1: -2.05, z0: 0.2, z1: 0.65, alto: 0.55 };
const mesitaG = new THREE.Group(); scene.add(mesitaG);
{
  const cx = (MESITA.x0 + MESITA.x1) / 2, cz = (MESITA.z0 + MESITA.z1) / 2;
  rbox(MESITA.x1 - MESITA.x0, MESITA.alto, MESITA.z1 - MESITA.z0, 0.012, mat(0xEEECF7, { r: 0.55 }), cx, MESITA.alto / 2, cz, mesitaG);
  [0.18, 0.4].forEach(y => rbox(0.01, 0.003, 0.12, 0.002, mat(0x5A566E), MESITA.x1 + 0.002, y, cz, mesitaG));
  cyl(0.05, 0.06, 0.02, mat(0x2E2A42), cx - 0.08, MESITA.alto + 0.01, MESITA.z0 + 0.1, mesitaG);          // lamparita
  cyl(0.008, 0.008, 0.2, mat(0x2E2A42), cx - 0.08, MESITA.alto + 0.11, MESITA.z0 + 0.1, mesitaG);
  new THREE.Mesh(); const pant = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.075, 0.1, 24, 1, true), mat(0xEEECF7, { r: 0.95, side: THREE.DoubleSide })); pant.position.set(cx - 0.08, MESITA.alto + 0.24, MESITA.z0 + 0.1); mesitaG.add(pant);
}
const despertador = cyl(0.04, 0.04, 0.035, mat(0xFAFAF7, { r: 0.4 }), -2.2, MESITA.alto + 0.04, 0.45); despertador.rotation.z = Math.PI / 2; despertador.rotation.y = Math.PI / 2 - 0.6;
// el móvil (E49, y la puerta de la versión móvil, E53): pantalla de lienzo; se dibuja en el módulo 12
const movilTex = texFrom(256, 512);
const movilG = new THREE.Group(); movilG.position.set(-2.18, MESITA.alto + 0.006, 0.32); movilG.rotation.set(-Math.PI / 2, 0, 0.5); scene.add(movilG);
const movilCuerpo = rbox(0.075, 0.155, 0.009, 0.008, mat(0x141221, { r: 0.3, m: 0.4 }), 0, 0, 0, movilG);
const movilPantalla = plano(0.068, 0.145, new THREE.MeshBasicMaterial({ map: movilTex, toneMapped: false }), 0, 0, 0.0047, 0, 0, movilG);
// la mochila negra, encima de la cama (fallo 1: en el suelo chocaba con la puerta)
const mochilaG = new THREE.Group(); mochilaG.position.set(-1.12, CAMA.alto + 0.02, 1.22); mochilaG.rotation.set(0, 0.5, 0); scene.add(mochilaG);
const mochilaM = mat(0x16141F, { r: 0.85 });
const mochila = rbox(0.32, 0.12, 0.44, 0.05, mochilaM, 0, 0.06, 0, mochilaG);                           // tumbada, como en la foto
const mochilaTapa = new THREE.Group(); mochilaTapa.position.set(0, 0.12, -0.2); mochilaG.add(mochilaTapa);
const mochilaSolapa = rbox(0.3, 0.025, 0.2, 0.02, mat(0x1E1B2E, { r: 0.85 }), 0, 0.01, 0.1, mochilaTapa);
rbox(0.06, 0.02, 0.36, 0.008, mat(0x2E2A42), -0.1, 0.125, 0.0, mochilaG); rbox(0.06, 0.02, 0.36, 0.008, mat(0x2E2A42), 0.1, 0.125, 0.0, mochilaG);
box(0.2, 0.004, 0.008, mat(0xFF6B4A, { e: 0xFF6B4A, ei: 0.1 }), 0, 0.122, 0.17, mochilaG);           // la cremallera, con un tirador coral

/* ---------- el corcho (pared izquierda, junto al armario) ---------- */
const CORCHO_POS = { x: SALA.x0 + 0.02, y: 1.38, z: 0.0, w: 1.0, h: 0.65 };
const corchoTex = texFrom(1024, 666, (c, w, h) => dibujaCorcho(c, w, h));
const corchoMarco = box(0.02, CORCHO_POS.h + 0.04, CORCHO_POS.w + 0.04, mat(0x5A566E, { r: 0.6 }), SALA.x0 + 0.01, CORCHO_POS.y, CORCHO_POS.z);
const corchoMesh = plano(CORCHO_POS.w, CORCHO_POS.h, new THREE.MeshStandardMaterial({ map: corchoTex, roughness: 0.95 }), SALA.x0 + 0.021, CORCHO_POS.y, CORCHO_POS.z, 0, Math.PI / 2);
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
      c.fillStyle = '#2E2A42'; c.font = '700 30px ' + MANO; c.fillText(it.t, 14, 152);
      c.font = '600 22px ' + MANO; wrap(c, it.s, 14, 176, ancho - 24, 20);
    } else if (it.tipo === 'entrada') {
      c.fillStyle = it.color; c.fillRect(0, 30, ancho, 120); c.shadowColor = 'transparent';
      c.fillStyle = '#FBF8EF'; c.fillRect(ancho - 52, 30, 52, 120);
      c.fillStyle = '#B98A55'; for (let yy = 36; yy < 150; yy += 14) { c.beginPath(); c.arc(ancho - 52, yy, 3, 0, Math.PI * 2); c.fill(); }
      c.fillStyle = '#FAFAF7'; c.font = '600 24px ' + DISP; c.fillText(it.t, 14, 66);
      c.font = '500 17px ' + BODY; wrap(c, it.s, 14, 94, ancho - 76, 21);
      c.save(); c.translate(ancho - 20, 138); c.rotate(-Math.PI / 2); c.fillStyle = '#2E2A42'; c.font = '600 15px ' + BODY; c.fillText('ADMITE 1', 0, 0); c.restore();
    } else {
      c.fillStyle = it.color; c.fillRect(20, 10, ancho - 40, ancho - 40); c.shadowColor = 'transparent';
      c.fillStyle = '#2E2A42'; c.font = '700 30px ' + MANO; c.fillText(it.t, 34, 52);
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

/* ---------- el armario de tres puertas, con espejo en la del centro y cajas encima (E49, E50) ---------- */
const ARMARIO = { x0: -2.45, x1: -1.3, z0: -1.2, z1: -0.62, alto: 2.0 };
const armarioG = new THREE.Group(); scene.add(armarioG);
const armarioPuertas = [];
{
  const { x0, x1, z0, z1, alto } = ARMARIO, w = x1 - x0, d = z1 - z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, blanco = mat(0xEEECF7, { r: 0.55 });
  // la caja, abierta por delante: fondo, laterales, techo y suelo
  box(w, alto, 0.02, blanco, cx, alto / 2, z0 + 0.01, armarioG); box(0.02, alto, d, blanco, x0 + 0.01, alto / 2, cz, armarioG); box(0.02, alto, d, blanco, x1 - 0.01, alto / 2, cz, armarioG);
  box(w, 0.02, d, blanco, cx, alto - 0.01, cz, armarioG); box(w, 0.06, d, blanco, cx, 0.03, cz, armarioG);
  box(w - 0.04, alto - 0.08, 0.01, mat(0x2E2A42, { r: 0.9 }), cx, alto / 2, z0 + 0.025, armarioG);     // el fondo por dentro, oscuro
  // dentro: la barra con perchas y ropa (en la v0.3 aquí se guardará la personalización, E28), una balda y una caja
  cyl(0.01, 0.01, w - 0.06, mat(0x8E8AA3, { m: 0.7 }), cx, 1.7, cz, armarioG).rotation.z = Math.PI / 2;
  [0x2F5FD0, 0xFAFAF7, 0x1E1B2E, 0xC2362B, 0x5A566E, 0x16794B, 0xF5D02A].forEach((c, i) => {
    const r = rbox(0.06, 0.62, 0.42, 0.03, mat(c, { r: 0.95 }), x0 + 0.12 + i * 0.13, 1.36, cz, armarioG); r.rotation.y = (i % 2 ? 0.08 : -0.06);
  });
  box(w - 0.04, 0.02, d - 0.04, blanco, cx, 0.62, cz, armarioG);
  const cajaPersonal = rbox(0.38, 0.22, 0.32, 0.01, mat(0xF7F1D9, { r: 0.8 }), cx - 0.2, 0.74, cz, armarioG);
  const etiq = texFrom(256, 128, (c, w2, h2) => { c.fillStyle = '#F7F1D9'; c.fillRect(0, 0, w2, h2); c.fillStyle = '#2E2A42'; c.font = '700 40px ' + MANO; c.fillText('Personalización', 14, 56); c.font = '600 30px ' + MANO; c.fillStyle = '#C93F22'; c.fillText('se llena en la v0.3', 14, 100); });
  plano(0.3, 0.15, new THREE.MeshStandardMaterial({ map: etiq, roughness: 0.9 }), cx - 0.2, 0.74, cz + 0.161, 0, 0, armarioG);
  [[0x5B4BDB, 0.18], [0xFF6B4A, 0.32]].forEach(([c, dx]) => rbox(0.12, 0.08, 0.3, 0.01, mat(c, { r: 0.9 }), cx + dx, 0.67, cz, armarioG));   // ropa doblada
  // tres puertas con bisagra: la de la izquierda y la del centro giran sobre su lado izquierdo; la de la derecha, sobre el derecho
  const pw = w / 3;
  [[x0, 1], [x0 + pw, 1], [x1, -1]].forEach(([bx, lado], i) => {
    const p = new THREE.Group(); p.position.set(bx, 0, z1 + 0.012); armarioG.add(p);
    const hoja = rbox(pw - 0.006, alto - 0.04, 0.022, 0.006, blanco, lado * pw / 2, alto / 2, 0, p);
    if (i === 1) plano(pw - 0.1, alto - 0.5, new THREE.MeshStandardMaterial({ color: 0xC9D2E8, roughness: 0.05, metalness: 0.85 }), pw / 2, alto / 2, 0.0115, 0, 0, p);   // el espejo
    else { box(0.004, alto - 0.3, 0.004, mat(0xD8D5E6), lado * pw / 2, alto / 2, 0.012, p); }
    rbox(0.012, 0.16, 0.02, 0.004, mat(0x8E8AA3, { m: 0.6 }), lado * (pw - 0.04), 1.05, 0.02, p);   // tirador
    p.userData.lado = lado; armarioPuertas.push({ p, hoja, lado });
  });
  // las cajas de encima (sin marcas)
  [[0xD9651C, -0.3, 0.26], [0x2F5FD0, 0.1, 0.18], [0x2E2A42, 0.38, 0.22], [0xFAFAF7, -0.05, 0.14]].forEach(([c, dx, h], i) => rbox(0.3, h, 0.38, 0.01, mat(c, { r: 0.8 }), cx + dx, alto + h / 2 + (i === 3 ? 0.18 : 0), cz, armarioG));
}

/* ---------- el sillón (junto a la puerta), la mesa auxiliar con los libros de 2º y los trofeos ---------- */
const SILLON = { x0: -2.4, x1: -1.6, z0: 2.3, z1: 3.05 };
const sillonG = new THREE.Group(); scene.add(sillonG);
{
  const cx = (SILLON.x0 + SILLON.x1) / 2, M = mat(0xD9651C, { r: 0.9 }), M2 = mat(0xC2552E, { r: 0.9 });
  rbox(0.8, 0.26, 0.72, 0.04, M2, cx, 0.17, 2.68, sillonG);                     // base
  rbox(0.58, 0.12, 0.58, 0.05, M, cx, 0.36, 2.62, sillonG);                     // cojín del asiento
  rbox(0.8, 0.6, 0.18, 0.06, M2, cx, 0.6, 2.96, sillonG);                       // respaldo (mirando hacia la ventana)
  [SILLON.x0 + 0.07, SILLON.x1 - 0.07].forEach(x => rbox(0.13, 0.26, 0.72, 0.05, M2, x, 0.42, 2.68, sillonG));
  const cojin = rbox(0.28, 0.24, 0.08, 0.04, mat(0xE8E6F5, { r: 0.95 }), cx + 0.18, 0.55, 2.83, sillonG); cojin.rotation.set(-0.25, 0, 0.2);
  [[SILLON.x0 + 0.06, 2.38], [SILLON.x1 - 0.06, 2.38], [SILLON.x0 + 0.06, 2.98], [SILLON.x1 - 0.06, 2.98]].forEach(([x, z]) => cyl(0.015, 0.012, 0.05, mat(0x1E1B2E), x, 0.025, z, sillonG));
}
const MESA_AUX = { x0: -1.55, x1: -1.2, z0: 2.55, z1: 2.95, alto: 0.48 };
{
  const cx = (MESA_AUX.x0 + MESA_AUX.x1) / 2, cz = (MESA_AUX.z0 + MESA_AUX.z1) / 2;
  const t = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.025, 36), mat(0x2E2A42, { r: 0.5 })); t.position.set(cx, MESA_AUX.alto, cz); scene.add(t);
  cyl(0.015, 0.015, MESA_AUX.alto, mat(0x8E8AA3, { m: 0.5 }), cx, MESA_AUX.alto / 2, cz); cyl(0.12, 0.13, 0.015, mat(0x2E2A42), cx, 0.008, cz);
}
const TROFEOS = { x0: -2.35, x1: -1.65, z: FONDO, w: 0.7 };
const trofeosG = new THREE.Group(); scene.add(trofeosG);
const peanas = [];
[1.5, 1.8].forEach(y => {
  rbox(TROFEOS.w, 0.02, 0.18, 0.005, shelfM, (TROFEOS.x0 + TROFEOS.x1) / 2, y, FONDO - 0.09, trofeosG);
  for (let i = 0; i < 3; i++) peanas.push(rbox(0.07, 0.035, 0.07, 0.01, mat(0x1E1B2E, { r: 0.4 }), TROFEOS.x0 + 0.13 + i * 0.22, y + 0.028, FONDO - 0.09, trofeosG));
});
const placaTex = texFrom(256, 64, (c, w, h) => { c.fillStyle = '#C9C5DC'; c.fillRect(0, 0, w, h); c.fillStyle = '#2E2A42'; c.font = '600 26px ' + BODY; c.textAlign = 'center'; c.fillText('Logros · v0.3', w / 2, 42); });
plano(0.16, 0.04, new THREE.MeshStandardMaterial({ map: placaTex, roughness: 0.4, metalness: 0.3 }), (TROFEOS.x0 + TROFEOS.x1) / 2, 1.475, FONDO - 0.181, 0, Math.PI, trofeosG);

/* ---------- el rincón de juegos (E55): mueble con el paño rojo, la consola, el mando, un altavoz y la tele en su brazo ---------- */
const MUEBLE_TV = { x0: 0.85, x1: 1.25, z0: 2.0, z1: 2.9, alto: 0.5 };
const rinconG = new THREE.Group(); scene.add(rinconG);
{
  const cx = (MUEBLE_TV.x0 + MUEBLE_TV.x1) / 2, cz = (MUEBLE_TV.z0 + MUEBLE_TV.z1) / 2;
  rbox(MUEBLE_TV.x1 - MUEBLE_TV.x0, MUEBLE_TV.alto, MUEBLE_TV.z1 - MUEBLE_TV.z0, 0.012, mat(0xEEECF7, { r: 0.55 }), cx, MUEBLE_TV.alto / 2, cz, rinconG);
  box(MUEBLE_TV.x1 - MUEBLE_TV.x0 + 0.04, 0.006, MUEBLE_TV.z1 - MUEBLE_TV.z0 - 0.1, mat(0xC2362B, { r: 0.95 }), cx - 0.02, MUEBLE_TV.alto + 0.003, cz, rinconG);   // el paño rojo
  box(0.006, 0.2, MUEBLE_TV.z1 - MUEBLE_TV.z0 - 0.1, mat(0xC2362B, { r: 0.95 }), MUEBLE_TV.x0 - 0.02, MUEBLE_TV.alto - 0.1, cz, rinconG);
}
const consola = new THREE.Group(); consola.position.set(1.05, MUEBLE_TV.alto + 0.04, 2.66); scene.add(consola);
const consolaCuerpo = rbox(0.26, 0.07, 0.36, 0.03, mat(0xFAFAF7, { r: 0.35 }), 0, 0, 0, consola);
rbox(0.15, 0.072, 0.36, 0.02, mat(0x1E1B2E, { r: 0.4 }), 0, 0.001, 0, consola).scale.set(0.5, 1, 1.01);
const consolaLed = box(0.03, 0.004, 0.004, mat(0x3A3552, { e: 0x9CC3FF, ei: 0 }), -0.13, 0.0, 0.1, consola);
const mandoG = new THREE.Group(); mandoG.position.set(1.0, MUEBLE_TV.alto + 0.02, 2.25); mandoG.rotation.y = 0.4; scene.add(mandoG);
const mandoCuerpo = rbox(0.15, 0.035, 0.09, 0.02, mat(0xFAFAF7, { r: 0.4 }), 0, 0, 0, mandoG);
[[-0.045, 0.02], [0.045, 0.02]].forEach(([x, z]) => cyl(0.012, 0.012, 0.01, mat(0x1E1B2E), x, 0.02, z, mandoG));
cyl(0.035, 0.035, 0.17, mat(0x1E1B2E, { r: 0.5 }), 1.12, MUEBLE_TV.alto + 0.09, 2.08);   // altavoz
const teleTex = texFrom(960, 544);
const teleG = new THREE.Group(); teleG.position.set(1.02, 1.48, 2.45); teleG.rotation.y = -Math.PI / 2; scene.add(teleG);
const teleMarco = rbox(0.98, 0.57, 0.04, 0.01, mat(0x141221, { r: 0.35 }), 0, 0, -0.02, teleG);
const telePantalla = plano(0.95, 0.54, new THREE.MeshBasicMaterial({ map: teleTex, toneMapped: false }), 0, 0, 0.0015, 0, 0, teleG);
// el brazo articulado de la pared
box(0.03, 0.18, 0.12, mat(0x1E1B2E, { m: 0.4 }), SALA.x1 - 0.015, 1.48, 2.45); box(0.2, 0.03, 0.03, mat(0x1E1B2E, { m: 0.4 }), SALA.x1 - 0.12, 1.48, 2.45);
const teleLuz = new THREE.PointLight(0x9CC3FF, 0, 2.5, 2); teleLuz.position.set(0.8, 1.48, 2.45); scene.add(teleLuz);

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
