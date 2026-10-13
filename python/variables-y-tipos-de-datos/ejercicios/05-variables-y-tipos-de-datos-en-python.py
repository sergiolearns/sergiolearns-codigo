# Chuletario — Variables y tipos de datos en Python
# Del artículo «Variables y tipos de datos en Python — ejercicios con solución y chuletario»
# https://sergiolearns.com/variables-y-tipos-de-datos-en-python-ejercicios/

# ============================================
# CHULETARIO — Variables y tipos de datos
# Sergio Learns · sergiolearns.com
# ============================================

# TIPOS BÁSICOS
x = 5          # int   — número entero
x = 5.0        # float — número decimal
x = "hola"     # str   — texto (comillas simples o dobles)
x = True       # bool  — verdadero o falso

# COMPROBAR EL TIPO
type(x)        # devuelve el tipo de x

# CONVERSIÓN DE TIPOS
int("5")       # → 5
float("5.0")   # → 5.0
str(5)         # → "5"
bool(0)        # → False (0 es False, cualquier otro número es True)

# INPUT — SIEMPRE DEVUELVE TEXTO
nombre = input("Nombre: ")              # str
edad   = int(input("Edad: "))           # int
precio = float(input("Precio: "))      # float

# OPERADORES NUMÉRICOS
5 + 3    # suma        → 8
5 - 3    # resta       → 2
5 * 3    # producto    → 15
5 / 3    # división    → 1.666...
5 // 3   # división entera → 1
5 % 3    # módulo (resto)  → 2
5 ** 3   # potencia    → 125

# REDONDEO
round(7.1666, 2)   # → 7.17

# F-STRINGS
nombre = "Sergio"
edad = 20
print(f"Hola, {nombre}. Tienes {edad} años.")

# OPERACIONES CON STRINGS
"hola" + " mundo"   # concatenar → "hola mundo"
"ja" * 3            # repetir    → "jajaja"
"=" * 20            # separador  → "===================="

# TRAMPAS COMUNES
"5" + "5"    # → "55"  NO es 10
5 / 2        # → 2.5   NO es 2 (usar // para división entera)
