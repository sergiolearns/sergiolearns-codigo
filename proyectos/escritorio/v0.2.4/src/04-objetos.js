/* ===================== 04 · objetos =====================
   El registro de objetos (qué se puede tocar, cómo se llama, qué hace) y los
   objetos que se cogen: discos en su estuche, USB en el portalápices, carpetas
   en el cajón, libros y manual en la estantería, y la taza con su vapor. */
const objetos = new Map(), pickables = [];
function mats(m) { return Array.isArray(m.material) ? m.material : [m.material]; }
/* registrar(clave, {nombre, mallas, raiz, movil, alClic, alUsar, alArrastrar, insp, activo}) */
function registrar(clave, o) {
  o.clave = clave;
  o.activo = o.activo || (() => gesto.estado === 'libre');
  objetos.set(clave, o);
  o.mallas.forEach(m => {
    m.userData.clave = clave; pickables.push(m);
    m.material = Array.isArray(m.material) ? m.material.map(x => x.clone()) : m.material.clone();
    mats(m).forEach(x => { if (x.emissive) { x.userData.e0 = x.emissive.getHex(); x.userData.ei0 = x.emissiveIntensity; } });
  });
  if (o.raiz) guardaCasa(o);
  return o;
}
function guardaCasa(o) { const r = o.raiz; o.casa = { padre: r.parent, pos: r.position.clone(), quat: r.quaternion.clone() }; }
// Brillo coral al pasar por encima (k = 0 apaga, 1 = resaltado normal, más = zona de destino)
function brillo(mallas, k, color = 0xFF6B4A) {
  mallas.forEach(m => mats(m).forEach(x => {
    if (!x.emissive) return;
    if (k <= 0) { x.emissive.setHex(x.userData.e0 ?? 0); x.emissiveIntensity = x.userData.ei0 ?? 0; }
    else { x.emissive.setHex(color); x.emissiveIntensity = Math.max(0.22 * k, x.userData.ei0 ?? 0); }
  }));
}

/* ---------- discos (simulacros) en su archivador de metacrilato (E43) ----------
   Antes, una caja morada con tapa opaca que no se entendía. Ahora: paredes transparentes, frente opaco con su
   rótulo y la tapa transparente con bisagra atrás. Boceto: material/v0.2.2/bocetos/03-caja-cd-y-usb.svg */
