# Programa 2 · Un módulo que se prueba a sí mismo (lanza app.py o validacion.py)
# Del artículo «Módulos y paquetes en Python — práctica con el boletín de Lucía, un módulo que se prueba solo y un paquete (y el assert que tumbaba mi programa al importar)»
# https://sergiolearns.com/modulos-en-python-practica/

from validacion import es_nota_valida, limita

nota = 12
print("¿Es válida la nota", nota, "?", es_nota_valida(nota))
print("Nota corregida:", limita(nota))
