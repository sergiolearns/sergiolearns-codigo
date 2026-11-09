"""Fragmento 22 «SergioLearns — simuladores» v1.4: el probador de expresiones regulares detrás de SL_V22_PUBLICO (?sl_v22=1).
Uso: python3 build-fragmento.py <v1.3.php> <salida.php>   (necesita esbuild; ESB=ruta al binario)"""
import os, subprocess, sys
D = os.path.dirname(os.path.abspath(__file__))
ESB = os.environ.get('ESB', 'esbuild')
def mini(args, inp):
    return subprocess.run([ESB, '--minify', *args], input=inp, capture_output=True, text=True, check=True).stdout.strip()
src, out = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (a[:80], s.count(a))
    s = s.replace(a, b)

subprocess.run([sys.executable, os.path.join(D, 'build.py')], check=True, stdout=subprocess.DEVNULL)
JS = mini(['--loader=js'], open(os.path.join(D, 'dist', 'regex.js'), encoding='utf-8').read())
CSS = mini(['--loader=css'], open(os.path.join(D, 'regex.css'), encoding='utf-8').read())
assert 'SL6RX;' not in JS and 'SL6CSS4;' not in CSS

rep(" * SergioLearns — simuladores (v1.3, 9 nov 2026, IC1:",
    " * SergioLearns — simuladores (v1.4, 9 nov 2026: el probador de expresiones regulares de Python y Java, con sus motores de verdad\n"
    " *    —Pyodide y javac + TeaVM con el java.util.regex de OpenJDK 21—, detrás de SL_V22_PUBLICO (?sl_v22=1); v1.3, 9 nov 2026, IC1:")
rep("""if ( ! defined( 'SL_V21_PUBLICO' ) ) {
	define( 'SL_V21_PUBLICO', true );   // los seis simuladores de IC1 que faltaban: «aplica» de Sergio (9 nov 2026)
}
""", """if ( ! defined( 'SL_V21_PUBLICO' ) ) {
	define( 'SL_V21_PUBLICO', true );   // los seis simuladores de IC1 que faltaban: «aplica» de Sergio (9 nov 2026)
}
if ( ! defined( 'SL_V22_PUBLICO' ) ) {
	define( 'SL_V22_PUBLICO', false );   // probador de expresiones regulares (hoja de ruta 7.8, paso 3)
}
""")
rep("$l[] = 'sl_v21'; return $l; } );", "$l[] = 'sl_v21'; $l[] = 'sl_v22'; return $l; } );")
rep("function sl_v21() {", """function sl_v22() {   // el probador de expresiones regulares (Python y Java)
	static $on = null;
	if ( null !== $on ) {
		return $on;
	}
	if ( ! sl_v6() ) {
		return $on = false;
	}
	if ( SL_V22_PUBLICO ) {
		return $on = true;
	}
	if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
		return $on = false;
	}
	if ( isset( $_GET['sl_v22'] ) ) {
		$v = ( '1' === $_GET['sl_v22'] );
		if ( ! headers_sent() ) {
			setcookie( 'sl_v22', $v ? '1' : '', $v ? time() + 30 * DAY_IN_SECONDS : time() - 3600, COOKIEPATH ? COOKIEPATH : '/', COOKIE_DOMAIN, is_ssl(), true );
		}
		return $on = $v;
	}
	return $on = ! empty( $_COOKIE['sl_v22'] );
}
function sl_v21() {""")
rep("""	if ( null === $slug ) {
		return $all;
	}""", """	if ( sl_v22() ) {   // FP1 y FP2 (hoja de ruta 7.8, paso 3)
		$all['probador-regex'] = array(
			'cmd'  => array( 'regex', 'regex' ),
			'eng'  => 'Python · Java',
			'ico'  => 'regex',
			'd'    => array( 'Expresiones regulares de verdad', 'Real regular expressions' ),
			'home' => array( 'Tu expresión con el motor de verdad de Python o de Java: qué casa, los grupos, qué devuelve cada función y el código que escribirías', 'Your pattern with the real Python or Java engine: what matches, the groups, what each function returns and the code you would write' ),
			'demo' => array( '--python \\'\\\\d{4} ?[B-DF-HJ-NPR-TV-Z]{3}\\'', '--python \\'\\\\d{4} ?[B-DF-HJ-NPR-TV-Z]{3}\\'' ),
			'sc'   => 'regex',
		);
	}
	if ( null === $slug ) {
		return $all;
	}""")
rep("|| ( sl_v21() && ! SL_V21_PUBLICO && current_user_can( 'edit_pages' ) );",
    "|| ( sl_v21() && ! SL_V21_PUBLICO && current_user_can( 'edit_pages' ) ) || ( sl_v22() && ! SL_V22_PUBLICO && current_user_can( 'edit_pages' ) );")
rep("""	$out = array();
	foreach ( array_merge( isset( $L[ $id ] ) ? $L[ $id ] : array(), array( $sim ) ) as $x ) {""", """	$L['regex'] = array(
		array( 2328, '', $en ? 'Regular expressions in Python' : 'Expresiones regulares en Python', $en ? 'FP1: re, match, search and groups' : 'FP1: re, match, search y grupos', 'book' ),
		array( 2334, '', $en ? 'Python regex exercises' : 'Ejercicios de regex en Python', $en ? 'With their solutions' : 'Con su solución', 'pen' ),
		array( 1995, '', $en ? 'Regular expressions in Java' : 'Expresiones regulares en Java', $en ? 'FP2: Pattern, Matcher and the double backslashes' : 'FP2: Pattern, Matcher y las barras dobles', 'book' ),
		array( 2014, '', $en ? 'Java regex exercises' : 'Ejercicios de regex en Java', $en ? 'Number plates, dates and a log' : 'Matrículas, fechas y un log', 'pen' ),
		array( 3207, '', $en ? 'FP1 theory mock exam' : 'Simulacro de teoría de FP1', $en ? 'Timed and marked, like the real one' : 'Con reloj y nota, como el de verdad', 'exam' ),
		array( 3076, '', $en ? 'FP2 theory mock exam' : 'Simulacro de teoría de FP2', $en ? 'Timed and marked, like the real one' : 'Con reloj y nota, como el de verdad', 'exam' ),
	);
	$out = array();
	foreach ( ( 'regex' === $id ? $L['regex'] : array_merge( isset( $L[ $id ] ) ? $L[ $id ] : array(), array( $sim ) ) ) as $x ) {""")
