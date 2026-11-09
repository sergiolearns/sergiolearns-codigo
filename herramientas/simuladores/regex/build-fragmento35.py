"""Fragmento 35 «SergioLearns — laboratorio por asignatura» v1.2:
- sl19_tl()/sl19_tx(): animaciones de tarjeta a tamaño real (lienzo 340 × 96, letra de 11-12 px), con UNA línea de tiempo de 8 s
  para todas sus piezas (nada de retrasos sueltos que se desfasan) y que empiezan cuando la tarjeta entra en pantalla.
- Animaciones nuevas de los entornos (Python, Java, C y MIPS), detrás de SL_V23_PUBLICO (?sl_v23=1): código de verdad que se escribe
  y lo que sale, en vez de barras de colores.
- El probador de expresiones regulares (fragmento 22, sl_v22()) en los hubs de FP1 y FP2.
Uso: python3 build-fragmento35.py <v1.1.php> <salida.php>"""
import sys
src, out = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (a[:90], s.count(a))
    s = s.replace(a, b)

# --- interruptor de las animaciones nuevas
i = s.index("function sl19_asigs() {")
s = s[:i] + """if ( ! defined( 'SL_V23_PUBLICO' ) ) {
	define( 'SL_V23_PUBLICO', false );   // animaciones nuevas de los entornos en sus tarjetas (Sergio, 9 nov 2026: «no se entienden»)
}
add_filter( 'litespeed_vary_cookies', function ( $l ) { $l[] = 'sl_v23'; return $l; } );
function sl_v23() {
	static $on = null;
	if ( null !== $on ) {
		return $on;
	}
	if ( SL_V23_PUBLICO ) {
		return $on = true;
	}
	if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
		return $on = false;
	}
	if ( isset( $_GET['sl_v23'] ) ) {
		$v = ( '1' === $_GET['sl_v23'] );
		if ( ! headers_sent() ) {
			setcookie( 'sl_v23', $v ? '1' : '', $v ? time() + 30 * DAY_IN_SECONDS : time() - 3600, COOKIEPATH ? COOKIEPATH : '/', COOKIE_DOMAIN, is_ssl(), true );
		}
		return $on = $v;
	}
	return $on = ! empty( $_COOKIE['sl_v23'] );
}
""" + s[i:]

# --- el probador en los hubs de FP1 y FP2
rep("""	if ( function_exists( 'sl_v20' ) && sl_v20() ) {   // simuladores de IC1""", """	if ( function_exists( 'sl_v22' ) && sl_v22() ) {   // el probador de expresiones regulares (fragmento 22 v1.4)
		$a['fp1']['blocks'][0]['tools']['probador-regex'] = array(
			'tema' => array( 'Expresiones regulares en Python', 'Regular expressions in Python' ),
			'ver'  => array( 'Qué casa de verdad y por qué: los grupos, la diferencia entre match, search y fullmatch y lo que devuelven findall y sub, con el mismo re de Python, no con el del navegador.', 'What really matches and why: the groups, the difference between match, search and fullmatch and what findall and sub return, with Python’s own re, not the browser’s.' ),
			'th'   => 2328,
		);
		foreach ( $a['fp2']['blocks'] as $k => $b ) {
			if ( 'Java' === $b['h'][0] ) {
				$a['fp2']['blocks'][ $k ]['tools']['probador-regex'] = array(
					'tema' => array( 'Expresiones regulares en Java', 'Regular expressions in Java' ),
					'ver'  => array( 'La misma expresión con Pattern y Matcher de Java: matches() frente a find(), los grupos con nombre y las barras dobles que pide la cadena, sin compilar nada.', 'The same pattern with Java’s Pattern and Matcher: matches() versus find(), named groups and the double backslashes the string needs, without compiling anything.' ),
					'th'   => 1995,
				);
			}
		}
		$a['fp1']['d'] = array( 'Python desde cero: el entorno de los ejercicios y del simulacro práctico, y el probador de expresiones regulares.', 'Python from scratch: the playground for the exercises and the practical mock exam, and the regular expression tester.' );
	}
	if ( function_exists( 'sl_v20' ) && sl_v20() ) {   // simuladores de IC1""")

