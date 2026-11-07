/* ===================== 10 · pantalla y PC =====================
   El mundo virtual: aquí sí hay terminal. El monitor enseña el reposo, el
   arranque, el simulacro del disco o la vista previa del simulador del USB.
   SergioLearns OS es el de la v0.1 con su LEEME.txt (se rehace en la v0.3). */
const pantalla = { estado: 'reposo', datos: null, t0: 0, ult: 0, escrito: '', salida: [] };
pantalla.pon = (estado, datos = null) => { pantalla.estado = estado; pantalla.datos = datos; pantalla.t0 = performance.now(); };
const ARRANQUE = ['[ OK ] montando ~/apuntes', '[ OK ] cargando entornos: python, java, c, mips', '[ OK ] simuladores: 4 · simulacros: 4', '[ OK ] calendario: examen de FP1 el 8 ene', 'SergioLearns OS v0.2'];
function texto(c, partes, x, y) { for (const [t, col] of partes) { c.fillStyle = col; c.fillText(t, x, y); x += c.measureText(t).width; } }
function dibujaPantalla(ahora) {
  const t = screenTex, c = t.userData.g, w = 1024, h = 592, s = (ahora - pantalla.t0) / 1000;
  c.fillStyle = '#2A2640'; c.fillRect(0, 0, w, h); c.textBaseline = 'alphabetic'; c.textAlign = 'left';
  c.font = '400 30px ' + MONO;
  if (pantalla.estado === 'reposo') {
    texto(c, [['sergio@learns', '#A99EF5'], [':~', '#E8E6F5'], ['$', '#FF6B4A'], [' uptime', '#E8E6F5']], 48, 80);
    c.fillStyle = '#8E8AA3'; c.fillText('ahora', 48, 130); c.fillStyle = '#E8E6F5'; c.fillText('IC1 · MIPS y temas de papel', 170, 130);
    c.fillStyle = '#8E8AA3'; c.fillText('mesa', 48, 176); c.fillStyle = '#E8E6F5'; c.fillText('discos: simulacros · usb: simuladores', 170, 176);
    let y = 236; pantalla.salida.slice(-4).forEach(l => { c.fillStyle = l.c; c.fillText(l.t, 48, y); y += 44; });
    texto(c, [['$', '#FF6B4A'], [' ' + pantalla.escrito, '#E8E6F5']], 48, y);
    if (reduced || Math.floor(ahora / 500) % 2 === 0) { const cw = c.measureText('$ ' + pantalla.escrito).width; c.fillStyle = '#FF6B4A'; c.fillRect(52 + cw, y - 26, 16, 32); }
    c.fillStyle = '#C9C5DC'; c.font = '400 22px ' + MONO; c.fillText(gesto.estado === 'escribir' ? 'escribe startx y pulsa Intro · help · Esc para salir' : 'clic en la pantalla: encender · clic en el teclado: escribir', 48, h - 36);
  } else if (pantalla.estado === 'arranque') {
    ARRANQUE.forEach((l, i) => {
      if (s * 1000 < 140 + i * 170) return;
      if (l.startsWith('[ OK ]')) { c.font = '400 28px ' + MONO; texto(c, [['[ OK ]', '#5BD39A'], [l.slice(6), '#E8E6F5']], 48, 80 + i * 46); }
      else { c.fillStyle = '#FF6B4A'; c.font = '600 44px ' + DISP; c.fillText(l, 48, 100 + i * 46); }
    });
  } else if (pantalla.estado === 'simulacro') {
    const d = pantalla.datos, n = Math.floor(s * 6);
    c.font = '400 28px ' + MONO;
    const L = [[['$', '#FF6B4A'], [' mount /dev/cdrom /mnt/simulacro', '#E8E6F5']], [['[ OK ]', '#5BD39A'], [' disco: simulacro de ' + d.code, '#E8E6F5']]];
    L.slice(0, n).forEach((l, i) => texto(c, l, 48, 70 + i * 44));
    if (n >= 3) {
      c.fillStyle = '#FAFAF7'; c.font = '600 54px ' + DISP; c.fillText('Simulacro de examen · ' + d.code, 48, 220);
      c.font = '400 28px ' + MONO;
      d.partes.forEach((p, i) => {
        const listo = publicado(p[1]);
        texto(c, [[p[0].toLowerCase().padEnd(10), '#A99EF5'], [fechaCorta(p[1]).padEnd(9), '#F5C06B'], [listo ? 'disponible' : 'se publica ese día a las 9:00', listo ? '#5BD39A' : '#C9C5DC']], 48, 290 + i * 46);
      });
      c.fillStyle = '#C9C5DC'; c.font = '400 22px ' + MONO;
      c.fillText(enlacePantalla() ? 'clic en la pantalla o Intro: abrir en la web · Esc: volver' : 'todavía no está publicado · Esc: volver', 48, h - 36);
    }
  } else if (pantalla.estado === 'simulador') {
    dibujaSim(c, w, h, pantalla.datos, s);
  }
  t.needsUpdate = true;
}
const RR = [['P1', 2], ['P2', 2], ['P3', 1], ['P4', 2], ['P1', 2], ['P2', 1], ['P1', 1]];
const PCOL = { P1: '#5B4BDB', P2: '#FF6B4A', P3: '#5BD39A', P4: '#F5C06B' };
const REF = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3];
const LRU = (() => { const fr = [], used = [], out = []; REF.forEach((p, i) => { const k = fr.indexOf(p); let fault = false; if (k >= 0) used[k] = i; else { fault = true; if (fr.length < 3) { fr.push(p); used.push(i); } else { let m = 0; for (let j = 1; j < 3; j++) if (used[j] < used[m]) m = j; fr[m] = p; used[m] = i; } } out.push({ fr: fr.slice(), fault }); }); return out; })();
function dibujaSim(c, w, h, d, s) {
  c.font = '400 26px ' + MONO; texto(c, [['$', '#FF6B4A'], [d.cmd.slice(1), '#E8E6F5']], 40, 56);
  if (d.id === 'cpu') {
    const total = 11, tt = Math.min(total, (s % 7) * 2.2), x0 = 60, unit = 78, y = 170; let acc = 0;
    c.font = '600 24px ' + MONO;
    RR.forEach(p => { const st = acc, en = acc + p[1]; acc = en; if (st >= tt) return; const vis = Math.min(en, tt) - st; c.fillStyle = PCOL[p[0]]; rr(c, x0 + st * unit, y, vis * unit - 4, 90, 8); c.fill(); if (vis > 0.6) { c.fillStyle = '#1E1B2E'; c.fillText(p[0], x0 + st * unit + 12, y + 55); } });
    c.fillStyle = '#C9C5DC'; c.font = '400 20px ' + MONO; for (let k = 0; k <= total; k++) c.fillText(String(k), x0 + k * unit - 6, y + 126);
    c.fillStyle = '#E8E6F5'; c.font = '400 24px ' + MONO; c.fillText('Round Robin, quantum 2 · 4 procesos', 60, 380);
    if (tt >= total) { c.fillStyle = '#5BD39A'; c.fillText('[ OK ] todos terminados en t = 11', 60, 430); }
  } else if (d.id === 'pag') {
    const n = Math.min(REF.length, Math.floor(s * 1.6) % (REF.length + 3)); c.font = '600 26px ' + MONO;
    for (let i = 0; i < n; i++) {
      const col = LRU[i], x = 60 + i * 88;
      c.fillStyle = '#A99EF5'; c.fillText(String(REF[i]), x + 30, 120);
      for (let f = 0; f < 3; f++) { c.fillStyle = '#1E1B2E'; rr(c, x + 8, 140 + f * 64, 70, 56, 6); c.fill(); if (col.fr[f] !== undefined) { c.fillStyle = '#E8E6F5'; c.fillText(String(col.fr[f]), x + 34, 178 + f * 64); } }
      if (col.fault) { c.fillStyle = '#FF8A7A'; c.fillText('F', x + 34, 360); }
    }
    c.fillStyle = '#E8E6F5'; c.font = '400 24px ' + MONO; c.fillText('LRU con 3 marcos · F = fallo de página', 60, 430);
    c.fillStyle = '#F5C06B'; c.fillText('fallos: ' + LRU.slice(0, n).filter(x => x.fault).length, 60, 474);
  } else if (d.id === 'sub') {
    const k2 = Math.min(8, Math.floor(s * 2.2) % 12);
    c.font = '600 30px ' + MONO; c.fillStyle = '#E8E6F5'; c.fillText('192.168.10.', 60, 150);
    for (let b = 0; b < 8; b++) { const on = b < 2 && b < k2; c.fillStyle = b < 2 ? (on ? '#FF6B4A' : '#3A3552') : (b < k2 ? '#5BD39A' : '#3A3552'); rr(c, 300 + b * 62, 110, 52, 56, 6); c.fill(); c.fillStyle = '#1E1B2E'; c.fillText('0', 316 + b * 62, 148); }
    c.font = '400 24px ' + MONO; c.fillStyle = '#FF9B80'; c.fillText('2 bits de subred', 300, 210); c.fillStyle = '#5BD39A'; c.fillText('6 bits de host', 430, 240);
    if (k2 >= 8) { c.fillStyle = '#E8E6F5'; c.fillText('/26 → 4 subredes · 62 hosts en cada una', 60, 330); c.fillStyle = '#C9C5DC'; c.fillText('.0  .64  .128  .192', 60, 380); }
  } else if (d.id === 'paq') {
    const capas = [['Aplicación', 'HTTP', '#5B4BDB'], ['Transporte', 'TCP', '#FF6B4A'], ['Red', 'IP', '#16794B'], ['Enlace', 'Ethernet', '#F5A524']], k3 = Math.min(4, Math.floor(s * 1.3) % 7);
    for (let L = 0; L < k3; L++) { const ins = (3 - L) * 34; c.fillStyle = capas[L][2]; c.globalAlpha = 0.9; rr(c, 60 + ins, 100 + L * 4, 900 - ins * 2, 300 - L * 8, 12); c.fill(); c.globalAlpha = 1; }
    c.font = '600 24px ' + MONO; for (let L = 0; L < k3; L++) { c.fillStyle = '#FAFAF7'; c.fillText(capas[L][0] + ' · ' + capas[L][1], 80 + (3 - L) * 34, 140 + L * 60); }
    c.fillStyle = '#E8E6F5'; c.font = '400 24px ' + MONO; c.fillText('cada capa envuelve a la anterior', 60, 470);
  }
  c.fillStyle = '#C9C5DC'; c.font = '400 20px ' + MONO; c.fillText('vista previa · clic o Intro: el simulador completo en la web · Esc: volver', 40, h - 30);
}

