/* ===================== 12b · usos: un uso para cada mueble (E59-8 a 13) =====================
   v0.2.4 (5 nov 2026). Decidido por Sergio en la ronda (bocetos 02 y 03 de material/v0.2.4/):
   · el MÓVIL con M desde cualquier sitio y seis apps (Linterna, Cámara, Estudio, Web, Mapa, Ajustes). La pausa de 5
     minutos se quita (no hacía nada en el cuarto): la sustituye Estudio. Las novedades avisan de lo nuevo desde tu visita;
   · el ZAPATERO se abre y el DualSense pone en la tele «Caza de bugs», un arcade de dos palancas (Sergio: «¿puede ser un
     juego más divertido?» que la serpiente), también con un mando de verdad (Gamepad API);
   · el ALTILLO guarda la caja de las versiones del cuarto y una cápsula del tiempo;
   · la MESITA: los recuerdos de 1º abren su asignatura y la libreta se escribe;
   · el CAJÓN de la mesa: la calculadora funciona y los pósits se escriben y se pegan donde mires;
   · el CORCHO: cada foto y entrada viene a la vista para leerla;
   · los CUADROS: una actividad secreta (el cuadro torcido, la caja fuerte y el primer trofeo).
   Lo que se escribe o se gana se guarda en este navegador (guardado), sin cuentas. */

/* ---------- utilidades de los papeles que se escriben ---------- */
// lo que se teclea en un papel: letras, números y signos; Retroceso borra; devuelve si la tecla era de escribir
function teclea(e, texto, max) {
  if (e.key === 'Backspace') return { t: texto.slice(0, -1), ok: true };
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) return { t: (texto + e.key).slice(0, max), ok: true };
  return { t: texto, ok: false };
}
const hoyISO = () => isoDe(hoyCanarias());

/* =====================================================================================================
   EL MÓVIL (E59-12, 13): M desde cualquier sitio; seis apps
   ===================================================================================================== */
