# Solución del Nivel 3 · El parte de asistencia
# Del artículo «Strings en Python — ejercicios con correos de la universidad, firmas con iniciales y un parte de asistencia (y los dos espacios que rompieron mis iniciales)»
# https://sergiolearns.com/strings-en-python-ejercicios/

PARTE = """
# Asistencia a las prácticas de FP1 (subgrupo 43)
15/09: Ana, Luis, María José, Marta
22/09: ana , Marta,MARÍA JOSÉ

29/09: Luis, María José,  marta
# 06/10: festivo
13/10: Ana, María José, Marta, Pablo
"""
MINIMO = 0.75     # hace falta venir al 75 % de las sesiones


def leer_parte(texto):
    """Devuelve la lista de fechas y un diccionario nombre -> conjunto de fechas a las que vino."""
    fechas = []
    asistencias = {}
    for linea in texto.splitlines():              # una línea cada vez
        linea = linea.strip()
        if linea == "" or linea.startswith("#"):  # se saltan las vacías y los comentarios
            continue
        fecha, _, lista = linea.partition(":")
        fechas.append(fecha)
        for nombre in lista.split(","):
            nombre = " ".join(nombre.split()).title()   # ' MARÍA JOSÉ ' -> 'María José'
            if nombre not in asistencias:
                asistencias[nombre] = set()
            asistencias[nombre].add(fecha)
    return fechas, asistencias


def fila(nombre, fechas, vino):
    """Una fila del informe: una X por sesión a la que vino y un punto por cada falta."""
    marcas = " ".join("X" if f in vino else "·" for f in fechas)
    pct = len(vino) / len(fechas)
    aviso = "" if pct >= MINIMO else "  <- no llega al 75 %"
    return f"{nombre:<12}{marcas}  {len(vino)}/{len(fechas)} {pct:>5.0%}{aviso}"


fechas, asistencias = leer_parte(PARTE)
print(f"{'Sesiones:':<12}{' '.join(f[:2] for f in fechas)}")   # solo el día: 15 22 29 13
for nombre in sorted(asistencias):
    print(fila(nombre, fechas, asistencias[nombre]))
