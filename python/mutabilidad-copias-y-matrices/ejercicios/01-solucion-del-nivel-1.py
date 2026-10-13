# Solución del Nivel 1
# Del artículo «Mutabilidad, copias y matrices en Python — ejercicios con una lista de la compra, un ticket y un stock de almacenes (y el producto que zip se comió)»
# https://sergiolearns.com/mutabilidad-copias-y-matrices-en-python-ejercicios/

compra = ["leche", "pan", "huevos"]

compra.append("arroz")
compra.insert(1, "fruta")
compra.remove("pan")
compra.sort()
print(compra)

ultimo = compra.pop()
print(ultimo, compra)
print(len(compra))
