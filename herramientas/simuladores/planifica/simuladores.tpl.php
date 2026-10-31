<?php
/**
 * SergioLearns — simuladores (v1.0, 31 oct 2026, tanda 2 del plan de expansión, pedido por Sergio). Necesita «hubs» (fragmento 20).
 * 1. Shortcode [sl_sim id="planifica"]: el simulador de planificación de CPU (FCFS, SJF, SRTF y RR con cuanto): terminal con la orden,
 *    tabla de procesos editable, Gantt en SVG, Paso / Ejecutar con la explicación de cada decisión y la cola de listos, resultados con
 *    sus medias, comparativa de los cuatro algoritmos, reto «calcula tú el Gantt» y «Ponte a prueba» (teoría, cuestionario y simulacro
 *    de IC2, cada enlace solo cuando su artículo ya está publicado). Aspecto tinta y claro (localStorage sl_entorno_tema, el mismo
 *    botón que los entornos). Todo en el navegador, sin dependencias; el código fuente está en el repositorio
 *    (sergiolearns-codigo/herramientas/simuladores/) y aquí va minificado. Las cuentas se comprobaron con 4000 casos frente a una
 *    referencia en Python y con los ejemplos de los apuntes de IC2 y del artículo «Planificación de la CPU».
 * 2. Shortcode [sl_simuladores]: la página «Simuladores» (ls -l ~/laboratorio/simuladores, una fila por simulador, sola).
 * 3. Un simulador = una página hija de «simuladores». Su orden, motor, icono y frases se declaran en sl6_info() y llegan solos al
 *    htop, al menú, a la portada y a Ctrl K (filtro sl4_lab_meta del fragmento 20).
 * Mientras SL_V6_PUBLICO sea false, solo lo ve el administrador con ?sl_v6=1 (cookie; ?sl_v6=0 la quita). Sin emoticonos.
 */
if ( ! defined( 'SL_V6_PUBLICO' ) ) {
	define( 'SL_V6_PUBLICO', true );   // «aplica» de Sergio (31 oct 2026)
}
add_filter( 'litespeed_vary_cookies', function ( $l ) { $l[] = 'sl_v6'; return $l; } );
function sl_v6() {
	static $on = null;
	if ( null !== $on ) {
		return $on;
	}
	if ( SL_V6_PUBLICO ) {
		return $on = true;
	}
	if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
		return $on = false;
	}
	if ( isset( $_GET['sl_v6'] ) ) {
		$v = ( '1' === $_GET['sl_v6'] );
		if ( ! headers_sent() ) {
			setcookie( 'sl_v6', $v ? '1' : '', $v ? time() + 30 * DAY_IN_SECONDS : time() - 3600, COOKIEPATH ? COOKIEPATH : '/', COOKIE_DOMAIN, is_ssl(), true );
		}
		return $on = $v;
	}
	return $on = ! empty( $_COOKIE['sl_v6'] );
}
function sl6_en() {
	return function_exists( 'sl4_en' ) ? sl4_en() : ( function_exists( 'pll_current_language' ) && 'en' === pll_current_language() );
}

/* ------------------------------------------------------------------ registro de simuladores (por el slug ES de su página) */
function sl6_info( $slug = null ) {
	$all = array(
		'planificacion-cpu' => array(
			'cmd'  => array( 'planifica', 'schedule' ),
			'eng'  => 'Gantt · SVG',
			'ico'  => 'gantt',
			'd'    => array( 'FCFS, SJF, SRTF y RR', 'FCFS, SJF, SRTF and RR' ),
			'home' => array( 'FCFS, SJF, SRTF y Round Robin con su Gantt, la cola de listos y cada decisión explicada', 'FCFS, SJF, SRTF and Round Robin with the Gantt chart, the ready queue and every decision explained' ),
			'demo' => array( '--algoritmo rr --quantum 3', '--algorithm rr --quantum 3' ),
			'sc'   => 'planifica',
		),
	);
	if ( null === $slug ) {
		return $all;
	}
	return isset( $all[ $slug ] ) ? $all[ $slug ] : null;
}
add_filter( 'sl4_lab_meta', function ( $meta, $en = null ) {
	if ( ! sl_v6() ) {
		return $meta;
	}
	$en = null === $en ? sl6_en() : $en;
	foreach ( sl6_info() as $slug => $s ) {
		$meta[ $slug ] = array( $s['cmd'][ $en ? 1 : 0 ], $s['eng'], $s['ico'], $s['d'][0], $s['d'][1] );
	}
	return $meta;
}, 10, 2 );
// Vista previa: el administrador ve las páginas privadas de los simuladores en el htop, el menú y la portada (sin caché).
add_filter( 'sl4_lab_preview', function ( $v ) {
	return $v || ( sl_v6() && ! SL_V6_PUBLICO && current_user_can( 'edit_pages' ) );
} );

/* ------------------------------------------------------------------ páginas con simulador */
function sl6_has( $post = null ) {
	$post = get_post( $post );
	return $post && ( false !== strpos( $post->post_content, '[sl_sim' ) || false !== strpos( $post->post_content, 'sl-sim' ) );
}
add_filter( 'body_class', function ( $c ) {
	if ( sl_v6() && is_singular() && sl6_has() ) {
		$c[] = 'sl6-page';
	}
	return $c;
} );

