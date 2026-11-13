#!/usr/bin/env python3
"""Fragmento 19 (SergioLearns — entorno MIPS) v2.0: la v1.0.2 de jsDelivr para todos y la v2.0 (carcasa D) en línea
detrás de SL_V58_PUBLICO / ?sl_v58=1 (solo administrador). El fragmento de rendimiento saca los bloques en línea a sl-assets.
Uso: python3 build-fragmento19.py <salida.php> [--publico]"""
import sys, os
D = os.path.dirname(os.path.abspath(__file__))
js = open(D + '/../sl-mips.min.js', encoding='utf-8').read()
css = open(D + '/../sl-mips.min.css', encoding='utf-8').read()
for k in ('SLM2JS', 'SLM2CSS'):
    assert k not in js and k not in css
assert '</script' not in js.lower() and '</style' not in css.lower()
pub = 'true' if '--publico' in sys.argv else 'false'
php = r"""/* SergioLearns — entorno MIPS (sl-mips; v2.0 del fragmento, 13 nov 2026). Editor al estilo de Notepad++ y simulador al estilo de
 * QtSpim (núcleo de SPIM 9.1.20 en WebAssembly, licencia BSD) para la sección Entornos y los artículos de MIPS de IC1.
 * Solo se carga en las entradas y páginas que contienen «sl-mips».
 * - v1.0.2 (29 oct 2026): por jsDelivr fijado al commit 29ccb77 del repositorio sergiolearns/sergiolearns-codigo
 *   (herramientas/mips/entorno/); el editor es el CodeMirror 6 de herramientas/entorno/ (el de sl-ide).
 * - v2.0 (13 nov 2026, hoja de ruta 7.12, punto 5): la carcasa D de los entornos (tarjeta con la sombra de su color, un solo botón
 *   principal, «Ajustar», claro por defecto y oscuro, barra pegada abajo en el móvil, pastillas de ejemplos en la página de
 *   Entornos, pantalla completa con el editor y el simulador a la vez), la frase de cada instrucción con «Explícamelo con
 *   calma» y la tarjeta de error en español o inglés («Ir a la línea», «Pregúntale a Leo» y el mensaje de SPIM plegado; no
 *   sale en el modo examen). Las excepciones que SPIM ignora ya no acaban en «Programa terminado» a secas, y los bucles de
 *   excepciones (un jr a 0, una recursión sin fin) se paran. Va en línea (el fragmento de rendimiento lo saca a sl-assets) detrás de SL_V58_PUBLICO: false → solo el
 *   administrador con ?sl_v58=1 (cookie; ?sl_v58=0 la quita). El wasm de SPIM sigue saliendo de jsDelivr.
 * Fuente: 04-herramientas/entorno/mips/ y 10-redes/github/sergiolearns-codigo/herramientas/mips/entorno/. Ejecutar solo en la
 * parte pública. Sin emoticonos. */
if ( ! defined( 'SL_V58_PUBLICO' ) ) {
	define( 'SL_V58_PUBLICO', __PUB__ );   // entornos con la carcasa D (MIPS primero)
}
add_filter( 'litespeed_vary_cookies', function ( $l ) { $l[] = 'sl_v58'; return $l; } );
function sl_v58() {
	static $on = null;
	if ( null !== $on ) {
		return $on;
	}
	if ( SL_V58_PUBLICO ) {
		return $on = true;
	}
	if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
		return $on = false;
	}
	if ( isset( $_GET['sl_v58'] ) ) {
		$v = ( '1' === $_GET['sl_v58'] );
		if ( ! headers_sent() ) {
			setcookie( 'sl_v58', $v ? '1' : '', $v ? time() + 30 * DAY_IN_SECONDS : time() - 3600, COOKIEPATH ? COOKIEPATH : '/', COOKIE_DOMAIN, is_ssl(), true );
		}
		return $on = $v;
	}
	return $on = ! empty( $_COOKIE['sl_v58'] );
}
add_action( 'template_redirect', function () { sl_v58(); } );   // la cookie, antes de que salgan las cabeceras
add_action( 'wp_footer', function () {
	if ( ! is_singular() ) { return; }
	$post = get_post();
	if ( ! $post || strpos( $post->post_content, 'sl-mips' ) === false ) { return; }
	$base = 'https://cdn.jsdelivr.net/gh/sergiolearns/sergiolearns-codigo@29ccb77e3cb4a1558068dd87e2da1547f5938844/herramientas/mips/entorno/';
	echo '<script>window.SL_MIPS_BASE = ' . wp_json_encode( array(
		'wasm' => $base . 'sl-spim.wasm',
		'cm'   => 'https://cdn.jsdelivr.net/gh/sergiolearns/sergiolearns-codigo@a7cc496f11a874134ff10b1d7cdcc0d9f66c55d6/herramientas/entorno/sl-cm-6.0.2-v1.2.min.js',
	), JSON_UNESCAPED_SLASHES ) . ';</script>' . "\n";
	if ( sl_v58() ) {
		echo '<style id="sl-mips2-css">' . <<<'SLM2CSS'
__CSS__
SLM2CSS
		. '</style>' . "\n";
		echo '<script id="sl-mips2-js">' . <<<'SLM2JS'
__JS__
SLM2JS
		. '</script>' . "\n";
		return;
	}
	echo '<link rel="stylesheet" id="sl-mips-css" href="' . esc_url( $base . 'sl-mips.min.css' ) . '">' . "\n";
	echo '<script src="' . esc_url( $base . 'sl-mips.min.js' ) . '" defer></script>' . "\n";
}, 30 );
"""
php = php.replace('__PUB__', pub).replace('__CSS__', css).replace('__JS__', js)
open(sys.argv[1], 'w', encoding='utf-8').write(php)
print('ok', len(php))