const ESTUCHE = v3(-0.56, MESA_Y, -0.38);   // v0.2.4 (boceto 01): a la izquierda, entre el flexo y el teclado
const estuche = new THREE.Group(); estuche.position.copy(ESTUCHE); scene.add(estuche);
const acriM = new THREE.MeshStandardMaterial({ color: 0xC9E3F5, roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.22, depthWrite: false });
const estM = mat(0x2E2A42, { r: 0.6 });
box(0.17, 0.006, 0.15, estM, 0, 0.003, 0, estuche);
const rotuloTex = texFrom(256, 72, (c, w, h) => { c.fillStyle = '#2E2A42'; c.fillRect(0, 0, w, h); c.fillStyle = '#FAFAF7'; c.font = '600 30px ' + DISP; c.textAlign = 'center'; c.fillText('SIMULACROS', w / 2, 36); c.fillStyle = '#A99EF5'; c.font = '500 16px ' + BODY; c.fillText('4 discos · examen entero', w / 2, 60); });
const estFrente = box(0.17, 0.05, 0.006, [estM, estM, estM, estM, new THREE.MeshStandardMaterial({ map: rotuloTex, roughness: 0.6 }), estM], 0, 0.025, 0.072, estuche);   // frente opaco con el rótulo
box(0.17, 0.135, 0.004, acriM, 0, 0.0675, -0.073, estuche);
box(0.004, 0.135, 0.15, acriM, -0.083, 0.0675, 0, estuche); box(0.004, 0.135, 0.15, acriM, 0.083, 0.0675, 0, estuche);
box(0.17, 0.085, 0.004, acriM, 0, 0.0925, 0.073, estuche);
for (let i = 0; i < 4; i++) box(0.15, 0.006, 0.008, mat(0x5A566E), 0, 0.009, 0.035 - i * 0.026, estuche);     // las ranuras del fondo
const tapaEst = new THREE.Group(); tapaEst.position.set(0, 0.135, -0.075); estuche.add(tapaEst);
const tapaMesh = box(0.174, 0.004, 0.152, acriM.clone(), 0, 0.002, 0.076, tapaEst);
tapaMesh.material.opacity = 0.3;
const discos = [];
// la tapa de un cilindro pone la «v» de lado: se gira el lienzo 90° para que la franja quede arriba (v0.2.2)
function giraTex(t) { t.center.set(0.5, 0.5); t.rotation = Math.PI / 2; return t; }
// v0.2.3 (fallo 25): la etiqueta es un CÍRCULO (la tapa del cilindro): todo el texto va dentro de un radio de 104 px de
// 128 (con margen), centrado y ajustado a su ancho en esa altura; la franja de color es un casquete del círculo, no una
// banda que se corta en las esquinas
function etiquetaDisco(s) {
  return giraTex(texFrom(256, 256, (c, w, h) => {
    c.fillStyle = '#D8D5E6'; c.fillRect(0, 0, w, h);
    c.save(); c.beginPath(); c.arc(128, 128, 124, 0, Math.PI * 2); c.clip();
    c.fillStyle = '#F7F4EA'; c.fillRect(0, 0, w, h);                                                 // etiqueta de papel
    c.fillStyle = s.color; c.fillRect(0, 0, w, 76);                                                 // franja de color (E41), recortada por el círculo
    c.restore();
    const ancho = y => 2 * Math.sqrt(Math.max(0, 104 * 104 - (y - 128) * (y - 128)));               // el ancho que cabe a la altura y
    dibujaIcono(c, s.icono, 70, 30, 30, '#FAFAF7', 2.4);
    c.fillStyle = '#FAFAF7'; c.textAlign = 'left'; cabe(c, s.code, 108, 56, 80, 28, '600', DISP); c.textAlign = 'center';
    c.fillStyle = '#C9C5DC'; c.beginPath(); c.arc(128, 128, 30, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#1E1B2E'; c.beginPath(); c.arc(128, 128, 11, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#2E2A42'; cabe(c, 'Simulacro', 128, 98, ancho(98) - 8, 30, '700', MANO);
    s.partes.forEach((p, i) => { const y = 184 + i * 26; cabe(c, p[0] + ' · ' + fechaCorta(p[1]), 128, y, ancho(y) - 10, 24, '600', MANO); });
  }));
}
function reversoDisco(s) {
  // el reverso, girado igual que la cara (antes se leía de lado) y con su texto dentro del círculo
  const t = texFrom(256, 256, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#C9C5DC'); g.addColorStop(0.45, '#E8E6F5'); g.addColorStop(0.55, '#A99EF5'); g.addColorStop(1, '#C9C5DC');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = '#1E1B2E'; c.beginPath(); c.arc(128, 128, 11, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#2E2A42'; c.font = '600 21px ' + MANO; c.textAlign = 'center';
    wrapCentro(c, s.reverso, 128, 150, 150, 21);
  });
  return giraTex(t);   // la tapa de abajo del cilindro tiene la u y la v en espejo respecto a la de arriba, y al darle la vuelta
}                     // al disco la vista también se refleja: los dos espejos se anulan y basta el mismo giro que la cara
function wrapCentro(c, texto, cx, y, maxW, lh) { const pal = texto.split(' '); let l = ''; for (const p of pal) { const t = l ? l + ' ' + p : p; if (c.measureText(t).width > maxW && l) { c.fillText(l, cx, y); l = p; y += lh; } else l = t; } if (l) c.fillText(l, cx, y); }
SIMULACROS.forEach((s, i) => {
  const borde = mat(0xC9C5DC, { r: 0.3, m: 0.6 });
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.004, 48),
    [borde, new THREE.MeshStandardMaterial({ map: etiquetaDisco(s), roughness: 0.5 }), new THREE.MeshStandardMaterial({ map: reversoDisco(s), roughness: 0.25, metalness: 0.4 })]);
  // de pie en el estuche, mirando a la silla; cada uno un poco más atrás y más alto
  m.position.set(ESTUCHE.x + (i % 2 ? 0.003 : -0.003), MESA_Y + 0.064 + i * 0.004, ESTUCHE.z + 0.035 - i * 0.026);
  m.rotation.set(Math.PI / 2 - 0.21, 0, 0);
  scene.add(m);
  const o = registrar('disco-' + s.id, {
    nombre: 'Disco · Simulacro ' + s.code, mallas: [m], raiz: m, movil: true, tipo: 'disco', datos: s, casaArriba: v3(0, 0.17, 0),
    insp: { dist: 0.3, rot: new THREE.Euler(Math.PI / 2, 0, 0) }
  });
  discos.push(o);
});