const TEL = { W: 360, H: 720 };
const APPS_MOVIL = [['linterna', 'Linterna'], ['camara', 'Cámara'], ['estudio', 'Estudio'], ['web', 'Web'], ['mapa', 'Mapa'], ['ajustes', 'Ajustes']];
const linterna = { on: false };
const estudio = { fase: 'parado', fin: 0, flexoAntes: null, techoAntes: null };   // parado · estudio (25 min) · descanso (5 min)
const fotoMovil = { img: null, n: 0 };
// lo nuevo de la web desde tu última visita: lo publicado de la agenda con fecha posterior a la visita anterior
const ultimaVisita = guardado.get('ultima-visita', null);
guardado.set('ultima-visita', isoDe(hoyCanarias()));
function loNuevo() {
  const pub = AGENDA.filter(a => a[2] && publicado(a[0])).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  return { lista: pub.slice(0, 6), nuevos: ultimaVisita ? pub.filter(a => a[0] > ultimaVisita) : [] };
}
function icoApp(c, k, x, y, s) {
  c.fillStyle = '#2E2A42'; rr(c, x, y, s, s, s * 0.24); c.fill();
  const cx = x + s / 2, cy = y + s / 2, u = s / 44; c.lineWidth = 2.2 * u; c.strokeStyle = '#FAFAF7'; c.lineCap = 'round'; c.lineJoin = 'round';
  const K = '#FF6B4A';
  c.beginPath();
  if (k === 'linterna') { c.moveTo(cx - 7 * u, cy - 12 * u); c.lineTo(cx + 7 * u, cy - 12 * u); c.lineTo(cx + 4 * u, cy - 3 * u); c.lineTo(cx + 4 * u, cy + 12 * u); c.lineTo(cx - 4 * u, cy + 12 * u); c.lineTo(cx - 4 * u, cy - 3 * u); c.closePath(); c.stroke(); c.strokeStyle = linterna.on ? '#F5C06B' : K; c.beginPath(); c.moveTo(cx, cy - 19 * u); c.lineTo(cx, cy - 15 * u); c.stroke(); }
  if (k === 'camara') { rr(c, cx - 13 * u, cy - 8 * u, 26 * u, 18 * u, 3 * u); c.stroke(); c.strokeStyle = K; c.beginPath(); c.arc(cx, cy + u, 5 * u, 0, Math.PI * 2); c.stroke(); }
  if (k === 'estudio') { c.arc(cx, cy + 2 * u, 11 * u, 0, Math.PI * 2); c.stroke(); c.strokeStyle = K; c.beginPath(); c.moveTo(cx, cy + 2 * u); c.lineTo(cx, cy - 5 * u); c.stroke(); c.strokeStyle = '#FAFAF7'; c.beginPath(); c.moveTo(cx - 4 * u, cy - 13 * u); c.lineTo(cx + 4 * u, cy - 13 * u); c.stroke(); }
  if (k === 'web') { c.arc(cx, cy, 11 * u, 0, Math.PI * 2); c.stroke(); c.strokeStyle = K; c.beginPath(); c.moveTo(cx - 11 * u, cy); c.lineTo(cx + 11 * u, cy); c.moveTo(cx, cy - 11 * u); c.bezierCurveTo(cx - 7 * u, cy - 5 * u, cx - 7 * u, cy + 5 * u, cx, cy + 11 * u); c.bezierCurveTo(cx + 7 * u, cy + 5 * u, cx + 7 * u, cy - 5 * u, cx, cy - 11 * u); c.stroke(); }
  if (k === 'mapa') { c.moveTo(cx - 12 * u, cy - 9 * u); c.lineTo(cx - 4 * u, cy - 12 * u); c.lineTo(cx + 4 * u, cy - 9 * u); c.lineTo(cx + 12 * u, cy - 12 * u); c.lineTo(cx + 12 * u, cy + 9 * u); c.lineTo(cx + 4 * u, cy + 12 * u); c.lineTo(cx - 4 * u, cy + 9 * u); c.lineTo(cx - 12 * u, cy + 12 * u); c.closePath(); c.stroke(); c.fillStyle = K; c.beginPath(); c.arc(cx + 3 * u, cy - u, 2.5 * u, 0, Math.PI * 2); c.fill(); }
  if (k === 'ajustes') { for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; c.moveTo(cx + 9 * u * Math.cos(a), cy + 9 * u * Math.sin(a)); c.lineTo(cx + 13 * u * Math.cos(a), cy + 13 * u * Math.sin(a)); } c.stroke(); c.strokeStyle = K; c.beginPath(); c.arc(cx, cy, 6 * u, 0, Math.PI * 2); c.stroke(); }
}
// una zona que se toca: se guarda para el clic, el teclado y el punto
function zonaTel(x, y, w, h, accion, etiqueta) { movil.zonas.push({ x, y, w, h, accion, etiqueta }); }
function cabeceraApp(c, titulo) {
  c.fillStyle = '#A99EF5'; c.font = '600 22px ' + BODY; c.fillText('‹ Inicio', 22, 92); zonaTel(10, 62, 140, 44, () => abreApp(null), 'Volver al inicio');
  c.fillStyle = '#FAFAF7'; c.font = '600 34px ' + DISP; c.fillText(titulo, 22, 146);
}
function boton(c, x, y, w, h, texto, accion, etiqueta, activo = false) {
  c.fillStyle = activo ? '#FF6B4A' : 'rgba(232,230,245,.1)'; rr(c, x, y, w, h, 16); c.fill();
  c.fillStyle = activo ? '#141221' : '#FAFAF7'; c.font = '600 22px ' + BODY; c.textAlign = 'center'; cabe(c, texto, x + w / 2, y + h / 2 + 8, w - 20, 22, '600', BODY); c.textAlign = 'left';
  zonaTel(x, y, w, h, accion, etiqueta || texto);
}
function mmss(ms) { ms = Math.max(0, ms); return Math.floor(ms / 60000) + ':' + String(Math.floor(ms / 1000) % 60).padStart(2, '0'); }
function dibujaMovil() {
  const c = movilTex.userData.g, { W, H } = TEL; movil.zonas = [];
  c.fillStyle = '#141221'; c.fillRect(0, 0, W, H);
  if (!movil.abierto) { c.fillStyle = 'rgba(201,197,220,.06)'; c.fillRect(0, 0, W, H); movilTex.needsUpdate = true; return; }
  c.fillStyle = '#C9C5DC'; c.font = '600 18px ' + BODY; c.fillText(horaTexto(), 22, 36);
  c.textAlign = 'right'; c.fillText(linterna.on ? 'linterna' : '', W - 64, 36); c.textAlign = 'left';
  c.strokeStyle = '#C9C5DC'; c.lineWidth = 2; c.strokeRect(W - 52, 22, 30, 15); c.fillStyle = '#5BD39A'; c.fillRect(W - 49, 25, 20, 9);
  const app = movil.app;
  if (!app) {
    c.fillStyle = '#E8E6F5'; c.font = '600 74px ' + DISP; c.textAlign = 'center'; c.fillText(horaTexto(), W / 2, 150);
    const t = horaReal(); c.font = '500 19px ' + BODY; c.fillStyle = '#C9C5DC'; c.fillText(['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][new Date(t.y, t.m - 1, t.d).getDay()] + ' ' + t.d + ' ' + MESES[t.m - 1] + ' · Canarias', W / 2, 184); c.textAlign = 'left';
    const { lista, nuevos } = loNuevo(), n = nuevos[0] || lista[0];
    if (n) {
      c.fillStyle = 'rgba(232,230,245,.09)'; rr(c, 18, 210, W - 36, 84, 16); c.fill();
      c.fillStyle = '#F5C06B'; c.font = '600 15px ' + BODY; c.fillText(nuevos.length ? 'Nuevo en la web desde tu visita' + (nuevos.length > 1 ? ' (' + nuevos.length + ')' : '') : 'Lo último en la web', 34, 240);
      c.fillStyle = '#FAFAF7'; cabe(c, n[1], 34, 274, W - 70, 20, '500', BODY); zonaTel(18, 210, W - 36, 84, () => window.open(n[2], '_blank', 'noopener'), 'Abrir: ' + n[1]);
    }
    if (estudio.fase !== 'parado') { c.fillStyle = '#FF9B80'; c.font = '600 17px ' + BODY; c.textAlign = 'center'; c.fillText((estudio.fase === 'estudio' ? 'Estudiando · ' : 'Descanso · ') + mmss(estudio.fin - Date.now()), W / 2, 326); c.textAlign = 'left'; }
    APPS_MOVIL.forEach(([k, nombre], i) => {
      const s = 78, x = 32 + (i % 3) * 110, y = 352 + Math.floor(i / 3) * 128;
      icoApp(c, k, x + 4, y, s); c.fillStyle = '#E8E6F5'; c.font = '500 17px ' + BODY; c.textAlign = 'center'; c.fillText(nombre, x + 4 + s / 2, y + s + 26); c.textAlign = 'left';
      zonaTel(x - 6, y - 8, s + 20, s + 44, () => abreApp(k), nombre);
    });
    c.fillStyle = '#8E8AA3'; c.font = '500 15px ' + BODY; c.textAlign = 'center'; c.fillText(movil.enMano ? 'M o Esc: guardarlo' : 'Esc: levantarte', W / 2, H - 34); c.textAlign = 'left';
  } else if (app === 'linterna') {
    cabeceraApp(c, 'Linterna');
    const cx = W / 2, cy = 380; c.fillStyle = linterna.on ? '#F5C06B' : 'rgba(232,230,245,.1)'; c.beginPath(); c.arc(cx, cy, 104, 0, Math.PI * 2); c.fill();
    c.fillStyle = linterna.on ? '#141221' : '#FAFAF7'; c.font = '600 30px ' + DISP; c.textAlign = 'center'; c.fillText(linterna.on ? 'Encendida' : 'Apagada', cx, cy + 10); c.textAlign = 'left';
    zonaTel(cx - 110, cy - 110, 220, 220, () => alternaLinterna(), linterna.on ? 'Apagar la linterna' : 'Encender la linterna');
    c.fillStyle = '#C9C5DC'; c.font = '500 17px ' + BODY; wrap(c, 'Alumbra hacia donde miras. Con el estor bajado y la luz apagada, se nota de verdad. Tecla F: también.', 28, 540, W - 56, 24);
  } else if (app === 'camara') {
    cabeceraApp(c, 'Cámara');
    c.fillStyle = '#07060C'; rr(c, 22, 176, W - 44, 196, 12); c.fill();
    if (fotoMovil.img) c.drawImage(fotoMovil.img, 22, 176, W - 44, 196); else { c.fillStyle = '#8E8AA3'; c.font = '500 17px ' + BODY; c.textAlign = 'center'; c.fillText('Aún no hay fotos', W / 2, 280); c.textAlign = 'left'; }
    boton(c, W / 2 - 60, 404, 120, 120, '', () => hazFoto(), 'Hacer una foto del cuarto');
    c.strokeStyle = '#FAFAF7'; c.lineWidth = 5; c.beginPath(); c.arc(W / 2, 464, 44, 0, Math.PI * 2); c.stroke(); c.fillStyle = '#FF6B4A'; c.beginPath(); c.arc(W / 2, 464, 34, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#C9C5DC'; c.font = '500 17px ' + BODY; wrap(c, 'Guarda el móvil y hace una foto de lo que miras; se descarga en PNG (' + fotoMovil.n + ' en esta visita).', 28, 572, W - 56, 24);
  } else if (app === 'estudio') {
    cabeceraApp(c, 'Estudio');
    const cx = W / 2, cy = 350, R = 110, resta = estudio.fase === 'parado' ? 25 * 60000 : estudio.fin - Date.now(), total = estudio.fase === 'descanso' ? 5 * 60000 : 25 * 60000;
    c.lineWidth = 14; c.strokeStyle = 'rgba(255,107,74,.2)'; c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.stroke();
    if (estudio.fase !== 'parado') { c.strokeStyle = estudio.fase === 'estudio' ? '#FF6B4A' : '#5BD39A'; c.beginPath(); c.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(resta / total, 0, 1)); c.stroke(); }
    c.fillStyle = '#FAFAF7'; c.font = '600 50px ' + MONO; c.textAlign = 'center'; c.fillText(mmss(resta), cx, cy + 16);
    c.font = '500 18px ' + BODY; c.fillStyle = '#C9C5DC'; c.fillText(estudio.fase === 'parado' ? '25 min de estudio + 5 de descanso' : estudio.fase === 'estudio' ? 'Estudiando' : 'Descanso', cx, cy + 56); c.textAlign = 'left';
    boton(c, 40, 500, W - 80, 64, estudio.fase === 'parado' ? 'Empezar' : 'Parar', () => alternaEstudio(), estudio.fase === 'parado' ? 'Empezar a estudiar 25 minutos' : 'Parar el estudio', estudio.fase === 'parado');
    c.fillStyle = '#C9C5DC'; c.font = '500 16px ' + BODY; wrap(c, 'Al empezar, el flexo se enciende y la luz de techo se apaga. Al acabar, el móvil vibra y la luz parpadea.', 28, 610, W - 56, 22);
  } else if (app === 'web') {
    cabeceraApp(c, 'Web');
    const { lista, nuevos } = loNuevo();
    lista.forEach(([f, t, url], i) => {
      const y = 176 + i * 82; c.fillStyle = 'rgba(232,230,245,.08)'; rr(c, 18, y, W - 36, 72, 14); c.fill();
      c.fillStyle = '#F5C06B'; c.font = '600 14px ' + MONO; c.fillText(fechaCorta(f) + (nuevos.some(n => n[0] === f && n[1] === t) ? '  · nuevo' : ''), 32, y + 26);
      c.fillStyle = '#FAFAF7'; cabe(c, t, 32, y + 54, W - 90, 18, '500', BODY); c.fillStyle = '#A99EF5'; c.font = '600 20px ' + BODY; c.fillText('›', W - 44, y + 46);
      zonaTel(18, y, W - 36, 72, () => window.open(url, '_blank', 'noopener'), 'Abrir: ' + t);
    });
    if (!lista.length) { c.fillStyle = '#C9C5DC'; c.font = '500 17px ' + BODY; c.fillText('Nada publicado todavía.', 28, 200); }
  } else if (app === 'mapa') {
    cabeceraApp(c, 'Mapa');
    const S = 76, ox = (W - (SALA.x1 - SALA.x0) * S) / 2, oy = 178, X = x => ox + (x - SALA.x0) * S, Z = z => oy + (z - SALA.z0) * S;
    c.fillStyle = '#2B2740'; c.fillRect(X(SALA.x0), Z(SALA.z0), (SALA.x1 - SALA.x0) * S, (SALA.z1 - SALA.z0) * S); c.fillRect(X(PASILLO.x0), Z(PASILLO.z0), (PASILLO.x1 - PASILLO.x0) * S, (PASILLO.z1 - PASILLO.z0) * S);
    c.fillStyle = '#A99EF5'; c.fillRect(X(VENTANA.x0), Z(SALA.z0) - 4, (VENTANA.x1 - VENTANA.x0) * S, 4);
    c.fillStyle = 'rgba(201,197,220,.35)'; OBSTACULOS.forEach(([, x0, x1, z0, z1]) => c.fillRect(X(x0), Z(z0), (x1 - x0) * S, (z1 - z0) * S));
    c.fillStyle = '#FF6B4A'; c.beginPath(); c.arc(X(jug.pos.x), Z(jug.pos.z), 7, 0, Math.PI * 2); c.fill();
    Object.entries(PUNTOS).forEach(([k, P]) => {
      const x = X(P.pos[0]), y = Z(P.pos[1]); c.fillStyle = '#FAFAF7'; c.beginPath(); c.arc(x, y, 5, 0, Math.PI * 2); c.fill();
      c.font = '500 12px ' + BODY; c.fillStyle = '#E8E6F5'; c.fillText(P.nombre.replace(/^(la|el) /, ''), x + 8, y + 4);
      zonaTel(x - 18, y - 18, 36, 36, () => vaDesdeMapa(k), 'Ir a ' + P.nombre);
    });
  } else if (app === 'ajustes') {
    cabeceraApp(c, 'Ajustes');
    const filas = [
      ['Controles', control.modo === 'juego' ? 'Juego' : 'Clásico', () => ponControles(control.modo === 'juego' ? 'clasico' : 'juego'), PL_OK ? 'ratón capturado o cursor' : 'este navegador: solo clásico'],
      ['Sensibilidad', SENS.nivel + ' de 5', () => cambiaSensibilidad(SENS.nivel >= 5 ? -4 : 1), 'toca para cambiarla'],
      ['Reducir movimiento', reduced ? 'Sí' : 'No', () => { reduced = !reduced; guardado.set('reducir', reduced); }, 'sin balanceo ni suavizados'],
      ['Panel de fps', panelFps ? 'Sí' : 'No', () => alternaPanelFps(), 'para probar el rendimiento']
    ];
    filas.forEach(([n, v, fn, sub], i) => {
      const y = 176 + i * 96; c.fillStyle = 'rgba(232,230,245,.08)'; rr(c, 18, y, W - 36, 84, 14); c.fill();
      c.fillStyle = '#FAFAF7'; c.font = '600 20px ' + BODY; c.fillText(n, 34, y + 36); c.fillStyle = '#8E8AA3'; c.font = '500 14px ' + BODY; c.fillText(sub, 34, y + 62);
      c.fillStyle = '#FF9B80'; c.font = '600 19px ' + BODY; c.textAlign = 'right'; c.fillText(v, W - 34, y + 48); c.textAlign = 'left';
      zonaTel(18, y, W - 36, 84, () => { fn(); dibujaMovil(); }, n + ': ' + v);
    });
    c.fillStyle = '#8E8AA3'; c.font = '500 14px ' + MONO; c.fillText(NOMBRE + ' · ' + VERSION, 28, H - 40);
  }
  // el foco del teclado: un anillo alrededor de la zona elegida
  if (teclado.activo || movil.selVisible) { const z = movil.zonas[movil.sel % Math.max(1, movil.zonas.length)]; if (z) { c.strokeStyle = '#FF6B4A'; c.lineWidth = 4; rr(c, z.x, z.y, z.w, z.h, 14); c.stroke(); } }
  movilTex.needsUpdate = true;
}
function abreApp(k) { movil.app = k; movil.sel = 0; dibujaMovil(); anuncia(k ? APPS_MOVIL.find(a => a[0] === k)[1] + '.' + (k === 'mapa' ? ' Toca un sitio y vas.' : '') : 'Inicio del móvil.'); }
function telUV() { raycaster.setFromCamera(ndc, camera); const h = raycaster.intersectObject(movilPantalla)[0]; return h && h.uv ? [h.uv.x * TEL.W, (1 - h.uv.y) * TEL.H] : null; }
function telZona() { const p = telUV(); if (!p) return null; return movil.zonas.find(z => p[0] >= z.x && p[0] <= z.x + z.w && p[1] >= z.y && p[1] <= z.y + z.h) || null; }
function telPunto() { const z = telZona(); return z ? ['mano', z.etiqueta] : ['punto']; }
function telClic() { const z = telZona(); if (z) { movil.selVisible = false; z.accion(); dibujaMovil(); } }
function telTecla(e) {
  const n = movil.zonas.length; if (!n) return false;
  if (['ArrowDown', 'ArrowRight', 'Tab'].includes(e.key) && !(e.key === 'Tab' && e.shiftKey)) { movil.sel = (movil.sel + 1) % n; movil.selVisible = true; dibujaMovil(); anuncia(movil.zonas[movil.sel].etiqueta); return true; }
  if (['ArrowUp', 'ArrowLeft'].includes(e.key) || (e.key === 'Tab' && e.shiftKey)) { movil.sel = (movil.sel - 1 + n) % n; movil.selVisible = true; dibujaMovil(); anuncia(movil.zonas[movil.sel].etiqueta); return true; }
  if (e.key === 'Enter' || e.key === ' ') { const z = movil.zonas[movil.sel % n]; if (z) { z.accion(); dibujaMovil(); } return true; }
  if (e.key === 'Backspace' && movil.app) { abreApp(null); return true; }
  if ((e.key === 'f' || e.key === 'F')) { alternaLinterna(); dibujaMovil(); return true; }
  return false;
}
// sacar el móvil (M): sube del bolsillo a la mano, delante de la cara; guardarlo (M o Esc): baja y vuelve a la mesita
const _telP = new THREE.Vector3(), _telQ = new THREE.Quaternion();
function poseMovil(p, q, bajo = 0) {
  camera.getWorldDirection(_v); const ab = v3(0, -1, 0).applyQuaternion(camera.quaternion), der = v3(1, 0, 0).applyQuaternion(camera.quaternion);
  p.copy(camera.position).addScaledVector(_v, 0.27).addScaledVector(ab, 0.015 + bajo).addScaledVector(der, 0.0);
  q.copy(camera.quaternion).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0.12, 0, 0)));
}
async function sacaMovil() {
  if (gesto.estado !== 'libre') return;
  cambia('ocupado'); setHover(null);
  movil.abierto = true; movil.enMano = true; movil.app = null; movil.sel = 0; dibujaMovil();
  scene.attach(movilG);
  const p0 = new THREE.Vector3(), q0 = new THREE.Quaternion(); poseMovil(p0, q0, 0.3);
  movilG.position.copy(p0); movilG.quaternion.copy(q0);
  await anim(reduced ? 1 : 380, e => { poseMovil(_telP, _telQ, 0.3 * (1 - e)); movilG.position.copy(_telP); movilG.quaternion.copy(_telQ); }, curva.sale);
  cambia('movil');
  anuncia('El móvil: Linterna, Cámara, Estudio, Web, Mapa y Ajustes. Flechas e Intro, o clic. M o Esc para guardarlo.');
}
async function guardaMovil(sinVolver = false) {
  if (!movil.enMano) return;
  cambia('ocupado');
  await anim(reduced ? 1 : 300, e => { poseMovil(_telP, _telQ, 0.3 * e); movilG.position.copy(_telP); movilG.quaternion.copy(_telQ); }, curva.entra);
  movil.abierto = false; movil.enMano = false; dibujaMovil();
  movilG.position.copy(MOVIL_CASA.pos); movilG.rotation.copy(MOVIL_CASA.rot);    // vuelve a la mesita (sin que se vea)
  if (!sinVolver) { cambia('libre'); devuelveFoco('movil'); }
}
function alternaMovil() { if (gesto.estado === 'movil') return guardaMovil(); return sacaMovil(); }
modo('movil', {
  punto: () => telPunto(), move() { actualizaPunto(); }, up() { telClic(); },
  tecla(e) { if (e.key === 'm' || e.key === 'M') { guardaMovil(); return true; } return telTecla(e); },
  esc() { if (movil.app) { abreApp(null); return; } guardaMovil(); }
});
function corrMovilEnMano() { if (gesto.estado === 'movil' && movil.enMano) { poseMovil(_telP, _telQ); movilG.position.lerp(_telP, 0.5); movilG.quaternion.slerp(_telQ, 0.5); } }
async function vaDesdeMapa(k) {
  if (gesto.estado === 'cama') { await modos.cama.esc(); } else await guardaMovil(true);
  cambia('libre');
  if (k === 'silla') { clicEn(objetos.get('silla'), null, null); return; }
  irA(k);
}
// la linterna: el foco de la mano (el mismo que ilumina lo que inspeccionas) se enciende hacia donde miras
function alternaLinterna() { linterna.on = !linterna.on; anuncia(linterna.on ? 'Linterna encendida.' : 'Linterna apagada.'); }
// la cámara: una foto de lo que se ve (sin el móvil), que se descarga en PNG y se queda en el móvil
async function hazFoto() {
  const enMano = movil.enMano; if (enMano) await guardaMovil(true); else cambia('ocupado');
  const antes = punto.el.style.visibility; punto.el.style.visibility = 'hidden';
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL('image/png');
  punto.el.style.visibility = antes;
  const img = new Image(); img.src = url; img.onload = () => { fotoMovil.img = img; };
  fotoMovil.n++;
  try { const a = document.createElement('a'); a.href = url; a.download = 'cuarto-de-sergio-' + hoyISO() + '-' + fotoMovil.n + '.png'; document.body.appendChild(a); a.click(); a.remove(); } catch (e) { /* sin descargas: la foto se queda en el móvil */ }
  if (!reduced) { const f = document.createElement('div'); f.style.cssText = 'position:fixed;inset:0;z-index:12;background:#FAFAF7;opacity:.85;pointer-events:none;transition:opacity .5s'; document.body.appendChild(f); requestAnimationFrame(() => { f.style.opacity = '0'; }); setTimeout(() => f.remove(), 600); }
  anuncia('Foto hecha: se descarga en PNG.');
  cambia('libre');
}
// Estudio: 25 minutos con el flexo encendido y la luz de techo apagada; después, 5 de descanso
function alternaEstudio() {
  if (estudio.fase !== 'parado') { terminaEstudio(true); return; }
  estudio.fase = 'estudio'; estudio.fin = Date.now() + 25 * 60000; estudio.flexoAntes = lamparaOn; estudio.techoAntes = luzTecho.on;
  if (!lamparaOn) interruptor(); if (luzTecho.on) alternaLuzTecho();
  anuncia('A estudiar: 25 minutos. El flexo se enciende y la luz de techo se apaga.');
}
function terminaEstudio(parado) {
  estudio.fase = 'parado';
  if (estudio.flexoAntes === false && lamparaOn) interruptor(); if (estudio.techoAntes && !luzTecho.on) alternaLuzTecho();
  anuncia(parado ? 'Estudio parado.' : 'Fin del descanso. Buen trabajo.');
}
function avisaFin() {
  movil.vibra = performance.now();
  const i0 = techo.intensity, f0 = lampLight.intensity;
  if (!reduced) anim(700, e => { const k = 0.4 + 0.6 * Math.abs(Math.cos(e * Math.PI * 2)); techo.intensity = i0 * k; lampLight.intensity = f0 * k; }).then(() => { techo.intensity = i0; lampLight.intensity = f0; });
}
function corrMovil(t) {
  if (estudio.fase !== 'parado' && Date.now() >= estudio.fin) {
    avisaFin();
    if (estudio.fase === 'estudio') { estudio.fase = 'descanso'; estudio.fin = Date.now() + 5 * 60000; anuncia('Fin de los 25 minutos: descanso de 5.'); }
    else terminaEstudio(false);
    if (movil.abierto) dibujaMovil();
  }
  if (movil.vibra && t - movil.vibra < 900 && !reduced) movilCuerpo.position.x = Math.sin(t / 18) * 0.002; else movilCuerpo.position.x = 0;
  if (movil.abierto && t - movil.ult > 250) { movil.ult = t; dibujaMovil(); }
  corrMovilEnMano();
}
dibujaMovil();

