# Programa 3 · Un paquete con subpaquete (lanza main.py desde esta carpeta)
# Del artículo «Módulos y paquetes en Python — práctica con el boletín de Lucía, un módulo que se prueba solo y un paquete (y el assert que tumbaba mi programa al importar)»
# https://sergiolearns.com/modulos-en-python-practica/

from expediente.notas.calculos import media_ponderada   # ruta completa, desde arriba


def resumen(nota1, cred1, nota2, cred2):
    """Frase con la media ponderada y dos decimales."""
    media = media_ponderada(nota1, cred1, nota2, cred2)
    return f"Media ponderada: {media:.2f}"
