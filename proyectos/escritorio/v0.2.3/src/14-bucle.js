/* ===================== 12 · bucle y arranque =====================
   Un fotograma: animaciones → muelles → cámara → lo que está en la mano →
   partículas → qué hay bajo el puntero → dibujar. */
function resize() { aplicaRes(); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
let ultimo = performance.now(), diaPizarra = new Date().getDate();
const luzMano = new THREE.PointLight(0xFFF1DE, 0, 0, 2); scene.add(luzMano);
let pickPar = 0;
function bucle(ahora) {
  const dtReal = (ahora - ultimo) / 1000, dt = Math.min(0.05, dtReal); ultimo = ahora;
  corrRes(Math.min(dtReal, 0.5), ahora);
  corrAnims(ahora);
  drawer.position.z = cajonM.paso(dt); cajonArriba.position.z = cajonArribaM.paso(dt);
  updateKeys(ahora);
  corrPulsacion(ahora); corrMovimiento(dt);
  aplicaCamara(dt); corrSilla();
  corrInspeccion(dt); corrLlevar(dt); corrPizarra(dt);
  corrVapor(ahora); corrPolvo(ahora, lamparaOn); corrBot(ahora); corrEstuche(ahora); corrVentana(ahora, dt);
  corrMovil(ahora); corrTele(ahora); corrTorre(dt);
  // v0.2.3: el rayo de «qué hay debajo del puntero», un fotograma de cada dos (con 60 fps sigue siendo 30 veces por segundo)
  if (!modoFoto && ratonVisto && gesto.estado === 'libre' && !teclado.activo && !gesto.pulsado && !gesto.arrastre) { if ((pickPar = 1 - pickPar) || necesitaPick) { necesitaPick = false; const r = pick(); setHover(r ? r.o.clave : null); } }
  else if (gesto.estado !== 'libre' && gesto.hover) setHover(null);
  corrEtiqueta();
  // luz de la mano: ilumina lo que tienes delante (libro, carpeta, objeto inspeccionado) con luz blanca cálida
  const cerca = ['inspeccion', 'lectura', 'carpeta', 'bot', 'papel'].includes(gesto.estado) || (gesto.estado === 'ocupado' && gesto.obj);
  luzMano.intensity = lerp(luzMano.intensity, cerca ? 0.5 : 0, reduced ? 1 : 1 - Math.exp(-dt * 6));
  luzMano.position.copy(camera.position).add(v3(0.08, 0.12, 0).applyQuaternion(camera.quaternion));
  if (ahora - pantalla.ult > 40) { pantalla.ult = ahora; dibujaPantalla(ahora); }   // solo sube la textura si cambió algo (módulo 10)
  const leyendo = ahora < ledHasta;
  led.material.emissiveIntensity = reduced ? 1 : (leyendo ? (Math.sin(ahora / 60) > 0 ? 1.8 : 0.1) : 1.0 + Math.sin(ahora / 900) * 0.3);
  screenLight.intensity = $('#os').hidden ? (pantalla.estado === 'apagado' ? 0 : pantalla.estado === 'reposo' ? 1.2 : 2.0) : 0;
  powerBtn.material.emissiveIntensity = pantalla.estado === 'apagado' ? 0.3 : 1.0;
  if (new Date().getDate() !== diaPizarra) { diaPizarra = new Date().getDate(); dibujaBase(); repintaTrazos(); }
  if ($('#os').hidden) renderer.render(scene, camera);
  fps.cuenta++;
  if (panelFps) corrPanelFps(ahora);
  requestAnimationFrame(bucle);
}
const fps = { cuenta: 0 };

/* ---------- ?fps: un panel pequeño con los números, para probar el rendimiento en un portátil (v0.2.3) ---------- */
const panelFps = PARAMS.has('fps') ? (() => { const d = document.createElement('div'); d.setAttribute('aria-hidden', 'true'); d.style.cssText = 'position:fixed;right:10px;top:10px;z-index:50;padding:8px 10px;border-radius:8px;background:rgba(20,18,33,.85);color:#E8E6F5;font:500 12px/1.5 "JetBrains Mono",monospace;font-variant-ligatures:none;pointer-events:none;white-space:pre'; document.body.appendChild(d); return { d, t0: 0, n0: 0 }; })() : null;
function corrPanelFps(ahora) {
  if (ahora - panelFps.t0 < 500) return;
  const f = (fps.cuenta - panelFps.n0) / ((ahora - panelFps.t0) / 1000); panelFps.t0 = ahora; panelFps.n0 = fps.cuenta;
  const c = renderer.domElement;
  panelFps.d.textContent = f.toFixed(0) + ' fps · ' + (RES.ema * 1000).toFixed(1) + ' ms\n' + c.width + ' × ' + c.height + ' (' + (c.width * c.height / 1e6).toFixed(2) + ' Mpx)\nescala ' + Math.round(RES.escala * 100) + ' %' + (RES.fija ? ' (fija)' : '') + ' · ×' + renderer.getPixelRatio().toFixed(2) + '\n' + renderer.info.render.calls + ' llamadas · ' + (renderer.info.render.triangles / 1000).toFixed(1) + ' k tri' + (clics.length ? '\núltimo clic: ' + clics[clics.length - 1].que + ' (' + clics[clics.length - 1].ms + ' ms, ' + clics[clics.length - 1].px + ' px)' : '');
}

/* ---------- juntar lo quieto (v0.2.3, fallo 19) ----------
   Cada malla es una «llamada de dibujo» (draw call): la CPU prepara y envía cada una por separado. La v0.2.2 hacía
   274 sentado. Lo que nunca se mueve, no se toca y no tiene textura (paredes, patas, marcos, muebles…) se junta por
   material: todas las piezas con el mismo color y acabado pasan a ser UNA malla (mergeGeometries, en coordenadas del
   mundo). Solo entra lo que cuelga de la escena o de un grupo marcado como quieto (userData.quieto). */
function juntaQuietos() {
  scene.updateMatrixWorld(true);
  const grupos = new Map(), quitar = [];
  const quietoArriba = o => { for (let p = o.parent; p; p = p.parent) { if (p === scene) return true; if (!p.userData.quieto) return false; } return false; };
  scene.traverse(m => {
    if (!m.isMesh || m.userData.clave || m.userData.noJuntar || !quietoArriba(m)) return;
    const x = m.material;
    if (Array.isArray(x) || x.map || x.transparent || x.onBeforeCompile !== THREE.Material.prototype.onBeforeCompile || m.geometry.morphAttributes.position) return;
    if (x.emissive && (x.emissive.getHex() !== 0 && x.emissiveIntensity > 0)) return;     // lo que se enciende se queda aparte
    const k = [x.type, x.color.getHexString(), x.roughness, x.metalness, x.side, x.vertexColors].join('|');
    (grupos.get(k) || grupos.set(k, []).get(k)).push(m);
  });
  let antes = 0, despues = 0;
  grupos.forEach(lista => {
    if (lista.length < 2) return;
    const geos = lista.map(m => { let g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone(); g.applyMatrix4(m.matrixWorld); for (const a of Object.keys(g.attributes)) if (a !== 'position' && a !== 'normal') g.deleteAttribute(a); g.morphAttributes = {}; return g; });
    const g = mergeGeometries(geos); if (!g) return;
    const junta = new THREE.Mesh(g, lista[0].material); junta.name = 'quietos'; junta.userData.junta = lista.length; scene.add(junta);
    lista.forEach(m => { m.parent.remove(m); m.geometry.dispose(); }); antes += lista.length; despues++;
  });
  return { antes, despues };
}
/* ---------- precompilar los sombreadores (v0.2.3, fallo 19: los tirones «al hacer cualquier cosa») ----------
   WebGL compila un programa la primera vez que dibuja una combinación de material nueva (una página con textura, la
   hoja de la agenda, el libro abierto…). Eso congela un fotograma. Al cargar, se enseña todo un instante (también lo
   oculto) y se compila de una vez; el libro abierto y las hojas usan materiales del mismo tipo que se crean aquí. */
function precompila() {
  const ocultos = [];
  scene.traverse(o => { if (!o.visible) { ocultos.push(o); o.visible = true; } });
  const tex = texFrom(4, 4), extra = new THREE.Group(); scene.add(extra);
  [THREE.FrontSide, THREE.BackSide, THREE.DoubleSide].forEach(side => {
    extra.add(new THREE.Mesh(new THREE.PlaneGeometry(0.01, 0.01), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, side })));
    extra.add(new THREE.Mesh(new THREE.PlaneGeometry(0.01, 0.01), new THREE.MeshBasicMaterial({ map: tex, side, toneMapped: false })));
    extra.add(new THREE.Mesh(new THREE.PlaneGeometry(0.01, 0.01), new THREE.MeshLambertMaterial({ map: tex, side })));
  });
  extra.position.set(0, -5, 0);
  try { renderer.compile(scene, camera); } catch (e) { /* si no se puede, se compilará al usarlo */ }
  ocultos.forEach(o => { o.visible = false; }); scene.remove(extra);
  return renderer.info.programs ? renderer.info.programs.length : 0;
}

