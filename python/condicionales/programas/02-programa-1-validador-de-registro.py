# Condicionales en Python práctica — Programa 1: Validador de registro
# Del artículo «Condicionales en Python — práctica real con 3 programas en VS Code»
# https://sergiolearns.com/condicionales-en-python-practica/

# Validador de registro — versión mejorada
print("=== REGISTRO DE USUARIO ===\n")

usuario = input("Nombre de usuario: ")
edad = int(input("Edad: "))
contrasena = input("Contraseña: ")
email = input("Email: ")

errores = 0

print("\n--- Resultado de la validación ---")

if len(usuario) < 3:
    print("✗ Usuario demasiado corto (mínimo 3 caracteres)")
    errores += 1
else:
    print("✓ Usuario válido")

if edad < 18:
    print("✗ Debes ser mayor de 18 años")
    errores += 1
else:
    print("✓ Edad válida")

if len(contrasena) < 6:
    print("✗ Contraseña demasiado corta (mínimo 6 caracteres)")
    errores += 1
elif not any(c.isdigit() for c in contrasena):
    print("✗ La contraseña debe contener al menos un número")
    errores += 1
else:
    print("✓ Contraseña válida")

if "@" not in email or "." not in email:
    print("✗ Email no válido")
    errores += 1
else:
    print("✓ Email válido")

print(f"\n{'Registro completado' if errores == 0 else f'Registro fallido — {errores} error/es encontrado/s'}")
