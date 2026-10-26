# Solución del ejercicio 5 · Gestor de caja registradora
# Del artículo «Operadores en Python — ejercicios con la cuota del gimnasio, segundos a horas y el cambio de la caja moneda a moneda (y un or que siempre decía que sí)»
# https://sergiolearns.com/operadores-en-python-ejercicios/

# Nivel 3 · Caja registradora: el cambio, billete a billete y moneda a moneda
importe = 37.43
entregado = 50.00

cambio = entregado - importe
print("Cambio con floats:", cambio)          # el float no es exacto
resto = round(cambio * 100)                   # pasamos a céntimos ENTEROS
total_cent = resto                            # lo guardamos para comprobar al final

# divmod(resto, valor) devuelve (cuántas piezas caben, lo que sobra)
b50, resto = divmod(resto, 5000)
b20, resto = divmod(resto, 2000)
b10, resto = divmod(resto, 1000)
b5, resto = divmod(resto, 500)
m200, resto = divmod(resto, 200)
m100, resto = divmod(resto, 100)
m50, resto = divmod(resto, 50)
m20, resto = divmod(resto, 20)
m10, resto = divmod(resto, 10)
m5, resto = divmod(resto, 5)
m2, resto = divmod(resto, 2)
m1 = resto                                    # lo último que queda son céntimos sueltos

print(f"--- Caja: {total_cent // 100},{total_cent % 100:02d} € de cambio ---")
print("Billetes: 50 €:", b50, "| 20 €:", b20, "| 10 €:", b10, "| 5 €:", b5)
print("Monedas: 2 €:", m200, "| 1 €:", m100, "| 50 cént.:", m50, "| 20 cént.:", m20)
print("Monedas: 10 cént.:", m10, "| 5 cént.:", m5, "| 2 cént.:", m2, "| 1 cént.:", m1)

piezas = b50 + b20 + b10 + b5 + m200 + m100 + m50 + m20 + m10 + m5 + m2 + m1
suma = (b50 * 5000 + b20 * 2000 + b10 * 1000 + b5 * 500 + m200 * 200 + m100 * 100
        + m50 * 50 + m20 * 20 + m10 * 10 + m5 * 5 + m2 * 2 + m1)
print("Piezas en total:", piezas)
print("¿Cuadra el desglose?", suma == total_cent)
