# Programa 3 · Un paquete con subpaquete (lanza main.py desde esta carpeta)
# Del artículo «Módulos y paquetes en Python — práctica con el boletín de Lucía, un módulo que se prueba solo y un paquete (y el assert que tumbaba mi programa al importar)»
# https://sergiolearns.com/modulos-en-python-practica/

import expediente.creditos                              # ruta completa al usarlo
from expediente.notas.calculos import media_ponderada   # una función suelta
from expediente.notas import texto                      # el módulo, sin la ruta

print("Grado superado:", expediente.creditos.porcentaje_superado(60), "%")
print("Media ponderada:", media_ponderada(9.0, 6, 6.0, 4.5))
print(texto.resumen(9.0, 6, 6.0, 4.5))
