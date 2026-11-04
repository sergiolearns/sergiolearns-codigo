/* ===================== 09 · pizarra =====================
   E08: se escribe con el rotulador a mano alzada y se borra con el borrador.
   Para responder la pregunta del día se toca V o F: el rotulador va a la
   casilla y escribe la letra trazo a trazo, y después la explicación.
   Todo a mano (letra Caveat): es una pizarra de verdad, sin terminal. */
const PW = 1024, PH = 672;
const capa = n => { const c = document.createElement('canvas'); c.width = PW; c.height = PH; return c; };
const capaBase = capa(), capaTrazos = capa(), capaGuiada = capa();
const boardTex = texFrom(PW, PH);
const board = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.853), new THREE.MeshStandardMaterial({ map: boardTex, roughness: 0.5 }));
board.rotation.y = Math.PI / 2; board.position.set(-1.178, 1.45, -0.35); scene.add(board);
const CAJA_V = [560, 318, 120, 100], CAJA_F = [740, 318, 120, 100];
const TINTA = '#2F5FD0', TINTA_ROJA = '#C93F22';
function dibujaBase() {
  const c = capaBase.getContext('2d');
  c.fillStyle = '#F4F3F8'; c.fillRect(0, 0, PW, PH);
  c.fillStyle = 'rgba(30,27,46,.03)'; for (let i = 0; i < 40; i++) c.fillRect(Math.random() * PW, Math.random() * PH, 120, 2);   // restos de borrado
  c.fillStyle = '#1E1B2E'; c.font = '700 64px ' + MANO; c.fillText('Enero 2027', 48, 84);
  const dias = ['L', 'M', 'X', 'J', 'V', 'S', 'D'], cw = 58, x0 = 50, y0 = 146;
  c.font = '700 30px ' + MANO; c.fillStyle = '#5A566E'; dias.forEach((d, i) => c.fillText(d, x0 + i * cw + 18, y0));
  c.font = '600 32px ' + MANO;
  for (let d = 1; d <= 31; d++) {
    const idx = d + 3, col = idx % 7, fila = Math.floor(idx / 7), x = x0 + col * cw, y = y0 + 22 + fila * 54;   // el 1 de enero de 2027 es viernes
    c.fillStyle = '#2E2A42'; c.fillText(String(d), x + (d < 10 ? 18 : 9), y + 33);
    if (d === 8) { c.strokeStyle = '#FF6B4A'; c.lineWidth = 4; c.beginPath(); c.ellipse(x + 26, y + 22, 27, 22, -0.1, 0.2, Math.PI * 2.1); c.stroke(); }
  }
  const quedan = diasHasta(EXAMEN);
  c.fillStyle = TINTA_ROJA; c.font = '700 38px ' + MANO;
  c.fillText('8 ene: examen de FP1', 50, 520);
  c.fillText(quedan > 0 ? '¡Faltan ' + quedan + ' días!' : (quedan === 0 ? '¡Es hoy!' : 'Ya pasó'), 50, 566);
  c.strokeStyle = '#C9C5DC'; c.lineWidth = 3; c.beginPath(); c.moveTo(500, 50);
  for (let y = 50; y <= 630; y += 20) c.lineTo(500 + Math.sin(y / 37) * 2, y); c.stroke();
  c.fillStyle = '#1E1B2E'; c.font = '700 54px ' + MANO; c.fillText('Pregunta del día', 540, 84);
  c.fillStyle = '#2E2A42'; c.font = '600 42px ' + MANO; c.fillText(PREGUNTA.texto[0], 540, 156); c.fillText(PREGUNTA.texto[1], 540, 206);
  c.fillStyle = '#4638B8'; c.font = '700 44px ' + MANO; c.fillText('¿V o F?', 540, 276);
  c.strokeStyle = '#5A566E'; c.lineWidth = 3;
  [CAJA_V, CAJA_F].forEach(([x, y, w, h], i) => { c.strokeRect(x, y, w, h); c.fillStyle = '#8E8AA3'; c.font = '600 26px ' + MANO; c.fillText(i ? 'falso' : 'verdadero', x, y + h + 30); });
}
function componePizarra() {
  const g = boardTex.userData.g;
  g.drawImage(capaBase, 0, 0); g.drawImage(capaTrazos, 0, 0); g.drawImage(capaGuiada, 0, 0);
  boardTex.needsUpdate = true;
}

