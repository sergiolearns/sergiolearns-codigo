# Solución del ejercicio 3: generador de números perfectos
# Del artículo «Iteradores y generadores en Python — ejercicios con múltiplos, una secuencia que se reinicia y números perfectos (y una multa que salió letra a letra)»
# https://sergiolearns.com/iteradores-y-generadores-en-python-ejercicios/

def divisores_propios(n):
    """Divisores de n menos el propio n, en orden. Recorre solo hasta la raíz cuadrada."""
    if n < 2:
        return []
    pequenos, grandes = [1], []
    i = 2
    while i * i <= n:
        if n % i == 0:
            pequenos.append(i)        # i divide a n...
            if i != n // i:           # ...y su pareja n // i también (sin repetir la raíz)
                grandes.append(n // i)
        i += 1
    return pequenos + grandes[::-1]   # las parejas salen de mayor a menor: les damos la vuelta


def es_perfecto(n):
    return n >= 2 and sum(divisores_propios(n)) == n


def perfectos():
    """Generador infinito de números perfectos."""
    candidato = 2
    while True:
        if es_perfecto(candidato):
            yield candidato
        candidato += 1


def perfectos_hasta(limite):
    """Mira los CANDIDATOS hasta el límite, no los perfectos: así termina aunque no haya más."""
    for candidato in range(2, limite + 1):
        if es_perfecto(candidato):
            yield candidato


for n in (6, 12, 28):
    print(f'¿Es {n} perfecto? {es_perfecto(n)}')

print('\nPerfectos hasta 10000:')
print(' '.join(str(p) for p in perfectos_hasta(10000)))

print()
for p in perfectos_hasta(500):
    divs = divisores_propios(p)
    print(f'Divisores de {p}: {divs} → suma: {sum(divs)}')
