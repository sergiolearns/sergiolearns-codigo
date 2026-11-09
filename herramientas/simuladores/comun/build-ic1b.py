"""Monta el fragmento 22 «SergioLearns — simuladores» v1.3 a partir del v1.2 publicado: los seis simuladores de IC1 que faltaban
(ruta de datos, un número en todas sus formas, IEEE 754, Hamming, códigos y rendimiento y E/S) detrás de SL_V21_PUBLICO
(?sl_v21=1), con sus animaciones (mini-ic1b.php), su «Ponte a prueba» y el CSS común de IC1 (ic1.css) al día.
Uso: python3 build-ic1b.py <v1.2.php> <salida.php>   (necesita npx esbuild)"""
import subprocess, sys, hashlib, os
H = os.path.dirname(os.path.abspath(__file__)) + '/../'
def mini(args, inp):
    return subprocess.run(['npx', '--yes', 'esbuild', '--minify', *args], input=inp, capture_output=True, text=True, check=True).stdout.strip()
rd = lambda p: open(H + p).read()
J = lambda *ps: mini(['--loader=js', '--target=es2020'], '\n'.join(rd(p) for p in ps))
css3 = mini(['--loader=css'], rd('comun/ic1.css'))
SIMS = {
    'ruta': J('codifica/engine.js', 'ruta/engine.js', 'ruta/draw.js', 'ruta/ui.js'),
    'numero': J('numero/engine.js', 'numero/ui.js'),
    'ieee': J('ieee/engine.js', 'ieee/ui.js'),
    'hamming': J('hamming/engine.js', 'hamming/ui.js'),
    'codigos': J('codigos/engine.js', 'codigos/ui.js'),
    'rendimiento': J('rendimiento/engine.js', 'rendimiento/ui.js'),
}
TAG = {'ruta': 'SL6RD', 'numero': 'SL6NU', 'ieee': 'SL6IE', 'hamming': 'SL6HM', 'codigos': 'SL6CD', 'rendimiento': 'SL6RN'}
for v in [css3] + list(SIMS.values()):
    for bad in ['SL6CSS', 'SL6JS', 'SL6KIT', 'SL6PG', 'SL6SN', 'SL6PK', 'SL6PP', 'SL6CA', 'SL6CO'] + list(TAG.values()):
        assert bad not in v, bad
s = open(sys.argv[1]).read()
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (a[:90], s.count(a))
    s = s.replace(a, b)
