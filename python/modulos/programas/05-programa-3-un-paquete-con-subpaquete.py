# Programa 3 · Un paquete con subpaquete
# Del artículo «Módulos y paquetes en Python — práctica con un boletín, un módulo que se prueba solo y un paquete (y el assert que tumbaba mi programa al importar)»
# https://sergiolearns.com/modulos-en-python-practica/

from expediente.notas.calculos import media_ponderada


def resumen(nota1, cred1, nota2, cred2):
    media = media_ponderada(nota1, cred1, nota2, cred2)
    return f"Media ponderada: {media:.2f}"
