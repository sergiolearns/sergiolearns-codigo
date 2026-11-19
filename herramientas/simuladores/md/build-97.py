"""Monta el fragmento «SergioLearns — simulador Caminos mínimos de MD» (v97) con el JS y el CSS minificados (esbuild).
Uso: python3 build-97.py salida.php [--publico]
Los enlaces de «Sigue aprendiendo» buscan las entradas del tema 4 (Teoría de grafos) por su slug, así que no hace falta rehacerlo al publicarlas.
El kit v2 (../comun/kit2.js) va dentro; las tarjetas de código salen de comun-md.js y los estilos base de ../ag/ag.css."""
import subprocess, sys, os
H = os.path.dirname(os.path.abspath(__file__))
def mini(args, inp):
    return subprocess.run(['npx', '--yes', 'esbuild', '--minify', *args], input=inp, capture_output=True, text=True, check=True).stdout.strip()
rd = lambda p: open(os.path.join(H, p), encoding='utf-8').read()
JS = mini(['--loader=js', '--target=es2020'], '\n'.join(rd(p) for p in ['../comun/kit2.js', 'engine-cm.js', 'comun-md.js', 'ui-cm.js']))
CSS = mini(['--loader=css'], rd('../ag/ag.css') + rd('cm.css'))
import json
for v in (JS, CSS):
    for bad in ('SL97JS', 'SL97CSS'):
        assert bad not in v
pub = 'true' if '--publico' in sys.argv else 'false'
q = lambda x: "'" + x.replace('\\', '\\\\').replace("'", "\\'") + "'"
INFO = [
    ('caminos-minimos', 'shortest-paths', 'cm', ('caminos-minimos', 'shortest-paths'), 'Python · heapq', 'md',
     ('Caminos mínimos y árbol generador', 'Shortest paths and spanning trees'),
     ('Dijkstra paso a paso con la tabla del examen («coste,vértice», «-» y «*»), tu tabla comparada casilla a casilla, y Kruskal y Prim para el árbol generador mínimo', 'Dijkstra step by step with the exam table («cost,vertex», «-» and «*»), your own table checked cell by cell, and Kruskal and Prim for the minimum spanning tree'),
     ('--guaguas escaleritas-tafira', '--buses escaleritas-tafira'),
     ('El simulador necesita JavaScript. Ejemplo: en el grafo de las guaguas, el camino mínimo de Escaleritas al Campus de Tafira pasa por Siete Palmas y Tamaraceite y cuesta 25, menos que la línea directa (28).', 'The simulator needs JavaScript. Example: in the bus graph, the shortest path from Escaleritas to the Tafira campus goes through Siete Palmas and Tamaraceite and costs 25, less than the direct line (28).')),
]
info = ''
for es, en, sc, cmd, eng, ico, d, home, demo, ns in INFO:
    info += f"\t\t{q(es)} => array(\n\t\t\t'cmd'  => array( {q(cmd[0])}, {q(cmd[1])} ),\n\t\t\t'eng'  => {q(eng)},\n\t\t\t'ico'  => {q(ico)},\n\t\t\t'd'    => array( {q(d[0])}, {q(d[1])} ),\n\t\t\t'home' => array( {q(home[0])}, {q(home[1])} ),\n\t\t\t'demo' => array( {q(demo[0])}, {q(demo[1])} ),\n\t\t\t'sc'   => {q(sc)},\n\t\t),\n"
