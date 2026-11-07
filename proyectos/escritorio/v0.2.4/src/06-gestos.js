/* ===================== 06 · gestos =====================
   El sistema que usan todos los objetos (diagrama: material/v0.2/bocetos/02):
   LIBRE → ENCIMA → PULSADO → (clic) INSPECCIÓN → E: USAR · Esc: vuelve a su sitio
                            → (arrastre) LLEVAR → zona cerca: brilla → soltar: ENCAJA
   Cada modo especial (libro abierto, pizarra, taza…) se registra con modo(). */
const gesto = { estado: 'cargando', pulsado: null, hover: null, obj: null, arrastre: null };
const modos = {};
function modo(nombre, h) { modos[nombre] = h; }
function cambia(estado) { gesto.estado = estado; rig.bordeListo = false; bus.emit('estado', estado); actualizaPunto(); }
const teclado = { activo: false };   // se usa el teclado (Tab) en vez del ratón

/* ---------- el punto (E03, E40) ----------
   Iconos dibujados a mano en SVG con un solo estilo (crema, contorno tinta, acento coral).
   Fuente y hoja de muestra: material/v0.2.1/scripts/iconos.js y bocetos/05-iconos.svg. */
const ICONOS_PUNTO = (() => {
const T = 'stroke="#141221" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"';
const C = 'fill="#FAFAF7" ' + T, K = 'fill="#FF6B4A" ' + T;
return {
  punto: () => `<circle cx="12" cy="12" r="3.2" ${C}/>`,
  mano: () => [
    `<rect x="7" y="4.6" width="2.9" height="9" rx="1.45" ${C}/>`, `<rect x="9.95" y="3" width="2.9" height="10" rx="1.45" ${C}/>`,
    `<rect x="12.9" y="3.6" width="2.9" height="9.6" rx="1.45" ${C}/>`, `<rect x="15.85" y="5.6" width="2.8" height="8" rx="1.4" ${C}/>`,
    `<rect x="3.4" y="10" width="2.9" height="7" rx="1.45" transform="rotate(-38 4.85 13.5)" ${C}/>`,
    `<path d="M6.6 11.4h12.05v4.3a5.6 5.6 0 0 1-5.6 5.6h-1.2a5.6 5.6 0 0 1-4.9-2.9l-1.1-2z" ${C}/>`,
    `<path d="M10 16.2h4.2" stroke="#FF6B4A" stroke-width="1.5" stroke-linecap="round"/>`].join(''),
  agarre: () => [
    `<rect x="6.6" y="7.6" width="3" height="5.4" rx="1.5" ${C}/>`, `<rect x="9.6" y="6.8" width="3" height="6" rx="1.5" ${C}/>`,
    `<rect x="12.6" y="7" width="3" height="6" rx="1.5" ${C}/>`, `<rect x="15.6" y="7.8" width="2.9" height="5.4" rx="1.45" ${C}/>`,
    `<path d="M6 11.2h12.6v3.9a5.6 5.6 0 0 1-5.6 5.6h-1.4A5.6 5.6 0 0 1 6 15.1z" ${C}/>`,
    `<path d="M6.4 12.6c1.6-.4 3.3.2 4 1.5" fill="none" ${T}/>`].join(''),
  girar: () => [
    `<rect x="8.6" y="8.6" width="6.8" height="6.8" rx="1.4" ${K}/>`,
    `<path d="M4.2 12a7.8 7.8 0 0 1 13.3-5.5" fill="none" stroke="#141221" stroke-width="4.2" stroke-linecap="round"/>`,
    `<path d="M4.2 12a7.8 7.8 0 0 1 13.3-5.5" fill="none" stroke="#FAFAF7" stroke-width="1.8" stroke-linecap="round"/>`,
    `<path d="M19.8 12a7.8 7.8 0 0 1-13.3 5.5" fill="none" stroke="#141221" stroke-width="4.2" stroke-linecap="round"/>`,
    `<path d="M19.8 12a7.8 7.8 0 0 1-13.3 5.5" fill="none" stroke="#FAFAF7" stroke-width="1.8" stroke-linecap="round"/>`,
    `<path d="M15.6 3.6l2.6 2.9-3.8.8z" ${C}/>`, `<path d="M8.4 20.4l-2.6-2.9 3.8-.8z" ${C}/>`].join(''),
  rotulador: (color = '#2F5FD0') => [
    `<path d="M3 21l1.4-4.6 2.9 2.9z" fill="${color}" ${T}/>`,
    `<path d="M4.4 16.4l9.8-9.8 3.2 3.2-9.8 9.8z" ${C}/>`,
    `<path d="M14.2 6.6l2.6-2.6a1.6 1.6 0 0 1 2.3 0l.9.9a1.6 1.6 0 0 1 0 2.3l-2.6 2.6z" fill="${color}" ${T}/>`,
    `<path d="M6.8 14l3.2 3.2" stroke="#141221" stroke-width="1.2"/>`].join(''),
  borrador: () => [
    `<g transform="rotate(-40 12 12)"><rect x="4" y="8" width="16" height="8" rx="1.6" fill="#5B4BDB" ${T}/>`,
    `<path d="M4 9.6A1.6 1.6 0 0 1 5.6 8H9.6v8H5.6A1.6 1.6 0 0 1 4 14.4z" ${C}/></g>`,
    `<path d="M12.4 21.4h7.6" stroke="#FF6B4A" stroke-width="1.6" stroke-linecap="round"/>`].join(''),
  pagina: () => [
    `<path d="M5 3.5h9.5l4.5 4.5v12.5H5z" ${C}/>`, `<path d="M14.5 3.5V8H19" fill="#EEECF7" ${T}/>`,
    `<path d="M8 12h7M8 15h5" stroke="#8E8AA3" stroke-width="1.3" stroke-linecap="round"/>`,
    `<path d="M2.6 12.4l3.4-3v6z" ${K}/>`, `<path d="M21.4 12.4l-3.4-3v6z" ${K}/>`].join(''),
  enlace: () => [
    `<path d="M4 7.5a1.5 1.5 0 0 1 1.5-1.5H11v2.6H6.6v8.8h8.8V13H18v5.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5z" ${C}/>`,
    `<path d="M13 3.6h7.4V11l-2.6-2.6-5 5-2.2-2.2 5-5z" ${K}/>`].join(''),
  texto: () => [
    `<path d="M9 4h6M9 20h6M12 4v16" stroke="#141221" stroke-width="4.4" stroke-linecap="round"/>`,
    `<path d="M9 4h6M9 20h6M12 4v16" stroke="#FAFAF7" stroke-width="1.9" stroke-linecap="round"/>`,
    `<circle cx="18.5" cy="12" r="1.6" fill="#FF6B4A" ${T}/>`].join(''),
  rueda: () => [
    `<rect x="7" y="3.6" width="10" height="16.8" rx="5" ${C}/>`, `<path d="M12 3.8v5" stroke="#141221" stroke-width="1.3"/>`,
    `<rect x="10.9" y="6" width="2.2" height="4" rx="1.1" ${K}/>`,
    `<path d="M3.2 9.4l2-2.4 2 2.4M3.2 14.6l2 2.4 2-2.4" fill="none" stroke="#141221" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>`,
    `<path d="M3.2 9.4l2-2.4 2 2.4M3.2 14.6l2 2.4 2-2.4" fill="none" stroke="#FAFAF7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`].join(''),
  lupa: () => [
    `<path d="M14.6 14.6l5.6 5.6" stroke="#141221" stroke-width="5" stroke-linecap="round"/>`, `<path d="M14.6 14.6l5.6 5.6" stroke="#FF6B4A" stroke-width="2.4" stroke-linecap="round"/>`,
    `<circle cx="10" cy="10" r="6.4" ${C}/>`, `<path d="M7 8.4a3.6 3.6 0 0 1 3-2" fill="none" stroke="#8E8AA3" stroke-width="1.3" stroke-linecap="round"/>`].join('')
};
})();
// punto caliente de cada icono (dónde «toca» en la rejilla de 24): la punta del rotulador, el fieltro del borrador…
const ICO_PUNTA = { rotulador: [3, 21], borrador: [6, 16.5] };
const ICO_PX = 30;
const punto = { el: $('#punto'), forma: '', nombre: '', color: '', x: -100, y: -100 };
function setPunto(forma, nombre = '', color = '') {
  if (!ICONOS_PUNTO[forma]) forma = 'punto';
  if (forma !== punto.forma || color !== punto.color) {
    const cambio = forma !== punto.forma;
    punto.forma = forma; punto.color = color;
    const ico = punto.el.querySelector('.ico'), [hx, hy] = ICO_PUNTA[forma] || [12, 12];
    ico.style.left = (-hx / 24 * ICO_PX) + 'px'; ico.style.top = (-hy / 24 * ICO_PX) + 'px';
    ico.innerHTML = '<svg viewBox="0 0 24 24" width="' + ICO_PX + '" height="' + ICO_PX + '">' + ICONOS_PUNTO[forma](color || undefined) + '</svg>';
    if (cambio) { ico.style.transform = 'scale(.6)'; requestAnimationFrame(() => { ico.style.transform = ''; }); }
  }
  if (nombre !== punto.nombre) { punto.nombre = nombre; if (nombre) punto.el.querySelector('.nombre').textContent = nombre; }
  punto.el.classList.toggle('con-nombre', !!nombre);
}
function actualizaPunto() {
  const s = gesto.estado, m = modos[s];
  if (m && m.punto) { const r = m.punto(); setPunto(r[0], r[1] || '', r[2] || ''); return; }
  if (s === 'llevar') return setPunto('agarre');
  if (s === 'inspeccion') return setPunto(gesto.arrastre ? 'agarre' : 'girar');
  if (s === 'libre' && gesto.hover) { const o = objetos.get(gesto.hover); return setPunto(o.puntero || 'mano', o.nombre); }
  setPunto('punto');
}

