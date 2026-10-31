/* SergioLearns — interfaz de la calculadora de subredes IPv4 (.sl-sim[data-sim="subredes"]). Necesita kit.js y engine.js. */
(function () {
  'use strict';
  var K6 = window.SL6K, ico = K6.ico, esc = K6.esc, fill = K6.fill, str = SLSubred.str;
  var TX = {
    es: {
      title: 'sergio@learns: ~/laboratorio/simuladores', ps: 'sergio@learns:~/laboratorio/simuladores$', cmd: 'ipcalc',
      inL: 'IP y máscara', inPh: '10.110.7.24/24', inHelp: 'Escribe IP/n (10.110.7.24/24) o IP y máscara (10.110.7.24 255.255.255.0).', nL: 'Prefijo',
      ex: 'Ejemplo', rnd: 'Aleatorio', share: 'Compartir',
      err: { prefix: 'El prefijo va de /0 a /32.', mask: 'La máscara no es una dirección válida: cuatro números del 0 al 255.', contig: 'Esa máscara no vale: en binario tiene que ser una fila de unos seguida de una fila de ceros ({b}).', ip: 'La IP no es válida: cuatro números del 0 al 255 separados por puntos.', nomask: 'Falta la máscara: añade /n (por ejemplo /24) o la máscara (255.255.255.0).', format: 'No lo entiendo: escribe IP/n (10.110.7.24/24) o IP y máscara.' },
      bits: 'AND bit a bit', steps: 'paso a paso', rows: ['IP', 'máscara', 'red (AND)', 'difusión'], legN: 'bits de red (máscara a 1)', legH: 'bits de equipo (máscara a 0)', cut: '/{n}',
      start: 'Pulsa Paso para ver el AND byte a byte, o Ejecutar para verlo entero.',
      e: {
        ip: 'La IP {ip} en binario: cada byte son 8 bits ({bin}).',
        mask: 'La máscara /{n}: {n} unos (la red) y {h} ceros (el equipo) = {m}.',
        and: 'Byte {k}: {a} AND {b} = {r}{mix}.',
        mix: ' (byte partido: {ab} AND {bb} = {rb}; solo pasan los bits donde la máscara tiene un 1)',
        full: ' (la máscara es 255: el byte pasa entero)', zero: ' (la máscara es 0: el byte se queda a 0)',
        net: 'La dirección de red es {net}: la IP con los bits de equipo a 0.',
        bc: 'Difusión (broadcast): la red con los {h} bits de equipo a 1 = {bc}. Un paquete a esta dirección llega a todos los equipos de la red.',
        hosts: 'Hay {h} bits de equipo: 2^{h} = {tot} direcciones, menos la de red y la de difusión = {hosts} equipos, de {first} a {last}.',
        hosts31: 'Con /31 quedan 2 direcciones y las dos se usan en un enlace punto a punto (no hay red ni difusión aparte).',
        hosts32: 'Con /32 la «red» es una sola dirección: este equipo.',
        cls: 'Por sus primeros bits es de clase {c}{p}.', priv: ' y es una dirección privada ({r}): no sale tal cual a Internet', pub: ' y es pública',
        isNet: ' Ojo: {ip} es justo la dirección de red, no se le puede dar a un equipo.', isBc: ' Ojo: {ip} es justo la de difusión, no se le puede dar a un equipo.'
      },
      results: 'resultados', r: { ip: 'dirección', mask: 'máscara', net: 'red', bc: 'difusión', first: 'primer host', last: 'último host', hosts: 'hosts', cls: 'clase', kind: 'tipo' },
      xr: { net: 'IP AND máscara', bc: 'red con los bits de equipo a 1', first: 'red + 1', last: 'difusión − 1', hosts: '2^{h} − 2' },
      kind: { priv: 'privada ({r})', pub: 'pública', loop: 'bucle local (127.0.0.0/8)' },
      cmp: '¿misma red?', cmpL: 'Otra IP', cmpPh: '10.110.7.200',
      same: '<b>{b}</b> AND {m} = <b>{nb}</b> = la misma red → <span class="ok">entrega directa</span>: el equipo pide su MAC con ARP y se lo manda sin pasar por el router.',
      diff: '<b>{b}</b> AND {m} = <b>{nb}</b> ≠ {net} → <span class="ko">otra red</span>: el paquete va a la puerta de enlace (el router), que decide por dónde seguir.',
      cmpBad: 'Escribe otra IP para comparar (cuatro números del 0 al 255).',
      rules: 'La red sale de un AND bit a bit entre la IP y la máscara: donde la máscara tiene un 1, el bit de la IP pasa; donde tiene un 0, queda a 0. La clase (A, B, C, D o E) se mira en los primeros bits, como en los apuntes, pero hoy las redes se dicen con /n (CIDR).',
      gDesc: 'AND bit a bit de {ip} con la máscara {m}: red {net}, difusión {bc}.',
      reto: 'Reto: calcula tú la red', retoLead: 'Te doy una IP con su prefijo. Haz el AND en papel y rellena las casillas.', retoF: { net: 'red', bc: 'difusión', first: 'primer host', last: 'último host', hosts: 'número de hosts' },
      allOk: 'Todo bien. Así se hace en el examen.', someBad: 'Revisa las casillas en rojo: el error más común es olvidar restar las direcciones de red y de difusión.', got: '{a} de {n} bien'
    },
    en: {
      title: 'sergio@learns: ~/lab/simulators', ps: 'sergio@learns:~/lab/simulators$', cmd: 'ipcalc',
      inL: 'IP and mask', inPh: '10.110.7.24/24', inHelp: 'Type IP/n (10.110.7.24/24) or IP and mask (10.110.7.24 255.255.255.0).', nL: 'Prefix',
      ex: 'Example', rnd: 'Random', share: 'Share',
      err: { prefix: 'The prefix goes from /0 to /32.', mask: 'The mask is not a valid address: four numbers from 0 to 255.', contig: 'That mask is not valid: in binary it must be a run of ones followed by a run of zeros ({b}).', ip: 'The IP is not valid: four numbers from 0 to 255 separated by dots.', nomask: 'The mask is missing: add /n (for example /24) or the mask (255.255.255.0).', format: 'I cannot read that: type IP/n (10.110.7.24/24) or IP and mask.' },
      bits: 'bitwise AND', steps: 'step by step', rows: ['IP', 'mask', 'network (AND)', 'broadcast'], legN: 'network bits (mask = 1)', legH: 'host bits (mask = 0)', cut: '/{n}',
      start: 'Press Step to watch the AND byte by byte, or Run to watch it all.',
      e: {
        ip: 'The IP {ip} in binary: each byte is 8 bits ({bin}).',
        mask: 'The /{n} mask: {n} ones (the network) and {h} zeros (the host) = {m}.',
        and: 'Byte {k}: {a} AND {b} = {r}{mix}.',
        mix: ' (split byte: {ab} AND {bb} = {rb}; only the bits where the mask has a 1 get through)',
        full: ' (the mask is 255: the whole byte gets through)', zero: ' (the mask is 0: the byte becomes 0)',
        net: 'The network address is {net}: the IP with its host bits set to 0.',
        bc: 'Broadcast: the network with its {h} host bits set to 1 = {bc}. A packet sent here reaches every host on the network.',
        hosts: 'There are {h} host bits: 2^{h} = {tot} addresses, minus the network and the broadcast ones = {hosts} hosts, from {first} to {last}.',
        hosts31: 'With /31 there are 2 addresses and both are used on a point-to-point link (no separate network or broadcast).',
        hosts32: 'With /32 the “network” is a single address: this host.',
        cls: 'Its first bits make it class {c}{p}.', priv: ' and it is a private address ({r}): it does not reach the Internet as it is', pub: ' and it is public',
        isNet: ' Careful: {ip} is exactly the network address, it cannot be given to a host.', isBc: ' Careful: {ip} is exactly the broadcast address, it cannot be given to a host.'
      },
      results: 'results', r: { ip: 'address', mask: 'mask', net: 'network', bc: 'broadcast', first: 'first host', last: 'last host', hosts: 'hosts', cls: 'class', kind: 'type' },
      xr: { net: 'IP AND mask', bc: 'network with host bits at 1', first: 'network + 1', last: 'broadcast − 1', hosts: '2^{h} − 2' },
      kind: { priv: 'private ({r})', pub: 'public', loop: 'loopback (127.0.0.0/8)' },
      cmp: 'same network?', cmpL: 'Another IP', cmpPh: '10.110.7.200',
      same: '<b>{b}</b> AND {m} = <b>{nb}</b> = the same network → <span class="ok">direct delivery</span>: the host asks for its MAC with ARP and sends it without going through the router.',
      diff: '<b>{b}</b> AND {m} = <b>{nb}</b> ≠ {net} → <span class="ko">another network</span>: the packet goes to the default gateway (the router), which decides where it goes next.',
      cmpBad: 'Type another IP to compare (four numbers from 0 to 255).',
      rules: 'The network comes from a bitwise AND between the IP and the mask: where the mask has a 1, the IP bit gets through; where it has a 0, it becomes 0. The class (A, B, C, D or E) is read from the first bits, as in the course notes, but networks today are written with /n (CIDR).',
      gDesc: 'Bitwise AND of {ip} with the mask {m}: network {net}, broadcast {bc}.',
      reto: 'Challenge: work out the network yourself', retoLead: 'Here is an IP with its prefix. Do the AND on paper and fill in the boxes.', retoF: { net: 'network', bc: 'broadcast', first: 'first host', last: 'last host', hosts: 'number of hosts' },
      allOk: 'All correct. That is exactly how the exam goes.', someBad: 'Check the boxes in red: the most common mistake is forgetting to subtract the network and broadcast addresses.', got: '{a} of {n} right'
    }
  };
  var b8 = function (x) { return ('00000000' + (x >>> 0).toString(2)).slice(-8); };
  function init(el) {
    var K = K6.mount(el, ''), t = TX[K.lang], L = K.lang;
    K.title = t.title;
    var S = { q: '10.110.7.24/24', b: '10.110.7.200' }, R = null, last = null;
    (function () { var s = K6.hashState() || K6.store('sl_sim_subredes'); if (!s) return; try { var o = {}; s.split(';').forEach(function (p) { var i = p.indexOf('='); o[p.slice(0, i)] = p.slice(i + 1); }); if (SLSubred(o.q).ok) { S.q = o.q; S.b = o.b || ''; } } catch (e) {} })();
    var enc = function () { return 'q=' + S.q + ';b=' + S.b; };
    var ctl = '<div class="sl6-ctl"><div class="sl6-sn-in"><label class="sl6-lbl" for="' + K.id + '-q" style="margin:0">' + esc(t.inL) + '</label><input type="text" id="' + K.id + '-q" class="sl6-wide" spellcheck="false" autocomplete="off" inputmode="decimal" placeholder="' + esc(t.inPh) + '"></div>'
      + '<div class="sl6-q"><span>' + esc(t.nL) + '</span><button type="button" data-a="n-" aria-label="−1">−</button><input type="number" min="0" max="32" inputmode="numeric" aria-label="' + esc(t.nL) + '"><button type="button" data-a="n+" aria-label="+1">+</button></div>'
      + '<div class="sl6-ctl__r"><button type="button" class="sl6-btn sl6-btn--g" data-a="ex">' + ico('file', 16) + esc(t.ex) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-a="rnd">' + ico('dice', 16) + esc(t.rnd) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-a="share">' + ico('link', 16) + '<span>' + esc(t.share) + '</span></button></div></div>';
    var body = ctl + '<p class="sl6-desc">' + esc(t.inHelp) + '</p><p class="sl6-sn-err" role="alert"></p>'
      + '<section class="sl6-pan sl6-pan--gantt"><h3 class="sl6-h">── ' + esc(t.bits) + '</h3><div class="sl6-sn-bits"></div><p class="sl6-sn-leg"><span><i style="background:rgba(91,75,219,.4)"></i>' + esc(t.legN) + '</span><span><i style="background:rgba(255,107,74,.28)"></i>' + esc(t.legH) + '</span></p></section>'
      + '<div class="sl6-top"><section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.steps) + '</h3>' + K6.toolsHTML(K) + '<ol class="sl6-log" aria-live="polite"></ol></section>'
      + '<section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.results) + '</h3><div class="sl6-res"></div></section></div>'
      + '<section class="sl6-pan sl6-pan--gantt"><h3 class="sl6-h">── ' + esc(t.cmp) + '</h3><div class="sl6-sn-cmpf"><label class="sl6-lbl" for="' + K.id + '-b" style="margin:0">' + esc(t.cmpL) + '</label><input type="text" id="' + K.id + '-b" class="sl6-wide" spellcheck="false" autocomplete="off" inputmode="decimal" placeholder="' + esc(t.cmpPh) + '"></div><p class="sl6-sn-same" aria-live="polite"></p></section>'
      + '<p class="sl6-rules">' + esc(t.rules) + '</p>';
    el.innerHTML = K6.winHTML(K, t.ps, body) + K6.tryHTML(K);
    K6.themeBtn(K);
    var q = K.q, inp = q('#' + K.id + '-q'), nIn = q('.sl6-q input'), bIn = q('#' + K.id + '-b'), log = q('.sl6-log');
    var STEPS = [];
    function steps() {
      var e = t.e, a = [];
      a.push({ k: 'ip', x: fill(e.ip, { ip: '<b>' + str(R.ip) + '</b>', bin: R.bytes.map(function (y) { return b8(y.ip); }).join('.') }) });
      a.push({ k: 'mask', x: fill(e.mask, { n: R.n, h: R.h, m: '<b>' + str(R.mask) + '</b>' }) });
      R.bytes.forEach(function (y, i) {
        var mix = y.mixed ? fill(e.mix, { ab: b8(y.ip), bb: b8(y.mk), rb: b8(y.net) }) : y.mk === 255 ? e.full : e.zero;
        a.push({ k: 'and', i: i, x: fill(e.and, { k: i + 1, a: y.ip, b: y.mk, r: '<b>' + y.net + '</b>', mix: mix }) + (i === 3 ? '<br>' + fill(e.net, { net: '<b>' + str(R.net) + '</b>' }) : '') });
      });
      a.push({ k: 'bc', x: fill(e.bc, { h: R.h, bc: '<b>' + str(R.bc) + '</b>' }) });
      a.push({ k: 'hosts', x: R.h >= 2 ? fill(e.hosts, { h: R.h, tot: R.total, hosts: '<b>' + R.hosts + '</b>', first: str(R.first), last: str(R.last) }) : R.h === 1 ? e.hosts31 : e.hosts32 });
      var p = R.priv === 'loop' ? '' : R.priv ? fill(e.priv, { r: R.priv }) : e.pub;
      a.push({ k: 'cls', x: fill(e.cls, { c: R.cls, p: p }) + (R.isNet ? fill(e.isNet, { ip: str(R.ip) }) : R.isBc ? fill(e.isBc, { ip: str(R.ip) }) : '') });
      return a;
    }
    function svg() {
      var box = q('.sl6-sn-bits'), w = Math.max(280, box.clientWidth || 640), narrow = w < 600;
      var lw = narrow ? 74 : 112, per = narrow ? 2 : 4, gap = narrow ? 8 : 12;
      var bw = Math.max(narrow ? 15 : 14, Math.min(24, Math.floor((w - lw - 8 - gap * (per - 1)) / (per * 8)))), ch = narrow ? 22 : 24, dh = 17, rh = ch + dh + 6;
      var blocks = 4 / per, BH = 14 + 4 * rh + 8, W = lw + per * 8 * bw + gap * (per - 1) + 8, H = blocks * BH, id = K.id;
      var g = '<svg class="sn sl6-sn-g" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-labelledby="' + id + '-st"><title id="' + id + '-st">' + esc(fill(t.gDesc, { ip: str(R.ip), m: str(R.mask), net: str(R.net), bc: str(R.bc) })) + '</title>';
      var vals = [R.bytes.map(function (y) { return y.ip; }), R.bytes.map(function (y) { return y.mk; }), R.bytes.map(function (y) { return y.net; }), R.bytes.map(function (y) { return y.bc; })];
      for (var bl = 0; bl < blocks; bl++) {
        var oy = bl * BH;
        for (var j = 0; j < per; j++) { var byte = bl * per + j, x0 = lw + j * (8 * bw + gap); g += '<text class="sl6-sn-k" x="' + (x0 + 4 * bw) + '" y="' + (oy + 10) + '" text-anchor="middle">byte ' + (byte + 1) + '</text>'; }
        for (var r = 0; r < 4; r++) {
          var y0 = oy + 14 + r * rh;
          g += '<g class="sl6-sn-row" data-r="' + r + '"><text class="sl6-sn-lab' + (r ? ' sl6-sn-lab--2' : '') + '" x="' + (lw - 10) + '" y="' + (y0 + ch / 2 + 4) + '" text-anchor="end">' + esc(t.rows[r]) + '</text>';
          for (j = 0; j < per; j++) {
            byte = bl * per + j; x0 = lw + j * (8 * bw + gap);
            var v = vals[r][byte], bits = b8(v);
            g += '<g class="sl6-sn-byte" data-b="' + byte + '" data-r="' + r + '">';
            for (var k = 0; k < 8; k++) {
              var gi = byte * 8 + k, c = gi < R.n ? 'n' : 'h';
              g += '<rect class="sl6-sn-b ' + c + '" x="' + (x0 + k * bw) + '" y="' + y0 + '" width="' + bw + '" height="' + ch + '"' + (k === 0 ? ' rx="0"' : '') + '/><text class="sl6-sn-t' + (bits[k] === '0' ? ' z' : '') + '" x="' + (x0 + k * bw + bw / 2) + '" y="' + (y0 + ch / 2 + 4) + '" text-anchor="middle">' + bits[k] + '</text>';
            }
            g += '<text class="sl6-sn-dec" x="' + (x0 + 4 * bw) + '" y="' + (y0 + ch + dh - 3) + '" text-anchor="middle">' + v + '</text></g>';
          }
          g += '</g>';
        }
        // corte en /n
        var bIn = Math.floor(R.n / 8), kIn = R.n % 8;
        if (R.n > 0 && R.n < 32) {
          var byteC = kIn === 0 ? bIn - 1 : bIn, kk = kIn === 0 ? 8 : kIn;
          if (Math.floor(byteC / per) === bl) {
            var xc = lw + (byteC % per) * (8 * bw + gap) + kk * bw + (kIn === 0 && byteC % per < per - 1 ? gap / 2 : 0);
            g += '<line class="sl6-sn-cut" x1="' + xc + '" x2="' + xc + '" y1="' + (oy + 12) + '" y2="' + (oy + 14 + 4 * rh - 4) + '"/><text class="sl6-sn-cutl" x="' + (xc + 5) + '" y="' + (oy + 14 + 4 * rh - 6) + '">/' + R.n + '</text>';
          }
        }
        g += '<rect class="sl6-sn-hl" data-bl="' + bl + '" x="0" y="' + (oy + 11) + '" width="' + (8 * bw + 6) + '" height="' + (3 * rh + 4) + '" rx="6" style="opacity:0"/>';
      }
      g += '</svg>';
      box.innerHTML = g; K.geo = { lw: lw, per: per, bw: bw, gap: gap };
    }
    function results() {
      var r = t.r, x = t.xr, kind = R.priv === 'loop' ? t.kind.loop : R.priv ? fill(t.kind.priv, { r: R.priv }) : t.kind.pub;
      var row = function (a, b, c) { return '<tr><th scope="row">' + esc(a) + '</th><td class="sl6-sn-v">' + b + '</td><td class="sl6-sn-x">' + esc(c || '') + '</td></tr>'; };
      q('.sl6-res').innerHTML = '<table class="sl6-tbl2"><tbody>' + row(r.ip, str(R.ip)) + row(r.mask, str(R.mask) + ' /' + R.n) + row(r.net, str(R.net), x.net) + row(r.bc, str(R.bc), x.bc) + row(r.first, str(R.first), R.h >= 2 ? x.first : '') + row(r.last, str(R.last), R.h >= 2 ? x.last : '') + row(r.hosts, R.hosts, R.h >= 2 ? fill(x.hosts, { h: R.h }) : '') + row(r.cls, R.cls) + row(r.kind, esc(kind)) + '</tbody></table>';
    }
    function compare() {
      var o = q('.sl6-sn-same'), v = bIn.value.trim(); S.b = v;
      if (!v) { o.innerHTML = esc(t.cmpBad); return; }
      var c = SLSubred(S.q, v).cmp;
      if (!c || !c.ok) { o.innerHTML = esc(t.cmpBad); return; }
      o.innerHTML = fill(c.same ? t.same : t.diff, { b: str(c.ip), m: str(R.mask), nb: str(c.net), net: str(R.net) });
    }
    function draw(k, going) {
      var s = going ? STEPS[k] : null, vis = function (r, b) { // ¿se ve la fila r (byte b) en el paso k?
        if (!going) return true;
        if (r === 0) return true; if (r === 1) return k >= 1; if (r === 2) return k >= 2 + b; return k >= 6;
      };
      [].forEach.call(K.qa('.sl6-sn-byte'), function (g) { g.classList.toggle('is-fut', !vis(+g.getAttribute('data-r'), +g.getAttribute('data-b'))); });
      [].forEach.call(K.qa('.sl6-sn-row'), function (g) { var r = +g.getAttribute('data-r'); g.querySelector('text').style.opacity = vis(r, 0) ? 1 : 0; });
      [].forEach.call(K.qa('.sl6-sn-hl'), function (h) { h.style.opacity = 0; });
      if (s && s.k === 'and') {
        var G = K.geo, bl = Math.floor(s.i / G.per), hl = K.q('.sl6-sn-hl[data-bl="' + bl + '"]');
        if (hl) { hl.setAttribute('x', G.lw + (s.i % G.per) * (8 * G.bw + G.gap) - 3); hl.style.opacity = 1; }
      }
      [].forEach.call(log.children, function (li) { var d = li.getAttribute('data-k'); if (d == null) { li.hidden = going; return; } d = +d; li.hidden = !going || d > k; li.classList.toggle('is-cur', going && d === k); });
      var cur = log.querySelector('.is-cur'); if (cur) log.scrollTop = cur.offsetTop - log.clientHeight + cur.offsetHeight + 8;
    }
    K.N = function () { return STEPS.length; }; K.draw = draw;
    var P = K6.player(K);
    function update(fromInput) {
      var r = SLSubred(S.q), err = q('.sl6-sn-err');
      if (!r.ok) {
        err.textContent = fill(t.err[r.err] || t.err.format, { b: r.mask != null ? [r.mask >>> 24, (r.mask >>> 16) & 255, (r.mask >>> 8) & 255, r.mask & 255].map(b8).join('.') : '' });
        inp.classList.add('is-bad'); inp.setAttribute('aria-invalid', 'true'); return;
      }
      err.textContent = ''; inp.classList.remove('is-bad'); inp.setAttribute('aria-invalid', 'false');
      P.stop(); R = r; last = S.q;
      if (!fromInput) inp.value = S.q;
      nIn.value = R.n;
      var form = /\//.test(S.q) ? str(R.ip) + '/' + R.n : str(R.ip) + ' ' + str(R.mask);
      q('.sl6-cmdl').innerHTML = esc(t.cmd) + ' <b>' + esc(form) + '</b>';
      var st = enc(); K6.store('sl_sim_subredes', st); K6.keepHash(st);
      STEPS = steps();
      log.innerHTML = STEPS.map(function (s, j) { return '<li data-k="' + j + '" hidden><span class="sl6-log__t">' + (j + 1) + '</span><span class="sl6-log__x">' + s.x + '</span></li>'; }).join('') + '<li class="sl6-log__0">' + esc(t.start) + '</li>';
      svg(); results(); compare(); P.reset();
    }
    function setN(n) { n = Math.max(0, Math.min(32, n)); S.q = str(R.ip) + '/' + n; update(); }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || !el.contains(b) || b.closest('.sl6-reto')) return;
      var a = b.getAttribute('data-a');
      if (a === 'theme') K6.toggleTheme(K);
      else if (a === 'n-' || a === 'n+') setN(R.n + (a === 'n+' ? 1 : -1));
      else if (a === 'ex') { S.q = '10.110.7.24/24'; S.b = '10.110.7.200'; bIn.value = S.b; update(); }
      else if (a === 'rnd') { var x = rndCase(); S.q = x.q; update(); }
      else if (a === 'share') K6.share(K, b, enc());
    });
    inp.addEventListener('input', function () { S.q = inp.value.trim(); update(true); });
    inp.addEventListener('blur', function () { if (R && !SLSubred(inp.value).ok) { S.q = last; inp.value = last; update(); } });
    nIn.addEventListener('change', function () { setN(Math.round(+nIn.value) || 0); });
    bIn.addEventListener('input', function () { compare(); var st = enc(); K6.store('sl_sim_subredes', st); K6.keepHash(st); });
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { if (R) { svg(); P.draw(); } }, 150); });
    function rndCase() {
      var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; }, r = Math.random, f = function () { return Math.floor(r() * 256); };
      var ip = pick([function () { return '10.' + f() + '.' + f() + '.' + f(); }, function () { return '172.' + (16 + Math.floor(r() * 16)) + '.' + f() + '.' + f(); }, function () { return '192.168.' + f() + '.' + f(); }, function () { return (1 + Math.floor(r() * 222)) + '.' + f() + '.' + f() + '.' + f(); }])();
      return { q: ip + '/' + pick([8, 16, 20, 22, 23, 24, 24, 25, 26, 27, 28, 29, 30]) };
    }
    // ---------------------------------------------------------------- reto
    var box = q('.sl6-reto'), RT = null, F = ['net', 'bc', 'first', 'last', 'hosts'];
    function reto() {
      var c; do { c = SLSubred(rndCase().q); } while (c.h < 2 || c.isNet || c.isBc);
      RT = c;
      var h = '<h3 class="sl6-reto__h">' + esc(t.reto) + '</h3><p class="sl6-reto__lead">' + esc(t.retoLead) + '</p><p class="sl6-cmd sl6-cmd--s"><span class="sl6-ps">$</span> <code>' + esc(t.cmd) + ' <b>' + str(c.ip) + '/' + c.n + '</b></code></p><div class="sl6-reto__w sl6-sn-reto"><table><tbody>';
      F.forEach(function (k) { h += '<tr><th scope="row">' + esc(t.retoF[k]) + '</th><td><input type="text" inputmode="decimal" data-k="' + k + '" aria-label="' + esc(t.retoF[k]) + '" spellcheck="false" autocomplete="off"></td></tr>'; });
      h += '</tbody></table></div><div class="sl6-reto__act"><button type="button" class="sl6-btn sl6-btn--p" data-r="check">' + ico('check', 16) + esc(K.t.check) + '</button><button type="button" class="sl6-btn" data-r="sol">' + esc(K.t.sol) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-r="new">' + ico('dice', 16) + esc(K.t.retoNew) + '</button></div><p class="sl6-reto__msg" aria-live="polite"></p>';
      box.innerHTML = h;
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var a = b.getAttribute('data-r');
      if (a === 'new') reto();
      else if (a === 'check') {
        var good = 0;
        [].forEach.call(box.querySelectorAll('input'), function (x) {
          var k = x.getAttribute('data-k'), v = x.value.trim().replace(/\s+/g, ''), ok;
          if (k === 'hosts') ok = /^\d+$/.test(v.replace(/[.,]/g, '')) && +v.replace(/[.,]/g, '') === RT.hosts;
          else { var p = SLSubred.parseIP(v); ok = p !== null && p === RT[k]; }
          x.classList.toggle('is-ok', ok); x.classList.toggle('is-bad', !ok); if (ok) good++;
        });
        box.querySelector('.sl6-reto__msg').innerHTML = '<b>' + esc(fill(t.got, { a: good, n: F.length })) + '.</b> ' + esc(good === F.length ? t.allOk : t.someBad);
      } else if (a === 'sol') { S.q = str(RT.ip) + '/' + RT.n; update(); q('.sl6-win').scrollIntoView({ behavior: K6.reduced ? 'auto' : 'smooth', block: 'start' }); setTimeout(P.run, K6.reduced ? 0 : 500); }
    });
    bIn.value = S.b;
    update(); reto();
  }
  K6.boot('.sl-sim[data-sim="subredes"]', init);
})();
