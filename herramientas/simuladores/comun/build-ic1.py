import subprocess, hashlib, re
W = '/root/w/'
def mini(args, inp):
    return subprocess.run(['npx', 'esbuild', '--minify', *args], input=inp, capture_output=True, text=True, check=True).stdout.strip()
rd = lambda p: open(W + p).read()
J = lambda *ps: mini(['--loader=js', '--target=es2017'], '\n'.join(rd(p) for p in ps))
css3 = mini(['--loader=css'], rd('sim/comun/ic1.css'))
pp = J('sim/pipeline/spim-core.js', 'sim/pipeline/engine.js', 'sim/pipeline/trace.js', 'sim/pipeline/ui.js')
ca = J('sim/cache/engine.js', 'sim/cache/ui.js')
co = J('sim/codifica/engine.js', 'sim/codifica/ui.js')
for v in (css3, pp, ca, co):
    for bad in ['SL6CSS', 'SL6JS', 'SL6KIT', 'SL6PG', 'SL6SN', 'SL6PK', 'SL6PP', 'SL6CA', 'SL6CO']:
        assert bad not in v
s = rd('snip22-live.php')
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (a[:80], s.count(a))
    s = s.replace(a, b)
# 1. cabecera
rep(" * SergioLearns — simuladores (v1.1, 31 oct 2026,", " * SergioLearns — simuladores (v1.2, 9 nov 2026, IC1: pipeline, caché paso a paso y codificador de instrucciones, detrás de\n *    SL_V20_PUBLICO (?sl_v20=1); v1.1, 31 oct 2026,")
# 2. interruptor
rep("add_filter( 'litespeed_vary_cookies', function ( $l ) { $l[] = 'sl_v6'; $l[] = 'sl_v7'; return $l; } );",
"""if ( ! defined( 'SL_V20_PUBLICO' ) ) {
	define( 'SL_V20_PUBLICO', false );   // simuladores de IC1 (paso 2 del Laboratorio por asignatura): vista previa hasta el «aplica»
}
add_filter( 'litespeed_vary_cookies', function ( $l ) { $l[] = 'sl_v6'; $l[] = 'sl_v7'; $l[] = 'sl_v20'; return $l; } );
function sl_v20() {   // los simuladores de IC1 (pipeline, caché y codificador)
	static $on = null;
	if ( null !== $on ) {
		return $on;
	}
	if ( ! sl_v7() ) {
		return $on = false;
	}
	if ( SL_V20_PUBLICO ) {
		return $on = true;
	}
	if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
		return $on = false;
	}
	if ( isset( $_GET['sl_v20'] ) ) {
		$v = ( '1' === $_GET['sl_v20'] );
		if ( ! headers_sent() ) {
			setcookie( 'sl_v20', $v ? '1' : '', $v ? time() + 30 * DAY_IN_SECONDS : time() - 3600, COOKIEPATH ? COOKIEPATH : '/', COOKIE_DOMAIN, is_ssl(), true );
		}
		return $on = $v;
	}
	return $on = ! empty( $_COOKIE['sl_v20'] );
}""")
# 3. registro
rep("""	if ( null === $slug ) {
		return $all;
	}""", """	if ( sl_v20() ) {   // IC1 (hoja de ruta 7.8, paso 2)
		$all['pipeline-mips'] = array(
			'cmd'  => array( 'pipeline', 'pipeline' ),
			'eng'  => 'SPIM · 5 etapas',
			'ico'  => 'etapas',
			'd'    => array( 'Burbujas y anticipación', 'Bubbles and forwarding' ),
			'home' => array( 'Tu código MIPS, ejecutado con SPIM, en el pipeline de 5 etapas: burbujas, anticipación y saltos ciclo a ciclo', 'Your MIPS code, run with SPIM, in the 5-stage pipeline: bubbles, forwarding and branches cycle by cycle' ),
			'demo' => array( '--anticipacion si caja.s', '--forwarding on till.s' ),
			'sc'   => 'pipeline',
		);
		$all['cache-paso-a-paso'] = array(
			'cmd'  => array( 'cache', 'cache' ),
			'eng'  => '3 C · SVG',
			'ico'  => 'cache',
			'd'    => array( 'Directa, n vías, LRU', 'Direct, n-way, LRU' ),
			'home' => array( 'La dirección partida y la caché acceso a acceso: aciertos, fallos obligatorios, de capacidad y de conflicto', 'The split address and the cache access by access: hits and compulsory, capacity and conflict misses' ),
			'demo' => array( '--lineas 8 --palabras 2 --vias 2', '--lines 8 --words 2 --ways 2' ),
			'sc'   => 'cache',
		);
		$all['codificador-mips'] = array(
			'cmd'  => array( 'codifica', 'encode' ),
			'eng'  => 'R · I · J',
			'ico'  => 'hex',
			'd'    => array( 'Ensamblador ↔ hexadecimal', 'Assembly ↔ hexadecimal' ),
			'home' => array( 'Cada instrucción, campo a campo en binario y en hexadecimal, con el desplazamiento de los saltos explicado', 'Every instruction, field by field in binary and hexadecimal, with the branch offset explained' ),
			'demo' => array( '--desde 0x00400000 rutina.s', '--from 0x00400000 routine.s' ),
			'sc'   => 'codifica',
		);
	}
	if ( null === $slug ) {
		return $all;
	}""")
