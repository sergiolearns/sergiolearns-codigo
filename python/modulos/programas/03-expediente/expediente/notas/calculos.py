# Programa 3 · Un paquete con subpaquete (lanza main.py desde esta carpeta)
# Del artículo «Módulos y paquetes en Python — práctica con el boletín de Lucía, un módulo que se prueba solo y un paquete (y el assert que tumbaba mi programa al importar)»
# https://sergiolearns.com/modulos-en-python-practica/

def media_ponderada(nota1, cred1, nota2, cred2):
    """Media de dos asignaturas ponderada por sus créditos."""
    return (nota1 * cred1 + nota2 * cred2) / (cred1 + cred2)