/* ---------- USB (simuladores) en su peana (E43, E45): cuatro ranuras de verdad ---------- */
const PEANA = v3(-0.56, MESA_Y, -0.13);   // v0.2.4: delante del estuche, a la izquierda
const peanaTex = texFrom(256, 64, (c, w, h) => { c.fillStyle = '#2E2A42'; c.fillRect(0, 0, w, h); c.fillStyle = '#FAFAF7'; c.font = '600 28px ' + DISP; c.textAlign = 'center'; c.fillText('SIMULADORES', w / 2, 42); });
const peanaM = mat(0x2E2A42, { r: 0.5 });
const vaso = rbox(0.18, 0.035, 0.06, 0.01, [peanaM, peanaM, peanaM, peanaM, new THREE.MeshStandardMaterial({ map: peanaTex, roughness: 0.6 }), peanaM], PEANA.x, PEANA.y + 0.0175, PEANA.z);
for (let i = 0; i < 4; i++) box(0.016, 0.002, 0.008, mat(0x0E0C16), PEANA.x - 0.06 + i * 0.04, PEANA.y + 0.0355, PEANA.z);
// la bandeja organizadora debajo del archivador y la peana (E45)
rbox(0.24, 0.012, 0.6, 0.006, mat(0x3A3552, { r: 0.7 }), 0.51, MESA_Y + 0.0, -0.28);
const usbs = [];
SIMULADORES.forEach((s, i) => {
  const g = new THREE.Group();
  const cuerpo = box(0.024, 0.07, 0.01, mat(new THREE.Color(s.color).getHex(), { r: 0.55 }), 0, 0, 0, g);
  const conector = box(0.013, 0.016, 0.0055, mat(0xC9C5DC, { m: 0.8, r: 0.3 }), 0, -0.04, 0, g);
  const pegTex = texFrom(64, 192, (c, w, h) => { c.fillStyle = '#F7F4EA'; c.fillRect(0, 0, w, h); dibujaIcono(c, s.icono, 14, 8, 36, '#2E2A42', 2.4); c.save(); c.translate(w / 2, h / 2 + 22); c.rotate(-Math.PI / 2); c.fillStyle = '#2E2A42'; c.font = '700 26px ' + BODY; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s.corto, 0, 2); c.restore(); });
  const pegatina = plano(0.019, 0.052, new THREE.MeshStandardMaterial({ map: pegTex, roughness: 0.8 }), 0, 0.004, 0.0052, 0, 0, g);
  g.position.set(PEANA.x - 0.06 + i * 0.04, PEANA.y + 0.035 + 0.048 - 0.008, PEANA.z);   // de pie en su ranura, la pegatina hacia la silla
  scene.add(g);
  usbs.push(registrar('usb-' + s.id, {
    nombre: 'USB · ' + s.nombre, mallas: [cuerpo, conector, pegatina], raiz: g, movil: true, tipo: 'usb', datos: s, casaArriba: v3(0, 0.09, 0),
    insp: { dist: 0.2, rot: new THREE.Euler(0, 0, 0) }
  }));
});

/* ---------- carpetas de pie en el cajón de archivo de la cajonera (E45, fallo 4) ----------
   Tumbadas una encima de otra, al sacar una del medio atravesaba las de arriba. De pie, cada una sale en vertical. */
