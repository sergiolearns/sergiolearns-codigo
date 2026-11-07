/* ===================== 11 · la ventana: el ático vivo (E33) =====================
   Fuera se ve la hora REAL de Canarias (zona IANA Atlantic/Canary): mañana, mediodía,
   tarde y noche, con todo lo de en medio. El paisaje va por capas, cada una en un plano a
   su distancia detrás de la ventana (paralaje de verdad cuando la cámara se acerca):
     cielo (degradado, sol, luna con su fase real, estrellas) · nubes que se mueven ·
     ciudad lejana (luces rojas de aviso) · barrio (ventanas que se encienden, depósitos
     de agua en las azoteas, farolas al fondo) · cables de la luz (las palomas se posan) ·
     el ático de delante (pretil, macetas, tendedero) · la lluvia y las gotas del cristal.
   Las capas quietas se repintan una vez por minuto; solo lo vivo se dibuja ~20 veces por
   segundo. Con «reducir movimiento», todo quieto. Para probar: ?hora=21 (o 21.5) y ?lluvia=1.
   Boceto: material/v0.2.1/bocetos/03 · cuentas del cielo: scripts/atico.py · fragmento F5. */

/* ---------- la hora de Canarias ---------- */
let HORA_FORZADA = PARAMS.has('hora') ? clamp(parseFloat(PARAMS.get('hora')) || 0, 0, 23.999) : null;
let LLUVIA_FORZADA = PARAMS.has('lluvia') ? PARAMS.get('lluvia') !== '0' : null;
const fmtCanarias = (() => { try { return new Intl.DateTimeFormat('en-GB', { timeZone: 'Atlantic/Canary', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }); } catch (e) { return null; } })();
function ahoraCanarias() {
  // { h: hora decimal, y, m, d } en Canarias. Si el navegador no conoce la zona, se usa la hora local
  const ahora = new Date(); let y, m, d, h;
  if (fmtCanarias) {
    const p = {}; fmtCanarias.formatToParts(ahora).forEach(x => { p[x.type] = x.value; });
    y = +p.year; m = +p.month; d = +p.day; h = (+p.hour) + (+p.minute) / 60 + (+p.second) / 3600;
  } else { y = ahora.getFullYear(); m = ahora.getMonth() + 1; d = ahora.getDate(); h = ahora.getHours() + ahora.getMinutes() / 60 + ahora.getSeconds() / 3600; }
  if (HORA_FORZADA !== null) h = HORA_FORZADA;
  return { h, y, m, d };
}
function horaTexto() { const { h } = ahoraCanarias(); const hh = Math.floor(h), mm = Math.floor((h - hh) * 60); return hh + ':' + String(mm).padStart(2, '0'); }
function momentoDelDia(h) { return h >= 7 && h < 12 ? 'mañana' : h >= 12 && h < 16 ? 'mediodía' : h >= 16 && h < 20 ? 'tarde' : 'noche'; }

