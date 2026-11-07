/* ===================== 11 · teclado y accesibilidad =====================
   E20: sin botones a la vista, pero todo se puede hacer con el teclado.
   Tab recorre los objetos (la cámara los mira, brillan y se dice su nombre),
   Intro los coge, E los usa y Esc vuelve. El primer Tab enseña el enlace a la
   web normal. Los lectores de pantalla oyen cada paso (región aria-live). */
// v0.2.1: el recorrido sigue la habitación (la mesa, la ventana, la pared derecha, detrás y la izquierda) y
// solo enseña lo que se puede usar en ese momento (E35): las carpetas, con el cajón abierto; la luz del pasillo,
// con la puerta abierta; el botón de expulsar, con un disco en la torre. El manual va primero.
// v0.2.2: además de los objetos, los sitios del cuarto (Intro va hasta ellos). El recorrido: la mesa, la ventana,
// la pared derecha (estantería, pizarra, rincón de juegos), la puerta, el sillón, la cama y el armario
const ORDEN = ['manual', 'silla', 'monitor', 'teclado', 'raton', 'encendido', 'expulsar', 'estuche', ...SIMULACROS.map(s => 'disco-' + s.id), ...SIMULADORES.map(s => 'usb-' + s.id),
  'taza', 'lampara', 'cajon-arriba', 'cajon', ...CARPETAS.map(f => 'carpeta-' + f.id), 'ventana', 'estor', 'reloj',
  'pista', ...LIBROS.filter(b => b.curso === 1).map(b => 'libro-' + b.id), 'pizarra', 'tele', 'mando', 'puerta', 'salida', 'interruptor', 'trofeos', 'cuadro-niebla', 'sillon',
  'lampara-pie', ...LIBROS.filter(b => b.curso === 2).map(b => 'libro-' + b.id), 'cama', 'mochila', 'movil', 'poster', 'interruptores-cama', 'lamparita', 'mesita-cajon-1', 'mesita-cajon-2',
  'corcho', 'armario-1', 'armario', 'armario-3', 'luz-techo'];
// v0.2.3: los sitios a los que se va están en el orden de los objetos (Intro «va hasta allí» si está lejos)
const EN_TAB = { expulsar: () => !!torre.disco, salida: () => puertaAbierta, silla: () => !jug.sentado, pista: () => cajonArribaM.obj > 0.1 };
CARPETAS.forEach(f => { EN_TAB['carpeta-' + f.id] = () => cajonM.obj > 0.15; });
const nav = $('#objetos'), etiqueta = $('#etiqueta');
let enfocado = null;
ORDEN.forEach(clave => {
  const o = objetos.get(clave); if (!o) return;
  const b = document.createElement('button'); b.type = 'button'; b.textContent = o.nombre; b.dataset.clave = clave;
  b.addEventListener('focus', () => {
    teclado.activo = true; enfocado = clave; punto.el.classList.add('oculto');
    if (gesto.estado === 'libre') {
      if (gesto.hover) setHover(null);
      brillo(o.mallas, 1.6);
      enfoca(centroDe(o), ojos(), 56, { paralaje: 0, rate: 4 });
    }
    const ok = o.activo();
    if (clave.startsWith('disco-')) { tapaEstuche(true); estucheHasta = performance.now() + 2500; }   // como al pasar el ratón: el estuche se abre
    const lejos = ok && !alcanza(o);
    anuncia(o.nombre + (ok ? '. Intro para ' + (lejos ? 'ir hasta allí' : (o.movil || o.tipo === 'libro' ? 'cogerlo' : (o.puntero === 'lupa' ? 'mirarlo de cerca' : 'usarlo'))) + '.' : '.'));
  });
  b.addEventListener('blur', () => {
    brillo(o.mallas, 0); if (enfocado === clave) enfocado = null;
    setTimeout(() => { if (!enfocado && gesto.estado === 'libre' && rig.foco && rig.foco.rate === 4) sueltaFoco(); }, 0);
  });
  b.addEventListener('click', e => {
    if (gesto.estado !== 'libre' || !o.activo()) return;
    brillo(o.mallas, 0); clicEn(o, null, e);
  });
  nav.appendChild(b);
});
// qué botones están en el recorrido ahora mismo (se mira cuatro veces por segundo)
function actualizaTab() {
  nav.querySelectorAll('button').forEach(b => {
    const f = EN_TAB[b.dataset.clave], fuera = f ? !f() : false;
    if (b.hidden !== fuera) {
      if (fuera && document.activeElement === b) {               // si desaparece el que tiene el foco, el foco pasa a su «padre»
        const padre = b.dataset.clave.startsWith('carpeta') ? 'cajon' : b.dataset.clave === 'salida' ? 'puerta' : 'monitor';
        const pb = nav.querySelector('[data-clave="' + padre + '"]'); b.hidden = true; if (pb) pb.focus({ preventScroll: true });
      }
      b.hidden = fuera;
    }
  });
}
setInterval(actualizaTab, 250); bus.on('estado', actualizaTab);
// al salir de un modo que escribe (taza, teclado), el foco vuelve a su objeto en la lista (si se usaba el teclado) o al lienzo,
// para que el siguiente Tab siga por los objetos y no salte al enlace del principio
function devuelveFoco(clave) {
  const b = teclado.activo && nav.querySelector('[data-clave="' + clave + '"]');
  if (b) b.focus({ preventScroll: true }); else canvas.focus({ preventScroll: true });
}
function centroDe(o) { const caja = new THREE.Box3(); o.mallas.forEach(m => caja.expandByObject(m)); return caja.getCenter(new THREE.Vector3()); }
function aPantalla(p) { const v = p.clone().project(camera); return [(v.x + 1) / 2, (1 - v.y) / 2, v.z]; }
function corrEtiqueta() {
  if (!teclado.activo || !enfocado || gesto.estado !== 'libre') { etiqueta.hidden = true; return; }
  const o = objetos.get(enfocado), [x, y, z] = aPantalla(centroDe(o));
  if (z > 1) { etiqueta.hidden = true; return; }
  etiqueta.textContent = o.nombre; etiqueta.hidden = false;
  etiqueta.style.left = (x * innerWidth) + 'px'; etiqueta.style.top = (y * innerHeight) + 'px';
}

