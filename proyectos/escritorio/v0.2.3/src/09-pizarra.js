/* ===================== 09 · pizarra =====================
   E08 (v0.2): se escribe a mano y la pregunta del día se responde tocando V o F.
   E36 (v0.2.1): una pizarra útil, sin botones: tres rotuladores de verdad en la bandeja
   (azul, rojo y verde), la rueda cambia el grosor, doble clic escribe una nota con el
   teclado (letra Caveat), Ctrl+Z deshace, el borrador borra (doble clic con él o Supr:
   todo) y lo escrito se guarda en el navegador.
   Lo escrito es una lista de operaciones (trazo, borrado, nota, limpiar): se puede
   deshacer y guardar, y la capa se redibuja entera desde la lista. Fragmento F4.
   v0.2.2: la pizarra pasa a la pared derecha (la izquierda es de la cama y el armario, como en el cuarto de
   Sergio). Supr borra solo tus trazos y deja lo de fábrica; Mayús+Supr la deja en blanco (fallo 8). La respuesta
   guiada se escribe con el color del rotulador que llevas (fallo 9). */
const PW = 1024, PH = 672;
const capa = () => { const c = document.createElement('canvas'); c.width = PW; c.height = PH; return c; };
const capaBase = capa(), capaTrazos = capa(), capaGuiada = capa(), capaNota = capa();
const boardTex = texFrom(PW, PH);
const board = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.853), new THREE.MeshStandardMaterial({ map: boardTex, roughness: 0.5 }));
board.rotation.y = -Math.PI / 2; board.position.set(PIZ.x, PIZ.y, PIZ.z); scene.add(board);
const CAJA_V = [560, 318, 120, 100], CAJA_F = [740, 318, 120, 100];
const TINTA = '#2F5FD0', TINTA_ROJA = '#C93F22';
const COLORES = { azul: '#2F5FD0', rojo: '#C2362B', verde: '#16794B' };
const GROSOR = { trazo: [3, 6, 11], borra: [26, 46, 80], nota: [34, 44, 58] };
function dibujaBase() {
  const c = capaBase.getContext('2d');
  c.fillStyle = '#F4F3F8'; c.fillRect(0, 0, PW, PH);
  let sem = 3; const rnd = () => (sem = (sem * 16807) % 2147483647) / 2147483647;
  c.fillStyle = 'rgba(30,27,46,.03)'; for (let i = 0; i < 40; i++) c.fillRect(rnd() * PW, rnd() * PH, 120, 2);   // restos de borrado
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
// v0.2.1 (E35): el borrador de la v0.2 solo quitaba lo que dibujabas tú; lo que ya estaba escrito (el calendario,
// la pregunta) no se podía borrar y parecía que el borrador no hacía nada. Ahora la pizarra entera es una capa:
// lo escrito de fábrica + tus operaciones encima, y el borrador pinta del color de la pizarra todo lo que toca.
const FONDO_PIZARRA = '#F4F3F8';
function componePizarra() {
  const g = boardTex.userData.g;
  g.drawImage(capaTrazos, 0, 0); g.drawImage(capaGuiada, 0, 0); g.drawImage(capaNota, 0, 0);
  boardTex.needsUpdate = true;
}

/* ---------- lo escrito: una lista de operaciones que se guarda ---------- */
const MAX_PUNTOS = 24000;   // lo que cabe holgado en el almacenamiento del navegador
const pizOps = (() => { const g = guardado.get('pizarra', null); return g && g.v === 1 && Array.isArray(g.ops) ? g.ops : []; })();
let guardaPend = 0;
function guardaPizarra() {
  clearTimeout(guardaPend);
  guardaPend = setTimeout(() => {
    let total = pizOps.reduce((n, op) => n + (op.p ? op.p.length : 1), 0);
    while (total > MAX_PUNTOS && pizOps.length > 1) { const v = pizOps.shift(); total -= v.p ? v.p.length : 1; }
    guardado.set('pizarra', { v: 1, ops: pizOps });
  }, 300);
}
function pintaOp(c, op) {
  if (op.t === 'tuyo') { c.drawImage(capaBase, 0, 0); return; }   // borrar solo lo tuyo: vuelve lo de fábrica
  if (op.t === 'limpia') {                       // la pizarra limpia, con los restos de borrado de siempre
    c.fillStyle = FONDO_PIZARRA; c.fillRect(0, 0, PW, PH);
    let sem = 9; const rnd = () => (sem = (sem * 16807) % 2147483647) / 2147483647;
    c.fillStyle = 'rgba(30,27,46,.035)'; for (let i = 0; i < 60; i++) c.fillRect(rnd() * PW, rnd() * PH, 160, 3);
    return;
  }
  if (op.t === 'nota') {
    c.save(); c.fillStyle = op.c; c.font = '700 ' + op.s + 'px ' + MANO;
    op.txt.split('\n').forEach((l, i) => c.fillText(l, op.x, op.y + i * op.s * 1.05)); c.restore(); return;
  }
  const p = op.p; if (!p || !p.length) return;
  c.save();
  if (op.t === 'borra') { c.strokeStyle = op.capa ? '#000' : FONDO_PIZARRA; if (op.capa) c.globalCompositeOperation = 'destination-out'; } else c.strokeStyle = op.c;
  c.lineWidth = op.w; c.lineCap = 'round'; c.lineJoin = 'round'; c.fillStyle = op.c || '#000';
  if (p.length === 1) { c.beginPath(); c.arc(p[0][0], p[0][1], op.w / 2, 0, Math.PI * 2); c.fill(); }
  else { c.beginPath(); c.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) c.lineTo(p[i][0], p[i][1]); c.stroke(); }
  c.restore();
}
function repintaTrazos() { const c = capaTrazos.getContext('2d'); c.drawImage(capaBase, 0, 0); pizOps.forEach(op => pintaOp(c, op)); componePizarra(); }