const Q_CARPETA_PIE = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
const carpetas = [];
function portadaCarpeta(f) {
  return texFrom(512, 380, (c, w, h) => {
    c.fillStyle = f.color; c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(255,255,255,.07)'; for (let x = 0; x < w; x += 14) c.fillRect(x, 0, 1, h);
    // la etiqueta va en el borde de delante (arriba del lienzo = +z): es lo que asoma en el cajón
    c.fillStyle = '#F7F4EA'; rr(c, 16, 6, w - 32, 46, 8); c.fill();
    c.fillStyle = '#1E1B2E'; c.font = '600 34px ' + DISP; c.fillText(f.nombre, 30, 41);
    c.fillStyle = '#5A566E'; c.font = '700 32px ' + MANO; c.textAlign = 'right'; c.fillText(f.n ? f.n + ' apuntes' : 'sale el ' + f.sale, w - 30, 41); c.textAlign = 'left';
    dibujaIcono(c, f.icono, w - 150, 90, 100, 'rgba(250,250,247,.9)', 2);                                // icono propio (E41)
    c.fillStyle = 'rgba(250,250,247,.9)'; c.font = '600 60px ' + DISP; c.fillText(f.nombre, 40, 250);
    c.fillStyle = 'rgba(250,250,247,.7)'; c.font = '500 26px ' + BODY; c.fillText('Apuntes · Sergio Medina', 40, 300);
  });
}
function hojaCarpeta(f) {
  return texFrom(512, 372, (c, w, h) => {
    c.fillStyle = '#FBFAF4'; c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(47,95,208,.18)'; for (let y = 70; y < h; y += 30) c.fillRect(24, y, w - 48, 2);
    c.fillStyle = '#C2362B'; c.fillRect(56, 0, 2, h);
    c.fillStyle = '#1E1B2E'; c.font = '600 34px ' + DISP; c.fillText('Apuntes de ' + f.nombre, 72, 52);
    c.fillStyle = '#2E2A42'; c.font = '600 30px ' + MANO;
    const l = f.n ? [f.n + ' artículos en cada idioma', 'teoría, práctica y ejercicios', 'con chuletario y cuestionario'] : ['Ya está escrita y programada.', 'Sale el ' + f.sale + '.'];
    l.forEach((t, i) => c.fillText(t, 72, 116 + i * 30));
    if (f.url) {
      c.fillStyle = '#4638B8'; c.font = '700 28px ' + MANO; c.fillText('Léelos en:', 72, 236);
      c.font = '600 21px ' + BODY; c.fillText(f.dir, 72, 270);
      c.fillRect(72, 276, c.measureText(f.dir).width, 2);
    }
  });
}
CARPETAS.forEach((f, i) => {
  const g = new THREE.Group();
  // de pie, una detrás de otra, con la pestaña arriba (escalonadas a izquierda y derecha para que se lean todas)
  g.position.set(-0.03 + (i % 3) * 0.03, -0.06, -0.08 - i * 0.036); g.quaternion.copy(Q_CARPETA_PIE); drawer.add(g);
  const tapaTrasera = box(0.3, 0.003, 0.2, mat(new THREE.Color(f.color).getHex(), { r: 0.75 }), 0, 0.0015, 0, g);
  const hoja = plano(0.28, 0.182, new THREE.MeshStandardMaterial({ map: hojaCarpeta(f), roughness: 0.9 }), 0.004, 0.0034, 0, -Math.PI / 2, 0, g);
  const bisagra = new THREE.Group(); bisagra.position.set(-0.15, 0.0045, 0); g.add(bisagra);
  const fM = mat(new THREE.Color(f.color).getHex(), { r: 0.75 });
  const tapa = box(0.3, 0.003, 0.2, [fM, fM, new THREE.MeshStandardMaterial({ map: portadaCarpeta(f), roughness: 0.75 }), fM, fM, fM], 0.15, 0.0015, 0, bisagra);
  // la pestaña, que asoma por arriba (un plano que en el cajón mira a la silla)
  const pestTex = texFrom(160, 48, (c, w, h) => { c.fillStyle = '#F7F4EA'; rr(c, 2, 2, w - 4, h - 4, 8); c.fill(); c.strokeStyle = f.color; c.lineWidth = 5; c.stroke(); c.fillStyle = '#1E1B2E'; c.font = '600 24px ' + DISP; c.textAlign = 'center'; c.fillText(f.nombre.slice(0, 9), w / 2, 33); });
  const pestana = plano(0.08, 0.024, new THREE.MeshStandardMaterial({ map: pestTex, roughness: 0.8, side: THREE.DoubleSide }), -0.09 + (i % 3) * 0.09, 0, 0.112, Math.PI / 2, 0, g);
  carpetas.push(registrar('carpeta-' + f.id, {
    nombre: 'Carpeta · ' + f.nombre, mallas: [tapa, tapaTrasera, pestana], raiz: g, movil: true, tipo: 'carpeta', datos: f, bisagra, hoja, casaArriba: v3(0, 0.42, 0), lugar: 'mesa',
    insp: { dist: 0.42, rot: new THREE.Euler(Math.PI / 2 - 0.05, 0, 0) },
    activo: () => gesto.estado === 'libre' && cajonAbierto()
  }));
});