/* ---------- teclas ---------- */
addEventListener('keydown', e => {
  if (gesto.estado === 'cargando') return;
  if (gesto.estado === 'escribir' && e.code) pressKey(e.code);     // v0.2.3 (fallo 21): solo en el modo escribir (tras hacer clic en el teclado)
  const enNav = e.target && e.target.dataset && e.target.dataset.clave;
  if (e.key === 'Escape') {
    e.preventDefault();
    const m = modos[gesto.estado];
    if (m && m.esc) return m.esc();
    if (gesto.estado === 'libre') {
      // v0.2.3 (fallo 22): Esc solo SALE de algo. Sentado a la mesa: primero cierra el cajón que tengas abierto y, si no
      // hay nada, te levanta. En el sillón: te levanta. De pie y sin nada: no hace nada (no te lleva a ningún sitio).
      if (jug.sentado && cajonM.obj > 0.15) return cierraCajon();
      if (jug.sentado && cajonArribaM.obj > 0.1) { cajonArribaM.obj = 0; return sueltaFoco(); }
      if (jug.sentado) { cambia('ocupado'); return levantate().then(() => cambia('libre')); }
      if (enSillon.si) { cambia('ocupado'); return levantaDelSillon().then(() => cambia('libre')); }
      if (rig.foco) sueltaFoco();
      if (document.activeElement && document.activeElement !== document.body && !teclado.activo) document.activeElement.blur();
    }
    return;
  }
  if (gesto.estado === 'os') return;                              // dentro del PC, el teclado es del sistema
  if (gesto.estado === 'bot' || gesto.estado === 'escribir' || gesto.estado === 'nota') return;
  if (enNav && (e.key === 'Enter' || e.key === ' ') && gesto.estado === 'libre') return;   // lo hace el botón
  const m = modos[gesto.estado];
  if (m && m.tecla && m.tecla(e)) { e.preventDefault(); return; }
  if (gesto.estado === 'libre') {
    const k = e.key.toLowerCase(), wasd = { w: 'w', a: 'a', s: 's', d: 'd', arrowup: 'w', arrowdown: 's' }[k];
    // sentado: A y D giran la vista (como siempre) y W o S te levantan; de pie: WASD caminan y las flechas giran
    if (wasd && (!jug.sentado || wasd === 'w' || wasd === 's') && !(jug.sentado && (k === 'arrowup' || k === 'arrowdown'))) { caminar.teclas.add(wasd); e.preventDefault(); }
    if ((jug.sentado && k === 'a') || e.key === 'ArrowLeft') { rig.teclaGiro = -1; e.preventDefault(); }
    if ((jug.sentado && k === 'd') || e.key === 'ArrowRight') { rig.teclaGiro = 1; e.preventDefault(); }
  }
});
addEventListener('keyup', e => {
  const k = e.key.toLowerCase();
  if (k === 'a' || k === 'd' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') rig.teclaGiro = 0;
  const wasd = { w: 'w', a: 'a', s: 's', d: 'd', arrowup: 'w', arrowdown: 's' }[k]; if (wasd) caminar.teclas.delete(wasd);
});
addEventListener('blur', () => { caminar.teclas.clear(); rig.teclaGiro = 0; });
