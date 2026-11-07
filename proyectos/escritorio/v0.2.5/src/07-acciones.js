/* ===================== 07 · acciones =====================
   Qué hace cada objeto: disco a la disquetera y USB al puerto (E05, E24),
   cajón con peso (E09), carpeta que se abre en la mesa (E07), taza con
   Sergio Bot en el vapor (E10), lámpara con interruptor (E09) y la puerta. */

/* ---------- torre: disquetera ---------- */
const torre = { disco: null, usb: null, bandeja: 0 };   // bandeja: 0 cerrada, 1 abierta
function mueveBandeja(a, dur = 380) { const b0 = torre.bandeja; return anim(dur, e => { torre.bandeja = lerp(b0, a, e); tray.position.z = lerp(TRAY_CERRADA, TRAY_ABIERTA, torre.bandeja); }, curva.suave); }
// v0.2.1 (E35): la zona está DELANTE de la bandeja abierta (no encima): el disco llega por delante y entra deslizándose
const DELANTE_BANDEJA = v3(TORRE.x, 1.098, -0.152 + 0.1);
const zonaDisquetera = zona({
  clave: 'disquetera', punto: DELANTE_BANDEJA, radio: 0.32, mallas: [slot, trayMesh], quat: new THREE.Quaternion(),
  acepta: o => o.tipo === 'disco',
  alEntrar: () => { if (!torre.disco) mueveBandeja(1); },
  alSalir: () => { if (!torre.disco) mueveBandeja(0); },
  encaja: o => meteDisco(o)
});
USOS.disco = o => meteDisco(o);
async function meteDisco(o) {
  cambia('ocupado'); gesto.obj = o;
  if (torre.disco && torre.disco !== o) await sacaDisco(false);
  if (torre.bandeja < 1) await mueveBandeja(1);
  scene.attach(o.raiz);
  tray.updateMatrixWorld(true);
  // recorrido (E35): delante de la bandeja y algo más alto → se desliza hacia dentro rozando → se asienta con un rebote
  const delante = new THREE.Vector3(0, 0.018, 0.1).applyMatrix4(tray.matrixWorld);
  const roza = new THREE.Vector3(0, 0.014, 0).applyMatrix4(tray.matrixWorld), dentro = new THREE.Vector3(0, 0.006, 0).applyMatrix4(tray.matrixWorld);
  const p0 = o.raiz.position.clone(), q0 = o.raiz.quaternion.clone(), q1 = new THREE.Quaternion();
  // si viene de lejos (con E desde la mano), llega en arco por encima de todo
  const C = p0.clone().lerp(delante, 0.5); C.y = Math.max(p0.y, delante.y) + 0.05;
  await anim(480, e => { bezier2(p0, C, delante, e, o.raiz.position); o.raiz.quaternion.slerpQuaternions(q0, q1, Math.min(1, e * 1.3)); }, curva.suave);
  await anim(300, e => o.raiz.position.lerpVectors(delante, roza, e), curva.sale);
  await anim(220, e => o.raiz.position.lerpVectors(roza, dentro, e), curva.rebote);   // se asienta
  tray.attach(o.raiz);                                                                  // a partir de aquí se mueve con la bandeja
  await mueveBandeja(0, 460);
  torre.disco = o; gesto.obj = null; $('#velo').classList.remove('on');
  pantalla.pon('simulacro', o.datos); parpadeoLed(1400);
  miraMonitor('Simulacro ' + o.datos.code + ' cargado en el monitor. Clic en la pantalla para abrirlo, Esc para volver.');
}
// Lo que enseña el monitor según lo que hay en la torre (E35: al sacar el disco o el USB, vuelve a lo que toca)
function pantallaSegunTorre() {
  if (torre.disco) pantalla.pon('simulacro', torre.disco.datos);
  else if (torre.usb) pantalla.pon('simulador', torre.usb.datos);
  else pantalla.pon('reposo');
}
async function sacaDisco(volverLibre = true) {
  const o = torre.disco; if (!o) return;
  if (volverLibre) cambia('ocupado');
  await mueveBandeja(1);
  scene.attach(o.raiz); torre.disco = null; pantallaSegunTorre();
  // sale de la bandeja por delante antes de volar al estuche
  tray.updateMatrixWorld(true);
  const p0 = o.raiz.position.clone(), fuera = new THREE.Vector3(0, 0.02, 0.1).applyMatrix4(tray.matrixWorld);
  await anim(280, e => o.raiz.position.lerpVectors(p0, fuera, e), curva.suave);
  await volverACasa(o, 620);
  await mueveBandeja(0);
  if (volverLibre) { cambia('libre'); bus.emit('vuelve'); }
}
// v0.2.4 (E59-1): expulsar ya no devuelve el disco al estuche de golpe: sale de la bandeja y viene A LA MANO (inspección),
// como cualquier objeto que coges. Esc lo deja en el estuche; E lo vuelve a meter
async function expulsaALaMano() {
  const o = torre.disco; if (!o) return;
  cambia('ocupado'); setHover(null);
  await mueveBandeja(1);
  scene.attach(o.raiz); torre.disco = null; pantallaSegunTorre();
  tray.updateMatrixWorld(true);
  const p0 = o.raiz.position.clone(), fuera = new THREE.Vector3(0, 0.03, 0.12).applyMatrix4(tray.matrixWorld);
  await anim(reduced ? 1 : 300, e => o.raiz.position.lerpVectors(p0, fuera, e), curva.sale);
  mueveBandeja(0);
  cambia('libre'); await inspecciona(o, { yaFuera: true });
}
registrar('expulsar', { nombre: 'Botón de expulsar', mallas: [ejectBtn], alClic: () => {
  if (!torre.disco) { mueveBandeja(torre.bandeja > 0.5 ? 0 : 1); return; }
  expulsaALaMano();
} });

