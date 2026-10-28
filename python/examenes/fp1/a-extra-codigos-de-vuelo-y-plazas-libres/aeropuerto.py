# Simulacro práctico de FP1 · versión A · Códigos de vuelo y plazas libres (solución)
# Del artículo «Simulacro práctico de FP1 — los exámenes de continuidad en Python, con nota al momento (y la regla del 8 incluida)»
# https://sergiolearns.com/simulacro-examen-fp1-practica/
import re


def codigo_valido(codigo):
    # 2 letras MAYÚSCULAS y 3 o 4 dígitos, y nada más: fullmatch mira la string entera
    return re.fullmatch(r"[A-Z]{2}\d{3,4}", codigo) is not None


def aplicar_reservas(vuelos, reservas):
    aplicadas, rechazadas = 0, 0
    for codigo, plazas in reservas:              # en orden: una reserva puede dejar sin sitio a la siguiente
        if codigo_valido(codigo) and codigo in vuelos and 0 < plazas <= vuelos[codigo][1]:
            destino, libres = vuelos[codigo]
            vuelos[codigo] = (destino, libres - plazas)   # la tupla no se puede cambiar: se sustituye entera
            aplicadas += 1
        else:
            rechazadas += 1
    return (aplicadas, rechazadas)


if __name__ == "__main__":
    print(codigo_valido("IB3245"), codigo_valido("IB12"), codigo_valido("nt123"))
    vuelos = {"NT123": ("Tenerife Norte", 10), "IB3245": ("Madrid", 2), "FR1234": ("Londres", 0)}
    reservas = [("NT123", 4), ("IB3245", 3), ("nt123", 1), ("FR1234", 1), ("IB3245", 2), ("UX999", 1), ("NT123", 6)]
    print(aplicar_reservas(vuelos, reservas))
    print(vuelos)
