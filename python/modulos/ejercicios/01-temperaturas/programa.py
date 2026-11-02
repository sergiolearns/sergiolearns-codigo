# Solución del Nivel 1 · Un módulo de temperaturas (lanza programa.py)
# Del artículo «Módulos y paquetes en Python — ejercicios con temperaturas, divisas y una tienda (y el precio con IGIC que salía con descuento)»
# https://sergiolearns.com/modulos-en-python-ejercicios/

import temperatura as temp      # el módulo con alias
from temperatura import c_a_k   # una función, sin prefijo

print("20 °C en °F:", temp.c_a_f(20))
print("20 °C en K:", c_a_k(20))
print("Cero absoluto:", temp.CERO_ABSOLUTO_C, "°C")
