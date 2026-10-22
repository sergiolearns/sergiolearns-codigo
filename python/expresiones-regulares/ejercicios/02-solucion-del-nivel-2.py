# Solución del Nivel 2 · Los DNI escondidos en un informe de incidencias
# Del artículo «Expresiones regulares en Python — ejercicios con validadores, DNIs escondidos en un informe y dos logs que unificar (y la alerta que decía "Todo bien")»
# https://sergiolearns.com/expresiones-regulares-en-python-ejercicios/

import re

LETRAS = "TRWAGMYFPDXBNJZSQVHLCKE"     # la letra del DNI es LETRAS[número % 23] (tema 7)

INCIDENCIAS = """\
09:15 el usuario 12345678Z no recuerda su contraseña
09:31 bloqueado 87654321-x tras tres intentos
10:02 el 45123456 D pide que se reabra la entrega
10:40 teléfono de contacto: 928451000 (no es un DNI)
11:05 alta de 11111111A y de 2222222-J
"""
# 8 cifras (grupo 1), un guion o espacio opcional, y la letra (grupo 2), con fronteras a los lados
DNI = r"\b(\d{8})[- ]?([A-Za-z])\b"

total = correctos = 0
print(f"{'Encontrado':<14}{'Normalizado':<13}Letra")
for m in re.finditer(DNI, INCIDENCIAS):
    numero, letra = m.group(1), m.group(2).upper()
    esperada = LETRAS[int(numero) % 23]
    total += 1
    if letra == esperada:
        correctos += 1
        estado = "correcta"
    else:
        estado = f"debería ser {esperada}"
    print(f"{m.group()!r:<14}{numero + letra:<13}{estado}")
print(f"DNIs: {total}, con la letra correcta: {correctos}")