/* ---------- el cielo según la hora: horas clave e interpolación (la misma tabla que atico.py) ---------- */
const CLAVES = [
  [0.0, '#0E0C1A', '#2A2346', '#15121F', 0.55, 1], [6.6, '#1A1733', '#4A3A66', '#1B1828', 0.35, 1],
  [7.8, '#3E4C8C', '#FF9B80', '#2B2638', 0.20, 0.6], [9.5, '#6F96D6', '#EFE2D2', '#4A4560', 0.05, 0],
  [13.0, '#4F86D9', '#CFE3F5', '#5A566E', 0.0, 0], [16.5, '#6A8BCC', '#F2D3A0', '#4E4862', 0.02, 0],
  [18.6, '#4638B8', '#FF6B4A', '#2E2A42', 0.25, 0.4], [19.5, '#26224F', '#7A4E7E', '#1E1B2E', 0.5, 1],
  [21.0, '#110F20', '#2C2448', '#16131F', 0.65, 1], [24.0, '#0E0C1A', '#2A2346', '#15121F', 0.55, 1]
];
// mezcla de dos colores en sRGB, canal a canal (como scripts/atico.py). Ojo: THREE.Color mezcla en espacio lineal
// y aclaraba mucho los grises oscuros (un 14 % de crema sobre tinta salía gris medio): por eso se hace a mano
function rgbDe(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function mezclaHex(a, b, t) { const A = rgbDe(a), B = rgbDe(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); }
function cieloA(h) {
  h = ((h % 24) + 24) % 24;
  for (let i = 0; i < CLAVES.length - 1; i++) {
    const a = CLAVES[i], b = CLAVES[i + 1];
    if (h >= a[0] && h <= b[0]) {
      let t = (h - a[0]) / (b[0] - a[0]); t = t * t * (3 - 2 * t);           // suave en los extremos (smoothstep)
      return { arriba: mezclaHex(a[1], b[1], t), abajo: mezclaHex(a[2], b[2], t), edif: mezclaHex(a[3], b[3], t), ventanas: lerp(a[4], b[4], t), farolas: lerp(a[5], b[5], t) };
    }
  }
}
// El sol sale a las 7:50 y se pone a las 18:55 (noviembre en Gran Canaria): altura = sen(π·(h − salida)/(puesta − salida))
const SOL = { sale: 7.83, pone: 18.92 };
function alturaSol(h) { return h >= SOL.sale && h <= SOL.pone ? Math.sin(Math.PI * (h - SOL.sale) / (SOL.pone - SOL.sale)) : -1; }
// La luna con su fase real: días desde una luna nueva conocida (6 ene 2000, 18:14 UTC) módulo el mes sinódico
const MES_SINODICO = 29.530588853;
function edadLuna(fecha = new Date()) { const dias = (fecha - Date.UTC(2000, 0, 6, 18, 14)) / 86400000; return ((dias % MES_SINODICO) + MES_SINODICO) % MES_SINODICO; }
function iluminadaLuna(edad) { return (1 - Math.cos(2 * Math.PI * edad / MES_SINODICO)) / 2; }   // fracción iluminada (0 nueva, 1 llena)
// Generador con semilla (Park-Miller): el mismo barrio y el mismo tiempo para todo el que entre a la misma hora
function semilla(s) { s = (Math.abs(Math.floor(s)) % 2147483646) + 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
function llueveA(t) {
  if (LLUVIA_FORZADA !== null) return LLUVIA_FORZADA;
  const r = semilla((t.y * 10000 + t.m * 100 + t.d) * 10 + Math.floor(t.h / 3)); r(); r();
  return r() < 0.1;                                    // llueve en uno de cada diez bloques de 3 horas (en Gran Canaria llueve poco)
}

/* ---------- las capas: planos a su distancia, pintados en coordenadas del mundo ---------- */
// cada capa: z del plano y la resolución del lienzo. Lo que cubre (x0..x1, y0..y1, en metros) se calcula para que
// sea lo justo que se ve por la ventana desde la silla y desde «mirar de cerca» la ventana (con un 12 % de margen):
// un plano más grande se dibujaría entero detrás de la pared y en un ordenador sin tarjeta gráfica eso cuesta mucho
const VISTAS = [{ y: BASE.y, z: BASE.z }, { y: 1.35, z: 0.1 }];
function cubre(z) {
  let xm = 0, y0 = 9, y1 = -9;
  VISTAS.forEach(v => {
    const f = (v.z - z) / (v.z - SALA.z0);                 // cuánto se agranda la ventana a esa distancia
    xm = Math.max(xm, VENTANA.x1 * f); y0 = Math.min(y0, v.y + (VENTANA.y0 - v.y) * f); y1 = Math.max(y1, v.y + (VENTANA.y1 - v.y) * f);
  });
  const mx = xm * 0.12 + 0.3, my = (y1 - y0) * 0.12 + 0.2;
  return { x0: -xm - mx, x1: xm + mx, y0: y0 - my, y1: y1 + my };
}
const CAPAS_DEF = {
  cielo: { z: -9.4, w: 1024, h: 744, orden: 0 }, nubes: { z: -8.9, w: 1024, h: 400, orden: 1 },
  ciudad: { z: -7.4, w: 1536, h: 683, orden: 2 }, barrio: { z: -5.6, w: 1536, h: 680, orden: 3 },
  cables: { z: -4.0, w: 1280, h: 466, orden: 4 }, palomas: { z: -3.98, w: 1024, h: 372, orden: 5 },
  atico: { z: -2.6, w: 1280, h: 640, orden: 6 }, lluvia: { z: -1.9, w: 640, h: 418, orden: 7 },
  gotas: { z: SALA.z0 - 0.105, x0: VENTANA.x0, x1: VENTANA.x1, y0: VENTANA.y0, y1: VENTANA.y1, w: 512, h: 352, orden: 8 }
};
Object.values(CAPAS_DEF).forEach(d => { if (d.x0 === undefined) Object.assign(d, cubre(d.z)); });
// las palomas comparten la escala de los cables (se posan en ellos)
Object.assign(CAPAS_DEF.palomas, { x0: CAPAS_DEF.cables.x0, x1: CAPAS_DEF.cables.x1, y0: CAPAS_DEF.cables.y0, y1: CAPAS_DEF.cables.y1 });
const PARALAJE = { cielo: 0, nubes: 0.01, ciudad: 0.02, barrio: 0.035, cables: 0.05, palomas: 0.05, atico: 0.08, lluvia: 0.09, gotas: 0 };
const capas = {};
Object.entries(CAPAS_DEF).forEach(([nombre, d]) => {
  const t = texFrom(d.w, d.h); if (nombre === 'nubes') { t.wrapS = THREE.RepeatWrapping; }
  const m = new THREE.Mesh(new THREE.PlaneGeometry(d.x1 - d.x0, d.y1 - d.y0),
    new THREE.MeshBasicMaterial({ map: t, transparent: nombre !== 'cielo', depthWrite: nombre === 'cielo', fog: false, toneMapped: false }));
  m.position.set((d.x0 + d.x1) / 2, (d.y0 + d.y1) / 2, d.z); m.renderOrder = d.orden - 20; scene.add(m);
  capas[nombre] = { d, t, m, g: t.userData.g, x: (d.x0 + d.x1) / 2, y: (d.y0 + d.y1) / 2 };
});
// pasar de metros del mundo a píxeles del lienzo de una capa
const px = (c, x) => (x - c.d.x0) / (c.d.x1 - c.d.x0) * c.d.w, py = (c, y) => (c.d.y1 - y) / (c.d.y1 - c.d.y0) * c.d.h, pm = (c, m) => m / (c.d.x1 - c.d.x0) * c.d.w;

/* ---------- el barrio: se genera una vez (con semilla) y se pinta según la hora ---------- */
const BARRIO = (() => {
  const r = semilla(2026), lejos = [], cerca = [];
  // alturas pensadas desde la silla: la ciudad asoma entre 4° y 10° por encima del horizonte, el barrio entre 2° y 14°
  for (let x = -9; x < 9;) { const w = 0.35 + r() * 0.7, alto = 1.8 + r() * 1.3 + (r() < 0.12 ? 0.9 : 0); lejos.push({ x, w, alto, aviso: alto > 3.05 }); x += w + r() * 0.08; }
  for (let x = -7; x < 7;) {
    const w = 0.9 + r() * 1.1, techo = 1.45 + r() * 1.4;
    cerca.push({ x, w, techo, deposito: r() < 0.6 ? x + 0.15 + r() * (w - 0.5) : null, antena: r() < 0.35, tendedero: r() < 0.3, color: r() });
    x += w + 0.05 + r() * 0.25;
  }
  return { lejos, cerca, r };
})();
const luzAviso = BARRIO.lejos.filter(b => b.aviso).map(b => {
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), new THREE.MeshBasicMaterial({ color: 0xFF3B2A, fog: false, toneMapped: false }));
  m.position.set(b.x + b.w / 2, b.alto + 0.06, CAPAS_DEF.ciudad.z + 0.02); m.renderOrder = -17; scene.add(m); return m;
});
// ¿esta ventana tiene luz? Cada ventana tiene su propia «costumbre» (un umbral fijo) y la hora en bloques de 10 minutos la mueve un poco
function ventanaConLuz(id, prob, bloque) { const r = semilla(id * 7919 + bloque * 31); r(); return r() < prob; }