# 4. vista previa
rep("|| ( sl_v7() && ! SL_V7_PUBLICO && current_user_can( 'edit_pages' ) );", "|| ( sl_v7() && ! SL_V7_PUBLICO && current_user_can( 'edit_pages' ) ) || ( sl_v20() && ! SL_V20_PUBLICO && current_user_can( 'edit_pages' ) );")
# 5. purga
rep("2629, 2630, 2632, 2633, 2868, 2869, 2871, 2872 ), true )", "2629, 2630, 2632, 2633, 2868, 2869, 2871, 2872, 4930, 4931, 4936, 4937, 4978, 4979, 4984, 4985, 5000, 5001, 4871, 4872, 4877, 4878, 5034, 5035 ), true )")
# 6. «Ponte a prueba»
rep("""	$sim = array( 2927, '', $en ? 'IC2 theory mock exam' : 'Simulacro de teoría de IC2', $en ? 'Timed and marked, like the real one' : 'Con reloj y nota, como el de verdad', 'exam' );""",
"""	$sim = array( 2927, '', $en ? 'IC2 theory mock exam' : 'Simulacro de teoría de IC2', $en ? 'Timed and marked, like the real one' : 'Con reloj y nota, como el de verdad', 'exam' );
	if ( in_array( $id, array( 'pipeline', 'cache', 'codifica' ), true ) ) {
		$sim = array( 5034, '', $en ? 'IC1 theory mock exam' : 'Simulacro de teoría de IC1', $en ? 'On paper or on screen, like the real one' : 'En papel o en pantalla, como el de verdad', 'exam' );
	}""")
rep("""	$out = array();
	foreach ( array_merge( isset( $L[ $id ] ) ? $L[ $id ] : array(), array( $sim ) ) as $x ) {""",
"""	$L['pipeline'] = array(
		array( 4930, $en ? '#hazards-when-the-next-one-cannot-go-in' : '#riesgos-cuando-la-siguiente-no-puede-entrar', $en ? 'MIPS pipelining' : 'Segmentación del MIPS', $en ? 'The theory, with the cafeteria till' : 'La teoría, con la caja de la cafetería', 'book' ),
		array( 4936, $en ? '#level-2-dependencies-with-and-without-forwarding' : '#nivel-2-dependencias-con-y-sin-anticipacion', $en ? 'Counting cycles' : 'Contar ciclos', $en ? 'Exercises with and without forwarding' : 'Ejercicios con y sin anticipación', 'pen' ),
	);
	$L['cache'] = array(
		array( 4978, $en ? '#the-three-kinds-of-miss' : '#los-tres-tipos-de-fallo', $en ? 'Direct-mapped cache' : 'Caché de mapeo directo', $en ? 'The theory: the 3 Cs and the size' : 'La teoría: las 3 C y el tamaño', 'book' ),
		array( 5000, $en ? '#set-associative-and-fully-associative-caches' : '#caches-asociativas-por-conjuntos-y-totalmente-asociativas', $en ? 'Associative caches' : 'Cachés asociativas', $en ? 'Sets, ways, LRU and AMAT' : 'Conjuntos, vías, LRU y TMAM', 'book' ),
		array( 4984, $en ? '#level-2-a-full-sequence' : '#nivel-2-una-secuencia-completa', $en ? 'Exam-style sequences' : 'Secuencias tipo examen', $en ? 'Exercises with their solutions' : 'Ejercicios con su solución', 'pen' ),
	);
	$L['codifica'] = array(
		array( 4871, $en ? '#r-format' : '#formato-r', $en ? 'The MIPS instruction set' : 'Repertorio de instrucciones', $en ? 'The theory: R, I and J formats' : 'La teoría: formatos R, I y J', 'book' ),
		array( 4877, $en ? '#level-1-encoding-single-instructions' : '#nivel-1-codificar-instrucciones-sueltas', $en ? 'Encode and decode' : 'Codificar y decodificar', $en ? 'Exercises with their solutions' : 'Ejercicios con su solución', 'pen' ),
	);
	$out = array();
	foreach ( array_merge( isset( $L[ $id ] ) ? $L[ $id ] : array(), array( $sim ) ) as $x ) {""")
