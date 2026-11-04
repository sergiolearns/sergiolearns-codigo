/* ===================== 01 · núcleo =====================
   Motor (three.js como módulo), utilidades de geometría y texturas,
   animaciones (curvas, anim() con promesas y muelles) y el «bus» de eventos
   con el que se avisan los módulos entre sí. */
import * as THREE from 'three';

const reduced = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const $ = s => document.querySelector(s);
const VERSION = 'v0.2';

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
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x141221);
scene.fog = new THREE.Fog(0x141221, 3.4, 6.5);
const camera = new THREE.PerspectiveCamera(62, 1, 0.02, 20);
const BASE = new THREE.Vector3(0, 1.22, 0.55);   // los ojos de alguien sentado
const MESA_Y = 0.74, PLANO_Y = 0.765;            // tablero de la mesa y plano de trabajo para arrastrar

/* ---------- geometría ---------- */
function mat(color, o = {}) {
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