/* =====================================================================================================
   EL ZAPATERO Y «CAZA DE BUGS» (E59-8, decisión de Sergio: un juego más divertido)
   ===================================================================================================== */
function puertaZapatero(i, abrir) { const P = zapateroPuertas[i], a0 = P.abierta; P.abierta = abrir ? 1 : 0; return anim(reduced ? 1 : 600, e => { P.p.rotation.y = -P.s * 1.45 * lerp(a0, P.abierta, e); }, abrir ? curva.retroceso : curva.suave); }
zapateroPuertas.forEach((P, i) => registrar('zapatero-' + (i + 1), { nombre: 'Zapatero · ' + (i ? 'puerta de la derecha' : 'puerta de la izquierda'), mallas: [P.hoja, P.tirador], puntero: 'mano', lugar: 'zapatero', alcance: 1.7, brilloK: 0.35,
  alClic: () => { const abrir = !P.abierta; puertaZapatero(i, abrir); anuncia(abrir ? (i ? 'Dentro: la caja de los juegos. Coge el mando o la caja para jugar.' : 'Dentro: las zapatillas.') : 'Cierras el zapatero.'); } }));
registrar('caja-juegos', { nombre: 'Caja de los juegos · «Caza de bugs»', mallas: [cajaJuegos, ...juegosCajas], lugar: 'zapatero', alcance: 1.8, activo: () => gesto.estado === 'libre' && zapateroPuertas[1].abierta > 0.5, alClic: () => juegaBugs() });
// el juego: un arcade de dos palancas en la tele. Te mueves con WASD (o la palanca izquierda) y disparas con las
// flechas (o la derecha; R2 dispara hacia donde vas). Los bugs salen por los bordes y te persiguen; los grandes se
// parten en dos. El café da disparo rápido. Tres vidas. El récord se guarda.
const JB = { W: 960, H: 544, activo: false, fase: 'titulo', t: 0, ult: 0, pinta: 0, j: null, balas: [], bugs: [], cafes: [], chispas: [], puntos: 0, oleada: 0, vidas: 3, inv: 0, record: guardado.get('record-bugs', 0), teclas: new Set(), cad: 0, rapido: 0, temblor: 0, pad: null, dir: [1, 0] };
function nuevaPartida() {
  Object.assign(JB, { fase: 'juego', j: { x: JB.W / 2, y: JB.H / 2 }, balas: [], bugs: [], cafes: [], chispas: [], puntos: 0, oleada: 0, vidas: 3, inv: 1.5, cad: 0, rapido: 0 });
  siguienteOleada();
}
function siguienteOleada() {
  JB.oleada++;
  const n = 4 + JB.oleada * 2;
  for (let i = 0; i < n; i++) {
    const lado = Math.floor(Math.random() * 4), u = Math.random();
    const x = lado === 0 ? -20 : lado === 1 ? JB.W + 20 : u * JB.W, y = lado === 2 ? -20 : lado === 3 ? JB.H + 20 : u * JB.H;
    const tipo = Math.random() < Math.min(0.3, 0.06 * JB.oleada) ? 'grande' : Math.random() < 0.3 ? 'rapido' : 'normal';
    JB.bugs.push({ x, y, tipo, vida: tipo === 'grande' ? 3 : 1, r: tipo === 'grande' ? 22 : tipo === 'rapido' ? 10 : 14, v: (tipo === 'rapido' ? 120 : tipo === 'grande' ? 45 : 70) * (1 + JB.oleada * 0.06), fase: Math.random() * 6, espera: i * 0.25 });
  }
  if (JB.oleada > 1) anuncia('Oleada ' + JB.oleada + '.');
}
function leePad() {
  const pads = navigator.getGamepads ? [...navigator.getGamepads()].filter(Boolean) : []; const p = pads[0];
  if (!p) { JB.pad = null; return null; }
  const z = v => (Math.abs(v) < 0.18 ? 0 : v);
  JB.pad = { mx: z(p.axes[0] || 0), my: z(p.axes[1] || 0), dx: z(p.axes[2] || 0), dy: z(p.axes[3] || 0), r2: !!(p.buttons[7] && p.buttons[7].pressed), x: !!(p.buttons[0] && p.buttons[0].pressed), op: !!(p.buttons[9] && p.buttons[9].pressed) };
  return JB.pad;
}
function corrBugs(dt, t) {
  const pad = leePad();
  if (JB.fase !== 'juego') { if (pad && (pad.x || pad.op) && t - JB.ult > 400) { JB.ult = t; nuevaPartida(); } return; }
  const T = JB.teclas, j = JB.j;
  let mx = (T.has('d') ? 1 : 0) - (T.has('a') ? 1 : 0), my = (T.has('s') ? 1 : 0) - (T.has('w') ? 1 : 0);
  let dx = (T.has('arrowright') ? 1 : 0) - (T.has('arrowleft') ? 1 : 0), dy = (T.has('arrowdown') ? 1 : 0) - (T.has('arrowup') ? 1 : 0);
  if (pad) { if (Math.abs(pad.mx) + Math.abs(pad.my) > 0) { mx = pad.mx; my = pad.my; } if (Math.abs(pad.dx) + Math.abs(pad.dy) > 0) { dx = pad.dx; dy = pad.dy; } }
  const nm = Math.hypot(mx, my); if (nm > 1) { mx /= nm; my /= nm; }
  if (nm > 0.1) JB.dir = [mx / Math.max(nm, 1e-6), my / Math.max(nm, 1e-6)];
  j.x = clamp(j.x + mx * 260 * dt, 16, JB.W - 16); j.y = clamp(j.y + my * 260 * dt, 16, JB.H - 16);
  const dispara = Math.hypot(dx, dy) > 0.2 || T.has(' ') || (pad && pad.r2);
  if (Math.hypot(dx, dy) < 0.2) { dx = JB.dir[0]; dy = JB.dir[1]; }
  JB.cad -= dt; JB.rapido -= dt; JB.inv -= dt; JB.temblor = Math.max(0, JB.temblor - dt * 3);
  if (dispara && JB.cad <= 0) { const n = Math.hypot(dx, dy) || 1; JB.balas.push({ x: j.x, y: j.y, vx: dx / n * 620, vy: dy / n * 620, vida: 1.2 }); JB.cad = JB.rapido > 0 ? 0.06 : 0.14; }
  JB.balas.forEach(b => { b.x += b.vx * dt; b.y += b.vy * dt; b.vida -= dt; });
  JB.balas = JB.balas.filter(b => b.vida > 0 && b.x > -10 && b.x < JB.W + 10 && b.y > -10 && b.y < JB.H + 10);
  for (const b of JB.bugs) {
    if (b.espera > 0) { b.espera -= dt; continue; }
    const ddx = j.x - b.x, ddy = j.y - b.y, d = Math.hypot(ddx, ddy) || 1; b.fase += dt * 12;
    const zig = b.tipo === 'rapido' ? Math.sin(b.fase * 0.5) * 0.6 : 0;   // los rápidos zigzaguean
    b.x += (ddx / d + (-ddy / d) * zig) * b.v * dt; b.y += (ddy / d + (ddx / d) * zig) * b.v * dt;
    for (const s of JB.balas) if (s.vida > 0 && Math.hypot(s.x - b.x, s.y - b.y) < b.r + 4) { s.vida = 0; b.vida--; b.golpe = 0.1; if (b.vida <= 0) break; }
    if (d < b.r + 12 && JB.inv <= 0) { JB.vidas--; JB.inv = 1.6; JB.temblor = 1; anuncia(JB.vidas > 0 ? 'Te ha picado un bug. Te quedan ' + JB.vidas + '.' : 'Fin de la partida.'); }
  }
  const nuevos = [];
  JB.bugs = JB.bugs.filter(b => {
    if (b.golpe) b.golpe -= dt;
    if (b.vida > 0) return true;
    JB.puntos += b.tipo === 'grande' ? 30 : b.tipo === 'rapido' ? 15 : 10;
    for (let k = 0; k < 8; k++) JB.chispas.push({ x: b.x, y: b.y, vx: (Math.random() - 0.5) * 300, vy: (Math.random() - 0.5) * 300, vida: 0.4 });
    if (b.tipo === 'grande') [-1, 1].forEach(s => nuevos.push({ x: b.x + s * 12, y: b.y, tipo: 'normal', vida: 1, r: 12, v: 90, fase: 0, espera: 0 }));
    if (Math.random() < 0.08) JB.cafes.push({ x: b.x, y: b.y, vida: 6 });
    return false;
  });
  JB.bugs.push(...nuevos);
  JB.cafes = JB.cafes.filter(c => { c.vida -= dt; if (Math.hypot(c.x - j.x, c.y - j.y) < 22) { JB.rapido = 5; anuncia('Café: disparo rápido.'); return false; } return c.vida > 0; });
  JB.chispas.forEach(s => { s.x += s.vx * dt; s.y += s.vy * dt; s.vida -= dt; }); JB.chispas = JB.chispas.filter(s => s.vida > 0);
  if (!JB.bugs.length) siguienteOleada();
  if (JB.vidas <= 0) { JB.fase = 'fin'; if (JB.puntos > JB.record) { JB.record = JB.puntos; guardado.set('record-bugs', JB.record); } }
}
function dibujaBug(c, b, t) {
  const r = b.r, a = JB.j && JB.fase === 'juego' ? Math.atan2(JB.j.y - b.y, JB.j.x - b.x) : -Math.PI / 2;
  c.save(); c.translate(b.x, b.y); c.rotate(a + Math.PI / 2);
  c.strokeStyle = '#1E1B2E'; c.lineWidth = 2;
  for (let k = -1; k <= 1; k++) [-1, 1].forEach(s => { const w = Math.sin(b.fase + k) * 3; c.beginPath(); c.moveTo(s * r * 0.5, k * r * 0.4); c.lineTo(s * (r + 6), k * r * 0.5 + w); c.stroke(); });
  c.fillStyle = b.golpe > 0 ? '#FAFAF7' : b.tipo === 'grande' ? '#C2362B' : b.tipo === 'rapido' ? '#F5C06B' : '#5BD39A';
  c.beginPath(); c.ellipse(0, 0, r * 0.7, r, 0, 0, Math.PI * 2); c.fill(); c.stroke();
  c.fillStyle = '#1E1B2E'; c.beginPath(); c.arc(0, -r * 0.9, r * 0.38, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.moveTo(0, -r); c.lineTo(0, r * 0.9); c.stroke();
  c.beginPath(); c.moveTo(-3, -r * 1.2); c.lineTo(-r * 0.5, -r * 1.7); c.moveTo(3, -r * 1.2); c.lineTo(r * 0.5, -r * 1.7); c.stroke();
  c.restore();
}
function dibujaBugs(t) {
  const c = teleTex.userData.g, { W, H } = JB;
  c.save();
  if (JB.temblor > 0 && !reduced) c.translate((Math.random() - 0.5) * 8 * JB.temblor, (Math.random() - 0.5) * 8 * JB.temblor);
  c.fillStyle = '#141221'; c.fillRect(-10, -10, W + 20, H + 20);
  c.strokeStyle = 'rgba(169,158,245,.07)'; c.lineWidth = 1; for (let x = 0; x < W; x += 32) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); } for (let y = 0; y < H; y += 32) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
  if (JB.fase === 'titulo' || JB.fase === 'fin') {
    c.fillStyle = '#FAFAF7'; c.font = '600 64px ' + DISP; c.textAlign = 'center'; c.fillText(JB.fase === 'fin' ? 'Fin de la partida' : 'Caza de bugs', W / 2, 150);
    c.font = '500 26px ' + BODY; c.fillStyle = '#C9C5DC';
    if (JB.fase === 'fin') { c.fillText(JB.puntos + ' puntos · oleada ' + JB.oleada, W / 2, 210); c.fillStyle = '#F5C06B'; c.fillText(JB.puntos >= JB.record && JB.puntos > 0 ? '¡Récord nuevo!' : 'Récord: ' + JB.record, W / 2, 252); }
    else { c.fillText('Los bugs se comen el código. Que no te piquen.', W / 2, 206); c.fillStyle = '#F5C06B'; c.fillText('Récord: ' + JB.record, W / 2, 246); }
    c.fillStyle = '#E8E6F5'; c.font = '500 22px ' + BODY;
    ['Moverte: W A S D · palanca izquierda', 'Disparar: flechas · palanca derecha · R2', 'El café: disparo rápido · los rojos se parten'].forEach((l, i) => c.fillText(l, W / 2, 316 + i * 36));
    c.fillStyle = '#FF6B4A'; c.font = '600 28px ' + BODY; c.fillText('Intro, clic o X para ' + (JB.fase === 'fin' ? 'otra partida' : 'empezar') + ' · Esc: salir', W / 2, 464);
    c.textAlign = 'left';
    for (let k = 0; k < 3; k++) dibujaBug(c, { x: 160 + k * 320, y: 500, r: 12, tipo: ['normal', 'rapido', 'grande'][k], fase: t / 120 + k }, t);
  } else {
    JB.cafes.forEach(cf => { c.fillStyle = '#FF6B4A'; rr(c, cf.x - 9, cf.y - 10, 18, 20, 4); c.fill(); c.strokeStyle = '#FF6B4A'; c.lineWidth = 3; c.beginPath(); c.arc(cf.x + 11, cf.y, 5, -Math.PI / 2, Math.PI / 2); c.stroke(); });
    JB.bugs.forEach(b => { if (b.espera <= 0) dibujaBug(c, b, t); });
    c.fillStyle = JB.rapido > 0 ? '#F5C06B' : '#FF9B80'; JB.balas.forEach(b => { c.beginPath(); c.arc(b.x, b.y, 4, 0, Math.PI * 2); c.fill(); });
    JB.chispas.forEach(s => { c.fillStyle = 'rgba(91,211,154,' + (s.vida / 0.4) + ')'; c.fillRect(s.x, s.y, 3, 3); });
    const j = JB.j, a = Math.atan2(JB.dir[1], JB.dir[0]);
    if (JB.inv <= 0 || Math.floor(t / 90) % 2) { c.save(); c.translate(j.x, j.y); c.rotate(a); c.fillStyle = '#A99EF5'; c.beginPath(); c.moveTo(16, 0); c.lineTo(-11, -11); c.lineTo(-6, 0); c.lineTo(-11, 11); c.closePath(); c.fill(); c.strokeStyle = '#FAFAF7'; c.lineWidth = 2; c.stroke(); c.restore(); }
    c.fillStyle = '#FAFAF7'; c.font = '600 26px ' + MONO; c.fillText(String(JB.puntos).padStart(5, '0'), 24, 40);
    c.fillStyle = '#C9C5DC'; c.font = '500 18px ' + BODY; c.fillText('oleada ' + JB.oleada + ' · récord ' + JB.record + (JB.pad ? ' · mando conectado' : ''), 24, 66);
    for (let k = 0; k < 3; k++) { c.fillStyle = k < JB.vidas ? '#FF6B4A' : 'rgba(255,107,74,.2)'; rr(c, W - 40 - k * 30, 22, 22, 22, 5); c.fill(); }
  }
  c.restore(); teleTex.needsUpdate = true;
}
async function juegaBugs() {
  cambia('ocupado'); setHover(null); mirarDesde = 'mando';
  JB.activo = true; JB.fase = 'titulo'; JB.teclas.clear();      // antes de encender: la tele ya sale con el título del juego
  if (!tele.on) enciendeTele(true);
  dibujaBugs(performance.now());
  const lejos = ojos().distanceTo(v3(1.02, 1.5, 2.8)) > 2.8;
  if (lejos || jug.sentado || enSillon.si) { if (enSillon.si) await levantaDelSillon(); await irA('tele'); cambia('ocupado'); }
  enfoca(v3(1.02, 1.5, 2.8), ojos(), 46, { paralaje: 0, rate: 3.5 });
  await espera(reduced ? 0 : 450);
  JB.activo = true; JB.fase = 'titulo'; JB.teclas.clear(); dibujaBugs(performance.now());
  cambia('tv'); anuncia('Caza de bugs, en la tele. W A S D para moverte y las flechas para disparar; también con un mando. Intro para empezar. Esc para salir.');
}
const TECLAS_JB = new Set(['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ']);
modo('tv', {
  punto: () => ['punto'],
  up() { if (JB.fase !== 'juego') nuevaPartida(); },
  tecla(e) {
    const k = e.key.toLowerCase();
    if (TECLAS_JB.has(k)) { JB.teclas.add(k); return true; }
    if (e.key === 'Enter' && JB.fase !== 'juego') { nuevaPartida(); anuncia('¡A cazar! Oleada 1.'); return true; }
    return false;
  },
  esc() { JB.activo = false; JB.fase = 'titulo'; JB.teclas.clear(); enciendeTele(false); sueltaFoco(); cambia('libre'); devuelveFoco('mando'); anuncia('Apagas la tele. Récord: ' + JB.record + '.'); }
});
addEventListener('keyup', e => { JB.teclas.delete(e.key.toLowerCase()); });
// el mando de la PS5 ya no enciende el «próximamente»: pone el juego
objetos.get('mando').alClic = () => juegaBugs();
objetos.get('tele').alClic = () => juegaBugs();
objetos.get('mando').nombre = 'DualSense · jugar a «Caza de bugs»';
objetos.get('tele').nombre = 'Tele · «Caza de bugs»';
function corrJuego(dt, t) {
  if (!JB.activo) return;
  corrBugs(dt, t);
  if (t - JB.pinta > 33) { JB.pinta = t; dibujaBugs(t); }   // la textura, 30 veces por segundo (subirla cuesta)
}

