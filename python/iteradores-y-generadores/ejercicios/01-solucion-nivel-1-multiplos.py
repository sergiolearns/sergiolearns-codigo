# Solución del ejercicio 1: generador de múltiplos
# Del artículo «Iteradores y generadores en Python — ejercicios con múltiplos, una secuencia que se reinicia y números perfectos (y una multa que salió letra a letra)»
# https://sergiolearns.com/iteradores-y-generadores-en-python-ejercicios/

def multiplos_infinitos(base):
    """Generador infinito: base, 2*base, 3*base..."""
    multiplo = base
    while True:
        yield multiplo
        multiplo += base          # sumar es más barato que multiplicar cada vez


def multiplos_hasta(base, limite):
    """Generador finito: se para solo cuando se pasa del límite."""
    multiplo = base
    while multiplo <= limite:     # <= porque el límite también cuenta (30 entra)
        yield multiplo
        multiplo += base


def primeros_n_multiplos(base, n):
    contador = 0
    for m in multiplos_infinitos(base):
        if contador == n:
            return                # cortamos el infinito con return
        yield m
        contador += 1


def mostrar(titulo, gen):
    print(titulo)
    print(' '.join(str(m) for m in gen))   # consume el generador entero una vez


mostrar('Múltiplos de 3 hasta 30:', multiplos_hasta(3, 30))
mostrar('\nPrimeros 8 múltiplos de 7:', primeros_n_multiplos(7, 8))
mostrar('\nMúltiplos de 5 entre 20 y 50:', (m for m in multiplos_hasta(5, 50) if m >= 20))
mostrar('\nMúltiplos comunes de 3 y 5 hasta 100:', (m for m in multiplos_hasta(3, 100) if m % 5 == 0))
