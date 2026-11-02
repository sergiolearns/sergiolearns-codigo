# Solución del Nivel 3 · Una tienda con paquete y subpaquete (lanza programa.py desde esta carpeta)
# Del artículo «Módulos y paquetes en Python — ejercicios con temperaturas, divisas y una tienda (y el precio con IGIC que salía con descuento)»
# https://sergiolearns.com/modulos-en-python-ejercicios/

from tienda.precios import con_igic
from tienda.descuentos.porcentaje import aplica
from tienda.descuentos.umbral import pct_por_importe


def total(base):
    """Precio final: primero el IGIC, después el descuento que toque."""
    precio = con_igic(base)
    return aplica(precio, pct_por_importe(precio))
