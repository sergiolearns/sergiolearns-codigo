# Programa 1 · Validador de registro (versión 2: un if por campo)
# Del artículo «Condicionales en Python — práctica con un validador de registro, descuentos por nivel y un clasificador de notas (y el formulario que solo te enseñaba un error)»
# https://sergiolearns.com/condicionales-en-python-practica/

# Validador de registro — versión 2: un if independiente por campo
usuario = "Jo"
edad = 20
contrasena = "abc"
email = "sergio@sergiolearns.com"

errores = 0                                 # cada comprobación que falle suma 1

print("=== REGISTRO DE USUARIO ===")

# 1. Usuario: al menos 3 caracteres
if len(usuario) < 3:
    print("✗ Usuario demasiado corto (mínimo 3 caracteres)")
    errores += 1
else:
    print("✓ Usuario válido")

# 2. Edad: 18 o más (por eso < 18 y no <= 18)
if edad < 18:
    print("✗ Tienes que tener al menos 18 años")
    errores += 1
else:
    print("✓ Edad válida")

# 3. Contraseña: primero la longitud; el número solo se mira si la longitud está bien
if len(contrasena) < 6:
    print("✗ Contraseña demasiado corta (mínimo 6 caracteres)")
    errores += 1
elif not any(c.isdigit() for c in contrasena):    # ¿algún carácter es un dígito?
    print("✗ La contraseña necesita al menos un número")
    errores += 1
else:
    print("✓ Contraseña válida")

# 4. Email: falla si le falta la @ O le falta el punto
if "@" not in email or "." not in email:
    print("✗ Email no válido")
    errores += 1
else:
    print("✓ Email válido")

# Resumen: el ternario elige entre "error" y "errores"
if errores == 0:
    print("Registro completado")
else:
    palabra = "error" if errores == 1 else "errores"
    print(f"Registro fallido: {errores} {palabra}")
