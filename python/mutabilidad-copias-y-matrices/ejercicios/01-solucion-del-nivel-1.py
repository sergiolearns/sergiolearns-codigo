# Solución del Nivel 1 · Modificar una lista de la compra
# Del artículo «Mutabilidad, copias y matrices en Python — ejercicios con una lista de la compra, un ticket y el stock de tres almacenes (y el producto que zip se comió)»
# https://sergiolearns.com/mutabilidad-copias-y-matrices-en-python-ejercicios/

compra = ["leche", "pan", "huevos"]
compra.append("arroz")              # ["leche", "pan", "huevos", "arroz"]
compra.insert(1, "fruta")           # ["leche", "fruta", "pan", "huevos", "arroz"]
compra.remove("pan")                # ["leche", "fruta", "huevos", "arroz"]
compra.sort()                       # orden alfabético, en el sitio
print(compra)

ultimo = compra.pop()               # quita Y devuelve el último
print(ultimo, compra)
print(len(compra))
