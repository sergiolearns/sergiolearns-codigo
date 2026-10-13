# Programa 2 · Un módulo que se prueba a sí mismo
# Del artículo «Módulos y paquetes en Python — práctica con un boletín, un módulo que se prueba solo y un paquete (y el assert que tumbaba mi programa al importar)»
# https://sergiolearns.com/modulos-en-python-practica/

"""Validación de notas."""

NOTA_MIN = 0
NOTA_MAX = 10

print("validacion.py: __name__ =", __name__)


def es_nota_valida(nota):
    return NOTA_MIN <= nota <= NOTA_MAX


def limita(nota):
    """Recorta la nota al rango válido."""
    return max(NOTA_MIN, min(nota, NOTA_MAX))


if __name__ == "__main__":
    # Pruebas: solo se ejecutan si lanzas este archivo directamente
    print("Pruebas de validacion.py")
    assert es_nota_valida(7.5)
    assert not es_nota_valida(11)
    assert limita(12) == 10
    assert limita(-3) == 0
    assert limita(6.5) == 6.5
    print("Todo correcto")
