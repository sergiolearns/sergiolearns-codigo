# Programa 2 · Validar DNIs y fechas de nacimiento
# Del artículo «Strings en Python — práctica limpiando una lista de clase, validando DNIs y sacando un acta alineada (y el 7,5 que float() no quiso leer)»
# https://sergiolearns.com/strings-en-python-practica/

LETRAS = "TRWAGMYFPDXBNJZSQVHLCKE"    # la letra del DNI es LETRAS[número % 23]

# Cada registro: "DNI;fecha de nacimiento", copiado a mano por cada alumno
REGISTROS = [
    "12345678Z;03/09/2007",
    "1234567Z;15/02/2006",
    "12345678A;21/11/2006",
    "x2345678Z;30/06/2007",
    "87654321x;7/5/2007",
    "  45123456D ;31/13/2006 ",
]


def validar_dni(dni):
    """Devuelve "" si el DNI es correcto, o un texto con el motivo si no lo es."""
    dni = dni.strip().upper()             # tolera espacios y la letra en minúscula
    if len(dni) != 9:                     # lo primero, la longitud: así dni[8] nunca falla
        return f"DNI con {len(dni)} caracteres (deben ser 9)"
    numero, letra = dni[:8], dni[8]       # 8 cifras y la letra
    if not numero.isdigit():
        return f"'{numero}' no son 8 cifras"
    esperada = LETRAS[int(numero) % 23]   # el resto (de 0 a 22) es una posición de LETRAS
    if letra != esperada:
        return f"la letra debería ser {esperada}"
    return ""


def validar_fecha(fecha):
    """Comprueba el formato dd/mm/aaaa y que el día y el mes tengan sentido."""
    partes = fecha.strip().split("/")
    if len(partes) != 3 or [len(p) for p in partes] != [2, 2, 4]:
        return "fecha sin el formato dd/mm/aaaa"
    if not "".join(partes).isdigit():     # juntar los trozos y mirar que todo sean cifras
        return "fecha con caracteres que no son cifras"
    dia, mes = int(partes[0]), int(partes[1])
    if not 1 <= mes <= 12:
        return f"el mes {mes} no existe"
    if not 1 <= dia <= 31:
        return f"el día {dia} no existe"
    return ""


correctos = 0
print(f"{'DNI':<12}{'Fecha':<12}Resultado")
for registro in REGISTROS:
    dni, fecha = registro.split(";")
    # se guardan solo los mensajes no vacíos ("" cuenta como falso)
    errores = [e for e in (validar_dni(dni), validar_fecha(fecha)) if e]
    if errores:
        resultado = "; ".join(errores)
    else:
        resultado = "OK"
        correctos += 1
    print(f"{dni.strip():<12}{fecha.strip():<12}{resultado}")

print(f"Correctos: {correctos} de {len(REGISTROS)} ({correctos / len(REGISTROS):.0%})")
