/* SergioLearns — piezas comunes de los simuladores de ME1 (16 nov 2026), sobre el kit v2 en diseño D (window.SLK):
 * la tarjeta (ejemplos en pastillas, franja con la orden de R, escenario, subtítulo y barra de pasos), el menú «Ajustar»,
 * la escena «Elige un ejemplo», las lecciones paso a paso con «¿Qué crees que pasa?» y los ejes de los gráficos en SVG. */
(function (G) {
  'use strict';
  var K = G.SLK, S = G.SLST;
  if (!K || !S || G.SLM1) return;
  var ico = K.ico, esc = K.esc, fill = K.fill;
  var TX = {
    es: { menuShare: 'Compartir este paso', menuTheme: 'Tema claro u oscuro', menuFocus: 'Pantalla completa', menuKeys: 'Atajos de teclado', menuPlay: 'Avanzar solo', ctl: 'Controles', ctlHide: 'Ocultar',
      more: '+{n} lecciones', back: 'Volver al simulador', firstEx: 'Empieza por aquí', steps: '{n} pasos', good: '¡Bien visto!', bad: 'No exactamente: míralo en el paso.',
      pickLead: 'Cada lección enseña una idea con un ejemplo de clase. Después, toca cualquier control: el simulador es tuyo.', xpBtn: 'Explícamelo con calma', close: 'Cerrar', xpK: 'Paso {i} · explicado con calma', parts: 'Pieza a pieza', tip: 'Para el examen:', prev: 'Anterior', next: 'Siguiente' },
    en: { menuShare: 'Share this step', menuTheme: 'Light or dark theme', menuFocus: 'Full screen', menuKeys: 'Keyboard shortcuts', menuPlay: 'Play on its own', ctl: 'Controls', ctlHide: 'Hide',
      more: '+{n} lessons', back: 'Back to the simulator', firstEx: 'Start here', steps: '{n} steps', good: 'Well spotted!', bad: 'Not quite: see it in the step.',
      pickLead: 'Each lesson teaches one idea with a class example. Then touch any control: the simulator is yours.', xpBtn: 'Explain it slowly', close: 'Close', xpK: 'Step {i} · explained slowly', parts: 'Piece by piece', tip: 'For the exam:', prev: 'Previous', next: 'Next' }
  };
  var ADJ = '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>';
  /* ------------------------------------------------ la tarjeta */
  function card(UI, o) {   // o: { lessons:[{k, n:[es,en], d:[es,en], g, steps:[…]}], main: html, onLoad(lesson), onStep(step, k), state(), restore(st) }
    var t = TX[UI.lang], li = UI.li, q = UI.q, T = UI.t, L = o.lessons;
    q('.slk-stage').innerHTML = '<div class="pm3-chips" role="group" aria-label="' + esc(T.examples) + '"></div>'
      + '<div class="pm3-card"><div class="pm3-head"><div class="pm3-strip m1-strip" aria-live="polite"><span class="pm3-ln">R</span><code class="pm3-cl"></code></div>'
      + '<span class="m1-head__r"><button type="button" class="slk-btn pm3-adjh" data-m1="adj" aria-haspopup="true" aria-label="' + esc(T.adjust) + '" title="' + esc(T.adjust) + '">' + ico(ADJ, 18) + '</button></span></div>'
      + '<div class="slk-main">' + o.main + '<div class="pm3-sub m1-sub" aria-live="polite"></div><div class="pm3-xpbw"><button type="button" class="pm3-xpb" data-m1="xp">' + ico('bulb', 16) + '<span>' + esc(t.xpBtn) + '</span></button></div><div class="m1-slot"></div></div><div class="slk-dock"></div></div>';
    var sub = q('.m1-sub'), slot = q('.m1-slot'), strip = q('.pm3-cl');
    // Como el de punteros: el escenario va solo y los controles se abren con un botón en la cabecera (17 nov 2026).
    var side = q('.m1-side'), grid = q('.m1-grid');
    if (side && grid) {
      var res = side.querySelector('.m1-res-c'), left = q('.m1-left');
      if (res && left) left.appendChild(res);
      side.classList.add('m1-panel'); side.hidden = true; grid.parentNode.insertBefore(side, grid); grid.classList.add('m1-grid--1');
      var cb = document.createElement('button'); cb.type = 'button'; cb.className = 'slk-btn pm3-codeb m1-ctlb'; cb.setAttribute('aria-expanded', 'false');
      var ctl = function (open) { side.hidden = !open; cb.setAttribute('aria-expanded', open ? 'true' : 'false'); cb.innerHTML = ico(ADJ, 16) + '<span>' + esc(open ? t.ctlHide : t.ctl) + '</span>'; if (open) K.anim(side, [{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 260 }); };
      ctl(false); cb.addEventListener('click', function () { ctl(side.hidden); });
      var hr = q('.m1-head__r'); hr.insertBefore(cb, hr.firstChild);
    }
    var C = { k: (L[0] || {}).k, step: 0, asked: {}, D: null };
    var DONE = 'sl_sim_' + UI.sim + '_vistas';
    function lesson() { for (var i = 0; i < L.length; i++) if (L[i].k === C.k) return L[i]; return L[0]; }
    function seen() { return K.jget(DONE, []); }
    function markSeen() { var V = seen(); if (V.indexOf(C.k) < 0) { V.push(C.k); K.jset(DONE, V); } }
    function chips() {
      var i0 = Math.max(0, L.indexOf(lesson())), shown = [];
      for (var j = 0; j < L.length && shown.length < 3; j++) shown.push(L[(i0 + j) % L.length]);
      shown.sort(function (a, b) { return L.indexOf(a) - L.indexOf(b); });
      var V = seen();
      q('.pm3-chips').innerHTML = shown.map(function (e) {
        var on = e.k === C.k;
        return '<button type="button" class="pm3-chip' + (on ? ' is-on' : '') + '" data-m1l="' + e.k + '"' + (on ? ' aria-current="true"' : '') + '><span class="slk-card__g">' + ico(e.g || 'target', 16) + '</span><span>' + esc(e.n[li]) + '</span>' + (V.indexOf(e.k) >= 0 && !on ? ico('check', 14, 'pm3-ok') : '') + '</button>';
      }).join('') + (L.length > shown.length ? '<button type="button" class="pm3-chip is-more" data-m1="pick">' + esc(fill(t.more, { n: L.length - shown.length })) + '</button>' : '');
    }
    function pick() {
      var V = seen();
      q('.slk-pick').innerHTML = '<div class="slk-pick__top"><div><h3 class="slk-pick__h">' + esc(T.pick) + '</h3><p class="slk-pick__p">' + esc(t.pickLead) + '</p></div><button type="button" class="slk-btn pm3-back" data-m1="back">' + ico('back', 16) + '<span>' + esc(t.back) + '</span></button></div>'
        + '<div class="slk-pick__g"><div class="slk-cards">' + L.map(function (e, i) {
          return '<button type="button" class="slk-card' + (i === 0 ? ' is-first' : '') + '" data-m1l="' + e.k + '"' + (i === 0 ? ' data-badge="' + esc(t.firstEx) + '"' : '') + '><span class="slk-card__g">' + ico(e.g || 'target', 20) + '</span><span class="slk-card__n">' + esc(e.n[li]) + '</span><span class="slk-card__d">' + esc(e.d[li]) + '</span><span class="slk-card__f">' + esc(fill(t.steps, { n: e.steps.length })) + (V.indexOf(e.k) >= 0 ? '<span class="slk-card__ok">' + ico('check', 13) + esc(T.done) + '</span>' : '') + '</span></button>';
        }).join('') + '</div></div>';
      UI.scene('pick');
    }
    function setSub(html, anim) {
      sub.innerHTML = html ? '<p>' + html + '</p>' : '';
      if (anim && sub.firstChild) K.anim(sub.firstChild, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 360 });
    }
    function setStrip(code, res) {
      strip.innerHTML = code ? esc(code) + (res != null ? '<span class="m1-arrow"> → </span><b class="m1-res">' + esc(res) + '</b>' : '') : '';
    }
    function draw(k, ox) {
      var les = lesson(), st = les.steps[k];
      if (C.ask) { C.ask.cancel(); C.ask = null; slot.innerHTML = ''; }
      var MO = ox && ox.anim ? K.morph(q('.slk-main')) : null;
      C.step = k;
      o.onStep(les, k, ox || {});
      setSub(st.s ? st.s[li] : '', ox && ox.anim);
      if (k >= les.steps.length - 1) markSeen();
      save();
      if (MO) MO.end([sub]);
    }
    function askAt(k, go) {
      var st = lesson().steps[k];
      if (!st.ask || C.asked[k] || K.store('sl_sim_preguntas') === 'no') return false;
      C.asked[k] = 1;
      var a = st.ask;
      C.ask = K.ask(UI, slot, { text: esc(a.q[li]), opts: a.o.map(function (x) { return { h: esc(x[li]), ok: !!x[2] }; }) }, function (res) {
        C.ask = null; slot.innerHTML = '';
        if (res === true) UI.toast(t.good); else if (res === false) UI.toast(t.bad);
        go();
      });
      return true;
    }
    function save() { K.jset('sl_sim_' + UI.sim + '_' + UI.lang, { k: C.k, s: C.step, x: o.state ? o.state() : null }); }
    UI.state = function () { return { k: C.k, s: C.step, x: o.state ? o.state() : null }; };
    C.D = K.deck(UI, {
      N: function () { return lesson().steps.length; },
      slides: function () { var n = lesson().steps.length, a = []; for (var i = 0; i < n; i++) a.push(i); return a; },
      marks: function () { var m = []; lesson().steps.forEach(function (s, i) { if (s.ask) m.push({ k: i, c: 'ask' }); }); return m; },
      draw: draw, ask: askAt, cancelAsk: function () { if (C.ask) { C.ask.cancel(); C.ask = null; slot.innerHTML = ''; } },
      speed: function () { return 5200; },
      onEx: pick, onAdj: menu, swipe: q('.slk-main')
    });
    function load(k, at) {
      C.k = k; C.asked = {}; if (o.onLoad) o.onLoad(lesson());
      chips(); UI.scene('stage'); C.D.reset(at || 0);
    }
    var XW = null;
    function xpHTML() {
      var X = o.xp ? o.xp() : null, i0 = C.D.pos(), n0 = C.D.count(); if (!X) return '';
      return '<div class="pm3-xp__top"><p class="pm3-xp__k" id="' + UI.id + '-xpk">' + ico('bulb', 15) + '<span>' + esc(fill(t.xpK, { i: i0 + 1 })) + '</span></p><button type="button" class="pm3-xp__x" data-x="close" aria-label="' + esc(t.close) + '" title="' + esc(t.close) + '">' + ico('x', 18) + '</button></div>'
        + '<div class="pm3-xp__body"><pre class="pm3-xp__code"><span class="pm3-xp__ln">R</span><code>' + esc(X.code) + '</code></pre>'
        + '<p class="pm3-xp__lead">' + X.lead + '</p>'
        + (X.parts && X.parts.length ? '<p class="pm3-xp__h">' + esc(t.parts) + '</p><ul class="pm3-xp__parts">' + X.parts.map(function (pt) { return '<li><code class="pm3-xp__c">' + esc(pt.c) + '</code><p>' + pt.d + '</p></li>'; }).join('') + '</ul>' : '')
        + (X.tip ? '<p class="pm3-xp__tip"><b>' + esc(t.tip) + '</b> ' + X.tip + '</p>' : '') + '</div>'
        + '<div class="pm3-xp__nav"><button type="button" class="pm3-xp__b" data-x="prev"' + (i0 <= 0 ? ' disabled' : '') + '>' + ico('back', 16) + '<span>' + esc(t.prev) + '</span></button><span class="pm3-xp__n">' + (i0 + 1) + ' / ' + n0 + '</span>'
        + '<button type="button" class="pm3-xp__b is-p" data-x="next"' + (i0 >= n0 - 1 ? ' disabled' : '') + '><span>' + esc(t.next) + '</span>' + ico('next', 16) + '</button></div>';
    }
    function xpClose(now) {
      var w = XW; if (!w) return; XW = null; document.removeEventListener('keydown', w._key, true);
      if (w._from && w._from.isConnected) w._from.focus({ preventScroll: true });
      if (now || K.reduced()) { w.remove(); return; }
      var phone = window.innerWidth < 640, a1 = K.anim(w.querySelector('.pm3-xp'), phone ? [{ transform: 'none' }, { transform: 'translateY(100%)' }] : [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(10px) scale(.98)' }], { duration: 220, easing: 'ease-in' });
      K.anim(w.querySelector('.pm3-xp__bg'), [{ opacity: 1 }, { opacity: 0 }], { duration: 220 });
      if (a1) a1.onfinish = function () { w.remove(); }; else w.remove();
    }
    function xpSync() { if (!XW) return; var w = XW.querySelector('.pm3-xp'); w.innerHTML = xpHTML(); K.anim(w.querySelector('.pm3-xp__body'), [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 260 }); }
    function xpOpen(from) {
      if (!o.xp) return; if (XW) xpClose(true); C.D.stop();
      var w = document.createElement('div');
      w.className = 'slk--d pm3-xpw' + (UI.el.classList.contains('is-light') ? ' is-light' : '');
      w.innerHTML = '<div class="pm3-xp__bg" data-x="close"></div><div class="pm3-xp" role="dialog" aria-modal="true" aria-labelledby="' + UI.id + '-xpk">' + xpHTML() + '</div>';
      document.body.appendChild(w); XW = w; w._from = from || null;
      K.anim(w.querySelector('.pm3-xp__bg'), [{ opacity: 0 }, { opacity: 1 }], { duration: 260 });
      var phone = window.innerWidth < 640;
      K.anim(w.querySelector('.pm3-xp'), phone ? [{ transform: 'translateY(100%)' }, { transform: 'none' }] : [{ opacity: 0, transform: 'translateY(16px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: phone ? 380 : 340 });
      w.addEventListener('click', function (e) {
        var b = e.target.closest('[data-x]'); if (!b) return; var a = b.getAttribute('data-x');
        if (a === 'close') xpClose(); else if (a === 'next' && !b.disabled) { C.D.next(); if (C.ask) xpClose(); else xpSync(); } else if (a === 'prev' && !b.disabled) { C.D.back(); xpSync(); }
      });
      w._key = function (e) {
        if (e.key === 'Escape') xpClose();
        else if (e.key === 'ArrowRight') { e.preventDefault(); C.D.next(); if (C.ask) xpClose(); else xpSync(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); C.D.back(); xpSync(); }
        e.stopPropagation();
      };
      document.addEventListener('keydown', w._key, true);
      var nb = w.querySelector('[data-x="next"]:not([disabled])') || w.querySelector('.pm3-xp__x'); if (nb) nb.focus({ preventScroll: true });
    }
    function menu(btn) {
      var old = q('.pm3-menu'); if (old) { old.remove(); return; }
      var m = document.createElement('div'); m.className = 'pm3-menu' + (btn.closest('.pm3-head') ? ' is-down' : ''); m.setAttribute('role', 'menu');
      var it = function (attr, icon, label) { return '<button type="button" role="menuitem" ' + attr + '>' + ico(icon, 16) + '<span>' + esc(label) + '</span></button>'; };
      m.innerHTML = it('data-m1="play"', 'play', t.menuPlay) + '<hr>' + it('data-k="share"', 'link', t.menuShare) + it('data-k="theme"', UI.el.classList.contains('is-light') ? 'moon' : 'sun', t.menuTheme) + it('data-k="focus"', 'expand', t.menuFocus) + it('data-k="keys"', 'key', t.menuKeys);
      btn.parentNode.appendChild(m);
      K.anim(m, [{ opacity: 0, transform: 'translateY(6px) scale(.98)' }, { opacity: 1, transform: 'none' }], { duration: 220 });
      setTimeout(function () {
        function close(e) {
          if (e && (m.contains(e.target) && !e.target.closest('button') || e.target === btn || btn.contains(e.target))) return;
          document.removeEventListener('click', close, true); document.removeEventListener('keydown', esck, true); setTimeout(function () { m.remove(); }, 0);
        }
        function esck(e) { if (e.key === 'Escape') { close(); btn.focus(); } }
        document.addEventListener('click', close, true); document.addEventListener('keydown', esck, true);
      }, 0);
      var f = m.querySelector('button'); if (f) f.focus();
    }
    UI.el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-m1],[data-m1l]'); if (!b || !UI.el.contains(b)) return;
      if (b.hasAttribute('data-m1l')) { var k = b.getAttribute('data-m1l'); if (k === C.k && UI.cur === 'stage') { C.asked = {}; C.D.reset(0); } else load(k); return; }
      var a = b.getAttribute('data-m1');
      if (a === 'pick') { C.D.stop(); pick(); } else if (a === 'back') UI.scene('stage'); else if (a === 'adj') menu(b); else if (a === 'play') C.D.play(); else if (a === 'xp') xpOpen(b);
    });
    UI.onScene = function (n) { if (n !== 'stage') C.D.stop(); };
    C.start = function () {   // arranque: el enlace compartido, lo guardado o la primera lección
      var hs = K.hashState(), sv = K.jget('sl_sim_' + UI.sim + '_' + UI.lang, null), st = hs && hs.k ? hs : sv;
      var ok = st && L.some(function (x) { return x.k === st.k; });
      C.k = ok ? st.k : L[0].k; if (o.onLoad) o.onLoad(lesson());
      chips(); UI.scene('stage', { instant: true });
      C.D.reset(ok ? Math.min(st.s | 0, lesson().steps.length - 1) : 0);
      if (ok && st.x && o.restore) o.restore(st.x);
    };
    C.setSub = setSub; C.setStrip = setStrip; C.xpSync = xpSync; C.chips = chips; C.load = load; C.lesson = lesson;
    return C;
  }
  /* ------------------------------------------------ gráficos */
  function ticks(lo, hi, n) {   // marcas «bonitas» entre lo y hi
    var span = hi - lo; if (!(span > 0)) return [lo];
    var step = Math.pow(10, Math.floor(Math.log10(span / n))), err = n / span * step;
    if (err <= 0.15) step *= 10; else if (err <= 0.35) step *= 5; else if (err <= 0.75) step *= 2;
    var a = Math.ceil(lo / step) * step, out = [];
    for (var x = a; x <= hi + step * 1e-9; x += step) out.push(Math.abs(x) < step * 1e-9 ? 0 : +x.toFixed(10));
    return out;
  }
  function scale(d0, d1, r0, r1) { var f = function (x) { return r0 + (x - d0) / (d1 - d0) * (r1 - r0); }; f.inv = function (y) { return d0 + (y - r0) / (r1 - r0) * (d1 - d0); }; return f; }
  function axisX(X, y, lo, hi, n, lab, en) {
    return ticks(lo, hi, n).map(function (v) { var x = X(v); return '<line class="m1-tk" x1="' + x + '" x2="' + x + '" y1="' + y + '" y2="' + (y + 5) + '"/><text class="m1-tl" x="' + x + '" y="' + (y + 19) + '" text-anchor="middle">' + esc(lab ? lab(v) : S.num(v, 4, en)) + '</text>'; }).join('');
  }
  function gridY(Y, x0, x1, lo, hi, n, en, k) {
    return ticks(lo, hi, n).map(function (v) { var y = Y(v); return '<line class="m1-gl" x1="' + x0 + '" x2="' + x1 + '" y1="' + y + '" y2="' + y + '"/><text class="m1-tl m1-tl--y" x="' + (x0 - 8) + '" y="' + (y + 4) + '" text-anchor="end">' + esc(S.num(v, k == null ? 3 : k, en)) + '</text>'; }).join('');
  }
  function numNorm(val, tol) {   // compara respuestas numéricas (coma o punto) con la buena, con un margen
    return function (s) { var x = parseFloat(String(s).replace(/\s/g, '').replace(',', '.').replace('−', '-')); return isNaN(x) ? '?' : Math.abs(x - val) <= tol + 1e-12 ? 'ok' : 'x' + x; };
  }
  G.SLM1 = { card: card, ticks: ticks, scale: scale, axisX: axisX, gridY: gridY, numNorm: numNorm, TX: TX, ADJ: ADJ };
})(typeof window !== 'undefined' ? window : this);
