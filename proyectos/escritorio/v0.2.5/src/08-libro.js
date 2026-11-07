/* ===================== 08 · libro abierto =====================
   E06: hojas que se curvan al pasar, un bloque de páginas que adelgaza a la
   derecha y engorda a la izquierda, y la tapa debajo de las páginas leídas.
   Modelo y cuentas: material/v0.2/bocetos/04-libro-pagina-curva.svg
   Ejes del libro abierto: el lomo en el origen, las páginas hacia +x (derecha)
   o −x (izquierda) y la cara de lectura mirando a +z. */
const lectura = { o: null, rig: null, k: 0, K: 0, paginas: [], giro: null };
const SEG = 24, FILAS = 6, BETA = 0.9;

function paginasDe(b) {
  // Cada página es una función que dibuja en su lienzo. Todo físico: papel y tinta.
  const P = [];
  const papel = (c, w, h, n) => { c.fillStyle = '#FBF8EF'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(0,0,0,.05)'; c.fillRect(0, 0, 18, h); c.fillStyle = '#8E8AA3'; c.font = '400 20px ' + BODY; c.textAlign = 'center'; c.fillText(String(n), w / 2, h - 30); c.textAlign = 'left'; };
  if (b.manual) {
    b.paginas.forEach(pg => P.push((c, w, h, n) => {
      papel(c, w, h, n);
      c.fillStyle = '#C93F22'; c.fillRect(48, 64, 60, 6);
      c.fillStyle = '#1E1B2E'; cabe(c, pg.t, 48, 120, w - 96, 40, '600', DISP);
      // v0.2.3 (fallo 25): todas las líneas de la página con el mismo tamaño, el que deja caber la más larga (margen de 48 px)
      c.font = '500 26px ' + BODY; let tam = 26; while (tam > 18 && Math.max(...pg.l.map(l => c.measureText(l).width)) > w - 96) { tam--; c.font = '500 ' + tam + 'px ' + BODY; }
      c.fillStyle = '#1E1B2E'; pg.l.forEach((l, i) => c.fillText(l, 48, 180 + i * Math.max(34, tam * 1.45)));
      if (pg.enlace) { c.fillStyle = '#4638B8'; c.fillRect(48, 180 + (pg.l.length - 1) * Math.max(34, tam * 1.45) + 8, c.measureText(pg.l[pg.l.length - 1]).width, 2); }
    }));
    P.enlaces = { [P.length - 1]: b.paginas[b.paginas.length - 1].enlace };
    return P;
  }
  const G = b.curso === 2 && GUIAS[b.id];
  if (G) {
    // v0.2.2 (decisión de Sergio): los libros de 2º llevan dentro su guía docente
    P.push((c, w, h, n) => {
      papel(c, w, h, n); c.fillStyle = b.acento; c.fillRect(48, 64, 80, 8);
      c.fillStyle = '#1E1B2E'; c.font = '600 96px ' + DISP; c.fillText(b.code, 48, 180);
      c.font = '500 30px ' + DISP; let y = wrap(c, b.name, 48, 232, w - 96, 38);
      c.fillStyle = '#5A566E'; c.font = '500 25px ' + BODY; c.fillText('2º curso · 1er semestre', 48, y + 60); cabe(c, G.ects, 48, y + 98, w - 96, 25, '500', BODY);
      c.fillStyle = '#C2362B'; c.font = '700 34px ' + MANO; c.fillText('Guía docente', 48, y + 170);
    });
    P.push((c, w, h, n) => {
      papel(c, w, h, n); c.fillStyle = '#1E1B2E'; c.font = '600 36px ' + DISP; c.fillText('Cómo se evalúa', 48, 110);
      c.font = '500 25px ' + BODY; let y = 180; G.eval.forEach(l => { c.fillStyle = '#2E2A42'; y = wrap(c, l, 48, y, w - 96, 34) + 46; });
    });
    P.push((c, w, h, n) => {
      papel(c, w, h, n); c.fillStyle = '#1E1B2E'; c.font = '600 36px ' + DISP; c.fillText('Temas', 48, 110);
      G.temas.forEach((t, j) => { c.font = '400 24px ' + BODY; c.fillStyle = '#8E8AA3'; c.fillText(String(j + 1).padStart(2, '0'), 48, 180 + j * 44); c.fillStyle = '#2E2A42'; cabe(c, t, 100, 180 + j * 44, w - 148, 24, '400', BODY); });
    });
    P.push((c, w, h, n) => {
      papel(c, w, h, n); c.fillStyle = '#1E1B2E'; c.font = '600 36px ' + DISP; c.fillText('¿Sabías que…?', 48, 110);
      c.font = '500 25px ' + BODY; let y = wrap(c, b.curiosidad, 48, 180, w - 96, 38);
      c.fillStyle = '#4638B8'; c.font = '700 32px ' + MANO; wrap(c, 'Llegará a la web cuando termine 1º.', 48, y + 80, w - 96, 38);
    });
    return P;
  }
  P.push((c, w, h, n) => {
    papel(c, w, h, n);
    c.fillStyle = b.curso === 2 ? '#5A566E' : b.color; c.fillRect(48, 64, 80, 8);
    c.fillStyle = '#1E1B2E'; c.font = '600 96px ' + DISP; c.fillText(b.code, 48, 180);
    c.font = '500 30px ' + DISP; let y = wrap(c, b.sub, 48, 232, w - 96, 38);
    c.fillStyle = b.estado === 'Completa' ? '#16794B' : (b.estado === 'En curso' ? '#C2362B' : '#5A566E'); c.font = '600 26px ' + BODY; c.fillText(b.estado, 48, y + 64);
    c.fillStyle = '#1E1B2E'; b.datos.forEach((l, i) => cabe(c, l, 48, y + 120 + i * 38, w - 96, 25, '500', BODY));
  });
  for (let i = 0; i < Math.max(1, b.temas.length); i += 8) {
    const parte = b.temas.slice(i, i + 8);
    P.push((c, w, h, n) => {
      papel(c, w, h, n);
      c.fillStyle = '#1E1B2E'; c.font = '600 36px ' + DISP; c.fillText(i ? 'Índice (sigue)' : 'Índice', 48, 110);
      c.font = '400 25px ' + BODY;
      if (!parte.length) { c.fillStyle = '#8E8AA3'; c.fillText('Páginas en blanco por ahora.', 48, 180); return; }
      parte.forEach((t, j) => { c.font = '400 25px ' + BODY; c.fillStyle = '#8E8AA3'; c.fillText(String(i + j + 1).padStart(2, '0'), 48, 180 + j * 44); c.fillStyle = '#2E2A42'; cabe(c, t, 100, 180 + j * 44, w - 148, 25, '400', BODY); });
    });
  }
  P.push((c, w, h, n) => {
    papel(c, w, h, n);
    c.fillStyle = '#1E1B2E'; c.font = '600 36px ' + DISP; c.fillText('¿Sabías que…?', 48, 110);
    c.fillStyle = '#1E1B2E'; c.font = '500 26px ' + BODY; wrap(c, b.curiosidad, 48, 180, w - 96, 40);
  });
  P.push((c, w, h, n) => {
    papel(c, w, h, n);
    c.fillStyle = '#1E1B2E'; c.font = '600 36px ' + DISP; c.fillText(b.url ? 'Sigue en la web' : 'Todavía en mi libreta', 48, 110);
    c.fillStyle = '#1E1B2E'; c.font = '500 25px ' + BODY;
    if (b.url) {
      wrap(c, 'Cada tema tiene su teoría, su práctica y sus ejercicios en:', 48, 180, w - 96, 38);
      const dir = b.url.replace('https://', '').replace(/\/$/, '');
      c.fillStyle = '#4638B8'; cabe(c, dir, 48, 290, w - 96, 24, '600', BODY); c.fillRect(48, 296, Math.min(w - 96, c.measureText(dir).width), 2);
    } else wrap(c, 'Este libro se escribe a la vez que el curso. Cuando haya temas, aparecerán aquí.', 48, 180, w - 96, 38);
  });
  if (b.url) P.enlaces = { [P.length - 1]: b.url };
  return P;
}
function texPagina(n) {
  const L = lectura;
  if (!L.tex[n]) {
    const dib = L.paginas[n];
    L.tex[n] = texFrom(512, 720, (c, w, h) => (dib ? dib(c, w, h, n + 1) : guarda(c, w, h)));
  }
  return L.tex[n];
}
function guarda(c, w, h) { c.fillStyle = '#' + new THREE.Color(lectura.o.tex.color).getHexString(); c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.08)'; for (let y = 0; y < h; y += 24) c.fillRect(0, y, w, 1); }
function texEspejo(t) { const m = new THREE.CanvasTexture(t.image); m.colorSpace = THREE.SRGBColorSpace; m.repeat.set(-1, 1); m.offset.set(1, 0); m.anisotropy = t.anisotropy; return m; }

function construyeRig(o) {
  const { t, h, d } = o.dims, W = d - 0.012, H = h - 0.016, T = t - 0.012;
  const rig = new THREE.Group();
  const tapaM = mat(o.tex.color, { r: 0.7 });
  const trasera = box(d, h, 0.004, tapaM, d / 2, 0, -0.002, rig);
  const pivote = new THREE.Group(); rig.add(pivote);
  const portadaM = new THREE.MeshStandardMaterial({ map: o.tex.portada, roughness: 0.7 });
  const delantera = box(d, h, 0.004, [tapaM, tapaM, tapaM, tapaM, portadaM, tapaM], d / 2, 0, 0.002, pivote);
  const papelM = mat(0xF2F0F8, { r: 0.9 });
  const bloqueDer = box(W, H, 1, papelM, W / 2 + 0.003, 0, 0, rig), bloqueIzq = box(W, H, 1, papelM.clone(), -W / 2 - 0.003, 0, 0, rig);
  const pagDer = plano(W, H, new THREE.MeshStandardMaterial({ roughness: 0.92 }), W / 2 + 0.003, 0, 0, 0, 0, rig);
  const pagIzq = plano(W, H, new THREE.MeshStandardMaterial({ roughness: 0.92 }), -W / 2 - 0.003, 0, 0, 0, 0, rig);
  const geo = new THREE.PlaneGeometry(W, H, SEG, FILAS - 1);
  const frente = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ roughness: 0.92, side: THREE.FrontSide }));
  const dorso = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ roughness: 0.92, side: THREE.BackSide }));
  rig.add(frente, dorso); frente.visible = dorso.visible = false;
  scene.add(rig);
  return { rig, pivote, delantera, trasera, bloqueDer, bloqueIzq, pagDer, pagIzq, geo, frente, dorso, W, H, T };
}
// Grosor de los bloques: lo leído pasa de la derecha a la izquierda
function grosores(av) { const R = lectura.rig, f = clamp(av / Math.max(1, lectura.K - 1), 0, 1); return [R.T * f, R.T * (1 - f)]; }
function colocaBloques(av) {
  const R = lectura.rig, [tL, tR] = grosores(av);
  R.bloqueDer.scale.z = Math.max(tR, 1e-4); R.bloqueDer.position.z = tR / 2; R.bloqueDer.visible = tR > 1e-4;
  R.bloqueIzq.scale.z = Math.max(tL, 1e-4); R.bloqueIzq.position.z = tL / 2; R.bloqueIzq.visible = tL > 1e-4;
  R.pagDer.position.z = tR + 0.0006; R.pagIzq.position.z = tL + 0.0006;
  return [tL, tR];
}
// La hoja que se curva: a(s) = θ − β·sen(πp)·(s/W)^1,5 y se suma trozo a trozo (no se estira)
// Fallo 2 (v0.2.2): mientras la hoja vuela, el bloque de la izquierda NO crece todavía (antes crecía con p y, en el
// pliego 0, aparecía una hoja blanca encima de la tapa nada más empezar a arrastrar). La hoja que vuela ya no está en
// el bloque de la derecha; entra en el de la izquierda cuando aterriza (ponPliego).
function colocaBloquesGiro(dir) {
  const R = lectura.rig, k = lectura.k, f = n => clamp(n / Math.max(1, lectura.K - 1), 0, 1);
  const tL = R.T * f(dir > 0 ? k : k - 1), tR = R.T * (1 - f(dir > 0 ? k + 1 : k));
  R.bloqueDer.scale.z = Math.max(tR, 1e-4); R.bloqueDer.position.z = tR / 2; R.bloqueDer.visible = tR > 1e-4;
  R.bloqueIzq.scale.z = Math.max(tL, 1e-4); R.bloqueIzq.position.z = tL / 2; R.bloqueIzq.visible = tL > 1e-4;
  R.pagDer.position.z = tR + 0.0006; R.pagIzq.position.z = tL + 0.0006;
  return [tL, tR];
}
function doblaHoja(p, agarre = 0) {
  const R = lectura.rig, pos = R.geo.attributes.position, W = R.W, H = R.H, ds = W / SEG, th = Math.PI * p;
  const [tL, tR] = colocaBloquesGiro(lectura.giro.dir);
  const zb = lerp(tR, tL, p) + 0.0012;
  for (let j = 0; j < FILAS; j++) {
    const y = H / 2 - (j / (FILAS - 1)) * H;                         // filas de arriba abajo, como PlaneGeometry
    const beta = BETA * (1 + 0.55 * agarre * (y / (H / 2)));        // si se agarra por una esquina, se dobla en diagonal
    let x = 0, z = 0;
    for (let i = 0; i <= SEG; i++) {
      const idx = j * (SEG + 1) + i;
      pos.setXYZ(idx, x + 0.003 * Math.cos(th), y, zb + z);
      const s = (i + 0.5) * ds, a = th - beta * Math.sin(Math.PI * p) * Math.pow(s / W, 1.5);
      x += Math.cos(a) * ds; z += Math.sin(a) * ds;
    }
  }
  pos.needsUpdate = true; R.geo.computeVertexNormals(); R.geo.computeBoundingSphere();
}
function ponPliego(k) {
  // pliego k: a la izquierda la página 2k−1 (o la guarda), a la derecha la 2k (o la guarda del final)
  const R = lectura.rig, N = lectura.paginas.length;
  lectura.k = k;
  R.pagIzq.material.map = k === 0 ? texGuarda() : texPagina(2 * k - 1); R.pagIzq.material.needsUpdate = true;
  // E35: en el pliego 0, a la izquierda solo está el revés de la tapa (ya tiene su color). La hoja de la guarda
  // repetía ese color y se veía desde el principio, como una segunda tapa: solo se enseña desde el pliego 1
  R.pagIzq.visible = k > 0;
  R.pagDer.material.map = 2 * k < N ? texPagina(2 * k) : texGuarda(); R.pagDer.material.needsUpdate = true;
  colocaBloques(k);
}
let _guarda = null; function texGuarda() { if (!_guarda || _guarda.userData.color !== lectura.o.tex.color) { _guarda = texFrom(256, 360, guarda); _guarda.userData.color = lectura.o.tex.color; } return _guarda; }