/* ---------- libros y manual en la estantería ---------- */
const libros = [];
function lomoTex(b) {
  return texFrom(96, 512, (c, w, h) => {
    const fondo = b.manual ? '#F7F1D9' : (b.curso === 2 ? '#2E2A42' : b.color), claro = b.manual ? '#1E1B2E' : (b.curso === 2 ? b.acento : '#FAFAF7');
    c.fillStyle = fondo; c.fillRect(0, 0, w, h);
    dibujaIcono(c, b.manual ? 'libro' : b.icono, 22, 20, 52, claro, 2.4);
    c.fillStyle = b.manual ? '#C93F22' : claro; c.fillRect(0, h - (b.curso === 2 ? 74 : 66), w, b.curso === 2 ? 16 : 6);
    c.save(); c.translate(w / 2, h / 2 + 10); c.rotate(-Math.PI / 2); c.fillStyle = claro;
    c.font = (b.manual ? '600 40px ' : '600 46px ') + DISP; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(b.manual ? 'Manual' : b.code, 0, 0); c.restore();
  });
}
function portadaTex(b) {
  // E41: portada propia por asignatura (boceto 04): curso, icono en su círculo, código grande, tema y firma
  return texFrom(512, 720, (c, w, h) => {
    if (b.manual) {
      c.fillStyle = '#F7F1D9'; c.fillRect(0, 0, w, h);
      dibujaIcono(c, 'libro', 44, 90, 120, '#2E2A42', 1.6);
      c.fillStyle = '#1E1B2E'; c.font = '600 64px ' + DISP; c.fillText('Manual', 44, 330); c.fillText('del cuarto', 44, 400);
      c.fillStyle = '#C93F22'; c.fillRect(44, 430, 120, 8);
      c.fillStyle = '#5A566E'; c.font = '500 28px ' + BODY; c.fillText('Cómo se usa todo', 44, 490); c.fillText('lo que hay en mi cuarto', 44, 528);
      c.font = '700 40px ' + MANO; c.fillStyle = '#2E2A42'; c.fillText('Léeme primero', 44, h - 60); return;
    }
    const fondo = b.curso === 2 ? '#2E2A42' : b.color, claro = b.curso === 2 ? b.acento : '#FAFAF7';
    c.fillStyle = fondo; c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(255,255,255,.05)'; for (let y = 0; y < h; y += 32) c.fillRect(0, y, w, 1);
    c.fillStyle = claro; c.font = '600 26px ' + BODY; c.fillText(b.curso + 'º · GCID', 44, 74); c.globalAlpha = 0.6; c.fillRect(44, 92, w - 88, 3); c.globalAlpha = 1;
    c.strokeStyle = claro; c.globalAlpha = 0.35; c.lineWidth = 4; c.beginPath(); c.arc(w / 2, 250, 108, 0, Math.PI * 2); c.stroke(); c.globalAlpha = 1;
    dibujaIcono(c, b.icono, w / 2 - 70, 180, 140, claro, 2.2);
    c.fillStyle = claro; c.font = '600 104px ' + DISP; c.fillText(b.code, 44, 490);
    c.font = '500 32px ' + DISP; wrap(c, b.sub, 44, 540, w - 88, 40);
    c.globalAlpha = 0.85; c.font = '500 22px ' + BODY; c.fillText('Sergio Medina · SergioLearns', 44, h - 46); c.globalAlpha = 1;
  });
}
function contraTex(b) {
  return texFrom(512, 720, (c, w, h) => {
    c.fillStyle = b.manual ? '#F2EBCF' : (b.curso === 2 ? '#26223A' : b.color); c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(0, 0, w, h);
    c.fillStyle = b.manual ? '#2E2A42' : '#FAFAF7'; c.font = '600 30px ' + DISP; c.fillText(b.manual ? 'Antes de empezar' : '¿Sabías que…?', 44, 110);
    c.font = '400 28px ' + BODY; wrap(c, b.manual ? 'Todo se hace con las manos: coger, girar, arrastrar y soltar. Si te pierdes, Esc te devuelve a tu silla.' : b.curiosidad, 44, 170, w - 88, 40);
    c.fillStyle = b.manual ? '#5A566E' : 'rgba(250,250,247,.75)'; c.font = '500 24px ' + BODY; c.fillText('sergiolearns.com', 44, h - 60);
  });
}
// La estantería está en la pared derecha (los libros avanzan hacia +z y el lomo mira a −x, al cuarto).
// v0.2.2: los de 1º en la balda de abajo, el manual en la de arriba; los de 2º, en la mesa auxiliar del sillón
// (los que estoy cursando, para leerlos sentado: decisión de Sergio, 4 nov)
const shelfZ = { 1: -0.86, 2: -0.84 }, pilaY = { y: MESA_AUX.alto + 0.001 };
const PILA = [];   // los libros de 2º, de abajo arriba (fallo 27)
function creaLibro(b) {
  const t = b.manual ? 0.034 : 0.045 + (b.code.length % 3) * 0.006, hgt = b.manual ? 0.21 : (b.curso === 2 ? 0.22 + (b.code.length % 2) * 0.02 : 0.25 + (b.code.charCodeAt(2) % 3) * 0.01), d = b.manual ? 0.15 : 0.17;
  const g = new THREE.Group();
  const colorCuerpo = b.manual ? 0xF7F1D9 : (b.curso === 2 ? 0x2E2A42 : new THREE.Color(b.color).getHex());
  const bodyM = mat(colorCuerpo, { r: 0.7 });
  const bloque = box(t - 0.01, hgt - 0.012, d - 0.008, mat(0xF2F0F8, { r: 0.9 }), 0, 0, -0.002, g);
  const trasera = box(0.005, hgt, d, bodyM, -t / 2 + 0.0025, 0, 0, g);
  const contra = plano(d, hgt, new THREE.MeshStandardMaterial({ map: contraTex(b), roughness: 0.7 }), -t / 2 - 0.0002, 0, 0, 0, -Math.PI / 2, g);
  const lomo = plano(t, hgt, new THREE.MeshStandardMaterial({ map: lomoTex(b), roughness: 0.7 }), 0, 0, d / 2 + 0.001, 0, 0, g);
  const lomoCaja = box(t, hgt, 0.004, bodyM, 0, 0, d / 2 - 0.0015, g);
  const delantera = box(0.005, hgt, d, bodyM, t / 2 - 0.0025, 0, 0, g);
  const portada = plano(d, hgt, new THREE.MeshStandardMaterial({ map: portadaTex(b), roughness: 0.7 }), t / 2 + 0.0002, 0, 0, 0, Math.PI / 2, g);
  if (b.curso === 2 && !b.manual) {
    // tumbado en la pila de la mesa auxiliar: la portada hacia arriba y el lomo hacia el sillón
    g.position.set((MESA_AUX.x0 + MESA_AUX.x1) / 2, pilaY.y + t / 2, (MESA_AUX.z0 + MESA_AUX.z1) / 2);
    g.quaternion.setFromEuler(new THREE.Euler(0, Math.PI / 2 + (b.code.length % 3 - 1) * 0.12, Math.PI / 2, 'YXZ'));
    pilaY.y += t + 0.002; scene.add(g);
  } else {
    const fila = b.manual ? 2 : 1;
    let z = shelfZ[fila]; shelfZ[fila] += t + 0.012 + (b.code.length > 3 ? 0.004 : 0);
    g.position.set(ESTANTE.x - 0.03 - d / 2, ESTANTE.y[fila] + 0.0125 + hgt / 2, z + t / 2); g.rotation.y = -Math.PI / 2; scene.add(g);
  }
  const o = registrar(b.manual ? 'manual' : 'libro-' + b.id, {
    nombre: b.manual ? 'Manual del cuarto' : 'Libro · ' + b.code + (b.estado === 'Pendiente' ? ' (2º curso)' : ''),
    mallas: [lomo, lomoCaja, trasera, delantera, bloque, portada, contra], raiz: g, movil: false, tipo: 'libro', datos: b,
    lugar: b.curso === 2 && !b.manual ? 'sillon' : 'estanteria', alcance: b.curso === 2 && !b.manual ? 1.5 : 1.95,
    // fallo 4: sale y vuelve tirando del lomo (su +z), no de lado entre los otros libros
    salidaLocal: b.curso === 2 && !b.manual ? null : v3(0, 0, 0.24), casaArriba: b.curso === 2 && !b.manual ? v3(0, 0.12, 0) : null, pila: b.curso === 2 && !b.manual,
    dims: { t, h: hgt, d }, tex: { portada: portada.material.map, contra: contra.material.map, color: colorCuerpo },
    insp: { dist: 0.42, rot: new THREE.Euler(0.05, -Math.PI / 2, 0) }
  });
  if (o.pila) PILA.push(o);
  libros.push(o); return o;
}
/* La pila de los libros de 2º (fallo 27). Hasta la física de la v0.4, nada imposible: para sacar uno de abajo, los de
   encima se levantan un poco, el libro sale de lado y los de encima bajan a ocupar su hueco. Al devolverlo, va arriba. */