/* ---------- rayo: qué hay debajo del puntero ---------- */
const raycaster = new THREE.Raycaster(), ndc = new THREE.Vector2();
function pick(lista = pickables) {
  raycaster.setFromCamera(ndc, camera);
  const hits = raycaster.intersectObjects(lista, false);
  for (const h of hits) { const k = h.object.userData.clave, o = k && objetos.get(k); if (o && o.activo()) return { o, hit: h }; }
  return null;
}
function setHover(clave) {
  if (gesto.hover === clave) return;
  if (gesto.hover && objetos.get(gesto.hover)) brillo(objetos.get(gesto.hover).mallas, 0);
  gesto.hover = clave;
  if (clave) brillo(objetos.get(clave).mallas, objetos.get(clave).brilloK ?? 1);
  bus.emit('hover', clave);
  actualizaPunto();
}

/* ---------- puntero ---------- */
let necesitaPick = false, ultimoPuntero = { x: 0, y: 0 }, ratonVisto = false;
function aNdc(e) { ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); }
function alMover(e) {
  aNdc(e); necesitaPick = true; ratonVisto = true; teclado.activo = false; punto.el.classList.remove('oculto');
  punto.x = e.clientX; punto.y = e.clientY; punto.el.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
  if (e.pointerType === 'mouse' || gesto.pulsado == null) { rig.mx = ndc.x; rig.my = ndc.y; }
  else if (gesto.estado === 'libre' && gesto.pulsado && !gesto.pulsado.o) {      // táctil: arrastrar en vacío mira
    rig.rumbo -= (e.clientX - ultimoPuntero.x) * 0.004; rig.my = clamp(rig.my - (e.clientY - ultimoPuntero.y) * 0.004, -1, 1);
  }
  ultimoPuntero = { x: e.clientX, y: e.clientY };
  const m = modos[gesto.estado]; if (m && m.move) return m.move(e);
  const p = gesto.pulsado;
  // fallo 11 (v0.2.2): un clic SIEMPRE coge e inspecciona, aunque la mano tiemble un poco al pulsar. Para llevar un
  // objeto hay que mantenerlo pulsado (0,3 s, el punto cambia a «agarre») y después arrastrar. Lo que se arrastra
  // sin cogerse (el cajón, el tirador) sigue igual: responde al momento.
  if (p && p.o) {
    const d = Math.hypot(e.clientX - p.x, e.clientY - p.y);
    // v0.2.3 (fallo 26): con un ratón o un panel táctil de verdad, un clic tiembla y a veces dura más de 0,3 s. Ahora
    // llevar pide mantener 0,45 s quieto y DESPUÉS arrastrar más de 10 px; y un clic que se ha movido hasta 40 px sigue
    // siendo un clic si dura menos de 0,35 s
    if (p.o.movil && p.listo && d > 10 && alcanza(p.o)) { gesto.pulsado = null; registroClic(p, 'llevar', d); empiezaLlevar(p.o, p.hit); }
    else if (!p.o.movil && p.o.alArrastrar && d > 6 && alcanza(p.o)) { gesto.pulsado = null; p.o.alArrastrar.empieza(p, e); gesto.arrastre = p.o; }
    else if (d > 40) p.lejos = true;                     // se ha movido mucho: no es un clic (mirar con el ratón)
    p.dMax = Math.max(p.dMax || 0, d);
  }
  if (gesto.arrastre && gesto.arrastre.alArrastrar) gesto.arrastre.alArrastrar.mueve(e);
}
function alPulsar(e) {
  aNdc(e); if (!control.bloqueado && canvas.setPointerCapture && e.pointerId != null) try { canvas.setPointerCapture(e.pointerId); } catch (x) { /* el puntero virtual no se captura */ }
  ultimoPuntero = { x: e.clientX, y: e.clientY };
  const m = modos[gesto.estado]; if (m && m.down) return m.down(e);
  if (gesto.estado !== 'libre') return;
  const r = pick();
  gesto.pulsado = { x: e.clientX, y: e.clientY, o: r && r.o, hit: r && r.hit, t: performance.now(), listo: false, lejos: false };
}
// mantener pulsado: a los 0,3 s sin moverse, el objeto se puede llevar (y lo dice el punto). En la mano, a los 0,45 s pasa a llevarse
function corrPulsacion(ahora) {
  const p = gesto.pulsado;
  // v0.2.4 (modo juego): con el ratón capturado no se arrastra (el ratón mueve la cabeza): a los 0,45 s pulsado, el objeto
  // se levanta y te sigue la mira; al soltar el botón, se suelta donde brille
  if (control.bloqueado && p && p.o && p.o.movil && !p.lejos && ahora - p.t > 450 && gesto.estado === 'libre' && alcanza(p.o)) { gesto.pulsado = null; registroClic(p, 'llevar', p.dMax); empiezaLlevar(p.o, p.hit); return; }
  if (p && p.o && p.o.movil && !p.listo && !p.lejos && ahora - p.t > 450 && Math.hypot(ultimoPuntero.x - p.x, ultimoPuntero.y - p.y) < 8) { p.listo = true; setPunto('agarre', p.o.nombre); }
  // v0.2.3 (fallo 26): ya NO se pasa de la mano a llevar por dejar el botón pulsado en la inspección. Era la otra forma
  // de «saltarse» la inspección: pulsar para girar el objeto, pararse un instante y verlo salir de la mano.
}
// registro de los últimos clics (para el panel ?fps y las pruebas): qué se decidió y con qué tiempo y distancia
const clics = [];
function registroClic(p, que, d) { clics.push({ o: p.o ? p.o.clave : null, que, ms: Math.round(performance.now() - p.t), px: Math.round(d ?? p.dMax ?? 0) }); if (clics.length > 12) clics.shift(); }
function pasaDeLaManoALlevar() {
  const o = insp.o; gesto.arrastre = null; giro.arrastrando = false;
  $('#velo').classList.remove('on'); ocultaTeclas(); insp.o = null; sueltaFoco(); rig.foco = null;
  cambia('libre'); empiezaLlevar(o, null); llevar.salida = null;
}
function alSoltar(e) {
  aNdc(e);
  const m = modos[gesto.estado]; if (m && m.up) return m.up(e);
  if (gesto.arrastre) { const o = gesto.arrastre; gesto.arrastre = null; o.alArrastrar.suelta(e); return; }
  const p = gesto.pulsado; gesto.pulsado = null;
  if (p && p.o && p.lejos && performance.now() - p.t < 350) p.lejos = false;          // un clic rápido aunque la mano tiemble
  if (p && p.o) registroClic(p, p.lejos ? 'nada (se movió)' : (gesto.estado === 'libre' ? 'clic' : 'nada (' + gesto.estado + ')'));
  if (p && p.o && !p.lejos && gesto.estado === 'libre') clicEn(p.o, p.hit, e);
}
canvas.addEventListener('pointerleave', () => { if (control.bloqueado) return; if (gesto.estado === 'libre') setHover(null); punto.el.classList.add('oculto'); });
canvas.addEventListener('wheel', e => {
  const m = modos[gesto.estado];
  if (m && m.wheel) { e.preventDefault(); m.wheel(e); return; }
  if (gesto.estado === 'libre' && gesto.hover === 'raton') { e.preventDefault(); cambiaSensibilidad(e.deltaY < 0 ? 1 : -1); }   // E37
}, { passive: false });
// v0.2.2 (E48): ¿se llega desde aquí? Lo de la mesa, solo sentado; lo demás, si estás en su sitio o cerca.
// Si no, se va hasta él (caminando o sentándose, módulo 12) y después se hace lo que se pidió.
// v0.2.3 (E56-17): lo de la mesa también se coge, se lleva y se conecta DE PIE si llegas (a menos de 1,1 m en el suelo
// y delante de la mesa). Solo teclear y entrar en el PC piden la silla (soloSentado). Si no llegas, vas al lado de la
// mesa más cercano al objeto; no te sientas.
function alcanza(o) {
  const lugar = o.lugar || 'mesa';
  if (lugar === 'mesa') {
    if (jug.sentado) return true;
    if (o.soloSentado || enSillon.si || caminar.activo) return false;
    const c = centroDe(o); return jug.pos.z < 1.0 && Math.hypot(jug.pos.x - c.x, jug.pos.z - c.z) < 1.1;
  }
  if (lugar === 'cualquiera') return true;
  if (jug.en === lugar && !caminar.activo) return true;
  return ojos().distanceTo(centroDe(o)) < (o.alcance || 1.5);
}
function clicEn(o, hit, e) {
  if (!alcanza(o)) {
    const lugar = o.lugar || 'mesa';
    const ir = lugar !== 'mesa' ? irA(lugar) : (o.soloSentado ? irA('silla') : irALaMesa(centroDe(o)));
    return ir.then(ok => { if (ok && gesto.estado === 'libre' && alcanza(o)) clicEn(o, hit, e); });
  }
  if (o.alClic) return o.alClic(o, hit, e);
  if (o.movil || o.tipo === 'libro') return inspecciona(o);
}

