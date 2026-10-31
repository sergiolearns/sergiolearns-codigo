<?php
/**
 * SergioLearns — contacto (v1.0, 31 oct 2026, con la tanda 4). Formulario de contacto en /contacto/ y /en/contact/ (1722/1724),
 * metido al vuelo tras el párrafo del correo (filtro the_content: la página no se toca).
 * - Envío por la API (POST /wp-json/sl/v1/contacto), sin recargar. Campos: nombre, correo, motivo, enlace (opcional), mensaje
 *   y la casilla de la política de privacidad. Llega a sergio@sergiolearns.com (Responder = el correo de quien escribe).
 * - Copia en wp-admin → «Mensajes» (tipo privado sl_mensaje, solo administradores): si el correo falla, no se pierde nada.
 *   Los mensajes de más de 12 meses se borran solos (tarea diaria), como dice la política de privacidad.
 * - Antispam sin terceros: campo trampa, ficha que pone el JavaScript al escribir, tiempo mínimo y límite por IP
 *   (la IP solo como hash temporal, no se guarda) y tope diario.
 * Mientras SL_V9_PUBLICO sea false, solo lo ve el administrador con ?sl_v9=1 (cookie; ?sl_v9=0 la quita). Sin emoticonos.
 */
if ( ! defined( 'SL_V9_PUBLICO' ) ) {
	define( 'SL_V9_PUBLICO', true );   // «aplica» de Sergio (31 oct 2026)
}
if ( ! defined( 'SL_CONTACTO_PARA' ) ) {
	define( 'SL_CONTACTO_PARA', 'sergio@sergiolearns.com' );
}
add_filter( 'litespeed_vary_cookies', function ( $l ) { $l[] = 'sl_v9'; return $l; } );
function sl_v9() {
	static $on = null;
	if ( null !== $on ) {
		return $on;
	}
	if ( SL_V9_PUBLICO ) {
		return $on = true;
	}
	if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
		return $on = false;
	}
	if ( isset( $_GET['sl_v9'] ) ) {
		$v = ( '1' === $_GET['sl_v9'] );
		if ( ! headers_sent() ) {
			setcookie( 'sl_v9', $v ? '1' : '', $v ? time() + 30 * DAY_IN_SECONDS : time() - 3600, COOKIEPATH ? COOKIEPATH : '/', COOKIE_DOMAIN, is_ssl(), true );
		}
		return $on = $v;
	}
	return $on = ! empty( $_COOKIE['sl_v9'] );
}

/* ---------- copia de los mensajes en wp-admin (privada) ---------- */
add_action( 'init', function () {
	register_post_type( 'sl_mensaje', array(
		'labels'          => array( 'name' => 'Mensajes', 'singular_name' => 'Mensaje', 'menu_name' => 'Mensajes', 'all_items' => 'Mensajes de contacto', 'edit_item' => 'Mensaje', 'search_items' => 'Buscar mensajes', 'not_found' => 'No hay mensajes' ),
		'public'          => false,
		'show_ui'         => true,
		'show_in_menu'    => true,
		'show_in_rest'    => false,
		'menu_icon'       => 'dashicons-email-alt',
		'menu_position'   => 26,
		'supports'        => array( 'title', 'editor' ),
		'capability_type' => 'post',
		'capabilities'    => array( 'create_posts' => 'do_not_allow', 'edit_post' => 'manage_options', 'read_post' => 'manage_options', 'delete_post' => 'manage_options', 'edit_posts' => 'manage_options', 'edit_others_posts' => 'manage_options', 'delete_posts' => 'manage_options', 'publish_posts' => 'manage_options', 'read_private_posts' => 'manage_options' ),
		'map_meta_cap'    => false,
	) );
} );
add_action( 'sl9_limpia', function () {
	$old = get_posts( array( 'post_type' => 'sl_mensaje', 'post_status' => 'any', 'numberposts' => 50, 'fields' => 'ids', 'date_query' => array( array( 'before' => '12 months ago' ) ) ) );
	foreach ( $old as $id ) {
		wp_delete_post( $id, true );
	}
} );
add_action( 'init', function () {
	if ( ! wp_next_scheduled( 'sl9_limpia' ) ) {
		wp_schedule_event( time() + HOUR_IN_SECONDS, 'daily', 'sl9_limpia' );
	}
} );

