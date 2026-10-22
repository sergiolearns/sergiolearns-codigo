# Programa 3 · Convertir el log a CSV con re.sub
# Del artículo «Expresiones regulares en Python — práctica con el log de un servidor: filtrar errores, contar intentos de acceso y convertirlo a CSV (y la IP que llamaba tres veces por segundo)»
# https://sergiolearns.com/expresiones-regulares-en-python-practica/

import re

LOG = """\
10.0.0.7 [12/10/2026 09:15:02] "GET /campus/inicio" 200 5120 "Firefox/131"
10.0.0.23 [12/10/2026 09:15:40] "POST /campus/login" 401 312 "Chrome/129"
10.0.0.23 [12/10/2026 09:15:51] "POST /campus/login" 401 312 "Chrome/129"
10.0.0.23 [12/10/2026 09:16:03] "POST /campus/login" 200 1024 "Chrome/129"
172.16.4.150 [12/10/2026 09:20:17] "GET /fp1/tema8.pdf" 200 14040 "Safari/17"
10.0.0.7 [12/10/2026 09:22:45] "GET /fp1/tema9.pdf" 404 0 "Firefox/131"
192.168.1.66 [12/10/2026 09:31:08] "POST /campus/login" 401 312 "curl/8.5"
192.168.1.66 [12/10/2026 09:31:09] "POST /campus/login" 401 312 "curl/8.5"
192.168.1.66 [12/10/2026 09:31:10] "POST /campus/login" 401 312 "curl/8.5"
10.0.0.41 [12/10/2026 10:02:33] "GET /fp1/entregas" 500 87 "Chrome/129"
-- reinicio del servidor --
10.0.0.41 [12/10/2026 10:05:12] "GET /fp1/entregas" 200 2210 "Chrome/129"
"""

PATRON = (r'(\d+\.\d+\.\d+)\.\d+ '             # 1: IP sin su último número
          r'\[(\d\d)/(\d\d)/(\d{4}) (\S+)\] '  # 2: día, 3: mes, 4: año, 5: hora
          r'"(\w+) (\S+)" (\d{3}) .*')         # 6: método, 7: ruta, 8: código; .* el resto
PLANTILLA = r"\4-\3-\2T\5;\1.0;\6;\7;\8"       # el orden lo decide la plantilla

print("fecha_hora;ip;metodo;ruta;codigo")
descartadas = 0
for linea in LOG.splitlines():
    nueva, n = re.subn(PATRON, PLANTILLA, linea)   # n vale 1 si la línea encajó, 0 si no
    if n == 0:
        descartadas += 1
    else:
        print(nueva)
print(f"# {descartadas} línea(s) descartada(s)")
