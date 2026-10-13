# El truco del operador % que más usarás
# Del artículo «Operadores en Python — práctica real con 3 programas en VS Code»
# https://sergiolearns.com/operadores-en-python-practica/

# ¿Es par o impar?
numero = 7
print(numero % 2 == 0)    # → False (impar)
print(numero % 2 == 1)    # → True  (impar confirmado)

# ¿Es divisible por N?
print(15 % 3 == 0)        # → True  (15 es divisible por 3)
print(16 % 3 == 0)        # → False (16 no es divisible por 3)

# Extraer los dígitos de un número
numero = 1234
unidades  = numero % 10          # → 4
decenas   = (numero // 10) % 10  # → 3
centenas  = (numero // 100) % 10 # → 2
millares  = (numero // 1000)     # → 1
