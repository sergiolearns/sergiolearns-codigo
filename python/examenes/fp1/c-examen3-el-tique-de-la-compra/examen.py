# Simulacro práctico de FP1 · versión C · El tique de la compra (solución)
# Del artículo «Simulacro práctico de FP1 — los exámenes de continuidad en Python, con nota al momento (y la regla del 8 incluida)»
# https://sergiolearns.com/simulacro-examen-fp1-practica/
import re
import ayuda_re
from ficheros import leer_texto



def resumir_tique(entrada, salida):
    lineas = []
    total = 0                     # en céntimos: con enteros no hay errores de redondeo
    for linea in leer_texto(entrada).split("\n"):
        # nombre (lo más corto posible), puntos o espacios de relleno, euros, coma o punto, 2 céntimos, € o EUR al final
        m = re.match(r"^(.*?)[\s.]*(\d+)[,.](\d{2})\s*(?:€|EUR)\s*$", linea)
        if m:
            centimos = int(m.group(2)) * 100 + int(m.group(3))
            total += centimos
            lineas.append((m.group(1).strip(), centimos))
    with open(salida, "w", encoding="utf-8") as f:
        for nombre, c in lineas:
            f.write(f"{nombre:<16}{c // 100:>4}.{c % 100:02d}\n")     # 4 cifras de euros + . + 2 de céntimos = 7
        f.write("=" * 23 + "\n")
        f.write(f"{'TOTAL':<16}{total // 100:>4}.{total % 100:02d}\n")
        f.write(f"Productos:{len(lineas):>3}\n")


if __name__ == "__main__":
    resumir_tique("texto_de_prueba.txt", "resumen.txt")
    print(leer_texto("resumen.txt"), end="")