/* ---------- los rotuladores y el borrador, en la bandeja ---------- */
function creaRotulador(color) {
  const g = new THREE.Group(); scene.add(g);
  box(0.018, 0.1, 0.018, mat(0xFAFAF7, { r: 0.5 }), 0, 0.01, 0, g);
  box(0.02, 0.03, 0.02, mat(new THREE.Color(color).getHex(), { r: 0.5 }), 0, 0.07, 0, g);   // capuchón del color de la tinta
  box(0.0185, 0.03, 0.0185, mat(new THREE.Color(color).getHex(), { r: 0.6 }), 0, 0.005, 0, g);
  box(0.008, 0.016, 0.008, mat(0x1E1B2E), 0, -0.048, 0, g);       // la punta (−y)
  return g;
}
const herr = {
  azul: { g: creaRotulador(COLORES.azul), casa: { pos: v3(SALA.x1 - 0.035, 1.0, PIZ.z - 0.45) }, nombre: 'Rotulador azul' },
  rojo: { g: creaRotulador(COLORES.rojo), casa: { pos: v3(SALA.x1 - 0.035, 1.0, PIZ.z - 0.32) }, nombre: 'Rotulador rojo' },
  verde: { g: creaRotulador(COLORES.verde), casa: { pos: v3(SALA.x1 - 0.035, 1.0, PIZ.z - 0.19) }, nombre: 'Rotulador verde' },
  borrador: { g: new THREE.Group(), casa: { pos: v3(SALA.x1 - 0.035, 1.003, PIZ.z + 0.2) }, nombre: 'Borrador' }
};
scene.add(herr.borrador.g);
box(0.05, 0.03, 0.11, mat(0x4638B8, { r: 0.7 }), 0, 0.015, 0, herr.borrador.g);
box(0.05, 0.008, 0.11, mat(0xE8E6F5, { r: 0.95 }), 0, -0.004, 0, herr.borrador.g);
const Q_TUMBADO = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
Object.entries(herr).forEach(([k, h]) => { h.casa.quat = k === 'borrador' ? new THREE.Quaternion() : Q_TUMBADO; h.g.position.copy(h.casa.pos); h.g.quaternion.copy(h.casa.quat); });
const rotulador = herr.azul.g, borrador = herr.borrador.g;   // nombres de la v0.2 (los usan otros módulos y los guiones)
// apoyado en la pizarra: la punta (−y) toca la pizarra (que mira a +x) y el cuerpo sale inclinado
// (v0.2.2: la pizarra mira a −x; se gira media vuelta lo que se calculó para la pared izquierda)
const Q_MEDIA = new THREE.Quaternion().setFromAxisAngle(v3(0, 1, 0), Math.PI);
const Q_ESCRIBE = Q_MEDIA.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI / 2 + 0.45)));
const Q_BORRA = Q_MEDIA.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI / 2)));
const piz = { herramienta: 'azul', grosor: 1, trazando: null, ultimo: null, respuesta: '', escribiendo: false, punta: new THREE.Vector3(), nota: null, ultimoClic: { t: 0, x: 0, y: 0 } };
const esRotulador = h => h !== 'borrador';

