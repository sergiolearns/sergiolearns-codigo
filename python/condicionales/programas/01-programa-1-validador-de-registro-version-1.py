# Programa 1 · Validador de registro (versión 1: cadena if/elif)
# Del artículo «Condicionales en Python — práctica con un validador de registro, descuentos por nivel y un clasificador de notas (y el formulario que solo te enseñaba un error)»
# https://sergiolearns.com/condicionales-en-python-practica/

# Validador de registro — versión 1: una sola cadena if/elif
usuario = "Jo"
edad = 20
contrasena = "abc"
email = "sergio@sergiolearns.com"

print("=== REGISTRO DE USUARIO ===")

if len(usuario) < 3:                        # la primera condición True...
    print("Error: el usuario debe tener al menos 3 caracteres")
elif edad < 18:                             # ...corta la cadena: el resto no se mira
    print("Error: tienes que tener al menos 18 años")
elif len(contrasena) < 6:
    print("Error: la contraseña debe tener al menos 6 caracteres")
elif "@" not in email or "." not in email:
    print("Error: el email no es válido")
else:                                       # solo si NINGUNA fue True
    print("Registro completado con éxito")
