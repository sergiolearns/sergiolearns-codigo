# Solución del ejercicio 2 · Conversor de tiempo
# Del artículo «Operadores en Python — ejercicios con la cuota del gimnasio, segundos a horas y el cambio de la caja moneda a moneda (y un or que siempre decía que sí)»
# https://sergiolearns.com/operadores-en-python-ejercicios/

# Nivel 1 · Conversor de tiempo: segundos → horas, minutos y segundos
segundos = 3723

horas = segundos // 3600              # horas completas
minutos = segundos % 3600 // 60       # (lo que sobra de las horas) // 60
segs = segundos % 60                  # lo que no llega a un minuto

print(segundos, "segundos son:")
print("→", horas, "h,", minutos, "min y", segs, "s")
print(f"→ en formato reloj: {horas:02d}:{minutos:02d}:{segs:02d}")

# Comprobación a la inversa y la versión con divmod
print("Comprobación:", horas * 3600 + minutos * 60 + segs)
h, resto = divmod(segundos, 3600)
m, s = divmod(resto, 60)
print("Con divmod:", h, m, s)
