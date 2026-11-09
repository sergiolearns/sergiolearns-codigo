/* SergioLearns — visualizador de algoritmos: motor (window.SLAlg).
 * El programa del lector lo ejecuta CPython de verdad (Pyodide 314.0.7, la versión del entorno de Python) en un worker,
 * trazado con sys.settrace por arnes.py: cada paso trae la línea, la pila, las listas y las comparaciones.
 * __PY_ARNES__ y __EJEMPLOS__ los rellena build.py. */
(function (G) {
  'use strict';
  if (G.SLAlg) return;
  var BASE = G.SLALG_BASE || 'https://cdn.jsdelivr.net/npm/pyodide@314.0.7/';
  var ARNES = __PY_ARNES__;
  var WK = [
    "var py=null;",
    "self.onmessage=async function(e){var m=e.data;",
    " if(m.cmd==='init'){try{var mod=await import(m.base+'pyodide.mjs');py=await mod.loadPyodide({indexURL:m.base});py.runPython(m.code);postMessage({type:'ready'});}catch(x){postMessage({type:'fail',s:String(x)});}return;}",
    " try{var r=py.globals.get('sl_traza')(m.q);postMessage({type:'res',id:m.id,r:r});}catch(x){postMessage({type:'res',id:m.id,crash:String(x)});}};"
  ].join('\n');
  var P = { w: null, ready: null, seq: 0, pend: null };
  function start() {
    if (P.ready) return P.ready;
    var w;
    try { w = new Worker(URL.createObjectURL(new Blob([WK], { type: 'text/javascript' })), { type: 'module' }); }
    catch (e) { return Promise.reject(e); }
    P.w = w;
    P.ready = new Promise(function (ok, ko) {
      var t = setTimeout(function () { kill(); ko(new Error('timeout')); }, 120000);
      w.onmessage = function (e) {
        var d = e.data;
        if (d.type === 'ready') { clearTimeout(t); ok(); }
        else if (d.type === 'fail') { clearTimeout(t); kill(); ko(new Error(d.s)); }
        else if (d.type === 'res' && P.pend && P.pend.id === d.id) { var p = P.pend; P.pend = null; p.done(d); }
      };
      w.onerror = function (e) { clearTimeout(t); kill(); ko(new Error(e.message || 'worker')); if (e.preventDefault) e.preventDefault(); };
      w.postMessage({ cmd: 'init', base: SLAlg.base, code: ARNES });
    });
    return P.ready;
  }
  function kill() { try { if (P.w) P.w.terminate(); } catch (e) {} P.w = null; P.ready = null; if (P.pend) { var p = P.pend; P.pend = null; p.done({ stopped: true }); } }
  // resuelve {r} | {timeout} | {crash} | {fail}. Las ejecuciones van en cola (el reto y el simulador comparten el worker).
  var Q = Promise.resolve();
  function run1(code, max, limit) {
    return start().then(function () {
      return new Promise(function (ok) {
        var id = ++P.seq, timer = setTimeout(function () { P.pend = null; kill(); ok({ timeout: true }); }, (limit || 8) * 1000);
        P.pend = { id: id, done: function (d) { clearTimeout(timer); if (d.stopped) ok({ stopped: true }); else if (d.crash) ok({ crash: d.crash }); else { try { ok({ r: JSON.parse(d.r) }); } catch (x) { ok({ crash: String(x) }); } } } };
        P.w.postMessage({ id: id, q: JSON.stringify({ code: code, max: max || 4000 }) });
      });
    }, function (e) { return { fail: String(e && e.message || e) }; });
  }
  function run(code, max, limit) { var p = Q.then(function () { return run1(code, max, limit); }); Q = p.then(function () {}, function () {}); return p; }
  var SLAlg = G.SLAlg = { base: BASE, run: run, start: start, ej: __EJEMPLOS__ };
})(typeof window !== 'undefined' ? window : this);