rep("|| ( in_array( $id, $v21, true ) && sl_v21() ) ) ) {", "|| ( in_array( $id, $v21, true ) && sl_v21() ) || ( 'regex' === $id && sl_v22() ) ) ) {")
rep("""		'paquete'   => array( 'El simulador necesita JavaScript.""", """		'regex'     => array( 'El probador necesita JavaScript. Ejemplo: \\\\d{4} ?[B-DF-HJ-NPR-TV-Z]{3} encuentra 1234 BCD en «Entran 1234 BCD y 0000AEI», pero no 0000AEI, que tiene vocales.', 'The tester needs JavaScript. Example: \\\\d{4} ?[B-DF-HJ-NPR-TV-Z]{3} finds 1234 BCD in «In come 1234 BCD and 0000AEI», but not 0000AEI, which has vowels.' ),
		'paquete'   => array( 'El simulador necesita JavaScript.""")
rep("return $h . sl6_css() . ( 'planifica' !== $id ? sl6_css2() : '' ) . ( in_array( $id, $ic1, true ) ? sl6_css3() : '' );",
    "return $h . sl6_css() . ( 'planifica' !== $id ? sl6_css2() : '' ) . ( in_array( $id, $ic1, true ) || 'regex' === $id ? sl6_css3() : '' ) . ( 'regex' === $id ? sl6_css4() : '' );")
rep("function sl6_css3() {   // simuladores de IC1", "function sl6_css4() {   // el probador de expresiones regulares\n\tstatic $done = false;\n\tif ( $done ) {\n\t\treturn '';\n\t}\n\t$done = true;\n\treturn '<style id=\"sl6-css4\">' . <<<'SL6CSS4'\n" + CSS + "\nSL6CSS4\n\t. '</style>';\n}\nfunction sl6_css3() {   // simuladores de IC1")
rep("""		case 'paquete':
			return <<<'SL6PK'""", "\t\tcase 'regex':   // motores (Pyodide; javac + TeaVM con el java.util.regex de OpenJDK) + interfaz\n\t\t\treturn <<<'SL6RX'\n" + JS + "\nSL6RX;\n\t\tcase 'paquete':\n\t\t\treturn <<<'SL6PK'")
rep("'ieee', 'hamming', 'codigos', 'rendimiento' ) as $id ) {", "'ieee', 'hamming', 'codigos', 'rendimiento', 'regex' ) as $id ) {")
# animación de la tarjeta (usa sl19_tl() y sl19_tx() del fragmento 35: una sola línea de tiempo, a tamaño real)
rep("""function sl6_mini( $slug ) {
	if ( ! sl_v7() ) {
		return '';
	}
""", """function sl6_mini( $slug ) {
	if ( ! sl_v7() ) {
		return '';
	}
	if ( 'probador-regex' === $slug ) {   // la expresión, el texto, lo que casa y los dos motores que lo confirman
		if ( ! function_exists( 'sl19_tl' ) ) {
			return '';
		}
		$en = sl6_en();
		$re = '\\\\d{1,3}(?:\\\\.\\\\d{1,3}){3}';
		$tx = $en ? 'WARN 192.168.1.20 session' : 'WARN 192.168.1.20 sesión';
		return sl19_tl( 'rx', array(
			array( 'm' => sl19_tx( 0, 18, array( array( '/', '#8E8AA3' ), array( $re, '#FF9B80' ), array( '/', '#8E8AA3' ) ), 12 ), 'a' => 3, 'w' => array( 0, 6, 26 * 7.2 + 6, 17 ) ),
			array( 'm' => '<rect x="' . round( 5 * 6.6 - 1, 1 ) . '" y="32" width="' . round( 12 * 6.6 + 2, 1 ) . '" height="17" rx="3" fill="#A99EF5" fill-opacity=".32"/><rect x="' . round( 5 * 6.6 - 1, 1 ) . '" y="47" width="' . round( 12 * 6.6 + 2, 1 ) . '" height="2" fill="#A99EF5"/>', 'a' => 30, 'g' => 1 ),
			array( 'm' => sl19_tx( 0, 44, array( array( $tx, '#C9C5DC' ) ) ), 'a' => 14, 'w' => array( 0, 32, 26 * 6.6 + 6, 17 ) ),
			array( 'm' => sl19_tx( 0, 70, array( array( 'Python ', '#A99EF5' ), array( 're.search()', '#E8E6F5' ), array( '  192.168.1.20', '#8FE3B0' ) ) ), 'a' => 44 ),
			array( 'm' => sl19_tx( 0, 88, array( array( 'Java   ', '#FF9B80' ), array( 'find()     ', '#E8E6F5' ), array( '  192.168.1.20', '#8FE3B0' ) ) ), 'a' => 56 ),
		), 250 );
	}
""")
open(out, 'w', encoding='utf-8').write(s)
print(out, len(s), 'bytes; JS', len(JS), 'CSS', len(CSS))