# --- animaciones nuevas de los entornos + la línea de tiempo común
rep("function sl19_env_mini( $slug ) {", """/** Texto monoespaciado de una animación: $p = array( array( texto, color ), … ). */
function sl19_tx( $x, $y, $p, $size = 11, $weight = 400 ) {
	$h = '<text x="' . $x . '" y="' . $y . '" font-size="' . $size . '"' . ( $weight > 400 ? ' font-weight="' . $weight . '"' : '' ) . ' font-family="JetBrains Mono,ui-monospace,monospace" style="white-space:pre">';
	foreach ( $p as $t ) {
		$h .= '<tspan fill="' . $t[1] . '">' . esc_html( $t[0] ) . '</tspan>';
	}
	return $h . '</text>';
}
/** Animación de tarjeta con UNA línea de tiempo (8 s) para todas sus piezas, a tamaño real (340 × 96).
 *  Cada pieza: m (SVG), a (% en que aparece), b (% en que se va; 88 por defecto), w (x, y, ancho, alto: se escribe de izquierda
 *  a derecha), g (crece de izquierda a derecha). Sin la clase is-vis (sin JavaScript o con movimiento reducido) se ve el estado
 *  final, quieto. sl19_assets() pone is-vis cuando la tarjeta entra en pantalla y la quita al salir: siempre empieza desde el principio. */
function sl19_tl( $id, $items, $w = 340, $h = 96 ) {
	$T   = 8;
	$css = '';
	$g   = '';
	$pct = function ( $x ) {
		return rtrim( rtrim( number_format( max( 0, min( 100, $x ) ), 2, '.', '' ), '0' ), '.' ) . '%';
	};
	foreach ( $items as $i => $it ) {
		$c = 'sl19t-' . $id . '-' . $i;
		$a = $it['a'];
		$b = isset( $it['b'] ) ? $it['b'] : 88;
		if ( ! empty( $it['gy'] ) ) {
			$css .= '@keyframes ' . $c . '{0%,' . $pct( $a ) . '{opacity:0;transform:scaleY(0)}' . $pct( $a + .5 ) . '{opacity:1;transform:scaleY(0)}' . $pct( $a + 7 ) . ',' . $pct( $b ) . '{opacity:1;transform:scaleY(1)}' . $pct( $b + 3 ) . ',100%{opacity:0;transform:scaleY(1)}}';
			$css .= '.sl19-tl.is-vis .' . $c . '{animation:' . $c . ' ' . $T . 's cubic-bezier(.2,.8,.3,1) infinite}.' . $c . '{transform-box:fill-box;transform-origin:center bottom}';
		} elseif ( ! empty( $it['dr'] ) ) {
			$css .= '@keyframes ' . $c . '{0%,' . $pct( $a ) . '{opacity:0;stroke-dashoffset:100}' . $pct( $a + .5 ) . '{opacity:1;stroke-dashoffset:100}' . $pct( $a + 8 ) . ',' . $pct( $b ) . '{opacity:1;stroke-dashoffset:0}' . $pct( $b + 3 ) . ',100%{opacity:0;stroke-dashoffset:0}}';
			$css .= '.' . $c . '{stroke-dasharray:100 100;stroke-dashoffset:0;fill:none}.sl19-tl.is-vis .' . $c . '{animation:' . $c . ' ' . $T . 's ease-out infinite}';
		} elseif ( ! empty( $it['g'] ) ) {
			$css .= '@keyframes ' . $c . '{0%,' . $pct( $a ) . '{opacity:0;transform:scaleX(0)}' . $pct( $a + .5 ) . '{opacity:1;transform:scaleX(0)}' . $pct( $a + 6 ) . ',' . $pct( $b ) . '{opacity:1;transform:scaleX(1)}' . $pct( $b + 3 ) . ',100%{opacity:0;transform:scaleX(1)}}';
			$css .= '.sl19-tl.is-vis .' . $c . '{animation:' . $c . ' ' . $T . 's linear infinite}.' . $c . '{transform-box:fill-box;transform-origin:left center}';
		} else {
			$css .= '@keyframes ' . $c . '{0%,' . $pct( $a ) . '{opacity:0}' . $pct( $a + .5 ) . ',' . $pct( $b ) . '{opacity:1}' . $pct( $b + 3 ) . ',100%{opacity:0}}';
			$css .= '.sl19-tl.is-vis .' . $c . '{animation:' . $c . ' ' . $T . 's linear infinite}';
		}
		$cov = '';
		if ( ! empty( $it['w'] ) ) {   // tapa del color del fondo que se retira: el texto «se escribe»
			$x   = $it['w'];
			$d   = max( 3, min( 9, $x[2] / 32 ) );
			$css .= '@keyframes ' . $c . 'w{0%,' . $pct( $a ) . '{transform:scaleX(1)}' . $pct( $a + $d ) . ',100%{transform:scaleX(0)}}';
			$css .= '.' . $c . 'w{transform:scaleX(0);transform-box:fill-box;transform-origin:right center}.sl19-tl.is-vis .' . $c . 'w{animation:' . $c . 'w ' . $T . 's steps(' . max( 4, (int) round( $x[2] / 7 ) ) . ',end) infinite}';
			$cov  = '<rect class="' . $c . 'w" x="' . ( $x[0] - 1 ) . '" y="' . $x[1] . '" width="' . ( $x[2] + 2 ) . '" height="' . $x[3] . '" style="fill:var(--sl19bg,#1E1B2E)"/>';
		}
		$g .= '<g class="' . $c . '">' . $it['m'] . $cov . '</g>';
	}
	return '<svg class="sl19-mini sl19-tl" viewBox="0 0 ' . $w . ' ' . $h . '" preserveAspectRatio="xMinYMid meet" aria-hidden="true" focusable="false"><style>' . $css . '</style>' . $g . '</svg>';
}

__ENVMINIS__
function sl19_env_mini( $slug ) {
	if ( function_exists( 'sl_v23' ) && sl_v23() ) {
		$m = sl19_env_mini2( $slug );
		if ( $m ) {
			return $m;
		}
	}""")