# 1. cabecera
rep(" * SergioLearns — simuladores (v1.2, 9 nov 2026,", " * SergioLearns — simuladores (v1.3, 9 nov 2026, IC1: ruta de datos, un número en todas sus formas, IEEE 754, Hamming, códigos y\n *    rendimiento y E/S, detrás de SL_V21_PUBLICO (?sl_v21=1); v1.2, 9 nov 2026,")
# 2. interruptor
rep("add_filter( 'litespeed_vary_cookies', function ( $l ) { $l[] = 'sl_v6'; $l[] = 'sl_v7'; $l[] = 'sl_v20'; return $l; } );",
"""if ( ! defined( 'SL_V21_PUBLICO' ) ) {
	define( 'SL_V21_PUBLICO', false );   // los seis simuladores de IC1 que faltaban: vista previa hasta el «aplica»
}
add_filter( 'litespeed_vary_cookies', function ( $l ) { $l[] = 'sl_v6'; $l[] = 'sl_v7'; $l[] = 'sl_v20'; $l[] = 'sl_v21'; return $l; } );
function sl_v21() {   // ruta de datos, un número, IEEE 754, Hamming, códigos y rendimiento y E/S
	static $on = null;
	if ( null !== $on ) {
		return $on;
	}
	if ( ! sl_v20() ) {
		return $on = false;
	}
	if ( SL_V21_PUBLICO ) {
		return $on = true;
	}
	if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
		return $on = false;
	}
	if ( isset( $_GET['sl_v21'] ) ) {
		$v = ( '1' === $_GET['sl_v21'] );
		if ( ! headers_sent() ) {
			setcookie( 'sl_v21', $v ? '1' : '', $v ? time() + 30 * DAY_IN_SECONDS : time() - 3600, COOKIEPATH ? COOKIEPATH : '/', COOKIE_DOMAIN, is_ssl(), true );
		}
		return $on = $v;
	}
	return $on = ! empty( $_COOKIE['sl_v21'] );
}""")
# 3. registro
REG = [
    ('un-numero-todas-sus-formas', ('numero', 'number'), 'SM · C1 · C2', 'bits', ('Bases, SM, C1, C2 y sumas', 'Bases, SM, C1, C2 and sums'),
     ('Un número en binario, octal, hexadecimal, SM, C1, C2 y exceso, y sumas en columna con sus acarreos y el desbordamiento', 'A number in binary, octal, hexadecimal, SM, C1, C2 and excess, and column sums with their carries and overflow'),
     ('--bits 8 -58', '--bits 8 -58'), 'numero'),
    ('explorador-ieee-754', ('ieee754', 'ieee754'), 's · e · m', 'flotante', ('Coma flotante bit a bit', 'Floating point bit by bit'),
     ('Un número en IEEE 754 paso a paso, con el redondeo, el valor que se guarda de verdad y los bits que puedes tocar', 'A number in IEEE 754 step by step, with the rounding, the value really stored and bits you can flip'),
     ('--simple 37,6875', '--single 37.6875'), 'ieee'),
    ('hamming-en-vivo', ('hamming', 'hamming'), 'p1 · p2 · p3', 'paridad', ('Codificar, estropear y corregir', 'Encode, break and correct'),
     ('Hamming de cualquier tamaño: los grupos de paridad, el bit que cambias y el síndrome que lo encuentra', 'Hamming of any size: the parity groups, the bit you flip and the syndrome that finds it'),
     ('--par 0101 --cambia 5', '--even 0101 --flip 5'), 'hamming'),
    ('codigos-bcd-gray-utf8', ('codigo', 'code'), 'BCD · Gray · UTF-8', 'codigos', ('BCD con +6, Gray y UTF-8', 'BCD with +6, Gray and UTF-8'),
     ('Sumas BCD cifra a cifra con la corrección de +6, Gray con sus XOR y cualquier texto en ASCII y UTF-8', 'BCD sums digit by digit with the +6 fix, Gray with its XORs and any text in ASCII and UTF-8'),
     ('--bcd 58 + 67', '--bcd 58 + 67'), 'codigos'),
    ('ruta-de-datos', ('ruta', 'datapath'), 'RD · señales', 'rd', ('Cables y señales por ciclo', 'Wires and signals per cycle'),
     ('Tu programa por la ruta de datos monociclo: el camino de cada instrucción, el valor de cada cable y las señales de control', 'Your program through the single-cycle datapath: each instruction’s path, the value on every wire and the control signals'),
     ('--amplia addi,bne programa.s', '--extend addi,bne program.s'), 'ruta'),
    ('rendimiento-y-entrada-salida', ('rendimiento', 'performance'), 'CPI · Amdahl · DMA', 'velocimetro', ('CPI, Amdahl y E/S', 'CPI, Amdahl and I/O'),
     ('Tiempo de CPU y CPI medio, la ley de Amdahl con su límite y cuánta CPU se llevan la consulta, las interrupciones y la DMA', 'CPU time and average CPI, Amdahl’s law with its limit and how much CPU polling, interrupts and DMA take'),
     ('--amdahl benchmark', '--amdahl benchmark'), 'rendimiento'),
]
reg = "\tif ( sl_v21() ) {   // IC1, los seis que faltaban (hoja de ruta 7.8, paso 2)\n"
for slug, cmd, eng, ico, d, home, demo, sc in REG:
    q = lambda x: "'" + x.replace("'", "\\'") + "'"
    reg += f"\t\t$all['{slug}'] = array(\n\t\t\t'cmd'  => array( {q(cmd[0])}, {q(cmd[1])} ),\n\t\t\t'eng'  => {q(eng)},\n\t\t\t'ico'  => {q(ico)},\n\t\t\t'd'    => array( {q(d[0])}, {q(d[1])} ),\n\t\t\t'home' => array( {q(home[0])}, {q(home[1])} ),\n\t\t\t'demo' => array( {q(demo[0])}, {q(demo[1])} ),\n\t\t\t'sc'   => {q(sc)},\n\t\t);\n"
reg += "\t}\n"
rep("""	if ( null === $slug ) {
		return $all;
	}""", reg + """	if ( null === $slug ) {
		return $all;
	}""")
