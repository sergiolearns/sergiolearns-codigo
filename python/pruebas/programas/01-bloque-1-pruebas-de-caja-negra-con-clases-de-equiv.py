# Pruebas en Python práctica — Bloque 1: Pruebas de caja negra con clases de equivalencia y valores límite
# Del artículo «Pruebas en Python — caja negra, caja blanca y TDD con programas reales»
# https://sergiolearns.com/pruebas-en-python-practica/

def clasificar_nota(nota):
    """
    Clasifica una nota numérica en su calificación.
    
    Parámetros:
        nota (float): valor entre 0 y 10 (ambos incluidos)
    
    Devuelve:
        str: 'Matrícula' si nota >= 9
             'Sobresaliente' si 9 > nota >= 7.5
             'Notable' si 7.5 > nota >= 6
             'Bien' si 6 > nota >= 5
             'Suficiente' si 5 > nota >= 4.5  (aprobado por compensación)
             'Suspenso' si nota < 4.5
    
    Lanza:
        TypeError si nota no es numérica
        ValueError si nota está fuera del rango [0, 10]
    """