/* ---------- torre: puerto USB ---------- */
const PUERTO = usbPort.position.clone();
const zonaPuerto = zona({
  clave: 'puerto', punto: v3(PUERTO.x, PUERTO.y, -0.15), radio: 0.3, mallas: [usbPort], quat: QLLEVAR.usb,
  acepta: o => o.tipo === 'usb', encaja: o => enchufa(o)
});
USOS.usb = o => enchufa(o);
async function enchufa(o) {
  cambia('ocupado'); gesto.obj = o;
  if (torre.usb && torre.usb !== o) { const viejo = torre.usb; torre.usb = null; scene.attach(viejo.raiz); volverACasa(viejo, 560); }
  scene.attach(o.raiz);
  // la punta del conector (0,048 m por debajo del centro) tiene que quedar 1,2 cm dentro del puerto
  const fuera = v3(PUERTO.x, PUERTO.y, PUERTO.z + 0.048 + 0.03), dentro = v3(PUERTO.x, PUERTO.y, PUERTO.z - 0.012 + 0.048);
  const p0 = o.raiz.position.clone(), q0 = o.raiz.quaternion.clone();
  await anim(420, e => { o.raiz.position.lerpVectors(p0, fuera, e); o.raiz.quaternion.slerpQuaternions(q0, QLLEVAR.usb, e); }, curva.suave);
  await anim(220, e => o.raiz.position.lerpVectors(fuera, dentro, e), curva.peso);  // el «clic» al entrar
  torre.usb = o; gesto.obj = null; $('#velo').classList.remove('on');
  pantalla.pon('simulador', o.datos); parpadeoLed(900);
  miraMonitor('Simulador ' + o.datos.nombre + ' en el monitor. Clic en la pantalla para abrirlo, Esc para volver.');
}
bus.on('coge', o => { if (o === torre.usb) { torre.usb = null; pantallaSegunTorre(); } });
let ledHasta = 0;
function parpadeoLed(ms) { ledHasta = performance.now() + ms; }

