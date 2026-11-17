"""Monta el fragmento «SergioLearns — simuladores de ME1» (v81) con el JS y el CSS minificados (esbuild).
Uso: python3 build-81.py salida.php [--publico]   (el kit v2 de ../comun/kit2.js va dentro: punteros lo trae en su paquete)"""
import subprocess, sys, os
H = os.path.dirname(os.path.abspath(__file__))
def mini(args, inp):
    return subprocess.run(['npx', '--yes', 'esbuild', '--minify', *args], input=inp, capture_output=True, text=True, check=True).stdout.strip()
rd = lambda p: open(os.path.join(H, p), encoding='utf-8').read()
JS = mini(['--loader=js', '--target=es2020'], '\n'.join(rd(p) for p in ['../comun/kit2.js', 'engine.js', 'comun.js', 'ui-dist.js', 'ui-tcl.js', 'ui-ic.js']))
CSS = mini(['--loader=css'], rd('me1.css'))
for v in (JS, CSS):
    for bad in ('SL81JS', 'SL81CSS'):
        assert bad not in v
pub = 'true' if '--publico' in sys.argv else 'false'
q = lambda x: "'" + x.replace('\\', '\\\\').replace("'", "\\'") + "'"
INFO = [
    ('distribuciones-de-probabilidad', 'probability-distributions', 'distrib', ('distribucion', 'distribution'), 'd · p · q', 'barras',
     ('Binomial, Poisson, normal, t, χ² y F', 'Binomial, Poisson, normal, t, χ² and F'),
     ('Once distribuciones con las funciones d, p y q de R: el área que calcula cada orden, el truco del ≥ en las discretas y los cuantiles', 'Eleven distributions with R’s d, p and q functions: the area each call computes, the ≥ trick for discrete variables and the quantiles'),
     ('--pbinom 3 --size 10 --prob 0.25', '--pbinom 3 --size 10 --prob 0.25'),
     ('El simulador necesita JavaScript. Ejemplo: con X ~ B(10; 0,25), dbinom(3, 10, 0.25) = 0,2503, pbinom(3, 10, 0.25) = 0,7759 y P(X ≥ 5) = 1 − pbinom(4, 10, 0.25) = 0,0781.', 'The simulator needs JavaScript. Example: with X ~ B(10, 0.25), dbinom(3, 10, 0.25) = 0.2503, pbinom(3, 10, 0.25) = 0.7759 and P(X ≥ 5) = 1 − pbinom(4, 10, 0.25) = 0.0781.')),
    ('teorema-central-del-limite', 'central-limit-theorem', 'tcl', ('tcl', 'clt'), 'x̄ · σ/√n', 'stats',
     ('De cualquier población a la campana', 'From any population to the bell'),
     ('Miles de muestras de un dado, de la espera de la guagua o de una moneda trucada: sus medias forman una campana N(μ, σ/√n)', 'Thousands of samples from a die, a bus wait or a loaded coin: their means form a bell N(μ, σ/√n)'),
     ('--poblacion dado --n 30', '--population die --n 30'),
     ('El simulador necesita JavaScript. Ejemplo: las medias de muestras de 30 tiradas de un dado siguen aproximadamente una N(3,5; 0,31).', 'The simulator needs JavaScript. Example: the means of samples of 30 die rolls approximately follow N(3.5, 0.31).')),
    ('intervalos-de-confianza', 'confidence-intervals', 'ic', ('intervalo', 'interval'), 'x̄ ± z · σ/√n', 'sigma',
     ('Qué significa el 95 %', 'What 95 % means'),
     ('Cien muestras, cien intervalos: cuántos atrapan a μ con z, con t o para una proporción, y qué pasa al cambiar el nivel o la n', 'A hundred samples, a hundred intervals: how many catch μ with z, with t or for a proportion, and what happens when you change the level or n'),
     ('--nivel 0.95 --n 25', '--level 0.95 --n 25'),
     ('El simulador necesita JavaScript. Ejemplo: con σ = 5 y n = 25, el intervalo al 95 % es x̄ ± 1,96 g, y de cada 100 muestras unas 95 contienen a μ.', 'The simulator needs JavaScript. Example: with σ = 5 and n = 25, the 95 % interval is x̄ ± 1.96 g, and about 95 of every 100 samples contain μ.')),
]
info = ''
for es, en, sc, cmd, eng, ico, d, home, demo, ns in INFO:
    info += f"\t\t{q(es)} => array(\n\t\t\t'cmd'  => array( {q(cmd[0])}, {q(cmd[1])} ),\n\t\t\t'eng'  => {q(eng)},\n\t\t\t'ico'  => {q(ico)},\n\t\t\t'd'    => array( {q(d[0])}, {q(d[1])} ),\n\t\t\t'home' => array( {q(home[0])}, {q(home[1])} ),\n\t\t\t'demo' => array( {q(demo[0])}, {q(demo[1])} ),\n\t\t\t'sc'   => {q(sc)},\n\t\t),\n"
