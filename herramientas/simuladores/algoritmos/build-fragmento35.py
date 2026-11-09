"""Fragmento 35 «laboratorio por asignatura» v1.3: el visualizador de algoritmos (fragmento 22 v1.5, sl_v24()) en los hubs de FP1 y FP2.
Uso: python3 build-fragmento35.py <v1.2.php> <salida.php>"""
import sys
src, out = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (a[:90], s.count(a))
    s = s.replace(a, b)
rep("""	if ( function_exists( 'sl_v20' ) && sl_v20() ) {   // simuladores de IC1""", """	if ( function_exists( 'sl_v24' ) && sl_v24() ) {   // el visualizador de algoritmos (fragmento 22 v1.5)
		$a['fp1']['blocks'][0]['tools']['visualizador-algoritmos'] = array(
			'tema' => array( 'Recursividad en Python (y búsquedas y ordenación)', 'Recursion in Python (and searching and sorting)' ),
			'ver'  => array( 'Lo que pasa dentro de una función recursiva: cada llamada que se apila, lo que devuelve y el árbol entero, y cómo encoge la zona en la búsqueda binaria, con tu programa ejecutado por Python de verdad.', 'What happens inside a recursive function: every call that is pushed, what it returns and the whole tree, and how the range shrinks in binary search, with your program really run by Python.' ),
			'th'   => 2264,
		);
		foreach ( $a['fp2']['blocks'] as $k => $b ) {
			if ( 'Java' === $b['h'][0] ) {
				$a['fp2']['blocks'][ $k ]['tools']['visualizador-algoritmos'] = array(
					'tema' => array( 'Arrays: ordenar y buscar (Arrays.sort y binarySearch)', 'Arrays: sorting and searching (Arrays.sort and binarySearch)' ),
					'ver'  => array( 'Qué hacen por dentro burbuja, selección, inserción, mezcla y quicksort, comparación a comparación, con la versión de Java al lado para comparar.', 'What bubble, selection, insertion, merge sort and quicksort do inside, comparison by comparison, with the Java version alongside to compare.' ),
					'th'   => 1935,
				);
			}
		}
		$a['fp1']['d'] = array( 'Python desde cero: el entorno de los ejercicios y del simulacro práctico, el probador de expresiones regulares y el visualizador de algoritmos.', 'Python from scratch: the playground for the exercises and the practical mock exam, the regular expression tester and the algorithm visualizer.' );
	}
	if ( function_exists( 'sl_v20' ) && sl_v20() ) {   // simuladores de IC1""")
open(out, 'w', encoding='utf-8').write(s)
print(out, len(s))
