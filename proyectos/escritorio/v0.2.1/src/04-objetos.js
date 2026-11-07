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

/* ---------- discos (simulacros) en su estuche ---------- */
const estuche = new THREE.Group(); estuche.position.set(0.5, MESA_Y, -0.08); scene.add(estuche);
const estM = mat(0x4638B8, { r: 0.6 });
box(0.16, 0.006, 0.15, estM, 0, 0.003, 0, estuche);
box(0.16, 0.05, 0.006, estM, 0, 0.025, 0.072, estuche);          // frente bajo
box(0.16, 0.14, 0.006, estM, 0, 0.07, -0.072, estuche);          // fondo alto
box(0.006, 0.14, 0.15, estM, -0.077, 0.07, 0, estuche); box(0.006, 0.14, 0.15, estM, 0.077, 0.07, 0, estuche);
const estFrente = estuche.children[1];
const tapaEst = new THREE.Group(); tapaEst.position.set(0, 0.14, -0.075); estuche.add(tapaEst);
const tapaTex = texFrom(256, 240, (c, w, h) => { c.fillStyle = '#4638B8'; c.fillRect(0, 0, w, h); c.fillStyle = '#F7F1D9'; c.fillRect(40, 70, 176, 90); c.fillStyle = '#2E2A42'; c.font = '700 44px ' + MANO; c.fillText('Simulacros', 52, 126); });
const tapaMesh = box(0.164, 0.006, 0.152, [estM, estM, new THREE.MeshStandardMaterial({ map: tapaTex, roughness: 0.6 }), estM, estM, estM], 0, 0.003, 0.076, tapaEst);
const discos = [];
function etiquetaDisco(s) {
  return texFrom(256, 256, (c, w, h) => {
    c.fillStyle = '#D8D5E6'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#F7F4EA'; c.beginPath(); c.arc(128, 128, 124, 0, Math.PI * 2); c.fill();          // etiqueta de papel
    c.fillStyle = s.color; c.fillRect(0, 0, w, 64);                                                 // franja de color
    c.fillStyle = '#C9C5DC'; c.beginPath(); c.arc(128, 128, 30, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#1E1B2E'; c.beginPath(); c.arc(128, 128, 11, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#FAFAF7'; c.font = '600 30px ' + DISP; c.textAlign = 'center'; c.fillText(s.code, 128, 48);
    c.fillStyle = '#2E2A42'; c.font = '700 34px ' + MANO; c.fillText('Simulacro', 128, 92);
    c.font = '500 26px ' + MANO; s.partes.forEach((p, i) => c.fillText(p[0] + ' · ' + fechaCorta(p[1]), 128, 196 + i * 26));
  });
}
function reversoDisco(s) {
  return texFrom(256, 256, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#C9C5DC'); g.addColorStop(0.45, '#E8E6F5'); g.addColorStop(0.55, '#A99EF5'); g.addColorStop(1, '#C9C5DC');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = '#1E1B2E'; c.beginPath(); c.arc(128, 128, 11, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#2E2A42'; c.font = '600 22px ' + MANO; c.textAlign = 'center';
    wrapCentro(c, s.reverso, 128, 168, 170, 22);
  });
}
function wrapCentro(c, texto, cx, y, maxW, lh) { const pal = texto.split(' '); let l = ''; for (const p of pal) { const t = l ? l + ' ' + p : p; if (c.measureText(t).width > maxW && l) { c.fillText(l, cx, y); l = p; y += lh; } else l = t; } if (l) c.fillText(l, cx, y); }
SIMULACROS.forEach((s, i) => {
  const borde = mat(0xC9C5DC, { r: 0.3, m: 0.6 });
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.004, 48),
    [borde, new THREE.MeshStandardMaterial({ map: etiquetaDisco(s), roughness: 0.5 }), new THREE.MeshStandardMaterial({ map: reversoDisco(s), roughness: 0.25, metalness: 0.4 })]);
  // de pie en el estuche, mirando a la silla; cada uno un poco más atrás y más alto
  m.position.set(0.5 + (i % 2 ? 0.004 : -0.004), MESA_Y + 0.064 + i * 0.006, -0.08 + 0.045 - i * 0.026);
  m.rotation.set(Math.PI / 2 - 0.22, 0, 0);
  scene.add(m);
  const o = registrar('disco-' + s.id, {
    nombre: 'Disco · Simulacro ' + s.code, mallas: [m], raiz: m, movil: true, tipo: 'disco', datos: s, casaArriba: v3(0, 0.17, 0),
    insp: { dist: 0.3, rot: new THREE.Euler(Math.PI / 2, 0, 0) }
  });
  discos.push(o);
});

