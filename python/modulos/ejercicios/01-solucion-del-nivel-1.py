# Solución del Nivel 1
# Del artículo «Módulos y paquetes en Python — ejercicios con temperaturas, divisas y una tienda (y el precio con IVA que salía con descuento)»
# https://sergiolearns.com/modulos-en-python-ejercicios/

CERO_ABSOLUTO_C = -273.15


def c_a_f(c):
    """Grados Celsius a Fahrenheit."""
    return c * 9 / 5 + 32


def c_a_k(c):
    """Grados Celsius a Kelvin."""
    return c - CERO_ABSOLUTO_C
