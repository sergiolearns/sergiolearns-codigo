# Programa 1 · Filtrar los errores del log
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

# Una línea buena:  IP [fecha hora] "MÉTODO ruta" código bytes "navegador"
PATRON = (r'(\d{1,3}(?:\.\d{1,3}){3}) '               # 1: IP
          r'\[(\d\d/\d\d/\d{4}) (\d\d:\d\d:\d\d)\] '  # 2: fecha, 3: hora
          r'"(GET|POST) (\S+)" '                      # 4: método, 5: ruta
          r'(\d{3}) (\d+) '                           # 6: código, 7: bytes
          r'"([^"]*)"')                               # 8: navegador

errores = 0
malas = []
print(f"{'Hora':<10}{'IP':<14}{'Código':>6}  Petición")
for n, linea in enumerate(LOG.splitlines(), start=1):
    m = re.fullmatch(PATRON, linea)         # fullmatch: la línea ENTERA tiene que encajar
    if m is None:
        malas.append(n)
        continue
    ip, fecha, hora, metodo, ruta, codigo, tam, navegador = m.groups()
    if int(codigo) >= 400:                  # 4xx: fallo del cliente; 5xx: fallo del servidor
        errores += 1
        print(f"{hora:<10}{ip:<14}{codigo:>6}  {metodo} {ruta}")

print(f"Errores: {errores}. Líneas que no son peticiones: {malas}")
