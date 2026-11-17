"""Monta el fragmento «SergioLearns — simulador Gauss-Jordan de AG» (v87) con el JS y el CSS minificados (esbuild).
Uso: python3 build-87.py salida.php [--publico]   (el kit v2 de ../comun/kit2.js va dentro: punteros lo trae en su paquete)"""
import subprocess, sys, os
H = os.path.dirname(os.path.abspath(__file__))
def mini(args, inp):
    return subprocess.run(['npx', '--yes', 'esbuild', '--minify', *args], input=inp, capture_output=True, text=True, check=True).stdout.strip()
rd = lambda p: open(os.path.join(H, p), encoding='utf-8').read()
JS = mini(['--loader=js', '--target=es2020'], '\n'.join(rd(p) for p in ['../comun/kit2.js', 'engine-gj.js', 'comun-ag.js', 'ui-gj.js']))
CSS = mini(['--loader=css'], rd('ag.css'))
for v in (JS, CSS):
    for bad in ('SL87JS', 'SL87CSS'):
        assert bad not in v
pub = 'true' if '--publico' in sys.argv else 'false'
q = lambda x: "'" + x.replace('\\', '\\\\').replace("'", "\\'") + "'"
INFO = [
    ('gauss-jordan', 'gauss-jordan', 'gj', ('gauss-jordan', 'gauss-jordan'), 'MATLAB · rref', 'ag',
     ('Gauss-Jordan paso a paso', 'Gauss-Jordan step by step'),
     ('Escalona cualquier matriz con fracciones exactas: cada operación elemental con su orden de MATLAB, el rango, Rouché-Frobenius, la inversa y el determinante', 'Row reduce any matrix with exact fractions: every elementary operation with its MATLAB command, the rank, Rouché-Frobenius, the inverse and the determinant'),
     ('--sistema batido', '--system shake'),
     ('El simulador necesita JavaScript. Ejemplo: el sistema 4x + 6y + z = 15, 18x + 10y + 24z = 70, 2x + 3y = 7 tiene rg(A) = rg(A | B) = 3 y su única solución es x = 2, y = 1, z = 1.', 'The simulator needs JavaScript. Example: the system 4x + 6y + z = 15, 18x + 10y + 24z = 70, 2x + 3y = 7 has rg(A) = rg(A | B) = 3 and its only solution is x = 2, y = 1, z = 1.')),
]
info = ''
for es, en, sc, cmd, eng, ico, d, home, demo, ns in INFO:
    info += f"\t\t{q(es)} => array(\n\t\t\t'cmd'  => array( {q(cmd[0])}, {q(cmd[1])} ),\n\t\t\t'eng'  => {q(eng)},\n\t\t\t'ico'  => {q(ico)},\n\t\t\t'd'    => array( {q(d[0])}, {q(d[1])} ),\n\t\t\t'home' => array( {q(home[0])}, {q(home[1])} ),\n\t\t\t'demo' => array( {q(demo[0])}, {q(demo[1])} ),\n\t\t\t'sc'   => {q(sc)},\n\t\t),\n"