/* ---------- monitor de cerca (después de meter un disco o un USB) ---------- */
function miraMonitor(texto) {
  enfoca(v3(0, 1.06, -0.6), BASE.clone().add(v3(0, -0.1, -0.28)), 46);
  cambia('monitor'); anuncia(texto);
}
function enlacePantalla() {
  const d = pantalla.datos;
  if (pantalla.estado === 'simulador') return d.url;
  if (pantalla.estado === 'simulacro') { const p = d.partes.find(x => publicado(x[1])); return p ? p[2] : ''; }
  return '';
}
modo('monitor', {
  punto: () => { raycaster.setFromCamera(ndc, camera); const sobre = raycaster.intersectObject(screen).length > 0; return sobre && enlacePantalla() ? ['enlace', 'Abrir en la web'] : ['punto']; },
  move() { actualizaPunto(); },
  up() { const r = pick([screen]); if (r || raycaster.intersectObject(screen).length) { const u = enlacePantalla(); if (u) window.open(u, '_blank', 'noopener'); } },
  tecla(e) { if (e.key === 'Enter' || e.key === 'e' || e.key === 'E') { const u = enlacePantalla(); if (u) window.open(u, '_blank', 'noopener'); return true; } return false; },
  esc() { sueltaFoco(); cambia('libre'); }
});

/* ---------- cajón con peso: un muelle ---------- */
const cajonM = new Muelle(0, 70, 11, 1.3);    // pesado: rigidez baja y algo de rebote
const CAJON_ABIERTO = 0.42;                    // v0.2.2: el cajón de archivo de la cajonera; abierto, las carpetas quedan fuera de la mesa
function cajonAbierto() { return cajonM.obj > 0.15 && drawer.position.z > 0.12; }
function abreCajon() { cajonM.obj = CAJON_ABIERTO; enfocaCajon(); anuncia('Cajón de archivo abierto: siete carpetas de apuntes, de pie.'); }
function cierraCajon() { cajonM.obj = 0; sueltaFoco(); }
function enfocaCajon() { enfoca(v3(-0.6, 0.3, 0.26), jug.sentado ? BASE.clone().add(v3(-0.28, -0.04, 0.12)) : ojos(), 56, { paralaje: 0.06 }); }
bus.on('vuelve', () => { if (cajonM.obj > 0.15 && gesto.estado === 'libre') enfocaCajon(); });
registrar('cajon', {
  nombre: 'Cajón de los apuntes', mallas: [drawerFront, drawerHandle], puntero: 'mano', lugar: 'mesa',
  alClic: () => (cajonM.obj > 0.15 ? cierraCajon() : abreCajon()),
  alArrastrar: {
    empieza(p) { this.y0 = p.y; this.z0 = cajonM.obj > 0.15 ? CAJON_ABIERTO : 0; },
    mueve(e) { cajonM.obj = clamp(this.z0 + (e.clientY - this.y0) * 0.002, 0, 0.45); setPunto('agarre'); },
    suelta() { if (cajonM.obj > 0.14) abreCajon(); else cierraCajon(); actualizaPunto(); }
  }
});

/* ---------- el cajón de arriba de la cajonera: el material y la pista (E45) ---------- */
const cajonArribaM = new Muelle(0, 90, 12, 1);
registrar('cajon-arriba', { nombre: 'Cajón de arriba · material', mallas: [cajonArribaFrente, cajonArribaTirador], puntero: 'mano', lugar: 'mesa',
  alClic: () => {
    const abrir = cajonArribaM.obj < 0.1; cajonArribaM.obj = abrir ? 0.34 : 0;
    if (abrir) { enfoca(v3(-0.62, 0.52, 0.12), jug.sentado ? BASE.clone().add(v3(-0.3, -0.02, 0.12)) : ojos(), 54, { paralaje: 0.05 }); anuncia('Cajón de arriba: la calculadora de los exámenes, dos pósits y una tarjeta con una pista (clic en ella para leerla). Clic en el cajón para cerrarlo.'); }
    else sueltaFoco();
  } });

