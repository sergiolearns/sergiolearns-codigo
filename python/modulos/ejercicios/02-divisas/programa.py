# Solución del Nivel 2 · Dos módulos con el mismo nombre de función (lanza programa.py)
# Del artículo «Módulos y paquetes en Python — ejercicios con temperaturas, divisas y una tienda (y el precio con IGIC que salía con descuento)»
# https://sergiolearns.com/modulos-en-python-ejercicios/

from euros import formatea as en_euros
from dolares import formatea as en_dolares
import euros

precio = 19.5
print("Precio:", en_euros(precio), "/", en_dolares(precio))
print("Sin alias:", euros.formatea(precio))
