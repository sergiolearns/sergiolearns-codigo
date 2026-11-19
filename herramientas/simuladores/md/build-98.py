"""Monta el fragmento «SergioLearns — simulador Autómatas de MD» (v98) con el JS y el CSS minificados (esbuild).
Uso: python3 build-98.py salida.php [--publico] [--ids t6t,t6p,t6e] [--en <los 3 EN>]
El kit v2 (../comun/kit2.js) y la tarjeta de MD (comun-md.js) van dentro: la página del simulador solo carga este fragmento.
La base visual (m1-*) es la de los simuladores de AG (../ag/ag.css, parte común) y lo propio va en af.css.
Con --ids, los artículos del tema 6a (ES) salen en «Sigue aprendiendo» (sl6_link pone el EN)."""
import subprocess, sys, os
H = os.path.dirname(os.path.abspath(__file__))
def mini(args, inp):
    return subprocess.run(['npx', '--yes', 'esbuild', '--minify', *args], input=inp, capture_output=True, text=True, check=True).stdout.strip()
rd = lambda p: open(os.path.join(H, p), encoding='utf-8').read()
JS = mini(['--loader=js', '--target=es2020'], '\n'.join(rd(p) for p in ['../comun/kit2.js', 'engine-af.js', 'comun-md.js', 'ui-af.js']))
CSS = mini(['--loader=css'], rd('../ag/ag.css').split('/* ---- Gauss-Jordan paso a paso */')[0] + rd('af.css'))
for v in (JS, CSS):
    for bad in ('SL98JS', 'SL98CSS'):
        assert bad not in v
pub = 'true' if '--publico' in sys.argv else 'false'
ids, enids = [0] * 3, []
if '--ids' in sys.argv:
    ids = [int(x) for x in sys.argv[sys.argv.index('--ids') + 1].split(',')]
if '--en' in sys.argv:
    enids = [int(x) for x in sys.argv[sys.argv.index("--en") + 1].split(",")]
q = lambda x: "'" + x.replace('\\', '\\\\').replace("'", "\\'") + "'"
INFO = [
    ('automatas', 'automata', 'af', ('automata', 'automaton'), 'Python · AFD/AFND', 'md',
     ('Autómatas', 'Automata'),
     ('Un autómata finito lee una cadena símbolo a símbolo: el estado activo de un AFD, el conjunto de activos de un AFND con su λ-cierre, la construcción por subconjuntos y de una expresión regular a su autómata', 'A finite automaton reads a string symbol by symbol: the active state of a DFA, the set of active states of an NFA with its λ-closure, the subset construction and from a regular expression to its automaton'),
     ('--cadena 101', '--string 101'),
     ('El simulador necesita JavaScript. Ejemplo: el AFD de la cerradura (q0, q1, q2, q3; final q3) lee 1 0 1 y pasa por q0 → q1 → q2 → q3: acaba en un estado final, así que acepta la cadena y la taquilla se abre.', 'The simulator needs JavaScript. Example: the lock DFA (q0, q1, q2, q3; final q3) reads 1 0 1 and goes through q0 → q1 → q2 → q3: it ends in a final state, so it accepts the string and the locker opens.')),
]
info = ''
for es, en, sc, cmd, eng, ico, d, home, demo, ns in INFO:
    info += f"\t\t{q(es)} => array(\n\t\t\t'cmd'  => array( {q(cmd[0])}, {q(cmd[1])} ),\n\t\t\t'eng'  => {q(eng)},\n\t\t\t'ico'  => {q(ico)},\n\t\t\t'd'    => array( {q(d[0])}, {q(d[1])} ),\n\t\t\t'home' => array( {q(home[0])}, {q(home[1])} ),\n\t\t\t'demo' => array( {q(demo[0])}, {q(demo[1])} ),\n\t\t\t'sc'   => {q(sc)},\n\t\t),\n"