nsr = ''.join(f"\t\t{q(sc)} => array( {q(ns[0])}, {q(ns[1])} ),\n" for es, en, sc, cmd, eng, ico, d, home, demo, ns in INFO)
ens = ''.join(f"{q(es)} => {q(en)}, " for es, en, *r in INFO)
PHP = r"""/**
 * SergioLearns — simulador Caminos mínimos y árbol generador de MD (v97, 19 nov 2026, hoja de ruta 7.15, conversación 2 de MD).
 * Dijkstra paso a paso con la tabla del examen de problemas de aula («coste,vértice», «-» para infinito, «*» para los cerrados),
 * «Rellenar mi tabla» para comparar la tuya casilla a casilla, y Kruskal y Prim paso a paso para el árbol generador mínimo.
 * Kit v2 en diseño D: lecciones con «¿Qué crees que pasa?» (las guaguas de Gran Canaria y el grafo tipo examen), tu grafo en
 * modo libre y «Ponte a prueba» por niveles con los temas 4 y 5. Fuente: sergiolearns-codigo/herramientas/simuladores/md/
 * (engine-cm.js, comun-md.js, ui-cm.js, cm.css y ../ag/ag.css; pruebas: test-cm.js). Aquí va minificado.
 * Necesita «simuladores» (módulo 89: sl6_css, sl6_css7, sl6_link) y se registra en sl6_info() y sl6_mini() (ganchos v97 en la parte 22).
 * Shortcode [sl_sim_cm]. Mientras SL_V97_PUBLICO sea false, solo lo ve el administrador con ?sl_v97=1
 * (cookie; ?sl_v97=0 la quita). Fragmento temporal: el cierre de MD lo une al módulo 89. Sin emoticonos.
 */
if ( ! defined( 'SL_V97_PUBLICO' ) ) {
	define( 'SL_V97_PUBLICO', __PUB__ );
}
add_filter( 'litespeed_vary_cookies', function ( $l ) { $l[] = 'sl_v97'; return $l; } );
function sl_v97() {
	static $on = null;
	if ( null !== $on ) {
		return $on;
	}
	if ( ! function_exists( 'sl_v6' ) || ! sl_v6() ) {
		return $on = false;
	}
	if ( SL_V97_PUBLICO ) {
		return $on = true;
	}
	if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
		return $on = false;
	}
	if ( isset( $_GET['sl_v97'] ) ) {
		$v = ( '1' === $_GET['sl_v97'] );
		if ( ! headers_sent() ) {
			setcookie( 'sl_v97', $v ? '1' : '', $v ? time() + 30 * DAY_IN_SECONDS : time() - 3600, COOKIEPATH ? COOKIEPATH : '/', COOKIE_DOMAIN, is_ssl(), true );
		}
		return $on = $v;
	}
	return $on = ! empty( $_COOKIE['sl_v97'] );
}
add_action( 'init', 'sl_v97', 1 );
function sl97_ids() {
	return array( 'cm' );
}
/** Registro (por el slug ES de su página), con el formato de sl6_info(). */
function sl97_info() {
	return array(
__INFO__	);
}
function sl97_en_slugs() {
	return array( __ENS__);
}
// Vista previa: el administrador ve las páginas privadas en el htop, el menú y la portada.
add_filter( 'sl4_lab_preview', function ( $v ) {
	return $v || ( sl_v97() && ! SL_V97_PUBLICO && current_user_can( 'edit_pages' ) );
} );
function sl97_slugs() {
	return array( 'teoria-de-grafos', 'teoria-de-grafos-practica', 'teoria-de-grafos-ejercicios', 'graph-theory', 'graph-theory-practice', 'graph-theory-exercises' );
}
/** Id de una entrada por su slug (0 si no existe); sl6_link ya descarta las que no están publicadas. */
function sl97_pid( $slug ) {
	static $c = array();
	if ( ! isset( $c[ $slug ] ) ) {
		$p          = get_page_by_path( $slug, OBJECT, 'post' );
		$c[ $slug ] = $p ? (int) $p->ID : 0;
	}
	return $c[ $slug ];
}
function sl97_links( $id, $en ) {
	$L = array(
		'cm' => array(
			array( $en ? sl97_pid( 'graph-theory' ) : sl97_pid( 'teoria-de-grafos' ), '', $en ? 'Graph theory' : 'Teoría de grafos', $en ? 'Paths, Euler, Hamilton and Dijkstra' : 'Caminos, Euler, Hamilton y Dijkstra', 'book' ),
			array( $en ? sl97_pid( 'graph-theory-practice' ) : sl97_pid( 'teoria-de-grafos-practica' ), '', $en ? 'Graph theory, step by step' : 'Teoría de grafos paso a paso', $en ? 'Guided practice with Python and an exam Dijkstra' : 'Práctica guiada con Python y un Dijkstra de examen', 'pen' ),
			array( $en ? sl97_pid( 'graph-theory-exercises' ) : sl97_pid( 'teoria-de-grafos-ejercicios' ), '', $en ? 'Graph theory exercises' : 'Ejercicios de teoría de grafos', $en ? 'Exam style, with a 20-question quiz' : 'Tipo examen, con un test de 20', 'exam' ),
		),
	);
	$out = array();
	foreach ( isset( $L[ $id ] ) ? $L[ $id ] : array() as $x ) {
		$out[] = function_exists( 'sl6_link' ) ? sl6_link( $x[0], $x[1], $x[2], $x[3], $x[4] ) : null;
	}
	return array_values( array_filter( $out ) );
}
// Cuando se publica un artículo enlazado en «Sigue aprendiendo», se purgan las páginas del simulador.
add_action( 'transition_post_status', function ( $new, $old, $post ) {
	if ( 'publish' === $new && 'publish' !== $old && 'post' === $post->post_type && in_array( $post->post_name, sl97_slugs(), true ) ) {
		foreach ( get_pages( array( 'post_status' => 'publish' ) ) as $pg ) {
			if ( false !== strpos( $pg->post_content, '[sl_sim_cm' ) ) {
				do_action( 'litespeed_purge_post', $pg->ID );
			}
		}
	}
}, 10, 3 );
add_shortcode( 'sl_sim_cm', function ( $atts ) {
	$a  = shortcode_atts( array( 'id' => 'cm' ), $atts );
	$id = $a['id'];
	if ( ! sl_v97() || ! in_array( $id, sl97_ids(), true ) || ! function_exists( 'sl6_css' ) ) {
		return '';
	}
	$en = function_exists( 'sl6_en' ) ? sl6_en() : false;
	$ns = array(
__NS__	);
	$GLOBALS['sl97_need'][ $id ] = true;
	$h  = '<div class="sl-sim" data-sim="' . esc_attr( $id ) . '" data-lang="' . ( $en ? 'en' : 'es' ) . '" data-links="' . esc_attr( wp_json_encode( sl97_links( $id, $en ) ) ) . '">';
	$h .= '<noscript><p>' . esc_html( $ns[ $id ][ $en ? 1 : 0 ] ) . '</p></noscript></div>';
	return $h . sl6_css() . ( function_exists( 'sl6_css7' ) ? sl6_css7() : '' ) . sl97_css();
} );
function sl97_css() {
	static $done = false;
	if ( $done ) {
		return '';
	}
	$done = true;
	return '<style id="sl97-css">' . <<<'SL97CSS'
__CSS__
SL97CSS
	. '</style>';
}
add_action( 'wp_footer', function () {
	if ( empty( $GLOBALS['sl97_need'] ) ) {
		return;
	}
	echo '<script id="sl97-js">' . <<<'SL97JS'
__JS__
SL97JS
	. '</script>';
}, 41 );

/* ------------------------------------------------------------------ animaciones de las tarjetas (las pide sl6_mini, v81) */
function sl97_mini( $slug ) {
	if ( ! sl_v97() || ! function_exists( 'sl19_tl' ) || ! function_exists( 'sl19_tx' ) ) {
		return '';
	}
	if ( 'caminos-minimos' !== $slug ) {
		return '';
	}
	// Las guaguas: Escaleritas (a) a Tafira (g). Primero el grafo con sus pesos; luego se enciende a-e-f-g (25) y se tacha la directa (28).
	$V = array( 'a' => array( 16, 40 ), 'e' => array( 52, 78 ), 'f' => array( 92, 78 ), 'g' => array( 106, 30 ), 'b' => array( 56, 14 ) );
	$E = array( array( 'a', 'b', '7' ), array( 'b', 'g', '' ), array( 'a', 'e', '6' ), array( 'e', 'f', '5' ), array( 'f', 'g', '14' ), array( 'e', 'g', '22' ) );
	$g = '';
	foreach ( $E as $x ) {
		list( $x1, $y1 ) = $V[ $x[0] ];
		list( $x2, $y2 ) = $V[ $x[1] ];
		$g .= '<line x1="' . $x1 . '" y1="' . $y1 . '" x2="' . $x2 . '" y2="' . $y2 . '" stroke="#4A4566" stroke-width="1.4"' . ( '' === $x[2] ? ' stroke-dasharray="3 3"' : '' ) . '/>';
		if ( '' !== $x[2] ) {
			$g .= '<text x="' . round( ( $x1 + $x2 ) / 2 + 3, 1 ) . '" y="' . round( ( $y1 + $y2 ) / 2 - 3, 1 ) . '" font-size="8" fill="#8F8AAD" font-family="monospace">' . $x[2] . '</text>';
		}
	}
	foreach ( $V as $k => $p ) {
		$g .= '<circle cx="' . $p[0] . '" cy="' . $p[1] . '" r="5" fill="#1E1B2E" stroke="#A99EF5" stroke-width="1.4"/>';
	}
	$it = array( array( 'm' => $g, 'a' => 1, 'b' => 92 ) );
	$path = array( array( 'a', 'e' ), array( 'e', 'f' ), array( 'f', 'g' ) );
	foreach ( $path as $n => $x ) {
		list( $x1, $y1 ) = $V[ $x[0] ];
		list( $x2, $y2 ) = $V[ $x[1] ];
		$it[] = array( 'm' => '<line x1="' . $x1 . '" y1="' . $y1 . '" x2="' . $x2 . '" y2="' . $y2 . '" stroke="#FF6B4A" stroke-width="2.4"/><circle cx="' . $x2 . '" cy="' . $y2 . '" r="5" fill="#FF6B4A"/>', 'a' => 10 + 12 * $n, 'b' => 92, 'g' => 1 );
	}
	$it[] = array( 'm' => '<circle cx="16" cy="40" r="5" fill="#FF6B4A"/>', 'a' => 8, 'b' => 92 );
	$it[] = array( 'm' => '<line x1="74" y1="46" x2="86" y2="58" stroke="#FF9B80" stroke-width="1.4"/><line x1="86" y1="46" x2="74" y2="58" stroke="#FF9B80" stroke-width="1.4"/>', 'a' => 50, 'b' => 92 );
	$it[] = array( 'm' => sl19_tx( 124, 30, array( array( 'a → g', '#E8E6F5' ) ), 10 ), 'a' => 4, 'b' => 92 );
	$it[] = array( 'm' => sl19_tx( 124, 52, array( array( '6+5+14 = ', '#A99EF5' ), array( '25', '#FF9B80' ) ), 10 ), 'a' => 44, 'b' => 92 );
	$it[] = array( 'm' => sl19_tx( 124, 74, array( array( 'directa: 28', '#8F8AAD' ) ), 10 ), 'a' => 54, 'b' => 92 );
	return sl19_tl( 'm97c', $it, 250 );
}
"""
PHP = PHP.replace('__PUB__', pub).replace('__INFO__', info).replace('__ENS__', ens).replace('__NS__', nsr).replace('__CSS__', CSS).replace('__JS__', JS)
open(sys.argv[1], 'w', encoding='utf-8').write(PHP)
print('fragmento', len(PHP), 'JS', len(JS), 'CSS', len(CSS))