function uvPizarra() {
  raycaster.setFromCamera(ndc, camera);
  const h = raycaster.intersectObject(board)[0];
  return h ? { x: h.uv.x * PW, y: (1 - h.uv.y) * PH, p: h.point } : null;
}
function enPizarra(x, y) { return v3(PIZ.x, PIZ.y + (0.5 - y / PH) * PIZ.h, PIZ.z + (x / PW - 0.5) * PIZ.w); }   // de lienzo a mundo (la u crece hacia +z)
function herramientaA(punto, dt = 1) {
  const h = herr[piz.herramienta], g = h.g, rot = esRotulador(piz.herramienta);
  const dentro = punto.clone().add(v3(rot ? -0.055 : -0.03, rot ? 0.02 : 0, 0));
  const k = reduced ? 1 : 1 - Math.exp(-dt * 30);
  g.position.lerp(dentro, k); g.quaternion.slerp(rot ? Q_ESCRIBE : Q_BORRA, k);
}
function aLaBandeja(nombre, dur = 380) {
  const h = herr[nombre], p0 = h.g.position.clone(), q0 = h.g.quaternion.clone();
  return anim(dur, e => { h.g.position.lerpVectors(p0, h.casa.pos, e); h.g.quaternion.slerpQuaternions(q0, h.casa.quat, e); }, curva.suave);
}
async function vaHerramienta(nombre) {
  // deja la que tenía en la bandeja y coge la otra (que viaja hasta donde está la punta)
  if (piz.herramienta === nombre) return;
  const vieja = piz.herramienta; piz.herramienta = nombre;
  aLaBandeja(vieja);
  const h = herr[nombre], p0 = h.g.position.clone(), q0 = h.g.quaternion.clone();
  const destino = (piz.punta.lengthSq() > 0 ? piz.punta.clone() : enPizarra(PW / 2, PH * 0.72)).add(v3(-0.06, 0.02, 0));
  anim(320, e => { h.g.position.lerpVectors(p0, destino, e); h.g.quaternion.slerpQuaternions(q0, esRotulador(nombre) ? Q_ESCRIBE : Q_BORRA, e); }, curva.suave);
  anuncia(h.nombre + (esRotulador(nombre) ? '. Grosor ' + (piz.grosor + 1) + ' de 3.' : '. Supr borra tus trazos; Mayús+Supr o doble clic, todo.'));
  actualizaPunto();
}
function cambiaGrosor(d) {
  const n = clamp(piz.grosor + d, 0, 2); if (n === piz.grosor) return;
  piz.grosor = n; anuncia('Grosor ' + (n + 1) + ' de 3.');
  // el rotulador gira un poco en la mano, como cuando lo inclinas para hacer la línea más gruesa
  const g = herr[piz.herramienta].g, q0 = g.quaternion.clone();
  anim(160, e => { g.quaternion.copy(q0).multiply(_q.setFromAxisAngle(v3(0, 1, 0), Math.sin(e * Math.PI) * 0.4 * d)); }, curva.suave);
}