nsr = ''.join(f"\t\t{q(sc)} => array( {q(ns[0])}, {q(ns[1])} ),\n" for es, en, sc, cmd, eng, ico, d, home, demo, ns in INFO)
ens = ''.join(f"{q(es)} => {q(en)}, " for es, en, *r in INFO)
LK = [
    (ids[0], 'Autómatas finitos y expresiones regulares', 'Finite automata and regular expressions', 'AFD, AFND, subconjuntos y Kleene', 'DFA, NFA, subsets and Kleene', 'book'),
    (ids[1], 'Autómatas paso a paso', 'Automata, step by step', 'Práctica guiada con Python', 'Guided practice with Python', 'pen'),
    (ids[2], 'Ejercicios de autómatas', 'Automata exercises', 'Tipo examen, con un test de 20', 'Exam style, with a 20-question quiz', 'exam'),
]
links = ''.join(f"\t\t\tarray( {i}, '', $en ? {q(te)} : {q(ts)}, $en ? {q(se)} : {q(ss)}, {q(ic)} ),\n" for i, ts, te, ss, se, ic in LK if i)
purge = ', '.join(str(i) for i in ids + enids if i) or '0'
PHP = r"""/**
 * SergioLearns — simulador «Autómatas» de MD (v98, 19 nov 2026, hoja de ruta 7.15, conversación 3: tema 6a).
 * Un autómata finito lee una cadena símbolo a símbolo: el estado activo de un AFD (y la trampa que no se dibuja), el conjunto de
 * activos de un AFND con su λ-cierre, los estados de absorción e inaccesibles, la construcción por subconjuntos fila a fila y de
 * una expresión regular sencilla a su AFND (Thompson). Kit v2 en diseño D: lecciones con «¿Qué crees que pasa?», «Tu autómata»
 * plegable y «Ponte a prueba» por niveles.
 * Fuente: sergiolearns-codigo/herramientas/simuladores/md/ (engine-af.js, comun-md.js, ui-af.js, af.css sobre la base de ag.css;
 * pruebas: test-af.js; montaje: build-98.py). Aquí va minificado.
 * Necesita «simuladores» (módulo 89: sl6_css, sl6_css7, sl6_link) y se registra en sl6_info() y sl6_mini() (sus ganchos v98).
 * Shortcode [sl_sim_af]. Mientras SL_V98_PUBLICO sea false, solo lo ve el administrador con ?sl_v98=1
 * (cookie; ?sl_v98=0 la quita). Sin emoticonos.
 */
if ( ! defined( 'SL_V98_PUBLICO' ) ) {
	define( 'SL_V98_PUBLICO', __PUB__ );
}
add_filter( 'litespeed_vary_cookies', function ( $l ) { $l[] = 'sl_v98'; return $l; } );
function sl_v98() {
	static $on = null;
	if ( null !== $on ) {
		return $on;
	}
	if ( ! function_exists( 'sl_v6' ) || ! sl_v6() ) {
		return $on = false;
	}
	if ( SL_V98_PUBLICO ) {
		return $on = true;
	}
	if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
		return $on = false;
	}
	if ( isset( $_GET['sl_v98'] ) ) {
		$v = ( '1' === $_GET['sl_v98'] );
		if ( ! headers_sent() ) {
			setcookie( 'sl_v98', $v ? '1' : '', $v ? time() + 30 * DAY_IN_SECONDS : time() - 3600, COOKIEPATH ? COOKIEPATH : '/', COOKIE_DOMAIN, is_ssl(), true );
		}
		return $on = $v;
	}
	return $on = ! empty( $_COOKIE['sl_v98'] );
}
add_action( 'init', 'sl_v98', 1 );
function sl98_ids() {
	return array( 'af' );
}
/** Registro (por el slug ES de su página), con el formato de sl6_info(). */
function sl98_info() {
	return array(
__INFO__	);
}
function sl98_en_slugs() {
	return array( __ENS__);
}
// Vista previa: el administrador ve las páginas privadas en el htop, el menú y la portada.
add_filter( 'sl4_lab_preview', function ( $v ) {
	return $v || ( sl_v98() && ! SL_V98_PUBLICO && current_user_can( 'edit_pages' ) );
} );
function sl98_links( $id, $en ) {
	$L = array(
		'af' => array(
__LINKS__		),
	);
	$out = array();
	foreach ( isset( $L[ $id ] ) ? $L[ $id ] : array() as $x ) {
		$out[] = function_exists( 'sl6_link' ) ? sl6_link( $x[0], $x[1], $x[2], $x[3], $x[4] ) : null;
	}
	return array_values( array_filter( $out ) );
}
// Cuando se publica un artículo enlazado en «Sigue aprendiendo», se purgan las páginas del simulador.
add_action( 'transition_post_status', function ( $new, $old, $post ) {
	if ( 'publish' === $new && 'publish' !== $old && in_array( (int) $post->ID, array( __PURGE__ ), true ) ) {
		foreach ( get_pages( array( 'post_status' => 'publish' ) ) as $pg ) {
			if ( false !== strpos( $pg->post_content, '[sl_sim_af' ) ) {
				do_action( 'litespeed_purge_post', $pg->ID );
			}
		}
	}
}, 10, 3 );
add_shortcode( 'sl_sim_af', function ( $atts ) {
	$a  = shortcode_atts( array( 'id' => 'af' ), $atts );
	$id = $a['id'];
	if ( ! sl_v98() || ! in_array( $id, sl98_ids(), true ) || ! function_exists( 'sl6_css' ) ) {
		return '';
	}
	$en = function_exists( 'sl6_en' ) ? sl6_en() : false;
	$ns = array(
__NS__	);
	$GLOBALS['sl98_need'][ $id ] = true;
	$h  = '<div class="sl-sim" data-sim="' . esc_attr( $id ) . '" data-lang="' . ( $en ? 'en' : 'es' ) . '" data-links="' . esc_attr( wp_json_encode( sl98_links( $id, $en ) ) ) . '">';
	$h .= '<noscript><p>' . esc_html( $ns[ $id ][ $en ? 1 : 0 ] ) . '</p></noscript></div>';
	return $h . sl6_css() . ( function_exists( 'sl6_css7' ) ? sl6_css7() : '' ) . sl98_css();
} );
function sl98_css() {
	static $done = false;
	if ( $done ) {
		return '';
	}
	$done = true;
	return '<style id="sl98-css">' . <<<'SL98CSS'
__CSS__
SL98CSS
	. '</style>';
}
add_action( 'wp_footer', function () {
	if ( empty( $GLOBALS['sl98_need'] ) ) {
		return;
	}
	echo '<script id="sl98-js">' . <<<'SL98JS'
__JS__
SL98JS
	. '</script>';
}, 41 );

/* ------------------------------------------------------------------ animación de su tarjeta (la pide sl6_mini) */
function sl98_mini( $slug ) {
	if ( ! sl_v98() || ! function_exists( 'sl19_tl' ) || ! function_exists( 'sl19_tx' ) ) {
		return '';
	}
	if ( 'automatas' !== $slug ) {
		return '';
	}
	// La cerradura: q0 -1-> q1 -0-> q2 -1-> q3 (final). El estado activo (coral) avanza con cada tecla y al final se abre.
	$en = function_exists( 'sl19_en' ) && sl19_en();
	$X  = array( 14, 38, 62, 86 );
	$y  = 40;
	$st = '';
	foreach ( $X as $k => $x ) {
		$st .= '<circle cx="' . $x . '" cy="' . $y . '" r="8" fill="#2A2640" stroke="#A99EF5" stroke-width="1.4"/>';
		if ( 3 === $k ) {
			$st .= '<circle cx="' . $x . '" cy="' . $y . '" r="5.6" fill="none" stroke="#A99EF5" stroke-width="1.2"/>';
		}
	}
	$ar  = '';
	$sym = array( '1', '0', '1' );
	for ( $k = 0; $k < 3; $k++ ) {
		$a   = $X[ $k ] + 9;
		$b   = $X[ $k + 1 ] - 9;
		$ar .= '<line x1="' . $a . '" y1="' . $y . '" x2="' . $b . '" y2="' . $y . '" stroke="#E8E6F5" stroke-width="1.2"/><path d="M' . $b . ' ' . $y . 'l-4 -2.4v4.8z" fill="#E8E6F5"/>';
		$ar .= '<text x="' . ( ( $a + $b ) / 2 ) . '" y="' . ( $y - 5 ) . '" font-size="8" text-anchor="middle" fill="#E8E6F5" font-family="JetBrains Mono,monospace">' . $sym[ $k ] . '</text>';
	}
	$on = function ( $k ) use ( $X, $y ) {
		return '<circle cx="' . $X[ $k ] . '" cy="' . $y . '" r="8" fill="#FF6B4A" fill-opacity=".3" stroke="#FF6B4A" stroke-width="2"/>';
	};
	$base = '<rect x="4" y="4" width="92" height="72" rx="8" fill="#2A2640"/><path d="M2 ' . $y . 'h2" stroke="#E8E6F5"/>' . $ar . $st;
	$it   = array(
		array( 'm' => $base, 'a' => 1, 'b' => 92 ),
		array( 'm' => $on( 0 ), 'a' => 4, 'b' => 22 ),
		array( 'm' => $on( 1 ), 'a' => 22, 'b' => 40 ),
		array( 'm' => $on( 2 ), 'a' => 40, 'b' => 58 ),
		array( 'm' => $on( 3 ), 'a' => 58, 'b' => 92 ),
		array( 'm' => sl19_tx( 108, 26, array( array( $en ? 'string 1 0 1' : 'cadena 1 0 1', '#E8E6F5' ) ), 10 ), 'a' => 4, 'b' => 92 ),
		array( 'm' => sl19_tx( 108, 50, array( array( 'q0 → q1 → q2 → q3', '#A99EF5' ) ), 10 ), 'a' => 22, 'b' => 92 ),
		array( 'm' => sl19_tx( 108, 74, array( array( $en ? 'final · it opens' : 'final · se abre', '#FF9B80' ) ), 10 ), 'a' => 62, 'b' => 92 ),
	);
	return sl19_tl( 'm98t', $it, 250 );
}
"""
PHP = PHP.replace('__PUB__', pub).replace('__INFO__', info).replace('__ENS__', ens).replace('__NS__', nsr).replace('__LINKS__', links).replace('__PURGE__', purge).replace('__CSS__', CSS).replace('__JS__', JS)
open(sys.argv[1], 'w', encoding='utf-8').write(PHP)
print('fragmento', len(PHP), 'JS', len(JS), 'CSS', len(CSS))
