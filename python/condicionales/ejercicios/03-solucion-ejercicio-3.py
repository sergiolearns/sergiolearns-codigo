# Solución Ejercicio 3:
# Del artículo «Condicionales en Python — ejercicios con solución y chuletario completo»
# https://sergiolearns.com/condicionales-en-python-ejercicios/

# Validador de contraseña segura
contrasena = input("Contraseña: ")
especiales = "!@#$%^&*"
puntos = 0

print(f"\n--- Análisis de contraseña ---")

if len(contrasena) >= 8:
    print(f"✓ Longitud suficiente ({len(contrasena)} caracteres)")
    puntos += 1
else:
    print(f"✗ Demasiado corta ({len(contrasena)} caracteres, mínimo 8)")

if any(c.isupper() for c in contrasena):
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

if any(c in especiales for c in contrasena):
    print("✓ Contiene caracteres especiales")
    puntos += 1
else:
    print("✗ Sin caracteres especiales")

if puntos <= 2:
    seguridad = "Muy débil 🔓"
elif puntos == 3:
    seguridad = "Débil 🔐"
elif puntos == 4:
    seguridad = "Fuerte 🔒"
else:
    seguridad = "Muy fuerte 🔒"

print(f"\nPuntuación: {puntos}/5")
print(f"Seguridad: {seguridad}")