rep("""function sl19_anim( $t ) {
	if ( 'sim' !== $t['k'] ) {
		$mv = sl19_env_mini( $t['slug'] );""", """function sl19_anim( $t, $compacta = false ) {
	if ( 'sim' !== $t['k'] ) {
		$mv = ( $compacta && function_exists( 'sl_v23' ) && sl_v23() ) ? sl19_env_mini3( $t['slug'] ) : '';
		$mv = $mv ? $mv : sl19_env_mini( $t['slug'] );""")
rep("( $first ? sl19_anim( $first ) : '' )", "( $first ? sl19_anim( $first, true ) : '' )")
# --- arranque al entrar en pantalla (una vez por página)
rep("""	return $h . '<style id="sl19-css">' . sl19_css() . '</style>';
}
function sl19_css() {""", """	return $h . '<style id="sl19-css">' . sl19_css() . '.sl19-as__vis{--sl19bg:#1E1B2E}</style>' . sl19_tl_js();
}
/** Las animaciones de sl19_tl() se mueven solo con la tarjeta en pantalla y empiezan siempre desde el principio. */
function sl19_tl_js() {
	return '<script id="sl19-tl">(function(){if(window.SL19TL)return;window.SL19TL=1;var R=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;function go(){if(R||!("IntersectionObserver" in window))return;var io=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle("is-vis",e.isIntersecting)})},{threshold:.4});[].forEach.call(document.querySelectorAll("svg.sl19-tl"),function(s){io.observe(s)})}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);else go()})();</script>';
}
function sl19_css() {""")
rep(".sl19-mini{display:block;width:100%;height:112px;overflow:visible}", ".sl19-mini{display:block;width:100%;height:112px;overflow:visible}.sl19-tl{overflow:hidden;text-rendering:geometricPrecision}")
s = s.replace('__ENVMINIS__', open(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)), 'envminis.php'), encoding='utf-8').read())
open(out, 'w', encoding='utf-8').write(s)
print(out, len(s))
