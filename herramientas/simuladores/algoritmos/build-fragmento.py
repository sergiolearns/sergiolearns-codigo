"""Fragmento 22 «SergioLearns — simuladores» v1.5: el visualizador de algoritmos detrás de SL_V24_PUBLICO (?sl_v24=1).
Uso: python3 build-fragmento.py <v1.4.php> <salida.php>   (ESB=ruta a esbuild)"""
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
JS = mini(['--loader=js'], open(os.path.join(D, 'dist', 'algoritmos.js'), encoding='utf-8').read())
CSS = mini(['--loader=css'], open(os.path.join(D, 'algoritmos.css'), encoding='utf-8').read())
assert 'SL6AV;' not in JS and 'SL6CSS5;' not in CSS

rep(" * SergioLearns — simuladores (v1.4, 9 nov 2026:",
    " * SergioLearns — simuladores (v1.5, 9 nov 2026: el visualizador de algoritmos —búsquedas, recursión y ordenación— con Python de verdad\n"
    " *    (Pyodide, trazado con sys.settrace), detrás de SL_V24_PUBLICO (?sl_v24=1); v1.4, 9 nov 2026:")
rep("""if ( ! defined( 'SL_V22_PUBLICO' ) ) {""", """if ( ! defined( 'SL_V24_PUBLICO' ) ) {
	define( 'SL_V24_PUBLICO', false );   // visualizador de algoritmos (hoja de ruta 7.8, paso 3)
}
if ( ! defined( 'SL_V22_PUBLICO' ) ) {""")
rep("$l[] = 'sl_v22'; return $l; } );", "$l[] = 'sl_v22'; $l[] = 'sl_v24'; return $l; } );")
rep("function sl_v22() {", """function sl_v24() {   // el visualizador de algoritmos (FP1 y FP2)
	static $on = null;
	if ( null !== $on ) {
		return $on;
	}
	if ( ! sl_v6() ) {
		return $on = false;
	}
	if ( SL_V24_PUBLICO ) {
		return $on = true;
	}
	if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
		return $on = false;
	}
	if ( isset( $_GET['sl_v24'] ) ) {
		$v = ( '1' === $_GET['sl_v24'] );
		if ( ! headers_sent() ) {
			setcookie( 'sl_v24', $v ? '1' : '', $v ? time() + 30 * DAY_IN_SECONDS : time() - 3600, COOKIEPATH ? COOKIEPATH : '/', COOKIE_DOMAIN, is_ssl(), true );
		}
		return $on = $v;
	}
	return $on = ! empty( $_COOKIE['sl_v24'] );
}
function sl_v22() {""")
rep("""	if ( null === $slug ) {
		return $all;
	}
	return isset( $all[ $slug ] )""", """	if ( sl_v24() ) {   // FP1 y FP2 (hoja de ruta 7.8, paso 3)
		$all['visualizador-algoritmos'] = array(
			'cmd'  => array( 'algoritmo', 'algorithm' ),
			'eng'  => 'Python',
			'ico'  => 'barras',
			'd'    => array( 'Ordenar, buscar y recursión', 'Sorting, searching and recursion' ),
			'home' => array( 'Tu programa de Python ejecutado de verdad, paso a paso: las barras de la lista, cada comparación, la pila de llamadas y el árbol de la recursión', 'Your Python program really run, step by step: the list as bars, every comparison, the call stack and the recursion tree' ),
			'demo' => array( '--ejemplo burbuja', '--example bubble' ),
			'sc'   => 'algoritmos',
		);
	}
	if ( null === $slug ) {
		return $all;
	}
	return isset( $all[ $slug ] )""")
rep("|| ( sl_v22() && ! SL_V22_PUBLICO && current_user_can( 'edit_pages' ) );",
    "|| ( sl_v22() && ! SL_V22_PUBLICO && current_user_can( 'edit_pages' ) ) || ( sl_v24() && ! SL_V24_PUBLICO && current_user_can( 'edit_pages' ) );")
rep("""	$out = array();
	foreach ( ( 'regex' === $id ? $L['regex'] :""", """	$L['algoritmos'] = array(
		array( 2264, '', $en ? 'Recursion in Python' : 'Recursividad en Python', $en ? 'FP1: base case, call stack and binary search' : 'FP1: caso base, pila de llamadas y búsqueda binaria', 'book' ),
		array( 2270, '', $en ? 'Recursion exercises' : 'Ejercicios de recursividad', $en ? 'With their solutions' : 'Con su solución', 'pen' ),
		array( 1935, '', $en ? 'Arrays in Java' : 'Arrays en Java', $en ? 'FP2: Arrays.sort and binarySearch' : 'FP2: Arrays.sort y binarySearch', 'book' ),
		array( 3207, '', $en ? 'FP1 theory mock exam' : 'Simulacro de teoría de FP1', $en ? 'Timed and marked, like the real one' : 'Con reloj y nota, como el de verdad', 'exam' ),
		array( 3076, '', $en ? 'FP2 theory mock exam' : 'Simulacro de teoría de FP2', $en ? 'Timed and marked, like the real one' : 'Con reloj y nota, como el de verdad', 'exam' ),
	);
	$out = array();
	foreach ( ( 'algoritmos' === $id ? $L['algoritmos'] : ( 'regex' === $id ? $L['regex'] :""")
