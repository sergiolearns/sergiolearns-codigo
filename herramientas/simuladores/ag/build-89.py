"""Monta el fragmento «SergioLearns — simulador Plano complejo de AG» (v89) con el JS y el CSS minificados (esbuild).
Uso: python3 build-89.py salida.php ids.json [--publico]   (ids.json: los id de las entradas del tema 7 en ES, {"t":…,"p":…,"e":…})   (el kit v2 de ../comun/kit2.js va dentro: punteros lo trae en su paquete)"""
import subprocess, sys, os
H = os.path.dirname(os.path.abspath(__file__))
def mini(args, inp):
    return subprocess.run(['npx', '--yes', 'esbuild', '--minify', *args], input=inp, capture_output=True, text=True, check=True).stdout.strip()
rd = lambda p: open(os.path.join(H, p), encoding='utf-8').read()
JS = mini(['--loader=js', '--target=es2020'], '\n'.join(rd(p) for p in ['../comun/kit2.js', 'engine-pc.js', 'comun-ag.js', 'ui-pc.js']))
CSS = mini(['--loader=css'], rd('ag.css') + rd('pc.css'))
import json
IDS = json.load(open(sys.argv[2]))
for v in (JS, CSS):
    for bad in ('SL89JS', 'SL89CSS'):
        assert bad not in v
pub = 'true' if '--publico' in sys.argv else 'false'
q = lambda x: "'" + x.replace('\\', '\\\\').replace("'", "\\'") + "'"
INFO = [
    ('plano-complejo', 'complex-plane', 'pc', ('plano-complejo', 'complex-plane'), 'MATLAB · abs, angle', 'complejo',
     ('Plano complejo', 'Complex plane'),
     ('Un complejo en binómica y en polar a la vez: la suma como paralelogramo, el producto como giro y escala, las potencias de De Moivre y las raíces n-ésimas como polígono', 'A complex number in binomial and polar form at once: the sum as a parallelogram, the product as a turn and a scale, De Moivre powers and nth roots as a polygon'),
     ('--noria seis-cabinas', '--wheel six-cabins'),
     ('El simulador necesita JavaScript. Ejemplo: z = √3 + i tiene módulo 2 y argumento 30°, así que en polar es 2 con ángulo 30°; multiplicarlo por i lo gira 90°, y sus potencias sextas dan −64.', 'The simulator needs JavaScript. Example: z = √3 + i has modulus 2 and argument 30°, so in polar form it is 2 at 30°; multiplying it by i turns it 90°, and its sixth power is −64.')),
]
info = ''
for es, en, sc, cmd, eng, ico, d, home, demo, ns in INFO:
    info += f"\t\t{q(es)} => array(\n\t\t\t'cmd'  => array( {q(cmd[0])}, {q(cmd[1])} ),\n\t\t\t'eng'  => {q(eng)},\n\t\t\t'ico'  => {q(ico)},\n\t\t\t'd'    => array( {q(d[0])}, {q(d[1])} ),\n\t\t\t'home' => array( {q(home[0])}, {q(home[1])} ),\n\t\t\t'demo' => array( {q(demo[0])}, {q(demo[1])} ),\n\t\t\t'sc'   => {q(sc)},\n\t\t),\n"