/* =====================================================================================================
   EL ALTILLO (E59-8): la caja de las versiones y la cápsula del tiempo
   ===================================================================================================== */
const VERSIONES = [
  ['v0.1', '3 nov', 'Formas sencillas, cámara fija que sigue al ratón.', 'v0.1-3d-frente'],
  ['v0.2', '4 nov', 'Sin botones: coger, girar, arrastrar y soltar.', 'v0.2-3d-frente'],
  ['v0.2.1', '4 nov', 'La ventana con la hora de Canarias.', 'v0.2.1-3d-frente'],
  ['v0.2.2', '4 nov', 'El cuarto desde la foto; ya se camina.', 'v0.2.2-3d-frente'],
  ['v0.2.3', '5 nov', 'Inspirado y limpio: «El cuarto de Sergio».', 'v0.2.3-3d-el-cuarto-limpio'],
  ['v0.2.4', '5 nov', 'Controles de juego y un uso para cada cosa.', null]
];
const fotosVersiones = {};
Object.entries(FOTOS_VERSIONES).forEach(([k, b64]) => { const i = new Image(); i.onload = () => { if (gesto.estado === 'papel' && papel.dibuja === dibujaVersiones) rePapel(); }; i.src = 'data:image/jpeg;base64,' + b64; fotosVersiones[k] = i; });
function dibujaVersiones(c, w, h) {
  c.fillStyle = '#C9A67A'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(90,55,25,.12)'; for (let i = 0; i < 300; i++) c.fillRect((i * 97) % w, (i * 53) % h, 3, 2);
  c.fillStyle = '#2E2A42'; c.font = '700 54px ' + MANO; c.fillText('Las versiones del cuarto', 36, 70);
  const CW = (w - 36 * 2 - 2 * 22) / 3, CH = 280;
  VERSIONES.forEach(([v, f, t, foto], i) => {
    const col = i % 3, fila = Math.floor(i / 3), x = 36 + col * (CW + 22), y = 100 + fila * (CH + 24), giro = ((i * 37) % 7 - 3) * 0.012;
    c.save(); c.translate(x + CW / 2, y + CH / 2); c.rotate(giro); c.translate(-CW / 2, -CH / 2);
    c.shadowColor = 'rgba(0,0,0,.3)'; c.shadowBlur = 10; c.shadowOffsetY = 4; c.fillStyle = '#FBF8EF'; c.fillRect(0, 0, CW, CH); c.shadowColor = 'transparent';
    const iw = CW - 24, ih = iw * 9 / 16, img = foto && fotosVersiones[foto];
    if (img && img.complete && img.naturalWidth) c.drawImage(img, 12, 12, iw, ih);
    else { c.fillStyle = '#2B2740'; c.fillRect(12, 12, iw, ih); c.fillStyle = '#FF9B80'; c.font = '600 22px ' + BODY; c.textAlign = 'center'; c.fillText(foto ? '' : 'la que estás viendo', CW / 2, 12 + ih / 2 + 8); c.textAlign = 'left'; }
    c.fillStyle = '#2E2A42'; c.font = '700 34px ' + MANO; c.fillText(v + ' · ' + f, 14, ih + 56); c.font = '600 25px ' + MANO; wrap(c, t, 14, ih + 92, CW - 26, 28);
    c.restore();
  });
}
const CAPSULA_DIAS = 30;
const capsulaEd = { texto: '' };   // la cápsula guardada: { texto, fecha (iso), abre (iso) }
function capsulaAbre() { const k = guardado.get('capsula', null); return k && hoyISO() >= k.abre; }
function dibujaCapsula(c, w, h) {
  const capsula = guardado.get('capsula', null);
  c.fillStyle = '#E8E6F5'; c.fillRect(0, 0, w, h); c.fillStyle = '#8E8AA3'; c.fillRect(0, 0, w, 16);
  c.fillStyle = '#1E1B2E'; c.font = '600 48px ' + DISP; c.fillText('Cápsula del tiempo', 50, 96);
  c.fillStyle = '#5A566E'; c.font = '500 24px ' + BODY;
  if (!capsula) {
    wrap(c, 'Escribe una nota para ti dentro de ' + CAPSULA_DIAS + ' días. Intro la sella; hasta entonces no se puede abrir.', 50, 146, w - 100, 32);
    c.fillStyle = '#FBF8EF'; rr(c, 40, 230, w - 80, 520, 16); c.fill();
    c.fillStyle = '#2E2A42'; c.font = '700 40px ' + MANO; const y = wrap(c, capsulaEd.texto + (Math.floor(performance.now() / 500) % 2 ? '|' : ' '), 66, 290, w - 132, 46);
    c.fillStyle = '#8E8AA3'; c.font = '500 20px ' + BODY; c.fillText(capsulaEd.texto.length + ' / 280 · Intro: sellar · Esc: guardarla sin escribir', 50, h - 50);
  } else if (!capsulaAbre()) {
    wrap(c, 'Sellada el ' + fechaCorta(capsula.fecha) + '. Se abre el ' + fechaCorta(capsula.abre) + ' (' + Math.max(0, Math.round((new Date(capsula.abre) - new Date(hoyISO())) / DIA)) + ' días).', 50, 146, w - 100, 32);
    c.fillStyle = '#8E8AA3'; c.beginPath(); c.arc(w / 2, 480, 120, 0, Math.PI * 2); c.fill(); c.fillStyle = '#5A566E'; rr(c, w / 2 - 60, 430, 120, 100, 14); c.fill();
    c.strokeStyle = '#5A566E'; c.lineWidth = 16; c.beginPath(); c.arc(w / 2, 430, 42, Math.PI, 0); c.stroke();
  } else {
    wrap(c, 'Escrita el ' + fechaCorta(capsula.fecha) + ':', 50, 146, w - 100, 32);
    c.fillStyle = '#FBF8EF'; rr(c, 40, 190, w - 80, 560, 16); c.fill(); c.fillStyle = '#2E2A42'; c.font = '700 40px ' + MANO; wrap(c, capsula.texto, 66, 250, w - 132, 46);
    c.fillStyle = '#8E8AA3'; c.font = '500 20px ' + BODY; c.fillText('Supr: vaciarla para escribir otra · Esc: guardarla', 50, h - 50);
  }
}
const capsulaExtra = {
  tecla: e => {
    const capsula = guardado.get('capsula', null);
    if (!capsula) {
      if (e.key === 'Enter') { if (!capsulaEd.texto.trim()) return true; const f = hoyISO(), a = isoDe(new Date(new Date(f).getTime() + CAPSULA_DIAS * DIA)); guardado.set('capsula', { texto: capsulaEd.texto.trim(), fecha: f, abre: a }); anuncia('Cápsula sellada: se abre el ' + fechaCorta(a) + '.'); capsulaSellada({ texto: capsulaEd.texto.trim(), fecha: f, abre: a }); rePapel(); return true; }
      const r = teclea(e, capsulaEd.texto, 280); if (r.ok) { capsulaEd.texto = r.t; rePapel(); } return r.ok;
    }
    if (capsulaAbre() && e.key === 'Delete') { guardado.set('capsula', null); capsulaSellada(null); capsulaEd.texto = ''; rePapel(); anuncia('Cápsula vacía: puedes escribir otra.'); return true; }
    return false;
  }
};
function capsulaSellada() { /* el estado vive en guardado: el dibujo lo lee cada vez */ }
Object.defineProperty(window, '__slCapsula', { value: () => guardado.get('capsula', null), configurable: true });
function puertaAltillo(i, abrir) { const P = altilloPuertas[i], a0 = P.abierta; P.abierta = abrir ? 1 : 0; return anim(reduced ? 1 : 700, e => { P.p.rotation.y = P.s * 1.3 * lerp(a0, P.abierta, e); }, abrir ? curva.retroceso : curva.suave); }
async function abreAltillo(i) {
  cambia('ocupado'); setHover(null);
  await miraA([i ? PASILLO.x1 - 0.22 : PASILLO.x0 + 0.24, 2.25, PASILLO.z0], 450);
  await puertaAltillo(i, true);
  if (i === 0) {
    await abrePapel({ dibuja: dibujaVersiones, tam: [0.36, 0.3], origen: () => cajaVersiones.getWorldPosition(new THREE.Vector3()), clave: 'altillo-1', alVolver: () => puertaAltillo(0, false),
      texto: 'La caja de las versiones del cuarto: ' + VERSIONES.map(v => v[0] + ', ' + v[2]).join(' ') + ' Esc para guardarla.' });
  } else {
    capsulaEd.texto = '';
    const c = guardado.get('capsula', null);
    await abrePapel({ dibuja: dibujaCapsula, tam: [0.21, 0.28], origen: () => capsulaLata.getWorldPosition(new THREE.Vector3()), clave: 'altillo-2', extra: capsulaExtra, alVolver: () => puertaAltillo(1, false),
      texto: !c ? 'La cápsula del tiempo, vacía. Escribe una nota para ti dentro de ' + CAPSULA_DIAS + ' días e Intro para sellarla.' : (hoyISO() >= c.abre ? 'La cápsula se abre: ' + c.texto : 'La cápsula está sellada hasta el ' + fechaCorta(c.abre) + '.') });
  }
}
altilloPuertas.forEach((P, i) => registrar('altillo-' + (i + 1), { nombre: 'Altillo · ' + (i ? 'la cápsula del tiempo' : 'la caja de las versiones'), mallas: [P.hoja, P.pomo], puntero: 'mano', lugar: 'altillo', alcance: 2.2, brilloK: 0.35, alClic: () => abreAltillo(i) }));
// el papel de la cápsula se redibuja para que parpadee el cursor
setInterval(() => { if (gesto.estado === 'papel' && papel.dibuja === dibujaCapsula && !guardado.get('capsula', null)) rePapel(); }, 500);

