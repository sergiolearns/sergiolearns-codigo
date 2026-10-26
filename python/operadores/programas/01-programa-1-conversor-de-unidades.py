# Programa 1 · Conversor de unidades
# Del artículo «Operadores en Python — práctica con un conversor de unidades, el bono de cafés con IGIC en céntimos y una calculadora con negativos (y el céntimo que se me perdía)»
# https://sergiolearns.com/operadores-en-python-practica/

# Conversor de unidades: un mismo valor en distancia, peso y temperatura
valor = 100.0            # antes venía de input(); cámbialo para probar otros valores

# Factores de conversión: constantes, por eso van en MAYÚSCULAS
KM_A_MILLAS = 0.621371
MILLAS_A_KM = 1.60934
KG_A_LIBRAS = 2.20462
LIBRAS_A_KG = 0.453592

print("=== CONVERSOR DE UNIDADES ===")

print("--- Distancia ---")
print(valor, "km →", round(valor * KM_A_MILLAS, 4), "millas")
print(valor, "millas →", round(valor * MILLAS_A_KM, 4), "km")

print("--- Peso ---")
print(valor, "kg →", round(valor * KG_A_LIBRAS, 4), "libras")
print(valor, "libras →", round(valor * LIBRAS_A_KG, 4), "kg")

print("--- Temperatura ---")
c_a_f = valor * 9 / 5 + 32       # * y / antes que +: no hacen falta paréntesis
f_a_c = (valor - 32) * 5 / 9     # aquí SÍ: la resta tiene que ir primero
print(valor, "°C →", round(c_a_f, 2), "°F")
print(valor, "°F →", round(f_a_c, 2), "°C")

# Los dos errores típicos, calculados de verdad
sin_parentesis = valor - 32 * 5 / 9      # resta 17.78 en vez de restar 32 primero
con_doble_barra = valor * (9 // 5) + 32  # 9 // 5 vale 1: se pierde el 0.8
print("Sin paréntesis saldría:", round(sin_parentesis, 2), "°C")
print("Con // saldría:", con_doble_barra, "°F")