/* ---------- INSPECCIÓN: el objeto en la mano (E03 · decisión de Sergio del 4 nov) ---------- */
const insp = { o: null, q: new THREE.Quaternion(), dist: 0.4, llegando: false };
const _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _v = new THREE.Vector3(), _e = new THREE.Euler();
function poseInspeccion(o, salidaPos, salidaQuat) {
  // delante de la cámara, a «dist» metros; orientado según su «insp.rot» y lo que lo haya girado la persona
  camera.getWorldDirection(_v);
  salidaPos.copy(camera.position).addScaledVector(_v, insp.dist);
  _q2.setFromEuler(o.insp.rot);
  salidaQuat.copy(camera.quaternion).multiply(insp.q).multiply(_q2);
}
async function inspecciona(o, op = {}) {
  if (gesto.estado !== 'libre') return;
  // v0.2.4 (E59-1): si el disco está en la torre (clic en él o «expulsar»), sale de la bandeja y viene a la mano;
  // antes volaba al estuche sin pasar por la mano y la torre seguía creyendo que lo tenía
  if (o.tipo === 'disco' && torre.disco === o && !op.yaFuera) return expulsaALaMano();
  setHover(null); cambia('ocupado');
  enfoca(camera.position.clone().add(camera.getWorldDirection(new THREE.Vector3())), camera.position.clone(), cam.fov, { paralaje: 0 });
  insp.o = o; insp.q.identity(); reiniciaGiro(); insp.dist = o.insp.dist; gesto.obj = o;
  bus.emit('coge', o);
  scene.attach(o.raiz);
  $('#velo').classList.add('on');
  if (o.pila) await sacaDePila(o);                     // fallo 27: de una pila no se saca uno de abajo sin mover los de encima
  const p0 = o.raiz.position.clone(), q0 = o.raiz.quaternion.clone(), p1 = new THREE.Vector3(), q1 = new THREE.Quaternion();
  if (o.alCoger) o.alCoger();
  // sale de su sitio (un poco hacia la silla) y vuela a la mano
  // del archivador, la peana y el cajón sale en vertical; de la estantería, tirando del lomo (fallo 4)
  const salida = op.yaFuera ? p0.clone() : o.pila ? p0.clone().add(v3(0, 0.05, 0)) : o.casaArriba ? p0.clone().add(o.casaArriba) : (o.salidaLocal ? p0.clone().add(o.salidaLocal.clone().applyQuaternion(q0)) : p0.clone().add(new THREE.Vector3(0, 0.03, 0.06)));
  if (!op.yaFuera) await anim(o.casaArriba || o.salidaLocal ? 320 : 180, e => o.raiz.position.lerpVectors(p0, salida, e), curva.sale);
  await anim(560, e => { poseInspeccion(o, p1, q1); o.raiz.position.lerpVectors(salida, p1, e); o.raiz.quaternion.slerpQuaternions(q0, q1, e); }, curva.suave);
  cambia('inspeccion'); recordatorioTeclas();
  anuncia(o.nombre + ' en la mano. Arrastra o usa las flechas para girarlo, E para usarlo, Esc para dejarlo.');
}
/* Girar en la mano con inercia y un muelle (E35, v0.2.1).
   Dos ángulos por eje (x: arrastre horizontal, y: vertical):
   · el OBJETIVO θT, que suma lo que arrastras y, al soltar, sigue con la velocidad que llevabas (como mucho 10 rad/s) y frena (fricción 4,5/s);
   · el MOSTRADO θ, que persigue a θT con un muelle amortiguado (k = 260, ζ = 0,8): va detrás de la mano con suavidad y llega sin saltos.
   Cada fotograma se gira el objeto lo que avanzó θ (Δθ), en el espacio de la cámara. Fragmento F2 en material/v0.2.1. */
