# Programa 2 · ¿De cuántas formas se puede ordenar la cola? (factorial)
# Del artículo «Bucles en Python — práctica con el PIN de la caja, las formas de ordenar la cola y el horno de croissants (y el intento que se contaba demasiado tarde)»
# https://sergiolearns.com/bucles-en-python-practica/

# Programa 2 · ¿De cuántas formas puede ordenarse la cola? n! (factorial)
personas = 5

# Con for: sabemos que hay que multiplicar de 1 a n
formas_for = 1                    # 1 y no 0: es un acumulador de PRODUCTOS
for i in range(1, personas + 1):  # + 1 porque el fin de range no entra
    formas_for *= i

# Con while: lo mismo, pero el contador lo llevamos nosotros
formas_while = 1
i = 1
while i <= personas:
    formas_while *= i
    i += 1                        # sin esta línea, bucle infinito

print(f"{personas}! con for:   {formas_for}")
print(f"{personas}! con while: {formas_while}")
print("¿Coinciden?", formas_for == formas_while)

# El proceso a la vista: se construye un texto vuelta a vuelta
producto = 1
pasos = ""                        # acumulador de TEXTO: empieza vacío
for i in range(1, personas + 1):
    producto *= i
    pasos += str(i)
    if i < personas:              # sin " x " detrás del último número
        pasos += " x "
print(f"Proceso: {pasos} = {producto}")

# ¿Y si la cola es más larga? Crece MUY rápido
producto = 1
for n in range(1, 11):
    producto *= n                 # aprovecha el resultado anterior: n! = (n-1)! x n
    print(f"{n:2}! = {producto}")
