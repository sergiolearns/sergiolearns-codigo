# Solución del Nivel 1 · Validar los campos de una alerta
# Del artículo «Expresiones regulares en Python — ejercicios con validadores, DNIs escondidos en un informe y dos logs que unificar (y la alerta que decía "Todo bien")»
# https://sergiolearns.com/expresiones-regulares-en-python-ejercicios/

import re

PATRONES = {
    "IP": r"\d{1,3}(?:\.\d{1,3}){3}",
    "Hora": r"([01]\d|2[0-3]):[0-5]\d:[0-5]\d",   # de 00 a 23 : de 00 a 59 : de 00 a 59
    "Código": r"[1-5]\d\d",                       # los códigos HTTP van de 100 a 599
    "Ruta": r"/[\w/.-]*",                         # empieza por / y luego letras, /, . o -
}
PRUEBAS = [
    ("IP", "10.0.0.7"), ("IP", "10.0.0"), ("IP", "10.0.0.7 "),
    ("Hora", "09:15:02"), ("Hora", "9:15:02"), ("Hora", "24:00:00"),
    ("Código", "404"), ("Código", "4040"), ("Código", "704"),
    ("Ruta", "/fp1/tema8.pdf"), ("Ruta", "fp1/tema8.pdf"),
]

print(f"{'Campo':<8}{'Valor':<18}{'fullmatch':<11}match")
for campo, valor in PRUEBAS:
    bien = re.fullmatch(PATRONES[campo], valor)   # ¿TODO el valor tiene el formato?
    casi = re.match(PATRONES[campo], valor)       # ¿EMPIEZA con el formato?
    print(f"{campo:<8}{valor!r:<18}{'✔' if bien else '✘':<11}{'✔' if casi else '✘'}")
