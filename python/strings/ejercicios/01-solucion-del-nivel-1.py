# Solución del Nivel 1 · La ficha de un correo
# Del artículo «Strings en Python — ejercicios con correos de la universidad, firmas con iniciales y un parte de asistencia (y los dos espacios que rompieron mis iniciales)»
# https://sergiolearns.com/strings-en-python-ejercicios/

correo = "  Maria.Jose.Nunez@ALU.ULPGC.ES  "

correo = correo.strip().lower()                  # 1. limpiar y pasar a minúsculas (y guardarlo)
print(correo)
print("Longitud:", len(correo))                  # 2. longitud

usuario, _, dominio = correo.partition("@")      # 3. trozos antes y después de la @
print("Usuario:", usuario)
print("Dominio:", dominio)

print("¿Es de alumno?", correo.endswith("@alu.ulpgc.es"))   # 4.
print("Puntos en el usuario:", usuario.count("."))          # 5.

nombre = usuario.replace(".", " ").title()       # 6. los puntos pasan a ser espacios
print("Nombre:", nombre)

iniciales = ""
for palabra in nombre.split():                   # 7. la primera letra de cada palabra
    iniciales += palabra[0]
print("Iniciales:", iniciales)

oculto = usuario[0] + "*" * (len(usuario) - 1) + "@" + dominio   # 8. ocultar el usuario
print("Oculto:", oculto)
