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

/* ---------- el punto (E03) ---------- */
const ICO = {
  mano: 'M8 13V6.5a1.5 1.5 0 0 1 3 0V11 M11 10.5V4.5a1.5 1.5 0 0 1 3 0V11 M14 10.5V5.5a1.5 1.5 0 0 1 3 0V12 M17 10.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1.5a6 6 0 0 1-4.6-2.2L5 15.5a1.6 1.6 0 0 1 2.4-2.1L8 14',
  agarre: 'M7 11V9.5a1.5 1.5 0 0 1 3 0 M10 10V8.5a1.5 1.5 0 0 1 3 0V10 M13 10V9a1.5 1.5 0 0 1 3 0v1 M16 10.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6v-3.5a1.5 1.5 0 0 1 3 0',
  girar: 'M20 12a8 8 0 1 1-2.3-5.7 M20 4v4h-4',
  rotulador: 'M15 4l5 5-10 10H5v-5z M13 6l5 5',
  borrador: 'M4 16l8-8 6 6-6 6H8z M12 20h8',
  pagina: 'M14 6l-6 6 6 6',
  enlace: 'M14 4h6v6 M20 4l-9 9 M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5'
};
const punto = { el: $('#punto'), forma: '', nombre: '', x: -100, y: -100 };
function setPunto(forma, nombre = '') {
  if (forma !== punto.forma) {
    punto.forma = forma;
    const ico = punto.el.querySelector('.ico');
    ico.innerHTML = forma === 'punto' || !ICO[forma] ? '<div class="dot"></div>' :
      '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="' + ICO[forma] + '" stroke="#141221" stroke-width="4"/><path d="' + ICO[forma] + '" stroke="#FAFAF7" stroke-width="1.8"/></svg>';
    ico.style.transform = 'scale(.6)'; requestAnimationFrame(() => { ico.style.transform = ''; });
  }
  if (nombre !== punto.nombre) { punto.nombre = nombre; if (nombre) punto.el.querySelector('.nombre').textContent = nombre; }
  punto.el.classList.toggle('con-nombre', !!nombre);
}
function actualizaPunto() {
  const s = gesto.estado, m = modos[s];
  if (m && m.punto) { const r = m.punto(); setPunto(r[0], r[1] || ''); return; }
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
canvas.addEventListener('pointermove', e => {
  aNdc(e); necesitaPick = true; ratonVisto = true; teclado.activo = false; punto.el.classList.remove('oculto');
  punto.x = e.clientX; punto.y = e.clientY; punto.el.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
  if (e.pointerType === 'mouse' || gesto.pulsado == null) { rig.mx = ndc.x; rig.my = ndc.y; }
  else if (gesto.estado === 'libre' && gesto.pulsado && !gesto.pulsado.o) {      // táctil: arrastrar en vacío mira
    rig.rumbo -= (e.clientX - ultimoPuntero.x) * 0.004; rig.my = clamp(rig.my - (e.clientY - ultimoPuntero.y) * 0.004, -1, 1);
  }
  ultimoPuntero = { x: e.clientX, y: e.clientY };
  const m = modos[gesto.estado]; if (m && m.move) return m.move(e);
  const p = gesto.pulsado;
  if (p && p.o && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 6) {
    gesto.pulsado = null;
    if (p.o.movil) empiezaLlevar(p.o, p.hit);
    else if (p.o.alArrastrar) { p.o.alArrastrar.empieza(p, e); gesto.arrastre = p.o; }
  }
  if (gesto.arrastre && gesto.arrastre.alArrastrar) gesto.arrastre.alArrastrar.mueve(e);
});
canvas.addEventListener('pointerdown', e => {
  aNdc(e); canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
  ultimoPuntero = { x: e.clientX, y: e.clientY };
  const m = modos[gesto.estado]; if (m && m.down) return m.down(e);
  if (gesto.estado !== 'libre') return;
  const r = pick();
  gesto.pulsado = { x: e.clientX, y: e.clientY, o: r && r.o, hit: r && r.hit };
});
canvas.addEventListener('pointerup', e => {
  aNdc(e);
  const m = modos[gesto.estado]; if (m && m.up) return m.up(e);
  if (gesto.arrastre) { const o = gesto.arrastre; gesto.arrastre = null; o.alArrastrar.suelta(e); return; }
  const p = gesto.pulsado; gesto.pulsado = null;
  if (p && p.o && gesto.estado === 'libre') clicEn(p.o, p.hit, e);
});
canvas.addEventListener('pointerleave', () => { if (gesto.estado === 'libre') setHover(null); punto.el.classList.add('oculto'); });
canvas.addEventListener('wheel', e => { const m = modos[gesto.estado]; if (m && m.wheel) { e.preventDefault(); m.wheel(e); } }, { passive: false });
function clicEn(o, hit, e) {
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
async function inspecciona(o) {
  if (gesto.estado !== 'libre') return;
  setHover(null); cambia('ocupado');
  enfoca(camera.position.clone().add(camera.getWorldDirection(new THREE.Vector3())), camera.position.clone(), cam.fov, { paralaje: 0 });
  insp.o = o; insp.q.identity(); insp.dist = o.insp.dist; gesto.obj = o;
  bus.emit('coge', o);
  scene.attach(o.raiz);
  $('#velo').classList.add('on');
  const p0 = o.raiz.position.clone(), q0 = o.raiz.quaternion.clone(), p1 = new THREE.Vector3(), q1 = new THREE.Quaternion();
  // sale de su sitio (un poco hacia la silla) y vuela a la mano
  const salida = p0.clone().add(new THREE.Vector3(0, 0.03, 0.06));
  await anim(180, e => o.raiz.position.lerpVectors(p0, salida, e), curva.sale);
  await anim(560, e => { poseInspeccion(o, p1, q1); o.raiz.position.lerpVectors(salida, p1, e); o.raiz.quaternion.slerpQuaternions(q0, q1, e); }, curva.suave);
  cambia('inspeccion'); recordatorioTeclas();
  anuncia(o.nombre + ' en la mano. Arrastra o usa las flechas para girarlo, E para usarlo, Esc para dejarlo.');
}
function corrInspeccion(dt) {
  if (gesto.estado !== 'inspeccion' || !insp.o) return;
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
  down(e) { gesto.arrastre = { x: e.clientX, y: e.clientY, movido: 0 }; actualizaPunto(); },
  move(e) {
    const a = gesto.arrastre; if (!a) return;
    giraInspeccion((e.clientX - a.x) * 0.012, (e.clientY - a.y) * 0.012);
    a.movido += Math.abs(e.clientX - a.x) + Math.abs(e.clientY - a.y); a.x = e.clientX; a.y = e.clientY;
  },
  up() { gesto.arrastre = null; actualizaPunto(); },
  wheel(e) { insp.dist = clamp(insp.dist + Math.sign(e.deltaY) * 0.03, insp.o.insp.dist * 0.55, insp.o.insp.dist * 1.5); },
  tecla(e) {
    const k = e.key;
    if (k === 'ArrowLeft') giraInspeccion(-0.2, 0); else if (k === 'ArrowRight') giraInspeccion(0.2, 0);
    else if (k === 'ArrowUp') giraInspeccion(0, -0.2); else if (k === 'ArrowDown') giraInspeccion(0, 0.2);
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
async function volverACasa(o, dur = 620) {
  const c = o.casa, p0 = o.raiz.position.clone(), q0 = o.raiz.quaternion.clone();
  // destino en coordenadas del mundo (el padre puede ser el cajón, que se mueve)
  c.padre.updateMatrixWorld(true);
  const pW = c.pos.clone().applyMatrix4(c.padre.matrixWorld);
  const qW = c.padre.getWorldQuaternion(new THREE.Quaternion()).multiply(c.quat);
  const arriba = pW.clone().add(new THREE.Vector3(0, 0.05, 0.05));
  await anim(dur, e => { o.raiz.position.lerpVectors(p0, arriba, e); o.raiz.quaternion.slerpQuaternions(q0, qW, e); }, curva.suave);
  await anim(200, e => o.raiz.position.lerpVectors(arriba, pW, e), curva.sale);
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
  rig.sensib = 0.45;   // mientras llevas algo, la cámara gira menos con el ratón
  anuncia('Llevas ' + o.nombre + '. Suéltalo donde brille.');
}
const _hitP = new THREE.Vector3();
const QLLEVAR = { disco: new THREE.Quaternion().setFromEuler(new THREE.Euler(0.85, 0, 0)),   // el disco se lleva inclinado hacia ti: se ve su etiqueta
  usb: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, Math.PI, 0)), carpeta: new THREE.Quaternion(), taza: null };
function corrLlevar(dt) {
  const o = llevar.o; if (gesto.estado !== 'llevar' || !o) return;
  raycaster.setFromCamera(ndc, camera);
  const alturaBase = PLANO_Y + (o.tipo === 'taza' ? 0.06 : o.tipo === 'disco' ? 0.08 : 0.04);
  planoTrabajo.constant = -alturaBase;
  if (raycaster.ray.intersectPlane(planoTrabajo, _hitP)) {
    // límites: encima de la mesa y siempre delante de la torre y del monitor (si no, el objeto se esconde detrás)
    _hitP.x = clamp(_hitP.x, -0.85, 0.7); _hitP.z = clamp(_hitP.z, -0.5, 0.0);
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
    llevar.zona = mejor;
    // cerca de la zona, el objeto sube hacia ella y se orienta como encajará
    const s = mejor ? curva.suave(mejor.prox) : 0;
    llevar.obj.set(lerp(_hitP.x, mejor ? mejor.punto.x : _hitP.x, s), lerp(alturaBase, mejor ? mejor.punto.y : alturaBase, s), lerp(_hitP.z, mejor ? mejor.punto.z : _hitP.z, s));
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