/* =====================================================================================================
   LA MESITA (E59-9): los recuerdos abren su asignatura; la libreta se escribe
   ===================================================================================================== */
IDEAS.push(['5 nov', 'Los cuadros guardan algo: el autobús y el dorsal']);
const misIdeas = guardado.get('ideas', []);   // [[fecha, texto]]
const libretaEd = { texto: '' };
function dibujaLibretaV(c, w, h) {
  dibujaLibreta(c, w, h);
  let y = 214 + IDEAS.length * 86;
  misIdeas.slice(-3).forEach(([f, t]) => { c.fillStyle = '#4638B8'; c.font = '700 34px ' + MANO; c.fillText(f, 58, y); cabe(c, t, 172, y, w - 210, 36, '700', MANO); y += 86; });
  if (misIdeas.length < 40 && y < h - 30) { c.fillStyle = '#4638B8'; c.font = '700 34px ' + MANO; c.fillText('tú', 58, y); c.fillStyle = libretaEd.texto ? '#2E2A42' : '#8E8AA3'; cabe(c, libretaEd.texto ? libretaEd.texto + (Math.floor(performance.now() / 500) % 2 ? '|' : '') : 'escribe una idea e Intro', 172, y, w - 210, 36, '700', MANO); }
}
const libretaExtra = {
  tecla: e => {
    if (e.key === 'Enter') { const t = libretaEd.texto.trim(); if (!t) return true; const f = new Date(); misIdeas.push([f.getDate() + ' ' + MESES[f.getMonth()], t]); guardado.set('ideas', misIdeas); libretaEd.texto = ''; rePapel(); anuncia('Idea apuntada: ' + t + '.'); return true; }
    const r = teclea(e, libretaEd.texto, 60); if (r.ok) { libretaEd.texto = r.t; rePapel(); } return r.ok;
  }
};
cajonMesita[1].dibuja = dibujaLibretaV; cajonMesita[1].extra = libretaExtra;
cajonMesita[1].texto = 'La libreta de ideas. Escribe la tuya e Intro para apuntarla.';
// los recuerdos: cada asignatura (las filas del dibujo) abre su página en la web
const filasRecuerdos = () => LIBROS.filter(b => b.curso === 1).map((b, i) => ({ y0: 270 + i * 112 - 50, y1: 270 + i * 112 + 46, url: b.url, t: b.code }));
cajonMesita[0].extra = {
  punto: uv => { if (!uv) return ['punto']; const y = (1 - uv.y) * hojaTex.userData.canvas.height, f = filasRecuerdos().find(r => y >= r.y0 && y <= r.y1); return f ? ['enlace', 'Abrir ' + f.t + ' en la web'] : ['punto']; },
  clic: uv => { if (!uv) return; const y = (1 - uv.y) * hojaTex.userData.canvas.height, f = filasRecuerdos().find(r => y >= r.y0 && y <= r.y1); if (f) window.open(f.url, '_blank', 'noopener'); },
  tecla: e => { const n = Number(e.key); if (n >= 1 && n <= 4) { const f = filasRecuerdos()[n - 1]; if (f) window.open(f.url, '_blank', 'noopener'); return true; } return false; }
};
cajonMesita[0].texto += ' Clic en una asignatura, o su número del 1 al 4, para abrirla en la web.';
setInterval(() => { if (gesto.estado === 'papel' && papel.dibuja === dibujaLibretaV) rePapel(); }, 500);

