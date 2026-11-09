"""Fragmento 16 «SergioLearns — entorno»: el java.util.regex de OpenJDK 21 en el entorno de Java (sl-ide v1.5), detrás de SL_IDE_REGEX_PUBLICO
(?sl_rx=1 para el administrador). Si el código importa o nombra java.util.regex: esos import pasan a líneas vacías, «java.util.regex.» se quita
y SlRegex (sin import, nombres completos) va AL FINAL del código, así que los números de línea de los errores no se mueven.
Uso: python3 build-entorno.py <fragmento16.php> <salida.php>"""
import base64, gzip, os, sys
D = os.path.dirname(os.path.abspath(__file__))
s = open(sys.argv[1], encoding='utf-8').read()
def rep(a, b):
    global s
    assert s.count(a) == 1, (a[:80], s.count(a))
    s = s.replace(a, b)
gz = base64.b64encode(gzip.compress(open(os.path.join(D, 'motor-java', 'SlRegexSinImports.java'), encoding='utf-8').read().encode(), 9, mtime=0)).decode()
rep("if ( ! defined( 'SL_IDE_TEMA_PUBLICO' ) ) {", "if ( ! defined( 'SL_IDE_REGEX_PUBLICO' ) ) { define( 'SL_IDE_REGEX_PUBLICO', false ); }   // v1.5: java.util.regex de OpenJDK en Java (el de TeaVM da resultados falsos); false = solo el admin con ?sl_rx=1\nif ( ! defined( 'SL_IDE_TEMA_PUBLICO' ) ) {")
rep("""		'tema'    => SL_IDE_TEMA_PUBLICO || ( current_user_can( 'manage_options' ) && isset( $_GET['sl_tema'] ) ),   // v1.3: botón Claro/Oscuro (29 oct 2026)""",
    """		'tema'    => SL_IDE_TEMA_PUBLICO || ( current_user_can( 'manage_options' ) && isset( $_GET['sl_tema'] ) ),   // v1.3: botón Claro/Oscuro (29 oct 2026)
		'regex'   => SL_IDE_REGEX_PUBLICO || ( current_user_can( 'manage_options' ) && isset( $_GET['sl_rx'] ) ),   // v1.5: regex de OpenJDK (9 nov 2026)""")
rep("""  JV.exec = function (owner, src, input, limit, main) {
    return JV.q.add(function () {
      return JV.runtime().then(function (rt) {
        return new Promise(function (ok) {""", """  // v1.5 (9 nov 2026): el java.util.regex de TeaVM da resultados falsos (\\d{1,3}(?:\\.\\d{1,3}){3} no casa con 192.168.1.20) y no trae
  // \\k<n>, ${n} ni replaceAll(m -> …). Si el código usa java.util.regex, va con el de OpenJDK 21 (SlRegex, GPLv2 + Classpath Exception,
  // fuente en sergiolearns-codigo/herramientas/simuladores/regex/motor-java/) añadido AL FINAL: las líneas del lector no se mueven.
  var JRX = { gz: '""" + gz + """', src: null };
  function jrxNeeds(src) { return !!(window.SL_IDE_BASE || {}).regex && /^\\s*import\\s+java\\.util\\.regex\\.|java\\.util\\.regex\\./m.test(src); }
  function jrxWrap(src) {
    if (!jrxNeeds(src)) return Promise.resolve({ src: src, rx: false });
    if (!JRX.src) {
      var bin = atob(JRX.gz), u = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
      JRX.src = new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
    }
    return JRX.src.then(function (sl) {
      var out = src.split('\\n').map(function (l) { return /^\\s*import\\s+java\\.util\\.regex\\.[\\w.*]+\\s*;\\s*$/.test(l) ? '' : l.replace(/java\\.util\\.regex\\./g, ''); }).join('\\n');
      return { src: out + '\\n' + sl, rx: true };
    }, function () { return { src: src, rx: false }; });
  }
  function jrxName(s) { return typeof s === 'string' ? s.replace(/(^|[^\\w.$])PatternSyntaxException\\b/gm, '$1java.util.regex.PatternSyntaxException') : s; }
  JV.exec = function (owner, src, input, limit, main) {
    return JV.q.add(function () {
      return Promise.all([JV.runtime(), jrxWrap(src)]).then(function (pr) {
        var rt = pr[0], rx = pr[1].rx; src = pr[1].src;
        return new Promise(function (ok0) {
          var ok = rx ? function (r) { if (r) { r.stderr = jrxName(r.stderr); r.stdout = jrxName(r.stdout); if (r.error) r.error = jrxName(r.error); } ok0(r); } : ok0;""")
open(sys.argv[2], 'w', encoding='utf-8').write(s)
print(sys.argv[2], len(s), 'gz', len(gz))
