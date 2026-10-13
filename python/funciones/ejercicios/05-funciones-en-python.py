# Chuletario — Funciones en Python
# Del artículo «Funciones en Python — ejercicios para afianzar lo que sabes»
# https://sergiolearns.com/funciones-en-python-ejercicios/

# ============================================
# CHULETARIO — Funciones en Python
# Sergio Learns · sergiolearns.com
# ============================================

# DEFINIR UNA FUNCIÓN
def nombre_funcion(parametro1, parametro2):
    # cuerpo
    return resultado

# LLAMAR A UNA FUNCIÓN
resultado = nombre_funcion(argumento1, argumento2)

# PARÁMETRO vs ARGUMENTO
def saludar(nombre):     # nombre = PARÁMETRO (en la definición)
    return f"Hola, {nombre}"

saludar("Sergio")        # "Sergio" = ARGUMENTO (en la llamada)

# PARÁMETROS CON VALOR POR DEFECTO
def saludar(nombre, saludo="Hola"):
    return f"{saludo}, {nombre}"

saludar("Sergio")              # → "Hola, Sergio"
saludar("Sergio", "Buenos días")  # → "Buenos días, Sergio"

# RETURN — devuelve valor Y termina la función
def sumar(a, b):
    return a + b      # termina aquí
    print("nunca")    # código muerto — nunca se ejecuta

# SIN RETURN → devuelve None
def imprimir(x):
    print(x)          # imprime pero NO devuelve

resultado = imprimir(5)
print(resultado)      # → None ← error silencioso típico

# REGLA: si necesitas usar el resultado → usa return
#        si solo necesitas que haga algo → no hace falta

# DEVOLVER MÚLTIPLES VALORES (tupla)
def min_max(lista):
    return min(lista), max(lista)

minimo, maximo = min_max([3, 1, 4, 1, 5])

# FUNCIONES QUE LLAMAN A OTRAS
def es_aprobado(nota):
    return nota >= 5

def clasificar(nota):
    if nota >= 9: return "Sobresaliente"
    elif nota >= 7: return "Notable"
    elif es_aprobado(nota): return "Aprobado"  # llama a otra función
    else: return "Suspenso"

# ALCANCE — local vs global
x = 10              # global

def mi_funcion():
    y = 20          # local — solo existe aquí
    print(x)        # puede leer globales
    print(y)

mi_funcion()
print(x)    # → 10 ✓
print(y)    # → NameError ✗ — y no existe fuera

# CONSTANTES GLOBALES — en mayúsculas
IVA = 0.21
MAX_INTENTOS = 3

# PATRÓN: separar cálculo de presentación
def calcular(datos):      # solo calcula, usa return
    return resultado

def mostrar(resultado):   # solo muestra, usa print
    print(resultado)

def main():               # coordina todo
    datos = input("...")
    resultado = calcular(datos)
    mostrar(resultado)

# ERRORES TÍPICOS
# 1. Olvidar return → función devuelve None
# 2. print en vez de return → valor no se puede usar
# 3. Llamar función antes de definirla → NameError
# 4. Variable local usada fuera → NameError
# 5. Modificar global desde función → bug difícil de encontrar

# DRY: Don't Repeat Yourself
# Si copias y pegas código → conviértelo en función