/* ---------- para los guiones de grabar.js y las pruebas ---------- */
// __slPantalla(clave) → [x, y] de 0 a 1: dónde cae el centro del objeto en la pantalla
window.__slPantalla = clave => {
  let p = null;
  if (clave === 'disquetera') p = tray.getWorldPosition(new THREE.Vector3()).add(v3(0, 0, 0.05));
  else if (clave === 'puerto-usb') p = PUERTO.clone();
  else if (clave === 'pizarra-v' || clave === 'pizarra-f') { const [x, y, w, h] = clave === 'pizarra-v' ? CAJA_V : CAJA_F; p = enPizarra(x + w / 2, y + h / 2); }
  else if (clave === 'pagina-derecha' && lectura.rig) p = lectura.rig.pagDer.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(lectura.rig.W * 0.3, 0, 0).applyQuaternion(lectura.rig.rig.quaternion));
  else if (clave === 'pagina-izquierda' && lectura.rig) p = lectura.rig.pagIzq.getWorldPosition(new THREE.Vector3());
  else if (clave === 'mesa') p = v3(0.02, PLANO_Y, -0.08);
  else if (clave.startsWith('punto-') && PUNTOS[clave.slice(6)]) { const q = PUNTOS[clave.slice(6)].pos; p = v3(q[0], 0.4, q[1]); }
  else if (clave.startsWith('herr-') && herr[clave.slice(5)]) p = herr[clave.slice(5)].g.getWorldPosition(new THREE.Vector3());
  else if (clave.startsWith('pizarra@')) { const [x, y] = clave.slice(8).split(',').map(Number); p = enPizarra(x, y); }   // un punto del lienzo de la pizarra
  else if (clave === 'delante-bandeja') p = DELANTE_BANDEJA.clone();
  else if (clave.endsWith('-etiqueta') && objetos.get(clave.replace('-etiqueta', ''))) p = objetos.get(clave.replace('-etiqueta', '')).raiz.localToWorld(v3(0, 0.005, 0.088));
  else if (objetos.get(clave)) p = centroDe(objetos.get(clave));
  if (!p) return [0.5, 0.5];
  camera.updateMatrixWorld(); const [x, y, z] = aPantalla(p);
  if (z > 1 || x < 0 || x > 1) {
    // detrás o fuera de la pantalla: el borde por el que se llega antes girando (así «apunta» gira la cámara bien)
    const d = camera.position.clone().sub(p), yaw = Math.atan2(d.x, d.z);
    let dif = yaw - cam.yaw; while (dif > Math.PI) dif -= 2 * Math.PI; while (dif < -Math.PI) dif += 2 * Math.PI;
    return [dif > 0 ? 0.02 : 0.98, clamp(z > 1 ? 0.5 : y, 0.1, 0.9)];
  }
  return [clamp(x, 0, 1), clamp(y, 0, 1)];
};
window.__slEstado = () => gesto.estado;
// para las capturas: sin punto ni resaltado (__slFoto(true)) y la vista fija hacia un punto desde donde estés (__slMira)
let modoFoto = false;
window.__slFoto = (on = true) => { modoFoto = on; punto.el.style.visibility = on ? 'hidden' : ''; if (on) setHover(null); return on; };
window.__slMira = (x, y, z, fov = 62) => { enfoca(v3(x, y, z), ojos(), fov, { paralaje: 0, rate: 30 }); return true; };
window.__slHover = () => gesto.hover;
window.__slObj = k => objetos.get(k);
window.__slPos = clave => { const o = objetos.get(clave); if (!o || !o.raiz) return null; const p = o.raiz.getWorldPosition(new THREE.Vector3()); return [+p.x.toFixed(3), +p.y.toFixed(3), +p.z.toFixed(3), o.raiz.visible]; };
window.__slRumbo = r => { rig.rumbo = r; cam.yaw = r; };
window.__slFps = () => fps.cuenta;
window.__slVersion = VERSION;
window.__slClic = k => { const o = objetos.get(k); if (o) clicEn(o, null, null); return !!o; };
window.__slUsa = () => { if (insp.o) usa(insp.o); };
window.__slEsc = () => { const m = modos[gesto.estado]; if (m && m.esc) m.esc(); };
window.__slCam = () => [+cam.yaw.toFixed(3), +cam.pitch.toFixed(3), +cam.fov.toFixed(1)];
window.__slBloques = () => lectura.rig ? { izq: lectura.rig.bloqueIzq.visible, tIzq: +lectura.rig.bloqueIzq.scale.z.toFixed(4), hoja: lectura.rig.frente.visible } : null;
window.__slPagina = (p) => { if (!lectura.rig) return null; if (!lectura.giro) empiezaGiro(1, 0); lectura.giro.p = p; doblaHoja(p, 0); return __slBloques(); };
window.__slPonte = (x, z, yaw = 0, pitch = -0.08) => { jug.sentado = false; jug.en = null; jug.pos.set(x, DE_PIE, z); silla.position.z = sillaTapada.z; sillaGiro.rotation.y = 0; rig.foco = null; rig.rumbo = yaw; cam.yaw = yaw; cam.pitch = pitch; cam.pos.copy(jug.pos); return true; };
window.__slAnda = (...k) => { caminar.teclas = new Set(k); return k; };
window.__slTeclas = () => Object.keys(keyPress).map(i => TECLAS[i]);
window.__slPizarra = () => ({ nota: piz.nota ? piz.nota.txt : null, ops: pizOps.length, herramienta: piz.herramienta, grosor: piz.grosor, guardado: (guardado.get('pizarra', { ops: [] }).ops || []).length });
window.__slSens = () => SENS.nivel;
window.__slGiro = () => ({ x: +giro.x.toFixed(3), y: +giro.y.toFixed(3), wx: +giro.wx.toFixed(3), q: insp.q.toArray().map(v => +v.toFixed(3)) });
window.__slMonitor = () => pantalla.estado;
window.__slVapor = () => { const a = vapor.pos, n = vapor.N; let x = 0, y = 0, z = 0, ymin = 9; for (let i = 0; i < n; i++) { x += a[i * 3]; y += a[i * 3 + 1]; z += a[i * 3 + 2]; ymin = Math.min(ymin, a[i * 3 + 1]); } const b = tazaCuerpo.localToWorld(v3(0, 0.05, 0)); return { centro: [x / n, y / n, z / n].map(v => +v.toFixed(3)), ymin: +ymin.toFixed(3), boca: b.toArray().map(v => +v.toFixed(3)) }; };
window.__slPagIzq = () => lectura.rig ? { visible: lectura.rig.pagIzq.visible, k: lectura.k, tapa: +lectura.rig.pivote.rotation.y.toFixed(2) } : null;
window.__slTab = () => [...nav.querySelectorAll('button')].filter(b => !b.hidden).map(b => b.dataset.clave);
window.__slRes = () => ({ escala: +RES.escala.toFixed(2), ratio: +renderer.getPixelRatio().toFixed(3), cambios: RES.cambios, fija: RES.fija });
window.__slCuenta = (sinEspejo = true) => {   // las llamadas de un fotograma (sin el espejo, que dibuja el cuarto otra vez) y quién las hace
  const v = espejo.visible; if (sinEspejo) espejo.visible = false; renderer.render(scene, camera); const calls = renderer.info.render.calls; espejo.visible = v;
  const por = {}; scene.children.forEach(c => { let n = 0; c.traverseVisible(o => { if (o.isMesh || o.isPoints || o.isLine) n++; }); if (n) { const k = c.name || (c.isMesh ? 'malla suelta' : c.type); por[k] = (por[k] || 0) + n; } });
  return { calls, por };
};
window.__slProgramas = () => renderer.info.programs ? renderer.info.programs.length : 0;
window.__slInfo = () => ({ llamadas: renderer.info.render.calls, triangulos: renderer.info.render.triangles, geometrias: renderer.info.memory.geometries, texturas: renderer.info.memory.textures, objetos: objetos.size });

/* ---------- arranque: espera a las fuentes y redibuja los lienzos con ellas ---------- */
const fuentes = document.fonts && document.fonts.load ? Promise.all(['600 40px "Space Grotesk"', '400 20px "JetBrains Mono"', '600 20px "JetBrains Mono"', '400 20px Inter', '700 40px Caveat', '500 30px Caveat'].map(f => document.fonts.load(f))) : Promise.resolve();
Promise.race([fuentes, new Promise(r => setTimeout(r, 2500))]).then(() => {
  TEXTURAS.forEach(t => redibuja(t));
  ventanaEstado.minuto = -1;                       // la ventana se repinta con las fuentes ya cargadas
  dibujaBase(); repintaTrazos();
  window.__slJuntas = juntaQuietos();
  window.__slProgramas0 = precompila();
  espejoInicial();
  cambia('libre');
  requestAnimationFrame(bucle);
  setTimeout(() => { $('#carga').classList.add('fuera'); setTimeout(() => { $('#carga').hidden = true; }, 650); }, 200);
});
