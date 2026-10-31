/* SergioLearns — calculadora de notas («¿Cuánto necesito?»), motor.
   Criterios de las guías docentes 2026/27 (04-herramientas/calculadora/notas.yaml).
   NO OFICIAL. Sin dependencias; también funciona como módulo de Node. */
(function (root) {
  'use strict';
  var r2 = function (x) { return Math.round(x * 100) / 100; };
  var tr2 = function (x) { return Math.floor(x * 100 + 1e-6) / 100; };

  // Cada asignatura: convocatorias, campos (por convocatoria) y fórmula.
  // fin(v, conv) -> { final, raw, ok, notas: [[codigo, ...params]] }
  var A = {
    fp1: {
      conv: ['ord', 'ext', 'esp'],
      campos: function () {
        return [
          { id: 'a', peso: 0.10, min: 4 },
          { id: 'b', peso: 0.65, min: 5 },
          { id: 'l', peso: 0.25 }
        ];
      },
      fin: function (v) {
        var notas = [], raw = 0.10 * v.a + 0.65 * v.b + 0.25 * v.l;
        var ok = v.a >= 4 && v.b >= 5;
        if (ok) { notas.push(['min_ok']); return { final: raw, raw: raw, ok: true, notas: notas }; }
        if (v.a < 4) notas.push(['min_no', 'a', 4]);
        if (v.b < 5) notas.push(['min_no', 'b', 5]);
        var sin = 0.10 * v.a + 0.65 * v.b;
        notas.push(['fp1_sin_l', r2(sin)]);
        return { final: Math.min(4, sin), raw: raw, ok: false, notas: notas };
      }
    },
    fp2: {
      conv: ['ord', 'ext', 'esp'],
      campos: function () {
        return [
          { id: 'a', peso: 0.20, min: 5 },
          { id: 'b', peso: 0.55, min: 5 },
          { id: 'l', peso: 0.25, min: 5, minOrd: true }
        ];
      },
      fin: function (v, conv) {
        var notas = [], l = v.l;
        if (conv === 'ord' && l < 5) { l = 0; notas.push(['fp2_l0']); }
        var raw = 0.20 * v.a + 0.55 * v.b + 0.25 * l;
        var ok = v.a >= 5 && v.b >= 5;
        if (!ok) {
          if (v.a < 5) notas.push(['min_no', 'a', 5]);
          if (v.b < 5) notas.push(['min_no', 'b', 5]);
          notas.push(['max4']);
          return { final: Math.min(4, raw), raw: raw, ok: false, notas: notas };
        }
        notas.push(['min_ok']);
        var fe01 = (0.20 * v.a + 0.55 * v.b) / 0.75, fin = raw;
        if (fe01 > 6.5 && raw < 5) { fin = 5; notas.push(['fp2_rescate', r2(fe01)]); }
        return { final: fin, raw: raw, ok: true, notas: notas };
      }
    },
    ic1: {
      conv: ['ord', 'ext', 'esp'],
      campos: function (conv) {
        if (conv === 'esp') return [{ id: 't', peso: 0.6, min: 5 }, { id: 'p', peso: 0.4, min: 5 }];
        return [{ id: 't', peso: 0.5, min: 5 }, { id: 'p', peso: 0.4, min: 5 }, { id: 'c', peso: 0.1 }];
      },
      fin: function (v, conv) {
        var notas = [];
        var raw = conv === 'esp' ? 0.6 * v.t + 0.4 * v.p : 0.5 * v.t + 0.4 * v.p + 0.1 * v.c;
        var ok = v.t >= 5 && v.p >= 5;
        if (ok) { notas.push(['min_ok']); return { final: raw, raw: raw, ok: true, notas: notas }; }
        if (v.t < 5) notas.push(['min_no', 't', 5]);
        if (v.p < 5) notas.push(['min_no', 'p', 5]);
        notas.push(['max4']);
        if (conv === 'ord' && v.t >= 5 && v.p < 5) notas.push(['ic1_guarda']);
        return { final: Math.min(4, raw), raw: raw, ok: false, notas: notas };
      }
    },
    ic2: {
      conv: ['ord', 'ext'],
      campos: function (conv, modo) {
        var nt = (modo === 'parciales' && conv === 'ord')
          ? [{ id: 'p1', peso: 0.35 * 0.4, parte: 'nt' }, { id: 'p2', peso: 0.35 * 0.6, parte: 'nt' }]
          : [{ id: 'nt', peso: 0.35, min: 5 }];
        return nt.concat([{ id: 'np', peso: 0.35, min: 5 }, { id: 'ntp', peso: 0.20 }, { id: 'ntpa', peso: 0.10 }]);
      },
      fin: function (v) {
        var notas = [];
        var nt = (v.nt !== undefined) ? v.nt : 0.4 * v.p1 + 0.6 * v.p2;
        if (v.nt === undefined) notas.push(['ic2_nt', r2(nt)]);
        var raw = 0.35 * nt + 0.35 * v.np + 0.20 * v.ntp + 0.10 * v.ntpa;
        if (nt >= 5 && v.np >= 5) { notas.push(['min_ok']); return { final: raw, raw: raw, ok: true, notas: notas, nt: nt }; }
        var fin;
        if (nt < 5 && v.np < 5) { fin = Math.min(nt, v.np); notas.push(['ic2_dos', r2(fin)]); }
        else if (nt < 5) { fin = nt; notas.push(['ic2_una', 'nt', r2(nt)]); }
        else { fin = v.np; notas.push(['ic2_una', 'np', r2(v.np)]); }
        return { final: fin, raw: raw, ok: false, notas: notas, nt: nt };
      }
    }
  };

  /* Nota final con todo relleno. vals: {id: número 0-10}. */
  function evalua(asig, conv, modo, vals) {
    var s = A[asig], cs = s.campos(conv, modo), v = {};
    cs.forEach(function (c) { v[c.id] = +vals[c.id]; });
    var r = s.fin(v, conv);
    r.exacta = Math.max(0, Math.min(10, r.final));
    r.final = tr2(r.exacta);   // se enseña truncada: nunca sube un 4,996 a 5,00
    r.raw = tr2(r.raw);
    return r;
  }

  /* Lo que hace falta: los campos pendientes (vals[id] === null/'' ) llevan todos la misma nota x.
     Devuelve { estado: 'completo'|'necesitas'|'asegurado'|'imposible', x, res, resMax }. */
  function necesita(asig, conv, modo, vals, objetivo) {
    var s = A[asig], cs = s.campos(conv, modo), pend = [];
    cs.forEach(function (c) { var x = vals[c.id]; if (x === null || x === undefined || x === '' || isNaN(+x)) pend.push(c.id); });
    if (!pend.length) return { estado: 'completo', pend: pend, res: evalua(asig, conv, modo, vals) };
    var conX = function (x) { var w = {}; cs.forEach(function (c) { w[c.id] = pend.indexOf(c.id) >= 0 ? x : +vals[c.id]; }); return evalua(asig, conv, modo, w); };
    var resMax = conX(10);
    if (resMax.exacta < objetivo - 1e-9) return { estado: 'imposible', pend: pend, res: resMax, resMax: resMax };
    if (conX(0).exacta >= objetivo - 1e-9) return { estado: 'asegurado', pend: pend, x: 0, res: conX(0) };
    for (var k = 1; k <= 1000; k++) {
      var x = k / 100, r = conX(x);
      if (r.exacta >= objetivo - 1e-9) return { estado: 'necesitas', pend: pend, x: x, res: r };
    }
    return { estado: 'imposible', pend: pend, res: resMax, resMax: resMax };
  }

  var api = { asignaturas: A, evalua: evalua, necesita: necesita, r2: r2 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.SLNotas = api;
})(this);
