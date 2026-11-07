/* ===================== 12 · bucle y arranque =====================
   Un fotograma: animaciones → muelles → cámara → lo que está en la mano →
   partículas → qué hay bajo el puntero → dibujar. */
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
let ultimo = performance.now(), diaPizarra = new Date().getDate();
const luzMano = new THREE.PointLight(0xFFF1DE, 0, 0, 2); scene.add(luzMano);
function bucle(ahora) {
  const dt = Math.min(0.05, (ahora - ultimo) / 1000); ultimo = ahora;
  corrAnims(ahora);
  drawer.position.z = cajonM.paso(dt); cajonArriba.position.z = cajonArribaM.paso(dt);
  updateKeys(ahora);
  corrPulsacion(ahora); corrMovimiento(dt);
  aplicaCamara(dt); corrSilla();
  corrInspeccion(dt); corrLlevar(dt); corrPizarra(dt);
  corrVapor(ahora); corrPolvo(ahora, lamparaOn); corrBot(ahora); corrEstuche(ahora); corrVentana(ahora, dt);
  corrMovil(ahora); corrTele(ahora); corrTorre(dt);
  if (ratonVisto && gesto.estado === 'libre' && !teclado.activo && !gesto.pulsado && !gesto.arrastre) { const r = pick(); setHover(r ? r.o.clave : null); }
  else if (gesto.estado !== 'libre' && gesto.hover) setHover(null);
  corrEtiqueta();
  // luz de la mano: ilumina lo que tienes delante (libro, carpeta, objeto inspeccionado) con luz blanca cálida
  const cerca = ['inspeccion', 'lectura', 'carpeta', 'bot', 'papel'].includes(gesto.estado) || (gesto.estado === 'ocupado' && gesto.obj);
  luzMano.intensity = lerp(luzMano.intensity, cerca ? 0.5 : 0, reduced ? 1 : 1 - Math.exp(-dt * 6));
  luzMano.position.copy(camera.position).add(v3(0.08, 0.12, 0).applyQuaternion(camera.quaternion));
  if (ahora - pantalla.ult > 40) { pantalla.ult = ahora; dibujaPantalla(ahora); }
  const leyendo = ahora < ledHasta;
  led.material.emissiveIntensity = reduced ? 1 : (leyendo ? (Math.sin(ahora / 60) > 0 ? 1.8 : 0.1) : 1.0 + Math.sin(ahora / 900) * 0.3);
  screenLight.intensity = $('#os').hidden ? (pantalla.estado === 'apagado' ? 0 : pantalla.estado === 'reposo' ? 1.2 : 2.0) : 0;
  powerBtn.material.emissiveIntensity = pantalla.estado === 'apagado' ? 0.3 : 1.0;
  if (new Date().getDate() !== diaPizarra) { diaPizarra = new Date().getDate(); dibujaBase(); repintaTrazos(); }
  if ($('#os').hidden) renderer.render(scene, camera);
  fps.cuenta++;
  requestAnimationFrame(bucle);
}
const fps = { cuenta: 0 };

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
window.__slInfo = () => ({ llamadas: renderer.info.render.calls, triangulos: renderer.info.render.triangles, geometrias: renderer.info.memory.geometries, texturas: renderer.info.memory.textures, objetos: objetos.size });

/* ---------- arranque: espera a las fuentes y redibuja los lienzos con ellas ---------- */
const fuentes = document.fonts && document.fonts.load ? Promise.all(['600 40px "Space Grotesk"', '400 20px "JetBrains Mono"', '600 20px "JetBrains Mono"', '400 20px Inter', '700 40px Caveat', '500 30px Caveat'].map(f => document.fonts.load(f))) : Promise.resolve();
Promise.race([fuentes, new Promise(r => setTimeout(r, 2500))]).then(() => {
  TEXTURAS.forEach(t => redibuja(t));
  ventanaEstado.minuto = -1;                       // la ventana se repinta con las fuentes ya cargadas
  dibujaBase(); repintaTrazos();
  cambia('libre');
  requestAnimationFrame(bucle);
  setTimeout(() => { $('#carga').classList.add('fuera'); setTimeout(() => { $('#carga').hidden = true; }, 650); }, 200);
});