/* ---------- USB (simuladores) en el portalápices ---------- */
const vaso = cyl(0.042, 0.038, 0.1, mat(0x5B4BDB, { r: 0.7, side: THREE.DoubleSide }), 0.52, MESA_Y + 0.05, -0.5, scene, 32);
vaso.geometry.dispose(); vaso.geometry = new THREE.CylinderGeometry(0.042, 0.038, 0.1, 32, 1, true);
cyl(0.038, 0.038, 0.004, mat(0x4638B8), 0.52, MESA_Y + 0.002, -0.5);
const usbs = [];
SIMULADORES.forEach((s, i) => {
  const g = new THREE.Group();
  const cuerpo = box(0.024, 0.07, 0.01, mat(new THREE.Color(s.color).getHex(), { r: 0.55 }), 0, 0, 0, g);
  const conector = box(0.013, 0.016, 0.0055, mat(0xC9C5DC, { m: 0.8, r: 0.3 }), 0, -0.04, 0, g);
  const pegTex = texFrom(64, 192, (c, w, h) => { c.fillStyle = '#F7F4EA'; c.fillRect(0, 0, w, h); c.save(); c.translate(w / 2, h / 2); c.rotate(-Math.PI / 2); c.fillStyle = '#2E2A42'; c.font = '700 40px ' + MANO; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s.corto.toLowerCase(), 0, 2); c.restore(); });
  const pegatina = plano(0.019, 0.052, new THREE.MeshStandardMaterial({ map: pegTex, roughness: 0.8 }), 0, 0.004, 0.0052, 0, 0, g);
  const ang = i * Math.PI / 2 + 0.6;
  g.position.set(0.52 + Math.cos(ang) * 0.016, MESA_Y + 0.1, -0.5 + Math.sin(ang) * 0.016);
  g.rotation.set(Math.sin(ang) * 0.12, -ang + Math.PI / 2, -Math.cos(ang) * 0.12);
  scene.add(g);
  usbs.push(registrar('usb-' + s.id, {
    nombre: 'USB · ' + s.nombre, mallas: [cuerpo, conector, pegatina], raiz: g, movil: true, tipo: 'usb', datos: s, casaArriba: v3(0, 0.1, 0),
    insp: { dist: 0.2, rot: new THREE.Euler(0, 0, 0) }
  }));
});

