/* SergioLearns — Sergio Bot v2 (panel del navegador). Lee lo que el lector tiene en pantalla y pregunta a /wp-json/sl/v1/bot.
   Historial solo en sessionStorage (slb_h). Aspecto tinta/claro compartido con los entornos (localStorage sl_entorno_tema).
   Todo lo que crea lleva sl-fx-in (si no, «detalles visuales» lo dejaría invisible). Sin emoticonos: iconos SVG. */
(function () {
  'use strict';
  var cfgEl = document.getElementById('slb-cfg');
  if (!cfgEl || window.SLBOT) return;
  var C; try { C = JSON.parse(cfgEl.textContent); } catch (e) { return; }
  if (document.querySelector('.sl-exam')) return;               // simulacros: apagado
  var T = C.t, EN = C.lang === 'en';
  var LS = function (k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
  var SSg = function (k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch (e) { return null; } };
  var SSs = function (k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } };
  var ICO = {
    chat: '<path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4.5 3.5V17H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/><path d="M8 10h8M8 13h5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    send: '<path d="M4 12l16-8-6 16-2.5-6.5z"/><path d="M11.5 13.5L20 4"/>',
    trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    code: '<path d="M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    arrow: '<path d="M5 12h13"/><path d="M13 6l6 6-6 6"/>',
    eye: '<path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.6"/>'
  };
  function svg(n, s) { return '<svg width="' + (s || 18) + '" height="' + (s || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + ICO[n] + '</svg>'; }
  function el(tag, cls, html) { var e = document.createElement(tag); e.className = (cls ? cls + ' ' : '') + 'sl-fx-in'; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(s, a, b) { return String(s).replace('%1$s', a).replace('%2$s', b).replace('%s', a).replace('%d', a); }
  function clip(s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n) : s; }
  function tail(s, n) { s = String(s || ''); return s.length > n ? s.slice(s.length - n) : s; }

  /* ---------- Markdown seguro (escapa todo y solo convierte lo que usa el bot) ---------- */
  function inline(s) {
    var codes = [];
    s = s.replace(/`([^`\n]+)`/g, function (m, c) { codes.push(c); return '\u0000' + (codes.length - 1) + '\u0000'; });
    s = esc(s);
    s = s.replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, function (m, t, u) {
      var ext = u.indexOf(location.origin) !== 0;
      return '<a href="' + u.replace(/"/g, '%22') + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + t + '</a>';
    });
    s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,;:]|$)/g, '$1<em>$2</em>');
    return s.replace(/\u0000(\d+)\u0000/g, function (m, i) { return '<code>' + esc(codes[+i]) + '</code>'; });
  }
  function md(src) {
    var out = [], lines = String(src).replace(/\r/g, '').split('\n'), i = 0, list = null, para = [];
    function flushP() { if (para.length) { out.push('<p>' + inline(para.join(' ')) + '</p>'); para = []; } }
    function flushL() { if (list) { out.push('<' + list.t + '>' + list.items.map(function (x) { return '<li>' + inline(x) + '</li>'; }).join('') + '</' + list.t + '>'); list = null; } }
    while (i < lines.length) {
      var L = lines[i], m;
      if ((m = /^\s*```\s*([\w+#-]*)\s*$/.exec(L))) {
        flushP(); flushL();
        var lang = m[1], code = []; i++;
        while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) { code.push(lines[i]); i++; }
        i++;
        out.push('<div class="slb-code"><div class="slb-code__bar"><span>' + esc(lang || (EN ? 'code' : 'código')) + '</span><button type="button" class="slb-copy">' + svg('copy', 14) + '<span>' + esc(T.copiar) + '</span></button></div><pre><code>' + esc(code.join('\n')) + '</code></pre></div>');
        continue;
      }
      if ((m = /^\s*(?:[-*•]|(\d+)[.)])\s+(.*)$/.exec(L))) {
        flushP(); var t = m[1] ? 'ol' : 'ul';
        if (!list || list.t !== t) { flushL(); list = { t: t, items: [] }; }
        list.items.push(m[2]); i++; continue;
      }
      if (/^\s*$/.test(L)) { flushP(); flushL(); i++; continue; }
      if (list && /^\s{2,}\S/.test(L)) { list.items[list.items.length - 1] += ' ' + L.trim(); i++; continue; }
      flushL(); para.push(L.replace(/^#{1,6}\s+/, '').trim()); i++;
    }
    flushP(); flushL();
    return out.join('');
  }

  /* ---------- lo que hay en pantalla ---------- */
  var content = document.querySelector('.entry-content') || document.querySelector('main') || document.body;
  function visible(e) { var r = e.getBoundingClientRect(); return r.bottom > 60 && r.top < innerHeight - 60 && r.width > 0; }
  function nearest(sel) {
    var best = null, bd = 1e9;
    [].forEach.call(document.querySelectorAll(sel), function (e) {
      if (e.closest('.sl-exam, template')) return;
      var r = e.getBoundingClientRect(); if (!r.width) return;
      var d = r.bottom < 0 ? -r.bottom : r.top > innerHeight ? r.top - innerHeight : 0;
      if (d < bd) { bd = d; best = e; }
    });
    return bd < innerHeight * 0.6 ? best : null;
  }
  function section() {
    var hs = [].slice.call(content.querySelectorAll('h2[id], h3[id]')), h2 = null, h3 = null, y = innerHeight * 0.35;
    hs.forEach(function (h) { if (h.closest('.slb, .sl-exam')) return; if (h.getBoundingClientRect().top < y) { if (h.tagName === 'H2') { h2 = h; h3 = null; } else h3 = h; } });
    return { sec: h2 ? h2.id : '', h3: h3 ? h3.id : '', t: h3 ? h3.textContent.trim() : h2 ? h2.textContent.trim() : '' };
  }
  var lastSel = '';
  function grabSel() {
    try { var s = window.getSelection(); if (s && s.rangeCount && !s.isCollapsed) { var n = s.getRangeAt(0).commonAncestorContainer; n = n.nodeType === 1 ? n : n.parentNode; if (n && content.contains(n) && !n.closest('.slb')) lastSel = clip(s.toString().trim(), 1500); } } catch (e) { /* nada */ }
  }
  document.addEventListener('selectionchange', function () { if (!panel || !panel.contains(document.activeElement)) grabSel(); });
  function ideCtx() {
    var e = nearest('.sl-ide.is-live');
    if (e && e._ide && e._ide.files) {
      var files = [], tot = 0;
      try { e._ide.files().forEach(function (f) { if (tot < 7000) { var c = clip(f.code, 7000 - tot); tot += c.length; files.push({ name: f.name, code: c }); } }); } catch (x) { return null; }
      var tab = e.querySelector('[role=tab][aria-selected=true]'), con = e.querySelector('.sl-ide__con');
      return { k: 'ide', lang: e.getAttribute('data-lang') || '', abierto: tab ? tab.textContent.trim() : '', files: files, con: tail(con ? con.innerText : '', 2500) };
    }
    var m = nearest('.sl-mips');
    if (m && m.slmips) {
      var s = m.slmips, code = '', out = '', msg = '';
      try { code = typeof s.code === 'function' ? s.code() : ''; out = typeof s.output === 'function' ? s.output() : ''; msg = typeof s.messages === 'function' ? s.messages() : ''; } catch (x) { /* nada */ }
      if (code) return { k: 'mips', lang: 'mips', abierto: '', files: [{ name: 'programa.s', code: clip(code, 7000) }], con: tail(String(out || '') + (msg ? '\n--- Mensajes ---\n' + msg : ''), 2500) };
    }
    return null;
  }
  function simCtx() {
    var s = nearest('.sl-sim');
    if (!s) return null;
    var cmd = s.querySelector('.sl6-cmd, [class*="cmd"]'), st = s.querySelectorAll('.sl6-desc, .sl6-clock, .sl6-state, .sl6-log, .sl6-tbl, .sl6-res, [class*="__state"]'), txt = [];
    [].forEach.call(st, function (x) { var t = x.innerText.trim(); if (t) txt.push(t); });
    return { id: s.getAttribute('data-sim') || '', cmd: clip(cmd ? cmd.textContent.replace(/_$/, '').trim() : '', 300), estado: tail(txt.join('\n'), 2000) };
  }

  /* ---------- estado ---------- */
  var H = SSg('slb_h') || [], panel = null, log, ta, sendB, chipT, quota, busy = false, extra = null, ficha = null, fichaT = 0, light = LS('sl_entorno_tema') === 'claro', opener = null, hdrBtns = [];
  function saveH() { H = H.slice(-14); SSs('slb_h', H); }
  // avatar s_ en SVG (nítido y centrado a cualquier tamaño): la «s» con la letra del logo y el cursor coral como rectángulo
  var AV = '<span class="slb-av" aria-hidden="true"><svg viewBox="0 0 32 32" focusable="false"><text x="16.3" y="20.6" text-anchor="end" font-family="Space Grotesk,Inter,sans-serif" font-weight="600" font-size="18" fill="#FFFFFF">s</text><rect class="slb-cur" x="17.3" y="18.4" width="7" height="2.2" rx=".4" fill="#FF6B4A"/></svg></span>';
  var slug = location.pathname.replace(/\/+$/, '').split('/').pop() || (EN ? 'home' : 'inicio');
  function mode() { return innerWidth >= 1280 ? 'push' : innerWidth > 600 ? 'over' : 'full'; }

  /* ---------- el panel lateral ---------- */
  function build() {
    panel = el('aside', 'slb' + (light ? ' is-light' : ''));
    panel.id = 'slb-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'false'); panel.setAttribute('aria-labelledby', 'slb-tt'); panel.hidden = true;
    panel.innerHTML =
      '<div class="slb-bar"><span class="slb-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="slb-path">sergio@learns:<b>~/' + esc(slug) + '</b>$ sergiobot</span>' +
      '<button type="button" class="slb-ib slb-theme" title="' + esc(T.tema) + '" aria-label="' + esc(T.tema) + '"></button>' +
      '<button type="button" class="slb-ib slb-clear" title="' + esc(T.borrar) + '" aria-label="' + esc(T.borrar) + '">' + svg('trash') + '</button>' +
      '<button type="button" class="slb-ib slb-close" title="' + esc(T.cerrar) + '" aria-label="' + esc(T.cerrar) + '">' + svg('x') + '</button></div>' +
      '<div class="slb-who">' + AV + '<div><strong id="slb-tt">Sergio Bot</strong><span>' + esc(T.sub) + '</span></div></div>' +
      '<div class="slb-log" role="log" aria-live="polite" aria-relevant="additions"></div>' +
      '<div class="slb-prompt"><div class="slb-ctx"><span class="slb-ctx__dot" aria-hidden="true"></span><span class="slb-ctx__t"></span><button type="button" class="slb-ctx__x" hidden title="' + esc(T.quitar) + '" aria-label="' + esc(T.quitar) + '">' + svg('x', 13) + '</button></div>' +
      '<form class="slb-f"><span class="slb-gt" aria-hidden="true">&gt;</span><label class="slb-sr" for="slb-q">' + esc(T.ph) + '</label><textarea id="slb-q" rows="1" maxlength="' + C.max + '" placeholder="' + esc(T.ph) + '"></textarea>' +
      '<button type="submit" class="slb-send" aria-label="' + esc(T.enviar) + '" title="' + esc(T.enviar) + '">' + svg('arrow') + '</button></form></div>' +
      '<footer class="slb-foot"><p>' + fmt(esc(T.priv), esc(C.prov), '<a href="' + esc(T.priv_u) + '" target="_blank" rel="noopener">' + esc(T.priv_l) + '</a>') + ' <span class="slb-quota" aria-live="polite"></span></p></footer>';
    document.body.appendChild(panel);
    log = panel.querySelector('.slb-log'); ta = panel.querySelector('textarea'); sendB = panel.querySelector('.slb-send');
    chipT = panel.querySelector('.slb-ctx__t'); quota = panel.querySelector('.slb-quota');
    paintTheme();
    panel.querySelector('.slb-theme').onclick = function () { light = !light; LS('sl_entorno_tema', light ? 'claro' : 'oscuro'); paintTheme(); };
    panel.querySelector('.slb-close').onclick = function () { toggle(false); };
    panel.querySelector('.slb-clear').onclick = function () { H = []; saveH(); render(); ta.focus(); };
    panel.querySelector('.slb-ctx__x').onclick = function () { extra = null; lastSel = ''; paintChip(); ta.focus(); };
    panel.querySelector('form').onsubmit = function (e) { e.preventDefault(); ask(ta.value); };
    ta.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); ask(ta.value); } });
    ta.addEventListener('input', grow);
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); toggle(false); } });
    log.addEventListener('click', function (e) {
      var b = e.target.closest('.slb-copy');
      if (b) { var c = b.closest('.slb-code').querySelector('code').textContent; try { navigator.clipboard.writeText(c); } catch (x) { /* nada */ } b.querySelector('span').textContent = T.copiado; setTimeout(function () { b.querySelector('span').textContent = T.copiar; }, 1500); }
      var s = e.target.closest('.slb-sug'); if (s) ask(s.textContent);
    });
    render();
  }
  function grow() { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 140) + 'px'; }
  function paintTheme() { panel.classList.toggle('is-light', light); panel.querySelector('.slb-theme').innerHTML = svg(light ? 'moon' : 'sun'); }
  function layout(on) {
    var R = document.documentElement;
    R.classList.toggle('slb-on', on); R.classList.toggle('slb-push', on && mode() === 'push');
  }
  function toggle(on, from) {
    if (!panel) build();
    on = on == null ? panel.hidden : on;
    if (on && panel.hidden) opener = from || document.activeElement;
    panel.hidden = !on; layout(on);
    hdrBtns.forEach(function (b) { b.setAttribute('aria-expanded', on ? 'true' : 'false'); });
    if (on) { paintChip(); getFicha(); setTimeout(function () { ta.focus(); }, 30); log.scrollTop = log.scrollHeight; }
    else { extra = null; if (opener && opener.focus && document.contains(opener)) opener.focus(); }
  }
  addEventListener('resize', function () { if (panel && !panel.hidden) layout(true); });
  function sugList() { return ideCtx() ? T.sug_ide : simCtx() ? T.sug_sim : C.post ? T.sug_art : []; }
  function ctxLabel() {
    var parts = [], s = section();
    if (extra && extra.k === 'quiz') parts.push(T.quiz + ' ' + extra.id);
    else if (extra && extra.k === 'code') parts.push(T.codigo);
    else { var i = ideCtx(); if (i) parts.push(i.k === 'mips' ? T.mips : T.ide); else if (simCtx()) parts.push(T.sim); }
    if (lastSel && !(extra && extra.k === 'code')) parts.push(T.sel);
    var base = C.post ? (s.t ? '§ ' + s.t : document.title.split('|')[0].trim()) : T.pagina;
    return { t: T.leyendo + ': ' + clip(base, 70) + (parts.length ? ' · ' + parts.join(' · ') : ''), x: !!(extra || lastSel) };
  }
  function paintChip() { if (!panel) return; var l = ctxLabel(); chipT.textContent = l.t; panel.querySelector('.slb-ctx__x').hidden = !l.x; }
  function bubble(r, html, cls) {
    var b = el('div', 'slb-m slb-m--' + r + (cls ? ' ' + cls : ''));
    b.innerHTML = r === 'u' ? '<div class="slb-m__b"><span class="slb-ps" aria-hidden="true">$ </span>' + html + '</div>' : '<div class="slb-m__b">' + html + '</div>';
    log.appendChild(b); log.scrollTop = log.scrollHeight; return b;
  }
  function render() {
    log.innerHTML = '';
    var s = sugList();
    bubble('a', '<p class="slb-hi"><span class="slb-ps" aria-hidden="true">$ </span>' + esc(T.hola_cmd) + '</p><p>' + esc(T.hola) + '</p>' + (H.length || !s.length ? '' : '<div class="slb-sugs"><p class="slb-sugs__h">' + esc(T.sug_h) + '</p>' + s.map(function (x) { return '<button type="button" class="slb-sug">' + esc(x) + '</button>'; }).join('') + '</div>'), 'is-hello');
    H.forEach(function (h) { bubble(h.r, h.r === 'a' ? md(h.x) : esc(h.x).replace(/\n/g, '<br>')); });
  }
  function setQuota(n) { if (quota && typeof n === 'number') quota.textContent = '· ' + fmt(T.quedan, n); }
  function getFicha() {
    if (ficha && Date.now() - fichaT < 3 * 3600e3) return Promise.resolve(ficha);
    return fetch(C.api + '/ficha', { credentials: 'same-origin', cache: 'no-store', headers: C.nonce ? { 'X-WP-Nonce': C.nonce } : {} })
      .then(function (r) { return r.json(); }).then(function (j) { ficha = j.f; fichaT = Date.now(); setQuota(j.quedan); return ficha; })
      .catch(function () { return null; });
  }
  function errText(j) {
    var e = j && j.e;
    return e === 'limite' ? fmt(T.e_limite, j.n || 8) : e === 'dia' ? T.e_dia : e === 'rapido' ? T.e_rapido : e === 'examen' ? T.e_examen : e === 'datos' ? T.e_datos : e === 'off' || e === 'clave' ? T.e_off : T.e_red;
  }

  /* ---------- el botón «Pregúntale» de la cápsula del menú ---------- */
  function addHeaderButtons() {
    [].forEach.call(document.querySelectorAll('.search-toggle-open-container'), function (c) {
      var item = c.closest('.site-header-item') || c;
      if (item.parentElement.querySelector('.slb-hbtn')) return;
      var b = el('button', 'slb-hbtn'); b.type = 'button'; b.title = T.abrir;
      b.setAttribute('aria-controls', 'slb-panel'); b.setAttribute('aria-expanded', 'false');
      b.innerHTML = AV + '<span class="slb-hbtn__t">' + esc(T.hdr) + '</span>';
      b.addEventListener('pointerdown', grabSel);
      b.addEventListener('click', function () { toggle(null, b); });
      var w = el('div', 'site-header-item slb-hitem'); w.appendChild(b); item.insertAdjacentElement('afterend', w); hdrBtns.push(b);
    });
    // botón pequeño junto a «volver arriba» cuando la cápsula del menú no está a la vista (en el móvil la cabecera no es fija)
    if (hdrBtns.length && window.IntersectionObserver && !document.querySelector('.slb-mfab')) {
      var mf = el('button', 'slb-mfab'); mf.type = 'button'; mf.title = T.abrir; mf.setAttribute('aria-label', T.abrir); mf.setAttribute('aria-controls', 'slb-panel');
      mf.innerHTML = AV; mf.addEventListener('pointerdown', grabSel); mf.addEventListener('click', function () { toggle(null, mf); });
      document.body.appendChild(mf);
      var seen = new Map(), io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { seen.set(e.target, e.isIntersecting && e.boundingClientRect.width > 0); });
        var any = false; seen.forEach(function (v) { any = any || v; });
        mf.classList.toggle('is-on', !any);
      });
      hdrBtns.forEach(function (b) { io.observe(b); });
    }
    if (!hdrBtns.length && !document.querySelector('.slb-hbtn')) {   // sin cabecera de Kadence: botón fijo de reserva
      var f = el('button', 'slb-hbtn slb-hbtn--fix'); f.type = 'button'; f.title = T.abrir; f.setAttribute('aria-controls', 'slb-panel');
      f.innerHTML = AV + '<span class="slb-hbtn__t">' + esc(T.hdr) + '</span>'; f.addEventListener('pointerdown', grabSel); f.addEventListener('click', function () { toggle(null, f); });
      document.body.appendChild(f); hdrBtns.push(f);
    }
  }

  /* ---------- la pestaña «Preguntar a Sergio Bot» dentro de Ctrl K (fragmento 17, sin tocarlo) ---------- */
  function palHook() {
    var p = document.getElementById('sl2-pal');
    if (!p || p._slb) return;
    var box = p.querySelector('.sl2-pal__box'), top = p.querySelector('.sl2-pal__top'), q = p.querySelector('.sl2-pal__q'), res = p.querySelector('.sl2-pal__res'), pr = p.querySelector('.sl2-pal__prompt');
    if (!box || !top || !q || !res) return;
    p._slb = 1;
    var on = false, ph0 = q.placeholder;
    var tabs = el('div', 'slb-tabs'); tabs.setAttribute('role', 'tablist');
    tabs.innerHTML = '<button type="button" role="tab" class="slb-tab is-on" aria-selected="true">' + esc(T.tab_b) + ' <kbd>Ctrl K</kbd></button><button type="button" role="tab" class="slb-tab" aria-selected="false">' + AV + esc(T.tab_p) + ' <kbd>Tab</kbd></button>';
    box.insertBefore(tabs, box.firstChild);
    var pa = el('div', 'slb-pask'); pa.hidden = true;
    pa.innerHTML = '<div class="slb-ctx"><span class="slb-ctx__dot" aria-hidden="true"></span><span class="slb-ctx__t"></span></div><div class="slb-pask__l"></div><p class="slb-pask__k"><kbd>Tab</kbd>' + esc(T.tab_b) + '<kbd>Intro</kbd>' + esc(T.intro) + '<kbd>Esc</kbd>' + esc(T.cerrar) + '</p>';
    top.insertAdjacentElement('afterend', pa);
    function set(m, nofocus) {
      on = m; p.classList.toggle('slb-asking', m);
      [].forEach.call(tabs.children, function (t, i) { var a = (i === 1) === m; t.classList.toggle('is-on', a); t.setAttribute('aria-selected', a ? 'true' : 'false'); });
      res.hidden = m; pa.hidden = !m; q.placeholder = m ? T.ph : ph0; if (pr) pr.textContent = m ? '?' : '>';
      if (m) {
        pa.querySelector('.slb-ctx__t').textContent = ctxLabel().t;
        var s = sugList();
        pa.querySelector('.slb-pask__l').innerHTML = (s.length ? '<p class="slb-sugs__h">' + esc(T.sug_h) + '</p>' : '') + s.map(function (x) { return '<button type="button" class="slb-pask__s">' + esc(x) + '</button>'; }).join('');
      }
      if (!nofocus) q.focus();
    }
    function go(text) {
      text = String(text || '').trim(); if (!text) return;
      var x = p.querySelector('.sl2-pal__x'); if (x) x.click();
      set(false, true); q.value = '';
      setTimeout(function () { ask(text); }, 40);
    }
    tabs.addEventListener('click', function (e) { var b = e.target.closest('.slb-tab'); if (b) set(b === tabs.children[1]); });
    pa.addEventListener('click', function (e) { var s = e.target.closest('.slb-pask__s'); if (s) go(s.textContent); });
    q.addEventListener('keydown', function (e) {
      if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); e.stopImmediatePropagation(); set(!on); }
      else if (on && e.key === 'Enter') { e.preventDefault(); e.stopImmediatePropagation(); go(q.value); }
      else if (on && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.stopImmediatePropagation(); }
    }, true);
    q.addEventListener('input', function (e) { if (on) e.stopImmediatePropagation(); }, true);
    new MutationObserver(function () { if (on && getComputedStyle(p).display === 'none') set(false, true); }).observe(p, { attributes: true });
  }
  palHook();
  if (window.MutationObserver) new MutationObserver(function () { palHook(); }).observe(document.body, { childList: true });

  /* ---------- preguntar ---------- */
  function ask(q, ext) {
    q = String(q || '').trim();
    if (!q || busy) return;
    if (!panel || panel.hidden) toggle(true);
    if (ext !== undefined) extra = ext;
    if (q.length > C.max) { bubble('a', '<p>' + esc(T.e_datos) + '</p>', 'is-err'); return; }
    var s = section(), body = { q: q, post: C.post, lang: C.lang, sec: s.sec, h3: s.h3, sel: lastSel, stream: 1, hist: H.slice(-6).map(function (h) { return { r: h.r, x: clip(h.x, 700) }; }) };
    if (extra && extra.k === 'quiz') body.quiz = { id: extra.id, ok: extra.ok ? 1 : 0, eleg: extra.eleg || '' };
    else if (extra && extra.k === 'code') { body.code = { lang: extra.lang, x: extra.x }; body.sel = ''; }
    else { var i = ideCtx(); if (i) body.ide = i; else { var sm = simCtx(); if (sm) body.sim = sm; } }
    if (C.admin && window.SLBOT_TEST) { if (SLBOT_TEST.prov) body.prov = SLBOT_TEST.prov; if (SLBOT_TEST.modo) body.modo = SLBOT_TEST.modo; if (SLBOT_TEST.sinlimite) body.sinlimite = 1; if ('razona' in SLBOT_TEST) body.razona = SLBOT_TEST.razona ? 1 : 0; if (SLBOT_TEST.modelo) { body.modelo = SLBOT_TEST.modelo; body.precio = SLBOT_TEST.precio; } }
    var sugsEl = log.querySelector('.slb-sugs'); if (sugsEl) sugsEl.remove();
    H.push({ r: 'u', x: q }); saveH();
    bubble('u', esc(q).replace(/\n/g, '<br>'));
    ta.value = ''; grow(); busy = true; sendB.disabled = true; panel.classList.add('is-busy');
    var a = bubble('a', '<p class="slb-wait"><span></span><span></span><span></span>' + esc(T.pensando) + '</p>', 'is-wait'), box = a.querySelector('.slb-m__b'), acc = '', done = false;
    var t0 = Date.now();
    function finish(j, okText) {
      if (done) return; done = true;
      busy = false; sendB.disabled = false; panel.classList.remove('is-busy'); a.classList.remove('is-wait');
      if (okText != null) {
        box.innerHTML = md(okText); H.push({ r: 'a', x: okText }); saveH();
        if (C.admin && j && j.meta) { var m = j.meta; box.insertAdjacentHTML('beforeend', '<p class="slb-meta">' + esc(m.prov + ' · ' + m.modelo + ' · ' + m.modo + ' · ' + m.ms + ' ms · ' + m.in + ' + ' + m.out + ' tokens · ' + m.usd.toFixed(5) + ' $') + '</p>'); window.SLBOT_LAST = { meta: m, x: okText, ms: Date.now() - t0 }; }
      } else { a.classList.add('is-err'); box.innerHTML = '<p>' + esc(errText(j)) + '</p>'; H.pop(); saveH(); if (C.admin) window.SLBOT_LAST = { err: j }; }
      if (j && typeof j.quedan === 'number') setQuota(j.quedan);
      extra = null; lastSel = ''; paintChip(); log.scrollTop = log.scrollHeight;
    }
    getFicha().then(function (f) {
      body.f = f || '';
      var hd = { 'Content-Type': 'application/json' }; if (C.nonce) hd['X-WP-Nonce'] = C.nonce;
      var ctl = window.AbortController ? new AbortController() : null, to = setTimeout(function () { if (ctl) ctl.abort(); }, 45000);
      return fetch(C.api, { method: 'POST', credentials: 'same-origin', headers: hd, body: JSON.stringify(body), signal: ctl ? ctl.signal : undefined }).then(function (r) {
        var ct = r.headers.get('content-type') || '';
        if (ct.indexOf('event-stream') < 0 || !r.body || !r.body.getReader) return r.json().then(function (j) { clearTimeout(to); if (j && j.ok) finish(j, j.x); else { if (j && j.e === 'ficha') ficha = null; finish(j); } });
        var rd = r.body.getReader(), dec = new TextDecoder(), buf = '';
        function pump() {
          return rd.read().then(function (res) {
            if (res.done) { clearTimeout(to); if (!done) { if (acc) finish(null, acc); else finish({ e: 'red' }); } return; }
            buf += dec.decode(res.value, { stream: true });
            var k;
            while ((k = buf.indexOf('\n\n')) >= 0) {
              var blk = buf.slice(0, k); buf = buf.slice(k + 2);
              var ev = (/^event: (\w+)/m.exec(blk) || [])[1], dm = /^data: (.*)$/m.exec(blk);
              if (!ev || !dm) continue;
              var j; try { j = JSON.parse(dm[1]); } catch (x) { continue; }
              if (ev === 't') { acc += j.x; a.classList.remove('is-wait'); box.innerHTML = md(acc); log.scrollTop = log.scrollHeight; }
              else if (ev === 'fin') { clearTimeout(to); finish(j, j.x); }
              else if (ev === 'err') { clearTimeout(to); finish(j); }
            }
            return pump();
          });
        }
        return pump();
      });
    }).catch(function () { finish(acc ? null : { e: 'red' }, acc || null); });
  }

  /* ---------- botones en contexto ---------- */
  function codeOf(tb) {
    var w = tb.closest('.enlighter-default'), lines = w ? w.querySelectorAll('.enlighter-code > div, .enlighter-raw') : [];
    var raw = w && w.querySelector('.enlighter-raw');
    var txt = raw && raw.textContent ? raw.textContent : [].map.call(lines, function (d) { return d.textContent; }).join('\n');
    var lang = w ? ((/enlighter-l-(\w+)/.exec(w.className) || [])[1] || '') : '';
    return { k: 'code', lang: lang === 'assembly' ? 'mips' : lang === 'cpp' ? 'c' : lang, x: clip(txt, 5000) };
  }
  function addCodeButtons() {
    [].forEach.call(document.querySelectorAll('.entry-content .enlighter-toolbar-top'), function (tb) {
      if (tb.querySelector('.slb-exp') || tb.closest('.sl-exam, .sl-q, .slb')) return;
      var b = el('button', 'slb-exp', svg('bulb', 15) + '<span>' + esc(T.exp) + '</span>'); b.type = 'button';
      b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); ask(T.expq, codeOf(tb)); });
      var run = tb.querySelector('.sl3-run'); if (run) run.insertAdjacentElement('afterend', b); else tb.insertBefore(b, tb.firstChild);
      var w = tb.closest('.enlighter-default'); if (w) w.classList.add('slb-has');
    });
  }
  function quizState(q) {
    var sol = q.querySelector('.sl-q__sol'), msg = q.querySelector('.sl-q__msg'), ok = (sol && !sol.hidden) || (msg && msg.textContent.trim() !== '') || q.classList.contains('is-done');
    var eleg = [].map.call(q.querySelectorAll('input:checked'), function (i) { var l = i.closest('label'); return l ? l.textContent.trim() : ''; }).filter(Boolean).join(' / ');
    if (!eleg) eleg = [].map.call(q.querySelectorAll('input[type=text], textarea, select'), function (i) { return i.value; }).filter(Boolean).join(' / ');
    return { ok: ok, eleg: clip(eleg, 400) };
  }
  function addQuizButtons() {
    [].forEach.call(document.querySelectorAll('.sl-quiz .sl-q[data-id]'), function (q) {
      if (q.closest('.sl-exam')) return;
      var bar = q.querySelector('.sl-q__bar'); if (!bar || bar.querySelector('.slb-qb')) return;
      var b = el('button', 'slb-qb'); b.type = 'button';
      var paint = function () { var st = quizState(q); b.innerHTML = svg(st.ok ? 'chat' : 'bulb', 15) + '<span>' + esc(st.ok ? T.pregq : T.pista) + '</span>'; };
      paint();
      bar.addEventListener('click', function (e) { if (!e.target.closest('.slb-qb')) setTimeout(paint, 60); });
      b.addEventListener('click', function () {
        var st = quizState(q), id = q.getAttribute('data-id'), n = ((q.querySelector('.sl-q__num') || {}).textContent || id).replace(/^\D+(?=\d)/, '');
        ask(st.ok ? fmt(T.porque, n.trim(), st.eleg || '—').replace('%s', st.eleg || '—') : fmt(T.pistaq, n.trim()), { k: 'quiz', id: id, ok: st.ok, eleg: st.eleg });
      });
      bar.appendChild(b);
    });
  }
  function scan() { addCodeButtons(); addQuizButtons(); }
  addHeaderButtons(); scan(); setTimeout(scan, 900); setTimeout(scan, 2500);
  if (window.MutationObserver) { var mt = null; new MutationObserver(function () { clearTimeout(mt); mt = setTimeout(scan, 300); }).observe(content, { childList: true, subtree: true }); }
  addEventListener('scroll', function () { if (panel && !panel.hidden) { clearTimeout(window.__slbS); window.__slbS = setTimeout(paintChip, 200); } }, { passive: true });
  window.SLBOT = { ask: ask, open: function () { toggle(true); }, palHook: palHook, close: function () { toggle(false); }, ctx: function () { return { s: section(), ide: ideCtx(), sim: simCtx(), sel: lastSel }; } };
})();
