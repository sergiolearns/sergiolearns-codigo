/* SergioLearns — kit común de los simuladores de la tanda 3 (ventana, aspecto, reproductor de pasos, «Ponte a prueba»). */
(function (G) {
  if (G.SL6K) return;
  var ICO = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    reset: '<path d="M4 4v6h6"/><path d="M4.5 15a8 8 0 1 0 1.8-8.3L4 10"/>',
    back: '<path d="M15 6l-6 6 6 6"/>', step: '<path d="M9 6l6 6-6 6"/>',
    play: '<path d="M7 4.5l12 7.5-12 7.5z"/>', pause: '<path d="M8 5v14M16 5v14"/>',
    dice: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 9h.01M15 15h.01M15 9h.01M9 15h.01M12 12h.01"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', arrow: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
    file: '<path d="M6 3.5h8l4 4v13H6z"/><path d="M14 3.5v4h4"/>',
    exam: '<rect x="5" y="3.5" width="14" height="17" rx="2.5"/><path d="M9 8.5h6M9 12.5h6M9 16.5h3.5"/>',
    pen: '<path d="M5 19l1-4L15.5 5.5a2 2 0 0 1 3 3L9 18z"/><path d="M13.5 7.5l3 3"/>',
    wave: '<path d="M3 15c2.5 0 2.5-6 5-6s2.5 6 5 6 2.5-6 5-6 2.5 3 3 3"/>'
  };
  function ico(d, k) { return '<svg class="sl6-i" width="' + (k || 18) + '" height="' + (k || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICO[d] || '') + '</svg>'; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fill(s, o) { return s.replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null ? o[k] : ''; }); }
  function store(k, v) { try { if (v === void 0) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var reduced = !!(G.matchMedia && G.matchMedia('(prefers-reduced-motion: reduce)').matches);
  function num(x, lang, d) { var p = Math.pow(10, d == null ? 2 : d), r = String(Math.round(x * p) / p); return lang === 'es' ? r.replace('.', ',') : r; }
  var TX = {
    es: { light: 'Claro', dark: 'Oscuro', themeL: 'Cambiar a aspecto claro', themeD: 'Cambiar a aspecto oscuro', reset: 'Reiniciar', back: 'Paso atrás', step: 'Paso', run: 'Ejecutar', pause: 'Pausa', speed: 'Velocidad', copied: 'Enlace copiado', nocopy: 'Copia la dirección de la barra', share: 'Compartir', tryL: 'Ponte a prueba', check: 'Comprobar', retoNew: 'Otro reto', sol: 'Ver la solución en el simulador', ok: 'bien', of: 'de' },
    en: { light: 'Light', dark: 'Dark', themeL: 'Switch to light theme', themeD: 'Switch to dark theme', reset: 'Reset', back: 'Step back', step: 'Step', run: 'Run', pause: 'Pause', speed: 'Speed', copied: 'Link copied', nocopy: 'Copy the address bar', share: 'Share', tryL: 'Test yourself', check: 'Check', retoNew: 'New challenge', sol: 'See the solution in the simulator', ok: 'right', of: 'of' }
  };
  var uid = 0;
  /* Monta la ventana: devuelve { el, lang, t, q(sel), id, links } */
  function mount(el, title) {
    var lang = el.getAttribute('data-lang') === 'en' ? 'en' : 'es', t = TX[lang], links = [];
    try { links = JSON.parse(el.getAttribute('data-links') || '[]'); } catch (e) {}
    el.classList.add('sl6');
    if (store('sl_entorno_tema') === 'claro') el.classList.add('is-light');
    var id = 'sl6x' + (++uid);
    return { el: el, lang: lang, t: t, id: id, links: links, title: title, q: function (s) { return el.querySelector(s); }, qa: function (s) { return el.querySelectorAll(s); } };
  }
  function winHTML(K, ps, body) {
    return '<div class="sl6-win"><div class="sl6-bar"><span class="sl6-dot" aria-hidden="true"></span><span class="sl6-bar__t">' + esc(K.title) + '</span><button type="button" class="sl6-theme" data-a="theme"></button></div><div class="sl6-body"><p class="sl6-cmd"><span class="sl6-ps">' + esc(ps) + '</span> <code class="sl6-cmdl"></code><i class="sl6-cur" aria-hidden="true">_</i></p>' + body + '</div></div>';
  }
  function tryHTML(K) {
    var L = K.links;
    return '<div class="sl6-try"><h2 class="sl6-try__h">' + esc(K.t.tryL) + '</h2><div class="sl6-reto"></div>' + (L.length ? '<ul class="sl6-links">' + L.map(function (e) {
      return '<li><a href="' + esc(e.u) + '"><span class="sl6-links__i">' + ico(e.i || 'book', 20) + '</span><b>' + esc(e.t) + '</b><span>' + esc(e.d || '') + '</span><span class="sl6-links__go">' + ico('arrow', 16) + '</span></a></li>';
    }).join('') + '</ul>' : '') + '</div>';
  }
  function themeBtn(K) {
    var b = K.q('.sl6-theme'), on = K.el.classList.contains('is-light');
    b.innerHTML = ico(on ? 'moon' : 'sun', 16) + '<span>' + esc(on ? K.t.dark : K.t.light) + '</span>';
    b.setAttribute('aria-label', on ? K.t.themeD : K.t.themeL);
  }
  function toggleTheme(K) { K.el.classList.toggle('is-light'); store('sl_entorno_tema', K.el.classList.contains('is-light') ? 'claro' : 'oscuro'); themeBtn(K); if (K.onTheme) K.onTheme(); }
  function toolsHTML(K) {
    var t = K.t;
    return '<div class="sl6-tools"><button type="button" class="sl6-ib" data-p="reset" aria-label="' + esc(t.reset) + '" title="' + esc(t.reset) + '">' + ico('reset', 17) + '</button><button type="button" class="sl6-ib" data-p="back" aria-label="' + esc(t.back) + '" title="' + esc(t.back) + '">' + ico('back', 17) + '</button><button type="button" class="sl6-btn" data-p="step">' + esc(t.step) + ico('step', 16) + '</button><button type="button" class="sl6-btn sl6-btn--p" data-p="run">' + ico('play', 14) + '<span>' + esc(t.run) + '</span></button><label class="sl6-speed"><span>' + esc(t.speed) + '</span><input type="range" min="1" max="4" step="1" value="2" aria-label="' + esc(t.speed) + '"></label><span class="sl6-clock"></span></div>';
  }
  /* Reproductor: K.N() = nº de pasos; K.draw(k, going). k = -1 antes de empezar. */
  function player(K) {
    var P = { k: -1, going: false, timer: null, sp: 2 };
    var runB = function () { return K.q('[data-p="run"]'); };
    function stop() { if (P.timer) { clearInterval(P.timer); P.timer = null; } runB().innerHTML = ico('play', 14) + '<span>' + esc(K.t.run) + '</span>'; K.el.classList.remove('is-running'); }
    function go(k) { P.going = true; K.el.classList.add('is-going'); P.k = Math.max(0, Math.min(K.N() - 1, k)); draw(); }
    function draw() { K.draw(P.going ? P.k : -1, P.going); var n = K.N(); K.q('[data-p="back"]').disabled = !P.going; K.q('[data-p="step"]').disabled = P.going && P.k >= n - 1; K.q('.sl6-clock').textContent = P.going ? (P.k + 1) + ' / ' + n : '0 / ' + n; }
    function reset() { stop(); P.going = false; P.k = -1; K.el.classList.remove('is-going'); draw(); }
    function run() {
      if (P.timer) { stop(); return; }
      if (!P.going || P.k >= K.N() - 1) { P.going = true; P.k = -1; K.el.classList.add('is-going'); }
      K.el.classList.add('is-running'); runB().innerHTML = ico('pause', 14) + '<span>' + esc(K.t.pause) + '</span>';
      var tick = function () { if (P.k >= K.N() - 1) { stop(); return; } go(P.k + 1); };
      tick(); P.timer = setInterval(tick, reduced ? 150 : [0, 1400, 850, 480, 200][P.sp]);
    }
    K.el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-p]'); if (!b || !K.el.contains(b)) return;
      var a = b.getAttribute('data-p');
      if (a === 'step') { stop(); go(P.going ? P.k + 1 : 0); } else if (a === 'back') { stop(); if (P.k <= 0) reset(); else go(P.k - 1); } else if (a === 'run') run(); else if (a === 'reset') reset();
    });
    var sp = K.q('.sl6-speed input');
    sp.addEventListener('input', function (e) { P.sp = +e.target.value; if (P.timer) { clearInterval(P.timer); P.timer = null; run(); } });
    P.reset = reset; P.draw = draw; P.run = run; P.stop = stop;
    return P;
  }
  function share(K, btn, state) {
    var url = location.href.split('#')[0] + '#sim=' + encodeURIComponent(state), sp = btn.querySelector('span');
    try { history.replaceState(null, '', '#sim=' + encodeURIComponent(state)); } catch (e) {}
    var say = function (m) { sp.textContent = m; setTimeout(function () { sp.textContent = K.t.share; }, 2200); };
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { say(K.t.copied); }, function () { say(K.t.nocopy); }); else say(K.t.nocopy);
  }
  function hashState() { var m = location.hash.match(/^#sim=(.+)$/); return m ? decodeURIComponent(m[1]) : null; }
  function keepHash(s) { try { if (location.hash.indexOf('#sim=') === 0) history.replaceState(null, '', '#sim=' + encodeURIComponent(s)); } catch (e) {} }
  function boot(sel, fn) {
    var all = function () { [].forEach.call(document.querySelectorAll(sel + ':not(.sl6)'), function (el) { try { fn(el); } catch (e) { if (G.console) console.error('[sl6]', e); } }); };
    // el script va al final de la página, después del simulador: se monta ya, antes de que «detalles visuales» busque
    // sus elementos para la animación de scroll (si no, la ventana se quedaría oculta)
    if (document.querySelector(sel) || document.readyState !== 'loading') all(); else document.addEventListener('DOMContentLoaded', all);
  }
  G.SL6K = { ico: ico, esc: esc, fill: fill, store: store, reduced: reduced, num: num, mount: mount, winHTML: winHTML, tryHTML: tryHTML, themeBtn: themeBtn, toggleTheme: toggleTheme, toolsHTML: toolsHTML, player: player, share: share, hashState: hashState, keepHash: keepHash, boot: boot };
})(typeof window !== 'undefined' ? window : this);