function sl6_link( $id, $anchor, $t, $d, $i ) {
	if ( function_exists( 'pll_get_post' ) && sl6_en() ) {
		$id = (int) pll_get_post( $id, 'en' );
	}
	if ( ! $id ) {
		return null;
	}
	$st = get_post_status( $id );
	if ( 'publish' !== $st && ! ( current_user_can( 'edit_posts' ) && in_array( $st, array( 'future', 'draft', 'private' ), true ) ) ) {
		return null;   // el enlace aparece solo el día que se publica su artículo
	}
	return array( 'u' => get_permalink( $id ) . $anchor, 't' => $t, 'd' => $d, 'i' => $i );
}

// Cuando se publica un artículo enlazado en «Ponte a prueba», se purga la caché de las páginas del simulador para que salga su tarjeta.
add_action( 'transition_post_status', function ( $new, $old, $post ) {
	if ( 'publish' === $new && 'publish' !== $old && in_array( (int) $post->ID, array( 2754, 2755, 2757, 2758, 2927, 2928 ), true ) ) {
		foreach ( get_pages( array( 'post_status' => 'publish' ) ) as $pg ) {
			if ( false !== strpos( $pg->post_content, '[sl_sim' ) ) {
				do_action( 'litespeed_purge_post', $pg->ID );
			}
		}
	}
}, 10, 3 );

add_shortcode( 'sl_sim', function ( $atts ) {
	$a = shortcode_atts( array( 'id' => 'planifica' ), $atts );
	if ( ! sl_v6() || 'planifica' !== $a['id'] ) {
		return '';
	}
	$en    = sl6_en();
	$links = array_values( array_filter( array(
		sl6_link( 2754, '', $en ? 'CPU scheduling' : 'Planificación de la CPU', $en ? 'The theory, with these same processes' : 'La teoría, con estos mismos procesos', 'book' ),
		sl6_link( 2757, $en ? '#gantt-charts-step-by-step' : '#gantt-paso-a-paso', $en ? 'Gantt charts that mark themselves' : 'Gantt que se corrigen solos', $en ? 'Exam-style exercises of the topic' : 'Los ejercicios tipo examen del tema', 'pen' ),
		sl6_link( 2927, '', $en ? 'IC2 theory mock exam' : 'Simulacro de teoría de IC2', $en ? 'Timed and marked, like the real one' : 'Con reloj y nota, como el de verdad', 'exam' ),
	) ) );
	$GLOBALS['sl6_need'] = true;
	$h  = '<div class="sl-sim" data-sim="planifica" data-lang="' . ( $en ? 'en' : 'es' ) . '" data-links="' . esc_attr( wp_json_encode( $links ) ) . '">';
	$h .= '<noscript><p>' . esc_html( $en ? 'The simulator needs JavaScript. Example (Round Robin, quantum 3): onedrive 0/8, gcc 1/4, campus 2/9, spotify 3/2 → average waiting time 10 ms, average turnaround 15.75 ms.' : 'El simulador necesita JavaScript. Ejemplo (Round Robin, cuanto 3): onedrive 0/8, gcc 1/4, campus 2/9, spotify 3/2 → espera media 10 ms y retorno medio 15,75 ms.' ) . '</p></noscript></div>';
	return $h . sl6_css();
} );

add_shortcode( 'sl_simuladores', function () {
	if ( ! sl_v6() || ! function_exists( 'sl4_lab_data' ) ) {
		return '';
	}
	$en = sl6_en();
	$L  = sl4_lab_data();
	if ( empty( $L['sim']['list'] ) ) {
		return '';
	}
	$rows = '';
	foreach ( $L['sim']['list'] as $p ) {
		$rows .= '<a class="sl6-ls__row" href="' . esc_url( $p['u'] ) . '"><span class="sl6-ls__perm">-rwxr-xr-x</span><span class="sl6-ls__ic">' . ( function_exists( 'sl3_ico' ) ? sl3_ico( $p['i'], 18 ) : '' ) . '</span><b>' . esc_html( $p['cmd'] ) . '</b><span class="sl6-ls__n">' . esc_html( $p['n'] ) . '</span><span class="sl6-ls__d">' . esc_html( $p['d'] ) . '</span><span class="sl6-ls__go">' . esc_html( $en ? 'simulate' : 'simular' ) . ( function_exists( 'sl3_ico' ) ? sl3_ico( 'arrow', 14 ) : '' ) . '</span></a>';
	}
	$body = '<p class="sl6-ls__tot">' . esc_html( sprintf( $en ? 'total %d · every simulator runs in your browser' : 'total %d · todos funcionan en tu navegador', count( $L['sim']['list'] ) ) ) . '</p><div class="sl6-ls__rows">' . $rows . '</div>';
	$win  = function_exists( 'sl4_win' ) ? sl4_win( 'sim', 'sergio@learns: ~/' . ( $en ? 'lab/simulators' : 'laboratorio/simuladores' ), 'ls -l<span class="sl4-cur" aria-hidden="true">_</span>', $body ) : $body;
	return ( function_exists( 'sl4_assets' ) ? sl4_assets() : '' ) . '<div class="sl6-ls">' . $win . '</div>' . sl6_css();
} );

function sl6_css() {
	static $done = false;
	if ( $done ) {
		return '';
	}
	$done = true;
	return '<style id="sl6-css">' . <<<'SL6CSS'
__SL6_CSS__
SL6CSS
	. '</style>';
}
add_action( 'wp_footer', function () {
	if ( empty( $GLOBALS['sl6_need'] ) ) {
		return;
	}
	echo '<script id="sl6-js">' . <<<'SL6JS'
__SL6_JS__
SL6JS
	. '</script>';
}, 40 );
