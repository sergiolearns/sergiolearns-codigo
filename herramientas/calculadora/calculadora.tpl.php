<?php
/**
 * SergioLearns — calculadora (v1.0, 31 oct 2026, tanda 4 del plan de expansión). Necesita «listados» (fragmento 17).
 * Calculadora de notas «¿Cuánto necesito?» al final de las guías de asignatura de Universidad (FP1, FP2, IC1 e IC2):
 * escribes tus notas, dejas en blanco lo que falta y te da la nota final o lo que necesitas en lo pendiente (objetivo 5, 7 o 9),
 * con la fórmula, los mínimos y las reglas de cada guía docente 2026/27 (04-herramientas/calculadora/notas.yaml). NO OFICIAL:
 * lo dice y enlaza a la guía. Aspecto tinta y claro (localStorage sl_entorno_tema). Las notas se guardan solo en el navegador
 * (localStorage sl_notas_<asig>). Código fuente y pruebas: sergiolearns-codigo/herramientas/calculadora/ (aquí va minificado).
 * Ganchos: acción sl2_archive_tail (fragmento 17, antes del panel de revisión) y filtro sl4_asig_extra (fragmento 20: enlace
 * «¿Cuánto necesito?» de cada asignatura en /universidad/). Shortcode [sl_notas asig="fp1"].
 * Mientras SL_V8_PUBLICO sea false, solo lo ve el administrador con ?sl_v8=1 (cookie; ?sl_v8=0 la quita). Sin emoticonos.
 */
if ( ! defined( 'SL_V8_PUBLICO' ) ) {
	define( 'SL_V8_PUBLICO', true );   // «aplica» de Sergio (31 oct 2026)
}
add_filter( 'litespeed_vary_cookies', function ( $l ) { $l[] = 'sl_v8'; return $l; } );
function sl_v8() {
	static $on = null;
	if ( null !== $on ) {
		return $on;
	}
	if ( SL_V8_PUBLICO ) {
		return $on = true;
	}
	if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
		return $on = false;
	}
	if ( isset( $_GET['sl_v8'] ) ) {
		$v = ( '1' === $_GET['sl_v8'] );
		if ( ! headers_sent() ) {
			setcookie( 'sl_v8', $v ? '1' : '', $v ? time() + 30 * DAY_IN_SECONDS : time() - 3600, COOKIEPATH ? COOKIEPATH : '/', COOKIE_DOMAIN, is_ssl(), true );
		}
		return $on = $v;
	}
	return $on = ! empty( $_COOKIE['sl_v8'] );
}

/** Asignaturas con calculadora: nombre ES/EN y guía docente 2026/27 (PDF oficial del proyecto docente). */
function sl8_asigs() {
	return array(
		'fp1' => array( 'Fundamentos de Programación I', 'Programming Fundamentals I', 'https://www2.ulpgc.es/aplicaciones/proyectosdocentes/pdf.php?id_proyecto=77273&NUEVA=1' ),
		'fp2' => array( 'Fundamentos de Programación II', 'Programming Fundamentals II', 'https://www2.ulpgc.es/aplicaciones/proyectosdocentes/pdf.php?id_proyecto=77162&NUEVA=1' ),
		'ic1' => array( 'Ingeniería de Computadores I', 'Computer Engineering I', 'https://www2.ulpgc.es/aplicaciones/proyectosdocentes/pdf.php?id_proyecto=77444&NUEVA=1' ),
		'ic2' => array( 'Ingeniería de Computadores II', 'Computer Engineering II', 'https://www2.ulpgc.es/aplicaciones/proyectosdocentes/pdf.php?id_proyecto=77133&NUEVA=1' ),
	);
}
function sl8_key( $slug ) {
	$k = preg_replace( '/-en$/', '', strtolower( (string) $slug ) );
	$a = sl8_asigs();
	return isset( $a[ $k ] ) ? $k : '';
}

