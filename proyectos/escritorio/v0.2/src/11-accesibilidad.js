/* ===================== 11 · teclado y accesibilidad =====================
   E20: sin botones a la vista, pero todo se puede hacer con el teclado.
   Tab recorre los objetos (la cámara los mira, brillan y se dice su nombre),
   Intro los coge, E los usa y Esc vuelve. El primer Tab enseña el enlace a la
   web normal. Los lectores de pantalla oyen cada paso (región aria-live). */
const ORDEN = ['manual', ...LIBROS.map(b => 'libro-' + b.id), 'pizarra', 'lampara', 'monitor', 'teclado', 'encendido', 'cajon', ...CARPETAS.map(f => 'carpeta-' + f.id),
  'estuche', ...SIMULACROS.map(s => 'disco-' + s.id), 'expulsar', ...SIMULADORES.map(s => 'usb-' + s.id), 'taza', 'puerta', 'salida'];
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
      enfoca(centroDe(o), BASE, 56, { paralaje: 0, rate: 4 });
    }
    const ok = o.activo();
    anuncia(o.nombre + (ok ? '. Intro para ' + (o.movil || o.tipo === 'libro' ? 'cogerlo' : 'usarlo') + '.' : (clave.startsWith('carpeta') ? '. Abre antes el cajón.' : clave === 'salida' ? '. Abre antes la puerta.' : '.')));
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
  const enNav = e.target && e.target.dataset && e.target.dataset.clave;
  if (e.key === 'Escape') {
    e.preventDefault();
    const m = modos[gesto.estado];
    if (m && m.esc) return m.esc();
    if (gesto.estado === 'libre') {
      if (puertaAbierta) return puerta(false);
      if (cajonM.obj > 0.15) return cierraCajon();
      if (rig.foco) sueltaFoco();
      rumboACero(); if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
    }
    return;
  }
  if (gesto.estado === 'os') return;                              // dentro del PC, el teclado es del sistema
  if ((gesto.estado === 'bot' || gesto.estado === 'escribir')) return;
  if (enNav && (e.key === 'Enter' || e.key === ' ') && gesto.estado === 'libre') return;   // lo hace el botón
  const m = modos[gesto.estado];
  if (m && m.tecla && m.tecla(e)) { e.preventDefault(); return; }
  if (gesto.estado === 'libre') {
    const k = e.key.toLowerCase();
    if (k === 'a' || e.key === 'ArrowLeft') { rig.teclaGiro = -1; e.preventDefault(); }
    if (k === 'd' || e.key === 'ArrowRight') { rig.teclaGiro = 1; e.preventDefault(); }
  }
});
addEventListener('keyup', e => {
  const k = e.key.toLowerCase();
  if (k === 'a' || k === 'd' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') rig.teclaGiro = 0;
});
