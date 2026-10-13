# El patrón que debes llevarte
# Del artículo «Funciones en Python — 3 programas que demuestran su poder real»
# https://sergiolearns.com/funciones-en-python-practica/

# PATRÓN: separar cálculo de presentación

# 1. Funciones que calculan — devuelven valores, no imprimen
def calcular_algo(datos):
    # lógica aquí
    return resultado

# 2. Funciones que validan — comprueban entrada, devuelven valor limpio
def pedir_dato_valido(mensaje):
    dato = input(mensaje)
    while not es_valido(dato):
        dato = input(mensaje)
    return dato

# 3. Funciones que muestran — reciben datos, imprimen, no calculan
def mostrar_resultado(datos, resultado):
    print(f"...")

# 4. Función principal — coordina todo
def main():
    datos = pedir_dato_valido("...")
    resultado = calcular_algo(datos)
    mostrar_resultado(datos, resultado)

main()
