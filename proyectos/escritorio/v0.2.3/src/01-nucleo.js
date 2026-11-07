/* ===================== 01 · núcleo =====================
   Motor (three.js como módulo), utilidades de geometría y texturas,
   animaciones (curvas, anim() con promesas y muelles) y el «bus» de eventos
   con el que se avisan los módulos entre sí. */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { Reflector } from 'three/addons/objects/Reflector.js';   // v0.2.3: el espejo del armario (E56-11)

const reduced = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const $ = s => document.querySelector(s);
const VERSION = 'v0.2.3';
const NOMBRE = 'El cuarto de Sergio';   // E57 (decisión de Sergio, 5 nov 2026): el proyecto ya es un cuarto
// Para probar: ?hora=21 fuerza la hora de Canarias (0-24, admite 21.5), ?lluvia=1 o 0 fuerza el tiempo
const PARAMS = new URLSearchParams(location.search);

/* ---------- bus: los módulos se avisan sin conocerse ---------- */
const bus = {
  oy: {},
  on(ev, fn) { (this.oy[ev] = this.oy[ev] || []).push(fn); },
  emit(ev, dato) { (this.oy[ev] || []).forEach(fn => fn(dato)); }
};

/* ---------- guardado por persona (solo comodidades: puede fallar) ---------- */
const guardado = {
  get(k, def) { try { const v = localStorage.getItem('sl-escritorio-' + k); return v === null ? def : JSON.parse(v); } catch (e) { return def; } },
  set(k, v) { try { localStorage.setItem('sl-escritorio-' + k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento: no pasa nada */ } }
};

/* ---------- WebGL ---------- */
const canvas = $('#gl');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch (e) { renderer = null; }
if (!renderer || !renderer.getContext()) {
  const fb = $('#sin3d');
  fb.innerHTML = '<div><p>Este navegador no puede dibujar la habitación en 3D (WebGL).</p>' +
    '<p>Todo lo que hay en ella está también en la web: <a href="https://sergiolearns.com/aprende/">Aprende</a> · <a href="https://sergiolearns.com/laboratorio/">Laboratorio</a> · <a href="https://sergiolearns.com/universidad/">Universidad</a></p></div>';
  fb.hidden = false; $('#carga').hidden = true;
  throw new Error('sin WebGL');
}
/* ---------- resolución (v0.2.3, fallo 19: la caída de fps a pantalla completa) ----------
   El coste de dibujar crece con los píxeles: a pantalla completa en un portátil con escalado (×1,5 o ×2), la v0.2.2
   pintaba hasta 3840 × 2160 = 8,3 millones de píxeles por fotograma, 9 veces los de una ventana de 1280 × 720
   (medido: material/v0.2.3/medidas.md). Tres frenos:
   · un TOPE de densidad (×1,5 como mucho, antes ×2) y un PRESUPUESTO de píxeles (2,4 millones, un 1920 × 1080 a ×1,1);
   · una ESCALA ADAPTATIVA: si el fotograma tarda más de 1/45 s durante 1,5 s, se dibuja con un 15 % menos de
     resolución (hasta la mitad); si va holgado (menos de 1/57 s) durante 4 s, sube un 10 %. Los cambios, como
     mucho uno cada 1,5 s (cambiar el tamaño del lienzo cuesta);
   · ?res=1 la fija (para grabar clips y medir); ?fps enseña un panel con los números (para probarlo en un portátil). */
const RES = { tope: 1.5, presupuesto: 2.4e6, escala: 1, min: 0.5, fija: PARAMS.get('res') === '1', ema: 1 / 60, lento: 0, holgado: 0, ultCambio: 0, cambios: 0 };
function ratioBase() {
  const dpr = Math.min(window.devicePixelRatio || 1, RES.tope), px = innerWidth * innerHeight;
  return Math.min(dpr, Math.sqrt(RES.presupuesto / Math.max(1, px)));
}
function aplicaRes() { renderer.setPixelRatio(ratioBase() * RES.escala); renderer.setSize(innerWidth, innerHeight, false); }
function corrRes(dt, ahora) {
  if (RES.fija || dt <= 0) return;
  RES.ema += (dt - RES.ema) * 0.08;                                  // media exponencial del tiempo por fotograma
  if (RES.ema > 1 / 45) { RES.lento += dt; RES.holgado = 0; } else if (RES.ema < 1 / 57) { RES.holgado += dt; RES.lento = 0; } else { RES.lento = RES.holgado = 0; }
  if (ahora - RES.ultCambio < 1500) return;
  let nueva = RES.escala;
  if (RES.lento > 1.5 && RES.escala > RES.min) nueva = Math.max(RES.min, RES.escala * 0.85);
  else if (RES.holgado > 4 && RES.escala < 1) nueva = Math.min(1, RES.escala * 1.1);
  if (nueva !== RES.escala) { RES.escala = nueva; RES.ultCambio = ahora; RES.lento = RES.holgado = 0; RES.cambios++; aplicaRes(); }
}
renderer.setPixelRatio(ratioBase());
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x141221);
scene.fog = new THREE.Fog(0x141221, 5.5, 11);           // v0.2.2: el cuarto mide 4,3 m de fondo
const camera = new THREE.PerspectiveCamera(62, 1, 0.012, 600);   // lejos: el paisaje 3D llega a 400 m
const BASE = new THREE.Vector3(0, 1.22, 0.55);   // los ojos de alguien sentado
const DE_PIE = 1.62;                              // v0.2.2: los ojos de pie (se camina por el cuarto)
const MESA_Y = 0.74, PLANO_Y = 0.765;            // tablero de la mesa y plano de trabajo para arrastrar