const PILA_X = (MESA_AUX.x0 + MESA_AUX.x1) / 2, PILA_Z = (MESA_AUX.z0 + MESA_AUX.z1) / 2;
function alturasPila() { let y = MESA_AUX.alto + 0.001; return PILA.map(b => { const c = y + b.dims.t / 2; y += b.dims.t + 0.002; return c; }); }
async function sacaDePila(o) {
  const i = PILA.indexOf(o); if (i < 0) return;
  const encima = PILA.slice(i + 1);
  if (!encima.length) { PILA.splice(i, 1); return; }
  const y0 = encima.map(b => b.raiz.position.y), p0 = o.raiz.position.clone(), fuera = p0.clone().add(v3(-0.22, 0.004, 0));
  await anim(reduced ? 1 : 240, e => encima.forEach((b, k) => { b.raiz.position.y = y0[k] + 0.03 * e; }), curva.sale);      // levantas los de encima…
  await anim(reduced ? 1 : 340, e => o.raiz.position.lerpVectors(p0, fuera, e), curva.suave);                              // …sacas el tuyo de lado…
  PILA.splice(i, 1); const ys = alturasPila();
  const y1 = encima.map(b => b.raiz.position.y);
  await anim(reduced ? 1 : 260, e => encima.forEach((b, k) => { b.raiz.position.y = lerp(y1[k], ys[i + k], e); }), curva.rebote);   // …y bajan a su hueco
  encima.forEach((b, k) => { b.casa.pos.y = ys[i + k]; });
}
function ponEnPila(o) {
  if (PILA.includes(o)) return;
  let y = MESA_AUX.alto + 0.001; PILA.forEach(b => { y += b.dims.t + 0.002; });
  o.casa.pos.set(PILA_X, y + o.dims.t / 2, PILA_Z); PILA.push(o);
}
LIBROS.forEach(creaLibro);
const manualObj = creaLibro({ id: 'manual', code: 'Manual', manual: true, curso: 1, name: 'Manual', sub: '', estado: '', url: '', paginas: MANUAL });
[[-0.3, 1, 0x3A3552], [-0.24, 1, 0x26223A], [-0.6, 2, 0x4638B8], [-0.54, 2, 0x3A3552], [-0.2, 2, 0x26223A], [-0.14, 2, 0x3A3552]].forEach((p, i) => {
  const hh = 0.2 + (i % 3) * 0.03; box(0.17, hh, 0.04, mat(p[2], { r: 0.8 }), ESTANTE.x - 0.115, ESTANTE.y[p[1]] + 0.0125 + hh / 2, p[0]);
});

