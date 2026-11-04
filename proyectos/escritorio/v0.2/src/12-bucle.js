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
  drawer.position.z = cajonM.paso(dt);
  updateKeys(ahora);
  aplicaCamara(dt);
  corrInspeccion(dt); corrLlevar(dt); corrPizarra(dt);
  corrVapor(ahora); corrPolvo(ahora, lamparaOn); corrBot(ahora); corrEstuche(ahora);
  if (ratonVisto && gesto.estado === 'libre' && !teclado.activo && !gesto.pulsado && !gesto.arrastre) { const r = pick(); setHover(r ? r.o.clave : null); }
  else if (gesto.estado !== 'libre' && gesto.hover) setHover(null);
  corrEtiqueta();
  // luz de la mano: ilumina lo que tienes delante (libro, carpeta, objeto inspeccionado) con luz blanca cálida
  const cerca = ['inspeccion', 'lectura', 'carpeta', 'bot'].includes(gesto.estado) || (gesto.estado === 'ocupado' && gesto.obj);
  luzMano.intensity = lerp(luzMano.intensity, cerca ? 0.5 : 0, reduced ? 1 : 1 - Math.exp(-dt * 6));
  luzMano.position.copy(camera.position).add(v3(0.08, 0.12, 0).applyQuaternion(camera.quaternion));
  if (ahora - pantalla.ult > 40) { pantalla.ult = ahora; dibujaPantalla(ahora); }
  const leyendo = ahora < ledHasta;
  led.material.emissiveIntensity = reduced ? 1 : (leyendo ? (Math.sin(ahora / 60) > 0 ? 1.8 : 0.1) : 1.0 + Math.sin(ahora / 900) * 0.3);
  screenLight.intensity = $('#os').hidden ? (pantalla.estado === 'reposo' ? 1.2 : 2.0) : 0;
  if (new Date().getDate() !== diaPizarra) { diaPizarra = new Date().getDate(); dibujaBase(); componePizarra(); }
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
  else if (clave.endsWith('-etiqueta') && objetos.get(clave.replace('-etiqueta', ''))) p = objetos.get(clave.replace('-etiqueta', '')).raiz.localToWorld(v3(0, 0.005, 0.088));
  else if (objetos.get(clave)) p = centroDe(objetos.get(clave));
  if (!p) return [0.5, 0.5];
  camera.updateMatrixWorld(); const [x, y] = aPantalla(p);
  return [clamp(x, 0, 1), clamp(y, 0, 1)];
};
window.__slEstado = () => gesto.estado;
window.__slHover = () => gesto.hover;
window.__slObj = k => objetos.get(k);
window.__slPos = clave => { const o = objetos.get(clave); if (!o || !o.raiz) return null; const p = o.raiz.getWorldPosition(new THREE.Vector3()); return [+p.x.toFixed(3), +p.y.toFixed(3), +p.z.toFixed(3), o.raiz.visible]; };
window.__slRumbo = r => { rig.rumbo = r; cam.yaw = r; };
window.__slFps = () => fps.cuenta;
window.__slVersion = VERSION;
window.__slInfo = () => ({ llamadas: renderer.info.render.calls, triangulos: renderer.info.render.triangles, geometrias: renderer.info.memory.geometries, texturas: renderer.info.memory.textures, objetos: objetos.size });

/* ---------- arranque: espera a las fuentes y redibuja los lienzos con ellas ---------- */
const fuentes = document.fonts && document.fonts.load ? Promise.all(['600 40px "Space Grotesk"', '400 20px "JetBrains Mono"', '600 20px "JetBrains Mono"', '400 20px Inter', '700 40px Caveat', '500 30px Caveat'].map(f => document.fonts.load(f))) : Promise.resolve();
Promise.race([fuentes, new Promise(r => setTimeout(r, 2500))]).then(() => {
  TEXTURAS.forEach(t => redibuja(t));
  dibujaBase(); componePizarra();
  cambia('libre');
  requestAnimationFrame(bucle);
  setTimeout(() => { $('#carga').classList.add('fuera'); setTimeout(() => { $('#carga').hidden = true; }, 650); }, 200);
});
