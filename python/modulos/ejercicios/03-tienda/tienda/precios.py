# Solución del Nivel 3 · Una tienda con paquete y subpaquete (lanza programa.py desde esta carpeta)
# Del artículo «Módulos y paquetes en Python — ejercicios con temperaturas, divisas y una tienda (y el precio con IGIC que salía con descuento)»
# https://sergiolearns.com/modulos-en-python-ejercicios/

IGIC = 0.07   # el impuesto de Canarias, en lugar del IVA


def con_igic(base):
    """Precio con IGIC, redondeado a céntimos."""
    return round(base * (1 + IGIC), 2)
