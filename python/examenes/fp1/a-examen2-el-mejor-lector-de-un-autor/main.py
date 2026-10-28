# Simulacro práctico de FP1 · versión A · El mejor lector de un autor (solución)
# Del artículo «Simulacro práctico de FP1 — los exámenes de continuidad en Python, con nota al momento (y la regla del 8 incluida)»
# https://sergiolearns.com/simulacro-examen-fp1-practica/
from ejemplo import ejemplo



def lector_del_autor(datos, autor):
    libros, socios = datos                 # desempaquetar la tupla de dos diccionarios
    # 1) Los códigos de los libros del autor, en un conjunto (para poder cruzarlos con &)
    del_autor = {cod for cod, (titulo, au, anio, generos) in libros.items() if au == autor}
    if not del_autor:
        return "NO AUT"
    # 2) Para cada socio, cuántos de esos libros ha leído: intersección de conjuntos
    mejor = None
    for carne, (nombre, leidos) in socios.items():
        n = len(leidos & del_autor)
        if n > 0 and (mejor is None or n > mejor[1] or (n == mejor[1] and nombre < mejor[0])):
            mejor = (nombre, n)                # empate: gana el nombre que va antes
    if mejor is None:
        return "NO LEC"
    return mejor


if __name__ == "__main__":
    print(lector_del_autor(ejemplo, "Carlos Ruiz Zafón"))
    print(lector_del_autor(ejemplo, "Elvira Lindo"))
    print(lector_del_autor(ejemplo, "Juan Ramón Jiménez"))
    print(lector_del_autor(ejemplo, "Gloria Fuertes"))
