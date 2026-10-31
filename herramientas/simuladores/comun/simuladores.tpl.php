<?php
/**
 * SergioLearns — simuladores (v1.1, 31 oct 2026, tanda 3: reemplazo de páginas, subredes IPv4 y el viaje de un paquete; v1.0 tanda 2:
 *    planificación de CPU). Necesita «hubs» (fragmento 20).
 * v1.1: [sl_sim id="paginas|subredes|paquete"], cada página carga solo el JS de su simulador; interruptor SL_V7_PUBLICO
 *    (en false, solo el administrador con ?sl_v7=1); sl6_mini() da la animación de cada tarjeta de la portada (fragmento 21).
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
if ( ! defined( 'SL_V7_PUBLICO' ) ) {
	define( 'SL_V7_PUBLICO', false );   // tanda 3: vista previa hasta el «aplica» de Sergio
}
add_filter( 'litespeed_vary_cookies', function ( $l ) { $l[] = 'sl_v6'; $l[] = 'sl_v7'; return $l; } );
function sl_v7() {   // los tres simuladores de la tanda 3
	static $on = null;
	if ( null !== $on ) {
		return $on;
	}
	if ( ! sl_v6() ) {
		return $on = false;
	}
	if ( SL_V7_PUBLICO ) {
		return $on = true;
	}
	if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
		return $on = false;
	}
	if ( isset( $_GET['sl_v7'] ) ) {
		$v = ( '1' === $_GET['sl_v7'] );
		if ( ! headers_sent() ) {
			setcookie( 'sl_v7', $v ? '1' : '', $v ? time() + 30 * DAY_IN_SECONDS : time() - 3600, COOKIEPATH ? COOKIEPATH : '/', COOKIE_DOMAIN, is_ssl(), true );
		}
		return $on = $v;
	}
	return $on = ! empty( $_COOKIE['sl_v7'] );
}
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
	if ( sl_v7() ) {
		$all['reemplazo-paginas'] = array(
			'cmd'  => array( 'pagina', 'paging' ),
			'eng'  => 'Traza · SVG',
			'ico'  => 'marcos',
			'd'    => array( 'FIFO, LRU y óptimo', 'FIFO, LRU and optimal' ),
			'home' => array( 'FIFO, LRU y óptimo con la traza de los marcos, cada víctima explicada y la anomalía de Belady', 'FIFO, LRU and optimal with the frame trace, every victim explained and Belady’s anomaly' ),
			'demo' => array( '--algoritmo lru --marcos 3', '--algorithm lru --frames 3' ),
			'sc'   => 'paginas',
		);
		$all['subredes-ipv4'] = array(
			'cmd'  => array( 'ipcalc', 'ipcalc' ),
			'eng'  => 'AND · SVG',
			'ico'  => 'subred',
			'd'    => array( 'Red, difusión y hosts', 'Network, broadcast and hosts' ),
			'home' => array( 'El AND bit a bit de la IP y la máscara: red, difusión, rango de hosts y si dos IP están en la misma red', 'The bitwise AND of IP and mask: network, broadcast, host range and whether two IPs share a network' ),
			'demo' => array( '10.110.7.24/24', '10.110.7.24/24' ),
			'sc'   => 'subredes',
		);
		$all['viaje-paquete'] = array(
			'cmd'  => array( 'envia', 'send' ),
			'eng'  => 'Capas · SVG',
			'ico'  => 'sobre',
			'd'    => array( 'Encapsulado capa a capa', 'Encapsulation layer by layer' ),
			'home' => array( 'Tu práctica baja por TCP/IP u OSI cabecera a cabecera y viaja por switch y routers hasta el servidor', 'Your assignment goes down TCP/IP or OSI header by header and travels through switch and routers to the server' ),
			'demo' => array( '--datos 3000 --mss 1460', '--data 3000 --mss 1460' ),
			'sc'   => 'paquete',
		);
	}
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
	return $v || ( sl_v6() && ! SL_V6_PUBLICO && current_user_can( 'edit_pages' ) ) || ( sl_v7() && ! SL_V7_PUBLICO && current_user_can( 'edit_pages' ) );
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
	if ( 'publish' === $new && 'publish' !== $old && in_array( (int) $post->ID, array( 2754, 2755, 2757, 2758, 2927, 2928, 2593, 2594, 2596, 2597, 2629, 2630, 2632, 2633, 2868, 2869, 2871, 2872 ), true ) ) {
		foreach ( get_pages( array( 'post_status' => 'publish' ) ) as $pg ) {
			if ( false !== strpos( $pg->post_content, '[sl_sim' ) ) {
				do_action( 'litespeed_purge_post', $pg->ID );
			}
		}
	}
}, 10, 3 );

function sl6_sim_links( $id, $en ) {
	$sim = array( 2927, '', $en ? 'IC2 theory mock exam' : 'Simulacro de teoría de IC2', $en ? 'Timed and marked, like the real one' : 'Con reloj y nota, como el de verdad', 'exam' );
	$L   = array(
		'planifica' => array(
			array( 2754, '', $en ? 'CPU scheduling' : 'Planificación de la CPU', $en ? 'The theory, with these same processes' : 'La teoría, con estos mismos procesos', 'book' ),
			array( 2757, $en ? '#gantt-charts-step-by-step' : '#gantt-paso-a-paso', $en ? 'Gantt charts that mark themselves' : 'Gantt que se corrigen solos', $en ? 'Exam-style exercises of the topic' : 'Los ejercicios tipo examen del tema', 'pen' ),
		),
		'paginas'   => array(
			array( 2868, $en ? '#page-replacement-algorithms' : '#algoritmos-de-reemplazo-de-paginas', $en ? 'Virtual memory' : 'Memoria virtual', $en ? 'The theory, with the same gcc string' : 'La teoría, con la misma cadena de gcc', 'book' ),
			array( 2871, $en ? '#traces-and-calculations' : '#trazas-y-calculos', $en ? 'Traces and calculations' : 'Trazas y cálculos', $en ? 'Exam-style FIFO, LRU and optimal traces' : 'Trazas de FIFO, LRU y óptimo tipo examen', 'pen' ),
		),
		'subredes'  => array(
			array( 2629, $en ? '#subnets-and-the-subnet-mask' : '#subredes-y-mascara-de-subred', $en ? 'IP addressing and subnets' : 'Direccionamiento IP y subredes', $en ? 'The theory, with the faculty’s rooms' : 'La teoría, con las aulas de la facultad', 'book' ),
			array( 2632, $en ? '#quiz-multiple-choice-questions' : '#cuestionario-preguntas-tipo-test', $en ? 'Masks that mark themselves' : 'Máscaras que se corrigen solas', $en ? 'Exam-style questions of the topic' : 'Las preguntas tipo examen del tema', 'pen' ),
		),
		'paquete'   => array(
			array( 2593, $en ? '#pd-us-and-encapsulation-envelopes-inside-envelopes' : '#pdu-y-encapsulado-sobres-dentro-de-sobres', $en ? 'OSI and TCP/IP models' : 'Modelos OSI y TCP/IP', $en ? 'The theory: envelopes inside envelopes' : 'La teoría: sobres dentro de sobres', 'book' ),
			array( 2596, $en ? '#quiz-test-questions' : '#cuestionario-preguntas-tipo-test', $en ? 'Layers and PDUs, exam style' : 'Capas y PDU tipo examen', $en ? 'Questions that mark themselves' : 'Preguntas que se corrigen solas', 'pen' ),
		),
	);
	$out = array();
	foreach ( array_merge( isset( $L[ $id ] ) ? $L[ $id ] : array(), array( $sim ) ) as $x ) {
		$out[] = sl6_link( $x[0], $x[1], $x[2], $x[3], $x[4] );
	}
	return array_values( array_filter( $out ) );
}
add_shortcode( 'sl_sim', function ( $atts ) {
	$a   = shortcode_atts( array( 'id' => 'planifica' ), $atts );
	$id  = $a['id'];
	$new = array( 'paginas', 'subredes', 'paquete' );
	if ( ! sl_v6() || ! ( 'planifica' === $id || ( in_array( $id, $new, true ) && sl_v7() ) ) ) {
		return '';
	}
	$en = sl6_en();
	$ns = array(
		'planifica' => array( 'El simulador necesita JavaScript. Ejemplo (Round Robin, cuanto 3): onedrive 0/8, gcc 1/4, campus 2/9, spotify 3/2 → espera media 10 ms y retorno medio 15,75 ms.', 'The simulator needs JavaScript. Example (Round Robin, quantum 3): onedrive 0/8, gcc 1/4, campus 2/9, spotify 3/2 → average waiting time 10 ms, average turnaround 15.75 ms.' ),
		'paginas'   => array( 'El simulador necesita JavaScript. Ejemplo: la cadena 1, 2, 1, 3, 5, 1, 2, 4, 7, 1, 4, 7, 3, 7, 4 con 3 marcos da 11 fallos con FIFO, 9 con LRU y 7 con el óptimo.', 'The simulator needs JavaScript. Example: the string 1, 2, 1, 3, 5, 1, 2, 4, 7, 1, 4, 7, 3, 7, 4 with 3 frames gives 11 faults with FIFO, 9 with LRU and 7 with the optimal algorithm.' ),
		'subredes'  => array( 'El simulador necesita JavaScript. Ejemplo: 10.110.7.24/24 → red 10.110.7.0, difusión 10.110.7.255, hosts de 10.110.7.1 a 10.110.7.254 (254).', 'The simulator needs JavaScript. Example: 10.110.7.24/24 → network 10.110.7.0, broadcast 10.110.7.255, hosts 10.110.7.1 to 10.110.7.254 (254).' ),
		'paquete'   => array( 'El simulador necesita JavaScript. Ejemplo: 3000 B con TCP y MSS 1460 → 3 segmentos y tramas de 1518, 1518 y 138 B: 3174 B en el cable.', 'The simulator needs JavaScript. Example: 3000 B over TCP with MSS 1460 → 3 segments and frames of 1518, 1518 and 138 B: 3174 B on the cable.' ),
	);
	if ( empty( $GLOBALS['sl6_need'] ) || ! is_array( $GLOBALS['sl6_need'] ) ) {
		$GLOBALS['sl6_need'] = array();
	}
	$GLOBALS['sl6_need'][ $id ] = true;
	$h  = '<div class="sl-sim" data-sim="' . esc_attr( $id ) . '" data-lang="' . ( $en ? 'en' : 'es' ) . '" data-links="' . esc_attr( wp_json_encode( sl6_sim_links( $id, $en ) ) ) . '">';
	$h .= '<noscript><p>' . esc_html( $ns[ $id ][ $en ? 1 : 0 ] ) . '</p></noscript></div>';
	return $h . sl6_css() . ( 'planifica' !== $id ? sl6_css2() : '' );
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
function sl6_css2() {
	static $done = false;
	if ( $done ) {
		return '';
	}
	$done = true;
	return '<style id="sl6-css2">' . <<<'SL6CSS2'
__SL6_CSS2__
SL6CSS2
	. '</style>';
}
function sl6_js( $id ) {
	switch ( $id ) {
		case 'planifica':
			return <<<'SL6JS'
__SL6_JS__
SL6JS;
		case 'kit':
			return <<<'SL6KIT'
__SL6_KIT__
SL6KIT;
		case 'paginas':
			return <<<'SL6PG'
__SL6_PG__
SL6PG;
		case 'subredes':
			return <<<'SL6SN'
__SL6_SN__
SL6SN;
		case 'paquete':
			return <<<'SL6PK'
__SL6_PK__
SL6PK;
	}
	return '';
}
add_action( 'wp_footer', function () {
	$need = isset( $GLOBALS['sl6_need'] ) ? $GLOBALS['sl6_need'] : null;
	if ( empty( $need ) ) {
		return;
	}
	if ( ! is_array( $need ) ) {
		$need = array( 'planifica' => true );
	}
	if ( ! empty( $need['planifica'] ) ) {
		echo '<script id="sl6-js">' . sl6_js( 'planifica' ) . '</script>';
	}
	$kit = false;
	foreach ( array( 'paginas', 'subredes', 'paquete' ) as $id ) {
		if ( empty( $need[ $id ] ) ) {
			continue;
		}
		if ( ! $kit ) {
			echo '<script id="sl6-kit">' . sl6_js( 'kit' ) . '</script>';
			$kit = true;
		}
		echo '<script id="sl6-js-' . esc_attr( $id ) . '">' . sl6_js( $id ) . '</script>';
	}
}, 40 );

/* ------------------------------------------------------------------ portada: animación de cada tarjeta de simulador (la usa el fragmento 21) */
function sl6_mini( $slug ) {
	if ( ! sl_v7() ) {
		return '';
	}
	$w = 230;
	$c = '';
	if ( 'reemplazo-paginas' === $slug ) {   // traza FIFO de la cadena de gcc (las 10 primeras referencias)
		$cols = array( array( 1, 0, 'i' ), array( 2, 1, 'i' ), array( 1, 0, 'h' ), array( 3, 2, 'i' ), array( 5, 0, 'i' ), array( 1, 1, 'i' ), array( 2, 2, 'i' ), array( 4, 0, 'i' ), array( 7, 1, 'i' ), array( 1, 2, 'i' ) );
		$fr   = array( null, null, null );
		$cw   = $w / 10;
		foreach ( $cols as $j => $x ) {
			$fr[ $x[1] ] = $x[0];
			$c          .= '<text x="' . round( $j * $cw + $cw / 2, 1 ) . '" y="10" text-anchor="middle" fill="#C9C5DC" font-size="9" font-family="JetBrains Mono,monospace" font-weight="700">' . $x[0] . '</text>';
			foreach ( $fr as $r => $v ) {
				if ( null === $v ) {
					continue;
				}
				$y   = 16 + $r * 19;
				$hit = ( $r === $x[1] );
				if ( $hit ) {
					$c .= '<rect x="' . round( $j * $cw + 2, 1 ) . '" y="' . $y . '" width="' . round( $cw - 4, 1 ) . '" height="15" rx="3" fill="' . ( 'h' === $x[2] ? '#16794B' : '#FF6B4A' ) . '"/>';
				}
				$c .= '<text x="' . round( $j * $cw + $cw / 2, 1 ) . '" y="' . ( $y + 11 ) . '" text-anchor="middle" font-size="9.5" font-family="JetBrains Mono,monospace" fill="' . ( $hit ? ( 'h' === $x[2] ? '#fff' : '#1E1B2E' ) : '#8E8AA3' ) . '">' . $v . '</text>';
			}
		}
	} elseif ( 'subredes-ipv4' === $slug ) {   // 10.110.7.24 AND 255.255.255.0 = 10.110.7.0
		$rows = array( array( 10, 110, 7, 24 ), array( 255, 255, 255, 0 ), array( 10, 110, 7, 0 ) );
		$bw   = ( $w - 9 ) / 32;
		foreach ( $rows as $r => $bytes ) {
			$y = 4 + $r * 24;
			foreach ( $bytes as $b => $v ) {
				$bits = str_pad( decbin( $v ), 8, '0', STR_PAD_LEFT );
				for ( $k = 0; $k < 8; $k++ ) {
					$x  = ( $b * 8 + $k ) * $bw + $b * 3;
					$c .= '<rect x="' . round( $x, 1 ) . '" y="' . $y . '" width="' . round( $bw - 1, 1 ) . '" height="16" rx="1.5" fill="' . ( $b < 3 ? '#5B4BDB' : '#FF6B4A' ) . '" fill-opacity="' . ( '1' === $bits[ $k ] ? ( 2 === $r ? '1' : '.85' ) : '.22' ) . '"/>';
				}
			}
		}
	} elseif ( 'viaje-paquete' === $slug ) {   // los sobres de TCP/IP, uno dentro de otro
		$L = array( array( array( 'D', 150, '#A99EF5' ) ), array( array( 'TCP', 34, '#2F5FD0' ), array( 'D', 150, '#A99EF5' ) ), array( array( 'IP', 30, '#16794B' ), array( 'TCP', 34, '#2F5FD0' ), array( 'D', 136, '#A99EF5' ) ), array( array( 'ETH', 34, '#FF6B4A' ), array( 'IP', 30, '#16794B' ), array( 'TCP', 34, '#2F5FD0' ), array( 'D', 108, '#A99EF5' ), array( 'FCS', 24, '#FF6B4A' ) ) );
		foreach ( $L as $r => $parts ) {
			$y = 2 + $r * 18;
			$x = 0;
			foreach ( $parts as $p ) {
				$c .= '<rect x="' . $x . '" y="' . $y . '" width="' . ( $p[1] - 1.5 ) . '" height="14" rx="3" fill="' . $p[2] . '"/>';
				if ( 'D' !== $p[0] ) {
					$c .= '<text x="' . ( $x + $p[1] / 2 ) . '" y="' . ( $y + 10.5 ) . '" text-anchor="middle" font-size="8.5" font-weight="700" font-family="JetBrains Mono,monospace" fill="' . ( '#FF6B4A' === $p[2] ? '#1E1B2E' : '#fff' ) . '">' . $p[0] . '</text>';
				}
				$x += $p[1];
			}
		}
	} else {
		return '';
	}
	return '<svg class="sl5-mg" viewBox="0 0 ' . $w . ' 74" preserveAspectRatio="none" aria-hidden="true"><g class="sl5-mg__bars">' . $c . '</g><rect class="sl5-mg__cov" x="0" y="0" width="' . ( $w + 2 ) . '" height="74"/><line class="sl5-mg__now" x1="0" x2="0" y1="0" y2="74"/></svg>';
}
