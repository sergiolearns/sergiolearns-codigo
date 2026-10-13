# Programa 1 · Un módulo propio y el programa que lo importa
# Del artículo «Módulos y paquetes en Python — práctica con un boletín, un módulo que se prueba solo y un paquete (y el assert que tumbaba mi programa al importar)»
# https://sergiolearns.com/modulos-en-python-practica/

import boletin as bol
from boletin import media, califica

print("=== Boletín de Lucía (sobre", bol.NOTA_MAX, ") ===")

fp1 = media(7.0, 8.5, 9.5)
algebra = media(4.0, 5.5, 3.5)
ic1 = media(6.5, 5.0, 7.5)

print("FP1:    ", round(fp1, 2), "->", califica(fp1))
print("Álgebra:", round(algebra, 2), "->", califica(algebra))
print("IC1:    ", round(ic1, 2), "->", califica(ic1))

if bol.APROBADO > algebra:
    print("Aviso: Álgebra está por debajo de", bol.APROBADO)
