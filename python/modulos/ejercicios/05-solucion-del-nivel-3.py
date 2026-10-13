# Solución del Nivel 3
# Del artículo «Módulos y paquetes en Python — ejercicios con temperaturas, divisas y una tienda (y el precio con IVA que salía con descuento)»
# https://sergiolearns.com/modulos-en-python-ejercicios/

IVA = 0.21


def con_iva(base):
    """Precio con IVA, redondeado a céntimos."""
    return round(base * (1 + IVA), 2)
