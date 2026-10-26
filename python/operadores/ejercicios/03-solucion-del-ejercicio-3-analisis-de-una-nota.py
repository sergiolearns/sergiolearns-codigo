# Solución del ejercicio 3 · Análisis de una nota
# Del artículo «Operadores en Python — ejercicios con la cuota del gimnasio, segundos a horas y el cambio de la caja moneda a moneda (y un or que siempre decía que sí)»
# https://sergiolearns.com/operadores-en-python-ejercicios/

# Nivel 2 · Análisis de una nota sobre 100, sin if: solo operadores
nota = 73

sobre_10 = nota / 10
en_rango = 0 <= nota <= 100          # comparación encadenada
aprobado = nota >= 50
notable = nota >= 70
sobresaliente = nota >= 90

# and/or devuelven un operando: el primer tramo que se cumpla «gana»
siguiente = (nota < 50 and "Aprobado") or (nota < 70 and "Notable") \
    or (nota < 90 and "Sobresaliente") or "ninguno, ya es la máxima"
faltan = (nota < 50 and 50 - nota) or (nota < 70 and 70 - nota) \
    or (nota < 90 and 90 - nota) or 0
sobre_aprobado = max(0, nota - 50)

print("--- Análisis de la nota", nota, "---")
print("¿Nota válida?", en_rango)
print("Sobre 10:", sobre_10)
print("¿Aprobado?", aprobado, "| ¿Notable?", notable, "| ¿Sobresaliente?", sobresaliente)
print("Siguiente nivel:", siguiente, "(faltan", faltan, "puntos)")
print("Puntos sobre el aprobado:", sobre_aprobado)