/* ---------- deshacer y borrar todo ---------- */
function deshaz() {
  if (!pizOps.length) { anuncia('No hay nada que deshacer.'); return; }
  const op = pizOps.pop(); repintaTrazos(); guardaPizarra();
  anuncia({ trazo: 'Trazo deshecho.', borra: 'Borrado deshecho.', nota: 'Nota deshecha.', limpia: 'Vuelve lo que habías borrado.', tuyo: 'Vuelven tus trazos.' }[op.t] || 'Deshecho.');
}
async function borraTodo() {
  if (piz.escribiendo) return;
  piz.escribiendo = true;
  const prev = piz.herramienta; if (prev !== 'borrador') await vaHerramienta('borrador');
  // el borrador barre la pizarra de izquierda a derecha en zigzag y lo escrito desaparece por detrás
  const ct = capaTrazos.getContext('2d'), cg = capaGuiada.getContext('2d');
  await anim(reduced ? 1 : 1100, e => {
    const x = e * PW, y = PH * (0.5 + 0.38 * Math.sin(e * Math.PI * 7));
    ct.fillStyle = FONDO_PIZARRA; ct.fillRect(0, 0, x, PH); cg.clearRect(0, 0, x, PH); componePizarra();
    herr.borrador.g.position.copy(enPizarra(x, y).add(v3(-0.03, 0, 0))); herr.borrador.g.quaternion.copy(Q_BORRA);
  }, curva.lineal);
  pizOps.push({ t: 'limpia' }); repintaTrazos(); guardaPizarra(); piz.respuesta = '';
  piz.escribiendo = false;
  anuncia('Pizarra borrada. Ctrl+Z la recupera.');
}

// Supr (fallo 8, decisión de Sergio): borra solo lo que has escrito tú; el calendario y la pregunta se quedan
async function borraTuyo() {
  if (piz.escribiendo) return;
  piz.escribiendo = true;
  const prev = piz.herramienta; if (prev !== 'borrador') await vaHerramienta('borrador');
  const ct = capaTrazos.getContext('2d'), cg = capaGuiada.getContext('2d');
  await anim(reduced ? 1 : 900, e => {
    const x = e * PW, y = PH * (0.5 + 0.38 * Math.sin(e * Math.PI * 6));
    ct.drawImage(capaBase, 0, 0, x, PH, 0, 0, x, PH); cg.clearRect(0, 0, x, PH); componePizarra();
    herr.borrador.g.position.copy(enPizarra(x, y).add(v3(-0.03, 0, 0))); herr.borrador.g.quaternion.copy(Q_BORRA);
  }, curva.lineal);
  pizOps.push({ t: 'tuyo' }); repintaTrazos(); guardaPizarra(); piz.respuesta = '';
  piz.escribiendo = false;
  anuncia('Tus trazos y notas, borrados; lo de fábrica sigue. Ctrl+Z los recupera.');
}

