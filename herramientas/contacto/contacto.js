/* SergioLearns — formulario de contacto (sl9). Envía por la API sl/v1/contacto. */
(function () {
  'use strict';
  [].forEach.call(document.querySelectorAll('form.sl9-f'), function (f) {
    if (f.__sl9) return; f.__sl9 = 1;
    var T = {}; try { T = JSON.parse(f.getAttribute('data-t')); } catch (e) {}
    var st = f.querySelector('.sl9-st'), b = f.querySelector('.sl9-b'), bt = b.querySelector('span');
    var subj = f.parentNode.querySelector('.sl9-subj'), sel = f.elements.motivo, ta = f.elements.mensaje, cnt = f.querySelector('.sl9-n');
    var ini = 0, tok = '';
    var start = function () { if (!ini) { ini = Date.now(); tok = 'sl9-' + Math.random().toString(36).slice(2, 12) + ini.toString(36); } };
    f.addEventListener('input', start); f.addEventListener('focusin', start);
    sel.addEventListener('change', function () { subj.textContent = sel.options[sel.selectedIndex].text; });
    ta.addEventListener('input', function () { cnt.textContent = ta.value.length + ' / 5000'; });
    var mark = function () {
      var bad = null;
      ['nombre', 'correo', 'mensaje', 'priv'].forEach(function (n) {
        var el = f.elements[n], ok = n === 'priv' ? el.checked : (n === 'correo' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()) : el.value.trim().length >= (n === 'mensaje' ? 10 : 1));
        (n === 'priv' ? el.closest('.sl9-c') : el).classList.toggle('is-bad', !ok);
        el.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok && !bad) bad = el;
      });
      return bad;
    };
    f.addEventListener('submit', function (e) {
      e.preventDefault(); start();
      var bad = mark();
      if (bad) { bad.focus(); st.className = 'sl9-st is-err'; st.textContent = T.req ? T.req + ': ' + [].map.call(f.querySelectorAll('.is-bad'), function (x) { var l = x.closest('label'); return l ? (l.querySelector('span') || l).firstChild.textContent.trim() : ''; }).filter(Boolean).join(', ') : ''; return; }
      b.disabled = true; bt.textContent = T.enviando; st.className = 'sl9-st'; st.textContent = '';
      var h = { 'Content-Type': 'application/json' }, nn = f.getAttribute('data-nonce'); if (nn) h['X-WP-Nonce'] = nn;
      fetch(f.getAttribute('data-api'), { method: 'POST', headers: h, credentials: 'same-origin', body: JSON.stringify({
        nombre: f.elements.nombre.value, correo: f.elements.correo.value, motivo: sel.value, enlace: f.elements.enlace.value,
        mensaje: ta.value, priv: f.elements.priv.checked ? 1 : 0, web: f.elements.web.value, tok: tok, ini: String(Date.now() - ini), lang: f.getAttribute('data-lang')
      }) }).then(function (r) { return r.json().catch(function () { return {}; }); }).then(function (j) {
        if (!j || !j.ok) throw 0;
        f.classList.add('is-sent'); st.className = 'sl9-st is-ok'; st.textContent = T.ok;
        bt.textContent = T.otra; b.disabled = false; b.type = 'button';
        b.onclick = function () { f.reset(); cnt.textContent = '0 / 5000'; subj.textContent = sel.options[0].text; f.classList.remove('is-sent'); st.textContent = ''; bt.textContent = T.enviar; b.type = 'submit'; b.onclick = null; ini = 0; };
      }).catch(function () { st.className = 'sl9-st is-err'; st.textContent = T.err; b.disabled = false; bt.textContent = T.enviar; });
    });
  });
})();
