# SergioLearns · Matemática discreta (MD) · Lógica y demostraciones
# Problema 7: así lo preguntan en el examen
# https://sergiolearns.com/logica-y-demostraciones-practica/

from itertools import product

def implica(a, b):
    return (not a) or b

opciones = {"a": "VFVFVFVF", "b": "FVFFVFVF", "c": "VFVVFVFV", "d": "VVVVFVFV"}
col = "".join("V" if implica((not p) or q, r == p) else "F"
              for p, q, r in product([True, False], repeat=3))
print("columna final:", col)
print("opción correcta:", [k for k, v in opciones.items() if v == col])
print("contingencia" if "V" in col and "F" in col else "no es contingencia")
