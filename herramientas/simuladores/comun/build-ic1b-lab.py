"""Fragmentos 35 (laboratorio por asignatura) y 18 (interfaz) para los seis simuladores de IC1 que faltaban (v1.3 del 22):
- 35: bloque «Representación de datos» (un número, IEEE 754, Hamming, códigos) justo después del de MIPS, la ruta de datos en
  «Instrucciones y procesador» (entre el codificador y el pipeline) y rendimiento y E/S en «Memoria, rendimiento y E/S»;
  todo detrás de sl_v21() (SL_V21_PUBLICO del fragmento 22).
- 18: seis iconos nuevos en sl3_ico(): rd, bits, flotante, paridad, codigos, velocimetro.
Uso: python3 build-ic1b-lab.py <35.php> <35-salida.php> <18.php> <18-salida.php>"""
import sys
s = open(sys.argv[1]).read()
OLD = """	}
	return $a;
}

/** Herramientas publicadas (o en vista previa) por slug ES"""
assert s.count(OLD) == 1
NEW = """	}
	if ( function_exists( 'sl_v21' ) && sl_v21() ) {   // los seis simuladores de IC1 que faltaban (fragmento 22 v1.3)
		$a['ic1']['d'] = array( 'Ensamblador MIPS como en QtSpim y nueve simuladores de la teoría.', 'MIPS assembly like QtSpim and nine simulators for the theory.' );
		$a['ic1']['lead'] = array( 'Todo lo que hay en la web para practicar IC1 sin instalar nada: el entorno MIPS para la parte práctica y los simuladores de la teoría, ordenados como el temario. Cada tarjeta dice qué tema trabaja y qué te ayuda a ver.', 'Everything on the site to practise IC1 with nothing to install: the MIPS playground for the practical part and the simulators for the theory, in syllabus order. Each card says which topic it covers and what it helps you see.' );
		array_splice( $a['ic1']['blocks'], 1, 0, array( array(
			'h'     => array( 'Representación de datos', 'Data representation' ),
			'i'     => array( 'temas de papel 2 a 7', 'paper topics 2 to 7' ),
			'tools' => array(
				'un-numero-todas-sus-formas' => array(
					'tema' => array( 'Sistemas de numeración, aritmética binaria y complemento a 2', 'Number systems, binary arithmetic and two’s complement' ),
					'ver'  => array( 'El mismo número en todas sus formas a la vez y cada suma columna a columna, con sus acarreos y el momento en que desborda, lo que en el papel se pierde entre tantas filas.', 'The same number in all its forms at once and every sum column by column, with its carries and the moment it overflows, what gets lost among so many rows on paper.' ),
					'th'   => 4340,
				),
				'explorador-ieee-754' => array(
					'tema' => array( 'Coma flotante IEEE 754', 'IEEE 754 floating point' ),
					'ver'  => array( 'De dónde sale cada bit de la palabra y qué número se guarda de verdad, con su redondeo: el paso a hexadecimal de la cuestión del examen, comprobado.', 'Where each bit of the word comes from and which number is really stored, with its rounding: the hexadecimal conversion of the exam question, checked.' ),
					'th'   => 4816,
				),
				'hamming-en-vivo' => array(
					'tema' => array( 'Detección y corrección de errores', 'Error detection and correction' ),
					'ver'  => array( 'Qué posiciones vigila cada bit de paridad y cómo el síndrome señala el bit cambiado; y qué pasa cuando cambian dos, algo que no se ve haciendo un solo ejemplo.', 'Which positions each parity bit watches and how the syndrome points at the flipped bit; and what happens when two flip, something one example alone does not show.' ),
					'th'   => 4854,
				),
				'codigos-bcd-gray-utf8' => array(
					'tema' => array( 'Códigos: BCD, Gray y ASCII/Unicode', 'Codes: BCD, Gray and ASCII/Unicode' ),
					'ver'  => array( 'Por qué la suma BCD necesita el +6 en unas cifras y no en otras, por qué Gray cambia un solo bit y cómo se reparten los bits de un carácter en UTF-8.', 'Why a BCD sum needs +6 in some digits and not others, why Gray changes a single bit and how a character’s bits are spread across UTF-8.' ),
					'th'   => 4835,
				),
			),
		) ) );
		foreach ( $a['ic1']['blocks'] as $k => $b ) {
			if ( 'Instrucciones y procesador' === $b['h'][0] ) {
				$t = array();
				foreach ( $b['tools'] as $slug => $x ) {
					$t[ $slug ] = $x;
					if ( 'codificador-mips' === $slug ) {
						$t['ruta-de-datos'] = array(
							'tema' => array( 'Ruta de datos monociclo y unidad de control', 'Single-cycle datapath and control unit' ),
							'ver'  => array( 'Tu programa ciclo a ciclo por la ruta de datos: qué cables usa cada instrucción, qué valor lleva cada uno y qué señales pone la unidad de control, con las ampliaciones de los problemas.', 'Your program cycle by cycle through the datapath: which wires each instruction uses, what value each carries and which signals the control unit sets, with the extensions from the problems.' ),
							'th'   => 4890,
						);
					}
				}
				$a['ic1']['blocks'][ $k ]['tools'] = $t;
			}
			if ( 'Memoria, rendimiento y E/S' === $b['h'][0] ) {
				$a['ic1']['blocks'][ $k ]['tools']['rendimiento-y-entrada-salida'] = array(
					'tema' => array( 'Rendimiento (CPI y Amdahl) y entrada/salida', 'Performance (CPI and Amdahl) and input/output' ),
					'ver'  => array( 'Por qué el procesador con más MIPS puede tardar más, cuánto gana de verdad una mejora y cuánta CPU se llevan la consulta, las interrupciones y la DMA.', 'Why the processor with more MIPS can take longer, how much an improvement really gains and how much CPU polling, interrupts and DMA take.' ),
					'th'   => 4956,
				);
			}
		}
	}
	return $a;
}

/** Herramientas publicadas (o en vista previa) por slug ES"""
s = s.replace(OLD, NEW)
s = s.replace(" * SergioLearns — laboratorio por asignatura (v1.0, 9 nov 2026,", " * SergioLearns — laboratorio por asignatura (v1.1, 9 nov 2026: los seis simuladores de IC1 que faltaban, detrás de sl_v21(); v1.0, 9 nov 2026,", 1)
open(sys.argv[2], 'w').write(s)
t = open(sys.argv[3]).read()
OLD2 = """		'hex'     => '<path d="M8 4.5H5v15h3M16 4.5h3v15h-3"/><path d="M10 9v6M13.2 9h2v6h-2z"/>',
"""
assert t.count(OLD2) == 1
ICONS = {
    'rd': '<rect x="2.5" y="8" width="4.5" height="8" rx="1"/><rect x="9.5" y="5" width="5" height="14" rx="1"/><path d="M17 6.5l4.5 3v5l-4.5 3z"/><path d="M7 12h2.5M14.5 12H17"/>',
    'bits': '<rect x="3" y="6.5" width="5" height="11" rx="1.2"/><rect x="9.5" y="6.5" width="5" height="11" rx="1.2"/><rect x="16" y="6.5" width="5" height="11" rx="1.2"/><path d="M5.5 9.5v5M18.5 9.5v5M11 10.5a1 1.5 0 0 1 2 0v3a1 1.5 0 0 1-2 0z"/>',
    'flotante': '<path d="M3.5 9l2-2v10M3.5 17h4"/><circle cx="10.5" cy="16.6" r=".8"/><path d="M20 7h-6v10h6M14 12h5"/>',
    'paridad': '<path d="M12 3l7.5 3v5.5c0 4.5-3.2 7.8-7.5 9.5-4.3-1.7-7.5-5-7.5-9.5V6z"/><path d="M8.8 12.2l2.2 2.2 4.2-4.4"/>',
    'codigos': '<rect x="3.5" y="4.5" width="7" height="6.5" rx="1.2"/><rect x="13.5" y="4.5" width="7" height="6.5" rx="1.2"/><rect x="3.5" y="13" width="7" height="6.5" rx="1.2"/><path d="M14 16.2h6M17 13.2v6"/>',
    'velocimetro': '<path d="M3.8 17.5a8.2 8.2 0 1 1 16.4 0"/><path d="M12 17.5l4.2-5.2"/><circle cx="12" cy="17.5" r="1.3"/><path d="M6.6 12.2l1.3 1M17.4 12.2l-1.3 1M12 9.3v1.6"/>',
}
for k in ICONS: assert ("'" + k + "'") not in t, k
t = t.replace(OLD2, OLD2 + ''.join(f"\t\t'{k}'{' ' * max(1, 8 - len(k))}=> '{v}',\n" for k, v in ICONS.items()))
open(sys.argv[4], 'w').write(t)
print('35:', len(s), '18:', len(t))