/* =====================================================================================================
   EL CAJÓN DE LA MESA (E59-9): la calculadora y los pósits
   ===================================================================================================== */
const CALC_TECLAS = [['C', '÷', '×', '−'], ['7', '8', '9', '+'], ['4', '5', '6', '+'], ['1', '2', '3', '='], ['0', '0', '.', '=']];
const calcTex = texFrom(256, 496);
const calcCara = plano(0.078, 0.151, new THREE.MeshLambertMaterial({ map: calcTex, transparent: true }), 0, 0.0112, 0.0, -Math.PI / 2, 0, calculadora);
const calc = { pantalla: '0', acum: null, op: null, nuevo: true };
function dibujaCalc() {
  const c = calcTex.userData.g, w = 256, h = 496; c.clearRect(0, 0, w, h);
  c.fillStyle = '#9CB89A'; rr(c, 30, 24, w - 60, 86, 8); c.fill();
  c.fillStyle = '#1E2A20'; c.font = '600 46px ' + MONO; c.textAlign = 'right'; cabe(c, calc.pantalla, w - 44, 86, w - 90, 46, '600', MONO); c.textAlign = 'left';
  CALC_TECLAS.forEach((fila, j) => fila.forEach((k, i) => { if ((k === '+' && j === 2) || (k === '=' && j === 4) || (k === '0' && i === 1)) return; c.fillStyle = k === '=' ? '#FAFAF7' : '#E8E6F5'; c.font = '600 30px ' + BODY; c.textAlign = 'center'; c.fillText(k, 38 + i * 60 + 10, 168 + j * 66 + (k === '=' ? 33 : k === '+' ? 33 : 0)); c.textAlign = 'left'; }));
  calcTex.needsUpdate = true;
}
dibujaCalc();
function calcPulsa(k) {
  const num = parseFloat(calc.pantalla.replace(',', '.'));
  const opera = (a, o, b) => (o === '+' ? a + b : o === '−' ? a - b : o === '×' ? a * b : o === '÷' ? (b === 0 ? NaN : a / b) : b);
  if (/^[0-9]$/.test(k)) { calc.pantalla = calc.nuevo || calc.pantalla === '0' ? k : (calc.pantalla + k).slice(0, 12); calc.nuevo = false; }
  else if (k === '.') { if (calc.nuevo) { calc.pantalla = '0.'; calc.nuevo = false; } else if (!calc.pantalla.includes('.')) calc.pantalla += '.'; }
  else if (k === 'C') { Object.assign(calc, { pantalla: '0', acum: null, op: null, nuevo: true }); }
  else if (k === '=') { if (calc.op !== null) { const r = opera(calc.acum, calc.op, num); calc.pantalla = isFinite(r) ? String(+r.toPrecision(10)) : 'Error'; calc.acum = null; calc.op = null; calc.nuevo = true; } }
  else { if (calc.op !== null && !calc.nuevo) { const r = opera(calc.acum, calc.op, num); calc.acum = r; calc.pantalla = isFinite(r) ? String(+r.toPrecision(10)) : 'Error'; } else calc.acum = num; calc.op = k; calc.nuevo = true; }
  dibujaCalc(); anuncia(calc.pantalla);
}
const CALC_DE_TECLA = { '+': '+', '-': '−', '*': '×', 'x': '×', '/': '÷', 'Enter': '=', '=': '=', '.': '.', ',': '.', 'c': 'C', 'C': 'C', 'Delete': 'C' };
function calcTeclaBajo() {
  raycaster.setFromCamera(ndc, camera); const h = raycaster.intersectObject(calcCara)[0]; if (!h || !h.uv) return null;
  const x = h.uv.x * 256, y = (1 - h.uv.y) * 496; if (y < 130) return null;
  const j = clamp(Math.floor((y - 130) / 66), 0, 4), i = clamp(Math.floor((x - 18) / 60), 0, 3); return CALC_TECLAS[j][i];
}
const calcObj = registrar('calculadora', { nombre: 'Calculadora de los exámenes', mallas: [calculadora.children[0], calcCara], raiz: calculadora, movil: true, tipo: 'calculadora', lugar: 'mesa',
  activo: () => gesto.estado === 'libre' && cajonArribaM.obj > 0.1, insp: { dist: 0.24, rot: new THREE.Euler(Math.PI / 2 - 0.25, 0, 0) },
  alUsar: o => { insp.o = o; $('#velo').classList.add('on'); cambia('calc'); anuncia('Calculadora encendida: teclea los números y + − × ÷ con el teclado, o clic en sus teclas. Intro: igual. C: borrar. Esc: dejarla.'); } });
