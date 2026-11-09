"""Ejemplos del visualizador de algoritmos: se escriben en español (ej/es/*.py y ej/java-es/*.java) y el inglés se saca
cambiando nombres y textos. Genera ejemplos.json (lo mete build.py en el JS) y ej/en, ej/java-en (para las pruebas)."""
import json, os, re
D = os.path.dirname(os.path.abspath(__file__))

# k, categoría, nombre ES, nombre EN, parámetros [(nombre ES, tipo)], ordenada?, nombre del reto
EX = [
    ('busqueda-lineal', 'bus', 'Búsqueda lineal', 'Linear search', [('notas', 'list'), ('buscado', 'int')], False),
    ('busqueda-binaria', 'bus', 'Búsqueda binaria (iterativa)', 'Binary search (iterative)', [('turnos', 'list'), ('buscado', 'int')], True),
    ('binaria-recursiva', 'bus', 'Búsqueda binaria recursiva (inmersión)', 'Recursive binary search (helper with bounds)', [('turnos', 'list'), ('buscado', 'int')], True),
    ('factorial', 'rec', 'Factorial', 'Factorial', [('n', 'int')], False),
    ('potencia-doble', 'rec', 'Potencia: dos llamadas por nivel', 'Power: two calls per level', [('base', 'int'), ('exp', 'int')], False),
    ('potencia-rapida', 'rec', 'Potencia rápida: una llamada por nivel', 'Fast power: one call per level', [('base', 'int'), ('exp', 'int')], False),
    ('fibonacci', 'rec', 'Fibonacci (el árbol que se repite)', 'Fibonacci (the tree that repeats itself)', [('n', 'int')], False),
    ('hanoi', 'rec', 'Torres de Hanói', 'Towers of Hanoi', [('n', 'int')], False),
    ('burbuja', 'ord', 'Burbuja', 'Bubble sort', [('notas', 'list')], False),
    ('seleccion', 'ord', 'Selección', 'Selection sort', [('notas', 'list')], False),
    ('insercion', 'ord', 'Inserción', 'Insertion sort', [('notas', 'list')], False),
    ('mezcla', 'ava', 'Mezcla (mergesort)', 'Merge sort', [('notas', 'list')], False),
    ('rapida', 'ava', 'Rápida (quicksort)', 'Quicksort', [('notas', 'list')], False),
]
# rangos de los números al azar: (mín, máx)
RANGO = {'buscado': None, 'n': {'factorial': (1, 7), 'fibonacci': (2, 7), 'hanoi': (1, 4)}, 'base': (2, 3), 'exp': (1, 16)}

LIT = {   # textos que hay que cambiar antes que las palabras
    'hanoi': [('"Disco", n, "de", origen, "a", destino', '"Disk", n, "from", origen, "to", destino'),
              ('"Disco " + n + " de " + origen + " a " + destino', '"Disk " + n + " from " + origen + " to " + destino')],
}
TXT = [('Está en la posición', 'Found at position'), ('Turno en la posición', 'Ticket at position')]
W = {
    'buscar': 'find', 'lista': 'items', 'buscado': 'target', 'notas': 'marks', 'turnos': 'tickets',
    'busqueda_binaria': 'binary_search', 'busquedaBinaria': 'binarySearch', 'inf': 'low', 'sup': 'high', 'medio': 'mid',
    'buscar_entre': 'find_between', 'buscarEntre': 'findBetween', 'potencia': 'power', 'mitad': 'half',
    'origen': 'source', 'destino': 'dest', 'auxiliar': 'spare', 'burbuja': 'bubble_sort', 'vuelta': 'lap',
    'hubo_cambio': 'swapped', 'huboCambio': 'swapped', 'seleccion': 'selection_sort', 'insercion': 'insertion_sort',
    'clave': 'key', 'ordenar_mezcla': 'merge_sort', 'ordenarMezcla': 'mergeSort', 'mezclar': 'merge', 'izq': 'left',
    'der': 'right', 'resultado': 'result', 'ordenacion_rapida': 'quick_sort', 'ordenacionRapida': 'quickSort',
    'particion': 'partition', 'pivote': 'pivot', 'aux': 'tmp',
}
WJ = {'burbuja': 'bubbleSort', 'seleccion': 'selectionSort', 'insercion': 'insertionSort'}   # en Java, camelCase


def en(k, s, java):
    for a, b in LIT.get(k, []) + TXT:
        s = s.replace(a, b)
    m = dict(W)
    if java:
        m.update(WJ)
    return re.sub(r'\b[A-Za-z_][A-Za-z0-9_]*\b', lambda x: m.get(x.group(0), x.group(0)), s)


def main():
    out = []
    for d in ('en', 'java-en'):
        os.makedirs(os.path.join(D, 'ej', d), exist_ok=True)
    for k, cat, nes, nen, params, ordenada in EX:
        py = open(os.path.join(D, 'ej', 'es', k + '.py'), encoding='utf-8').read()
        jv = open(os.path.join(D, 'ej', 'java-es', k + '.java'), encoding='utf-8').read()
        pye, jve = en(k, py, False), en(k, jv, True)
        open(os.path.join(D, 'ej', 'en', k + '.py'), 'w', encoding='utf-8').write(pye)
        open(os.path.join(D, 'ej', 'java-en', k + '.java'), 'w', encoding='utf-8').write(jve)
        out.append({'k': k, 'c': cat, 'n': [nes, nen], 'p': [[p, en(k, p, False), t] for p, t in params], 's': ordenada,
                    'py': [py, pye], 'java': [jv, jve]})
    json.dump(out, open(os.path.join(D, 'ejemplos.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    print(len(out), 'ejemplos')


if __name__ == '__main__':
    main()
