# Solución del Nivel 1
# Del artículo «Contenedores asociativos en Python — ejercicios con duraciones, géneros musicales y un recomendador de canciones (y las llaves vacías que no eran un conjunto)»
# https://sergiolearns.com/contenedores-asociativos-en-python-ejercicios/

duraciones = {"Luz de neón": 215, "Café a las 3": 187}

duraciones["Pixel"] = 176                  # añadir una pareja nueva
duraciones["Café a las 3"] = 190           # cambiar el valor de una clave que ya existe
quitada = duraciones.pop("Luz de neón")    # quitarla y quedarnos con su valor
print(duraciones, quitada)

print(duraciones.get("Marzo", 0))          # clave que no está: 0, sin error
print("Pixel" in duraciones, "Marzo" in duraciones)

total = 0
for titulo in sorted(duraciones):          # las claves, en orden alfabético
    segundos = duraciones[titulo]          # tenemos la clave: consulta directa
    total += segundos
    print(f"{titulo}: {segundos // 60}:{segundos % 60:02d}")
print("Total:", total, "segundos")
