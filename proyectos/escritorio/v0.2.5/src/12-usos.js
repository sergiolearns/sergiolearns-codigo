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
const APPS_MOVIL = [['linterna', 'Linterna'], ['camara', 'Cámara'], ['estudio', 'Estudio'], ['web', 'Web'], ['mapa', 'Mapa'], ['bot', 'Sergio Bot'], ['ajustes', 'Ajustes']];   // v0.2.5: Sergio Bot, desde la taza
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
  if (k === 'bot') { rr(c, cx - 13 * u, cy - 11 * u, 26 * u, 18 * u, 5 * u); c.stroke(); c.beginPath(); c.moveTo(cx - 5 * u, cy + 7 * u); c.lineTo(cx - 8 * u, cy + 13 * u); c.lineTo(cx + 1 * u, cy + 7 * u); c.stroke(); c.fillStyle = K; [-6, 0, 6].forEach(d => { c.beginPath(); c.arc(cx + d * u, cy - 2 * u, 1.8 * u, 0, Math.PI * 2); c.fill(); }); }
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
  c.setTransform(movilTex.userData.canvas.width / W, 0, 0, movilTex.userData.canvas.height / H, 0, 0);   // v0.2.5: lienzo de 540 × 1080, dibujo en 360 × 720
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
      const s = 74, x = 34 + (i % 3) * 110, y = 344 + Math.floor(i / 3) * 122;
      icoApp(c, k, x + 4, y, s); c.fillStyle = '#E8E6F5'; c.font = '500 17px ' + BODY; c.textAlign = 'center'; c.fillText(nombre, x + 4 + s / 2, y + s + 26); c.textAlign = 'left';
      zonaTel(x - 6, y - 8, s + 20, s + 44, () => abreApp(k), nombre);
    });
  } else if (app === 'linterna') {
    cabeceraApp(c, 'Linterna');
    const cx = W / 2, cy = 380; c.fillStyle = linterna.on ? '#F5C06B' : 'rgba(232,230,245,.1)'; c.beginPath(); c.arc(cx, cy, 104, 0, Math.PI * 2); c.fill();
    c.fillStyle = linterna.on ? '#141221' : '#FAFAF7'; c.font = '600 30px ' + DISP; c.textAlign = 'center'; c.fillText(linterna.on ? 'Encendida' : 'Apagada', cx, cy + 10); c.textAlign = 'left';
    zonaTel(cx - 110, cy - 110, 220, 220, () => alternaLinterna(), linterna.on ? 'Apagar la linterna' : 'Encender la linterna');
    c.fillStyle = '#C9C5DC'; c.font = '500 17px ' + BODY; wrap(c, 'Alumbra hacia donde miras. Con el estor bajado y la luz apagada, se nota de verdad.', 28, 540, W - 56, 24);
  } else if (app === 'camara') {
    cabeceraApp(c, 'Cámara');
    c.fillStyle = '#07060C'; rr(c, 22, 176, W - 44, 196, 12); c.fill();
    if (fotoMovil.img) c.drawImage(fotoMovil.img, 22, 176, W - 44, 196); else { c.fillStyle = '#8E8AA3'; c.font = '500 17px ' + BODY; c.textAlign = 'center'; c.fillText('Aún no hay fotos', W / 2, 280); c.textAlign = 'left'; }
    boton(c, W / 2 - 60, 404, 120, 120, '', () => hazFoto(), 'Hacer una foto del cuarto');
    c.strokeStyle = '#FAFAF7'; c.lineWidth = 5; c.beginPath(); c.arc(W / 2, 464, 44, 0, Math.PI * 2); c.stroke(); c.fillStyle = '#FF6B4A'; c.beginPath(); c.arc(W / 2, 464, 34, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#C9C5DC'; c.font = '500 17px ' + BODY; wrap(c, 'Hace una foto de lo que miras: se guarda aquí y se descarga (' + fotoMovil.n + ' en esta visita).', 28, 572, W - 56, 24);
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
  } else if (app === 'bot') {
    cabeceraApp(c, 'Sergio Bot');
    c.fillStyle = '#8E8AA3'; c.font = '500 14px ' + BODY; c.fillText('respuestas de ejemplo · el de verdad, en la web', 22, 170);
    let y = 214; const ult = bot.msgs.slice(-4);
    ult.forEach((m, i) => {
      let txt = m.t; if (i === ult.length - 1 && m.de === 'bot') txt = txt.slice(0, Math.floor(bot.revela));
      c.font = '500 17px ' + BODY; const lineas = Math.max(1, Math.ceil(c.measureText(txt).width / 250)), alto = lineas * 23 + 18, tu = m.de === 'tu';
      c.fillStyle = tu ? '#FF6B4A' : 'rgba(232,230,245,.12)'; rr(c, tu ? 70 : 18, y, W - 88, alto, 14); c.fill();
      c.fillStyle = tu ? '#141221' : '#FAFAF7'; wrap(c, txt, (tu ? 70 : 18) + 14, y + 26, W - 116, 23); y += alto + 12;
    });
    c.fillStyle = 'rgba(232,230,245,.1)'; rr(c, 18, H - 92, W - 36, 56, 16); c.fill();
    c.fillStyle = bot.escrito ? '#FAFAF7' : '#8E8AA3'; c.font = '500 17px ' + BODY; cabe(c, bot.escrito ? bot.escrito + (Math.floor(performance.now() / 500) % 2 ? '|' : '') : 'Escribe tu pregunta', 36, H - 57, W - 80, 17, '500', BODY);
  } else if (app === 'ajustes') {
    cabeceraApp(c, 'Ajustes');
    const filas = [
      ['Controles', control.modo === 'juego' ? 'Juego' : 'Clásico', () => ponControles(control.modo === 'juego' ? 'clasico' : 'juego'), PL_OK ? 'ratón capturado o cursor' : 'este navegador: solo clásico'],
      ['Sensibilidad', SENS.nivel + ' de 5', () => cambiaSensibilidad(SENS.nivel >= 5 ? -4 : 1), 'toca para cambiarla'],
      ['Reducir movimiento', reduced ? 'Sí' : 'No', () => { reduced = !reduced; guardado.set('reducir', reduced); }, 'sin balanceo ni suavizados'],
      ['Panel de fps', panelFps ? 'Sí' : 'No', () => alternaPanelFps(), 'para probar el rendimiento'],
      ['Teclas', 'M y flechas', () => anuncia('El móvil: M lo saca y lo guarda; flechas e Intro lo usan; F, la linterna. Todas las teclas, en el manual de la estantería.'), 'M saca el móvil · el resto, en el manual']
    ];
    filas.forEach(([n, v, fn, sub], i) => {
      const y = 166 + i * 92; c.fillStyle = 'rgba(232,230,245,.08)'; rr(c, 18, y, W - 36, 82, 14); c.fill();
      c.fillStyle = '#FAFAF7'; c.font = '600 20px ' + BODY; c.fillText(n, 34, y + 36); c.fillStyle = '#8E8AA3'; c.font = '500 14px ' + BODY; c.fillText(sub, 34, y + 62);
      c.fillStyle = '#FF9B80'; c.font = '600 19px ' + BODY; c.textAlign = 'right'; c.fillText(v, W - 34, y + 48); c.textAlign = 'left';
      zonaTel(18, y, W - 36, 84, () => { fn(); dibujaMovil(); }, n + ': ' + v);
    });
    c.fillStyle = '#8E8AA3'; c.font = '500 14px ' + MONO; c.fillText(NOMBRE, 28, H - 30);
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
  if (movil.app === 'bot') {   // v0.2.5: en Sergio Bot se escribe
    if (e.key === 'Enter' && bot.escrito.trim()) { const q = bot.escrito.trim(); bot.escrito = ''; bot.msgs.push({ de: 'tu', t: q }, { de: 'bot', t: respuestaBot(q) }); bot.revela = 0; dibujaMovil(); anuncia('Sergio Bot: ' + respuestaBot(q)); return true; }
    if (e.key === 'Backspace' && bot.escrito) { bot.escrito = bot.escrito.slice(0, -1); dibujaMovil(); return true; }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) { if (bot.escrito.length < 80) bot.escrito += e.key; dibujaMovil(); return true; }
  }
  const n = movil.zonas.length; if (!n) return false;
  if (['ArrowDown', 'ArrowRight', 'Tab'].includes(e.key) && !(e.key === 'Tab' && e.shiftKey)) { movil.sel = (movil.sel + 1) % n; movil.selVisible = true; dibujaMovil(); anuncia(movil.zonas[movil.sel].etiqueta); return true; }
  if (['ArrowUp', 'ArrowLeft'].includes(e.key) || (e.key === 'Tab' && e.shiftKey)) { movil.sel = (movil.sel - 1 + n) % n; movil.selVisible = true; dibujaMovil(); anuncia(movil.zonas[movil.sel].etiqueta); return true; }
  if (e.key === 'Enter' || e.key === ' ') { const z = movil.zonas[movil.sel % n]; if (z) { z.accion(); dibujaMovil(); } return true; }
  if (e.key === 'Backspace' && movil.app) { abreApp(null); return true; }
  if ((e.key === 'f' || e.key === 'F')) { alternaLinterna(); dibujaMovil(); return true; }
  return false;
}
// sacar el móvil (M). v0.2.5 (E60-5, regla 5, boceto 03): estaba a 27 cm, 1,5 cm por debajo de la mirada y con la vista a
// 62°: ocupaba el 48 % del alto de la pantalla y no se leía. Ahora sube del BOLSILLO (abajo a la derecha, la mano) hasta
// 26 cm, de cara, y la vista se cierra a 40° (enfocas): el 82 % del alto. Guardarlo: el camino al revés, al bolsillo
// (antes volvía a la mesita sin que se viera; en la mesita queda el cargador)
const _telP = new THREE.Vector3(), _telQ = new THREE.Quaternion();
const MOVIL_DIST = 0.26, FOV_MOVIL = 40;
function poseMovil(p, q) {
  camera.getWorldDirection(_v);
  p.copy(camera.position).addScaledVector(_v, MOVIL_DIST);
  q.copy(camera.quaternion).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0.04, 0, 0)));
  return [p, q];
}
function poseBolsillo() {
  const d = camera.getWorldDirection(new THREE.Vector3()), ab = v3(0, -1, 0).applyQuaternion(camera.quaternion), de = v3(1, 0, 0).applyQuaternion(camera.quaternion);
  return [camera.position.clone().addScaledVector(d, 0.22).addScaledVector(ab, 0.36).addScaledVector(de, 0.14), camera.quaternion.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-1.1, 0.3, 0.4)))];
}
async function sacaMovil() {
  if (gesto.estado !== 'libre') return;
  cambia('ocupado'); setHover(null);
  movil.abierto = true; movil.enMano = true; movil.app = null; movil.sel = 0; dibujaMovil();
  scene.attach(movilG);
  const [p0, q0] = poseBolsillo(); movilG.position.copy(p0); movilG.quaternion.copy(q0); movilG.visible = true;
  rig.fovLee = FOV_MOVIL;
  await trayecto(movilG, { puntos: [p0], fin: () => poseMovil(new THREE.Vector3(), new THREE.Quaternion()), dur: 700, alto: 0.02, giro: [0.0, 0.8] });
  cambia('movil');
  anuncia('El móvil: Linterna, Cámara, Estudio, Web, Mapa, Sergio Bot y Ajustes. Flechas e Intro, o clic. M o Esc para guardarlo.');
}
async function guardaMovil(sinVolver = false) {
  if (!movil.enMano) return;
  cambia('ocupado'); rig.fovLee = null;
  await trayecto(movilG, { puntos: [movilG.position.clone()], fin: poseBolsillo, dur: 520, alto: 0.0, giro: [0.1, 0.9], curvaT: curva.pesoSin });
  movil.abierto = false; movil.enMano = false; movilG.visible = false; dibujaMovil();
  if (!sinVolver) { cambia('libre'); devuelveFoco('movil'); }
}
function alternaMovil() { if (gesto.estado === 'movil') return guardaMovil(); return sacaMovil(); }
modo('movil', {
  punto: () => telPunto(), move() { actualizaPunto(); }, up() { telClic(); },
  tecla(e) { if ((e.key === 'm' || e.key === 'M') && movil.app !== 'bot') { guardaMovil(); return true; } return telTecla(e); },
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
// v0.2.5 (E60-1, regla 4, boceto 01): giraban con −s·1,45 y se abrían HACIA DENTRO (el canto libre acababa en x = 1,30, detrás de
// la pared). Con +s·1,45 (83°) se abren hacia el cuarto: el canto libre queda en x = 0,45. Con peso, sin pasarse del tope
function puertaZapatero(i, abrir) { const P = zapateroPuertas[i], a0 = P.abierta; P.abierta = abrir ? 1 : 0; return anim(reduced ? 1 : (abrir ? 640 : 520), e => { P.p.rotation.y = P.s * 1.45 * lerp(a0, P.abierta, e); }, curva.pesoSin); }
zapateroPuertas.forEach((P, i) => registrar('zapatero-' + (i + 1), { nombre: 'Zapatero · ' + (i ? 'puerta de la derecha' : 'puerta de la izquierda'), mallas: [P.hoja, P.tirador], puntero: 'mano', lugar: 'zapatero', alcance: 1.7, brilloK: 0.35,
  alClic: () => { const abrir = !P.abierta; puertaZapatero(i, abrir); anuncia(abrir ? (i ? 'Dentro: la caja de los juegos. Coge el mando o la caja para jugar.' : 'Dentro: las zapatillas.') : 'Cierras el zapatero.'); } }));
registrar('caja-juegos', { nombre: 'Caja de los juegos · «Caza de bugs»', mallas: [cajaJuegos, ...juegosCajas], lugar: 'zapatero', alcance: 1.8, activo: () => gesto.estado === 'libre' && zapateroPuertas[1].abierta > 0.5, alClic: () => juegaBugs() });
/* «CAZA DE BUGS», rehecho en la v0.2.5 (E60-6; boceto 05; en la ronda, Sergio eligió «dentro de tu código»).
   La historia (biblia, sección 5): un juego que Sergio hizo un fin de semana antes de un examen, para desestresarse; los
   bugs son los fallos de su propio código de 1º. La arena es un archivo abierto en un editor; los bugs salen de las líneas
   subrayadas (nada aparece de la nada, tampoco aquí) y, al cazar los de una línea, se arregla. Cada archivo limpio, +50.
   Cada 5 archivos, el jefe: una fuga de memoria que crece si no le das.
   Controles (decisión de Sergio): WASD mueve el depurador con su inercia; el ratón lleva la retícula por la tele (con el
   ratón capturado, el cursor propio; en el clásico, el cursor); el clic dispara hacia la retícula (mantenerlo, ráfaga).
   Con mando, como antes: palanca izquierda mueve, derecha apunta, R2 dispara. Solo teclado: las flechas disparan. */
const ARCHIVOS = [
  { n: 'lista_enlazada.java', asig: 'FP2', cod: ['class Nodo {', '    int dato;', '    Nodo sig;', '}', '', 'int suma(Nodo cabeza) {', '    int s = 0;', '    Nodo n = null;', '    while (n.sig != null) {', '        s += n.dato;', '        n = n.sig;', '    }', '    return s;', '}'],
    bugs: { 7: 'npe', 8: 'npe' } },
  { n: 'notas.py', asig: 'FP1', cod: ['notas = [[7, 5], [9, 6], [4, 8]]', '', 'def media(fila):', '    return sum(fila) / len(fila)', '', 'for i in range(len(notas) + 1):', '    print(media(notas[i]))', '', 'mejor = notas[0][2]', 'print("mejor:", mejor)'],
    bugs: { 5: 'off', 8: 'off' } },
  { n: 'hilos.c', asig: 'IC2', cod: ['#include <pthread.h>', 'int contador = 0;', '', 'void *suma(void *arg) {', '    for (int i = 0; i < 1000; i++)', '        contador++;', '    return NULL;', '}', 'int main(void) {', '    pthread_t h[4];', '    char *nombre;', '    nombre[0] = \'S\';', '    return 0;', '}'],
    bugs: { 5: 'off', 11: 'seg' } },
  { n: 'pila.java', asig: 'FP2', cod: ['class Pila {', '    int[] datos = new int[10];', '    int cima = 0;', '    void push(int x) {', '        datos[cima++] = x;', '    }', '    int pop() {', '        return datos[cima];', '    }', '    Pila otra;', '    int tam() { return otra.cima; }', '}'],
    bugs: { 4: 'off', 7: 'off', 10: 'npe' } },
  { n: 'memoria.c', asig: 'IC2', cod: ['#include <stdlib.h>', '', 'int main(void) {', '    for (;;) {', '        int *v = malloc(1024);', '        v[0] = 1;', '        // ...y nunca un free(v)', '    }', '}'],
    bugs: { 4: 'jefe' } }
];
const ERR = { npe: 'NullPointerException', off: 'off-by-one', seg: 'Segmentation fault', jefe: 'fuga de memoria', gota: 'malloc sin free', colgante: 'puntero colgante' };
const TIPO = {   // radio, velocidad, golpes, puntos, color
  npe: { r: 13, v: 72, vida: 1, pts: 10, color: '#A99EF5' }, off: { r: 9, v: 118, vida: 1, pts: 15, color: '#F5C06B' },
  seg: { r: 19, v: 46, vida: 3, pts: 30, color: '#FF6B4A' }, colgante: { r: 8, v: 135, vida: 1, pts: 10, color: '#FF9B80' },
  jefe: { r: 30, v: 26, vida: 14, pts: 200, color: '#5BD39A' }, gota: { r: 7, v: 105, vida: 1, pts: 5, color: '#9CE0B8' }
};
const JB = { W: 960, H: 544, activo: false, fase: 'titulo', t: 0, ult: 0, pinta: 0, j: null, balas: [], bugs: [], cosas: [], chispas: [], textos: [], puntos: 0, archivo: 0, vidas: 3, inv: 0,
  record: guardado.get('record-bugs', 0), teclas: new Set(), cad: 0, rapido: 0, lento: 0, temblor: 0, pad: null, dir: [1, 0], mira: { x: 700, y: 272 }, disparando: false, lineas: [], banner: 0, recordNuevo: false };
const ED = { x0: 64, y0: 54, lh: 31 };   // el editor: margen de los números, primera línea, alto de línea
const archivoDe = n => ARCHIVOS[(n - 1) % ARCHIVOS.length];
function nuevaPartida() { Object.assign(JB, { fase: 'juego', j: { x: 150, y: JB.H - 90, vx: 0, vy: 0 }, balas: [], bugs: [], cosas: [], chispas: [], textos: [], puntos: 0, archivo: 0, vidas: 3, inv: 1.5, cad: 0, rapido: 0, lento: 0, recordNuevo: false }); abreArchivo(); }
function abreArchivo() {
  JB.archivo++; const A = archivoDe(JB.archivo), vuelta = Math.floor((JB.archivo - 1) / ARCHIVOS.length), k = 1 + vuelta * 0.18;
  JB.lineas = A.cod.map((t, i) => ({ t, err: A.bugs[i] || null, arreglada: false }));
  JB.bugs = [];
  Object.entries(A.bugs).forEach(([li, tipo]) => {
    const n = tipo === 'npe' ? 3 + vuelta : tipo === 'off' ? 4 + vuelta * 2 : tipo === 'seg' ? 1 + vuelta : 1;
    for (let q = 0; q < n; q++) {
      const T = TIPO[tipo], y = ED.y0 + li * ED.lh - 8, x = ED.x0 + 20 + Math.min(520, A.cod[li].length * 11.5) + 14;
      JB.bugs.push({ x, y, linea: +li, tipo, vida: T.vida + (tipo === 'jefe' ? vuelta * 4 : 0), r: T.r, v: T.v * k, fase: Math.random() * 6, espera: 0.6 + q * (tipo === 'off' ? 0.35 : 0.8), gotaT: 2 });
    }
  });
  JB.fase = 'juego'; anuncia('Archivo ' + JB.archivo + ': ' + A.n + '. ' + (A.bugs[4] === 'jefe' && Object.keys(A.bugs).length === 1 ? 'Cuidado: una fuga de memoria.' : Object.values(A.bugs).map(b => ERR[b]).join(', ') + '.'));
}
function leePad() {
  const pads = navigator.getGamepads ? [...navigator.getGamepads()].filter(Boolean) : []; const p = pads[0];
  if (!p) { JB.pad = null; return null; }
  const z = v => (Math.abs(v) < 0.18 ? 0 : v);
  JB.pad = { mx: z(p.axes[0] || 0), my: z(p.axes[1] || 0), dx: z(p.axes[2] || 0), dy: z(p.axes[3] || 0), r2: !!(p.buttons[7] && p.buttons[7].pressed), x: !!(p.buttons[0] && p.buttons[0].pressed), op: !!(p.buttons[9] && p.buttons[9].pressed) };
  return JB.pad;
}
// la retícula: donde el puntero (el cursor propio o el del sistema) toca la pantalla de la tele
function miraDesdePuntero() { raycaster.setFromCamera(ndc, camera); const h = raycaster.intersectObject(telePantalla)[0]; if (h && h.uv) { JB.mira.x = clamp(h.uv.x * JB.W, 0, JB.W); JB.mira.y = clamp((1 - h.uv.y) * JB.H, 0, JB.H); } }
function chispas(x, y, n, color) { if (reduced) return; for (let k = 0; k < n; k++) JB.chispas.push({ x, y, vx: (Math.random() - 0.5) * 320, vy: (Math.random() - 0.5) * 320, vida: 0.45, color }); }
function textoFlota(x, y, t, color) { JB.textos.push({ x, y, t, color, vida: 0.9 }); }
function corrBugs(dt, t) {
  const pad = leePad();
  if (JB.fase === 'titulo' || JB.fase === 'fin') { if (pad && (pad.x || pad.op) && t - JB.ult > 400) { JB.ult = t; nuevaPartida(); } return; }
  JB.textos.forEach(x => { x.y -= 30 * dt; x.vida -= dt; }); JB.textos = JB.textos.filter(x => x.vida > 0);
  JB.chispas.forEach(c => { c.x += c.vx * dt; c.y += c.vy * dt; c.vida -= dt; }); JB.chispas = JB.chispas.filter(c => c.vida > 0);
  if (JB.fase === 'archivo') { JB.banner -= dt; if (JB.banner <= 0) abreArchivo(); return; }
  const T = JB.teclas, j = JB.j;
  // moverse, con inercia (arranca y frena: tiene peso)
  let mx = (T.has('d') ? 1 : 0) - (T.has('a') ? 1 : 0), my = (T.has('s') ? 1 : 0) - (T.has('w') ? 1 : 0);
  if (pad && Math.abs(pad.mx) + Math.abs(pad.my) > 0) { mx = pad.mx; my = pad.my; }
  const nm = Math.hypot(mx, my); if (nm > 1) { mx /= nm; my /= nm; }
  const kv = reduced ? 1 : 1 - Math.exp(-dt * 11);
  j.vx += (mx * 285 - j.vx) * kv; j.vy += (my * 285 - j.vy) * kv;
  j.x = clamp(j.x + j.vx * dt, 16, JB.W - 16); j.y = clamp(j.y + j.vy * dt, 40, JB.H - 16);
  // apuntar: el mando (palanca derecha), las flechas o la retícula del ratón
  let dx = (T.has('arrowright') ? 1 : 0) - (T.has('arrowleft') ? 1 : 0), dy = (T.has('arrowdown') ? 1 : 0) - (T.has('arrowup') ? 1 : 0), dispara = false;
  if (pad && Math.abs(pad.dx) + Math.abs(pad.dy) > 0) { dx = pad.dx; dy = pad.dy; JB.mira.x = clamp(j.x + dx * 140, 0, JB.W); JB.mira.y = clamp(j.y + dy * 140, 0, JB.H); dispara = pad.r2 || true; }
  else if (Math.hypot(dx, dy) > 0.2) dispara = true;
  else { dx = JB.mira.x - j.x; dy = JB.mira.y - j.y; dispara = JB.disparando || T.has(' ') || (pad && pad.r2); }
  const nd = Math.hypot(dx, dy); if (nd > 1) JB.dir = [dx / nd, dy / nd];
  JB.cad -= dt; JB.rapido -= dt; JB.lento -= dt; JB.inv -= dt; JB.temblor = Math.max(0, JB.temblor - dt * 3);
  if (dispara && JB.cad <= 0 && nd > 1) { JB.balas.push({ x: j.x + JB.dir[0] * 16, y: j.y + JB.dir[1] * 16, vx: JB.dir[0] * 690, vy: JB.dir[1] * 690, vida: 1.1 }); JB.cad = JB.rapido > 0 ? 0.065 : 0.15; }
  JB.balas.forEach(b => { b.x += b.vx * dt; b.y += b.vy * dt; b.vida -= dt; });
  JB.balas = JB.balas.filter(b => b.vida > 0 && b.x > -10 && b.x < JB.W + 10 && b.y > -10 && b.y < JB.H + 10);
  const lentitud = JB.lento > 0 ? 0.45 : 1;
  for (const b of JB.bugs) {
    if (b.espera > 0) { b.espera -= dt; continue; }
    const ddx = j.x - b.x, ddy = j.y - b.y, d = Math.hypot(ddx, ddy) || 1; b.fase += dt * 12;
    const zig = b.tipo === 'off' ? Math.sin(b.fase * 0.5) * 0.7 : 0;
    if (b.tipo === 'jefe') { b.r = Math.min(64, b.r + dt * 1.6); b.gotaT -= dt; if (b.gotaT <= 0) { b.gotaT = 1.6; JB.bugs.push({ x: b.x, y: b.y, linea: -1, tipo: 'gota', vida: 1, r: TIPO.gota.r, v: TIPO.gota.v, fase: 0, espera: 0 }); } }
    b.x += (ddx / d + (-ddy / d) * zig) * b.v * lentitud * dt; b.y += (ddy / d + (ddx / d) * zig) * b.v * lentitud * dt;
    for (const s2 of JB.balas) if (s2.vida > 0 && Math.hypot(s2.x - b.x, s2.y - b.y) < b.r + 4) { s2.vida = 0; b.vida--; b.golpe = 0.1; chispas(s2.x, s2.y, 3, TIPO[b.tipo].color); if (b.vida <= 0) break; }
    if (d < b.r + 11 && JB.inv <= 0) { JB.vidas--; JB.inv = 1.6; JB.temblor = 1; JB.j.vx = -ddx / d * 260; JB.j.vy = -ddy / d * 260; anuncia(JB.vidas > 0 ? 'Te ha picado un ' + ERR[b.tipo] + '. Te quedan ' + JB.vidas + '.' : 'No compila. Fin de la partida.'); }
  }
  const nuevos = [];
  JB.bugs = JB.bugs.filter(b => {
    if (b.golpe) b.golpe -= dt;
    if (b.vida > 0) return true;
    const T2 = TIPO[b.tipo]; JB.puntos += T2.pts; textoFlota(b.x, b.y - b.r, '+' + T2.pts, T2.color); chispas(b.x, b.y, b.tipo === 'jefe' ? 40 : 10, T2.color);
    if (b.tipo === 'seg') [-1, 1].forEach(sg => nuevos.push({ x: b.x + sg * 14, y: b.y, linea: b.linea, tipo: 'colgante', vida: 1, r: TIPO.colgante.r, v: TIPO.colgante.v, fase: 0, espera: 0 }));
    if (b.tipo === 'jefe') JB.bugs.filter(x => x.tipo === 'gota').forEach(x => { x.vida = 0; });
    const azar = Math.random(); if (azar < 0.08) JB.cosas.push({ x: b.x, y: b.y, tipo: 'cafe', vida: 6 }); else if (azar < 0.12) JB.cosas.push({ x: b.x, y: b.y, tipo: 'patito', vida: 6 });
    return false;
  });
  JB.bugs.push(...nuevos);
  // una línea se arregla cuando no quedan bugs suyos
  JB.lineas.forEach((L, i) => { if (L.err && !L.arreglada && !JB.bugs.some(b => b.linea === i)) { L.arreglada = true; textoFlota(ED.x0 + 300, ED.y0 + i * ED.lh - 6, 'arreglado', '#5BD39A'); } });
  JB.cosas = JB.cosas.filter(c => { c.vida -= dt; if (Math.hypot(c.x - j.x, c.y - j.y) < 24) { if (c.tipo === 'cafe') { JB.rapido = 5; anuncia('Café: disparo rápido.'); } else { JB.lento = 4; anuncia('El patito: se lo explicas y todo va más despacio.'); } textoFlota(c.x, c.y - 16, c.tipo === 'cafe' ? 'café' : 'patito', '#F5C06B'); return false; } return c.vida > 0; });
  if (JB.vidas <= 0) { JB.fase = 'fin'; JB.disparando = false; if (JB.puntos > JB.record) { JB.record = JB.puntos; JB.recordNuevo = true; guardado.set('record-bugs', JB.record); } return; }
  if (!JB.bugs.length) { JB.puntos += 50; JB.fase = 'archivo'; JB.banner = reduced ? 1.2 : 2.2; anuncia(archivoDe(JB.archivo).n + ' compila. Más 50.'); }
}
function dibujaBug(c, b, t) {
  const T = TIPO[b.tipo], r = b.r, a = JB.j && JB.fase === 'juego' ? Math.atan2(JB.j.y - b.y, JB.j.x - b.x) : -Math.PI / 2;
  c.save(); c.translate(b.x, b.y); c.rotate(a + Math.PI / 2);
  if (b.tipo === 'jefe' || b.tipo === 'gota') {   // la fuga: una mancha que tiembla
    c.fillStyle = b.golpe > 0 ? '#FAFAF7' : T.color; c.beginPath();
    for (let k = 0; k <= 24; k++) { const an = k / 24 * Math.PI * 2, rr2 = r * (1 + 0.08 * Math.sin(an * 5 + t / 160)); c.lineTo(Math.cos(an) * rr2, Math.sin(an) * rr2); }
    c.fill(); c.fillStyle = '#1E1B2E'; [-1, 1].forEach(sx => { c.beginPath(); c.arc(sx * r * 0.3, -r * 0.25, Math.max(2, r * 0.12), 0, Math.PI * 2); c.fill(); }); c.restore(); return;
  }
  c.strokeStyle = '#141221'; c.lineWidth = 2;
  for (let k = -1; k <= 1; k++) [-1, 1].forEach(s2 => { const w = Math.sin(b.fase + k) * 3; c.beginPath(); c.moveTo(s2 * r * 0.5, k * r * 0.4); c.lineTo(s2 * (r + 6), k * r * 0.5 + w); c.stroke(); });
  c.fillStyle = b.golpe > 0 ? '#FAFAF7' : T.color; c.beginPath(); c.ellipse(0, 0, r * 0.72, r, 0, 0, Math.PI * 2); c.fill(); c.stroke();
  c.fillStyle = 'rgba(20,18,33,.25)'; c.beginPath(); c.ellipse(0, r * 0.15, r * 0.5, r * 0.6, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#141221'; c.beginPath(); c.arc(0, -r * 0.92, r * 0.4, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.moveTo(-3, -r * 1.2); c.lineTo(-r * 0.5, -r * 1.75); c.moveTo(3, -r * 1.2); c.lineTo(r * 0.5, -r * 1.75); c.stroke();
  c.restore();
}
const SINTAXIS = /\b(class|int|void|char|return|while|for|if|def|in|print|new|null|NULL|include|pthread_t|static)\b/g;
function dibujaCodigo(c, opac = 1) {
  const A = archivoDe(Math.max(1, JB.archivo)), L = JB.lineas.length ? JB.lineas : A.cod.map((t, i) => ({ t, err: A.bugs[i] || null, arreglada: false }));
  c.globalAlpha = opac;
  c.fillStyle = '#1E1B2E'; c.fillRect(0, 0, JB.W, JB.H);
  c.fillStyle = '#26223A'; c.fillRect(0, 0, ED.x0 - 10, JB.H); c.fillRect(0, 0, JB.W, 34);
  c.fillStyle = '#2E2A42'; c.fillRect(ED.x0 - 10, 0, 260, 34); c.fillStyle = '#A99EF5'; c.font = '600 16px ' + MONO; c.fillText(A.n, ED.x0 + 4, 23);
  c.font = '500 18px ' + MONO;
  L.forEach((l, i) => {
    const y = ED.y0 + i * ED.lh;
    c.fillStyle = '#5A566E'; c.textAlign = 'right'; c.fillText(String(i + 1), ED.x0 - 22, y); c.textAlign = 'left';
    // resaltado sencillo: palabras clave en violeta, cadenas en coral claro, números en ámbar, comentarios en gris
    let x = ED.x0 + 20; const partes = l.t.split(/(\/\/.*$|#.*$|"[^"]*"|'[^']*'|\b\d+\b|\b(?:class|int|void|char|return|while|for|if|def|in|print|new|null|NULL|include|pthread_t|static|sum|len|range|malloc)\b)/);
    // sin ligaduras (norma de la web): JetBrains Mono une «!=» o «->»
    partes.forEach(pz => { if (!pz) return; c.fillStyle = /^(\/\/|#)/.test(pz) ? '#8E8AA3' : /^["']/.test(pz) ? '#FF9B80' : /^\d+$/.test(pz) ? '#F5C06B' : /^(sum|len|range|malloc|print)$/.test(pz) ? '#9CC3FF' : SINTAXIS.test(pz) ? '#A99EF5' : '#E8E6F5'; SINTAXIS.lastIndex = 0;
      // el ZWNJ no basta en un lienzo: los signos seguidos se escriben uno a uno, así no se juntan
      if (/[!=<>+\-&|*\/:]{2}/.test(pz)) { for (const ch of pz) { c.fillText(ch, x, y); x += c.measureText(ch).width; } } else { c.fillText(pz, x, y); x += c.measureText(pz).width; } });
    if (l.err) {
      const w = Math.min(560, Math.max(60, x - ED.x0 - 20)); c.strokeStyle = l.arreglada ? '#5BD39A' : '#C2362B'; c.lineWidth = 2; c.beginPath();
      for (let k = 0; k <= w; k += 6) c.lineTo(ED.x0 + 20 + k, y + 6 + ((k / 6) % 2 ? 3 : 0)); c.stroke();
      c.font = '600 14px ' + MONO; c.fillStyle = l.arreglada ? '#5BD39A' : '#FF6B4A'; c.textAlign = 'right'; c.fillText(l.arreglada ? '// arreglado' : ERR[l.err], JB.W - 20, y); c.textAlign = 'left'; c.font = '500 18px ' + MONO;
    }
  });
  c.globalAlpha = 1;
}
function dibujaBugs(t) {
  const c = teleTex.userData.g, { W, H } = JB;
  c.save();
  if (JB.temblor > 0 && !reduced) c.translate((Math.random() - 0.5) * 8 * JB.temblor, (Math.random() - 0.5) * 8 * JB.temblor);
  if (JB.fase === 'titulo' || JB.fase === 'fin') {
    dibujaCodigo(c, 0.28);
    c.fillStyle = 'rgba(20,18,33,.55)'; c.fillRect(0, 0, W, H);
    c.textAlign = 'center';
    if (JB.fase === 'titulo') {
      c.fillStyle = '#FAFAF7'; c.font = '600 72px ' + DISP; c.fillText('Caza de bugs', W / 2, 128);
      c.fillStyle = '#F5C06B'; c.font = '700 30px ' + MANO; c.fillText('Lo hice un fin de semana antes de un examen, para desestresarme.', W / 2, 180); c.fillText('Los bugs son de mi código de 1º. —S.', W / 2, 214);
      c.fillStyle = '#E8E6F5'; c.font = '500 21px ' + BODY;
      ['Moverte: W A S D · palanca izquierda', 'Apuntar: el ratón · palanca derecha · flechas', 'Disparar: clic (mantenlo) · R2'].forEach((l, i) => c.fillText(l, W / 2, 278 + i * 32));
      c.fillStyle = '#9CC3FF'; c.font = '500 18px ' + BODY; c.fillText('El café: disparo rápido · el patito: todo más lento · los rojos se parten', W / 2, 386);
      c.fillStyle = '#FF6B4A'; c.font = '600 28px ' + BODY; c.fillText('Clic, Intro o X para empezar', W / 2, 446);
      c.fillStyle = '#C9C5DC'; c.font = '500 18px ' + MONO; c.fillText('récord ' + String(JB.record).padStart(5, '0'), W / 2, 482);
      ['npe', 'off', 'seg'].forEach((k, i) => dibujaBug(c, { x: 200 + i * 280, y: 512, r: TIPO[k].r * 0.8, tipo: k, fase: t / 120 + i }, t));
    } else {
      c.fillStyle = '#FF6B4A'; c.font = '600 76px ' + DISP; c.fillText('No compila', W / 2, 168);
      c.fillStyle = '#FAFAF7'; c.font = '500 28px ' + BODY; c.fillText(JB.puntos + ' puntos · ' + (JB.archivo) + (JB.archivo === 1 ? ' archivo' : ' archivos'), W / 2, 232);
      c.fillStyle = '#F5C06B'; c.font = '600 30px ' + BODY; c.fillText(JB.recordNuevo ? 'Récord nuevo' : 'Récord: ' + JB.record, W / 2, 284);
      c.fillStyle = '#E8E6F5'; c.font = '500 22px ' + BODY; c.fillText('Clic o Intro: otra partida · Esc: salir', W / 2, 378);
    }
    c.textAlign = 'left';
  } else {
    dibujaCodigo(c, 1);
    JB.cosas.forEach(cf => { if (cf.vida < 1.5 && Math.floor(t / 120) % 2) return;
      if (cf.tipo === 'cafe') { c.fillStyle = '#FF6B4A'; rr(c, cf.x - 9, cf.y - 10, 18, 20, 4); c.fill(); c.strokeStyle = '#FF6B4A'; c.lineWidth = 3; c.beginPath(); c.arc(cf.x + 11, cf.y, 5, -Math.PI / 2, Math.PI / 2); c.stroke(); }
      else { c.fillStyle = '#F5C06B'; c.beginPath(); c.ellipse(cf.x, cf.y + 3, 11, 8, 0, 0, Math.PI * 2); c.fill(); c.beginPath(); c.arc(cf.x - 5, cf.y - 7, 6, 0, Math.PI * 2); c.fill(); c.fillStyle = '#FF6B4A'; c.fillRect(cf.x - 15, cf.y - 8, 6, 3); } });
    JB.bugs.forEach(b => { if (b.espera <= 0) dibujaBug(c, b, t); else { c.fillStyle = 'rgba(194,54,43,' + (0.25 + 0.25 * Math.sin(t / 90)) + ')'; c.beginPath(); c.arc(b.x, b.y, 5, 0, Math.PI * 2); c.fill(); } });
    c.fillStyle = JB.rapido > 0 ? '#F5C06B' : '#FF9B80';
    JB.balas.forEach(b => { c.save(); c.translate(b.x, b.y); c.rotate(Math.atan2(b.vy, b.vx)); rr(c, -7, -2.5, 14, 5, 2.5); c.fill(); c.restore(); });
    JB.chispas.forEach(s2 => { c.globalAlpha = Math.max(0, s2.vida / 0.45); c.fillStyle = s2.color; c.fillRect(s2.x, s2.y, 3, 3); }); c.globalAlpha = 1;
    // el depurador: una flecha de cursor con su barra, mirando a la retícula
    const j = JB.j, a = Math.atan2(JB.dir[1], JB.dir[0]);
    if (JB.inv <= 0 || Math.floor(t / 90) % 2) { c.save(); c.translate(j.x, j.y); c.rotate(a); c.fillStyle = JB.lento > 0 ? '#F5C06B' : '#FF6B4A'; c.beginPath(); c.moveTo(17, 0); c.lineTo(-11, -12); c.lineTo(-5, 0); c.lineTo(-11, 12); c.closePath(); c.fill(); c.strokeStyle = '#FAFAF7'; c.lineWidth = 2; c.stroke(); c.fillStyle = '#FAFAF7'; c.fillRect(-16, -8, 3, 16); c.restore(); }
    // la retícula
    if (!JB.pad || !(Math.abs(JB.pad.dx) + Math.abs(JB.pad.dy))) { const m = JB.mira; c.strokeStyle = '#FAFAF7'; c.lineWidth = 2; c.beginPath(); c.arc(m.x, m.y, 12, 0, Math.PI * 2); c.stroke(); [[-20, 0, -7, 0], [7, 0, 20, 0], [0, -20, 0, -7], [0, 7, 0, 20]].forEach(([a1, b1, a2, b2]) => { c.beginPath(); c.moveTo(m.x + a1, m.y + b1); c.lineTo(m.x + a2, m.y + b2); c.stroke(); }); }
    JB.textos.forEach(x => { c.globalAlpha = clamp(x.vida / 0.5, 0, 1); c.fillStyle = x.color; c.font = '600 18px ' + MONO; c.fillText(x.t, x.x, x.y); }); c.globalAlpha = 1;
    // la barra: puntos, récord e intentos
    c.fillStyle = '#FAFAF7'; c.font = '600 18px ' + MONO; c.textAlign = 'right'; c.fillText(String(JB.puntos).padStart(5, '0') + '   récord ' + String(JB.record).padStart(5, '0'), JB.W - 112, 23); c.textAlign = 'left';
    c.fillStyle = '#8E8AA3'; c.font = '500 14px ' + BODY; c.fillText('archivo ' + JB.archivo + (JB.pad ? ' · mando' : ''), ED.x0 + 270, 23);
    for (let k = 0; k < 3; k++) { c.fillStyle = k < JB.vidas ? '#FF6B4A' : 'rgba(255,107,74,.22)'; rr(c, JB.W - 96 + k * 28, 9, 20, 16, 4); c.fill(); }
    if (JB.fase === 'archivo') {
      c.fillStyle = 'rgba(20,18,33,.72)'; c.fillRect(0, H / 2 - 74, W, 148); c.textAlign = 'center';
      c.strokeStyle = '#5BD39A'; c.lineWidth = 6; c.beginPath(); c.moveTo(W / 2 - 230, H / 2 - 12); c.lineTo(W / 2 - 214, H / 2 + 4); c.lineTo(W / 2 - 188, H / 2 - 26); c.stroke();
      c.fillStyle = '#FAFAF7'; c.font = '600 40px ' + MONO; c.fillText(archivoDe(JB.archivo).n + ' compila', W / 2 + 20, H / 2);
      const sig = archivoDe(JB.archivo + 1); c.fillStyle = '#C9C5DC'; c.font = '500 20px ' + BODY; c.fillText('+50 · siguiente: ' + sig.n + (sig.bugs[4] === 'jefe' && Object.keys(sig.bugs).length === 1 ? ' (cuidado)' : ''), W / 2, H / 2 + 44); c.textAlign = 'left';
    }
  }
  c.restore(); teleTex.needsUpdate = true;
}
async function juegaBugs() {
  cambia('ocupado'); setHover(null); mirarDesde = 'mando';
  JB.activo = true; JB.fase = 'titulo'; JB.teclas.clear(); JB.lineas = [];
  if (!tele.on) enciendeTele(true);
  dibujaBugs(performance.now());
  const lejos = ojos().distanceTo(v3(1.02, 1.5, 2.8)) > 2.8;
  if (lejos || jug.sentado || enSillon.si) { if (enSillon.si) await levantaDelSillon(); await irA('tele'); cambia('ocupado'); }
  enfoca(v3(1.02, 1.5, 2.8), ojos(), 34, { paralaje: 0, rate: 3.5 });   // v0.2.5: la tele llena la vista (antes, 46°)
  await espera(reduced ? 0 : 450);
  JB.activo = true; JB.fase = 'titulo'; JB.teclas.clear(); dibujaBugs(performance.now());
  punto.el.style.opacity = '0';   // en el juego manda la retícula de la tele
  cambia('tv'); anuncia('Caza de bugs, en la tele. W A S D para moverte, el ratón apunta y el clic dispara; también con un mando o con las flechas. Clic o Intro para empezar. Esc para salir.');
}
const TECLAS_JB = new Set(['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ']);
modo('tv', {
  punto: () => ['punto'],
  move() { miraDesdePuntero(); },
  down() { miraDesdePuntero(); if (JB.fase === 'juego') JB.disparando = true; },
  up() { JB.disparando = false; if (JB.fase === 'titulo' || JB.fase === 'fin') nuevaPartida(); },
  tecla(e) {
    const k = e.key.toLowerCase();
    if (TECLAS_JB.has(k)) { JB.teclas.add(k); return true; }
    if (e.key === 'Enter' && (JB.fase === 'titulo' || JB.fase === 'fin')) { nuevaPartida(); return true; }
    return false;
  },
  esc() { JB.activo = false; JB.fase = 'titulo'; JB.teclas.clear(); JB.disparando = false; punto.el.style.opacity = ''; enciendeTele(false); sueltaFoco(); cambia('libre'); devuelveFoco('mando'); anuncia('Apagas la tele. Récord: ' + JB.record + '.'); }
});
addEventListener('keyup', e => { JB.teclas.delete(e.key.toLowerCase()); });
objetos.get('mando').alClic = () => juegaBugs();
objetos.get('tele').alClic = () => juegaBugs();
objetos.get('mando').nombre = 'DualSense · jugar a «Caza de bugs»';
objetos.get('tele').nombre = 'Tele · «Caza de bugs»';
function corrJuego(dt, t) {
  if (!JB.activo) return;
  corrBugs(Math.min(dt, 0.05), t);
  if (t - JB.pinta > 33) { JB.pinta = t; dibujaBugs(t); }   // la textura, 30 veces por segundo (subirla cuesta)
}
window.__slMiraJuego = (x, y) => { JB.mira.x = x; JB.mira.y = y; };

/* =====================================================================================================
   EL ALTILLO (E59-8): la caja de las versiones y la cápsula del tiempo
   ===================================================================================================== */
// v0.2.5 (biblia, sección 5): «Cómo era mi cuarto», contado desde dentro (fechas, no números de versión)
const VERSIONES = [
  ['', '3 nov', 'Así lo pensé: una mesa y una silla.', 'v0.1-3d-frente'],
  ['', '4 nov', 'Sin botones: las cosas se cogen y se sueltan.', 'v0.2-3d-frente'],
  ['', '4 nov', 'Le puse ventana, con la hora de verdad.', 'v0.2.1-3d-frente'],
  ['', '4 nov', 'Quise caminar: el cuarto entero.', 'v0.2.2-3d-frente'],
  ['', '5 nov', 'Lo limpié: menos cosas, mejor puestas.', 'v0.2.3-3d-el-cuarto-limpio'],
  ['', 'hoy', 'Así está: cada cosa, con su uso.', null]
];
const fotosVersiones = {};
Object.entries(FOTOS_VERSIONES).forEach(([k, b64]) => { const i = new Image(); i.onload = () => { if (gesto.estado === 'papel' && papel.dibuja === dibujaVersiones) rePapel(); }; i.src = 'data:image/jpeg;base64,' + b64; fotosVersiones[k] = i; });
function dibujaVersiones(c, w, h) {
  c.fillStyle = '#C9A67A'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(90,55,25,.12)'; for (let i = 0; i < 300; i++) c.fillRect((i * 97) % w, (i * 53) % h, 3, 2);
  c.fillStyle = '#2E2A42'; c.font = '700 54px ' + MANO; c.fillText('Cómo era mi cuarto', 36, 70);
  const CW = (w - 36 * 2 - 2 * 22) / 3, CH = 280;
  VERSIONES.forEach(([v, f, t, foto], i) => {
    const col = i % 3, fila = Math.floor(i / 3), x = 36 + col * (CW + 22), y = 100 + fila * (CH + 24), giro = ((i * 37) % 7 - 3) * 0.012;
    c.save(); c.translate(x + CW / 2, y + CH / 2); c.rotate(giro); c.translate(-CW / 2, -CH / 2);
    c.shadowColor = 'rgba(0,0,0,.3)'; c.shadowBlur = 10; c.shadowOffsetY = 4; c.fillStyle = '#FBF8EF'; c.fillRect(0, 0, CW, CH); c.shadowColor = 'transparent';
    const iw = CW - 24, ih = iw * 9 / 16, img = foto && fotosVersiones[foto];
    if (img && img.complete && img.naturalWidth) c.drawImage(img, 12, 12, iw, ih);
    else { c.fillStyle = '#2B2740'; c.fillRect(12, 12, iw, ih); c.fillStyle = '#FF9B80'; c.font = '600 22px ' + BODY; c.textAlign = 'center'; c.fillText(foto ? '' : 'mira a tu alrededor', CW / 2, 12 + ih / 2 + 8); c.textAlign = 'left'; }
    c.fillStyle = '#2E2A42'; c.font = '700 34px ' + MANO; c.fillText(f, 14, ih + 56); c.font = '600 25px ' + MANO; wrap(c, t, 14, ih + 92, CW - 26, 28);
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
    wrap(c, 'Escribe una nota para ti dentro de ' + CAPSULA_DIAS + ' días. Cuando la selles, no se podrá abrir hasta entonces.', 50, 146, w - 100, 32);
    c.fillStyle = '#FBF8EF'; rr(c, 40, 230, w - 80, 520, 16); c.fill();
    c.fillStyle = '#2E2A42'; c.font = '700 40px ' + MANO; const y = wrap(c, capsulaEd.texto + (Math.floor(performance.now() / 500) % 2 ? '|' : ' '), 66, 290, w - 132, 46);
    c.fillStyle = '#8E8AA3'; c.font = '500 20px ' + BODY; c.fillText(capsulaEd.texto.length + ' / 280 · cuando la selles, no se abre hasta dentro de ' + CAPSULA_DIAS + ' días', 50, h - 50);
  } else if (!capsulaAbre()) {
    wrap(c, 'Sellada el ' + fechaCorta(capsula.fecha) + '. Se abre el ' + fechaCorta(capsula.abre) + ' (' + Math.max(0, Math.round((new Date(capsula.abre) - new Date(hoyISO())) / DIA)) + ' días).', 50, 146, w - 100, 32);
    c.fillStyle = '#8E8AA3'; c.beginPath(); c.arc(w / 2, 480, 120, 0, Math.PI * 2); c.fill(); c.fillStyle = '#5A566E'; rr(c, w / 2 - 60, 430, 120, 100, 14); c.fill();
    c.strokeStyle = '#5A566E'; c.lineWidth = 16; c.beginPath(); c.arc(w / 2, 430, 42, Math.PI, 0); c.stroke();
  } else {
    wrap(c, 'Escrita el ' + fechaCorta(capsula.fecha) + ':', 50, 146, w - 100, 32);
    c.fillStyle = '#FBF8EF'; rr(c, 40, 190, w - 80, 560, 16); c.fill(); c.fillStyle = '#2E2A42'; c.font = '700 40px ' + MANO; wrap(c, capsula.texto, 66, 250, w - 132, 46);
    c.fillStyle = '#8E8AA3'; c.font = '500 20px ' + BODY; c.fillText('Si la vacías, puedes escribir otra.', 50, h - 50);
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
function puertaAltillo(i, abrir) { const P = altilloPuertas[i], a0 = P.abierta; P.abierta = abrir ? 1 : 0; return anim(reduced ? 1 : 700, e => { P.p.rotation.y = P.s * 1.3 * lerp(a0, P.abierta, e); }, curva.pesoSin); }
/* v0.2.5 (E60-3, boceto 02): la caja y la lata se sacan ENTERAS por la puerta del altillo (suben 2 cm, salen 45 cm hacia el
   cuarto y bajan a tus manos, inclinadas hacia ti); su tapa se abre y lo que se lee sale por arriba. Esc: todo al revés */
const casaDe = m => ({ pos: m.position.clone(), quat: m.quaternion.clone() });
const CASA_ALTILLO = [casaDe(cajaVersiones), casaDe(capsulaLata)];
function poseManos(dist = 0.46, bajo = 0.24, inclina = 0.75) {
  const d = camera.getWorldDirection(new THREE.Vector3()); d.y = 0; d.normalize();
  const p = camera.position.clone().addScaledVector(d, dist); p.y -= bajo;
  return [p, new THREE.Quaternion().setFromEuler(new THREE.Euler(inclina, Math.atan2(-d.x, -d.z), 0, 'YXZ'))];
}
const salidaAltillo = c => [c.pos.clone(), c.pos.clone().add(v3(0, 0.02, 0)), c.pos.clone().add(v3(0, 0.02, -0.45))];
async function abreAltillo(i) {
  cambia('ocupado'); setHover(null);
  await miraA([i ? PASILLO.x1 - 0.22 : PASILLO.x0 + 0.24, 2.0, PASILLO.z0], 500);
  await puertaAltillo(i, true);
  const cont = i ? capsulaLata : cajaVersiones, tapa = i ? tapaLata : tapaVersiones, casa = CASA_ALTILLO[i];
  await trayecto(cont, { puntos: salidaAltillo(casa), fin: () => poseManos(), dur: 1400, alto: 0.06 });
  if (i === 0) await anim(reduced ? 1 : 520, e => { tapa.rotation.x = -1.75 * e; }, curva.pesoSin);
  else await anim(reduced ? 1 : 600, e => { tapa.position.set(0.14 * curva.suave(tramo(e, 0.35, 1)), 0.1 + 0.05 * Math.sin(Math.PI * Math.min(1, e * 1.4)), 0); tapa.rotation.z = -0.5 * curva.suave(tramo(e, 0.35, 1)); }, curva.pesoSin);
  const guardaCont = async () => {
    if (i === 0) await anim(reduced ? 1 : 420, e => { tapa.rotation.x = -1.75 * (1 - e); }, curva.pesoSin);
    else await anim(reduced ? 1 : 480, e => { const k = 1 - e; tapa.position.set(0.14 * k, 0.1 + 0.05 * Math.sin(Math.PI * k), 0); tapa.rotation.z = -0.5 * k; }, curva.pesoSin);
    await trayecto(cont, { puntos: salidaAltillo(casa), qFin: casa.quat, vuelta: true, dur: 1300, alto: 0.06 });
    await asienta(cont, 2); await puertaAltillo(i, false);
  };
  const deDentro = { pos: () => cont.localToWorld(v3(0, i ? 0 : -0.066, 0)), quat: () => cont.getWorldQuaternion(new THREE.Quaternion()).multiply(i ? new THREE.Quaternion() : Q_ARRIBA),
    salida: () => [cont.localToWorld(v3(0, i ? 0.215 : 0.16, 0))], dur: 900, durVuelta: 800, alto: 0.05 };
  if (i === 0) {
    deDentro.ocultar = [];
    await abrePapel({ dibuja: dibujaVersiones, tam: [0.3, 0.25], grosor: 0.0025, dist: 0.4, clave: 'altillo-1', desde: deDentro, alVolver: guardaCont,
      texto: 'Cómo era mi cuarto: ' + VERSIONES.map(v => v[1] + ', ' + v[2]).join(' ') + ' Esc para guardarlo.' });
  } else {
    capsulaEd.texto = '';
    const c = guardado.get('capsula', null), rollo = capsulaLata.userData.rollo; deDentro.ocultar = [rollo];
    await abrePapel({ ayuda: 'Escribe · Intro: sellarla · Supr: vaciarla si ya se abrió · Esc: guardarla', dibuja: dibujaCapsula, tam: [0.15, 0.19], dist: 0.3, clave: 'altillo-2', extra: capsulaExtra, desde: deDentro, alVolver: guardaCont,
      texto: !c ? 'La cápsula del tiempo, vacía. Escribe una nota para ti dentro de ' + CAPSULA_DIAS + ' días e Intro para sellarla.' : (hoyISO() >= c.abre ? 'La cápsula se abre: ' + c.texto : 'La cápsula está sellada hasta el ' + fechaCorta(c.abre) + '.') });
  }
}
altilloPuertas.forEach((P, i) => registrar('altillo-' + (i + 1), { nombre: 'Altillo · ' + (i ? 'la cápsula del tiempo' : 'cómo era mi cuarto'), mallas: [P.hoja, P.pomo], puntero: 'mano', lugar: 'altillo', alcance: 2.2, brilloK: 0.35, alClic: () => abreAltillo(i) }));
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
  if (misIdeas.length < 40 && y < h - 30) { c.fillStyle = '#4638B8'; c.font = '700 34px ' + MANO; c.fillText('tú', 58, y); c.fillStyle = libretaEd.texto ? '#2E2A42' : '#8E8AA3'; cabe(c, libretaEd.texto ? libretaEd.texto + (Math.floor(performance.now() / 500) % 2 ? '|' : '') : 'escribe la tuya', 172, y, w - 210, 36, '700', MANO); }
}
const libretaExtra = {
  tecla: e => {
    if (e.key === 'Enter') { const t = libretaEd.texto.trim(); if (!t) return true; const f = new Date(); misIdeas.push([f.getDate() + ' ' + MESES[f.getMonth()], t]); guardado.set('ideas', misIdeas); libretaEd.texto = ''; rePapel(); anuncia('Idea apuntada: ' + t + '.'); return true; }
    const r = teclea(e, libretaEd.texto, 60); if (r.ok) { libretaEd.texto = r.t; rePapel(); } return r.ok;
  }
};
cajonMesita[1].dibuja = dibujaLibretaV; cajonMesita[1].extra = libretaExtra;
cajonMesita[1].texto = 'La libreta de ideas. Escribe la tuya e Intro para apuntarla.';
cajonMesita[1].ayuda = 'Escribe tu idea · Intro: apuntarla · Esc: guardarla'; cajonMesita[0].ayuda = 'Clic o 1-4: abre la asignatura en la web · Esc: guardarlo';
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
// v0.2.5 (E60-2, regla 3, boceto 01): el pósit es la hoja de arriba de su taco. Al cogerla, el taco baja 0,4 mm; la hoja
// sube, sale del cajón y viene a ti; al pegarla, vuela de tu mano a la pared. Si la guardas sin pegar, vuelve a su taco.
// Al despegarla de la pared, se pela por arriba y va a tu mano (no vuelve al taco: ya está escrita)
const POSIT_COLORES = tacosPosit.map(m => '#' + m.userData.color.toString(16).toUpperCase().padStart(6, '0'));
const posits = { lista: guardado.get('posits', []), mallas: [], ed: '', color: 0, pegando: null, taco: guardado.get('taco-posits', tacosPosit.map(() => TACO.max)) };
tacosPosit.forEach((m, k) => altoTaco(m, posits.taco[k]));
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
async function despegaPosit(m, d) {
  const k = posits.lista.indexOf(d); if (k >= 0) posits.lista.splice(k, 1); guardado.set('posits', posits.lista);
  const o = objetos.get(m.userData.clave); if (o) { o.activo = () => false; }
  anuncia('Despegas el pósit «' + d.t + '».');
  // se pela por arriba: gira sobre su canto de arriba (geometría desplazada para que el eje sea ese canto)
  m.geometry = positGeo.clone(); m.geometry.translate(0, -0.038, 0); m.translateY(0.038);
  const q0 = m.quaternion.clone(); await anim(reduced ? 1 : 300, e => { m.quaternion.copy(q0).multiply(new THREE.Quaternion().setFromAxisAngle(v3(1, 0, 0), -0.9 * e)); }, curva.pesoSin);
  // y va a tu mano, por debajo de la vista
  await trayecto(m, { puntos: [m.position.clone()], fin: () => { const d2 = camera.getWorldDirection(new THREE.Vector3()), ab = v3(0, -1, 0).applyQuaternion(camera.quaternion); return [camera.position.clone().addScaledVector(d2, 0.3).addScaledVector(ab, 0.3), camera.quaternion.clone()]; }, dur: 700, alto: 0.03 });
  scene.remove(m);
}
function dibujaPositPapel(c, w, h) {
  c.fillStyle = POSIT_COLORES[posits.color]; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(0,0,0,.06)'; c.fillRect(0, 0, w, 90);
  c.fillStyle = '#2E2A42'; c.font = '700 96px ' + MANO; wrap(c, posits.ed + (Math.floor(performance.now() / 500) % 2 ? '|' : ' '), 50, 220, w - 90, 100);
}
const positExtra = {
  tecla: e => {
    if (e.key === 'Enter') { if (!posits.ed.trim()) return true; empiezaPegar(); return true; }
    const r = teclea(e, posits.ed, 40); if (r.ok) { posits.ed = r.t; rePapel(); } return r.ok;
  }
};
setInterval(() => { if (gesto.estado === 'papel' && papel.dibuja === dibujaPositPapel) rePapel(); }, 500);
const positesTaco = tacosPosit;
function cogePosit(kElegido) {
  let k = kElegido ?? posits.color; if (posits.taco[k] <= 0) k = posits.taco.findIndex(n => n > 0); if (k < 0) { anuncia('Se acabaron los pósits.'); return; }
  posits.color = k; posits.ed = ''; const taco = tacosPosit[k];
  const arriba = () => taco.localToWorld(v3(0, 0.5, 0));
  posits.taco[k]--; altoTaco(taco, posits.taco[k]); guardado.set('taco-posits', posits.taco);
  abrePapel({ ayuda: 'Escribe · Intro: pegarlo donde mires · Esc: devolverlo al taco', dibuja: dibujaPositPapel, tam: [0.076, 0.076], grosor: 0.0004, dist: 0.24, canto: taco.userData.color, extra: positExtra, clave: 'posits',
    desde: { pos: () => arriba().add(v3(0, 0.0002, 0)), quat: () => giroTumbado(taco), salida: () => { const a = arriba(); return [a.clone().add(v3(0, 0.01, 0)), ...salidaCajonMesa(a.clone().add(v3(0, 0.01, 0)), 0.038).slice(1)]; },
             alVolver: () => { posits.taco[k]++; altoTaco(taco, posits.taco[k]); guardado.set('taco-posits', posits.taco); }, dur: 900 },
    texto: 'Un pósit en blanco: escribe e Intro para pegarlo donde mires. Esc: lo devuelves al taco.' });
}
tacosPosit.forEach((m, k) => registrar('posits' + (k ? '-2' : ''), { nombre: 'Pósits · coge uno, escríbelo y pégalo', mallas: [m], lugar: 'mesa',
  activo: () => gesto.estado === 'libre' && cajonArribaM.obj > 0.1 && posits.lista.length < 12 && posits.taco[k] > 0, alClic: () => cogePosit(k) }));
// pegar: el pósit va en tu mano (abajo a la derecha) y una sombra marca dónde quedará; clic, Intro o E lo pegan:
// vuela de la mano a la pared y se aprieta
const _rayPosit = new THREE.Raycaster();
function poseManoPosit() { const d = camera.getWorldDirection(new THREE.Vector3()), ab = v3(0, -1, 0).applyQuaternion(camera.quaternion), de = v3(1, 0, 0).applyQuaternion(camera.quaternion); return [camera.position.clone().addScaledVector(d, 0.28).addScaledVector(ab, 0.1).addScaledVector(de, 0.1), camera.quaternion.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.5, -0.3, 0)))]; }
async function empiezaPegar() {
  cambia('ocupado'); rig.fovLee = null;
  await trayecto(hojaPlano, { puntos: [hojaPlano.position.clone()], fin: poseManoPosit, dur: 450, alto: 0.0 });
  const d = { t: posits.ed.trim(), c: POSIT_COLORES[posits.color], p: [0, 0, 0], n: [0, 0, 1], g: (Math.random() - 0.5) * 0.12 };
  const m = new THREE.Mesh(positGeo, new THREE.MeshBasicMaterial({ color: 0x1E1B2E, transparent: true, opacity: 0.28, depthWrite: false })); m.visible = false; scene.add(m);
  posits.pegando = { d, m, ok: false, cuenta: 0 }; sueltaFoco(); cambia('pegar');
  anuncia('Mira donde quieras pegarlo (una pared, el monitor, el corcho, una puerta) y haz clic, Intro o E. Esc: lo devuelves al taco.');
}
function corrPegar() {
  const P = posits.pegando; if (!P || gesto.estado !== 'pegar') return;
  { const [pm, qm] = poseManoPosit(); hojaPlano.position.lerp(pm, 0.4); hojaPlano.quaternion.slerp(qm, 0.4); }   // el pósit, en la mano
  if ((P.cuenta = (P.cuenta + 1) % 2)) return;   // un rayo cada dos fotogramas
  _rayPosit.setFromCamera(control.bloqueado ? new THREE.Vector2(0, 0) : ndc, camera); _rayPosit.far = 3;
  const h = _rayPosit.intersectObjects(scene.children, true).find(x => x.object.isMesh && x.object.visible && x.object !== P.m && x.object !== hojaPlano && x.face && x.object !== movilPantalla);
  if (!h) { P.m.visible = false; P.ok = false; return; }
  const n = h.face.normal.clone().transformDirection(h.object.matrixWorld).normalize();
  if (n.dot(_rayPosit.ray.direction) > 0) n.negate();
  P.m.position.copy(h.point).addScaledVector(n, 0.003); P.m.lookAt(P.m.position.clone().add(n)); P.m.rotateZ(P.d.g); P.m.visible = true; P.ok = true; P.n = n;
}
async function pegaAqui() {
  const P = posits.pegando; if (!P || !P.ok) return;
  cambia('ocupado'); posits.pegando = null; P.m.visible = false;
  const pDest = P.m.position.clone(), qDest = P.m.quaternion.clone();
  await trayecto(hojaPlano, { puntos: [hojaPlano.position.clone()], fin: () => [pDest.clone().addScaledVector(P.n, 0.01), qDest], dur: 650, alto: 0.04 });
  await anim(reduced ? 1 : 140, e => hojaPlano.position.copy(pDest).addScaledVector(P.n, 0.01 * (1 - e)), curva.sale);   // lo aprietas contra la pared
  scene.remove(P.m); hojaPlano.visible = false;
  P.d.p = pDest.toArray().map(v => +v.toFixed(4)); P.d.n = P.n.toArray().map(v => +v.toFixed(4));
  posits.lista.push(P.d); guardado.set('posits', posits.lista); posits.mallas.push(creaPosit(P.d, posits.lista.length - 1));
  sueltaFoco(); cambia('libre'); anuncia('Pósit pegado. Se queda guardado; clic en él para despegarlo.');
}
modo('pegar', {
  punto: () => (posits.pegando && posits.pegando.ok ? ['mano', 'Pegarlo aquí'] : ['punto']),
  move() { actualizaPunto(); }, up() { pegaAqui(); },
  tecla(e) { if (e.key === 'Enter' || e.key === 'e' || e.key === 'E') { pegaAqui(); return true; } return false; },
  async esc() { const P = posits.pegando; if (P) scene.remove(P.m); posits.pegando = null; cambia('ocupado'); await guardaPapel(); sueltaFoco(); cambia('libre'); anuncia('Devuelves el pósit a su taco.'); }
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
    c.fillStyle = '#FBF8EF'; c.fillRect(0, 0, w, h); c.fillStyle = it.color; c.fillRect(0, 0, w, 230);
    c.fillStyle = 'rgba(255,255,255,.18)'; c.beginPath(); c.arc(140, 110, 56, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#FAFAF7'; c.font = '600 30px ' + BODY; c.fillText(it.tipo === 'foto' ? 'Foto' : it.tipo === 'entrada' ? 'Entrada' : 'Nota', 50, 205);
    c.fillStyle = '#1E1B2E'; c.font = '600 56px ' + DISP; c.fillText(it.t, 50, 320);
    c.fillStyle = '#2E2A42'; c.font = '700 48px ' + MANO; wrap(c, it.s, 50, 400, w - 100, 56);
    c.fillStyle = '#8E8AA3'; c.font = '500 22px ' + BODY; c.fillText((i + 1) + ' de ' + CORCHO.length, 50, h - 36);
  };
}
// v0.2.5 (E60-3): la tarjeta se quita del corcho (queda su chincheta), sale 3 cm por delante y viene a ti; Esc la vuelve a clavar
function centroTarjeta(i) { const R = CORCHO_RECT[i]; return corchoMesh.localToWorld(v3(((R.x + R.ancho / 2) / 1024 - 0.5) * CORCHO_POS.w, (0.5 - (R.y + R.alto / 2) / 666) * CORCHO_POS.h, 0.004)); }
function giroTarjeta(i) { return corchoMesh.getWorldQuaternion(new THREE.Quaternion()).multiply(new THREE.Quaternion().setFromAxisAngle(v3(0, 0, 1), -CORCHO_RECT[i].giro)); }
function quitaDelCorcho(i) { corchoQuita = i; redibuja(corchoTex, dibujaCorcho); }
const corchoSel = { i: 0 };
function abreTarjetaCorcho(i) {
  corchoSel.i = i; modos.mirar.extra = null; cambia('ocupado');
  const normal = v3(1, 0, 0);
  abrePapel({ ayuda: 'Flechas: otra tarjeta · Esc: clavarla', dibuja: dibujaTarjetaCorcho(i), tam: [0.215, 0.177], grosor: 0.002, dist: 0.32, clave: 'corcho',
    desde: { pos: () => centroTarjeta(corchoSel.i), quat: () => giroTarjeta(corchoSel.i), salida: () => [centroTarjeta(corchoSel.i).addScaledVector(normal, 0.03)],
             alSalir: () => quitaDelCorcho(i), alVolver: () => quitaDelCorcho(-1), dur: 900 },
    extra: { tecla: e => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return false; corchoSel.i = (corchoSel.i + d + CORCHO.length) % CORCHO.length; quitaDelCorcho(corchoSel.i); papel.dibuja = dibujaTarjetaCorcho(corchoSel.i); rePapel(); anuncia(CORCHO[corchoSel.i].t + ': ' + CORCHO[corchoSel.i].s); return true; } },
    alVolver: () => { mirarDesde = null; },
    texto: CORCHO[i].t + ': ' + CORCHO[i].s + '. Flechas: otra. Esc para dejarla.' });
}
{
  const o = objetos.get('corcho');
  o.alClic = () => miraCosa({ clave: 'corcho', punto: v3(SALA.x0, CORCHO_POS.y, CORCHO_POS.z), normal: v3(1, 0, 0), tam: 1.0,
    texto: 'El corcho: la historia de la web, en fotos y notas. Clic en una para leerla (o Intro para la primera). Esc para volver.',
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
// el trofeo: una copa torneada (LatheGeometry) dorada. v0.2.5 (E60-4, regla 1): espera DENTRO de la caja fuerte, detrás de
// las figuras; al abrirla, sale (sube 3 cm, sale 20 cm hacia ti) y vuela con su peso hasta la balda, baja y se asienta
const trofeo = (() => {
  const g = new THREE.Group(), perfil = [[0, 0], [0.03, 0], [0.03, 0.008], [0.012, 0.016], [0.008, 0.05], [0.006, 0.07], [0.025, 0.08], [0.035, 0.11], [0.034, 0.13], [0, 0.125]].map(([x, y]) => new THREE.Vector2(x, y));
  const oro = new THREE.MeshStandardMaterial({ color: 0xF5A524, metalness: 0.85, roughness: 0.3, emissive: 0x3A2400, emissiveIntensity: 0.4 });
  g.add(new THREE.Mesh(new THREE.LatheGeometry(perfil, 28), oro));
  [-1, 1].forEach(s => { const a = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.003, 6, 14, Math.PI), oro); a.position.set(s * 0.037, 0.105, 0); a.rotation.z = s > 0 ? -Math.PI / 2 : Math.PI / 2; g.add(a); });
  g.userData.noJuntar = true; scene.add(g); return g;
})();
const TROFEO_SITIO = v3(TROFEOS.x0 + 0.17, TROFEOS.y + 0.0475, FONDO - 0.09);
const TROFEO_CAJA = cajaFuerteG.localToWorld(v3(0, FIGURA_Y + 0.004, 0.14));
trofeo.scale.setScalar(0.9);
trofeo.position.copy(secreto.resuelto ? TROFEO_SITIO : TROFEO_CAJA);
function cajaTeclaBajo() {
  raycaster.setFromCamera(ndc, camera); const h = raycaster.intersectObject(cajaFuerteFrente)[0]; if (!h || !h.uv) return null;
  const x = h.uv.x * 256, y = (1 - h.uv.y) * 256; if (y < 104) return null;
  const i = clamp(Math.floor((x - 41) / 58), 0, 2), j = clamp(Math.floor((y - 105) / 34), 0, 3); const k = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '·', '0', '·'][j * 3 + i]; return k === '·' ? null : k;
}
// la puerta de la caja: 100° hacia fuera sobre su canto, con peso
function puertaCaja(abrir) { const a0 = cajaPuerta.rotation.y, a1 = abrir ? 1.75 : 0; return anim(reduced ? 1 : (abrir ? 760 : 560), e => { cajaPuerta.rotation.y = lerp(a0, a1, e); }, curva.pesoSin); }
const NOTA_CAJA = 'Lo que más quiero de la carrera.\n\nEl patito de goma: cuando algo no compila, se lo explico en voz alta; casi siempre el fallo aparece a mitad de frase.\n\nTux: con Linux hice las prácticas de IC2 en Fedora, y acabé sacándome el de Red Hat.\n\nUn MIPS: IC1 es esto, 32 registros y mucha paciencia.\n\nLa serpiente de Python: con ella empezó todo, en FP1 y en la web.\n\nY el trofeo es para ti. Si has llegado hasta aquí, ya sabes más del cuarto que casi nadie. Gracias por mirar con calma. —S.';
function dibujaNotaCaja(c, w, h) {
  c.fillStyle = '#FBF8EF'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(47,95,208,.12)'; for (let y = 120; y < h - 30; y += 50) c.fillRect(40, y + 10, w - 80, 2);
  c.fillStyle = '#2E2A42'; let y = 90; NOTA_CAJA.split('\n\n').forEach((par, k) => { c.font = (k ? '600 34px ' : '700 44px ') + MANO; y = wrap(c, par, 50, y, w - 100, k ? 40 : 50) + (k ? 54 : 64); });
}
const FIGURAS_NOTA = { patito: 'El patito de goma: cuando algo no compila, se lo explico en voz alta.', tux: 'Tux: con Linux hice las prácticas de IC2 en Fedora.', mips: 'Un MIPS: IC1 es esto, 32 registros y mucha paciencia.', python: 'La serpiente de Python: con ella empezó todo, en FP1 y en la web.' };
figuras.forEach(([id, nombre, f]) => {
  const mallas = []; f.traverse(m => { if (m.isMesh) mallas.push(m); });
  registrar('figura-' + id, { nombre, mallas, raiz: f, movil: true, tipo: 'figura', lugar: 'cualquiera', activo: () => false, salidaLocal: v3(0, 0.012, -0.2),
    insp: { dist: 0.2, rot: new THREE.Euler(0.15, Math.PI, 0) }, alUsar: o => { anuncia(FIGURAS_NOTA[id]); empujaGiro(Math.PI, 0); $('#velo').classList.add('on'); insp.o = o; } });
});
const CAJA_COSAS = () => [...figuras.map(([id]) => objetos.get('figura-' + id)), { clave: 'nota', mallas: [notaCaja], nombre: 'Una nota: «Para ti»' }];
function cajaCosaBajo() {
  if (!secreto.abierto) return null;
  raycaster.setFromCamera(ndc, camera);
  for (const o of CAJA_COSAS()) { if (o.raiz && o.raiz.parent !== cajaFuerteG) continue; if (o.clave === 'nota' && !notaCaja.visible) continue; if (raycaster.intersectObjects(o.mallas, false).length) return o; }
  return null;
}
secreto.volverAMirar = false;
function miraCaja() {
  enfoca(cajaFuerteG.position.clone().add(v3(0, 0, 0.05)), ojos(), 32, { paralaje: 0.01, rate: 4 });
  modos.mirar.extra = cajaExtra; cambia('mirar');
}
bus.on('estado', est => { if (est === 'libre' && secreto.volverAMirar) { secreto.volverAMirar = false; setTimeout(() => { if (gesto.estado === 'libre') miraCaja(); }, 0); } });
function cogeDeLaCaja(o) {
  secreto.volverAMirar = true; modos.mirar.extra = null;
  if (o.clave === 'nota') {
    cambia('libre'); abrePapel({ dibuja: dibujaNotaCaja, tam: [0.15, 0.21], grosor: 0.0015, dist: 0.33, clave: 'cuadro-niebla',
      desde: { pos: () => notaCaja.getWorldPosition(new THREE.Vector3()), quat: () => notaCaja.getWorldQuaternion(new THREE.Quaternion()), ocultar: [notaCaja], salida: () => [notaCaja.getWorldPosition(new THREE.Vector3()).add(v3(0, 0.01, -0.22))], dur: 1000 },
      texto: NOTA_CAJA.replace(/\n\n/g, ' ') + ' Esc para dejarla.' });
    return;
  }
  cambia('libre'); inspecciona(o);
}
async function cajaDigito(k) {
  if (secreto.abierto) return;
  secreto.codigo = (secreto.codigo + k).slice(0, 4); dibujaCajaFuerte();
  if (secreto.codigo.length < 4) { anuncia(secreto.codigo.split('').join(' ')); return; }
  if (secreto.codigo === '2018') {
    cambia('ocupado');
    secreto.abierto = true; dibujaCajaFuerte();
    anuncia('Clac. 2018: el autobús 20 y el dorsal 18. Dentro, lo que más quiero de la carrera, y un trofeo para ti: Detective del cuarto.');
    await espera(350); await puertaCaja(true); await espera(500);
    if (!secreto.resuelto) {
      secreto.resuelto = true; guardado.set('secreto-cuadros', true);
      // la cámara se abre para seguirlo hasta la balda
      enfoca(TROFEO_CAJA.clone().lerp(TROFEO_SITIO, 0.5).add(v3(0, 0.08, 0)), ojos(), 52, { paralaje: 0, rate: 3 });
      const p0 = TROFEO_CAJA.clone(), arriba = TROFEO_SITIO.clone().add(v3(0, 0.035, 0));
      await trayecto(trofeo, { puntos: [p0, p0.clone().add(v3(0, 0.03, 0)), p0.clone().add(v3(0, 0.03, -0.2))], fin: () => [arriba, new THREE.Quaternion()], dur: 1700, alto: 0.16 });
      await anim(reduced ? 1 : 260, e => { trofeo.position.y = lerp(arriba.y, TROFEO_SITIO.y, e); }, curva.pesoSin);
      await asienta(trofeo, 3);
      anuncia('El trofeo, en la balda: Detective del cuarto. En la caja quedan cuatro figuras y una nota.');
      await espera(350);
    }
    miraCaja();
  } else {
    const p0 = cajaFuerteFrente.position.x; if (!reduced) anim(320, e => { cajaFuerteFrente.position.x = p0 + Math.sin(e * Math.PI * 6) * 0.006 * (1 - e); });
    anuncia('Ese no es. Busca dos números en los cuadros y en lo que cuelga.'); await espera(reduced ? 0 : 400); secreto.codigo = ''; dibujaCajaFuerte();
  }
}
const cajaExtra = {
  punto: () => { const o = cajaCosaBajo(); if (o) return ['mano', o.nombre]; const k = cajaTeclaBajo(); return k && !secreto.abierto ? ['mano', k] : ['punto']; },
  up: () => { const o = cajaCosaBajo(); if (o) { cogeDeLaCaja(o); return; } const k = cajaTeclaBajo(); if (k) cajaDigito(k); },
  tecla: e => { if (/^[0-9]$/.test(e.key)) { cajaDigito(e.key); return true; } if (e.key === 'Backspace') { secreto.codigo = secreto.codigo.slice(0, -1); dibujaCajaFuerte(); return true; } return false; },
  // Esc: el camino al revés: la puerta de la caja se cierra (si estaba abierta) y después el cuadro
  alSalir: async () => {
    secreto.codigo = ''; const abierta = secreto.abierto; secreto.abierto = false; dibujaCajaFuerte();
    if (abierta) await puertaCaja(false);
    await anim(reduced ? 1 : 760, e => { nieblaBisagra.rotation.y = lerp(1.9, 0, e); }, curva.pesoSin); await asienta(nieblaG, 1.5);
  }
};
async function abreCuadro() {
  if (!secreto.recto) { await anim(reduced ? 1 : 560, e => { nieblaG.rotation.z = lerp(0.07, 0, e); }, curva.peso); secreto.recto = true; await espera(reduced ? 0 : 250); }
  await anim(reduced ? 1 : 1000, e => { nieblaBisagra.rotation.y = lerp(0, 1.9, e); }, curva.peso);
  // ya resuelta: la caja no tiene llave; la puerta se abre sola al mirarla
  if (secreto.resuelto) { secreto.abierto = true; dibujaCajaFuerte(); await espera(200); await puertaCaja(true); }
  miraCaja();
  anuncia(secreto.resuelto ? 'Detrás del cuadro, la caja fuerte: dentro, cuatro figuras y una nota. Clic en una para cogerla. Esc para cerrarla.' : 'Clac: el cuadro estaba suelto y se abre. Detrás, una caja fuerte de 4 cifras. Teclea el código (o clic en sus teclas). Esc para cerrarlo.');
}
{
  const o = objetos.get('cuadro-niebla');
  o.alClic = async () => {
    await miraCosa({ clave: 'cuadro-niebla', punto: v3(CUADRO_NIEBLA.x, CUADRO_NIEBLA.y, FONDO), normal: v3(0, 0, -1), tam: 0.6,
      texto: secreto.recto ? 'La ciudad entre la niebla. Clic para abrirlo. Esc para volver.' : 'La ciudad entre la niebla. Está un poco torcido. Clic para enderezarlo. Esc para volver.',
      extra: { punto: () => ['mano', secreto.recto ? 'Abrir el cuadro' : 'Enderezarlo'], up: () => { cambia('ocupado'); abreCuadro(); }, tecla: e => { if (e.key === 'Enter' || e.key === 'e' || e.key === 'E') { cambia('ocupado'); abreCuadro(); return true; } return false; } } });
  };
}
window.__slSecreto = () => ({ resuelto: secreto.resuelto, recto: secreto.recto, codigo: secreto.codigo, abierto: secreto.abierto, puerta: +cajaPuerta.rotation.y.toFixed(2), trofeo: trofeo.position.toArray().map(v => +v.toFixed(3)) });
window.__slCaja = k => cajaDigito(String(k));
window.__slMovil = () => ({ estado: gesto.estado, abierto: movil.abierto, enMano: movil.enMano, app: movil.app, zonas: movil.zonas.map(z => z.etiqueta), linterna: linterna.on, estudio: estudio.fase });
window.__slTelZona = etiqueta => { const z = movil.zonas.find(x => x.etiqueta.startsWith(etiqueta)); if (z) { z.accion(); dibujaMovil(); } return !!z; };
window.__slBugs = () => ({ activo: JB.activo, fase: JB.fase, puntos: JB.puntos, vidas: JB.vidas, archivo: JB.archivo, nombre: JB.archivo ? archivoDe(JB.archivo).n : null, bugs: JB.bugs.length, lineas: JB.lineas.filter(l => l.err).map(l => l.arreglada), record: JB.record });
window.__slJB = JB;
window.__slCalc = () => calc.pantalla;
window.__slPosits = () => posits.lista.length;