# 4. vista previa
rep("|| ( sl_v20() && ! SL_V20_PUBLICO && current_user_can( 'edit_pages' ) );", "|| ( sl_v20() && ! SL_V20_PUBLICO && current_user_can( 'edit_pages' ) ) || ( sl_v21() && ! SL_V21_PUBLICO && current_user_can( 'edit_pages' ) );")
# 5. purga
rep("4871, 4872, 4877, 4878, 5034, 5035 ), true )", "4871, 4872, 4877, 4878, 5034, 5035, 4340, 4341, 4346, 4347, 4427, 4428, 4446, 4447, 4452, 4453, 4816, 4817, 4822, 4823, 4835, 4836, 4841, 4842, 4854, 4855, 4860, 4861, 4890, 4891, 4896, 4897, 4907, 4908, 4956, 4957, 4962, 4963, 5019, 5020, 5025, 5026 ), true )")
# 6. «Ponte a prueba»
rep("if ( in_array( $id, array( 'pipeline', 'cache', 'codifica' ), true ) ) {", "if ( in_array( $id, array( 'pipeline', 'cache', 'codifica', 'ruta', 'numero', 'ieee', 'hamming', 'codigos', 'rendimiento' ), true ) ) {")
LINKS = {
    'ruta': [(4890, 'Single-cycle datapath', 'Ruta de datos monociclo', 'The theory, with the train and its points', 'La teoría, con el tren y sus agujas', 'book'),
             (4907, 'Control unit', 'Unidad de control', 'ALUOp, the signal table and exceptions', 'ALUOp, la tabla de señales y las excepciones', 'book'),
             (4896, 'Signals and wires, exam style', 'Señales y cables tipo examen', 'Exercises with their solutions', 'Ejercicios con su solución', 'pen')],
    'numero': [(4340, 'Number systems', 'Sistemas de numeración', 'The theory, with the colours of a photo', 'La teoría, con los colores de una foto', 'book'),
               (4427, 'Binary arithmetic', 'Aritmética binaria', 'Sign-magnitude and ones’ complement', 'Signo-magnitud y complemento a 1', 'book'),
               (4446, 'Two’s complement and overflow', 'Complemento a 2 y desbordamiento', 'The theory, with the odometer', 'La teoría, con el cuentakilómetros', 'book'),
               (4452, 'Sums and overflow, exam style', 'Sumas y desbordamiento tipo examen', 'Exercises with their solutions', 'Ejercicios con su solución', 'pen')],
    'ieee': [(4816, 'IEEE 754 floating point', 'Coma flotante IEEE 754', 'The theory, with the race stopwatch', 'La teoría, con el cronómetro de la carrera', 'book'),
             (4822, 'To hexadecimal and back', 'A hexadecimal y de vuelta', 'Exercises with their solutions', 'Ejercicios con su solución', 'pen')],
    'hamming': [(4854, 'Error detection and correction', 'Detección y corrección de errores', 'The theory, with the TV remote', 'La teoría, con el mando de la tele', 'book'),
                (4860, 'Encode and correct', 'Codificar y corregir', 'Exercises with their solutions', 'Ejercicios con su solución', 'pen')],
    'codigos': [(4835, 'Codes: BCD, Gray and Unicode', 'Códigos: BCD, Gray y Unicode', 'The theory, with the microwave', 'La teoría, con el microondas', 'book'),
                (4841, 'BCD sums and UTF-8', 'Sumas BCD y UTF-8', 'Exercises with their solutions', 'Ejercicios con su solución', 'pen')],
    'rendimiento': [(4956, 'Performance: CPI and Amdahl', 'Rendimiento: CPI y Amdahl', 'The theory, with the supermarket till', 'La teoría, con la caja del supermercado', 'book'),
                    (5019, 'Input/output', 'Entrada/salida', 'Polling, interrupts and DMA', 'Consulta, interrupciones y DMA', 'book'),
                    (4962, 'Times and speed-ups, exam style', 'Tiempos y ganancias tipo examen', 'Exercises with their solutions', 'Ejercicios con su solución', 'pen')],
}
q = lambda x: "'" + x.replace("'", "\\'") + "'"
lk = ''
for k, v in LINKS.items():
    lk += f"\t$L['{k}'] = array(\n" + ''.join(f"\t\tarray( {i}, '', $en ? {q(te)} : {q(ts)}, $en ? {q(de)} : {q(ds)}, '{ic}' ),\n" for i, te, ts, de, ds, ic in v) + "\t);\n"
rep("""	$out = array();
	foreach ( array_merge( isset( $L[ $id ] )""", lk + """	$out = array();
	foreach ( array_merge( isset( $L[ $id ] )""")
# 7. shortcode
rep("""	$ic1 = array( 'pipeline', 'cache', 'codifica' );
	if ( ! sl_v6() || ! ( 'planifica' === $id || ( in_array( $id, $new, true ) && sl_v7() ) || ( in_array( $id, $ic1, true ) && sl_v20() ) ) ) {""",
"""	$ic1 = array( 'pipeline', 'cache', 'codifica', 'ruta', 'numero', 'ieee', 'hamming', 'codigos', 'rendimiento' );
	$v21 = array( 'ruta', 'numero', 'ieee', 'hamming', 'codigos', 'rendimiento' );
	if ( ! sl_v6() || ! ( 'planifica' === $id || ( in_array( $id, $new, true ) && sl_v7() ) || ( in_array( $id, $ic1, true ) && ! in_array( $id, $v21, true ) && sl_v20() ) || ( in_array( $id, $v21, true ) && sl_v21() ) ) ) {""")