/* el rotulador y el borrador, en la bandeja */
const rotulador = new THREE.Group(); scene.add(rotulador);
box(0.018, 0.1, 0.018, mat(0xFAFAF7, { r: 0.5 }), 0, 0.01, 0, rotulador);
const capuchon = box(0.02, 0.03, 0.02, mat(0x2F5FD0, { r: 0.5 }), 0, 0.07, 0, rotulador);
box(0.008, 0.016, 0.008, mat(0x1E1B2E), 0, -0.048, 0, rotulador);       // la punta (−y)
const borrador = new THREE.Group(); scene.add(borrador);
box(0.05, 0.03, 0.11, mat(0x4638B8, { r: 0.7 }), 0, 0.015, 0, borrador);
box(0.05, 0.008, 0.11, mat(0xE8E6F5, { r: 0.95 }), 0, -0.004, 0, borrador);
const ROT_BANDEJA = { pos: v3(-1.155, 1.0, -0.2), quat: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)) };
const BOR_BANDEJA = { pos: v3(-1.155, 1.003, -0.55), quat: new THREE.Quaternion() };
rotulador.position.copy(ROT_BANDEJA.pos); rotulador.quaternion.copy(ROT_BANDEJA.quat);
borrador.position.copy(BOR_BANDEJA.pos);
// apoyado en la pizarra: la punta (−y) toca la pizarra (que mira a +x) y el cuerpo sale inclinado
const Q_ESCRIBE = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI / 2 + 0.45));
const Q_BORRA = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI / 2));
const piz = { herramienta: 'rotulador', trazando: false, ultimo: null, respuesta: '', escribiendo: false, punta: new THREE.Vector3() };

