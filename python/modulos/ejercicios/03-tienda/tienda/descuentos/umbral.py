# Solución del Nivel 3 · Una tienda con paquete y subpaquete (lanza programa.py desde esta carpeta)
# Del artículo «Módulos y paquetes en Python — ejercicios con temperaturas, divisas y una tienda (y el precio con IGIC que salía con descuento)»
# https://sergiolearns.com/modulos-en-python-ejercicios/

def pct_por_importe(importe):
    """10 % de descuento a partir de 100 €."""
    return 10 if importe >= 100 else 0
