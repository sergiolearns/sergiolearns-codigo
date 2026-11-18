"""Monta el fragmento «SergioLearns — simulador Transformaciones en el plano de AG» (v88) con el JS y el CSS minificados (esbuild).
Uso: python3 build-88.py salida.php [--publico] [--ids t5t,t5p,t5e,t6t,t6p,t6e] [--en <los 6 EN>]
El kit v2 (../comun/kit2.js) y la tarjeta de AG (comun-ag.js) van dentro, como en el v87: la página del simulador solo carga
este fragmento. Con --ids, los artículos de los temas 5 y 6 (ES) salen en «Sigue aprendiendo» (sl6_link pone el EN)."""
import subprocess, sys, os
H = os.path.dirname(os.path.abspath(__file__))
def mini(args, inp):
    return subprocess.run(['npx', '--yes', 'esbuild', '--minify', *args], input=inp, capture_output=True, text=True, check=True).stdout.strip()
rd = lambda p: open(os.path.join(H, p), encoding='utf-8').read()
JS = mini(['--loader=js', '--target=es2020'], '\n'.join(rd(p) for p in ['../comun/kit2.js', 'engine-tp.js', 'comun-ag.js', 'ui-tp.js']))
CSS = mini(['--loader=css'], rd('ag.css').split('/* ---- Gauss-Jordan paso a paso */')[0] + rd('tp.css'))   # la base de AG (m1-*) y lo propio (tp-*)
for v in (JS, CSS):
    for bad in ('SL88JS', 'SL88CSS'):
        assert bad not in v
pub = 'true' if '--publico' in sys.argv else 'false'
ids, enids = [0] * 6, []
if '--ids' in sys.argv:
    ids = [int(x) for x in sys.argv[sys.argv.index('--ids') + 1].split(',')]
if '--en' in sys.argv:   # los EN también purgan las páginas al publicarse
    enids = [int(x) for x in sys.argv[sys.argv.index("--en") + 1].split(",")]
q = lambda x: "'" + x.replace('\\', '\\\\').replace("'", "\\'") + "'"
INFO = [
    ('transformaciones-en-el-plano', 'plane-transformations', 'tp', ('transforma', 'transform'), 'MATLAB · eig', 'ag',
     ('Transformaciones en el plano', 'Plane transformations'),
     ('Una matriz 2 × 2 deforma la cuadrícula: el determinante como área, los autovectores que no giran, el núcleo, la diagonalización, las potencias y las formas cuadráticas', 'A 2 × 2 matrix deforms the grid: the determinant as area, the eigenvectors that do not turn, the kernel, diagonalisation, powers and quadratic forms'),
     ('--matriz [2 1; 1 2]', '--matrix [2 1; 1 2]'),
     ('El simulador necesita JavaScript. Ejemplo: la matriz A = [2 1; 1 2] lleva el cuadrado unidad a un paralelogramo de área det(A) = 3; las rectas de (1, 1) y (1, −1) no giran: son los autovectores, con autovalores 3 y 1.', 'The simulator needs JavaScript. Example: the matrix A = [2 1; 1 2] takes the unit square to a parallelogram with area det(A) = 3; the lines through (1, 1) and (1, −1) do not turn: they are the eigenvectors, with eigenvalues 3 and 1.')),
]
info = ''
for es, en, sc, cmd, eng, ico, d, home, demo, ns in INFO:
    info += f"\t\t{q(es)} => array(\n\t\t\t'cmd'  => array( {q(cmd[0])}, {q(cmd[1])} ),\n\t\t\t'eng'  => {q(eng)},\n\t\t\t'ico'  => {q(ico)},\n\t\t\t'd'    => array( {q(d[0])}, {q(d[1])} ),\n\t\t\t'home' => array( {q(home[0])}, {q(home[1])} ),\n\t\t\t'demo' => array( {q(demo[0])}, {q(demo[1])} ),\n\t\t\t'sc'   => {q(sc)},\n\t\t),\n"