const GIRO = { k: 260, zeta: 0.8, friccion: 4.5, porPx: 0.012, vMax: 10 };
const giro = { tx: 0, ty: 0, x: 0, y: 0, vx: 0, vy: 0, wx: 0, wy: 0, ult: 0, arrastrando: false };
function corrGiro(dt) {
  const g = giro, c = 2 * GIRO.zeta * Math.sqrt(GIRO.k);
  if (!g.arrastrando && (g.wx || g.wy)) {                         // inercia: el objetivo sigue solo y frena
    g.tx += g.wx * dt; g.ty += g.wy * dt;
    const f = Math.exp(-GIRO.friccion * dt); g.wx *= f; g.wy *= f;
    if (Math.hypot(g.wx, g.wy) < 0.02) g.wx = g.wy = 0;
  }
  const x0 = g.x, y0 = g.y;
  if (reduced) { g.x = g.tx; g.y = g.ty; g.vx = g.vy = 0; }
  else {
    const sub = Math.ceil(dt / 0.008), h = dt / sub;               // pasos pequeños: Euler semiimplícito estable
    for (let i = 0; i < sub; i++) {
      g.vx += (GIRO.k * (g.tx - g.x) - c * g.vx) * h; g.x += g.vx * h;
      g.vy += (GIRO.k * (g.ty - g.y) - c * g.vy) * h; g.y += g.vy * h;
    }
  }
  const dx = g.x - x0, dy = g.y - y0;
  if (dx || dy) giraInspeccion(dx, dy);
}
function empujaGiro(dx, dy) { giro.tx += dx; giro.ty += dy; }
function reiniciaGiro() { Object.assign(giro, { tx: 0, ty: 0, x: 0, y: 0, vx: 0, vy: 0, wx: 0, wy: 0, arrastrando: false }); }
function corrInspeccion(dt) {
  if (gesto.estado !== 'inspeccion' || !insp.o) return;
  corrGiro(dt);
  const p1 = new THREE.Vector3(), q1 = new THREE.Quaternion();
  poseInspeccion(insp.o, p1, q1);
  const k = reduced ? 1 : 1 - Math.exp(-dt * 14);
  insp.o.raiz.position.lerp(p1, k); insp.o.raiz.quaternion.slerp(q1, k);
}
function giraInspeccion(dx, dy) {
  // girar en el espacio de la cámara: arrastrar a la derecha gira sobre el eje vertical de la pantalla
  _q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), dx); insp.q.premultiply(_q);
  _q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), dy); insp.q.premultiply(_q);
}
modo('inspeccion', {
  down(e) { gesto.arrastre = { x: e.clientX, y: e.clientY, movido: 0, t: e.timeStamp, t0: performance.now() }; giro.arrastrando = true; giro.wx = giro.wy = 0; actualizaPunto(); },
  move(e) {
    const a = gesto.arrastre; if (!a) return;
    const dx = (e.clientX - a.x) * GIRO.porPx, dy = (e.clientY - a.y) * GIRO.porPx, dts = Math.max(0.008, (e.timeStamp - a.t) / 1000);
    empujaGiro(dx, dy);
    // velocidad del arrastre, suavizada: es la que se queda al soltar
    giro.wx = clamp(0.6 * dx / dts + 0.4 * giro.wx, -GIRO.vMax, GIRO.vMax); giro.wy = clamp(0.6 * dy / dts + 0.4 * giro.wy, -GIRO.vMax, GIRO.vMax);
    a.movido += Math.abs(e.clientX - a.x) + Math.abs(e.clientY - a.y); a.x = e.clientX; a.y = e.clientY; a.t = e.timeStamp;
  },
  up(e) {
    const a = gesto.arrastre; gesto.arrastre = null; giro.arrastrando = false;
    if (!a || (e && e.timeStamp - a.t > 90)) giro.wx = giro.wy = 0;   // si te paraste antes de soltar, no hay inercia
    actualizaPunto();
  },
  wheel(e) { insp.dist = clamp(insp.dist + Math.sign(e.deltaY) * 0.03, insp.o.insp.dist * 0.55, insp.o.insp.dist * 1.5); },
  tecla(e) {
    const k = e.key;
    if (k === 'ArrowLeft') empujaGiro(-0.35, 0); else if (k === 'ArrowRight') empujaGiro(0.35, 0);
    else if (k === 'ArrowUp') empujaGiro(0, -0.35); else if (k === 'ArrowDown') empujaGiro(0, 0.35);
    else if (k === '+') insp.dist = Math.max(insp.o.insp.dist * 0.55, insp.dist - 0.03);
    else if (k === '-') insp.dist = Math.min(insp.o.insp.dist * 1.5, insp.dist + 0.03);
    else if (k === 'e' || k === 'E' || k === 'Enter') usa(insp.o);
    else return false;
    return true;
  },
  esc() { dejaInspeccion(); }
});
async function dejaInspeccion() {
  const o = insp.o; if (!o) return;
  cambia('ocupado'); $('#velo').classList.remove('on'); ocultaTeclas();
  await volverACasa(o);
  insp.o = null; gesto.obj = null; sueltaFoco(); cambia('libre'); bus.emit('vuelve');
}
function usa(o) {
  const fn = o.alUsar || USOS[o.tipo];
  if (!fn) return;
  $('#velo').classList.remove('on'); ocultaTeclas();
  insp.o = null;
  fn(o);
}
const USOS = {};   // tipo → qué hace E (los rellena el módulo 07)
// B(t) = (1−t)²·P0 + 2(1−t)t·C + t²·P1: la curva de Bézier cuadrática (sale de P0 hacia C y llega a P1)
function bezier2(p0, c, p1, t, salida) {
  const a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, d = t * t;
  return salida.set(a * p0.x + b * c.x + d * p1.x, a * p0.y + b * c.y + d * p1.y, a * p0.z + b * c.z + d * p1.z);
}
async function volverACasa(o, dur = 620) {
  if (o.pila) ponEnPila(o);                             // fallo 27: vuelve ARRIBA de la pila, como en la vida real
  const c = o.casa, p0 = o.raiz.position.clone(), q0 = o.raiz.quaternion.clone();
  // destino en coordenadas del mundo (el padre puede ser el cajón, que se mueve)
  c.padre.updateMatrixWorld(true);
  const pW = c.pos.clone().applyMatrix4(c.padre.matrixWorld);
  const qW = c.padre.getWorldQuaternion(new THREE.Quaternion()).multiply(c.quat);
  if (o.tipo === 'disco') { tapaEstuche(true); estucheHasta = performance.now() + dur + 1600; }
  if (o.casaArriba) {
    // v0.2.1 (E35): sube por encima de las paredes del estuche o del portalápices y baja en vertical.
    // Curva de Bézier cuadrática P0 → C → arriba, con C a media distancia y por encima de los dos extremos
    const arriba = pW.clone().add(o.casaArriba);
    const C = p0.clone().lerp(arriba, 0.5); C.y = Math.max(p0.y, arriba.y) + 0.06;
    await anim(dur, e => { bezier2(p0, C, arriba, e, o.raiz.position); o.raiz.quaternion.slerpQuaternions(q0, qW, Math.min(1, e * 1.4)); }, curva.suave);
    await anim(260, e => o.raiz.position.lerpVectors(arriba, pW, e), curva.sale);
  } else {
    // los libros vuelven tirando del lomo hacia dentro (fallo 4: antes entraban de lado entre los otros)
    const arriba = o.salidaLocal ? pW.clone().add(o.salidaLocal.clone().applyQuaternion(qW)) : pW.clone().add(new THREE.Vector3(0, 0.05, 0.05));
    await anim(dur, e => { o.raiz.position.lerpVectors(p0, arriba, e); o.raiz.quaternion.slerpQuaternions(q0, qW, e); }, curva.suave);
    await anim(o.salidaLocal ? 320 : 200, e => o.raiz.position.lerpVectors(arriba, pW, e), curva.sale);
  }
  c.padre.attach(o.raiz); o.raiz.position.copy(c.pos); o.raiz.quaternion.copy(c.quat);
  bus.emit('deja', o);
}
let teclasVistas = guardado.get('teclas', 0);
function recordatorioTeclas() {
  if (teclasVistas >= 2) return;
  teclasVistas++; guardado.set('teclas', teclasVistas);
  const t = $('#teclas'); t.innerHTML = '<span><kbd>E</kbd>usar</span><span><kbd>Esc</kbd>dejar</span><span>arrastra para girarlo</span>'; t.classList.add('on');
}
function ocultaTeclas() { $('#teclas').classList.remove('on'); }

