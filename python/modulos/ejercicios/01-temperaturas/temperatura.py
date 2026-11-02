# Solución del Nivel 1 · Un módulo de temperaturas (lanza programa.py)
# Del artículo «Módulos y paquetes en Python — ejercicios con temperaturas, divisas y una tienda (y el precio con IGIC que salía con descuento)»
# https://sergiolearns.com/modulos-en-python-ejercicios/

"""Conversión de temperaturas."""

CERO_ABSOLUTO_C = -273.15


def c_a_f(c):
    """Celsius a Fahrenheit."""
    return c * 9 / 5 + 32


def c_a_k(c):
    """Celsius a Kelvin."""
    return c - CERO_ABSOLUTO_C