/* ---------- textos ---------- */
function sl9_t( $en ) {
	return $en ? array(
		'h' => 'Write to me here', 'cmd' => 'mail -s', 'nombre' => 'Your name', 'correo' => 'Your email', 'motivo' => 'What it is about',
		'motivos' => array( 'error' => 'A mistake in an article', 'duda' => 'A question', 'propuesta' => 'A topic or idea for the site', 'colabora' => 'A collaboration', 'otro' => 'Something else' ),
		'enlace' => 'Article link (optional)', 'enlace_ph' => 'https://sergiolearns.com/en/…', 'mensaje' => 'Message', 'mensaje_ph' => 'Tell me what happened, what you would like to see or what you are working on.',
		'priv' => 'I have read the %s: my details are only used to reply to me.', 'priv_l' => 'privacy policy', 'priv_u' => home_url( '/en/privacy-policy/' ),
		'enviar' => 'Send message', 'enviando' => 'Sending…', 'ok' => 'Message sent. I usually reply within a few days (a bit longer in exam season).',
		'err' => 'It could not be sent. Try again in a minute or write to sergio@sergiolearns.com.', 'req' => 'Required', 'nojs' => 'The form needs JavaScript; you can write to sergio@sergiolearns.com.',
		'otra' => 'Write another one', 'cuenta' => '%d / 5000',
	) : array(
		'h' => 'Escríbeme desde aquí', 'cmd' => 'mail -s', 'nombre' => 'Tu nombre', 'correo' => 'Tu correo', 'motivo' => 'Sobre qué es',
		'motivos' => array( 'error' => 'Un error en un artículo', 'duda' => 'Una duda', 'propuesta' => 'Un tema o una idea para la web', 'colabora' => 'Una colaboración', 'otro' => 'Otra cosa' ),
		'enlace' => 'Enlace del artículo (opcional)', 'enlace_ph' => 'https://sergiolearns.com/…', 'mensaje' => 'Mensaje', 'mensaje_ph' => 'Cuéntame qué ha pasado, qué te gustaría ver o en qué estás trabajando.',
		'priv' => 'He leído la %s: mis datos solo se usan para responderme.', 'priv_l' => 'política de privacidad', 'priv_u' => home_url( '/politica-de-privacidad/' ),
		'enviar' => 'Enviar mensaje', 'enviando' => 'Enviando…', 'ok' => 'Mensaje enviado. Suelo responder en unos días (en época de exámenes, algo más).',
		'err' => 'No se ha podido enviar. Prueba dentro de un minuto o escríbeme a sergio@sergiolearns.com.', 'req' => 'Obligatorio', 'nojs' => 'El formulario necesita JavaScript; puedes escribirme a sergio@sergiolearns.com.',
		'otra' => 'Escribir otro', 'cuenta' => '%d / 5000',
	);
}