/* ---------- carpeta abierta sobre la mesa ----------
   Fallo 5 (v0.2.2): caía sobre el teclado. Ahora el teclado se aparta 9 cm hacia el monitor y la carpeta se abre
   delante, en el centro; la cámara la acompaña desde que sale (antes se quedaba mirando donde estaba). */
const MESA_CARPETA = { pos: v3(0.12, MESA_Y + 0.004, -0.03), quat: new THREE.Quaternion() };
function apartaTeclado(apartar) { const z0 = teclado3d.position.z, z1 = apartar ? TECLADO_Z - 0.09 : TECLADO_Z; return anim(380, e => { teclado3d.position.z = lerp(z0, z1, e); }, curva.suave); }
const carpetaAbierta = { o: null };
zona({ clave: 'mesa', punto: v3(0.05, PLANO_Y + 0.04, -0.2), radio: 1, mallas: [], acepta: o => o.tipo === 'carpeta', encaja: o => abreCarpeta(o),
  prox_: p => (p.z < -0.02 && p.z > -0.6 && Math.abs(p.x) < 0.7 ? 0.4 : 0) });   // cualquier sitio de la mesa vale
USOS.carpeta = o => abreCarpeta(o);
async function abreCarpeta(o) {
  cambia('ocupado'); scene.attach(o.raiz); gesto.obj = o;
  // v0.2.3 (E56-17): de pie también; la vista baja hacia la carpeta desde donde estés
  enfoca(v3(-0.02, 0.77, -0.04), jug.sentado ? BASE.clone().add(v3(-0.02, -0.06, -0.12)) : ojos(), 50, { paralaje: 0.02 });
  apartaTeclado(true); o.mallas[2].visible = false;   // la pestaña no se ve con la carpeta abierta
  const p0 = o.raiz.position.clone(), q0 = o.raiz.quaternion.clone(), alto = MESA_CARPETA.pos.clone().add(v3(0, 0.08, 0));
  await anim(480, e => { o.raiz.position.lerpVectors(p0, alto, e); o.raiz.quaternion.slerpQuaternions(q0, MESA_CARPETA.quat, e); }, curva.suave);
  await anim(220, e => o.raiz.position.lerpVectors(alto, MESA_CARPETA.pos, e), curva.sale);
  await anim(700, e => { o.bisagra.rotation.z = Math.PI * 0.985 * e; }, curva.suave);   // la tapa se abre hacia la izquierda
  carpetaAbierta.o = o; gesto.obj = null; cambia('carpeta');
  anuncia('Carpeta de ' + o.datos.nombre + ' abierta.' + (o.datos.url ? ' Intro abre la dirección escrita en la hoja.' : ''));
}
function sobreDireccion() {
  const o = carpetaAbierta.o; if (!o || !o.datos.url) return false;
  raycaster.setFromCamera(ndc, camera);
  const h = raycaster.intersectObject(o.hoja)[0];
  return !!(h && h.uv && h.uv.x > 0.12 && h.uv.x < 0.95 && h.uv.y > 0.2 && h.uv.y < 0.44);
}
modo('carpeta', {
  punto: () => (sobreDireccion() ? ['enlace', 'Abrir en la web'] : ['punto']),
  move() { actualizaPunto(); },
  up() { if (sobreDireccion()) window.open(carpetaAbierta.o.datos.url, '_blank', 'noopener'); },
  tecla(e) { if (e.key === 'Enter' && carpetaAbierta.o.datos.url) { window.open(carpetaAbierta.o.datos.url, '_blank', 'noopener'); return true; } return false; },
  async esc() {
    const o = carpetaAbierta.o; cambia('ocupado');
    await anim(500, e => { o.bisagra.rotation.z = Math.PI * 0.985 * (1 - e); }, curva.suave);
    carpetaAbierta.o = null; sueltaFoco(); apartaTeclado(false); o.mallas[2].visible = true;
    if (cajonM.obj < 0.15) abreCajon();
    await volverACasa(o, 600); cambia('libre'); bus.emit('vuelve');
  }
});

