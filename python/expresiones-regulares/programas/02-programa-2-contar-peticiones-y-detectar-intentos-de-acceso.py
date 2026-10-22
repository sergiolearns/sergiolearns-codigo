# Programa 2 · Contar peticiones y detectar intentos de acceso
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

codigos = re.findall(r'" (\d{3}) ', LOG)          # todos los códigos de una vez
por_codigo = {}
for c in codigos:
    por_codigo[c] = por_codigo.get(c, 0) + 1
print("Peticiones por código:", dict(sorted(por_codigo.items())))

por_hora = {}
fallos_login = {}
total_bytes = 0
for linea in LOG.splitlines():
    m = re.match(r'(\S+) \[\d\d/\d\d/\d{4} (\d\d):.*" (\d{3}) (\d+) ', linea)
    if not m:
        continue                                  # la línea del reinicio no es una petición
    ip, hora, codigo, tam = m.groups()
    por_hora[hora] = por_hora.get(hora, 0) + 1
    total_bytes += int(tam)
    if codigo == "401":
        fallos_login[ip] = fallos_login.get(ip, 0) + 1

for hora, n in sorted(por_hora.items()):
    print(f"{hora}:00-{hora}:59  {'#' * n} {n}")
print(f"Bytes servidos: {total_bytes} ({total_bytes / 1024:.1f} KB)")
for ip, n in fallos_login.items():
    aviso = "  <- sospechosa" if n >= 3 else ""
    print(f"{ip:<14}{n} inicios de sesión fallidos{aviso}")