NS = {
    'ruta': ('El simulador necesita JavaScript. Ejemplo: lw $t0, 8($s0) recorre la memoria de instrucciones, el banco de registros, la extensión de signo, la ALU, la memoria de datos y MemtoReg, con RegDst = 0, ALUSrc = 1, MemtoReg = 1, RegWrite = 1, MemRead = 1, MemWrite = 0, Branch = 0, ALUOp = 00 y Jump = 0.',
             'The simulator needs JavaScript. Example: lw $t0, 8($s0) goes through the instruction memory, the register file, sign extension, the ALU, the data memory and MemtoReg, with RegDst = 0, ALUSrc = 1, MemtoReg = 1, RegWrite = 1, MemRead = 1, MemWrite = 0, Branch = 0, ALUOp = 00 and Jump = 0.'),
    'numero': ('El simulador necesita JavaScript. Ejemplo: −58 en 8 bits es 10111010 en signo-magnitud, 11000101 en C1 y 11000110 en C2; 100 + 50 en C2 de 8 bits desborda.', 'The simulator needs JavaScript. Example: −58 in 8 bits is 10111010 in sign-magnitude, 11000101 in ones’ complement and 11000110 in two’s complement; 100 + 50 in 8-bit two’s complement overflows.'),
    'ieee': ('El simulador necesita JavaScript. Ejemplo: 37,6875 = 1,00101101 × 2^5 se guarda en IEEE 754 de simple precisión como 0x4216C000.', 'The simulator needs JavaScript. Example: 37.6875 = 1.00101101 × 2^5 is stored in IEEE 754 single precision as 0x4216C000.'),
    'hamming': ('El simulador necesita JavaScript. Ejemplo: 0101 con Hamming (7,4) y paridad par se envía como 0101101; si llega 0111101, fallan los grupos de p1 y p3 y el bit erróneo es el 1 + 4 = 5.', 'The simulator needs JavaScript. Example: 0101 with Hamming (7,4) and even parity is sent as 0101101; if 0111101 arrives, the groups of p1 and p3 fail and the wrong bit is 1 + 4 = 5.'),
    'codigos': ('El simulador necesita JavaScript. Ejemplo: 58 + 67 en BCD: 8 + 7 = 15 > 9, se suma 0110; el resultado es 0001 0010 0101 = 125. La ñ en UTF-8 son los bytes C3 B1.', 'The simulator needs JavaScript. Example: 58 + 67 in BCD: 8 + 7 = 15 > 9, so 0110 is added; the result is 0001 0010 0101 = 125. ñ in UTF-8 is the bytes C3 B1.'),
    'rendimiento': ('El simulador necesita JavaScript. Ejemplo: un benchmark de 120 s (CPU 30, memoria 40, disco 50) con la CPU 5 veces más rápida tarda 96 s: ganancia 1,25.', 'The simulator needs JavaScript. Example: a 120 s benchmark (CPU 30, memory 40, disk 50) with a CPU 5 times faster takes 96 s: speed-up 1.25.'),
}
rep("""		'paquete'   => array( 'El simulador necesita JavaScript.""", ''.join(f"\t\t'{k}' => array( {q(a)}, {q(b)} ),\n" for k, (a, b) in NS.items()) + """		'paquete'   => array( 'El simulador necesita JavaScript.""")
# 8. CSS de IC1 al día
a = s.index("return '<style id=\"sl6-css3\">' . <<<'SL6CSS3'\n") + len("return '<style id=\"sl6-css3\">' . <<<'SL6CSS3'\n")
b = s.index("\nSL6CSS3", a)
s = s[:a] + css3 + s[b:]
# 9. JS
rep("""		case 'paquete':
			return <<<'SL6PK'""", ''.join(f"\t\tcase '{k}':\n\t\t\treturn <<<'{TAG[k]}'\n{v}\n{TAG[k]};\n" for k, v in SIMS.items()) + """		case 'paquete':
			return <<<'SL6PK'""")
rep("	foreach ( array( 'paginas', 'subredes', 'paquete', 'pipeline', 'cache', 'codifica' ) as $id ) {", "	foreach ( array( 'paginas', 'subredes', 'paquete', 'pipeline', 'cache', 'codifica', 'ruta', 'numero', 'ieee', 'hamming', 'codigos', 'rendimiento' ) as $id ) {")
# 10. animaciones
mini_php = open(H + 'comun/mini-ic1b.php').read()
rep("""	} else {
		return '';
	}
	return '<svg class="sl5-mg" viewBox""", mini_php + """	} else {
		return '';
	}
	return '<svg class="sl5-mg" viewBox""")
open(sys.argv[2], 'w').write(s)
print(len(s), {k: len(v) for k, v in SIMS.items()}, len(css3), hashlib.sha256(s.strip().encode()).hexdigest()[:16])