nsr = ''.join(f"\t\t{q(sc)} => array( {q(ns[0])}, {q(ns[1])} ),\n" for es, en, sc, cmd, eng, ico, d, home, demo, ns in INFO)
ens = ''.join(f"{q(es)} => {q(en)}, " for es, en, *r in INFO)
PHP = r"""/**
 * SergioLearns — simulador Gauss-Jordan paso a paso de AG (v87, 17 nov 2026, hoja de ruta 7.13). Escalona cualquier matriz con
 * fracciones exactas (BigInt), cada operación elemental con su orden de MATLAB, y termina con rango y Rouché-Frobenius,
 * la inversa por (A | I) o el determinante. Kit v2 en diseño D, como los de ME1: lecciones con «¿Qué crees que pasa?»,
 * tu matriz en modo libre y «Ponte a prueba» por niveles. Fuente: sergiolearns-codigo/herramientas/simuladores/ag/
 * (engine-gj.js, comun-ag.js, ui-gj.js, ag.css; pruebas: test-gj.js). Aquí va minificado.
 * Necesita «simuladores» (módulo 89: sl6_css, sl6_css7, sl6_link) y se registra en sl6_info() y sl6_mini() (sus ganchos v87).
 * Shortcode [sl_sim_ag id="gj"]. Mientras SL_V87_PUBLICO sea false, solo lo ve el administrador con ?sl_v87=1
 * (cookie; ?sl_v87=0 la quita). Sin emoticonos.
 */
if ( ! defined( 'SL_V87_PUBLICO' ) ) {
	define( 'SL_V87_PUBLICO', __PUB__ );
}
add_filter( 'litespeed_vary_cookies', function ( $l ) { $l[] = 'sl_v87'; return $l; } );
function sl_v87() {
	static $on = null;
	if ( null !== $on ) {
		return $on;
	}
	if ( ! function_exists( 'sl_v6' ) || ! sl_v6() ) {
		return $on = false;
	}
	if ( SL_V87_PUBLICO ) {
		return $on = true;
	}
	if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
		return $on = false;
	}
	if ( isset( $_GET['sl_v87'] ) ) {
		$v = ( '1' === $_GET['sl_v87'] );
		if ( ! headers_sent() ) {
			setcookie( 'sl_v87', $v ? '1' : '', $v ? time() + 30 * DAY_IN_SECONDS : time() - 3600, COOKIEPATH ? COOKIEPATH : '/', COOKIE_DOMAIN, is_ssl(), true );
		}
		return $on = $v;
	}
	return $on = ! empty( $_COOKIE['sl_v87'] );
}
add_action( 'init', 'sl_v87', 1 );
function sl87_ids() {
	return array( 'gj' );
}
/** Registro (por el slug ES de su página), con el formato de sl6_info(). */
function sl87_info() {
	return array(
__INFO__	);
}
function sl87_en_slugs() {
	return array( __ENS__);
}
// Vista previa: el administrador ve las páginas privadas en el htop, el menú y la portada.
add_filter( 'sl4_lab_preview', function ( $v ) {
	return $v || ( sl_v87() && ! SL_V87_PUBLICO && current_user_can( 'edit_pages' ) );
} );
function sl87_links( $id, $en ) {
	$L = array(
		'gj' => array(
			array( 7583, '', $en ? 'Systems of linear equations' : 'Sistemas de ecuaciones lineales', $en ? 'Gauss, Gauss-Jordan and Rouché-Frobenius' : 'Gauss, Gauss-Jordan y Rouché-Frobenius', 'book' ),
			array( 7584, '', $en ? 'Systems, step by step' : 'Sistemas paso a paso', $en ? 'Guided practice with MATLAB' : 'Práctica guiada con MATLAB', 'pen' ),
			array( 7585, '', $en ? 'Systems exercises' : 'Ejercicios de sistemas', $en ? 'Exam style, with a 20-question quiz' : 'Tipo examen, con un test de 20', 'exam' ),
			array( 7574, '', $en ? 'Matrices and determinants' : 'Matrices y determinantes', $en ? 'Rank, inverse, Sarrus and cofactors' : 'Rango, inversa, Sarrus y cofactores', 'book' ),
			array( 7576, '', $en ? 'Matrices exercises' : 'Ejercicios de matrices', $en ? 'Exam style, with a 20-question quiz' : 'Tipo examen, con un test de 20', 'exam' ),
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
	if ( 'publish' === $new && 'publish' !== $old && in_array( (int) $post->ID, array( 7574, 7577, 7576, 7581, 7583, 7586, 7584, 7588, 7585, 7590 ), true ) ) {
		foreach ( get_pages( array( 'post_status' => 'publish' ) ) as $pg ) {
			if ( false !== strpos( $pg->post_content, '[sl_sim_ag' ) ) {
				do_action( 'litespeed_purge_post', $pg->ID );
			}
		}
	}
}, 10, 3 );
add_shortcode( 'sl_sim_ag', function ( $atts ) {
	$a  = shortcode_atts( array( 'id' => 'gj' ), $atts );
	$id = $a['id'];
	if ( ! sl_v87() || ! in_array( $id, sl87_ids(), true ) || ! function_exists( 'sl6_css' ) ) {
		return '';
	}
	$en = function_exists( 'sl6_en' ) ? sl6_en() : false;
	$ns = array(
__NS__	);
	$GLOBALS['sl87_need'][ $id ] = true;
	$h  = '<div class="sl-sim" data-sim="' . esc_attr( $id ) . '" data-lang="' . ( $en ? 'en' : 'es' ) . '" data-links="' . esc_attr( wp_json_encode( sl87_links( $id, $en ) ) ) . '">';
	$h .= '<noscript><p>' . esc_html( $ns[ $id ][ $en ? 1 : 0 ] ) . '</p></noscript></div>';
	return $h . sl6_css() . ( function_exists( 'sl6_css7' ) ? sl6_css7() : '' ) . sl87_css();
} );
function sl87_css() {
	static $done = false;
	if ( $done ) {
		return '';
	}
	$done = true;
	return '<style id="sl87-css">' . <<<'SL87CSS'
__CSS__
SL87CSS
	. '</style>';
}
add_action( 'wp_footer', function () {
	if ( empty( $GLOBALS['sl87_need'] ) ) {
		return;
	}
	echo '<script id="sl87-js">' . <<<'SL87JS'
__JS__
SL87JS
	. '</script>';
}, 41 );

/* ------------------------------------------------------------------ animaciones de las tarjetas (las pide sl6_mini, v81) */
function sl87_mini( $slug ) {
	if ( ! sl_v87() || ! function_exists( 'sl19_tl' ) || ! function_exists( 'sl19_tx' ) ) {
		return '';
	}
	if ( 'gauss-jordan' !== $slug ) {
		return '';
	}
	// Una ampliada 3×4: la fila 2 se transforma (coral) hasta tener su cero bajo el pivote; al final, la clasificación.
	$A  = array( array( '4', '6', '1', '15' ), array( '18', '10', '24', '70' ), array( '2', '3', '0', '7' ) );
	$B  = array( '0', '−17', '39/2', '5/2' );
	$it = array( array( 'm' => '<line x1="168" y1="6" x2="168" y2="70" stroke="#4A4566" stroke-width="1.6"/>', 'a' => 1, 'b' => 92 ) );
	foreach ( $A as $i => $row ) {
		foreach ( $row as $j => $v ) {
			$x    = 18 + $j * 50 + ( $j > 2 ? 8 : 0 );
			$y    = 8 + $i * 22;
			$hot  = ( 1 === $i );
			$it[] = array( 'm' => '<rect x="' . $x . '" y="' . $y . '" width="42" height="18" rx="4" fill="' . ( $hot ? '#3A2E3A' : '#2A2640' ) . '" stroke="' . ( 0 === $i && 0 === $j ? '#A99EF5' : ( $hot ? '#FF6B4A' : '#3A3554' ) ) . '"/>' . sl19_tx( $x + 21 - 3 * mb_strlen( $v ), $y + 13, array( array( $v, '#E8E6F5' ) ), 10 ), 'a' => 2 + $i * 3, 'b' => $hot ? 44 : 92, 'g' => 1 );
			if ( $hot ) {
				$it[] = array( 'm' => '<rect x="' . $x . '" y="' . $y . '" width="42" height="18" rx="4" fill="#3A2E3A" stroke="#FF6B4A"/>' . sl19_tx( $x + 21 - 3 * mb_strlen( $B[ $j ] ), $y + 13, array( array( $B[ $j ], 0 === $j ? '#FF9B80' : '#E8E6F5' ) ), 10 ), 'a' => 46 + $j * 3, 'b' => 92, 'g' => 1 );
			}
		}
	}
	$it[] = array( 'm' => sl19_tx( 18, 88, array( array( 'f₂ → f₂ − 9/2·f₁', '#FF9B80' ) ), 10 ), 'a' => 30, 'b' => 92 );
	$it[] = array( 'm' => sl19_tx( 150, 88, array( array( 'rg 3 · CD', '#A99EF5' ) ), 10 ), 'a' => 64, 'b' => 92 );
	return sl19_tl( 'm87g', $it, 250 );
}
"""
PHP = PHP.replace('__PUB__', pub).replace('__INFO__', info).replace('__ENS__', ens).replace('__NS__', nsr).replace('__CSS__', CSS).replace('__JS__', JS)
open(sys.argv[1], 'w', encoding='utf-8').write(PHP)
print('fragmento', len(PHP), 'JS', len(JS), 'CSS', len(CSS))
