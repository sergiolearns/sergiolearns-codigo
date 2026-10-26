# Programa 3 · La cuenta atrás del horno de croissants
# Del artículo «Bucles en Python — práctica con el PIN de la caja, las formas de ordenar la cola y el horno de croissants (y el intento que se contaba demasiado tarde)»
# https://sergiolearns.com/bucles-en-python-practica/

# Programa 3 · Cuenta atrás del horno de croissants
import time

segundos = 5

print("=== Horno en marcha ===")
for s in range(segundos, 0, -1):  # 5, 4, 3, 2, 1: el 0 no entra
    print(f"{s}...")
    if s == 3:
        print("   (dale la vuelta a la bandeja)")
    time.sleep(1)                 # espera 1 segundo de verdad
print("¡Croissants listos!")

print("--- La misma cuenta atrás con while ---")
s = segundos
while s > 0:
    print(f"{s}...", end=" ")     # end=" " deja los números en la misma línea
    s -= 1                        # sin esta línea, el horno no acaba nunca
print("¡Listos!")