modo('calc', {
  punto: () => { const k = calcTeclaBajo(); return k ? ['mano', k] : ['girar']; },
  move() { actualizaPunto(); },
  up() { const k = calcTeclaBajo(); if (k) calcPulsa(k); },
  tecla(e) { const k = /^[0-9]$/.test(e.key) ? e.key : CALC_DE_TECLA[e.key]; if (k) { calcPulsa(k); return true; } if (e.key === 'Backspace') { calc.pantalla = calc.pantalla.length > 1 ? calc.pantalla.slice(0, -1) : '0'; dibujaCalc(); return true; } return false; },
  esc() { cambia('inspeccion'); dejaInspeccion(); }
});
// la calculadora en la mano en el modo «calc»: sigue a la cámara como en la inspección (corrInspeccion solo mira 'inspeccion')
function corrCalc(dt) { if (gesto.estado === 'calc' && insp.o) { const p1 = new THREE.Vector3(), q1 = new THREE.Quaternion(); poseInspeccion(insp.o, p1, q1); const k = reduced ? 1 : 1 - Math.exp(-dt * 14); insp.o.raiz.position.lerp(p1, k); insp.o.raiz.quaternion.slerp(q1, k); } }

// los pósits: se escribe uno y se pega donde mires (la pared, el monitor, el corcho, una puerta…). Se guardan.
const POSIT_COLORES = ['#F5C06B', '#A99EF5', '#FF9B80', '#9CE0B8'];
const posits = { lista: guardado.get('posits', []), mallas: [], ed: '', color: 0, pegando: null };
const positGeo = new THREE.PlaneGeometry(0.076, 0.076);
function texPosit(t, color) {
  return texFrom(256, 256, (c, w, h) => { c.fillStyle = color; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(0,0,0,.06)'; c.fillRect(0, 0, w, 34); c.fillStyle = '#2E2A42'; c.font = '700 40px ' + MANO; wrap(c, t, 18, 82, w - 30, 42); });
}
function creaPosit(d, i) {
  const m = new THREE.Mesh(positGeo, new THREE.MeshLambertMaterial({ map: texPosit(d.t, d.c), side: THREE.DoubleSide }));
  m.position.fromArray(d.p); m.lookAt(m.position.clone().add(v3(...d.n))); m.rotateZ(d.g || 0); m.userData.noJuntar = true; scene.add(m);
  const clave = 'posit-' + i + '-' + Math.random().toString(36).slice(2, 6);
  registrar(clave, { nombre: 'Pósit: «' + d.t + '» · clic: despegarlo', mallas: [m], puntero: 'mano', lugar: 'cualquiera', alClic: () => despegaPosit(m, d) });
  return m;
}
posits.lista.forEach((d, i) => posits.mallas.push(creaPosit(d, i)));
function despegaPosit(m, d) {
  const k = posits.lista.indexOf(d); if (k >= 0) posits.lista.splice(k, 1); guardado.set('posits', posits.lista);
  const o = objetos.get(m.userData.clave); if (o) { o.activo = () => false; }
  const p0 = m.position.clone(); anim(reduced ? 1 : 350, e => { m.position.lerpVectors(p0, camera.position, e * 0.6); m.scale.setScalar(1 - e); }, curva.entra).then(() => { scene.remove(m); });
  anuncia('Despegas el pósit «' + d.t + '».');
}
function dibujaPositPapel(c, w, h) {
  c.fillStyle = POSIT_COLORES[posits.color]; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(0,0,0,.06)'; c.fillRect(0, 0, w, 90);
  c.fillStyle = '#2E2A42'; c.font = '700 96px ' + MANO; const y = wrap(c, posits.ed + (Math.floor(performance.now() / 500) % 2 ? '|' : ' '), 50, 220, w - 90, 100);
  c.fillStyle = 'rgba(46,42,66,.6)'; c.font = '500 30px ' + BODY; c.fillText('Intro: pegarlo · Tab: color', 50, h - 50);
}
const positExtra = {
  tecla: e => {
    if (e.key === 'Tab') { posits.color = (posits.color + 1) % POSIT_COLORES.length; rePapel(); return true; }
    if (e.key === 'Enter') { if (!posits.ed.trim()) return true; empiezaPegar(); return true; }
    const r = teclea(e, posits.ed, 40); if (r.ok) { posits.ed = r.t; rePapel(); } return r.ok;
  }
};
setInterval(() => { if (gesto.estado === 'papel' && papel.dibuja === dibujaPositPapel) rePapel(); }, 500);
const positesTaco = cajonArriba.children.filter(m => m.isMesh && m.geometry.parameters && m.geometry.parameters.width === 0.07);
registrar('posits', { nombre: 'Pósits · escribe uno y pégalo', mallas: positesTaco, lugar: 'mesa', activo: () => gesto.estado === 'libre' && cajonArribaM.obj > 0.1 && posits.lista.length < 12,
  alClic: () => { posits.ed = ''; abrePapel({ dibuja: dibujaPositPapel, tam: [0.16, 0.16], origen: () => positesTaco[0].getWorldPosition(new THREE.Vector3()), extra: positExtra, clave: 'posits', texto: 'Un pósit en blanco: escribe, Tab cambia el color e Intro para pegarlo donde mires.' }); } });
// pegar: el pósit sigue a la mira (o al puntero) sobre lo que haya delante; clic, Intro o E lo pegan
const _rayPosit = new THREE.Raycaster();
function empiezaPegar() {
  hojaPlano.visible = false;
  const d = { t: posits.ed.trim(), c: POSIT_COLORES[posits.color], p: [0, 0, 0], n: [0, 0, 1], g: (Math.random() - 0.5) * 0.12 };
  const m = new THREE.Mesh(positGeo, new THREE.MeshLambertMaterial({ map: texPosit(d.t, d.c), side: THREE.DoubleSide, transparent: true, opacity: 0.85 })); m.visible = false; scene.add(m);
  posits.pegando = { d, m, ok: false, cuenta: 0 }; sueltaFoco(); cambia('pegar');
  anuncia('Mira donde quieras pegarlo (una pared, el monitor, el corcho, una puerta) y haz clic, Intro o E. Esc: lo guardas.');
}
function corrPegar() {
  const P = posits.pegando; if (!P || gesto.estado !== 'pegar') return;
  if ((P.cuenta = (P.cuenta + 1) % 2)) return;   // un rayo cada dos fotogramas
  _rayPosit.setFromCamera(control.bloqueado ? new THREE.Vector2(0, 0) : ndc, camera); _rayPosit.far = 3;
  const h = _rayPosit.intersectObjects(scene.children, true).find(x => x.object.isMesh && x.object.visible && x.object !== P.m && x.object !== hojaPlano && x.face && x.object !== movilPantalla);
  if (!h) { P.m.visible = false; P.ok = false; return; }
  const n = h.face.normal.clone().transformDirection(h.object.matrixWorld).normalize();
  if (n.dot(_rayPosit.ray.direction) > 0) n.negate();
  P.m.position.copy(h.point).addScaledVector(n, 0.003); P.m.lookAt(P.m.position.clone().add(n)); P.m.rotateZ(P.d.g); P.m.visible = true; P.ok = true; P.n = n;
}
function pegaAqui() {
  const P = posits.pegando; if (!P || !P.ok) return;
  P.d.p = P.m.position.toArray().map(v => +v.toFixed(4)); P.d.n = P.n.toArray().map(v => +v.toFixed(4));
  scene.remove(P.m); posits.lista.push(P.d); guardado.set('posits', posits.lista); posits.mallas.push(creaPosit(P.d, posits.lista.length - 1));
  posits.pegando = null; cambia('libre'); anuncia('Pósit pegado. Se queda guardado; clic en él para despegarlo.');
}
modo('pegar', {
  punto: () => (posits.pegando && posits.pegando.ok ? ['mano', 'Pegarlo aquí'] : ['punto']),
  move() { actualizaPunto(); }, up() { pegaAqui(); },
  tecla(e) { if (e.key === 'Enter' || e.key === 'e' || e.key === 'E') { pegaAqui(); return true; } return false; },
  esc() { const P = posits.pegando; if (P) scene.remove(P.m); posits.pegando = null; cambia('libre'); anuncia('Guardas el pósit sin pegar.'); }
});
// en el modo pegar, con el ratón capturado se mira con el ratón (es un modo de cámara)
MODOS_CAMARA.add('pegar');

/* =====================================================================================================
   EL CORCHO (E59-10): cada foto y entrada viene a la vista
   ===================================================================================================== */
function corchoItemEn(uv) {
  if (!uv) return -1; const x = uv.x * 1024, y = (1 - uv.y) * 666;
  for (let i = 0; i < CORCHO.length; i++) { const col = i % 4, fila = Math.floor(i / 4), x0 = 30 + col * 246 + (fila % 2) * 18, y0 = 26 + fila * 212; if (x >= x0 - 8 && x <= x0 + 228 && y >= y0 - 6 && y <= y0 + 196) return i; }
  return -1;
}
function corchoUV() { raycaster.setFromCamera(ndc, camera); const h = raycaster.intersectObject(corchoMesh)[0]; return h ? h.uv : null; }
function dibujaTarjetaCorcho(i) {
  const it = CORCHO[i];
  return (c, w, h) => {
    c.fillStyle = '#FBF8EF'; c.fillRect(0, 0, w, h); c.fillStyle = it.color; c.fillRect(0, 0, w, 280);
    c.fillStyle = 'rgba(255,255,255,.18)'; c.beginPath(); c.arc(160, 120, 60, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#FAFAF7'; c.font = '600 30px ' + BODY; c.fillText(it.tipo === 'foto' ? 'Foto' : it.tipo === 'entrada' ? 'Entrada' : 'Nota', 50, 250);
    c.fillStyle = '#1E1B2E'; c.font = '600 56px ' + DISP; c.fillText(it.t, 50, 370);
    c.fillStyle = '#2E2A42'; c.font = '700 46px ' + MANO; wrap(c, it.s, 50, 450, w - 100, 54);
    c.fillStyle = '#8E8AA3'; c.font = '500 22px ' + BODY; c.fillText('La historia de la web · ' + (i + 1) + ' de ' + CORCHO.length + ' · flechas: otra', 50, h - 40);
  };
}
const corchoSel = { i: 0 };
function abreTarjetaCorcho(i) {
  corchoSel.i = i; modos.mirar.extra = null; cambia('ocupado');
  abrePapel({ dibuja: dibujaTarjetaCorcho(i), tam: [0.21, 0.28], origen: () => corchoMesh.getWorldPosition(new THREE.Vector3()), clave: 'corcho',
    extra: { tecla: e => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return false; corchoSel.i = (corchoSel.i + d + CORCHO.length) % CORCHO.length; papel.dibuja = dibujaTarjetaCorcho(corchoSel.i); rePapel(); anuncia(CORCHO[corchoSel.i].t + ': ' + CORCHO[corchoSel.i].s); return true; } },
    alVolver: () => { mirarDesde = null; },
    texto: CORCHO[i].t + ': ' + CORCHO[i].s + '. Flechas: otra. Esc para dejarla.' });
}
{
  const o = objetos.get('corcho');
  o.alClic = () => miraCosa({ clave: 'corcho', punto: v3(SALA.x0, CORCHO_POS.y, CORCHO_POS.z), normal: v3(1, 0, 0), tam: 1.0,
    texto: 'El corcho, con la historia de la web. Clic en una foto o entrada para leerla (o Intro para la primera). Esc para volver.',
    extra: { punto: () => (corchoItemEn(corchoUV()) >= 0 ? ['lupa', CORCHO[corchoItemEn(corchoUV())].t] : ['punto']), up: () => { const i = corchoItemEn(corchoUV()); if (i >= 0) abreTarjetaCorcho(i); }, tecla: e => { if (e.key === 'Enter') { abreTarjetaCorcho(0); return true; } return false; } } });
}

/* =====================================================================================================
   LOS CUADROS (E59-11): la actividad secreta
   El cuadro de la niebla está torcido (4°). Enderezarlo lo suelta: se abre sobre su bisagra y deja ver una caja fuerte
   de 4 cifras. Las pistas: el autobús del cuadro de la calle lleva el 20 y la camiseta, el 18 (2018, el Mundial).
   Dentro, el primer trofeo, «Detective del cuarto», que va solo a la balda (y se queda).
   ===================================================================================================== */
const secreto = { resuelto: !!guardado.get('secreto-cuadros', false), recto: false, codigo: '', abierto: false };
secreto.recto = secreto.resuelto;
nieblaG.rotation.z = secreto.recto ? 0 : 0.07;
function dibujaCajaFuerte() {
  const c = cajaFuerteTex.userData.g, w = 256, h = 256;
  c.fillStyle = '#3A3552'; c.fillRect(0, 0, w, h); c.strokeStyle = '#5A566E'; c.lineWidth = 6; c.strokeRect(8, 8, w - 16, h - 16);
  c.fillStyle = '#141221'; rr(c, 40, 34, w - 80, 56, 8); c.fill();
  c.fillStyle = secreto.abierto ? '#5BD39A' : '#FF6B4A'; c.font = (secreto.abierto ? '600 30px ' : '600 40px ') + MONO; c.textAlign = 'center';
  c.fillText(secreto.abierto ? 'ABIERTA' : (secreto.codigo + '____').slice(0, 4).split('').join(' '), w / 2, 76);
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '·', '0', '·'].forEach((k, i) => { const x = 70 + (i % 3) * 58, y = 122 + Math.floor(i / 3) * 34; c.fillStyle = '#26223A'; rr(c, x - 22, y - 14, 44, 28, 5); c.fill(); c.fillStyle = '#C9C5DC'; c.font = '600 20px ' + MONO; c.fillText(k, x, y + 7); });
  c.textAlign = 'left'; cajaFuerteTex.needsUpdate = true;
}
dibujaCajaFuerte();
// el trofeo: una copa torneada (LatheGeometry) dorada con su placa
const trofeo = (() => {
  const g = new THREE.Group(), perfil = [[0, 0], [0.03, 0], [0.03, 0.008], [0.012, 0.016], [0.008, 0.05], [0.006, 0.07], [0.025, 0.08], [0.035, 0.11], [0.034, 0.13], [0, 0.125]].map(([x, y]) => new THREE.Vector2(x, y));
  const oro = new THREE.MeshStandardMaterial({ color: 0xF5A524, metalness: 0.85, roughness: 0.3, emissive: 0x3A2400, emissiveIntensity: 0.4 });
  g.add(new THREE.Mesh(new THREE.LatheGeometry(perfil, 28), oro));
  [-1, 1].forEach(s => { const a = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.003, 6, 14, Math.PI), oro); a.position.set(s * 0.037, 0.105, 0); a.rotation.z = s > 0 ? -Math.PI / 2 : Math.PI / 2; g.add(a); });
  g.visible = false; scene.add(g); return g;
})();
const TROFEO_SITIO = v3(TROFEOS.x0 + 0.17, TROFEOS.y + 0.0475, FONDO - 0.09);
if (secreto.resuelto) { trofeo.position.copy(TROFEO_SITIO); trofeo.visible = true; }
function cajaTeclaBajo() {
  raycaster.setFromCamera(ndc, camera); const h = raycaster.intersectObject(cajaFuerteFrente)[0]; if (!h || !h.uv) return null;
  const x = h.uv.x * 256, y = (1 - h.uv.y) * 256; if (y < 104) return null;
  const i = clamp(Math.floor((x - 41) / 58), 0, 2), j = clamp(Math.floor((y - 105) / 34), 0, 3); const k = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '·', '0', '·'][j * 3 + i]; return k === '·' ? null : k;
}
async function cajaDigito(k) {
  if (secreto.abierto) return;
  secreto.codigo = (secreto.codigo + k).slice(0, 4); dibujaCajaFuerte();
  if (secreto.codigo.length < 4) { anuncia(secreto.codigo.split('').join(' ')); return; }
  if (secreto.codigo === '2018') {
    secreto.abierto = true; secreto.resuelto = true; guardado.set('secreto-cuadros', true); dibujaCajaFuerte();
    anuncia('¡Abierta! 2018: el autobús 20 y el dorsal 18. Dentro, un trofeo: «Detective del cuarto». Va a la balda. Es tu primer logro (se guardará con los logros de la v0.3).');
    trofeo.visible = true; trofeo.position.copy(cajaFuerteG.position).add(v3(0, -0.05, -0.06)); trofeo.scale.setScalar(1);
    const p0 = trofeo.position.clone(), C = p0.clone().lerp(TROFEO_SITIO, 0.5); C.y += 0.3;
    await espera(reduced ? 0 : 500);
    await anim(reduced ? 1 : 1400, e => { bezier2(p0, C, TROFEO_SITIO, e, trofeo.position); trofeo.rotation.y = e * Math.PI * 2; }, curva.suave);
  } else {
    const p0 = cajaFuerteFrente.position.x; if (!reduced) anim(320, e => { cajaFuerteFrente.position.x = p0 + Math.sin(e * Math.PI * 6) * 0.006 * (1 - e); });
    anuncia('Ese no es. Busca dos números en los cuadros y en lo que cuelga.'); await espera(reduced ? 0 : 400); secreto.codigo = ''; dibujaCajaFuerte();
  }
}
const cajaExtra = {
  punto: () => { const k = cajaTeclaBajo(); return k ? ['mano', k] : ['punto']; },
  up: () => { const k = cajaTeclaBajo(); if (k) cajaDigito(k); },
  tecla: e => { if (/^[0-9]$/.test(e.key)) { cajaDigito(e.key); return true; } if (e.key === 'Backspace') { secreto.codigo = secreto.codigo.slice(0, -1); dibujaCajaFuerte(); return true; } return false; },
  alSalir: () => { secreto.codigo = ''; if (!secreto.resuelto) secreto.abierto = false; dibujaCajaFuerte(); anim(reduced ? 1 : 700, e => { nieblaBisagra.rotation.y = lerp(-1.9, 0, e); }, curva.suave); }
};
async function abreCuadro() {
  await anim(reduced ? 1 : 500, e => { nieblaG.rotation.z = lerp(0.07, 0, e); }, curva.retroceso);
  secreto.recto = true;
  await espera(reduced ? 0 : 250);
  await anim(reduced ? 1 : 900, e => { nieblaBisagra.rotation.y = lerp(0, -1.9, e); }, curva.retroceso);
  enfoca(cajaFuerteG.position.clone(), ojos(), 30, { paralaje: 0.01, rate: 4 });
  modos.mirar.extra = cajaExtra; cambia('mirar');
  anuncia(secreto.resuelto ? 'Detrás del cuadro, la caja fuerte, ya abierta. Esc para cerrar el cuadro.' : 'Clac: el cuadro estaba suelto y se abre. Detrás, una caja fuerte de 4 cifras. Teclea el código (o clic en sus teclas). Esc para cerrarlo.');
}
{
  const o = objetos.get('cuadro-niebla');
  o.alClic = async () => {
    await miraCosa({ clave: 'cuadro-niebla', punto: v3(CUADRO_NIEBLA.x, CUADRO_NIEBLA.y, FONDO), normal: v3(0, 0, -1), tam: 0.6,
      texto: secreto.recto ? 'El cuadro de la ciudad entre la niebla. Clic para abrirlo. Esc para volver.' : 'El cuadro de la ciudad entre la niebla… está un poco torcido. Clic para enderezarlo. Esc para volver.',
      extra: { punto: () => ['mano', secreto.recto ? 'Abrir el cuadro' : 'Enderezarlo'], up: () => { cambia('ocupado'); abreCuadro(); }, tecla: e => { if (e.key === 'Enter' || e.key === 'e' || e.key === 'E') { cambia('ocupado'); abreCuadro(); return true; } return false; } } });
  };
}
window.__slSecreto = () => ({ resuelto: secreto.resuelto, recto: secreto.recto, codigo: secreto.codigo, trofeo: trofeo.visible ? trofeo.position.toArray().map(v => +v.toFixed(3)) : null });
window.__slCaja = k => cajaDigito(String(k));
window.__slMovil = () => ({ estado: gesto.estado, abierto: movil.abierto, enMano: movil.enMano, app: movil.app, zonas: movil.zonas.map(z => z.etiqueta), linterna: linterna.on, estudio: estudio.fase });
window.__slTelZona = etiqueta => { const z = movil.zonas.find(x => x.etiqueta.startsWith(etiqueta)); if (z) { z.accion(); dibujaMovil(); } return !!z; };
window.__slBugs = () => ({ activo: JB.activo, fase: JB.fase, puntos: JB.puntos, vidas: JB.vidas, oleada: JB.oleada, bugs: JB.bugs.length, record: JB.record });
window.__slJB = JB;
window.__slCalc = () => calc.pantalla;
window.__slPosits = () => posits.lista.length;
