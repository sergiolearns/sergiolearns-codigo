# Programa 3 · Un paquete con subpaquete
# Del artículo «Módulos y paquetes en Python — práctica con un boletín, un módulo que se prueba solo y un paquete (y el assert que tumbaba mi programa al importar)»
# https://sergiolearns.com/modulos-en-python-practica/

CREDITOS_GRADO = 240


def porcentaje_superado(creditos):
    """Porcentaje del grado superado (1 decimal)."""
    return round(creditos / CREDITOS_GRADO * 100, 1)