function sl9_form( $en ) {
	$t  = sl9_t( $en );
	$ic = function ( $p, $s = 16 ) { return '<svg width="' . $s . '" height="' . $s . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' . $p . '</svg>'; };
	$opt = '';
	foreach ( $t['motivos'] as $k => $v ) {
		$opt .= '<option value="' . esc_attr( $k ) . '">' . esc_html( $v ) . '</option>';
	}
	$h  = '<div class="sl9" id="formulario">';
	$h .= '<div class="sl9-bar"><span class="sl9-dot" aria-hidden="true"></span><span class="sl9-bar__t">' . esc_html( $t['cmd'] ) . ' &quot;<span class="sl9-subj">' . esc_html( reset( $t['motivos'] ) ) . '</span>&quot; sergio@sergiolearns.com<i class="sl9-cur" aria-hidden="true">_</i></span></div>';
	$h .= '<form class="sl9-f" novalidate data-api="' . esc_url( rest_url( 'sl/v1/contacto' ) ) . '" data-lang="' . ( $en ? 'en' : 'es' ) . '"' . ( ( ! SL_V9_PUBLICO && current_user_can( 'manage_options' ) ) ? ' data-nonce="' . esc_attr( wp_create_nonce( 'wp_rest' ) ) . '"' : '' ) . ' data-t="' . esc_attr( wp_json_encode( array( 'enviar' => $t['enviar'], 'enviando' => $t['enviando'], 'ok' => $t['ok'], 'err' => $t['err'], 'req' => $t['req'], 'otra' => $t['otra'] ) ) ) . '">';
	$h .= '<p class="sl9-h">' . esc_html( $t['h'] ) . '</p>';
	$h .= '<div class="sl9-2"><label class="sl9-l"><span>' . esc_html( $t['nombre'] ) . '</span><input name="nombre" type="text" maxlength="80" autocomplete="name" required></label>';
	$h .= '<label class="sl9-l"><span>' . esc_html( $t['correo'] ) . '</span><input name="correo" type="email" maxlength="120" autocomplete="email" required></label></div>';
	$h .= '<div class="sl9-2"><label class="sl9-l"><span>' . esc_html( $t['motivo'] ) . '</span><select name="motivo">' . $opt . '</select></label>';
	$h .= '<label class="sl9-l"><span>' . esc_html( $t['enlace'] ) . '</span><input name="enlace" type="url" maxlength="300" placeholder="' . esc_attr( $t['enlace_ph'] ) . '"></label></div>';
	$h .= '<label class="sl9-l"><span>' . esc_html( $t['mensaje'] ) . '<em class="sl9-n">0 / 5000</em></span><textarea name="mensaje" rows="6" maxlength="5000" placeholder="' . esc_attr( $t['mensaje_ph'] ) . '" required></textarea></label>';
	$h .= '<label class="sl9-hp" aria-hidden="true">Web<input name="web" type="text" tabindex="-1" autocomplete="off"></label>';
	$h .= '<label class="sl9-c"><input name="priv" type="checkbox" value="1" required><span>' . sprintf( esc_html( $t['priv'] ), '<a href="' . esc_url( $t['priv_u'] ) . '" target="_blank" rel="noopener">' . esc_html( $t['priv_l'] ) . '</a>' ) . '</span></label>';
	$h .= '<div class="sl9-act"><button type="submit" class="sl9-b">' . $ic( '<path d="M4 12l16-8-6 16-2.5-6.5z"/><path d="M11.5 13.5L20 4"/>' ) . '<span>' . esc_html( $t['enviar'] ) . '</span></button><p class="sl9-st" role="status" aria-live="polite"></p></div>';
	$h .= '</form><noscript><p class="sl9-nojs">' . esc_html( $t['nojs'] ) . '</p></noscript></div>';
	return $h . sl9_assets();
}

function sl9_assets() {
	static $done = false;
	if ( $done ) {
		return '';
	}
	$done = true;
	return '<style id="sl9-css">@@CSS@@</style><script id="sl9-js">@@JS@@</script>';
}

/* ---------- la página: el formulario tras el párrafo del correo ---------- */
add_filter( 'the_content', function ( $c ) {
	if ( ! sl_v9() || ! is_page( array( 1722, 1724 ) ) || ! in_the_loop() || ! is_main_query() ) {
		return $c;
	}
	$en = is_page( 1724 );
	$i  = strpos( $c, 'mailto:sergio@sergiolearns.com' );
	$j  = false !== $i ? strpos( $c, '</p>', $i ) : false;
	$f  = sl9_form( $en );
	return false === $j ? $c . $f : substr( $c, 0, $j + 4 ) . $f . substr( $c, $j + 4 );
}, 20 );

/* ---------- la API ---------- */
add_action( 'rest_api_init', function () {
	register_rest_route( 'sl/v1', '/contacto', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true',
		'callback'            => 'sl9_recibe',
	) );
} );
function sl9_recibe( WP_REST_Request $r ) {
	if ( ! sl_v9() && ! SL_V9_PUBLICO ) {
		return new WP_REST_Response( array( 'ok' => false, 'e' => 'off' ), 403 );
	}
	$p   = $r->get_json_params();
	$p   = is_array( $p ) ? $p : array();
	$g   = function ( $k, $n ) use ( $p ) { return isset( $p[ $k ] ) && is_string( $p[ $k ] ) ? trim( wp_unslash( mb_substr( $p[ $k ], 0, $n ) ) ) : ''; };
	$en  = 'en' === $g( 'lang', 2 );
	// antispam: campo trampa, ficha del JavaScript y tiempo mínimo (ini = ms desde que se empezó a escribir, medidos en el navegador; mínimo 3 s)
	$tok = $g( 'tok', 40 );
	$ini = (int) $g( 'ini', 20 );
	if ( '' !== $g( 'web', 200 ) || ! preg_match( '/^sl9-[0-9a-z]{6,30}$/', $tok ) || $ini < 3000 ) {
		return new WP_REST_Response( array( 'ok' => true ), 200 );   // a los robots se les dice que sí
	}
	$ip = hash( 'sha256', ( isset( $_SERVER['REMOTE_ADDR'] ) ? $_SERVER['REMOTE_ADDR'] : '' ) . wp_salt( 'nonce' ) );
	$kk = 'sl9_ip_' . substr( $ip, 0, 20 );
	$n  = (int) get_transient( $kk );
	$dd = (int) get_transient( 'sl9_dia' );
	if ( $n >= 5 || $dd >= 40 ) {
		return new WP_REST_Response( array( 'ok' => false, 'e' => 'limite' ), 429 );
	}
	$nombre  = sanitize_text_field( $g( 'nombre', 80 ) );
	$correo  = sanitize_email( $g( 'correo', 120 ) );
	$motivo  = $g( 'motivo', 20 );
	$enlace  = esc_url_raw( $g( 'enlace', 300 ) );
	$mensaje = sanitize_textarea_field( $g( 'mensaje', 5000 ) );
	$t       = sl9_t( $en );
	if ( '' === $nombre || ! is_email( $correo ) || mb_strlen( $mensaje ) < 10 || empty( $p['priv'] ) || ! isset( $t['motivos'][ $motivo ] ) ) {
		return new WP_REST_Response( array( 'ok' => false, 'e' => 'datos' ), 400 );
	}
	set_transient( $kk, $n + 1, HOUR_IN_SECONDS );
	set_transient( 'sl9_dia', $dd + 1, DAY_IN_SECONDS );
	$mot  = sl9_t( false )['motivos'][ $motivo ];
	$body = "Nombre: $nombre\nCorreo: $correo\nMotivo: $mot\nIdioma: " . ( $en ? 'inglés' : 'español' ) . "\n" . ( $enlace ? "Enlace: $enlace\n" : '' ) . "\n$mensaje\n\n— Enviado desde el formulario de contacto de sergiolearns.com (" . wp_date( 'j M Y, H:i' ) . ')';
	$id   = wp_insert_post( array( 'post_type' => 'sl_mensaje', 'post_status' => 'private', 'post_title' => $mot . ' · ' . $nombre . ' <' . $correo . '>', 'post_content' => $body ) );
	$ok   = wp_mail( SL_CONTACTO_PARA, '[SergioLearns] ' . $mot . ' · ' . $nombre, $body, array( 'Content-Type: text/plain; charset=UTF-8', 'Reply-To: ' . str_replace( array( "\r", "\n", '<', '>' ), '', $nombre ) . ' <' . $correo . '>' ) );
	if ( $id && ! is_wp_error( $id ) ) {
		update_post_meta( $id, 'sl9_correo_enviado', $ok ? 'si' : 'no' );
	}
	return new WP_REST_Response( array( 'ok' => (bool) ( $ok || $id ) ), 200 );
}
