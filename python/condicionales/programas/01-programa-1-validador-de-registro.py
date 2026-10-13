# Condicionales en Python práctica — Programa 1: Validador de registro
# Del artículo «Condicionales en Python — práctica real con 3 programas en VS Code»
# https://sergiolearns.com/condicionales-en-python-practica/

# Validador de registro — versión simple
print("=== REGISTRO DE USUARIO ===\n")

usuario = input("Nombre de usuario: ")
edad = int(input("Edad: "))
contrasena = input("Contraseña: ")

if len(usuario) < 3:
    print("Error: el usuario debe tener al menos 3 caracteres")
elif edad < 18:
    print("Error: debes ser mayor de 18 años")
elif len(contrasena) < 6:
    print("Error: la contraseña debe tener al menos 6 caracteres")
else:
    print("Registro completado con éxito")