/* ---------- LLEVAR y ZONAS de destino (E05, E24) ---------- */
const zonas = [];
function zona(z) { z.prox = 0; z.activa = false; zonas.push(z); return z; }
const llevar = { o: null, obj: new THREE.Vector3(), prev: new THREE.Vector3(), vel: new THREE.Vector3(), zona: null, q: new THREE.Quaternion() };
const planoTrabajo = new THREE.Plane(new THREE.Vector3(0, 1, 0), -PLANO_Y);
function empiezaLlevar(o, hit) {
  setHover(null); cambia('llevar'); gesto.obj = o; llevar.o = o;
  bus.emit('coge', o);
  scene.attach(o.raiz);
  llevar.obj.copy(o.raiz.position); llevar.prev.copy(o.raiz.position); llevar.vel.set(0, 0, 0);
  llevar.q.copy(o.raiz.quaternion);
  // v0.2.1 (E35): primero sale en vertical de su sitio (el estuche, el portalápices, el cajón) y después te sigue
  llevar.salida = o.casaArriba ? { desde: o.raiz.position.clone(), alto: o.casaArriba.y } : null;
  rig.sensib = 0.45;   // mientras llevas algo, la cámara gira menos con el ratón
  anuncia('Llevas ' + o.nombre + '. Suéltalo donde brille.');
}
const _hitP = new THREE.Vector3();
const QLLEVAR = { disco: new THREE.Quaternion().setFromEuler(new THREE.Euler(0.85, 0, 0)),   // el disco se lleva inclinado hacia ti: se ve su etiqueta
  usb: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, Math.PI, 0)), carpeta: new THREE.Quaternion(), taza: null };