/* ---------- teclado: escribir en el monitor ---------- */
registrar('teclado', { nombre: 'Teclado', mallas: [kbHit, space], alClic: () => {
  enfoca(v3(0, 0.95, -0.45), BASE.clone().add(v3(0, -0.02, -0.12)), 54); cambia('escribir');
  const k = $('#entrada'); k.value = ''; k.focus({ preventScroll: true }); anuncia('Escribe en el teclado. startx enciende el ordenador. Esc para salir.');
} });
$('#entrada').addEventListener('keydown', e => {
  if (gesto.estado !== 'escribir') return;
  if (e.key === 'Escape') return;
  if (e.key === 'Enter') {
    e.preventDefault(); pressKey(41);
    const cmd = pantalla.escrito.trim(); pantalla.escrito = '';
    if (cmd === 'startx') { $('#entrada').blur(); sueltaFoco(); arranca(); return; }
    pantalla.salida.push({ t: '$ ' + cmd, c: '#A99EF5' });
    if (cmd === 'help') pantalla.salida.push({ t: 'órdenes: startx, help, clear', c: '#E8E6F5' });
    else if (cmd === 'clear') pantalla.salida = [];
    else if (cmd) pantalla.salida.push({ t: cmd.split(' ')[0] + ': orden no encontrada (prueba help)', c: '#FF8A7A' });
    return;
  }
  if (e.key === 'Backspace') { pantalla.escrito = pantalla.escrito.slice(0, -1); pressKey(13); return; }
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) { e.preventDefault(); if (pantalla.escrito.length < 40) { pantalla.escrito += e.key; pressKey(e.key.charCodeAt(0) * 7); } }
});
modo('escribir', { down() {}, up() { $('#entrada').focus({ preventScroll: true }); }, esc() { devuelveFoco('teclado'); sueltaFoco(); cambia('libre'); } });

