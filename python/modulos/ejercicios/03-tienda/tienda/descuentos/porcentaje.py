# Solución del Nivel 3 · Una tienda con paquete y subpaquete (lanza programa.py desde esta carpeta)
# Del artículo «Módulos y paquetes en Python — ejercicios con temperaturas, divisas y una tienda (y el precio con IGIC que salía con descuento)»
# https://sergiolearns.com/modulos-en-python-ejercicios/

def aplica(precio, pct):
    """Rebaja el precio un pct por ciento."""
    return round(precio * (1 - pct / 100), 2)
