# Programa 1 · Un módulo propio y el programa que lo importa
# Del artículo «Módulos y paquetes en Python — práctica con un boletín, un módulo que se prueba solo y un paquete (y el assert que tumbaba mi programa al importar)»
# https://sergiolearns.com/modulos-en-python-practica/

"""Utilidades para el boletín de notas."""

NOTA_MAX = 10
APROBADO = 5.0
NOTABLE = 7.0
SOBRESALIENTE = 9.0


def media(a, b, c):
    """Media aritmética de tres notas."""
    return (a + b + c) / 3


def califica(nota):
    """Convierte una nota numérica en su calificación escrita."""
    if nota >= SOBRESALIENTE:
        return "Sobresaliente"
    if nota >= NOTABLE:
        return "Notable"
    if nota >= APROBADO:
        return "Aprobado"
    return "Suspenso"