nsr = ''.join(f"\t\t{q(sc)} => array( {q(ns[0])}, {q(ns[1])} ),\n" for es, en, sc, cmd, eng, ico, d, home, demo, ns in INFO)
ens = ''.join(f"{q(es)} => {q(en)}, " for es, en, *r in INFO)
PHP = r"""/**
 * SergioLearns — simuladores de ME1 (v81, 16 nov 2026): distribuciones de probabilidad (d/p/q de R), el teorema central
 * del límite e intervalos de confianza, con el kit v2 en diseño D (como el de punteros): lecciones paso a paso con
 * «¿Qué crees que pasa?», controles libres y «Ponte a prueba» por niveles. Fuente: sergiolearns-codigo/herramientas/simuladores/me1/
 * (engine.js, comun.js, ui-dist.js, ui-tcl.js, ui-ic.js, me1.css; pruebas: test.py contra SciPy). Aquí va minificado.
 * Necesita «simuladores» (fragmento 22: sl6_css, sl6_css7, sl6_link) y se registra en sl6_info() y sl6_mini() (sus ganchos v81).
 * Shortcode [sl_sim_me1 id="distrib|tcl|ic"]. Mientras SL_V81_PUBLICO sea false, solo lo ve el administrador con ?sl_v81=1
 * (cookie; ?sl_v81=0 la quita). Sin emoticonos.
 */
if ( ! defined( 'SL_V81_PUBLICO' ) ) {
	define( 'SL_V81_PUBLICO', __PUB__ );
}
add_filter( 'litespeed_vary_cookies', function ( $l ) { $l[] = 'sl_v81'; return $l; } );
function sl_v81() {
	static $on = null;
	if ( null !== $on ) {
		return $on;
	}
	if ( ! function_exists( 'sl_v6' ) || ! sl_v6() ) {
		return $on = false;
	}
	if ( SL_V81_PUBLICO ) {
		return $on = true;
	}
	if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
		return $on = false;
	}
	if ( isset( $_GET['sl_v81'] ) ) {
		$v = ( '1' === $_GET['sl_v81'] );
		if ( ! headers_sent() ) {
			setcookie( 'sl_v81', $v ? '1' : '', $v ? time() + 30 * DAY_IN_SECONDS : time() - 3600, COOKIEPATH ? COOKIEPATH : '/', COOKIE_DOMAIN, is_ssl(), true );
		}
		return $on = $v;
	}
	return $on = ! empty( $_COOKIE['sl_v81'] );
}
add_action( 'init', 'sl_v81', 1 );
function sl81_ids() {
	return array( 'distrib', 'tcl', 'ic' );
}
/** Registro (por el slug ES de su página), con el formato de sl6_info(). */
function sl81_info() {
	return array(
__INFO__	);
}
function sl81_en_slugs() {
	return array( __ENS__);
}
// Vista previa: el administrador ve las páginas privadas en el htop, el menú y la portada.
add_filter( 'sl4_lab_preview', function ( $v ) {
	return $v || ( sl_v81() && ! SL_V81_PUBLICO && current_user_can( 'edit_pages' ) );
} );
function sl81_links( $id, $en ) {
	$L = array(
		'distrib' => array(
			array( 6636, '', $en ? 'Discrete random variables' : 'Variables aleatorias discretas', $en ? 'Binomial, Poisson and geometric with R' : 'Binomial, Poisson y geométrica con R', 'book' ),
			array( 6658, '', $en ? 'Continuous random variables' : 'Variables aleatorias continuas', $en ? 'Density, areas, uniform, exponential and gamma' : 'Densidad, áreas, uniforme, exponencial y gamma', 'book' ),
			array( 6686, '', $en ? 'The normal distribution' : 'La distribución normal', $en ? 'pnorm, qnorm and standardising' : 'pnorm, qnorm y tipificar', 'book' ),
			array( 6688, '', $en ? 'The normal, step by step' : 'La normal paso a paso', $en ? 'Guided practice with R' : 'Práctica guiada con R', 'pen' ),
			array( 6674, '', $en ? 'ME1 EC1 mock exam' : 'Simulacro de la EC1 de ME1', $en ? 'Paper and R, like the real one' : 'Papel y R, como el de verdad', 'exam' ),
		),
		'tcl'     => array(
			array( 6732, '', $en ? 'Inequalities and limit theorems' : 'Desigualdades y teoremas límite', $en ? 'Chebyshev, the law of large numbers and the CLT' : 'Chebyshev, la ley de los grandes números y el TCL', 'book' ),
			array( 6735, '', $en ? 'CLT exercises' : 'Ejercicios del TCL', $en ? 'Sums and means with the normal' : 'Sumas y medias con la normal', 'pen' ),
			array( 6790, '', $en ? 'Sampling distributions' : 'Distribuciones en el muestreo', $en ? 'The mean, χ², t and F' : 'La media, χ², t y F', 'book' ),
			array( 7067, '', $en ? 'ME1 EC2 mock exam' : 'Simulacro de la EC2 de ME1', $en ? 'Paper and R, like the real one' : 'Papel y R, como el de verdad', 'exam' ),
		),
		'ic'      => array(
			array( 7041, '', $en ? 'Confidence intervals' : 'Intervalos de confianza', $en ? 'For μ, σ² and p, and the sample size' : 'Para μ, σ² y p, y el tamaño muestral', 'book' ),
			array( 7043, '', $en ? 'Intervals with R' : 'Intervalos con R', $en ? 'Guided practice: t.test and friends' : 'Práctica guiada: t.test y compañía', 'pen' ),
			array( 7044, '', $en ? 'Interval exercises' : 'Ejercicios de intervalos', $en ? 'Exam style, with their solution' : 'Tipo examen, con su solución', 'pen' ),
			array( 7067, '', $en ? 'ME1 EC2 mock exam' : 'Simulacro de la EC2 de ME1', $en ? 'Paper and R, like the real one' : 'Papel y R, como el de verdad', 'exam' ),
		),
	);
	$out = array();
	foreach ( isset( $L[ $id ] ) ? $L[ $id ] : array() as $x ) {
		$out[] = function_exists( 'sl6_link' ) ? sl6_link( $x[0], $x[1], $x[2], $x[3], $x[4] ) : null;
	}
	return array_values( array_filter( $out ) );
}
// Cuando se publica un artículo enlazado en «Ponte a prueba», se purgan las páginas de estos simuladores.
add_action( 'transition_post_status', function ( $new, $old, $post ) {
	if ( 'publish' === $new && 'publish' !== $old && in_array( (int) $post->ID, array( 6636, 6646, 6658, 6664, 6686, 6690, 6688, 6694, 6674, 6675, 6732, 6736, 6735, 6742, 6790, 6800, 7067, 7068, 7041, 7043, 7044, 7051 ), true ) ) {
		foreach ( get_pages( array( 'post_status' => 'publish' ) ) as $pg ) {
			if ( false !== strpos( $pg->post_content, '[sl_sim_me1' ) ) {
				do_action( 'litespeed_purge_post', $pg->ID );
			}
		}
	}
}, 10, 3 );
add_shortcode( 'sl_sim_me1', function ( $atts ) {
	$a  = shortcode_atts( array( 'id' => 'distrib' ), $atts );
	$id = $a['id'];
	if ( ! sl_v81() || ! in_array( $id, sl81_ids(), true ) || ! function_exists( 'sl6_css' ) ) {
		return '';
	}
	$en = function_exists( 'sl6_en' ) ? sl6_en() : false;
	$ns = array(
__NS__	);
	$GLOBALS['sl81_need'][ $id ] = true;
	$h  = '<div class="sl-sim" data-sim="' . esc_attr( $id ) . '" data-lang="' . ( $en ? 'en' : 'es' ) . '" data-links="' . esc_attr( wp_json_encode( sl81_links( $id, $en ) ) ) . '">';
	$h .= '<noscript><p>' . esc_html( $ns[ $id ][ $en ? 1 : 0 ] ) . '</p></noscript></div>';
	return $h . sl6_css() . ( function_exists( 'sl6_css7' ) ? sl6_css7() : '' ) . sl81_css();
} );
function sl81_css() {
	static $done = false;
	if ( $done ) {
		return '';
	}
	$done = true;
	return '<style id="sl81-css">' . <<<'SL81CSS'
__CSS__
SL81CSS
	. '</style>';
}
add_action( 'wp_footer', function () {
	if ( empty( $GLOBALS['sl81_need'] ) ) {
		return;
	}
	echo '<script id="sl81-js">' . <<<'SL81JS'
__JS__
SL81JS
	. '</script>';
}, 41 );

/* ------------------------------------------------------------------ animaciones de las tarjetas (las pide sl6_mini, v81) */
function sl81_mini( $slug ) {
	if ( ! sl_v81() || ! function_exists( 'sl19_tl' ) || ! function_exists( 'sl19_tx' ) ) {
		return '';
	}
	$en = function_exists( 'sl6_en' ) ? sl6_en() : false;
	$E  = sl81_en_slugs();
	$k  = array_search( $slug, $E, true );
	if ( false !== $k ) {
		$slug = $k;
	}
	if ( 'distribuciones-de-probabilidad' === $slug ) {
		$p  = array( .0563, .1877, .2816, .2503, .1460, .0584, .0162, .0031, .0004 );
		$it = array( array( 'm' => '<line x1="8" y1="78" x2="240" y2="78" stroke="#3A3554"/>', 'a' => 1, 'b' => 92 ) );
		foreach ( $p as $i => $v ) {
			$h    = max( 2, $v * 190 );
			$it[] = array( 'm' => '<rect x="' . ( 12 + $i * 26 ) . '" y="' . ( 78 - $h ) . '" width="18" height="' . $h . '" rx="3" fill="#4A4566"/>', 'a' => 2 + $i * 2, 'b' => 92, 'gy' => 1 );
		}
		foreach ( array( 0, 1, 2, 3 ) as $i ) {
			$h    = $p[ $i ] * 190;
			$it[] = array( 'm' => '<rect x="' . ( 12 + $i * 26 ) . '" y="' . ( 78 - $h ) . '" width="18" height="' . $h . '" rx="3" fill="#FF6B4A"/>', 'a' => 34 + $i * 4, 'b' => 92, 'gy' => 1 );
		}
		$it[] = array( 'm' => sl19_tx( 8, 94, array( array( 'pbinom(3, 10, 0.25)', '#C9C5DC' ), array( ' = 0.7759', '#FF9B80' ) ), 10 ), 'a' => 52, 'b' => 92 );
		return sl19_tl( 'm81d', $it, 250 );
	}
	if ( 'teorema-central-del-limite' === $slug ) {
		$it = array( array( 'm' => '<line x1="8" y1="80" x2="240" y2="80" stroke="#3A3554"/>', 'a' => 1, 'b' => 92 ) );
		foreach ( range( 0, 17 ) as $i ) {
			$z    = ( $i - 8.5 ) / 3.2;
			$h    = 4 + 62 * exp( -0.5 * $z * $z );
			$it[] = array( 'm' => '<rect x="' . ( 10 + $i * 13 ) . '" y="' . ( 80 - $h ) . '" width="11" height="' . $h . '" rx="2" fill="#A99EF5" fill-opacity=".85"/>', 'a' => 4 + $i * 2.2, 'b' => 92, 'gy' => 1 );
		}
		$d = '';
		foreach ( range( 0, 40 ) as $j ) {
			$x  = 10 + $j * 234 / 40;
			$z  = ( ( $x - 10 ) / 13 - 9 ) / 3.2;
			$d .= ( $j ? 'L' : 'M' ) . round( $x, 1 ) . ' ' . round( 80 - 4 - 62 * exp( -0.5 * $z * $z ), 1 );
		}
		$it[] = array( 'm' => '<path d="' . $d . '" fill="none" stroke="#FF6B4A" stroke-width="2" pathLength="100"/>', 'a' => 48, 'b' => 92, 'dr' => 1 );
		$it[] = array( 'm' => sl19_tx( 132, 10, array( array( 'N(μ, σ/√n)', '#FF9B80' ) ), 10 ), 'a' => 56, 'b' => 92 );
		return sl19_tl( 'm81t', $it, 250 );
	}
	if ( 'intervalos-de-confianza' === $slug ) {
		$it   = array( array( 'm' => '<line x1="125" y1="4" x2="125" y2="92" stroke="#E8E6F5" stroke-dasharray="4 3"/>', 'a' => 1, 'b' => 92 ) );
		$rows = array( array( 92, 168 ), array( 70, 146 ), array( 104, 180 ), array( 82, 158 ), array( 132, 208, 1 ), array( 96, 172 ), array( 60, 136 ), array( 110, 186 ), array( 88, 164 ) );
		foreach ( $rows as $i => $r ) {
			$y    = 86 - $i * 9.4;
			$c    = empty( $r[2] ) ? '#A99EF5' : '#FF6B4A';
			$it[] = array( 'm' => '<line x1="' . $r[0] . '" y1="' . $y . '" x2="' . $r[1] . '" y2="' . $y . '" stroke="' . $c . '" stroke-width="2.4" stroke-linecap="round"/><circle cx="' . ( ( $r[0] + $r[1] ) / 2 ) . '" cy="' . $y . '" r="2" fill="#E8E6F5"/>', 'a' => 4 + $i * 6, 'b' => 92, 'g' => 1 );
		}
		$it[] = array( 'm' => sl19_tx( 168, 94, array( array( '8/9', '#E8E6F5' ), array( ( $en ? ' hit' : ' aciertan' ), '#8E8AA3' ) ), 10 ), 'a' => 62, 'b' => 92 );
		return sl19_tl( 'm81i', $it, 250 );
	}
	return '';
}
"""
PHP = PHP.replace('__PUB__', pub).replace('__INFO__', info).replace('__ENS__', ens).replace('__NS__', nsr).replace('__CSS__', CSS).replace('__JS__', JS)
open(sys.argv[1], 'w', encoding='utf-8').write(PHP)
print('fragmento', len(PHP), 'JS', len(JS), 'CSS', len(CSS))