/* ---------- monitor y botón de encendido ---------- */
registrar('monitor', { nombre: 'Monitor', mallas: [bezel, screen], alClic: () => {
  if (torre.disco || torre.usb) return miraMonitor('Monitor. Clic en la pantalla para abrir en la web, Esc para volver.');
  arranca();
} });
registrar('encendido', { nombre: 'Botón de encendido de la torre', mallas: [powerBtn], alClic: () => arranca() });
function arranca() {
  if (gesto.estado !== 'libre' && gesto.estado !== 'escribir') return;
  cambia('ocupado');
  rig.foco = { yaw: 0, pitch: 0, pos: v3(0, 1.06, -0.07), fov: 40, rate: 3.2, paralaje: 0 };
  pantalla.pon('arranque');
  setTimeout(abreOS, reduced ? 50 : 1400);
}
function apaga() {
  const os = $('#os'); os.classList.remove('on'); os.classList.add('off');
  setTimeout(() => { os.hidden = true; os.classList.remove('off'); paraFondo(); pantalla.pon(torre.disco ? 'simulacro' : (torre.usb ? 'simulador' : 'reposo'), torre.disco ? torre.disco.datos : (torre.usb ? torre.usb.datos : null)); sueltaFoco(); cambia('libre'); canvas.focus({ preventScroll: true }); }, reduced ? 10 : 460);
}
modo('os', { esc() { apaga(); } });