# 7. shortcode
rep("""	if ( ! sl_v6() || ! ( 'planifica' === $id || ( in_array( $id, $new, true ) && sl_v7() ) ) ) {""",
"""	$ic1 = array( 'pipeline', 'cache', 'codifica' );
	if ( ! sl_v6() || ! ( 'planifica' === $id || ( in_array( $id, $new, true ) && sl_v7() ) || ( in_array( $id, $ic1, true ) && sl_v20() ) ) ) {""")
rep("""		'paquete'   => array( 'El simulador necesita JavaScript.""", """		'pipeline'  => array( 'El simulador necesita JavaScript. Ejemplo: la caja de la cafetería (lw, lw, add, sub, sw, addi) tarda 16 ciclos sin anticipación, 11 con ella y 10 reordenada.', 'The simulator needs JavaScript. Example: the cafeteria till (lw, lw, add, sub, sw, addi) takes 16 cycles without forwarding, 11 with it and 10 reordered.' ),
		'cache'     => array( 'El simulador necesita JavaScript. Ejemplo: 36, 100, 16, 32, 20, 176, 104, 96, 180 y 108 en una caché directa de 8 líneas de 2 palabras dan un 70 % de fallos y la caché mide 728 bits.', 'The simulator needs JavaScript. Example: 36, 100, 16, 32, 20, 176, 104, 96, 180 and 108 in a direct-mapped cache of 8 two-word lines give a 70 % miss rate and the cache takes 728 bits.' ),
		'codifica'  => array( 'El simulador necesita JavaScript. Ejemplo: add $t1, $t1, $t0 es de formato R (op 0, rs 9, rt 8, rd 9, shamt 0, funct 0x20) y se codifica como 0x01284820.', 'The simulator needs JavaScript. Example: add $t1, $t1, $t0 is R format (op 0, rs 9, rt 8, rd 9, shamt 0, funct 0x20) and is encoded as 0x01284820.' ),
		'paquete'   => array( 'El simulador necesita JavaScript.""")
rep("""	$h  = '<div class="sl-sim" data-sim="' . esc_attr( $id ) . '" data-lang="' . ( $en ? 'en' : 'es' ) . '" data-links="' . esc_attr( wp_json_encode( sl6_sim_links( $id, $en ) ) ) . '">';""",
"""	$wasm = 'pipeline' === $id ? ' data-wasm="https://cdn.jsdelivr.net/gh/sergiolearns/sergiolearns-codigo@29ccb77e3cb4a1558068dd87e2da1547f5938844/herramientas/mips/entorno/sl-spim.wasm"' : '';   // el núcleo de SPIM del entorno MIPS (fragmento 19)
	$h  = '<div class="sl-sim" data-sim="' . esc_attr( $id ) . '" data-lang="' . ( $en ? 'en' : 'es' ) . '"' . $wasm . ' data-links="' . esc_attr( wp_json_encode( sl6_sim_links( $id, $en ) ) ) . '">';""")
rep("""	return $h . sl6_css() . ( 'planifica' !== $id ? sl6_css2() : '' );
} );""", """	return $h . sl6_css() . ( 'planifica' !== $id ? sl6_css2() : '' ) . ( in_array( $id, $ic1, true ) ? sl6_css3() : '' );
} );""")
# 8. css3
rep("function sl6_js( $id ) {", "function sl6_css3() {   // simuladores de IC1\n\tstatic $done = false;\n\tif ( $done ) {\n\t\treturn '';\n\t}\n\t$done = true;\n\treturn '<style id=\"sl6-css3\">' . <<<'SL6CSS3'\n" + css3 + "\nSL6CSS3\n\t. '</style>';\n}\nfunction sl6_js( $id ) {")
# 9. JS
rep("""		case 'paquete':
			return <<<'SL6PK'""", """		case 'pipeline':   // núcleo de SPIM (envoltorio de sl-mips-core.js) + motor + traza + interfaz
			return <<<'SL6PP'
""" + pp + """
SL6PP;
		case 'cache':
			return <<<'SL6CA'
""" + ca + """
SL6CA;
		case 'codifica':
			return <<<'SL6CO'
""" + co + """
SL6CO;
		case 'paquete':
			return <<<'SL6PK'""")
rep("	foreach ( array( 'paginas', 'subredes', 'paquete' ) as $id ) {", "	foreach ( array( 'paginas', 'subredes', 'paquete', 'pipeline', 'cache', 'codifica' ) as $id ) {")
# 10. animaciones
mini_php = open('/root/w/build/mini.php').read()
rep("""	} else {
		return '';
	}
	return '<svg class="sl5-mg" viewBox""", mini_php + """	} else {
		return '';
	}
	return '<svg class="sl5-mg" viewBox""")
open('/root/w/build/snip22-v12.php', 'w').write(s)
print(len(s), len(css3), len(pp), len(ca), len(co), hashlib.sha256(s.strip().encode()).hexdigest()[:16])