/* ---------- geometría ---------- */
function mat(color, o = {}) {
  // v0.2.3 (fallo 19): lo mate (rugosidad ≥ 0,88 y sin metal: paredes, telas, ropa, papel) va con Lambert, que en cada
  // píxel hace la cuenta de la luz difusa y no la del brillo (GGX): a pantalla completa es mucho más barato y se ve igual
  if ((o.r ?? 0.82) >= 0.88 && !(o.m > 0.05) && !o.metal) return new THREE.MeshLambertMaterial({
    color, emissive: o.e ?? 0x000000, emissiveIntensity: o.ei ?? 0, map: o.map ?? null, transparent: !!o.t, opacity: o.op ?? 1, side: o.side ?? THREE.FrontSide });
  return new THREE.MeshStandardMaterial({
    color, roughness: o.r ?? 0.82, metalness: o.m ?? 0.04,
    emissive: o.e ?? 0x000000, emissiveIntensity: o.ei ?? 0, map: o.map ?? null,
    transparent: !!o.t, opacity: o.op ?? 1, side: o.side ?? THREE.FrontSide
  });
}
function box(w, h, d, m, x = 0, y = 0, z = 0, padre = scene) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  mesh.position.set(x, y, z); padre.add(mesh); return mesh;
}
// v0.2.2: caja con las esquinas redondeadas (modelos más modernos, E46)
function rbox(w, h, d, r, m, x = 0, y = 0, z = 0, padre = scene, seg = 3) {
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, seg, Math.min(r, w / 2, h / 2, d / 2) * 0.999), m);
  mesh.position.set(x, y, z); padre.add(mesh); return mesh;
}
function cyl(rt, rb, h, m, x = 0, y = 0, z = 0, padre = scene, seg = 32) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m);
  mesh.position.set(x, y, z); padre.add(mesh); return mesh;
}
function plano(w, h, m, x = 0, y = 0, z = 0, rx = 0, ry = 0, padre = scene) {
  const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m);
  p.position.set(x, y, z); p.rotation.set(rx, ry, 0); padre.add(p); return p;
}