/* ---------- SergioLearns OS ---------- */
const ICONOS = {
  terminal: 'M4 5h16v14H4z M7 10l3 2-3 2 M12 15h5', lab: 'M9 3h6 M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3',
  log: 'M12 3v6 M12 15v6 M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6', leeme: 'M6 3h9l3 3v15H6z M14 3v4h4 M9 11h6 M9 15h6'
};
const LEEME = [
  'LEEME(1)          Escritorio de SergioLearns          LEEME(1)', '',
  'NOMBRE', '       escritorio - la mesa de Sergio, en 3D', '',
  'SINOPSIS', '       mirar · coger · girar · llevar · soltar', '',
  'DESCRIPCIÓN',
  '       Mueve el ratón para mirar. En el borde de la pantalla',
  '       (o con A y D) giras del todo: detrás está la puerta,',
  '       que vuelve a la web.',
  '       Clic en un objeto: lo coges y lo inspeccionas',
  '       (arrastra para girarlo, rueda para acercarlo).',
  '       E: lo usas. Esc: lo dejas.',
  '       Mantén pulsado y arrastra discos, USB y carpetas:',
  '       donde encajan, brilla.', '',
  'OBJETOS',
  '       discos     simulacros, del estuche a la disquetera',
  '       usb        simuladores, del portalápices al puerto',
  '       carpetas   apuntes, del cajón a la mesa',
  '       libros     una asignatura cada uno, en la estantería',
  '       pizarra    calendario y pregunta del día (V o F)',
  '       taza       Sergio Bot, en el vapor',
  '       ventana    fuera, la hora real de Canarias',
  '       corcho     la historia de la web (y los logros, v0.3)',
  '       ratón      rueda encima: la sensibilidad (1 a 5)', '',
  'TECLAS',
  '       Tab recorre los objetos · Intro coge · E usa',
  '       Esc vuelve · flechas: girar el objeto o pasar',
  '       páginas · A y D: girar la vista', '',
  'VÉASE TAMBIÉN', '       la web normal, sin 3D: https://sergiolearns.com/', '',
  'SergioLearns OS 0.2         4 nov 2026         LEEME(1)'
];
const APPS = [['terminal', 'terminal'], ['lab', 'laboratorio'], ['log', 'git log'], ['leeme', 'LEEME.txt']];
const dock = $('#dock');
APPS.forEach(a => {
  const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', a[1]);
  b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICONOS[a[0]] + '"></path></svg><span>' + a[1] + '</span>';
  b.onclick = () => abreVentana(a[0]); dock.appendChild(b);
});
let zTop = 10;
function abreVentana(id) {
  const ex = document.getElementById('win-' + id); if (ex) { ex.style.zIndex = ++zTop; return; }
  const W = document.createElement('section'); W.className = 'win'; W.id = 'win-' + id; W.setAttribute('aria-label', id);
  const vw = innerWidth, n = $('#wins').children.length;
  W.style.left = Math.max(16, Math.min(vw - 656, vw / 2 - 320 + n * 28)) + 'px'; W.style.top = (64 + n * 26) + 'px'; W.style.zIndex = ++zTop;
  const titulo = { terminal: 'terminal · misiones', lab: 'laboratorio', log: 'git log --oneline', leeme: 'less LEEME.txt' }[id];
  W.innerHTML = '<div class="win-bar"><span>' + titulo + '</span><button type="button" aria-label="Cerrar ' + titulo + '">cerrar</button></div><div class="win-body"></div>';
  const body = W.querySelector('.win-body');
  if (id === 'terminal') terminal(body);
  if (id === 'lab') body.innerHTML = SIMULADORES.map(d => '<div><a href="' + d.url + '" target="_blank" rel="noopener">' + d.nombre + '</a> <span class="c-dim">' + d.cmd + '</span></div>').join('') + '<div style="margin-top:10px"><a href="https://sergiolearns.com/laboratorio/" target="_blank" rel="noopener">Entornos</a> <span class="c-dim">Python, Java, C y MIPS en el navegador</span></div>';
  if (id === 'log') body.innerHTML = [['4 nov', 'escritorio v0.2.1: ventana con la hora de Canarias y habitación nueva'], ['4 nov', 'escritorio v0.2: coger, girar, llevar y soltar'], ['3 nov', 'Sergio Bot v2: bot propio que lee la página'], ['2 nov', 'renovación de los artículos antiguos terminada'], ['31 oct', 'calculadora «¿Cuánto necesito?» y simuladores de IC2']].map(l => '<div><span class="c-num">' + l[0] + '</span>  ' + l[1] + '</div>').join('');
  if (id === 'leeme') { const pre = document.createElement('pre'); pre.textContent = LEEME.join('\n'); body.appendChild(pre); }
  W.querySelector('.win-bar button').onclick = () => W.remove();
  W.addEventListener('pointerdown', () => { W.style.zIndex = ++zTop; });
  arrastraVentana(W, W.querySelector('.win-bar'));
  $('#wins').appendChild(W);
  if (id === 'terminal') { const inp = W.querySelector('input'); if (inp) inp.focus({ preventScroll: true }); }
}
function arrastraVentana(W, bar) {
  let sx, sy, ox, oy, on = false;
  bar.addEventListener('pointerdown', e => { if (e.target.tagName === 'BUTTON') return; on = true; sx = e.clientX; sy = e.clientY; ox = W.offsetLeft; oy = W.offsetTop; bar.setPointerCapture(e.pointerId); });
  bar.addEventListener('pointermove', e => { if (!on) return; W.style.left = clamp(ox + e.clientX - sx, -200, innerWidth - 120) + 'px'; W.style.top = clamp(oy + e.clientY - sy, 44, innerHeight - 80) + 'px'; });
  bar.addEventListener('pointerup', () => { on = false; });
}
function terminal(body) {
  const out = document.createElement('div'); body.appendChild(out);
  const linea = (t, cls) => { const d = document.createElement('div'); d.className = 'term-line ' + (cls || ''); d.textContent = t; out.appendChild(d); body.scrollTop = body.scrollHeight; };
  linea('SergioLearns OS v0.2 · terminal'); linea('Escribe help. Hay una misión activa: escribe misiones.', 'c-dim');
  const row = document.createElement('div'); row.className = 'term-in';
  row.innerHTML = '<label for="t-in">sergio@learns:~<span class="dollar">$</span></label><input id="t-in" autocomplete="off" spellcheck="false">';
  body.appendChild(row);
  const inp = row.querySelector('input');
  inp.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return; e.preventDefault();
    const c = inp.value.trim(); inp.value = ''; if (!c) return; linea('$ ' + c, 'c-cmd');
    if (c === 'help') linea('órdenes: ls, ls -a, cat <archivo>, misiones, clear, shutdown');
    else if (c === 'ls') linea('LEEME.txt   apuntes/   misiones/   simuladores/   novedades.log');
    else if (/^ls -(a|la|al)$/.test(c)) linea('.   ..   .pista   LEEME.txt   apuntes/   misiones/   simuladores/   novedades.log');
    else if (c === 'misiones') { linea('Misión 1 · El archivo escondido'); linea('Hay un archivo que ls no enseña. Encuéntralo y léelo con cat.'); linea('pista: los archivos ocultos empiezan por un punto', 'c-dim'); }
    else if (c === 'cat .pista') { linea('[ OK ] Misión 1 completada: ls -a enseña los archivos ocultos.', 'c-ok'); linea('En la v0.3, los logros y misiones nuevas.', 'c-dim'); }
    else if (c === 'cat LEEME.txt') LEEME.forEach(l => linea(l));
    else if (c === 'cat novedades.log') { linea('4 nov  escritorio v0.2'); linea('3 nov  Sergio Bot v2'); }
    else if (c.startsWith('cat ')) linea('cat: ' + c.slice(4) + ': no existe o es un directorio', 'c-err');
    else if (c === 'clear') out.innerHTML = '';
    else if (c === 'shutdown' || c === 'exit' || c === 'poweroff') apaga();
    else linea(c.split(' ')[0] + ': orden no encontrada. Prueba help', 'c-err');
  });
}
let fondoRAF = null;
function arrancaFondo() {
  const cv = $('#wall'), g = cv.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2);
  const size = () => { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; }; size(); addEventListener('resize', size);
  const dots = []; for (let i = 0; i < 70; i++) dots.push({ x: Math.random(), y: Math.random(), s: 0.2 + Math.random() * 0.8, c: Math.random() < 0.15 ? '#FF6B4A' : '#A99EF5' });
  const frame = t => {
    const w = cv.width, h = cv.height; g.fillStyle = '#141221'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(169,158,245,.06)'; g.lineWidth = dpr; const step = 36 * dpr, off = reduced ? 0 : (t / 60) % step;
    g.beginPath(); for (let x = -step + off; x < w; x += step) { g.moveTo(x, 0); g.lineTo(x, h); } for (let y = -step + off; y < h; y += step) { g.moveTo(0, y); g.lineTo(w, y); } g.stroke();
    dots.forEach(d => { const yy = ((d.y + (reduced ? 0 : t / 90000 * d.s)) % 1) * h; g.fillStyle = d.c; g.globalAlpha = 0.25 + d.s * 0.35; g.beginPath(); g.arc(d.x * w, yy, 1.6 * dpr + d.s * dpr, 0, Math.PI * 2); g.fill(); });
    g.globalAlpha = 1; g.fillStyle = 'rgba(232,230,245,.07)'; g.font = '600 ' + Math.round(64 * dpr) + 'px ' + DISP; g.textAlign = 'center'; g.fillText('~/sergiolearns', w / 2, h / 2);
    fondoRAF = requestAnimationFrame(frame);
  };
  fondoRAF = requestAnimationFrame(frame);
}
function paraFondo() { if (fondoRAF) cancelAnimationFrame(fondoRAF); fondoRAF = null; }
function reloj() { const d = new Date(); $('#clock').textContent = 'sergio@learns · ' + d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }); }
setInterval(reloj, 15000); reloj();
function abreOS() {
  const os = $('#os'); os.hidden = false; os.classList.remove('off'); os.classList.add('on'); cambia('os'); arrancaFondo();
  $('#wins').innerHTML = ''; abreVentana('terminal'); abreVentana('leeme');
}