/* ---------- cajón con carpetas ---------- */
const drawer = new THREE.Group(); drawer.position.set(-0.2, 0.64, 0); scene.add(drawer);
const drawerFront = box(0.5, 0.12, 0.02, mat(0x2E2A42, { r: 0.6 }), 0, 0, 0.035, drawer);
const drawerHandle = box(0.14, 0.016, 0.016, mat(0xFF6B4A, { e: 0xFF6B4A, ei: 0.2 }), 0, 0, 0.052, drawer);
box(0.46, 0.008, 0.4, mat(0x26223A), 0, -0.05, -0.17, drawer);
box(0.008, 0.1, 0.4, mat(0x26223A), -0.226, 0, -0.17, drawer); box(0.008, 0.1, 0.4, mat(0x26223A), 0.226, 0, -0.17, drawer);
box(0.46, 0.1, 0.008, mat(0x26223A), 0, 0, -0.366, drawer);
const carpetas = [];
function portadaCarpeta(f) {
  return texFrom(512, 380, (c, w, h) => {
    c.fillStyle = f.color; c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(255,255,255,.07)'; for (let x = 0; x < w; x += 14) c.fillRect(x, 0, 1, h);
    // la etiqueta va en el borde de delante (arriba del lienzo = +z): es lo que asoma en el cajón
    c.fillStyle = '#F7F4EA'; rr(c, 16, 6, w - 32, 46, 8); c.fill();
    c.fillStyle = '#1E1B2E'; c.font = '600 34px ' + DISP; c.fillText(f.nombre, 30, 41);
    c.fillStyle = '#5A566E'; c.font = '700 32px ' + MANO; c.textAlign = 'right'; c.fillText(f.n ? f.n + ' apuntes' : 'sale el ' + f.sale, w - 30, 41); c.textAlign = 'left';
    c.fillStyle = 'rgba(250,250,247,.9)'; c.font = '600 64px ' + DISP; c.fillText(f.nombre, 40, 230);
    c.fillStyle = 'rgba(250,250,247,.7)'; c.font = '500 26px ' + BODY; c.fillText('Apuntes · Sergio Medina', 40, 280);
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
  // cada una más atrás: asoma su borde con la etiqueta
  g.position.set(-0.02 + (i % 2) * 0.02, -0.042 + i * 0.0072, -0.125 - i * 0.025); g.rotation.y = (i % 2 ? -0.04 : 0.05); drawer.add(g);
  const tapaTrasera = box(0.3, 0.003, 0.2, mat(new THREE.Color(f.color).getHex(), { r: 0.75 }), 0, 0.0015, 0, g);
  const hoja = plano(0.28, 0.182, new THREE.MeshStandardMaterial({ map: hojaCarpeta(f), roughness: 0.9 }), 0.004, 0.0034, 0, -Math.PI / 2, 0, g);
  const bisagra = new THREE.Group(); bisagra.position.set(-0.15, 0.0045, 0); g.add(bisagra);
  const fM = mat(new THREE.Color(f.color).getHex(), { r: 0.75 });
  const tapa = box(0.3, 0.003, 0.2, [fM, fM, new THREE.MeshStandardMaterial({ map: portadaCarpeta(f), roughness: 0.75 }), fM, fM, fM], 0.15, 0.0015, 0, bisagra);
  carpetas.push(registrar('carpeta-' + f.id, {
    nombre: 'Carpeta · ' + f.nombre, mallas: [tapa, tapaTrasera], raiz: g, movil: true, tipo: 'carpeta', datos: f, bisagra, hoja,
    insp: { dist: 0.42, rot: new THREE.Euler(Math.PI / 2 - 0.05, 0, 0) },
    activo: () => gesto.estado === 'libre' && cajonAbierto()
  }));
});

/* ---------- libros y manual en la estantería ---------- */
const libros = [];
function lomoTex(b) {
  return texFrom(96, 512, (c, w, h) => {
    const fondo = b.manual ? '#F7F1D9' : (b.curso === 2 ? '#2E2A42' : b.color); c.fillStyle = fondo; c.fillRect(0, 0, w, h);
    if (b.curso === 2) { c.strokeStyle = '#8E8AA3'; c.lineWidth = 6; c.strokeRect(3, 3, w - 6, h - 6); }
    c.fillStyle = b.manual ? '#C93F22' : 'rgba(250,250,247,.85)'; c.fillRect(0, 36, w, 6); c.fillRect(0, h - 70, w, 6);
    c.save(); c.translate(w / 2, h / 2); c.rotate(-Math.PI / 2); c.fillStyle = b.manual ? '#1E1B2E' : '#FAFAF7';
    c.font = (b.manual ? '600 40px ' : '600 46px ') + DISP; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(b.manual ? 'Manual' : b.code, 0, 0); c.restore();
  });
}
function portadaTex(b) {
  return texFrom(512, 720, (c, w, h) => {
    c.fillStyle = b.manual ? '#F7F1D9' : (b.curso === 2 ? '#2E2A42' : b.color); c.fillRect(0, 0, w, h);
    if (b.manual) {
      c.fillStyle = '#1E1B2E'; c.font = '600 64px ' + DISP; c.fillText('Manual', 44, 150); c.fillText('del escritorio', 44, 222);
      c.fillStyle = '#C93F22'; c.fillRect(44, 262, 120, 8);
      c.fillStyle = '#5A566E'; c.font = '500 30px ' + BODY; c.fillText('Cómo se usa todo', 44, 330); c.fillText('lo que hay en esta mesa', 44, 370);
      c.font = '700 40px ' + MANO; c.fillStyle = '#2E2A42'; c.fillText('Léeme primero', 44, h - 70); return;
    }
    c.fillStyle = 'rgba(255,255,255,.08)'; for (let y = 0; y < h; y += 32) c.fillRect(0, y, w, 1);
    c.fillStyle = '#FAFAF7'; c.font = '600 120px ' + DISP; c.fillText(b.code, 44, 220);
    c.font = '500 34px ' + DISP; let y = wrap(c, b.sub, 44, 290, w - 88, 44);
    c.font = '400 26px ' + BODY; c.fillStyle = 'rgba(250,250,247,.8)'; wrap(c, b.name === b.code ? '' : b.name, 44, y + 60, w - 88, 34);
    c.fillStyle = 'rgba(250,250,247,.9)'; c.font = '500 24px ' + BODY; c.fillText('Sergio Medina · SergioLearns', 44, h - 60);
  });
}
function contraTex(b) {
  return texFrom(512, 720, (c, w, h) => {
    c.fillStyle = b.manual ? '#F2EBCF' : (b.curso === 2 ? '#2A2640' : b.color); c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(0, 0, w, h);
    c.fillStyle = b.manual ? '#2E2A42' : '#FAFAF7'; c.font = '600 30px ' + DISP; c.fillText(b.manual ? 'Antes de empezar' : '¿Sabías que…?', 44, 110);
    c.font = '400 28px ' + BODY; wrap(c, b.manual ? 'Todo se hace con las manos: coger, girar, arrastrar y soltar. Si te pierdes, Esc te devuelve a tu silla.' : b.curiosidad, 44, 170, w - 88, 40);
    c.fillStyle = b.manual ? '#5A566E' : 'rgba(250,250,247,.75)'; c.font = '500 24px ' + BODY; c.fillText('sergiolearns.com', 44, h - 60);
  });
}
// v0.2.1: la estantería está en la pared derecha; los libros avanzan hacia +z y el lomo mira a −x (a la habitación)
const shelfZ = { 1: -0.86, 2: -0.84 };
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
  const fila = b.curso;
  let z = shelfZ[fila]; shelfZ[fila] += t + 0.012 + (b.code.length > 3 ? 0.004 : 0);
  if (b.manual) z = 0.3;
  g.position.set(ESTANTE.x - 0.03 - d / 2, ESTANTE.y[fila] + 0.0125 + hgt / 2, z + t / 2); g.rotation.y = -Math.PI / 2; scene.add(g);
  const o = registrar(b.manual ? 'manual' : 'libro-' + b.id, {
    nombre: b.manual ? 'Manual del escritorio' : 'Libro · ' + b.code + (b.estado === 'Pendiente' ? ' (2º curso)' : ''),
    mallas: [lomo, lomoCaja, trasera, delantera, bloque, portada, contra], raiz: g, movil: false, tipo: 'libro', datos: b,
    dims: { t, h: hgt, d }, tex: { portada: portada.material.map, contra: contra.material.map, color: colorCuerpo },
    insp: { dist: 0.42, rot: new THREE.Euler(0.05, -Math.PI / 2, 0) }
  });
  libros.push(o); return o;
}
LIBROS.forEach(creaLibro);
const manualObj = creaLibro({ id: 'manual', code: 'Manual', manual: true, curso: 1, name: 'Manual', sub: '', estado: '', url: '', paginas: MANUAL });
[[-0.2, 1, 0x3A3552], [-0.14, 1, 0x26223A], [-0.09, 1, 0x4638B8], [-0.03, 1, 0x3A3552], [0.02, 2, 0x26223A], [0.08, 2, 0x3A3552]].forEach((p, i) => {
  const hh = 0.2 + (i % 3) * 0.03; box(0.17, hh, 0.04, mat(p[2], { r: 0.8 }), ESTANTE.x - 0.115, ESTANTE.y[p[1]] + 0.0125 + hh / 2, p[0]);
});

/* ---------- taza con su vapor ---------- */
const taza = new THREE.Group(); taza.position.set(-0.5, MESA_Y + 0.05, -0.16); scene.add(taza);
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
  const p = new THREE.Points(g, m); scene.add(p);
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
