# Solución del Nivel 3
# Del artículo «Módulos y paquetes en Python — ejercicios con temperaturas, divisas y una tienda (y el precio con IVA que salía con descuento)»
# https://sergiolearns.com/modulos-en-python-ejercicios/

from tienda.precios import con_iva
from tienda.descuentos.porcentaje import aplica
from tienda.descuentos.umbral import pct_por_importe


def total(base):
    precio = con_iva(base)
    return aplica(precio, pct_por_importe(precio))