/* ---------- taza con su vapor ---------- */
// el posavasos: el sitio fijo de la taza (E45)
const posavasosTex = texFrom(128, 128, (c, w, h) => { c.fillStyle = '#2E2A42'; c.beginPath(); c.arc(64, 64, 63, 0, Math.PI * 2); c.fill(); c.fillStyle = '#FF6B4A'; c.font = '600 30px ' + DISP; c.textAlign = 'center'; c.fillText('s_', 64, 74); });
const posavasos = cyl(0.055, 0.055, 0.005, [mat(0x2E2A42), new THREE.MeshStandardMaterial({ map: posavasosTex, roughness: 0.8 }), mat(0x2E2A42)], 0.6, MESA_Y + 0.0025, -0.1);   // v0.2.4: a la derecha, junto al ratón
const taza = new THREE.Group(); taza.position.set(0.6, MESA_Y + 0.055, -0.1); scene.add(taza);
const tazaTex = texFrom(512, 128, (c, w, h) => {
  c.fillStyle = '#FF6B4A'; c.fillRect(0, 0, w, h);
  c.fillStyle = '#FAFAF7'; c.font = '600 44px ' + DISP; c.fillText('sergio', 150, 80); c.fillStyle = '#1E1B2E'; c.fillText('learns', 150 + c.measureText('sergio').width, 80);
});
const fondoTazaTex = texFrom(128, 128, (c, w, h) => { c.fillStyle = '#F7F4EA'; c.fillRect(0, 0, w, h); c.fillStyle = '#2E2A42'; c.font = '700 22px ' + MANO; c.textAlign = 'center'; c.fillText('Hecha en', 64, 52); c.fillText('Gran Canaria', 64, 74); c.font = '600 16px ' + MANO; c.fillText('(y con café)', 64, 98); });
const cafeM = mat(0x3B2418, { r: 0.25 });
const tazaCuerpo = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.036, 0.1, 40), [new THREE.MeshStandardMaterial({ map: tazaTex, roughness: 0.45 }), cafeM, new THREE.MeshStandardMaterial({ map: fondoTazaTex, roughness: 0.8 })]);
taza.add(tazaCuerpo);
const asa = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.008, 12, 24, Math.PI), mat(0xFF6B4A, { r: 0.5 })); asa.position.set(0.04, 0, 0); asa.rotation.z = -Math.PI / 2; taza.add(asa);
taza.rotation.y = 2.2;
const vapor = (() => {
  const N = 46, pos = new Float32Array(N * 3), sem = [];
  for (let i = 0; i < N; i++) sem.push([Math.random(), Math.random(), Math.random()]);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const tex = texFrom(64, 64, (c, w, h) => { const gr = c.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(240,238,250,.9)'); gr.addColorStop(1, 'rgba(240,238,250,0)'); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
  const m = new THREE.PointsMaterial({ size: 0.03, map: tex, transparent: true, depthWrite: false, opacity: 0.16 });
  // v0.2.4 (E59-2): el vapor había desaparecido. Desde la v0.2.3 el primer dibujo (el del espejo, al cargar) se hace ANTES
  // de que el vapor se mueva por primera vez: three.js calculaba su esfera de recorte con los 46 puntos en (0, 0, 0) y,
  // desde la silla, el origen no se ve, así que el vapor se recortaba siempre. Se mueve cada fotograma: sin recorte
  const p = new THREE.Points(g, m); p.frustumCulled = false; scene.add(p);
  return { p, pos, sem, N, espeso: 0 };
})();
// v0.2.1 (E35): el vapor nace en el borde de la taza, esté donde esté y como esté girada: el centro de la boca
// es el punto (0; 0,05; 0) de la taza pasado al mundo, y el vapor sube por el eje vertical del mundo (el calor sube)
const _boca = new THREE.Vector3(), _ejeTaza = new THREE.Vector3(), _bx = new THREE.Vector3(), _bz = new THREE.Vector3();
function corrVapor(t) {
  const { pos, sem, N } = vapor, s = reduced ? 0.4 : t / 1000;
  tazaCuerpo.updateWorldMatrix(true, false);
  _boca.set(0, 0.05, 0).applyMatrix4(tazaCuerpo.matrixWorld);
  _ejeTaza.set(0, 1, 0).transformDirection(tazaCuerpo.matrixWorld);
  // dos ejes del plano de la boca, para repartir el vapor por el círculo del borde
  _bx.set(1, 0, 0).transformDirection(tazaCuerpo.matrixWorld); _bz.crossVectors(_bx, _ejeTaza).normalize();
  const derecha = _ejeTaza.y > 0.2;            // si la taza está boca abajo o tumbada, apenas sale vapor
  const alto = 0.12 + vapor.espeso * 0.1;
  for (let i = 0; i < N; i++) {
    const [a, b, c] = sem[i], f = (b + s * (0.09 + a * 0.05)) % 1;        // de 0 (sale) a 1 (se deshace)
    const ang = c * Math.PI * 2, r = 0.03 * Math.sqrt(a) * (1 - f * 0.5);  // nace dentro del círculo de la boca
    const ox = Math.cos(ang) * r, oz = Math.sin(ang) * r;
    pos[i * 3] = _boca.x + _bx.x * ox + _bz.x * oz + Math.sin(f * 6 + c * 9 + s) * 0.012 * f * 2;
    pos[i * 3 + 1] = _boca.y + _bx.y * ox + _bz.y * oz + f * alto;
    pos[i * 3 + 2] = _boca.z + _bx.z * ox + _bz.z * oz + Math.cos(f * 5 + a * 7) * 0.01 * f * 2;
  }
  vapor.p.geometry.attributes.position.needsUpdate = true;
  vapor.p.material.opacity = (derecha ? 1 : 0.15) * (0.14 + vapor.espeso * 0.22);
  vapor.p.material.size = 0.03 + vapor.espeso * 0.03;
}
const tazaObj = registrar('taza', {
  nombre: 'Taza', mallas: [tazaCuerpo, asa], raiz: taza, movil: true, tipo: 'taza',
  insp: { dist: 0.3, rot: new THREE.Euler(0.15, 0, 0) }
});