/* ---------- notas con el teclado (doble clic o N) ---------- */
function empiezaNota(x, y) {
  if (!esRotulador(piz.herramienta)) vaHerramienta('azul');
  piz.nota = { t: 'nota', x: clamp(x, 20, PW - 120), y: clamp(y, 50, PH - 20), c: COLORES[esRotulador(piz.herramienta) ? piz.herramienta : 'azul'], s: GROSOR.nota[piz.grosor], txt: '' };
  cambia('nota'); const inp = $('#entrada'); inp.value = ''; inp.focus({ preventScroll: true }); setTimeout(() => { if (piz.nota) inp.focus({ preventScroll: true }); }, 0);
  pintaNota(performance.now());
  anuncia('Escribe la nota. Intro: otra línea. Esc o un clic fuera: terminar.');
}
function pintaNota(t) {
  const c = capaNota.getContext('2d'); c.clearRect(0, 0, PW, PH);
  const n = piz.nota; if (!n) { componePizarra(); return; }
  pintaOp(c, n);
  const lineas = n.txt.split('\n'), ult = lineas[lineas.length - 1];
  c.font = '700 ' + n.s + 'px ' + MANO;
  const cx = n.x + c.measureText(ult).width + 3, cy = n.y + (lineas.length - 1) * n.s * 1.05;
  if (reduced || Math.floor(t / 500) % 2 === 0) { c.fillStyle = n.c; c.fillRect(cx, cy - n.s * 0.8, 3, n.s * 0.9); }
  componePizarra();
  // el rotulador sigue al final de lo escrito
  const h = herr[piz.herramienta]; if (esRotulador(piz.herramienta)) { h.g.position.copy(enPizarra(cx + 6, cy - n.s * 0.3).add(v3(-0.055, 0.02, 0))); h.g.quaternion.copy(Q_ESCRIBE); }
}
function terminaNota() {
  const n = piz.nota; if (!n) return;
  piz.nota = null; capaNota.getContext('2d').clearRect(0, 0, PW, PH);
  if (n.txt.trim()) { pizOps.push({ t: 'nota', x: Math.round(n.x), y: Math.round(n.y), c: n.c, s: n.s, txt: n.txt }); pintaOp(capaTrazos.getContext('2d'), pizOps[pizOps.length - 1]); guardaPizarra(); anuncia('Nota guardada.'); }
  componePizarra(); $('#entrada').blur(); cambia('pizarra');
}
$('#entrada').addEventListener('keydown', e => {
  if (gesto.estado !== 'nota') return;
  if (e.key === 'Escape') return;   // lo trata el teclado general (modo nota → esc)
  const n = piz.nota;
  if (e.key === 'Enter') { e.preventDefault(); if (n.txt.split('\n').length < 6) n.txt += '\n'; return; }
  if (e.key === 'Backspace') { e.preventDefault(); n.txt = n.txt.slice(0, -1); return; }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); n.txt = n.txt.slice(0, -1); return; }
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) { e.preventDefault(); if (n.txt.length < 160) n.txt += e.key; }
});
$('#entrada').addEventListener('input', e => { if (gesto.estado === 'nota' && piz.nota) { piz.nota.txt = (piz.nota.txt + (e.data || e.target.value)).slice(0, 160); e.target.value = ''; } });
modo('nota', {
  punto: () => ['texto'],
  down() { terminaNota(); },
  // el clic sobre el lienzo le quita el foco a la entrada de texto (lo hace el navegador después de pointerdown): se devuelve al soltar
  up() { if (piz.nota) $('#entrada').focus({ preventScroll: true }); },
  esc() { terminaNota(); }
});

/* ---------- responder la pregunta del día: el rotulador escribe la letra trazo a trazo ---------- */
async function responde(letra) {
  if (piz.escribiendo) return;
  piz.escribiendo = true;
  if (!esRotulador(piz.herramienta)) await vaHerramienta('azul');
  const rot = herr[piz.herramienta].g, tinta = COLORES[piz.herramienta];   // fallo 9: con el color del rotulador que llevas
  const c = capaGuiada.getContext('2d'); c.clearRect(0, 0, PW, PH); componePizarra();
  const [x, y, w, h] = letra === 'V' ? CAJA_V : CAJA_F;
  const TRAZOS = letra === 'V' ? [[[0.2, 0.14], [0.5, 0.86], [0.8, 0.14]]] : [[[0.32, 0.1], [0.32, 0.9]], [[0.32, 0.12], [0.8, 0.12]], [[0.32, 0.48], [0.68, 0.48]]];
  for (const t of TRAZOS) {
    const pts = t.map(([u, v]) => ({ x: x + u * w, y: y + v * h }));
    const p0 = rot.position.clone(), destino = enPizarra(pts[0].x, pts[0].y).add(v3(-0.075, 0.02, 0));
    await anim(220, e => rot.position.lerpVectors(p0, destino, e), curva.suave);
    let largo = 0; for (let i = 1; i < pts.length; i++) largo += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    let prev = pts[0];
    await anim(160 + largo * 2.2, e => {
      let resto = e * largo, i = 1, q = pts[0];
      while (i < pts.length) { const s = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y); if (resto <= s) { const f = resto / s; q = { x: lerp(pts[i - 1].x, pts[i].x, f), y: lerp(pts[i - 1].y, pts[i].y, f) }; break; } resto -= s; q = pts[i]; i++; }
      pintaOp(c, { t: 'trazo', c: tinta, w: 6, p: [[prev.x, prev.y], [q.x, q.y]] }); prev = q; componePizarra();
      rot.position.copy(enPizarra(q.x, q.y).add(v3(-0.055, 0.02, 0))); rot.quaternion.copy(Q_ESCRIBE);
    }, curva.lineal);
  }
  const bien = letra === PREGUNTA.correcta;
  const lineas = [[bien ? '¡Bien! Es falso.' : 'Casi: es falso.', tinta, 44], ...PREGUNTA.explica.map(t => [t, tinta, 34])];
  let yy = 494;
  for (const [txt, color, tam] of lineas) { await escribeLinea(c, txt, 540, yy, color, tam, rot); yy += tam + 10; }
  piz.respuesta = letra; piz.escribiendo = false;
  anuncia((bien ? 'Correcto. ' : 'No es correcto. ') + PREGUNTA.explica.join(' '));
}
async function escribeLinea(c, txt, x, y, color, tam, rot) {
  const tmp = document.createElement('canvas'); tmp.width = PW; tmp.height = tam + 30; const t = tmp.getContext('2d');
  t.font = '700 ' + tam + 'px ' + MANO; t.fillStyle = color; t.fillText(txt, x, tam); const ancho = t.measureText(txt).width;
  let hecho = 0;
  await anim(260 + ancho * 3.2, e => {
    const hasta = x + ancho * e;
    c.drawImage(tmp, x + hecho, 0, hasta - x - hecho + 1, tmp.height, x + hecho, y - tam, hasta - x - hecho + 1, tmp.height);
    hecho = hasta - x; componePizarra();
    rot.position.copy(enPizarra(hasta, y - tam * 0.35).add(v3(-0.055, 0.02, 0)));
  }, curva.lineal);
}

