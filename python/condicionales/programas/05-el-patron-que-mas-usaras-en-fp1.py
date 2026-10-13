# El patrón que más usarás en FP1
# Del artículo «Condicionales en Python — práctica real con 3 programas en VS Code»
# https://sergiolearns.com/condicionales-en-python-practica/

# Patrón: clasificar con if/elif/else y guardar en variable
valor = float(input("Introduce un valor: "))

if valor >= umbral_alto:
    categoria = "Alta"
elif valor >= umbral_medio:
    categoria = "Media"
else:
    categoria = "Baja"

# Usar la variable después
print(f"Categoría: {categoria}")
