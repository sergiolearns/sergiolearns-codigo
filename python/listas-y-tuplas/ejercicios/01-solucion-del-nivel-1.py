# Solución del Nivel 1
# Del artículo «Listas y tuplas en Python — ejercicios con recortes, un resumen de clase y aprobados contra suspensos (y la tupla de seis elementos que solo tenía uno)»
# https://sergiolearns.com/listas-y-tuplas-en-python-ejercicios/

notas = [6.5, 8.0, 5.5, 9.5, 7.0, 4.5, 10.0]

print("Primera:", notas[0])
print("Última:", notas[-1])
print("Tres primeras:", notas[:3])
print("Dos últimas:", notas[-2:])
print("Sin la primera ni la última:", notas[1:-1])
print("Una de cada dos:", notas[::2])
print("Al revés:", notas[::-1])