function corrLlevar(dt) {
  const o = llevar.o; if (gesto.estado !== 'llevar' || !o) return;
  raycaster.setFromCamera(ndc, camera);
  let alturaBase = PLANO_Y + (o.tipo === 'taza' ? 0.06 : o.tipo === 'disco' ? 0.08 : 0.04);
  planoTrabajo.constant = -alturaBase;
  if (raycaster.ray.intersectPlane(planoTrabajo, _hitP)) {
    // límites: encima de la mesa y siempre delante de la torre y del monitor (si no, el objeto se esconde detrás)
    _hitP.x = clamp(_hitP.x, -0.85, 0.7); _hitP.z = clamp(_hitP.z, -0.5, 0.0);
    if (_hitP.z < -0.16) _hitP.x = Math.min(_hitP.x, TORRE.x - TORRE.w / 2 - 0.08);   // la torre no se atraviesa
    // por encima del estuche y del portalápices, el objeto vuela más alto para no meterse dentro
    const sobreEst = Math.hypot(_hitP.x - estuche.position.x, _hitP.z - estuche.position.z) < 0.16, sobreVaso = Math.hypot(_hitP.x - PEANA.x, _hitP.z - PEANA.z) < 0.1;
    // la zona más cercana que acepte este objeto
    let mejor = null;
    for (const z of zonas) {
      if (!z.acepta(o)) { z.prox = 0; continue; }
      if (z.prox_) { z.prox = z.prox_(_hitP); }
      else {
        // cerca = cerca EN LA PANTALLA: se compara dónde apunta el ratón con dónde se ve la zona
        _v.copy(z.punto).project(camera);
        const d = Math.hypot((ndc.x - _v.x) * camera.aspect, ndc.y - _v.y);
        z.prox = _v.z < 1 ? clamp(1 - d / z.radio, 0, 1) : 0;
      }
      if (z.prox > 0 && (!mejor || z.prox > mejor.prox)) mejor = z;
    }
    zonas.forEach(z => {
      const activa = z === mejor;
      if (activa && !z.activa) { z.activa = true; z.alEntrar && z.alEntrar(o); }
      if (!activa && z.activa) { z.activa = false; z.alSalir && z.alSalir(o); }
      brillo(z.mallas, activa ? 1.4 + 2.4 * z.prox + Math.sin(performance.now() / 120) * 0.4 : 0);
    });
    if (sobreEst || sobreVaso) alturaBase = Math.max(alturaBase, MESA_Y + 0.21);
    llevar.zona = mejor;
    // cerca de la zona, el objeto sube hacia ella y se orienta como encajará
    const s = mejor ? curva.suave(mejor.prox) : 0;
    llevar.obj.set(lerp(_hitP.x, mejor ? mejor.punto.x : _hitP.x, s), lerp(alturaBase, mejor ? mejor.punto.y : alturaBase, s), lerp(_hitP.z, mejor ? mejor.punto.z : _hitP.z, s));
  }
  const sal = llevar.salida;
  if (sal) {                                   // fase de salida: sube recto hasta pasar las paredes
    llevar.obj.set(sal.desde.x, sal.desde.y + sal.alto, sal.desde.z);
    if (o.raiz.position.y > sal.desde.y + sal.alto * 0.85) llevar.salida = null;
  }
  const k = reduced ? 1 : 1 - Math.exp(-dt * 16);
  o.raiz.position.lerp(llevar.obj, k);
  // inclinación según la velocidad: el objeto «cuelga» un poco al moverlo
  llevar.vel.subVectors(o.raiz.position, llevar.prev).divideScalar(Math.max(dt, 1e-3)); llevar.prev.copy(o.raiz.position);
  const qBase = QLLEVAR[o.tipo] || llevar.q;
  const qZona = llevar.zona && llevar.zona.quat ? llevar.zona.quat : qBase;
  _q.copy(qBase).slerp(qZona, llevar.zona ? curva.suave(llevar.zona.prox) : 0);
  _e.set(clamp(llevar.vel.z * 0.35, -0.35, 0.35), 0, clamp(-llevar.vel.x * 0.35, -0.35, 0.35));
  _q2.setFromEuler(_e); _q2.multiply(_q);
  o.raiz.quaternion.slerp(_q2, k);
}
modo('llevar', {
  up() { sueltaLlevar(); },
  esc() { sueltaLlevar(true); }
});
async function sueltaLlevar(cancelar = false) {
  const o = llevar.o; if (!o) return;
  const z = cancelar ? null : llevar.zona;
  zonas.forEach(zz => { brillo(zz.mallas, 0); if (zz.activa && zz !== z) { zz.activa = false; zz.alSalir && zz.alSalir(o); } zz.activa = false; });
  llevar.o = null; llevar.zona = null; rig.sensib = 1; cambia('ocupado');
  if (z && z.prox > 0.12) { await z.encaja(o); return; }
  if (o.dejaDondeSea && !cancelar) {           // la taza se queda donde la sueltes
    const destino = o.raiz.position.clone(); destino.y = o.casa.pos.y;
    const p0 = o.raiz.position.clone(), q0 = o.raiz.quaternion.clone(), q1 = o.casa.quat.clone();
    await anim(260, e => { o.raiz.position.lerpVectors(p0, destino, e); o.raiz.quaternion.slerpQuaternions(q0, q1, e); }, curva.rebote);
    o.casa.pos.copy(destino); scene.attach(o.raiz); gesto.obj = null; cambia('libre'); bus.emit('deja', o); return;
  }
  await volverACasa(o, 520);
  gesto.obj = null; cambia('libre'); bus.emit('vuelve');
}
function anuncia(t) { const a = $('#anuncio'); a.textContent = ''; setTimeout(() => { a.textContent = t; }, 30); }