function sl8_section( $k, $en ) {
	static $assets = false;
	$a = sl8_asigs();
	if ( ! isset( $a[ $k ] ) ) {
		return '';
	}
	list( $nes, $nen, $guia ) = $a[ $k ];
	$abb  = strtoupper( $k );
	$cfg  = wp_json_encode( array( 'asig' => $k, 'en' => (bool) $en ) );
	$info = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.5"/></svg>';
	$h    = '<section class="sl8" aria-labelledby="notas">';
	$h   .= '<h2 class="sl8__h" id="notas">' . esc_html( $en ? 'How much do I need?' : '¿Cuánto necesito?' ) . '</h2>';
	$h   .= '<p class="sl8__lead">' . esc_html( $en
		? sprintf( 'Type the marks you already have and leave blank what is still to come: you get your final mark, or what you need in the rest to pass (or to reach a 7 or a 9). It uses the weights and minimums of the 2026/27 %s course guide.', $abb )
		: sprintf( 'Escribe las notas que ya tienes y deja en blanco lo que falta: te digo tu nota final o lo que necesitas sacar en lo que queda para aprobar (o para el 7 o el 9). Usa los pesos y los mínimos de la guía docente 2026/27 de %s.', $abb ) ) . '</p>';
	$h   .= '<div class="sl8-app" data-sl8="' . esc_attr( $cfg ) . '"><noscript><p class="sl8-noscript">' . esc_html( $en ? 'The calculator needs JavaScript.' : 'La calculadora necesita JavaScript.' ) . '</p></noscript></div>';
	$h   .= '<div class="sl8-cf">' . $info . '<p>' . esc_html( $en
		? 'Unofficial calculator: I built it from the assessment criteria of the 2026/27 course guide (read on 31 October 2026). It does not replace your lecturers or the official marks; if anything differs, the guide wins. '
		: 'Calculadora no oficial: la hice con los criterios de evaluación de la guía docente 2026/27 (leídos el 31 de octubre de 2026). No sustituye a tu profesorado ni a las actas; si algo no cuadra, manda la guía. ' )
		. '<a href="' . esc_url( $guia ) . '" target="_blank" rel="noopener">' . esc_html( $en ? sprintf( 'Open the %s course guide (ULPGC PDF, in Spanish)', $abb ) : sprintf( 'Ver la guía docente de %s (PDF de la ULPGC)', $abb ) ) . '</a></p></div>';
	$h   .= '</section>';
	if ( ! $assets ) {
		$assets = true;
		$h     .= '<style id="sl8-css">' . sl8_css() . '</style><script id="sl8-js">' . sl8_js() . '</script>';
	}
	return $h;
}

add_action( 'sl2_archive_tail', function ( $term, $en ) {
	if ( ! sl_v8() || empty( $term->taxonomy ) || 'asignatura' !== $term->taxonomy ) {
		return;
	}
	$k = sl8_key( $term->slug );
	if ( $k ) {
		echo sl8_section( $k, $en ); // phpcs:ignore
	}
}, 10, 2 );

add_shortcode( 'sl_notas', function ( $atts ) {
	$atts = shortcode_atts( array( 'asig' => '' ), $atts );
	$en   = function_exists( 'pll_current_language' ) && 'en' === pll_current_language();
	return sl_v8() ? sl8_section( sl8_key( $atts['asig'] ), $en ) : '';
} );

/** /universidad/ (fragmento 20): «¿Cuánto necesito?» en la tarjeta de cada asignatura con calculadora. */
add_filter( 'sl4_asig_extra', function ( $html, $r, $en ) {
	if ( ! sl_v8() || empty( $r['slug'] ) || ! sl8_key( $r['slug'] ) || empty( $r['u'] ) ) {
		return $html;
	}
	$svg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8.5 7h7M8.5 11h1M12 11h1M15.5 11h0M8.5 14.5h1M12 14.5h1M8.5 18h1M12 18h1M15.5 14.5V18"/></svg>';
	return $html . '<a class="sl8-uni" href="' . esc_url( $r['u'] . '#notas' ) . '">' . $svg . esc_html( $en ? 'How much do I need?' : '¿Cuánto necesito?' ) . '</a>';
}, 10, 3 );
add_action( 'wp_head', function () {
	if ( sl_v8() && is_page( array( 3700, 3701 ) ) ) {
		echo '<style id="sl8-uni">.sl8-uni{display:inline-flex;align-items:center;gap:6px;margin-top:8px;font:600 13.5px Inter,sans-serif;color:#5B4BDB;text-decoration:none}.sl8-uni:hover{color:#4638B8;text-decoration:underline}.sl4-asig__ex .sl8-uni{margin-left:0}</style>';
	}
} );

function sl8_css() {
	return <<<'SL8CSS'
@@CSS@@
SL8CSS;
}
function sl8_js() {
	return <<<'SL8JS'
@@JS@@
SL8JS;
}