nsr = ''.join(f"\t\t{q(sc)} => array( {q(ns[0])}, {q(ns[1])} ),\n" for es, en, sc, cmd, eng, ico, d, home, demo, ns in INFO)
ens = ''.join(f"{q(es)} => {q(en)}, " for es, en, *r in INFO)
LK = [
    (ids[0], 'Transformaciones lineales y diagonalización', 'Linear transformations and diagonalisation', 'Núcleo, imagen, autovalores y diagonalización', 'Kernel, image, eigenvalues and diagonalisation', 'book'),
    (ids[1], 'Transformaciones paso a paso', 'Transformations, step by step', 'Práctica guiada con MATLAB', 'Guided practice with MATLAB', 'pen'),
    (ids[2], 'Ejercicios de transformaciones', 'Transformations exercises', 'Tipo examen, con un test de 20', 'Exam style, with a 20-question quiz', 'exam'),
    (ids[3], 'Formas bilineales y cuadráticas', 'Bilinear and quadratic forms', 'Matriz, congruencia, signatura y Sylvester', 'Matrix, congruence, signature and Sylvester', 'book'),
    (ids[5], 'Ejercicios de formas cuadráticas', 'Quadratic forms exercises', 'Tipo examen, con un test de 20', 'Exam style, with a 20-question quiz', 'exam'),
]
links = ''.join(f"\t\t\tarray( {i}, '', $en ? {q(te)} : {q(ts)}, $en ? {q(se)} : {q(ss)}, {q(ic)} ),\n" for i, ts, te, ss, se, ic in LK if i)
purge = ', '.join(str(i) for i in ids + enids if i) or '0'
PHP = r"""/**
 * SergioLearns — simulador «Transformaciones en el plano» de AG (v88, 18 nov 2026, hoja de ruta 7.13, tanda 3: temas 5 y 6).
 * Una matriz 2 × 2 deforma la cuadrícula: las columnas son las imágenes de e₁ y e₂, el cuadrado unidad cambia de área según
 * det(A) (y se da la vuelta si es negativo), los autovectores no giran (flecha de prueba que se arrastra), con det = 0 aparecen
 * el núcleo y la imagen, la diagonalización hace A en tres pasos (P⁻¹, D, P), las potencias, y si A es simétrica, la forma
 * cuadrática xᵗAx con su curva y su clasificación. Kit v2 en diseño D, con el molde del de Gauss-Jordan (v87): lecciones con
 * «¿Qué crees que pasa?», «Tu matriz» plegable y «Ponte a prueba» por niveles.
 * Fuente: sergiolearns-codigo/herramientas/simuladores/ag/ (engine-tp.js, comun-ag.js, ui-tp.js, ag.css + tp.css; pruebas:
 * test-tp.js; montaje: build-88.py). Aquí va minificado.
 * Necesita «simuladores» (módulo 89: sl6_css, sl6_css7, sl6_link) y se registra en sl6_info() y sl6_mini() (sus ganchos v88).
 * Shortcode [sl_sim_tp id="tp"]. Mientras SL_V88_PUBLICO sea false, solo lo ve el administrador con ?sl_v88=1
 * (cookie; ?sl_v88=0 la quita). Sin emoticonos.
 */
if ( ! defined( 'SL_V88_PUBLICO' ) ) {
	define( 'SL_V88_PUBLICO', __PUB__ );
}
add_filter( 'litespeed_vary_cookies', function ( $l ) { $l[] = 'sl_v88'; return $l; } );
function sl_v88() {
	static $on = null;
	if ( null !== $on ) {
		return $on;
	}
	if ( ! function_exists( 'sl_v6' ) || ! sl_v6() ) {
		return $on = false;
	}
	if ( SL_V88_PUBLICO ) {
		return $on = true;
	}
	if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
		return $on = false;
	}
	if ( isset( $_GET['sl_v88'] ) ) {
		$v = ( '1' === $_GET['sl_v88'] );
		if ( ! headers_sent() ) {
			setcookie( 'sl_v88', $v ? '1' : '', $v ? time() + 30 * DAY_IN_SECONDS : time() - 3600, COOKIEPATH ? COOKIEPATH : '/', COOKIE_DOMAIN, is_ssl(), true );
		}
		return $on = $v;
	}
	return $on = ! empty( $_COOKIE['sl_v88'] );
}
add_action( 'init', 'sl_v88', 1 );
function sl88_ids() {
	return array( 'tp' );
}
/** Registro (por el slug ES de su página), con el formato de sl6_info(). */
function sl88_info() {
	return array(
__INFO__	);
}
function sl88_en_slugs() {
	return array( __ENS__);
}
// Vista previa: el administrador ve las páginas privadas en el htop, el menú y la portada.
add_filter( 'sl4_lab_preview', function ( $v ) {
	return $v || ( sl_v88() && ! SL_V88_PUBLICO && current_user_can( 'edit_pages' ) );
} );
function sl88_links( $id, $en ) {
	$L = array(
		'tp' => array(
__LINKS__			array( 7574, '', $en ? 'Matrices and determinants' : 'Matrices y determinantes', $en ? 'Rank, inverse, Sarrus and cofactors' : 'Rango, inversa, Sarrus y cofactores', 'book' ),
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
	if ( 'publish' === $new && 'publish' !== $old && in_array( (int) $post->ID, array( __PURGE__ ), true ) ) {
		foreach ( get_pages( array( 'post_status' => 'publish' ) ) as $pg ) {
			if ( false !== strpos( $pg->post_content, '[sl_sim_tp' ) ) {
				do_action( 'litespeed_purge_post', $pg->ID );
			}
		}
	}
}, 10, 3 );
add_shortcode( 'sl_sim_tp', function ( $atts ) {
	$a  = shortcode_atts( array( 'id' => 'tp' ), $atts );
	$id = $a['id'];
	if ( ! sl_v88() || ! in_array( $id, sl88_ids(), true ) || ! function_exists( 'sl6_css' ) ) {
		return '';
	}
	$en = function_exists( 'sl6_en' ) ? sl6_en() : false;
	$ns = array(
__NS__	);
	$GLOBALS['sl88_need'][ $id ] = true;
	$h  = '<div class="sl-sim" data-sim="' . esc_attr( $id ) . '" data-lang="' . ( $en ? 'en' : 'es' ) . '" data-links="' . esc_attr( wp_json_encode( sl88_links( $id, $en ) ) ) . '">';
	$h .= '<noscript><p>' . esc_html( $ns[ $id ][ $en ? 1 : 0 ] ) . '</p></noscript></div>';
	return $h . sl6_css() . ( function_exists( 'sl6_css7' ) ? sl6_css7() : '' ) . sl88_css();
} );
function sl88_css() {
	static $done = false;
	if ( $done ) {
		return '';
	}
	$done = true;
	return '<style id="sl88-css">' . <<<'SL88CSS'
__CSS__
SL88CSS
	. '</style>';
}
add_action( 'wp_footer', function () {
	if ( empty( $GLOBALS['sl88_need'] ) ) {
		return;
	}
	echo '<script id="sl88-js">' . <<<'SL88JS'
__JS__
SL88JS
	. '</script>';
}, 41 );

/* ------------------------------------------------------------------ animación de su tarjeta (la pide sl6_mini) */
function sl88_mini( $slug ) {
	if ( ! sl_v88() || ! function_exists( 'sl19_tl' ) || ! function_exists( 'sl19_tx' ) ) {
		return '';
	}
	if ( 'transformaciones-en-el-plano' !== $slug ) {
		return '';
	}
	// La cuadrícula de siempre; encima, la de A = [2 1; 1 2] (violeta) con el cuadrado unidad hecho paralelogramo (coral, área 3)
	// y la recta de (1, 1) que no gira (discontinua) con su autovector multiplicado por 3.
	$o  = array( 48, 48 );
	$u  = 11;
	$P  = function ( $x, $y ) use ( $o, $u ) {   // A·(x, y) en el dibujo (y hacia arriba)
		return array( $o[0] + $u * ( 2 * $x + $y ), $o[1] - $u * ( $x + 2 * $y ) );
	};
	$Q  = function ( $x, $y ) use ( $o, $u ) {
		return array( $o[0] + $u * $x, $o[1] - $u * $y );
	};
	$ln = function ( $a, $b, $st ) {
		return '<line x1="' . round( $a[0], 1 ) . '" y1="' . round( $a[1], 1 ) . '" x2="' . round( $b[0], 1 ) . '" y2="' . round( $b[1], 1 ) . '" ' . $st . '/>';
	};
	$g0 = '';
	$g1 = '';
	for ( $i = -4; $i <= 4; $i++ ) {
		$g0 .= $ln( $Q( $i, -5 ), $Q( $i, 5 ), 'stroke="' . ( $i ? '#3A3554' : '#5A5478' ) . '" stroke-width="1"' ) . $ln( $Q( -5, $i ), $Q( 5, $i ), 'stroke="' . ( $i ? '#3A3554' : '#5A5478' ) . '" stroke-width="1"' );
		$g1 .= $ln( $P( $i, -6 ), $P( $i, 6 ), 'stroke="#A99EF5" stroke-opacity="' . ( $i ? '.45' : '.95' ) . '" stroke-width="' . ( $i ? '1' : '1.6' ) . '"' ) . $ln( $P( -6, $i ), $P( 6, $i ), 'stroke="#A99EF5" stroke-opacity="' . ( $i ? '.45' : '.95' ) . '" stroke-width="' . ( $i ? '1' : '1.6' ) . '"' );
	}
	$sq0 = '<path d="M48 48h11v-11h-11z" fill="#FF6B4A" fill-opacity=".25" stroke="#FF6B4A" stroke-width="1.4"/>';
	$a   = $P( 1, 0 );
	$b   = $P( 1, 1 );
	$c   = $P( 0, 1 );
	$sq1 = '<path d="M48 48L' . $a[0] . ' ' . $a[1] . 'L' . $b[0] . ' ' . $b[1] . 'L' . $c[0] . ' ' . $c[1] . 'Z" fill="#FF6B4A" fill-opacity=".25" stroke="#FF6B4A" stroke-width="1.6"/>';
	$eig = $ln( $Q( -4, -4 ), $Q( 4, 4 ), 'stroke="#E8E6F5" stroke-width="1.2" stroke-dasharray="4 3"' ) . $ln( $Q( 0, 0 ), $P( 1, 1 ), 'stroke="#E8E6F5" stroke-width="2.4" stroke-linecap="round"' );
	$clip = '<clipPath id="m88c"><rect x="4" y="4" width="88" height="88" rx="8"/></clipPath>';
	$it   = array(
		array( 'm' => '<defs>' . $clip . '</defs><rect x="4" y="4" width="88" height="88" rx="8" fill="#2A2640"/><g clip-path="url(#m88c)">' . $g0 . '</g>', 'a' => 1, 'b' => 92 ),
		array( 'm' => '<g clip-path="url(#m88c)">' . $sq0 . '</g>', 'a' => 2, 'b' => 26 ),
		array( 'm' => '<g clip-path="url(#m88c)">' . $g1 . $sq1 . '</g>', 'a' => 30, 'b' => 92 ),
		array( 'm' => '<g clip-path="url(#m88c)">' . $eig . '</g>', 'a' => 52, 'b' => 92 ),
		array( 'm' => sl19_tx( 108, 26, array( array( 'A = [2 1; 1 2]', '#E8E6F5' ) ), 10 ), 'a' => 4, 'b' => 92 ),
		array( 'm' => sl19_tx( 108, 50, array( array( 'det(A) = 3', '#FF9B80' ) ), 10 ), 'a' => 34, 'b' => 92 ),
		array( 'm' => sl19_tx( 108, 74, array( array( ( function_exists( 'sl19_en' ) && sl19_en() ) ? 'λ = 3 · does not turn' : 'λ = 3 · no gira', '#A99EF5' ) ), 10 ), 'a' => 56, 'b' => 92 ),
	);
	return sl19_tl( 'm88t', $it, 250 );
}
"""
PHP = PHP.replace('__PUB__', pub).replace('__INFO__', info).replace('__ENS__', ens).replace('__NS__', nsr).replace('__LINKS__', links).replace('__PURGE__', purge).replace('__CSS__', CSS).replace('__JS__', JS)
open(sys.argv[1], 'w', encoding='utf-8').write(PHP)
print('fragmento', len(PHP), 'JS', len(JS), 'CSS', len(CSS))