/* ---------- taza (E10) ----------
   v0.2.5 (biblia, sección 5: «el Bot, solo en el PC y en el móvil»): Sergio Bot sale del vapor y pasa a ser una app del
   móvil (módulo 12b). La taza se queda en taza: se coge, se mira, humea; E la acerca para olerla. */
const bot = { msgs: [{ de: 'bot', t: 'Hola, soy Sergio Bot. Pregúntame por una asignatura o por los simulacros.' }], escrito: '', revela: 1e9 };
function respuestaBot(q) { for (const [re, r] of BOT) if (re.test(q)) return r; return BOT_OTRA; }
USOS.taza = o => { anuncia('Huele a café colombiano. La hice en Gran Canaria.'); insp.dist = Math.max(o.insp.dist * 0.7, insp.dist - 0.08); $('#velo').classList.add('on'); insp.o = o; };
function corrBot() { if (bot.revela < 1e8) { bot.revela += 1.4; if (gesto.estado === 'movil' || gesto.estado === 'cama') dibujaMovil(); } }

/* ---------- lámpara: interruptor que bascula y luz que parpadea al encender ---------- */
let lamparaOn = true;
async function interruptor() {
  lamparaOn = !lamparaOn;
  const r0 = rocker.rotation.x, r1 = lamparaOn ? -0.28 : 0.28;
  anim(160, e => { rocker.rotation.x = lerp(r0, r1, e); }, curva.peso);
  const h0 = hemi.intensity;
  if (lamparaOn) {
    for (const [v, ms] of [[0.5, 50], [0.05, 60], [0.9, 50], [0.3, 70], [1, 0]]) {
      lampLight.intensity = 2.6 * v; bulb.material.emissiveIntensity = 2.2 * v; hemi.intensity = lerp(0.35, 0.75, v) + ventanaEstado.dia;
      if (ms) await espera(ms);
    }
  } else {
    const l0 = lampLight.intensity;
    await anim(320, e => { lampLight.intensity = l0 * (1 - e); bulb.material.emissiveIntensity = 2.2 * (1 - e); hemi.intensity = lerp(h0, 0.35 + ventanaEstado.dia, e); }, curva.sale);
  }
}
registrar('lampara', { nombre: 'Interruptor del flexo', mallas: [rockerMesh, switchBox, lampBase, shade], alClic: interruptor });

/* ---------- la puerta: salir a la web ---------- */
// fallo 12 (v0.2.2): el manillar subía; ahora baja (giro positivo en z: la palanca apunta a −x)
let puertaAbierta = false;
async function puerta(abrir) {
  puertaAbierta = abrir;
  if (abrir) await anim(260, e => { doorKnob.rotation.z = 0.6 * e; }, curva.sale);
  const y0 = door.rotation.y, l0 = pasilloLuz.intensity;
  await anim(abrir ? 1000 : 650, e => { door.rotation.y = lerp(y0, abrir ? 1.45 : 0, e); pasilloLuz.intensity = lerp(l0, abrir ? 3 : 0, e); }, abrir ? curva.sale : curva.suave);
  if (abrir) anim(220, e => { doorKnob.rotation.z = 0.6 * (1 - e); }, curva.sale);
  if (abrir) anuncia('Puerta abierta. Clic en la luz del pasillo para volver a la web.');
}
registrar('puerta', { nombre: 'Puerta', mallas: [doorSlab, knobMesh], brilloK: 0.35, lugar: 'puerta', alcance: 1.6, alClic: () => puerta(!puertaAbierta) });
registrar('salida', { nombre: 'Volver a la web', mallas: [pasillo], puntero: 'enlace', lugar: 'puerta', alcance: 2.2, activo: () => gesto.estado === 'libre' && puertaAbierta,
  alClic: () => window.open('https://sergiolearns.com/', '_blank', 'noopener') });