function pintaCielo(h, est, lluvia, fecha) {
  const c = capas.cielo, g = c.g, { w, h: H } = c.d;
  const arriba = lluvia ? mezclaHex(est.arriba, '#5A566E', 0.45) : est.arriba, abajo = lluvia ? mezclaHex(est.abajo, '#8E8AA3', 0.4) : est.abajo;
  const gr = g.createLinearGradient(0, py(c, 6), 0, py(c, 0.6)); gr.addColorStop(0, arriba); gr.addColorStop(1, abajo);
  g.fillStyle = gr; g.fillRect(0, 0, w, H);
  const sol = alturaSol(h), noche = clamp(-sol * 3 + (sol < 0 ? 0.6 : 0), 0, 1) * (h > 12 ? (h > 19.3 ? 1 : 0) : (h < 7.4 ? 1 : 0));
  if (noche > 0 && !lluvia) {                                   // estrellas fijas
    const r = semilla(11);
    for (let i = 0; i < 140; i++) { g.fillStyle = 'rgba(232,230,245,' + (0.25 + r() * 0.6) * noche + ')'; const s = r() < 0.1 ? 2 : 1; g.fillRect(r() * w, py(c, 1.6 + r() * 8), s, s); }
  }
  if (sol > -0.04) {                                            // el sol: recorre un arco de izquierda a derecha
    const f = (h - SOL.sale) / (SOL.pone - SOL.sale), sx = lerp(-4.2, 4.2, f), sy = 1.4 + Math.max(sol, 0) * 3.6;
    const halo = g.createRadialGradient(px(c, sx), py(c, sy), 0, px(c, sx), py(c, sy), pm(c, 1.6));
    halo.addColorStop(0, 'rgba(255,233,176,' + (lluvia ? 0.15 : 0.55) + ')'); halo.addColorStop(1, 'rgba(255,233,176,0)');
    g.fillStyle = halo; g.fillRect(0, 0, w, H);
    if (!lluvia) { g.fillStyle = sol < 0.2 ? '#FFC58A' : '#FFF1C9'; g.beginPath(); g.arc(px(c, sx), py(c, sy), pm(c, 0.28), 0, Math.PI * 2); g.fill(); }
  } else if (!lluvia) {                                         // la luna, con su fase real
    const edad = edadLuna(fecha), luz = iluminadaLuna(edad), lx = px(c, 2.6), ly = py(c, 4.4), R = pm(c, 0.28);
    const halo = g.createRadialGradient(lx, ly, 0, lx, ly, R * 5); halo.addColorStop(0, 'rgba(232,230,245,' + 0.18 * luz + ')'); halo.addColorStop(1, 'rgba(232,230,245,0)');
    g.fillStyle = halo; g.fillRect(lx - R * 5, ly - R * 5, R * 10, R * 10);
    g.fillStyle = 'rgba(232,230,245,.12)'; g.beginPath(); g.arc(lx, ly, R, 0, Math.PI * 2); g.fill();
    // la parte iluminada: medio círculo y una elipse cuyo ancho es cos(fase) (creciente: luz a la derecha)
    const crece = edad < MES_SINODICO / 2, k = Math.cos(2 * Math.PI * edad / MES_SINODICO);
    g.fillStyle = '#E8E6F5'; g.beginPath();
    g.arc(lx, ly, R, -Math.PI / 2, Math.PI / 2, !crece);
    g.ellipse(lx, ly, Math.abs(k) * R, R, 0, Math.PI / 2, -Math.PI / 2, (k > 0) === crece);
    g.fill();
  }
  c.t.needsUpdate = true;
}
function pintaNubes(est, lluvia) {
  const c = capas.nubes, g = c.g, { w, h } = c.d; g.clearRect(0, 0, w, h);
  const r = semilla(lluvia ? 77 : 5), n = lluvia ? 26 : 9, color = lluvia ? mezclaHex(est.edif, '#8E8AA3', 0.5) : mezclaHex(est.abajo, '#FAFAF7', 0.55);
  const [cr, cg2, cb2] = rgbDe(color);
  for (let i = 0; i < n; i++) {
    const x = r() * w, y = py(c, 2.4 + r() * 4.5), s = (40 + r() * 90) * (lluvia ? 1.6 : 1);
    for (let k = 0; k < 5; k++) {
      const gx = x + (k - 2) * s * 0.45 + r() * 20, gy = y + r() * s * 0.2, rr2 = s * (0.4 + r() * 0.3);
      const gr = g.createRadialGradient(gx, gy, 0, gx, gy, rr2);
      gr.addColorStop(0, 'rgba(' + cr + ',' + cg2 + ',' + cb2 + ',' + (lluvia ? 0.55 : 0.32) + ')'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(gx - rr2, gy - rr2, rr2 * 2, rr2 * 2);
      // al repetirse la textura, lo que sale por un lado entra por el otro: se dibuja también desplazado
      if (gx + rr2 > w) g.fillRect(gx - rr2 - w, gy - rr2, rr2 * 2, rr2 * 2);
    }
  }
  c.t.needsUpdate = true;
}
function pintaCiudad(h, est) {
  const c = capas.ciudad, g = c.g, { w, h: H } = c.d; g.clearRect(0, 0, w, H);
  const color = mezclaHex(est.edif, est.abajo, 0.42), bloque = Math.floor(h * 6);
  BARRIO.lejos.forEach((b, i) => {
    const x0 = px(c, b.x), x1 = px(c, b.x + b.w), top = py(c, b.alto);
    g.fillStyle = color; g.fillRect(x0, top, x1 - x0, H - top);
    for (let fx = x0 + 4; fx < x1 - 5; fx += 9) for (let fy = top + 6; fy < H; fy += 11) {
      const id = i * 1000 + Math.round(fx) * 3 + Math.round(fy);
      if (est.ventanas > 0.02 && ventanaConLuz(id, est.ventanas * 0.8, bloque)) { g.fillStyle = 'rgba(245,192,107,.85)'; g.fillRect(fx, fy, 3, 4); }
    }
  });
  c.t.needsUpdate = true;
}
function pintaBarrio(h, est) {
  const c = capas.barrio, g = c.g, { w, h: H } = c.d; g.clearRect(0, 0, w, H);
  const bloque = Math.floor(h * 6), base = -1.6, noche = est.farolas;
  // la calle al fondo: el resplandor de las farolas (se dibujan después, delante de los edificios)
  if (noche > 0.05) {
    const gr = g.createLinearGradient(0, py(c, 1.3), 0, py(c, -0.4)); gr.addColorStop(0, 'rgba(245,192,107,0)'); gr.addColorStop(1, 'rgba(245,192,107,' + 0.3 * noche + ')');
    g.fillStyle = gr; g.fillRect(0, py(c, 1.3), w, H);
  }
  BARRIO.cerca.forEach((b, i) => {
    const x0 = px(c, b.x), x1 = px(c, b.x + b.w), top = py(c, b.techo);
    g.fillStyle = mezclaHex(est.edif, '#FAFAF7', 0.04 + b.color * 0.1); g.fillRect(x0, top, x1 - x0, H - top);
    g.fillStyle = mezclaHex(est.edif, '#FAFAF7', 0.2); g.fillRect(x0 - 2, top - 4, x1 - x0 + 4, 5);           // el pretil de la azotea
    if (b.deposito !== null) {                                    // los depósitos de agua de las azoteas canarias
      const dx = px(c, b.deposito);
      g.fillStyle = mezclaHex(est.edif, '#FAFAF7', 0.32); rr(g, dx, top - pm(c, 0.3), pm(c, 0.34), pm(c, 0.3), 6); g.fill();
      g.fillStyle = mezclaHex(est.edif, '#000000', 0.2); g.fillRect(dx, top - pm(c, 0.18), pm(c, 0.34), 2);
    }
    if (b.antena) { g.strokeStyle = mezclaHex(est.edif, '#000000', 0.3); g.lineWidth = 2; g.beginPath(); g.moveTo(x1 - 20, top); g.lineTo(x1 - 20, top - 46); g.moveTo(x1 - 34, top - 34); g.lineTo(x1 - 6, top - 34); g.moveTo(x1 - 30, top - 24); g.lineTo(x1 - 10, top - 24); g.stroke(); }
    if (b.tendedero) { g.strokeStyle = 'rgba(30,27,46,.6)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x0 + 10, top - 22); g.quadraticCurveTo((x0 + x1) / 2, top - 14, x1 - 30, top - 22); g.stroke(); ['#FAFAF7', '#A99EF5', '#FF9B80'].forEach((col, k) => { g.fillStyle = mezclaHex(col, est.edif, 0.45); g.fillRect(x0 + 24 + k * 22, top - 19, 12, 16); }); }
    for (let fx = x0 + 10; fx < x1 - 16; fx += 22) for (let fy = top + 14; fy < H - 4; fy += 26) {
      const id = 50000 + i * 1000 + Math.round(fx) + Math.round(fy) * 3, luz = est.ventanas > 0.02 && ventanaConLuz(id, est.ventanas, bloque);
      g.fillStyle = luz ? (ventanaConLuz(id + 1, 0.15, 0) ? 'rgba(169,158,245,.9)' : 'rgba(245,192,107,.95)') : mezclaHex(est.edif, '#000000', 0.25);
      g.fillRect(fx, fy, 10, 13);
    }
  });
  // las farolas, delante: postes y, de noche, sus cabezas encendidas con su halo
  for (let x = -6.2; x < 7; x += 1.9) {
    const cab = 1.45;
    g.fillStyle = mezclaHex(est.edif, '#000000', 0.4); g.fillRect(px(c, x) - 2, py(c, cab), 4, H - py(c, cab));
    g.fillRect(px(c, x) - 2, py(c, cab) - 2, pm(c, 0.18), 4);
    const hx = px(c, x) + pm(c, 0.18), hy = py(c, cab) + 4;
    if (noche > 0.05) {
      const halo = g.createRadialGradient(hx, hy, 0, hx, hy, pm(c, 0.5)); halo.addColorStop(0, 'rgba(255,225,160,' + 0.7 * noche + ')'); halo.addColorStop(1, 'rgba(255,225,160,0)');
      g.fillStyle = halo; g.fillRect(hx - pm(c, 0.5), hy - pm(c, 0.5), pm(c, 1), pm(c, 1));
      g.fillStyle = '#FFE9B0'; g.beginPath(); g.arc(hx, hy, 3.5, 0, Math.PI * 2); g.fill();
    } else { g.fillStyle = mezclaHex(est.edif, '#FAFAF7', 0.3); g.fillRect(hx - 5, hy - 3, 10, 5); }
  }
  c.t.needsUpdate = true;
}
// cables de la luz: catenarias y(x) = y_min + a·(cosh((x − x_m)/a) − 1), colgadas del poste de la derecha
const CABLES = [{ yMin: 2.55, a: 9, xm: -0.4 }, { yMin: 2.8, a: 11, xm: -0.2 }, { yMin: 2.38, a: 8, xm: -0.7 }];
const POSTE = 1.9;
function yCable(cb, x) { return cb.yMin + cb.a * (Math.cosh((x - cb.xm) / cb.a) - 1); }
function pintaCables(est) {
  const c = capas.cables, g = c.g, { w, h } = c.d; g.clearRect(0, 0, w, h);
  const oscuro = mezclaHex(est.edif, '#000000', 0.45);
  g.fillStyle = oscuro; g.fillRect(px(c, POSTE) - 6, py(c, 3.15), 12, h);                                  // el poste
  g.fillRect(px(c, POSTE) - 40, py(c, 2.98), 80, 6);
  CABLES.forEach(cb => {
    g.strokeStyle = oscuro; g.lineWidth = 2.2; g.beginPath();
    for (let x = c.d.x0; x <= POSTE; x += 0.05) { const X = px(c, x), Y = py(c, yCable(cb, x)); x === c.d.x0 ? g.moveTo(X, Y) : g.lineTo(X, Y); }
    g.stroke();
  });
  c.t.needsUpdate = true;
}
function pintaAtico(est) {
  const c = capas.atico, g = c.g, { w, h } = c.d; g.clearRect(0, 0, w, h);
  const muro = mezclaHex(est.edif, '#FAFAF7', 0.22), sombra = mezclaHex(est.edif, '#000000', 0.15);
  // el pretil de la azotea de delante (su borde queda un pelín por debajo de los ojos) con su barandilla
  g.fillStyle = muro; g.fillRect(0, py(c, 1.18), w, h);
  g.fillStyle = mezclaHex(muro, '#FAFAF7', 0.2); g.fillRect(0, py(c, 1.21), w, py(c, 1.18) - py(c, 1.21));
  g.strokeStyle = sombra; g.lineWidth = 3; g.beginPath(); g.moveTo(0, py(c, 1.4)); g.lineTo(w, py(c, 1.4)); g.stroke();
  for (let x = c.d.x0 + 0.1; x < c.d.x1; x += 0.16) { g.lineWidth = 2; g.beginPath(); g.moveTo(px(c, x), py(c, 1.4)); g.lineTo(px(c, x), py(c, 1.21)); g.stroke(); }
  // macetas con plantas (una con flores coral) encima del pretil
  [[-1.75, '#16794B', null], [1.05, '#16794B', '#FF6B4A'], [1.45, '#1F8A5B', null]].forEach(([x, verde, flor]) => {
    g.fillStyle = mezclaHex('#D9651C', est.edif, 0.25); g.fillRect(px(c, x), py(c, 1.29), pm(c, 0.2), py(c, 1.21) - py(c, 1.29));
    g.fillStyle = mezclaHex(verde, est.edif, 0.35);
    for (let k = 0; k < 6; k++) { g.beginPath(); g.ellipse(px(c, x + 0.03 + k * 0.028), py(c, 1.34 + (k % 3) * 0.03), pm(c, 0.03), pm(c, 0.075), (k - 3) * 0.25, 0, Math.PI * 2); g.fill(); }
    if (flor) { g.fillStyle = mezclaHex(flor, est.edif, 0.25); for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(px(c, x + 0.04 + k * 0.04), py(c, 1.42 + (k % 2) * 0.03), 3.5, 0, Math.PI * 2); g.fill(); } }
  });
  c.t.needsUpdate = true;
}

/* ---------- lo vivo: palomas, lluvia y gotas en el cristal ---------- */
const palomas = { lista: [], proxima: 0 };
function programaPaloma(t) { palomas.proxima = t + (PARAMS.has('palomas') ? 1500 : 14000 + Math.random() * 30000); }
function nuevaPaloma(t) {
  const cb = CABLES[Math.floor(Math.random() * CABLES.length)], xPosa = -1.6 + Math.random() * 2.6, deIzq = Math.random() < 0.5;
  palomas.lista.push({ fase: 'llega', t0: t, dur: 2200, desde: { x: deIzq ? -5 : 5, y: 3.2 + Math.random() * 0.4 }, cb, x: xPosa, mira: deIzq ? 1 : -1, quieta: 5000 + Math.random() * 9000, salto: 0 });
}
function pintaPaloma(g, c, x, y, mira, aleteo, cabeza) {
  const s = pm(c, 0.3) / 40;                                       // una paloma mide unos 30 cm
  g.save(); g.translate(px(c, x), py(c, y)); g.scale(mira * s, s);
  g.fillStyle = '#7E7A92'; g.beginPath(); g.ellipse(0, -10, 17, 10, -0.15, 0, Math.PI * 2); g.fill();         // cuerpo
  g.beginPath(); g.moveTo(-14, -12); g.lineTo(-28, -6); g.lineTo(-14, -4); g.fill();                         // cola
  g.fillStyle = '#5B7F78'; g.beginPath(); g.ellipse(11, -17, 6, 7, 0, 0, Math.PI * 2); g.fill();               // cuello tornasolado
  g.fillStyle = '#8E8AA3'; g.beginPath(); g.arc(15 + cabeza, -24, 6, 0, Math.PI * 2); g.fill();               // cabeza
  g.fillStyle = '#C9C5DC'; g.beginPath(); g.moveTo(20 + cabeza, -25); g.lineTo(26 + cabeza, -23); g.lineTo(20 + cabeza, -22); g.fill();   // pico
  g.fillStyle = '#FF6B4A'; g.beginPath(); g.arc(17 + cabeza, -26, 1.4, 0, Math.PI * 2); g.fill();            // ojo
  g.fillStyle = '#6E6A84'; g.beginPath();                                                                    // ala (sube y baja al volar)
  g.moveTo(-6, -14); g.quadraticCurveTo(4, -14 - aleteo * 26, 12, -14 - aleteo * 30); g.lineTo(6, -12); g.fill();
  if (!aleteo) { g.strokeStyle = '#C93F22'; g.lineWidth = 2; g.beginPath(); g.moveTo(-2, 0); g.lineTo(-2, 4); g.moveTo(4, 0); g.lineTo(4, 4); g.stroke(); }
  g.restore();
}
function corrPalomas(t, h, lluvia) {
  const c = capas.palomas, g = c.g, { w, h: H } = c.d;
  const diurna = h > 7.6 && h < 19.2 && !lluvia;                 // de noche duermen; con lluvia no salen
  if (!palomas.proxima) programaPaloma(t);
  if (diurna && t > palomas.proxima && palomas.lista.length < 3) { nuevaPaloma(t); programaPaloma(t); }
  if (reduced && diurna && !palomas.lista.length) palomas.lista.push({ fase: 'posada', t0: t, cb: CABLES[0], x: -0.6, mira: 1, quieta: 1e12, salto: 0 });
  if (!palomas.lista.length && !palomas.limpia) return;
  g.clearRect(0, 0, w, H); palomas.limpia = palomas.lista.length > 0;
  palomas.lista = palomas.lista.filter(p => {
    const e = (t - p.t0) / (p.dur || 1);
    if (p.fase === 'llega') {
      const f = Math.min(1, e), dest = { x: p.x, y: yCable(p.cb, p.x) + 0.02 };
      const C = { x: (p.desde.x + dest.x) / 2, y: Math.max(p.desde.y, dest.y) + 0.5 };
      const q = curva.sale(f), x = (1 - q) * (1 - q) * p.desde.x + 2 * (1 - q) * q * C.x + q * q * dest.x, y = (1 - q) * (1 - q) * p.desde.y + 2 * (1 - q) * q * C.y + q * q * dest.y;
      pintaPaloma(g, c, x, y, p.mira, f < 0.92 ? Math.sin(t / 55) * 0.5 + 0.5 : 0, 0);
      if (f >= 1) { p.fase = 'posada'; p.t0 = t; }
      return true;
    }
    if (p.fase === 'posada') {
      const cab = reduced ? 0 : (Math.sin(t / 260) > 0.6 ? 2 : 0);   // el cabeceo de las palomas
      if (!reduced && Math.random() < 0.002) p.mira *= -1;           // a veces se da la vuelta
      pintaPaloma(g, c, p.x, yCable(p.cb, p.x) + 0.02, p.mira, 0, cab);
      if (t - p.t0 > p.quieta || !diurna) { p.fase = 'se va'; p.t0 = t; p.dur = 1800; }
      return true;
    }
    const f = Math.min(1, e), x = p.x + p.mira * f * 5, y = yCable(p.cb, p.x) + 0.02 + Math.sin(f * Math.PI * 0.5) * 1.6;
    pintaPaloma(g, c, x, y, p.mira, Math.sin(t / 50) * 0.5 + 0.5, 0);
    return f < 1;
  });
  c.t.needsUpdate = true;
}
const lluviaGotas = Array.from({ length: 220 }, () => [Math.random(), Math.random(), 0.7 + Math.random() * 0.6]);
const cristalGotas = Array.from({ length: 46 }, () => ({ x: Math.random(), y: Math.random(), r: 1.5 + Math.random() * 3.5, v: Math.random() < 0.25 ? 0.02 + Math.random() * 0.05 : 0, t0: Math.random() * 20000 }));
let lluviaPintada = null;
function corrLluvia(t, lluvia) {
  const c = capas.lluvia, g = c.g, { w, h } = c.d, cg = capas.gotas;
  if (!lluvia) { if (lluviaPintada !== false) { g.clearRect(0, 0, w, h); c.t.needsUpdate = true; cg.g.clearRect(0, 0, cg.d.w, cg.d.h); cg.t.needsUpdate = true; lluviaPintada = false; } return; }
  if (reduced && lluviaPintada === true) return;                  // con movimiento reducido: un solo dibujo, quieto
  lluviaPintada = true;
  g.clearRect(0, 0, w, h); g.strokeStyle = 'rgba(201,197,220,.42)'; g.lineWidth = 1.2; g.beginPath();
  const s = reduced ? 0 : t / 1000;
  lluviaGotas.forEach(([a, b, v]) => {
    const y = ((b + s * 1.6 * v) % 1) * (h + 40) - 20, x = ((a * w) - y * 0.12 + w) % w;   // caen algo inclinadas por el viento
    g.moveTo(x, y); g.lineTo(x - 3, y + 16 * v);
  });
  g.stroke(); c.t.needsUpdate = true;
  // gotas en el cristal: aparecen, algunas resbalan despacio dejando un rastro
  const gg = cg.g, W = cg.d.w, H = cg.d.h; gg.clearRect(0, 0, W, H);
  cristalGotas.forEach(d => {
    const vida = ((t - d.t0) % 20000) / 20000, y = (d.y + (reduced ? 0 : d.v * vida * 8)) % 1;
    const X = d.x * W, Y = y * H;
    if (d.v) { gg.strokeStyle = 'rgba(232,230,245,.12)'; gg.lineWidth = d.r * 0.8; gg.beginPath(); gg.moveTo(X, Math.max(0, Y - 30)); gg.lineTo(X, Y); gg.stroke(); }
    gg.fillStyle = 'rgba(232,230,245,.28)'; gg.beginPath(); gg.arc(X, Y, d.r, 0, Math.PI * 2); gg.fill();
    gg.fillStyle = 'rgba(255,255,255,.55)'; gg.beginPath(); gg.arc(X - d.r * 0.3, Y - d.r * 0.35, d.r * 0.35, 0, Math.PI * 2); gg.fill();
  });
  cg.t.needsUpdate = true;
}

/* ---------- la luz que entra por la ventana y el reloj de la pared ---------- */
const luzVentana = new THREE.DirectionalLight(0xFFF1DE, 0); luzVentana.position.set(0.6, 2.6, -3.5); luzVentana.target.position.set(0, 0.7, 0); scene.add(luzVentana, luzVentana.target);
const ventanaEstado = { minuto: -1, lluvia: null, h: 0, ultVivo: 0, momento: '', dia: 0 };
function repintaFuera(t0) {
  const est = cieloA(t0.h), lluvia = llueveA(t0);
  pintaCielo(t0.h, est, lluvia, new Date()); pintaNubes(est, lluvia); pintaCiudad(t0.h, est); pintaBarrio(t0.h, est); pintaCables(est); pintaAtico(est);
  // la luz de la habitación: de día entra por la ventana; de noche, un poco de luz fría de la calle
  const sol = alturaSol(t0.h), dia = clamp((sol + 0.1) / 0.5, 0, 1) * (lluvia ? 0.55 : 1);
  luzVentana.color.set(mezclaHex('#A99EF5', mezclaHex(est.abajo, '#FFFFFF', 0.5), dia)); luzVentana.intensity = 0.12 + dia * 1.5;
  ventanaEstado.dia = dia * 0.85; techo.intensity = 1.1 + dia * 0.6; techoAtras.intensity = 0.8 + dia * 0.5; hemi.intensity = (lamparaOn ? 0.75 : 0.35) + ventanaEstado.dia; hemi.color.set(mezclaHex('#A99EF5', est.arriba, 0.5 * dia));
  luzAviso.forEach(m => { m.visible = est.farolas > 0.3; });
  ventanaEstado.lluvia = lluvia; ventanaEstado.h = t0.h; ventanaEstado.momento = momentoDelDia(t0.h);
}
function corrVentana(t, dt) {
  const t0 = ahoraCanarias(), minuto = Math.floor(t0.h * 60);
  if (minuto !== ventanaEstado.minuto) { ventanaEstado.minuto = minuto; repintaFuera(t0); }
  // el reloj de la pared (las agujas giran hacia −z de la esfera, en el sentido de las agujas del reloj)
  const hh = t0.h % 12, mm = (t0.h * 60) % 60, ss = (t0.h * 3600) % 60;
  agujaH.rotation.z = -hh / 12 * Math.PI * 2; agujaM.rotation.z = -mm / 60 * Math.PI * 2; agujaS.rotation.z = -(reduced ? 0 : Math.floor(ss)) / 60 * Math.PI * 2;
  // solo se dibuja lo de fuera si se puede ver (la cámara mira hacia la ventana)
  const mirando = Math.cos(cam.yaw) > 0.1 || (rig.foco && rig.foco.pos.z < 0);
  if (!mirando) return;
  if (!reduced) {
    capas.nubes.t.offset.x = (t / 1000 * 0.0012) % 1;
    const aviso = Math.floor(t / 900) % 2 === 0; luzAviso.forEach(m => { m.material.color.setHex(aviso ? 0xFF3B2A : 0x5A1810); });
  }
  if (t - ventanaEstado.ultVivo > 50) { ventanaEstado.ultVivo = t; corrPalomas(t, t0.h, ventanaEstado.lluvia); corrLluvia(t, ventanaEstado.lluvia); }
  // paralaje al mirar: cada capa se desplaza un poco con el giro (más la de delante)
  Object.entries(capas).forEach(([n, c]) => { const k = PARALAJE[n]; if (k) { c.m.position.x = c.x - Math.sin(cam.yaw) * k * 6; c.m.position.y = c.y - cam.pitch * k * 3; } });
}
window.__slCapa = n => capas[n].t.image.toDataURL('image/png');
window.__slHora = () => { const t = ahoraCanarias(); return { hora: +t.h.toFixed(3), momento: momentoDelDia(t.h), lluvia: llueveA(t), luna: +iluminadaLuna(edadLuna()).toFixed(2), forzada: HORA_FORZADA !== null }; };
// para los guiones de grabar.js: cambiar la hora y la lluvia sin recargar (__slFuerza(21.5, true); null vuelve a la real)
window.__slFuerza = (h, lluvia) => { HORA_FORZADA = h === null ? null : clamp(+h, 0, 23.999); if (lluvia !== undefined) LLUVIA_FORZADA = lluvia; ventanaEstado.minuto = -1; palomas.lista = []; palomas.proxima = 0; lluviaPintada = null; return window.__slHora(); };