/* ---------- entrar en la pizarra ---------- */
registrar('pizarra', {
  nombre: 'Pizarra · notas, dibujo y pregunta del día', mallas: [board, boardFrame], puntero: 'rotulador', brilloK: 0.5, lugar: 'pizarra', alcance: 0.1,
  alClic: async () => {
    cambia('ocupado');
    // un poco más abajo que en la v0.2: así se ve la bandeja con los rotuladores y el borrador
    enfoca(v3(PIZ.x, 1.38, PIZ.z), v3(0.34, 1.45, PIZ.z), 54, { paralaje: 0.015 });
    const h = herr[piz.herramienta], p0 = h.g.position.clone(), q0 = h.g.quaternion.clone(), p1 = enPizarra(PW / 2, PH * 0.72).add(v3(-0.08, 0.02, 0));
    await anim(600, e => { h.g.position.lerpVectors(p0, p1, e); h.g.quaternion.slerpQuaternions(q0, esRotulador(piz.herramienta) ? Q_ESCRIBE : Q_BORRA, e); }, curva.suave);
    cambia('pizarra');
    anuncia('En la pizarra. Arrastra para escribir; doble clic para una nota con el teclado. Teclas: 1, 2 y 3 los rotuladores, B el borrador, rueda o + y − el grosor, N una nota, Ctrl+Z deshace, Supr borra tus trazos, Mayús+Supr la deja en blanco, V o F responde. Esc para volver.');
  }
});
function herramientaBajo() {
  raycaster.setFromCamera(ndc, camera);
  const todos = []; Object.entries(herr).forEach(([k, h]) => h.g.children.forEach(m => { m.userData.herr = k; todos.push(m); }));
  const h = raycaster.intersectObjects(todos)[0];
  return h ? h.object.userData.herr : null;
}
modo('pizarra', {
  punto() {
    const hb = herramientaBajo(); if (hb && hb !== piz.herramienta) return ['mano', herr[hb].nombre];
    return esRotulador(piz.herramienta) ? ['rotulador', '', COLORES[piz.herramienta]] : ['borrador'];
  },
  down(e) {
    if (piz.escribiendo) return;
    const hb = herramientaBajo(); if (hb && hb !== piz.herramienta) { vaHerramienta(hb); return; }
    const u = uvPizarra(); if (!u) return;
    // doble clic: con un rotulador, nota con el teclado; con el borrador, borrar todo
    const t = performance.now(), uc = piz.ultimoClic, doble = t - uc.t < 380 && Math.hypot(u.x - uc.x, u.y - uc.y) < 24;
    piz.ultimoClic = { t, x: u.x, y: u.y };
    if (doble) {
      const punto1 = uc.op; if (punto1 && pizOps[pizOps.length - 1] === punto1 && punto1.p.length <= 2) { pizOps.pop(); repintaTrazos(); guardaPizarra(); }   // el primer clic dejó un puntito
      piz.trazando = null;
      if (esRotulador(piz.herramienta)) empiezaNota(u.x, u.y + 14); else borraTodo();
      return;
    }
    if (esRotulador(piz.herramienta)) for (const [L, [x, y, w, h]] of [['V', CAJA_V], ['F', CAJA_F]]) if (u.x > x && u.x < x + w && u.y > y && u.y < y + h) { responde(L); return; }
    const borra = !esRotulador(piz.herramienta);
    const op = borra ? { t: 'borra', w: GROSOR.borra[piz.grosor], p: [[Math.round(u.x), Math.round(u.y)]] } : { t: 'trazo', c: COLORES[piz.herramienta], w: GROSOR.trazo[piz.grosor], p: [[Math.round(u.x), Math.round(u.y)]] };
    pizOps.push(op); pintaOp(capaTrazos.getContext('2d'), op);
    if (borra) pintaOp(capaGuiada.getContext('2d'), Object.assign({}, op, { capa: true }));
    componePizarra();
    piz.trazando = { op }; piz.ultimo = u; piz.ultimoClic.op = op;
  },
  move() {
    actualizaPunto();
    const u = uvPizarra(); if (!u || piz.escribiendo) return;
    piz.punta.copy(u.p);
    const tr = piz.trazando; if (!tr) return;
    if (Math.hypot(u.x - piz.ultimo.x, u.y - piz.ultimo.y) < 2) return;   // menos puntos que guardar
    const seg = { t: tr.op.t, c: tr.op.c, w: tr.op.w, p: [[piz.ultimo.x, piz.ultimo.y], [u.x, u.y]] };
    tr.op.p.push([Math.round(u.x), Math.round(u.y)]);
    pintaOp(capaTrazos.getContext('2d'), seg);
    if (tr.op.t === 'borra') pintaOp(capaGuiada.getContext('2d'), Object.assign(seg, { capa: true }));
    piz.ultimo = u; componePizarra();
  },
  up() { if (piz.trazando) { piz.trazando = null; guardaPizarra(); } },
  wheel(e) { cambiaGrosor(e.deltaY < 0 ? 1 : -1); },
  tecla(e) {
    const k = e.key, K = k.toUpperCase();
    if ((e.ctrlKey || e.metaKey) && K === 'Z') { deshaz(); return true; }
    if (e.ctrlKey || e.metaKey || e.altKey) return false;
    if ((K === 'V' || K === 'F') && !e.shiftKey) { responde(K); return true; }
    if (k === '1' || k === '2' || k === '3') { vaHerramienta(['azul', 'rojo', 'verde'][+k - 1]); return true; }
    if (K === 'B') { vaHerramienta('borrador'); return true; }
    if (k === '+') { cambiaGrosor(1); return true; } if (k === '-') { cambiaGrosor(-1); return true; }
    if (K === 'N') { empiezaNota(60, 630); return true; }
    if (K === 'Z') { deshaz(); return true; }
    if (k === 'Delete' || k === 'Supr') { if (e.shiftKey) borraTodo(); else borraTuyo(); return true; }
    return false;
  },
  async esc() {
    if (piz.escribiendo) return;
    cambia('ocupado');
    await Promise.all(Object.keys(herr).map(k => aLaBandeja(k, 520)));
    piz.herramienta = 'azul'; piz.punta.set(0, 0, 0); sueltaFoco(); cambia('libre'); bus.emit('vuelve');
  }
});
let notaUlt = 0;
function corrPizarra(dt) {
  if (gesto.estado === 'nota') { const t = performance.now(); if (t - notaUlt > 120) { notaUlt = t; pintaNota(t); } return; }
  if (gesto.estado !== 'pizarra' || piz.escribiendo) return;
  if (piz.punta.lengthSq() > 0) herramientaA(piz.punta, dt);
}