USOS.libro = o => abreLibro(o);
async function abreLibro(o) {
  cambia('ocupado');
  // Fallo 3 (v0.2.2): si lo habías girado en la mano, primero vuelve derecho (la postura de inspección sin giro) y
  // después se abre: así la tapa siempre se abre hacia la izquierda y las páginas quedan a la derecha
  if (insp.q.lengthSq() && Math.abs(insp.q.w) < 0.9999) {
    const q0 = insp.q.clone(), p1 = new THREE.Vector3(), q1 = new THREE.Quaternion();
    await anim(320, e => { insp.q.slerpQuaternions(q0, new THREE.Quaternion(), e); poseInspeccion(o, p1, q1); o.raiz.position.copy(p1); o.raiz.quaternion.copy(q1); }, curva.suave);
  }
  insp.q.identity(); reiniciaGiro();
  const b = o.datos;
  lectura.o = o; lectura.tex = {}; lectura.paginas = paginasDe(b); lectura.enlaces = lectura.paginas.enlaces || {};
  lectura.K = Math.floor(lectura.paginas.length / 2) + 1;
  lectura.rig = construyeRig(o);
  const R = lectura.rig;
  // el libro abierto empieza exactamente donde está el libro cerrado (el lomo en el origen)
  o.raiz.updateMatrixWorld(true);
  const m = new THREE.Matrix4().compose(v3(-o.dims.t / 2, 0, o.dims.d / 2), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0)), v3(1, 1, 1));
  m.premultiply(o.raiz.matrixWorld);
  m.decompose(R.rig.position, R.rig.quaternion, new THREE.Vector3());
  ponPliego(0); R.pivote.position.z = R.T; R.pivote.rotation.y = 0;
  o.raiz.visible = false;
  // destino: delante de la cámara, algo más abajo, inclinado como en un atril
  // la cámara pasa a mirar un poco hacia abajo, como cuando lees en la mesa; la pose se calcula con esa cámara de destino
  const ojo = ojos(), yaw = cam.yaw, pitch = -0.2;   // v0.2.2: donde estés (la silla, el sillón, de pie)
  rig.foco = { yaw, pitch, pos: ojo, fov: 58, paralaje: 0.015 };
  const camDestino = new THREE.Object3D(); camDestino.position.copy(ojo);
  camDestino.lookAt(ojo.x - Math.sin(yaw) * Math.cos(pitch), ojo.y + Math.sin(pitch), ojo.z - Math.cos(yaw) * Math.cos(pitch));
  const dir = camDestino.getWorldDirection(new THREE.Vector3());   // un Object3D mira con su +z (la cámara, con su −z)
  const qCam = camDestino.quaternion.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0)));
  const p1 = ojo.clone().addScaledVector(dir, 0.36).add(v3(0, -0.04, 0));
  const q1 = qCam.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.3, 0, 0)));
  const p0 = R.rig.position.clone(), q0 = R.rig.quaternion.clone();
  await anim(650, e => { R.rig.position.lerpVectors(p0, p1, e); R.rig.quaternion.slerpQuaternions(q0, q1, e); }, curva.suave);
  await anim(800, e => { const th = Math.PI * e; R.pivote.rotation.y = -th; R.pivote.position.z = R.T * (1 - e); }, curva.suave);
  cambia('lectura');
  anuncia((b.manual ? 'Manual' : 'Libro de ' + b.code) + ' abierto. Arrastra la página o usa las flechas para pasarla. Esc para cerrarlo.');
}
async function pasa(dir, desde = 0, agarre = 0) {
  const L = lectura; if (L.giro && L.giro.anim) return;
  if (dir > 0 && L.k >= L.K - 1) return; if (dir < 0 && L.k <= 0) return;
  empiezaGiro(dir, agarre);
  await terminaGiro(desde, true);
}
function empiezaGiro(dir, agarre) {
  const L = lectura, R = L.rig, N = L.paginas.length, k = L.k;
  L.giro = { dir, p: dir > 0 ? 0 : 1, agarre };
  const frente = dir > 0 ? 2 * k : 2 * k - 2, dorso = dir > 0 ? 2 * k + 1 : 2 * k - 1;
  R.frente.material.map = frente < N ? texPagina(frente) : texGuarda(); R.frente.material.needsUpdate = true;
  R.dorso.material.map = texEspejo(dorso < N ? texPagina(dorso) : texGuarda()); R.dorso.material.needsUpdate = true;
  // lo que queda debajo de la hoja mientras gira
  if (dir > 0) { R.pagDer.material.map = 2 * k + 2 < N ? texPagina(2 * k + 2) : texGuarda(); }
  else { R.pagIzq.material.map = k - 1 === 0 ? texGuarda() : texPagina(2 * k - 3); R.pagIzq.visible = k - 1 > 0; }
  R.pagDer.material.needsUpdate = R.pagIzq.material.needsUpdate = true;
  R.frente.visible = R.dorso.visible = true;
  doblaHoja(L.giro.p, agarre);
}
async function terminaGiro(_, completar) {
  const L = lectura, g = L.giro, p0 = g.p, p1 = completar ? (g.dir > 0 ? 1 : 0) : (g.dir > 0 ? 0 : 1);
  g.anim = true;
  await anim(Math.max(160, 680 * Math.abs(p1 - p0)), e => { g.p = lerp(p0, p1, e); doblaHoja(g.p, g.agarre); }, curva.suave);
  L.rig.frente.visible = L.rig.dorso.visible = false;
  const pasada = (g.dir > 0 && p1 === 1) || (g.dir < 0 && p1 === 0);
  L.giro = null;
  ponPliego(pasada ? L.k + g.dir : L.k);
}
function paginaBajo() {
  raycaster.setFromCamera(ndc, camera);
  const R = lectura.rig, h = raycaster.intersectObjects([R.pagDer, R.pagIzq, R.bloqueDer, R.bloqueIzq])[0];
  if (!h) return null;
  return { lado: (h.object === R.pagDer || h.object === R.bloqueDer) ? 1 : -1, uv: h.uv, malla: h.object };
}
function enlaceBajo(pb) {
  if (!pb || !pb.uv || (pb.malla !== lectura.rig.pagDer && pb.malla !== lectura.rig.pagIzq)) return '';
  const n = pb.lado > 0 ? 2 * lectura.k : 2 * lectura.k - 1, url = lectura.enlaces[n];
  return url && pb.uv.y < 0.62 && pb.uv.y > 0.38 ? url : '';
}
modo('lectura', {
  punto() { const pb = paginaBajo(); if (lectura.giro && !lectura.giro.anim) return ['agarre']; if (enlaceBajo(pb)) return ['enlace', 'Abrir en la web']; return pb ? ['pagina'] : ['punto']; },
  down(e) {
    const pb = paginaBajo(); if (!pb || (lectura.giro && lectura.giro.anim)) return;
    const dir = pb.lado;
    lectura.arr = { x: e.clientX, y: e.clientY, dir, pb, empezado: false };
  },
  move(e) {
    actualizaPunto();
    const a = lectura.arr; if (!a) return;
    const dx = e.clientX - a.x;
    if (!a.empezado && Math.abs(dx) > 6) {
      if ((a.dir > 0 && lectura.k >= lectura.K - 1) || (a.dir < 0 && lectura.k <= 0)) { lectura.arr = null; return; }
      a.empezado = true; empiezaGiro(a.dir, a.pb.uv ? (a.pb.uv.y - 0.5) * 2 : 0);
    }
    if (a.empezado) {
      const f = clamp((a.dir > 0 ? -dx : dx) / (innerWidth * 0.32), 0, 1);
      lectura.giro.p = a.dir > 0 ? f : 1 - f; doblaHoja(lectura.giro.p, lectura.giro.agarre);
    }
  },
  up() {
    const a = lectura.arr; lectura.arr = null; if (!a) return;
    if (!a.empezado) {
      const url = enlaceBajo(a.pb); if (url) { window.open(url, '_blank', 'noopener'); return; }
      pasa(a.dir); return;
    }
    const g = lectura.giro, avance = g.dir > 0 ? g.p : 1 - g.p;
    terminaGiro(null, avance > 0.3);
  },
  tecla(e) {
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { pasa(1); return true; }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { pasa(-1); return true; }
    if (e.key === 'Enter') { const url = lectura.enlaces[2 * lectura.k] || lectura.enlaces[2 * lectura.k - 1]; if (url) window.open(url, '_blank', 'noopener'); return true; }
    return false;
  },
  esc() { cierraLibro(); }
});
async function cierraLibro() {
  const L = lectura, R = L.rig, o = L.o; if (!R || (L.giro && L.giro.anim)) return;
  cambia('ocupado');
  // v0.2.3 (fallo 20): se cierra DESDE la página en la que está. Antes las páginas volvían de golpe a la primera y
  // después se cerraba la tapa. Ahora lo leído (el bloque de la izquierda y su página) va pegado a la tapa: el pivote
  // los lleva consigo al girar, y al acabar quedan encima del bloque de la derecha (grosor tL + tR = T: cuadra).
  R.pivote.attach(R.bloqueIzq); R.pivote.attach(R.pagIzq);
  await anim(reduced ? 1 : 700, e => { R.pivote.rotation.y = -Math.PI * (1 - e); R.pivote.position.z = R.T * e; }, curva.suave);
  o.raiz.updateMatrixWorld(true);
  const m = new THREE.Matrix4().compose(v3(-o.dims.t / 2, 0, o.dims.d / 2), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0)), v3(1, 1, 1));
  // el libro cerrado se coloca donde está el abierto y vuelve solo a su hueco
  const inv = m.clone().invert(); const mb = new THREE.Matrix4().compose(R.rig.position, R.rig.quaternion, v3(1, 1, 1)).multiply(inv);
  mb.decompose(o.raiz.position, o.raiz.quaternion, new THREE.Vector3());
  o.raiz.visible = true; scene.remove(R.rig);
  R.rig.traverse(x => { if (x.geometry) x.geometry.dispose(); });
  Object.values(L.tex).forEach(t => t.dispose());
  L.rig = null; L.o = null;
  await volverACasa(o, 650); sueltaFoco(); cambia('libre'); bus.emit('vuelve');
}