/* ---------- v0.2.4 (E59-15): controles de juego · ratón capturado (Pointer Lock) + WASD ----------
   Dos modos (se elige en el móvil, Ajustes → Controles, y se guarda):
   · «juego» (por defecto con ratón): un clic captura el ratón. Mover el ratón gira la cabeza sin pulsar; la mira está en
     el centro (el mismo punto de siempre, con sus iconos); clic izquierdo coge o usa; mantenerlo 0,45 s, lleva; E usa;
     Esc sale de algo y, porque lo obliga el navegador, suelta el ratón; el clic derecho sale SIN soltarlo.
     Lo que necesita un cursor (la hoja, la pizarra, el reloj, el móvil, el libro…) usa un cursor propio que se mueve
     con el ratón capturado: a cada modo le llegan eventos «virtuales» con su clientX y clientY, igual que en el clásico.
     El PC suelta el ratón (dentro hay un escritorio con su propio cursor).
   · «clasico»: el de la v0.2.3 (la mirada sigue al cursor; clic en sitios; arrastrar).
   Compatibilidad (web-features, nov 2026): Chrome 37, Edge 13, Firefox 50, Safari 10.1; no en Safari de iOS. Dentro de
   un <iframe> hace falta «allow-pointer-lock». Si no se puede capturar, se queda en el clásico y lo dice. */
