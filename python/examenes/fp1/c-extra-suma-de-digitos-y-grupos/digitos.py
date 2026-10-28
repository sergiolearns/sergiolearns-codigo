# Simulacro práctico de FP1 · versión C · Suma de dígitos y grupos (solución)
# Del artículo «Simulacro práctico de FP1 — los exámenes de continuidad en Python, con nota al momento (y la regla del 8 incluida)»
# https://sergiolearns.com/simulacro-examen-fp1-practica/
def suma_digitos(n):
    # Caso base: un número de una cifra es su propia suma. Si no, la última cifra + la suma del resto.
    if n < 10:
        return n
    return n % 10 + suma_digitos(n // 10)     # 4721 -> 1 + suma(472) -> 1 + 2 + suma(47)…


def agrupar(numeros):
    grupos = {}
    for n in numeros:
        s = suma_digitos(n)
        if s not in grupos:
            grupos[s] = []
        if n not in grupos[s]:                 # sin repetir
            grupos[s].append(n)
    for s in grupos:
        grupos[s].sort()                        # cada lista, de menor a mayor
    return grupos


if __name__ == "__main__":
    print(suma_digitos(4721), suma_digitos(0), suma_digitos(9))
    print(agrupar([19, 28, 5, 14, 23, 28, 100]))
