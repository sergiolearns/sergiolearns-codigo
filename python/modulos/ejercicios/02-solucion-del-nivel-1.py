# Solución del Nivel 1
# Del artículo «Módulos y paquetes en Python — ejercicios con temperaturas, divisas y una tienda (y el precio con IVA que salía con descuento)»
# https://sergiolearns.com/modulos-en-python-ejercicios/

import temperatura as temp
from temperatura import c_a_k

print("20 °C en °F:", temp.c_a_f(20))
print("20 °C en K:", c_a_k(20))
print("Cero absoluto:", temp.CERO_ABSOLUTO_C, "°C")
