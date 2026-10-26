# Solución del ejercicio 3 · Validador de contraseña segura
# Del artículo «Condicionales en Python — ejercicios resueltos con películas, tramos de impuestos, contraseñas y el juego de adivinar el número (y el or que dejaba entrar a todo el mundo)»
# https://sergiolearns.com/condicionales-en-python-ejercicios/

# Ejercicio 3 — Validador de contraseña segura
contrasena = "Python@2024"
especiales = "!@#$%^&*"
puntos = 0

print("--- Análisis de contraseña ---")

# Cinco if INDEPENDIENTES: cada criterio suma por su cuenta (con elif solo contaría uno)
if len(contrasena) >= 8:
    print(f"✓ Longitud suficiente ({len(contrasena)} caracteres)")
    puntos += 1
else:
    print(f"✗ Demasiado corta ({len(contrasena)} caracteres, mínimo 8)")

if any(c.isupper() for c in contrasena):        # ¿alguna letra mayúscula?
    print("✓ Contiene mayúsculas")
    puntos += 1
else:
    print("✗ Sin mayúsculas")

if any(c.islower() for c in contrasena):
    print("✓ Contiene minúsculas")
    puntos += 1
else:
    print("✗ Sin minúsculas")

if any(c.isdigit() for c in contrasena):
    print("✓ Contiene números")
    puntos += 1
else:
    print("✗ Sin números")

if any(c in especiales for c in contrasena):     # ¿algún carácter de la lista?
    print("✓ Contiene caracteres especiales")
    puntos += 1
else:
    print("✗ Sin caracteres especiales")

# Ahora sí, una cadena: la puntuación cae en UNA sola categoría
if puntos <= 2:
    seguridad = "Muy débil 🔓"
elif puntos == 3:
    seguridad = "Débil 🔐"
elif puntos == 4:
    seguridad = "Fuerte 🔒"
else:
    seguridad = "Muy fuerte 🔒"

print(f"Puntuación: {puntos}/5")
print(f"Seguridad: {seguridad}")