/* ---------- texturas dibujadas en un lienzo ---------- */
const MONO = '"JetBrains Mono", ui-monospace, Consolas, monospace';
const DISP = '"Space Grotesk", "Segoe UI", sans-serif';
const BODY = 'Inter, "Segoe UI", sans-serif';
const MANO = 'Caveat, "Segoe Print", cursive';   // la letra a mano (pizarra, etiquetas de los discos)
const TEXTURAS = [];   // las que se redibujan cuando cargan las fuentes
function texFrom(w, h, dibuja) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); if (dibuja) dibuja(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  t.userData = { canvas: c, g, dibuja };
  if (dibuja) TEXTURAS.push(t);
  return t;
}
function redibuja(t, dibuja) { const { canvas: c, g } = t.userData; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, c.width, c.height); g.restore(); (dibuja || t.userData.dibuja)(g, c.width, c.height); t.needsUpdate = true; }
function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
// v0.2.3 (E56-25, textos cortados): escribe una línea que CABE en maxW: si no cabe, baja el tamaño de la letra (hasta el 60 %)
function cabe(g, texto, x, y, maxW, size, peso = '500', familia = BODY) {
  let s = size; g.font = peso + ' ' + s + 'px ' + familia;
  while (s > size * 0.6 && g.measureText(texto).width > maxW) { s -= 1; g.font = peso + ' ' + s + 'px ' + familia; }
  g.fillText(texto, x, y); return s;
}
function wrap(g, texto, x, y, maxW, lh) {
  const palabras = texto.split(' '); let linea = '';
  for (const p of palabras) {
    const t = linea ? linea + ' ' + p : p;
    if (g.measureText(t).width > maxW && linea) { g.fillText(linea, x, y); linea = p; y += lh; } else linea = t;
  }
  if (linea) g.fillText(linea, x, y);
  return y;
}

/* ---------- animaciones ---------- */
// Curvas: reciben el avance x (0 → 1) y devuelven cuánto se ha movido (puede pasar de 1 en las que rebotan)
const curva = {
  lineal: x => x,
  suave: x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),   // cúbica de entrada y salida (la de la v0.1)
  sale: x => 1 - Math.pow(1 - x, 3),                                        // frena al final
  entra: x => x * x * x,                                                     // arranca despacio
  retroceso: x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }, // se pasa y vuelve
  rebote: x => {                                                             // cae y rebota (disco en la bandeja)
    const n = 7.5625, d = 2.75;
    if (x < 1 / d) return n * x * x;
    if (x < 2 / d) return n * (x -= 1.5 / d) * x + 0.75;
    if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + 0.9375;
    return n * (x -= 2.625 / d) * x + 0.984375;
  }
};
const anims = [];
// anim(duración en ms, función que recibe el avance ya curvado, curva) → promesa que se cumple al terminar
function anim(dur, fn, ease = curva.suave) {
  return new Promise(resolve => {
    const a = { t0: performance.now(), dur: reduced ? Math.min(dur, 1) : dur, fn, ease, resolve, vivo: true };
    anims.push(a);
  });
}
function espera(ms) { return anim(reduced ? 0 : ms, () => {}); }
function corrAnims(ahora) {
  for (let i = anims.length - 1; i >= 0; i--) {
    const a = anims[i], p = Math.min(1, (ahora - a.t0) / a.dur);
    a.fn(a.ease(p), p);
    if (p >= 1) { anims.splice(i, 1); a.resolve(); }
  }
}
// Muelle amortiguado: da «peso» (cajón, objeto que se lleva). F = −k·(x − objetivo) − c·v
class Muelle {
  constructor(x = 0, k = 120, c = 16, m = 1) { this.x = x; this.v = 0; this.obj = x; this.k = k; this.c = c; this.m = m; }
  paso(dt) {
    if (reduced) { this.x = this.obj; this.v = 0; return this.x; }
    const sub = Math.ceil(dt / 0.008), h = dt / sub;          // pasos pequeños para que no se vuelva inestable
    for (let i = 0; i < sub; i++) {
      const a = (-this.k * (this.x - this.obj) - this.c * this.v) / this.m;
      this.v += a * h; this.x += this.v * h;                  // Euler semiimplícito: primero la velocidad
    }
    return this.x;
  }
  quieto() { return Math.abs(this.x - this.obj) < 1e-4 && Math.abs(this.v) < 1e-3; }
}
const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