/* ---------- el estuche se abre al acercarse ---------- */
let estucheAbierto = 0, estucheHasta = 0;
function tapaEstuche(abrir) {
  const objetivo = abrir ? 1 : 0; if (objetivo === estucheAbierto) return;
  const a0 = estucheAbierto; estucheAbierto = objetivo;
  anim(abrir ? 520 : 420, e => { tapaEst.rotation.x = -1.95 * lerp(a0, objetivo, e); }, abrir ? curva.peso : curva.suave);
}
registrar('estuche', { nombre: 'Estuche de los simulacros', mallas: [tapaMesh, estFrente], alClic: () => { tapaEstuche(!estucheAbierto); estucheHasta = performance.now() + 4000; } });
bus.on('hover', k => { if (k && (k.startsWith('disco-') || k === 'estuche')) { tapaEstuche(true); estucheHasta = performance.now() + 1500; } });
function corrEstuche(t) {
  const cerca = (gesto.hover && (gesto.hover.startsWith('disco-') || gesto.hover === 'estuche')) || (gesto.obj && gesto.obj.tipo === 'disco');
  if (cerca) estucheHasta = t + 1200;
  if (estucheAbierto && t > estucheHasta && gesto.estado === 'libre') tapaEstuche(false);
}

/* ---------- el ratón de la mesa: sensibilidad con la rueda (E37) ---------- */
function pintaLedsRaton() { ratonLeds.forEach((m, i) => { m.material.emissiveIntensity = i < SENS.nivel ? 1.6 : 0; m.material.color.setHex(i < SENS.nivel ? 0xFF6B4A : 0x3A3552); }); }
pintaLedsRaton();
function cambiaSensibilidad(d) {
  const n = clamp(SENS.nivel + d, 1, 5); if (n === SENS.nivel) return;
  SENS.nivel = n; guardado.set('sensibilidad', n); pintaLedsRaton();
  anim(120, e => { ratonRueda.rotation.x = d * e * 0.8; }, curva.sale);
  anuncia('Sensibilidad ' + n + ' de 5.');
}
registrar('raton', { nombre: 'Ratón · rueda: sensibilidad', mallas: [ratonCuerpo, ratonRueda], puntero: 'rueda',
  alClic: () => { cambiaSensibilidad(SENS.nivel >= 5 ? -4 : 1); } });

/* ---------- mirar de cerca lo que no se coge: corcho, ventana, trofeos, póster… (E33, E34) ---------- */
// Un clic acerca la vista y Esc vuelve. Las funciones del corcho, los trofeos y el armario llegan en la v0.3.
function miraDeCerca(punto, desde, fov, texto) {
  cambia('ocupado'); enfoca(punto, desde, fov, { paralaje: 0.03, rate: 3.6 });
  setTimeout(() => { cambia('mirar'); anuncia(texto); }, reduced ? 0 : 450);
}
modo('mirar', { punto: () => (modos.mirar.extra && modos.mirar.extra.punto ? modos.mirar.extra.punto() : ['punto']),
  down(e) { const x = modos.mirar.extra; if (x && x.down) x.down(e); }, move(e) { const x = modos.mirar.extra; if (x && x.move) x.move(e); actualizaPunto(); },
  up(e) { const x = modos.mirar.extra; if (x && x.up) x.up(e); }, wheel(e) { const x = modos.mirar.extra; if (x && x.wheel) x.wheel(e); },
  tecla(e) { const x = modos.mirar.extra; return !!(x && x.tecla && x.tecla(e)); },
  esc() { const k = mirarDesde, x = modos.mirar.extra; modos.mirar.extra = null; if (x && x.alSalir) x.alSalir(); sueltaFoco(); cambia('libre'); bus.emit('vuelve'); if (k) devuelveFoco(k); } });
let mirarDesde = null;
function registraMirar(clave, nombre, mallas, punto, desde, fov, texto, extra = {}) {
  registrar(clave, Object.assign({ nombre, mallas, puntero: 'lupa', brilloK: 0.35, lugar: 'cualquiera',
    alClic: () => { mirarDesde = clave; miraDeCerca(punto, desde, fov, texto); } }, extra));
}
