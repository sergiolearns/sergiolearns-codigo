# Solución del Nivel 3 · Unificar dos logs con fechas distintas
# Del artículo «Expresiones regulares en Python — ejercicios con validadores, DNIs escondidos en un informe y dos logs que unificar (y la alerta que decía "Todo bien")»
# https://sergiolearns.com/expresiones-regulares-en-python-ejercicios/

import re

# Dos servidores, dos formatos de fecha (y alguna línea escrita a mano, mal)
SERVIDOR_A = """\
12/10/2026 09:15:02 10.0.0.7 GET /campus/inicio 200
12-10-2026 09:31:08 192.168.1.66 POST /campus/login 401
12/10-2026 09:40:00 10.0.0.9 GET /fp1 200
"""
SERVIDOR_B = """\
2026-10-12 09:20:17 172.16.4.150 GET /fp1/tema8.pdf 200
2026-10-12 10:02:33 10.0.0.41 GET /fp1/entregas 500
2026/10-12 10:05:12 10.0.0.41 GET /fp1/entregas 200
"""
DMA = r"(\d\d)([-/])(\d\d)\2(\d{4}) "   # día, separador, mes, EL MISMO separador, año
AMD = r"\d{4}-\d\d-\d\d "               # ya está en año-mes-día


def normalizar(linea):
    """Devuelve la línea con la fecha en año-mes-día, o None si la fecha no se entiende."""
    nueva, n = re.subn("^" + DMA, r"\4-\3-\1 ", linea)
    if n == 1:
        return nueva
    if re.match(AMD, linea):
        return linea
    return None


unificado, rechazadas = [], []
for origen, texto in [("A", SERVIDOR_A), ("B", SERVIDOR_B)]:
    for linea in texto.splitlines():
        nueva = normalizar(linea)
        if nueva is None:
            rechazadas.append(f"{origen}: {linea}")
        else:
            unificado.append(nueva + "  [" + origen + "]")

unificado.sort()          # con la fecha en año-mes-día, el orden alfabético es el cronológico
for linea in unificado:
    print(linea)

print("Rechazadas:")
for r in rechazadas:
    print("  " + r)

errores = [l for l in unificado if re.search(r" [45]\d\d  \[", l)]   # códigos 4xx y 5xx
print(f"Peticiones: {len(unificado)}, con error: {len(errores)}")
