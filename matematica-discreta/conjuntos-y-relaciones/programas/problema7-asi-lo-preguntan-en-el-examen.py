# SergioLearns · Matemática discreta (MD) · Conjuntos y relaciones
# Problema 7: así lo preguntan en el examen
# https://sergiolearns.com/conjuntos-y-relaciones-practica/

from itertools import product

expresiones = {
    "(1)": lambda a, b, c: (a or b) and not c,
    "(2)": lambda a, b, c: (a and b) or (b and c),
    "(3)": lambda a, b, c: (a and not c) or (c and not a),
    "(4)": lambda a, b, c: c and (not a or not b),
    "(5)": lambda a, b, c: (a and c) and not b,
}
diagramas = {"a": {"111", "110", "011"}, "b": {"110", "100", "011", "001"},
             "c": {"110", "100", "010"}, "d": {"101", "011", "001"}}

for nombre, f in expresiones.items():
    zonas = {f"{a:d}{b:d}{c:d}" for a, b, c in product([1, 0], repeat=3)
             if any((a, b, c)) and f(a, b, c)}
    cual = [d for d, z in diagramas.items() if z == zonas] or ["ninguno"]
    print(nombre, sorted(zonas, reverse=True), "->", cual[0])