function uvPizarra() {
  raycaster.setFromCamera(ndc, camera);
  const h = raycaster.intersectObject(board)[0];
  return h ? { x: h.uv.x * PW, y: (1 - h.uv.y) * PH, p: h.point } : null;
}
function enPizarra(x, y) { return v3(-1.178, 1.45 + (0.5 - y / PH) * 0.853, -0.35 + (0.5 - x / PW) * 1.3); }   // de lienzo a mundo (la u crece hacia −z)
function herramientaA(punto, dt = 1) {
  const g = piz.herramienta === 'rotulador' ? rotulador : borrador;
  const dentro = punto.clone().add(v3(piz.herramienta === 'rotulador' ? 0.055 : 0.03, piz.herramienta === 'rotulador' ? 0.02 : 0, 0));
  const k = reduced ? 1 : 1 - Math.exp(-dt * 30);
  g.position.lerp(dentro, k); g.quaternion.slerp(piz.herramienta === 'rotulador' ? Q_ESCRIBE : Q_BORRA, k);
}
function trazo(c, a, b, borrar) {
  c.save();
  if (borrar) { c.globalCompositeOperation = 'destination-out'; c.lineWidth = 46; } else { c.strokeStyle = TINTA; c.lineWidth = 6; }
  c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); c.restore();
}
async function vaHerramienta(nombre) {
  // deja la que tenía en la bandeja y coge la otra
  if (piz.herramienta === nombre) return;
  const vieja = piz.herramienta === 'rotulador' ? [rotulador, ROT_BANDEJA] : [borrador, BOR_BANDEJA];
  piz.herramienta = nombre;
  const p0 = vieja[0].position.clone(), q0 = vieja[0].quaternion.clone();
  anim(380, e => { vieja[0].position.lerpVectors(p0, vieja[1].pos, e); vieja[0].quaternion.slerpQuaternions(q0, vieja[1].quat, e); }, curva.suave);
  actualizaPunto();
}
async function responde(letra) {
  if (piz.escribiendo) return;
  piz.escribiendo = true; await vaHerramienta('rotulador');
  const c = capaGuiada.getContext('2d'); c.clearRect(0, 0, PW, PH); componePizarra();
  const [x, y, w, h] = letra === 'V' ? CAJA_V : CAJA_F;
  const TRAZOS = letra === 'V' ? [[[0.2, 0.14], [0.5, 0.86], [0.8, 0.14]]] : [[[0.32, 0.1], [0.32, 0.9]], [[0.32, 0.12], [0.8, 0.12]], [[0.32, 0.48], [0.68, 0.48]]];
  for (const t of TRAZOS) {
    const pts = t.map(([u, v]) => ({ x: x + u * w, y: y + v * h }));
    // el rotulador va al principio del trazo, «levantado»
    const p0 = rotulador.position.clone(), destino = enPizarra(pts[0].x, pts[0].y).add(v3(0.075, 0.02, 0));
    await anim(220, e => rotulador.position.lerpVectors(p0, destino, e), curva.suave);
    let largo = 0; for (let i = 1; i < pts.length; i++) largo += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    let prev = pts[0];
    await anim(160 + largo * 2.2, e => {
      // recorre la polilínea hasta la distancia e·largo
      let resto = e * largo, i = 1, q = pts[0];
      while (i < pts.length) { const s = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y); if (resto <= s) { const f = resto / s; q = { x: lerp(pts[i - 1].x, pts[i].x, f), y: lerp(pts[i - 1].y, pts[i].y, f) }; break; } resto -= s; q = pts[i]; i++; }
      trazo(c, prev, q); prev = q; componePizarra();
      rotulador.position.copy(enPizarra(q.x, q.y).add(v3(0.055, 0.02, 0))); rotulador.quaternion.copy(Q_ESCRIBE);
    }, curva.lineal);
  }
  const bien = letra === PREGUNTA.correcta;
  const lineas = [[bien ? '¡Bien! Es falso.' : 'Casi: es falso.', bien ? '#16794B' : TINTA_ROJA, 44], ...PREGUNTA.explica.map(t => [t, TINTA, 34])];
  let yy = 494;
  for (const [txt, color, tam] of lineas) { await escribeLinea(c, txt, 540, yy, color, tam); yy += tam + 10; }
  piz.respuesta = letra; piz.escribiendo = false;
  anuncia((bien ? 'Correcto. ' : 'No es correcto. ') + PREGUNTA.explica.join(' '));
}
async function escribeLinea(c, txt, x, y, color, tam) {
  // la línea se escribe de izquierda a derecha y el rotulador va siguiendo el borde
  const tmp = document.createElement('canvas'); tmp.width = PW; tmp.height = tam + 30; const t = tmp.getContext('2d');
  t.font = '700 ' + tam + 'px ' + MANO; t.fillStyle = color; t.fillText(txt, x, tam); const ancho = t.measureText(txt).width;
  let hecho = 0;
  await anim(260 + ancho * 3.2, e => {
    const hasta = x + ancho * e;
    c.drawImage(tmp, x + hecho, 0, hasta - x - hecho + 1, tmp.height, x + hecho, y - tam, hasta - x - hecho + 1, tmp.height);
    hecho = hasta - x; componePizarra();
    rotulador.position.copy(enPizarra(hasta, y - tam * 0.35).add(v3(0.055, 0.02, 0)));
  }, curva.lineal);
}
registrar('pizarra', {
  nombre: 'Pizarra · pregunta del día', mallas: [board, boardFrame], puntero: 'rotulador', brilloK: 0.5,
  alClic: async () => {
    cambia('ocupado');
    enfoca(v3(-1.18, 1.43, -0.35), v3(-0.25, 1.32, 0.12), 50, { paralaje: 0.015 });
    piz.herramienta = 'rotulador';
    const p0 = rotulador.position.clone(), q0 = rotulador.quaternion.clone(), p1 = enPizarra(PW / 2, PH * 0.72).add(v3(0.08, 0.02, 0));
    await anim(600, e => { rotulador.position.lerpVectors(p0, p1, e); rotulador.quaternion.slerpQuaternions(q0, Q_ESCRIBE, e); }, curva.suave);
    cambia('pizarra');
    anuncia('En la pizarra, con el rotulador. Arrastra para escribir; toca V o F para responder, o pulsa las teclas V o F. Esc para volver.');
  }
});
function herramientaBajo() {
  raycaster.setFromCamera(ndc, camera);
  const h = raycaster.intersectObjects([...rotulador.children, ...borrador.children])[0];
  return h ? (rotulador.children.includes(h.object) ? 'rotulador' : 'borrador') : null;
}
modo('pizarra', {
  punto() { const hb = herramientaBajo(); if (hb && hb !== piz.herramienta) return ['mano', hb === 'rotulador' ? 'Rotulador' : 'Borrador']; return [piz.herramienta]; },
  down(e) {
    if (piz.escribiendo) return;
    const hb = herramientaBajo(); if (hb && hb !== piz.herramienta) { vaHerramienta(hb); return; }
    const u = uvPizarra(); if (!u) return;
    for (const [L, [x, y, w, h]] of [['V', CAJA_V], ['F', CAJA_F]]) if (piz.herramienta === 'rotulador' && u.x > x && u.x < x + w && u.y > y && u.y < y + h) { responde(L); return; }
    piz.trazando = true; piz.ultimo = u;
  },
  move() {
    actualizaPunto();
    const u = uvPizarra(); if (!u || piz.escribiendo) return;
    piz.punta.copy(u.p);
    if (piz.trazando) {
      trazo(capaTrazos.getContext('2d'), piz.ultimo, u, piz.herramienta === 'borrador');
      if (piz.herramienta === 'borrador') trazo(capaGuiada.getContext('2d'), piz.ultimo, u, true);
      piz.ultimo = u; componePizarra();
    }
  },
  up() { piz.trazando = false; },
  tecla(e) { const k = e.key.toUpperCase(); if (k === 'V' || k === 'F') { responde(k); return true; } return false; },
  async esc() {
    if (piz.escribiendo) return;
    cambia('ocupado');
    const viejas = [[rotulador, ROT_BANDEJA], [borrador, BOR_BANDEJA]];
    await Promise.all(viejas.map(([g, d]) => { const p0 = g.position.clone(), q0 = g.quaternion.clone(); return anim(520, e => { g.position.lerpVectors(p0, d.pos, e); g.quaternion.slerpQuaternions(q0, d.quat, e); }, curva.suave); }));
    piz.herramienta = 'rotulador'; sueltaFoco(); cambia('libre'); bus.emit('vuelve');
  }
});
function corrPizarra(dt) {
  if (gesto.estado !== 'pizarra' || piz.escribiendo) return;
  if (piz.punta.lengthSq() > 0) herramientaA(piz.punta, dt);
}