rep("""isset( $L[ $id ] ) ? $L[ $id ] : array(), array( $sim ) ) ) as $x ) {""", """isset( $L[ $id ] ) ? $L[ $id ] : array(), array( $sim ) ) ) ) as $x ) {""")
rep("|| ( 'regex' === $id && sl_v22() ) ) ) {", "|| ( 'regex' === $id && sl_v22() ) || ( 'algoritmos' === $id && sl_v24() ) ) ) {")
rep("""		'paquete'   => array( 'El simulador necesita JavaScript.""", """		'algoritmos' => array( 'El visualizador necesita JavaScript. Ejemplo: la búsqueda binaria de 58 en 3, 8, 12, 17, 23, 31, 38, 44, 52, 58, 61, 70, 77, 85 y 90 mira el 44 (posición 7), el 70 (11) y el 58 (9): 5 comparaciones.', 'The visualizer needs JavaScript. Example: a binary search for 58 in 3, 8, 12, 17, 23, 31, 38, 44, 52, 58, 61, 70, 77, 85 and 90 looks at 44 (position 7), 70 (11) and 58 (9): 5 comparisons.' ),
		'paquete'   => array( 'El simulador necesita JavaScript.""")
rep("( in_array( $id, $ic1, true ) || 'regex' === $id ? sl6_css3() : '' ) . ( 'regex' === $id ? sl6_css4() : '' );",
    "( in_array( $id, $ic1, true ) || 'regex' === $id || 'algoritmos' === $id ? sl6_css3() : '' ) . ( 'regex' === $id || 'algoritmos' === $id ? sl6_css4() : '' ) . ( 'algoritmos' === $id ? sl6_css5() : '' );")
rep("function sl6_css4() {   // el probador de expresiones regulares", "function sl6_css5() {   // el visualizador de algoritmos\n\tstatic $done = false;\n\tif ( $done ) {\n\t\treturn '';\n\t}\n\t$done = true;\n\treturn '<style id=\"sl6-css5\">' . <<<'SL6CSS5'\n" + CSS + "\nSL6CSS5\n\t. '</style>';\n}\nfunction sl6_css4() {   // el probador de expresiones regulares")
rep("""		case 'regex':   // motores""", "\t\tcase 'algoritmos':   // Pyodide en un worker con el arnés de trazas (arnes.py), los ejemplos y la interfaz\n\t\t\treturn <<<'SL6AV'\n" + JS + "\nSL6AV;\n\t\tcase 'regex':   // motores")
rep("'ieee', 'hamming', 'codigos', 'rendimiento', 'regex' ) as $id ) {", "'ieee', 'hamming', 'codigos', 'rendimiento', 'regex', 'algoritmos' ) as $id ) {")
# animación de la tarjeta: barras como las de htop que se comparan (coral), se intercambian (violeta) y acaban ordenadas
rep("""	if ( 'probador-regex' === $slug ) {""", """	if ( 'visualizador-algoritmos' === $slug ) {
		if ( ! function_exists( 'sl19_tl' ) ) {
			return '';
		}
		$en  = sl6_en();
		$bar = function ( $vals, $hi ) {   // $hi: posición => color
			$h = '';
			foreach ( $vals as $i => $v ) {
				$x = 4 + $i * 21;
				$c = isset( $hi[ $i ] ) ? $hi[ $i ] : '#8E86C9';
				for ( $k = 0; $k < $v; $k++ ) {
					$h .= '<rect x="' . $x . '" y="' . ( 60 - $k * 5 ) . '" width="15" height="3" rx="1" fill="' . $c . '"/>';
				}
				$h .= '<text x="' . ( $x + 7.5 ) . '" y="74" font-size="10" text-anchor="middle" font-family="JetBrains Mono,ui-monospace,monospace" fill="#8E8AA3">' . $v . '</text>';
			}
			return $h;
		};
		return sl19_tl( 'av', array(
			array( 'm' => $bar( array( 3, 7, 9, 5, 10, 4 ), array() ), 'a' => 2, 'b' => 16 ),
			array( 'm' => $bar( array( 3, 7, 9, 5, 10, 4 ), array( 2 => '#FF6B4A', 3 => '#FF6B4A' ) ), 'a' => 17, 'b' => 36 ),
			array( 'm' => sl19_tx( 130, 30, array( array( $en ? 'items[2] > items[3]' : 'lista[2] > lista[3]', '#E8E6F5' ) ), 10 ), 'a' => 19, 'b' => 36 ),
			array( 'm' => sl19_tx( 130, 46, array( array( 'True', '#FF9B80' ) ), 10 ), 'a' => 24, 'b' => 36 ),
			array( 'm' => $bar( array( 3, 7, 5, 9, 10, 4 ), array( 2 => '#A99EF5', 3 => '#A99EF5' ) ), 'a' => 38, 'b' => 58 ),
			array( 'm' => sl19_tx( 130, 30, array( array( $en ? 'swap' : 'intercambia', '#A99EF5' ) ), 10 ), 'a' => 40, 'b' => 58 ),
			array( 'm' => $bar( array( 3, 4, 5, 7, 9, 10 ), array( 0 => '#8FE3B0', 1 => '#8FE3B0', 2 => '#8FE3B0', 3 => '#8FE3B0', 4 => '#8FE3B0', 5 => '#8FE3B0' ) ), 'a' => 60 ),
			array( 'm' => sl19_tx( 130, 30, array( array( 'Python', '#A99EF5' ), array( $en ? ' sorted' : ' ordenada', '#8FE3B0' ) ), 10 ), 'a' => 62 ),
			array( 'm' => sl19_tx( 0, 92, array( array( $en ? '15 comparisons · 7 swaps' : '15 comparaciones · 7 intercambios', '#C9C5DC' ) ), 10 ), 'a' => 64 ),
		), 250 );
	}
	if ( 'probador-regex' === $slug ) {""")
open(out, 'w', encoding='utf-8').write(s)
print(out, len(s), 'bytes; JS', len(JS), 'CSS', len(CSS))
