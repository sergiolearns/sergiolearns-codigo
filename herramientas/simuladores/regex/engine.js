/* SergioLearns — probador de expresiones regulares: motores de verdad (window.SLRx).
 * Python: Pyodide (CPython 3.14, módulo re) en un worker de tipo módulo, con el arnés de arnes.py.
 * Java: javac + TeaVM (@live-codes/java-wasm 0.1.0) con el java.util.regex de OpenJDK 21 (SlRegex.java, va comprimido
 * en SL_RX_JAVA_GZ) y el arnés Arnes.java. Las versiones son las del entorno de programación (fragmento 16).
 * Las tres piezas marcadas (arnés de Python, arnés de Java y SlRegex comprimido) las rellena build.py. */
(function (G) {
  'use strict';
  if (G.SLRx) return;
  var BASE = {
    py: 'https://cdn.jsdelivr.net/npm/pyodide@314.0.7/',
    java: 'https://cdn.jsdelivr.net/npm/@live-codes/java-wasm@0.1.0/dist/'
  };
  var PY_ARNES = __PY_ARNES__;
  var JAVA_ARNES = __JAVA_ARNES__;
  var JAVA_GZ = __JAVA_GZ__;   // SlRegex.java, gzip + base64

  /* ---------- Python ---------- */
  var PY_WORKER = [
    "var py=null;",
    "self.onmessage=async function(e){var m=e.data;",
    " if(m.cmd==='init'){try{var mod=await import(m.base+'pyodide.mjs');py=await mod.loadPyodide({indexURL:m.base});py.runPython(m.code);postMessage({type:'ready'});}catch(x){postMessage({type:'fail',s:String(x)});}return;}",
    " try{var r=py.globals.get('sl_regex_json')(m.q);postMessage({type:'res',id:m.id,r:r});}catch(x){postMessage({type:'res',id:m.id,crash:String(x)});}};"
  ].join('\n');
  var PY = { w: null, ready: null, seq: 0, pend: null };
  function pyStart() {
    if (PY.ready) return PY.ready;
    var w;
    try { w = new Worker(URL.createObjectURL(new Blob([PY_WORKER], { type: 'text/javascript' })), { type: 'module' }); }
    catch (e) { return Promise.reject(e); }
    PY.w = w;
    PY.ready = new Promise(function (ok, ko) {
      var t = setTimeout(function () { pyKill(); ko(new Error('timeout')); }, 120000);
      w.onmessage = function (e) {
        var d = e.data;
        if (d.type === 'ready') { clearTimeout(t); ok(); }
        else if (d.type === 'fail') { clearTimeout(t); pyKill(); ko(new Error(d.s)); }
        else if (d.type === 'res' && PY.pend && PY.pend.id === d.id) { var p = PY.pend; PY.pend = null; p.done(d); }
      };
      w.onerror = function (e) { clearTimeout(t); pyKill(); ko(new Error(e.message || 'worker')); if (e.preventDefault) e.preventDefault(); };
      w.postMessage({ cmd: 'init', base: BASE.py, code: PY_ARNES });
    });
    return PY.ready;
  }
  function pyKill() { try { if (PY.w) PY.w.terminate(); } catch (e) {} PY.w = null; PY.ready = null; if (PY.pend) { var p = PY.pend; PY.pend = null; p.done({ stopped: true }); } }
  // q = {re, flags:[...], rep|null, text, retos:[...]}; resuelve {r} | {timeout} | {crash} | {fail}
  function runPy(q, limit) {
    return pyStart().then(function () {
      return new Promise(function (ok) {
        if (PY.pend) { var old = PY.pend; PY.pend = null; old.done({ stopped: true }); }
        var id = ++PY.seq, timer = setTimeout(function () { PY.pend = null; pyKill(); ok({ timeout: true }); }, (limit || 6) * 1000);
        PY.pend = { id: id, done: function (d) { clearTimeout(timer); if (d.stopped) ok({ stopped: true }); else if (d.crash) ok({ crash: d.crash }); else { try { ok({ r: JSON.parse(d.r) }); } catch (x) { ok({ crash: String(x) }); } } } };
        PY.w.postMessage({ id: id, q: JSON.stringify(q) });
      });
    }, function (e) { return { fail: String(e && e.message || e) }; });
  }

  /* ---------- Java ---------- */
  var JV = { rt: null, p: null, src: null, busy: null };
  function b64bytes(s) { var bin = atob(s), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }
  function javaSrc() {
    if (JV.src) return JV.src;
    JV.src = new Response(new Blob([b64bytes(JAVA_GZ)]).stream().pipeThrough(new DecompressionStream('gzip'))).text().then(function (sl) {
      var imp = {}, body = [];
      (sl + '\n' + JAVA_ARNES).split('\n').forEach(function (l) { if (/^import\s/.test(l)) imp[l.trim()] = 1; });
      var strip = function (s) { return s.split('\n').filter(function (l) { return !/^import\s/.test(l); }).join('\n'); };
      return Object.keys(imp).join('\n') + '\n' + strip(sl) + '\n' + strip(JAVA_ARNES);
    });
    return JV.src;
  }
  function javaRuntime(onp) {
    if (JV.rt) return Promise.resolve(JV.rt);
    if (!JV.p) JV.p = new Promise(function (ok, ko) {
      var t = setTimeout(function () { JV.p = null; ko(new Error('timeout')); }, 120000);
      var go = function () { G.JavaWasm.createRuntime({ baseUrl: BASE.java, onProgress: onp }).then(function (r) { clearTimeout(t); JV.rt = r; JV.p = null; ok(r); }, function (e) { clearTimeout(t); JV.p = null; ko(e); }); };
      if (G.JavaWasm) return go();
      var s = document.createElement('script'); s.src = BASE.java + 'java-wasm.iife.js';
      s.onload = function () { if (G.JavaWasm) go(); else { clearTimeout(t); JV.p = null; ko(new Error('java-wasm')); } };
      s.onerror = function () { clearTimeout(t); JV.p = null; ko(new Error('java-wasm')); };
      document.head.appendChild(s);
    });
    return JV.p;
  }
  function javaKill() { try { if (JV.rt) JV.rt.destroy(); } catch (e) {} JV.rt = null; }
  function b64(s) { var u = new TextEncoder().encode(s), bin = ''; for (var i = 0; i < u.length; i++) bin += String.fromCharCode(u[i]); return btoa(bin); }
  // q = {re, flags:número, rep|null, text, retos:[...]}; una ejecución hace todo (compilar es lo caro)
  function runJava(q, limit, onp) {
    var input = [b64(q.re), b64(String(q.flags || 0)), q.rep == null ? '-' : b64(q.rep), b64(q.text)].concat((q.retos || []).map(b64)).join('\n') + '\n';
    var job = Promise.all([javaRuntime(onp), javaSrc()]).then(function (a) {
      var rt = a[0], src = a[1];
      return new Promise(function (ok) {
        var done = false, end = function (r) { if (done) return; done = true; clearTimeout(timer); ok(r); };
        var timer = setTimeout(function () { javaKill(); end({ timeout: true }); }, (limit || 25) * 1000);
        JV.busy = { stop: function () { javaKill(); end({ stopped: true }); } };
        rt.run(src, { input: input }).then(function (r) {
          JV.busy = null;
          var out = String(r && r.stdout || '').trim();
          if (r && r.ok && out) { try { end({ r: JSON.parse(out.split('\n').pop()) }); } catch (x) { end({ crash: out.slice(0, 400) }); } }
          else end({ crash: String(r && (r.stderr || r.error) || 'java').slice(0, 600) });
        }, function (e) { JV.busy = null; javaKill(); end({ crash: String(e) }); });
      });
    }, function (e) { return { fail: String(e && e.message || e) }; });
    return job;
  }
  function stopJava() { if (JV.busy) JV.busy.stop(); }

  /* ---------- el código que escribirías ---------- */
  var PYF = { I: 're.IGNORECASE', M: 're.MULTILINE', S: 're.DOTALL', X: 're.VERBOSE', A: 're.ASCII' };
  var JF = [[2, 'Pattern.CASE_INSENSITIVE'], [8, 'Pattern.MULTILINE'], [32, 'Pattern.DOTALL'], [4, 'Pattern.COMMENTS'], [64, 'Pattern.UNICODE_CASE'], [256, 'Pattern.UNICODE_CHARACTER_CLASS']];
  // Literal de Python: r"…" si se puede (lo habitual con regex); si no, "…" con escapes
  function pyLit(s) {
    if (!/[\n\r]/.test(s) && !/\\$/.test(s.replace(/\\\\/g, '')) && s.indexOf('"') < 0) return 'r"' + s + '"';
    if (!/[\n\r]/.test(s) && !/\\$/.test(s.replace(/\\\\/g, '')) && s.indexOf("'") < 0) return "r'" + s + "'";
    return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t') + '"';
  }
  // Literal de Java: cada \ se escribe \\ (la barra doble de las cadenas)
  function jLit(s) { return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t') + '"'; }
  function pyStr(s) { return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t') + '"'; }
  function pyCode(q, fn) {
    var fl = (q.flags || []).map(function (f) { return PYF[f]; }).filter(Boolean).join(' | ');
    var L = ['import re', '', 'patron = re.compile(' + pyLit(q.re) + (fl ? ', ' + fl : '') + ')', 'texto = ' + pyStr(q.text)];
    if (fn === 'sub' && q.rep != null) L.push('print(patron.sub(' + pyLit(q.rep) + ', texto))');
    else if (fn === 'split') L.push('print(patron.split(texto))');
    else if (fn === 'findall') L.push('print(patron.findall(texto))');
    else if (fn === 'match' || fn === 'fullmatch' || fn === 'search') L.push('m = patron.' + fn + '(texto)', 'if m:', '    print(m.group(), m.span(), m.groups())', 'else:', '    print(None)');
    else L.push('for m in patron.finditer(texto):', '    print(m.start(), m.end(), m.group(), m.groups())');
    return L.join('\n');
  }
  function javaCode(q, fn, cls) {
    var fl = JF.filter(function (f) { return (q.flags || 0) & f[0]; }).map(function (f) { return f[1]; }).join(' | ');
    var I = '        ', L = ['import java.util.regex.Matcher;', 'import java.util.regex.Pattern;', '', 'public class ' + (cls || 'Main') + ' {', '    public static void main(String[] args) {',
      I + 'Pattern patron = Pattern.compile(' + jLit(q.re) + (fl ? ', ' + fl : '') + ');', I + 'String texto = ' + jLit(q.text) + ';'];
    if (fn === 'replaceAll' && q.rep != null) L.push(I + 'System.out.println(patron.matcher(texto).replaceAll(' + jLit(q.rep) + '));');
    else if (fn === 'split') L.push(I + 'System.out.println(java.util.Arrays.toString(patron.split(texto)));');
    else if (fn === 'matches' || fn === 'lookingAt') L.push(I + 'Matcher m = patron.matcher(texto);', I + 'if (m.' + fn + '()) {', I + '    System.out.println(m.group() + " " + m.start() + "-" + m.end());', I + '} else {', I + '    System.out.println("no");', I + '}');
    else L.push(I + 'Matcher m = patron.matcher(texto);', I + 'while (m.find()) {', I + '    System.out.println(m.start() + "-" + m.end() + " " + m.group());', I + '}');
    L.push('    }', '}');
    return L.join('\n');
  }

  G.SLRx = { base: BASE, runPy: runPy, runJava: runJava, stopJava: stopJava, pyStart: pyStart, javaWarm: function (onp) { return Promise.all([javaRuntime(onp), javaSrc()]); }, pyLit: pyLit, jLit: jLit, pyCode: pyCode, javaCode: javaCode, JF: JF };
})(typeof window !== 'undefined' ? window : this);