const PL_OK = 'requestPointerLock' in Element.prototype && !matchMedia('(pointer: coarse)').matches;
const control = {
  modo: PL_OK ? (PARAMS.get('controles') || guardado.get('controles', 'juego')) : 'clasico',
  bloqueado: false, cursor: { x: innerWidth / 2, y: innerHeight / 2 }, soltandoYo: false, ultimoEsc: 0, fallos: 0, comerClic: false
};
if (control.modo !== 'juego' && control.modo !== 'clasico') control.modo = 'juego';
const MODOS_CAMARA = new Set(['libre', 'llevar', 'ocupado', 'cargando']);   // en estos, el ratón capturado mueve la cabeza
const SENS_JUEGO = 0.0022;                                                 // radianes por píxel de ratón (× la sensibilidad)
function pideCaptura() {
  if (!PL_OK || control.modo !== 'juego' || control.bloqueado || !$('#os').hidden) return;
  try {
    const r = canvas.requestPointerLock({ unadjustedMovement: true });
    if (r && r.catch) r.catch(() => { try { const r2 = canvas.requestPointerLock(); if (r2 && r2.catch) r2.catch(fallaCaptura); } catch (x) { fallaCaptura(); } });
  } catch (x) { fallaCaptura(); }
}
function sueltaCaptura() { if (control.bloqueado) { control.soltandoYo = true; document.exitPointerLock(); } }
function fallaCaptura() {
  control.fallos++;
  if (control.fallos >= 3) { control.modo = 'clasico'; anuncia('Este navegador no deja capturar el ratón: sigues con los controles clásicos.'); avisoCaptura('Sin ratón capturado: controles clásicos'); }
}
document.addEventListener('pointerlockerror', fallaCaptura);
document.addEventListener('pointerlockchange', () => {
  const ahora = document.pointerLockElement === canvas;
  if (ahora === control.bloqueado) return;
  control.bloqueado = ahora;
  document.body.classList.toggle('capturado', ahora);
  if (ahora) {
    control.fallos = 0; control.cursor = { x: innerWidth / 2, y: innerHeight / 2 }; rig.mx = rig.my = 0; rig.pj = cam.pitch;
    ndc.set(0, 0); necesitaPick = true; ratonVisto = true; teclado.activo = false; punto.el.classList.remove('oculto');
    if (!MODOS_CAMARA.has(gesto.estado) && gesto.estado !== 'inspeccion') colocaPunto(control.cursor.x, control.cursor.y); else colocaPunto(innerWidth / 2, innerHeight / 2);
  } else {
    // se ha soltado: si no lo hemos soltado nosotros (el PC), ha sido Esc → sale de algo, como siempre (salvo que la tecla
    // ya lo hiciera: algunos navegadores entregan el Esc y otros no)
    if (!control.soltandoYo && performance.now() - control.ultimoEsc > 400) salDeAlgo();
    control.soltandoYo = false; rig.mx = rig.my = 0; ndc.set(0, 0);
  }
  actualizaAvisoCaptura();
});
function colocaPunto(x, y) { punto.x = x; punto.y = y; punto.el.style.transform = 'translate(' + x + 'px,' + y + 'px)'; }
// un evento «de mentira» con la posición del cursor propio (para los modos que leen clientX y clientY)
function virtual(e) {
  return { clientX: control.cursor.x, clientY: control.cursor.y, timeStamp: e.timeStamp, button: e.button, buttons: e.buttons, pointerType: 'mouse', pointerId: null,
    shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, altKey: e.altKey, detail: e.detail, preventDefault() {}, stopPropagation() {}, target: canvas };
}
let _virtualAntes = null;
function moverCapturado(e) {
  const mx = e.movementX || 0, my = e.movementY || 0;
  if (Math.abs(mx) > 400 || Math.abs(my) > 400) return;          // algunos navegadores mandan un salto enorme al capturar
  const est = gesto.estado;
  if (gesto.arrastre && gesto.arrastre.alArrastrar) {              // un cajón o un tirador: se mueve el cursor propio, no la cabeza
    control.cursor.x = clamp(control.cursor.x + mx, 0, innerWidth); control.cursor.y = clamp(control.cursor.y + my, 0, innerHeight);
    gesto.arrastre.alArrastrar.mueve(virtual(e)); return;
  }
  if (MODOS_CAMARA.has(est)) {
    const f = SENS_JUEGO * sensF() * (est === 'llevar' ? 0.7 : 1);
    if (rig.foco && est === 'libre' && rig.foco.rate !== 30) { sueltaFoco(); teclado.activo = false; }   // mirar con el ratón deja lo que enfocaba el Tab o el cajón
    if (!rig.foco || est === 'llevar') { rig.rumbo -= mx * f; rig.pj = clamp((rig.pj ?? cam.pitch) - my * f, -1.35, 1.3); }
    if (gesto.pulsado) gesto.pulsado.dMax = (gesto.pulsado.dMax || 0) + Math.abs(mx) + Math.abs(my);
    if (gesto.pulsado && gesto.pulsado.dMax > 60) gesto.pulsado.lejos = true;   // has girado mucho con el botón pulsado: no era un clic
    ndc.set(0, 0); necesitaPick = true; return;
  }
  if (est === 'inspeccion') {                                         // como en Resident Evil: mover el ratón gira lo que tienes
    const dx = mx * GIRO.porPx, dy = my * GIRO.porPx, dts = 1 / 60;
    empujaGiro(dx, dy); giro.wx = clamp(0.6 * dx / dts + 0.4 * giro.wx, -GIRO.vMax, GIRO.vMax) * 0.5; giro.wy = clamp(0.6 * dy / dts + 0.4 * giro.wy, -GIRO.vMax, GIRO.vMax) * 0.5;
    return;
  }
  // el resto (hoja, pizarra, reloj, móvil, libro…): el cursor propio
  control.cursor.x = clamp(control.cursor.x + mx, 0, innerWidth); control.cursor.y = clamp(control.cursor.y + my, 0, innerHeight);
  colocaPunto(control.cursor.x, control.cursor.y);
  const v = virtual(e); aNdc(v); rig.mx = ndc.x; rig.my = ndc.y;
  const m = modos[est]; if (m && m.move) m.move(v);
}
function entradaMover(e) { if (control.bloqueado) return moverCapturado(e); alMover(e); }
function entradaPulsar(e) {
  if (e.button === 2) { e.preventDefault(); if (gesto.estado !== 'cargando') salDeAlgo(); return; }   // clic derecho: salir de algo (sin soltar el ratón)
  if (control.modo === 'juego' && !control.bloqueado && PL_OK && $('#os').hidden && (MODOS_CAMARA.has(gesto.estado) || gesto.estado === 'inspeccion')) {
    // el primer clic solo captura el ratón (no coge nada: así no se coge algo sin querer al volver)
    control.comerClic = true; pideCaptura(); return;
  }
  if (!control.bloqueado) return alPulsar(e);
  const est = gesto.estado;
  if (est === 'inspeccion') { control.inspPulsado = performance.now(); return; }   // el clic izquierdo en la mano = usar (al soltar)
  if (MODOS_CAMARA.has(est)) {
    if (est !== 'libre') return;
    ndc.set(0, 0); const r = pick();
    gesto.pulsado = { x: 0, y: 0, o: r && r.o, hit: r && r.hit, t: performance.now(), listo: false, lejos: false, dMax: 0 };
    if (r && r.o && !r.o.movil && r.o.alArrastrar && alcanza(r.o)) {    // un cajón: se agarra y se mueve con el cursor propio
      control.cursor = { x: innerWidth / 2, y: innerHeight / 2 }; const v = virtual(e); gesto.pulsado = null; r.o.alArrastrar.empieza({ x: v.clientX, y: v.clientY, o: r.o, hit: r.hit, t: performance.now() }, v); gesto.arrastre = r.o;
    }
    return;
  }
  const v = virtual(e); aNdc(v); const m = modos[est]; if (m && m.down) m.down(v);
}
function entradaSoltar(e) {
  if (e.button === 2) return;
  if (control.comerClic) { control.comerClic = false; return; }
  if (!control.bloqueado) return alSoltar(e);
  const est = gesto.estado;
  if (gesto.arrastre && gesto.arrastre.alArrastrar) { const o = gesto.arrastre; gesto.arrastre = null; o.alArrastrar.suelta(virtual(e)); return; }
  if (est === 'inspeccion') { if (control.inspPulsado && performance.now() - control.inspPulsado < 400 && insp.o) usa(insp.o); control.inspPulsado = 0; return; }
  if (est === 'llevar') { sueltaLlevar(); return; }
  if (est === 'pegar') { modos.pegar.up(); return; }
  if (MODOS_CAMARA.has(est)) {
    const p = gesto.pulsado; gesto.pulsado = null;
    if (p && p.o) registroClic(p, p.lejos ? 'nada (se giró)' : 'clic (mira)', p.dMax);
    if (p && p.o && !p.lejos && est === 'libre') clicEn(p.o, p.hit, e);
    return;
  }
  const v = virtual(e); aNdc(v); const m = modos[est]; if (m && m.up) m.up(v);
}
canvas.addEventListener('pointermove', entradaMover);
canvas.addEventListener('pointerdown', entradaPulsar);
canvas.addEventListener('pointerup', entradaSoltar);
canvas.addEventListener('contextmenu', e => e.preventDefault());
// al cambiar de estado con el ratón capturado: en los modos de cursor, el cursor propio empieza en el centro; en los de
// cámara, la mira vuelve al centro. Entrar en el PC suelta el ratón
bus.on('estado', est => {
  if (est === 'os') { sueltaCaptura(); return; }
  if (!control.bloqueado) { actualizaAvisoCaptura(); return; }
  if (MODOS_CAMARA.has(est) || est === 'inspeccion') { ndc.set(0, 0); rig.mx = rig.my = 0; colocaPunto(innerWidth / 2, innerHeight / 2); }
  else if (est !== _virtualAntes) { control.cursor = { x: innerWidth / 2, y: innerHeight / 2 }; colocaPunto(control.cursor.x, control.cursor.y); }
  _virtualAntes = est; actualizaAvisoCaptura();
});
// el aviso discreto «clic para mirar con el ratón» (solo en el modo juego, con el ratón suelto y sin nada abierto)
const avisoEl = (() => { const d = document.createElement('div'); d.id = 'captura'; d.setAttribute('aria-hidden', 'true'); document.body.appendChild(d); return d; })();
function avisoCaptura(t) { avisoEl.textContent = t; avisoEl.classList.add('on'); clearTimeout(avisoEl._t); avisoEl._t = setTimeout(() => avisoEl.classList.remove('on'), 3200); }
function actualizaAvisoCaptura() {
  const ver = PL_OK && control.modo === 'juego' && !control.bloqueado && gesto.estado === 'libre' && !teclado.activo && $('#os').hidden && !modoFotoAviso();
  avisoEl.textContent = 'Clic para mirar con el ratón · Esc lo suelta'; avisoEl.classList.toggle('on', ver);
}
function modoFotoAviso() { return typeof modoFoto !== 'undefined' && modoFoto; }
function ponControles(m) {
  control.modo = m; guardado.set('controles', m);
  if (m === 'clasico') sueltaCaptura();
  actualizaAvisoCaptura();
  anuncia(m === 'juego' ? 'Controles de juego: haz clic para capturar el ratón; Esc lo suelta.' : 'Controles clásicos: la mirada sigue al cursor.');
}
