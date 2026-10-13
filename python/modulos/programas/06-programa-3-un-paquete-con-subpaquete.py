# Programa 3 · Un paquete con subpaquete
# Del artículo «Módulos y paquetes en Python — práctica con un boletín, un módulo que se prueba solo y un paquete (y el assert que tumbaba mi programa al importar)»
# https://sergiolearns.com/modulos-en-python-practica/

import expediente.creditos
from expediente.notas.calculos import media_ponderada
from expediente.notas import texto

print("Grado superado:", expediente.creditos.porcentaje_superado(60), "%")
print("Media ponderada:", media_ponderada(9.0, 6, 6.0, 6))
print(texto.resumen(9.0, 6, 6.0, 6))