nsr = ''.join(f"\t\t{q(sc)} => array( {q(ns[0])}, {q(ns[1])} ),\n" for es, en, sc, cmd, eng, ico, d, home, demo, ns in INFO)
ens = ''.join(f"{q(es)} => {q(en)}, " for es, en, *r in INFO)
PHP = r"""/**
 * SergioLearns — simulador Plano complejo de AG (v89, 18 nov 2026, hoja de ruta 7.13, tanda 4). Un complejo en binómica y
 * polar a la vez (módulo, argumento por cuadrantes, trigonométrica y exponencial), la suma como paralelogramo, el producto como
 * giro y escala, el cociente como giro al revés, las potencias de De Moivre y las raíces n-ésimas como polígono. Kit v2 en diseño D, como los de ME1: lecciones con «¿Qué crees que pasa?»,
 * tu matriz en modo libre y «Ponte a prueba» por niveles. Fuente: sergiolearns-codigo/herramientas/simuladores/ag/
 * (engine-pc.js, comun-ag.js, ui-pc.js, ag.css y pc.css; pruebas: test-pc.js). Aquí va minificado.
 * Necesita «simuladores» (módulo 89: sl6_css, sl6_css7, sl6_link) y se registra en sl6_info() y sl6_mini() (con sus ganchos v89, como los del v87).
 * Shortcode [sl_sim_pc] (el [sl_sim_ag] es del v87). Mientras SL_V89_PUBLICO sea false, solo lo ve el administrador con ?sl_v89=1
 * (cookie; ?sl_v89=0 la quita). Sin emoticonos.
 */
if ( ! defined( 'SL_V89_PUBLICO' ) ) {
	define( 'SL_V89_PUBLICO', __PUB__ );
}
add_filter( 'litespeed_vary_cookies', function ( $l ) { $l[] = 'sl_v89'; return $l; } );
function sl_v89() {
	static $on = null;
	if ( null !== $on ) {
		return $on;
	}
	if ( ! function_exists( 'sl_v6' ) || ! sl_v6() ) {
		return $on = false;
	}
	if ( SL_V89_PUBLICO ) {
		return $on = true;
	}
	if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
		return $on = false;
	}
	if ( isset( $_GET['sl_v89'] ) ) {
		$v = ( '1' === $_GET['sl_v89'] );
		if ( ! headers_sent() ) {
			setcookie( 'sl_v89', $v ? '1' : '', $v ? time() + 30 * DAY_IN_SECONDS : time() - 3600, COOKIEPATH ? COOKIEPATH : '/', COOKIE_DOMAIN, is_ssl(), true );
		}
		return $on = $v;
	}
	return $on = ! empty( $_COOKIE['sl_v89'] );
}
add_action( 'init', 'sl_v89', 1 );
function sl89_ids() {
	return array( 'pc' );
}
/** Registro (por el slug ES de su página), con el formato de sl6_info(). */
function sl89_info() {
	return array(
__INFO__	);
}
function sl89_en_slugs() {
	return array( __ENS__);
}
// Vista previa: el administrador ve las páginas privadas en el htop, el menú y la portada.
add_filter( 'sl4_lab_preview', function ( $v ) {
	return $v || ( sl_v89() && ! SL_V89_PUBLICO && current_user_can( 'edit_pages' ) );
} );
function sl89_links( $id, $en ) {
	$L = array(
		'pc' => array(
			array( __T__, '', $en ? 'Complex numbers' : 'Números complejos', $en ? 'Binomial, polar, De Moivre and nth roots' : 'Binómica, polar, De Moivre y raíces n-ésimas', 'book' ),
			array( __P__, '', $en ? 'Complex numbers, step by step' : 'Números complejos paso a paso', $en ? 'Guided practice with MATLAB' : 'Práctica guiada con MATLAB', 'pen' ),
			array( __E__, '', $en ? 'Complex numbers exercises' : 'Ejercicios de números complejos', $en ? 'Exam style, with a 20-question quiz' : 'Tipo examen, con un test de 20', 'exam' ),
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
	if ( 'publish' === $new && 'publish' !== $old && in_array( (int) $post->ID, array( __ALL__ ), true ) ) {
		foreach ( get_pages( array( 'post_status' => 'publish' ) ) as $pg ) {
			if ( false !== strpos( $pg->post_content, '[sl_sim_pc' ) ) {
				do_action( 'litespeed_purge_post', $pg->ID );
			}
		}
	}
}, 10, 3 );
add_shortcode( 'sl_sim_pc', function ( $atts ) {
	$a  = shortcode_atts( array( 'id' => 'pc' ), $atts );
	$id = $a['id'];
	if ( ! sl_v89() || ! in_array( $id, sl89_ids(), true ) || ! function_exists( 'sl6_css' ) ) {
		return '';
	}
	$en = function_exists( 'sl6_en' ) ? sl6_en() : false;
	$ns = array(
__NS__	);
	$GLOBALS['sl89_need'][ $id ] = true;
	$h  = '<div class="sl-sim" data-sim="' . esc_attr( $id ) . '" data-lang="' . ( $en ? 'en' : 'es' ) . '" data-links="' . esc_attr( wp_json_encode( sl89_links( $id, $en ) ) ) . '">';
	$h .= '<noscript><p>' . esc_html( $ns[ $id ][ $en ? 1 : 0 ] ) . '</p></noscript></div>';
	return $h . sl6_css() . ( function_exists( 'sl6_css7' ) ? sl6_css7() : '' ) . sl89_css();
} );
function sl89_css() {
	static $done = false;
	if ( $done ) {
		return '';
	}
	$done = true;
	return '<style id="sl89-css">' . <<<'SL89CSS'
__CSS__
SL89CSS
	. '</style>';
}
add_action( 'wp_footer', function () {
	if ( empty( $GLOBALS['sl89_need'] ) ) {
		return;
	}
	echo '<script id="sl89-js">' . <<<'SL89JS'
__JS__
SL89JS
	. '</script>';
}, 41 );

/* ------------------------------------------------------------------ animaciones de las tarjetas (las pide sl6_mini, v81) */
function sl89_mini( $slug ) {
	if ( ! sl_v89() || ! function_exists( 'sl19_tl' ) || ! function_exists( 'sl19_tx' ) ) {
		return '';
	}
	if ( 'plano-complejo' !== $slug ) {
		return '';
	}
	// Las seis raíces sextas de −64 (las cabinas de la noria) van saliendo una a una; después, el hexágono y el giro de z·i.
	$cx = 62;
	$cy = 48;
	$r  = 34;
	$it = array(
		array( 'm' => '<line x1="18" y1="48" x2="106" y2="48" stroke="#4A4566" stroke-width="1.2"/><line x1="62" y1="6" x2="62" y2="90" stroke="#4A4566" stroke-width="1.2"/><circle cx="62" cy="48" r="34" fill="none" stroke="#A99EF5" stroke-opacity=".5" stroke-dasharray="4 4"/>', 'a' => 1, 'b' => 92 ),
	);
	$pts = array();
	for ( $k = 0; $k < 6; $k++ ) {
		$an    = deg2rad( 30 + 60 * $k );
		$x     = round( $cx + $r * cos( $an ), 1 );
		$y     = round( $cy - $r * sin( $an ), 1 );
		$pts[] = $x . ',' . $y;
		$it[]  = array( 'm' => '<line x1="62" y1="48" x2="' . $x . '" y2="' . $y . '" stroke="' . ( 0 === $k ? '#FF6B4A' : '#A99EF5' ) . '" stroke-width="1.6"/><circle cx="' . $x . '" cy="' . $y . '" r="3.6" fill="' . ( 0 === $k ? '#FF6B4A' : '#A99EF5' ) . '"/>', 'a' => 6 + $k * 6, 'b' => 92, 'g' => 1 );
	}
	$it[] = array( 'm' => '<polygon points="' . implode( ' ', $pts ) . '" fill="#A99EF5" fill-opacity=".14" stroke="#A99EF5" stroke-width="1.4"/>', 'a' => 44, 'b' => 92 );
	$it[] = array( 'm' => sl19_tx( 124, 30, array( array( 'z = √3 + i', '#FF9B80' ) ), 10 ), 'a' => 6, 'b' => 92 );
	$it[] = array( 'm' => sl19_tx( 124, 52, array( array( '2', '#E8E6F5' ), array( ' · 30°', '#A99EF5' ) ), 10 ), 'a' => 18, 'b' => 92 );
	$it[] = array( 'm' => sl19_tx( 124, 74, array( array( 'z⁶ = −64', '#A99EF5' ) ), 10 ), 'a' => 48, 'b' => 92 );
	return sl19_tl( 'm89c', $it, 250 );
}
"""
PHP = PHP.replace('__T__', str(IDS['t'])).replace('__P__', str(IDS['p'])).replace('__E__', str(IDS['e'])).replace('__ALL__', ', '.join(str(x) for x in IDS['all'])).replace('__PUB__', pub).replace('__INFO__', info).replace('__ENS__', ens).replace('__NS__', nsr).replace('__CSS__', CSS).replace('__JS__', JS)
open(sys.argv[1], 'w', encoding='utf-8').write(PHP)
print('fragmento', len(PHP), 'JS', len(JS), 'CSS', len(CSS))
