# Simulacro práctico de FP1 · versión A · Las horas de un horario (solución)
# Del artículo «Simulacro práctico de FP1 — los exámenes de continuidad en Python, con nota al momento (y la regla del 8 incluida)»
# https://sergiolearns.com/simulacro-examen-fp1-practica/
import re
import ayuda_re
from ficheros import leer_texto



def extraer_horas(entrada, salida):
    texto = leer_texto(entrada)
    cuenta = {}                   # "HH:MM" -> veces que aparece
    total = 0
    # 1 o 2 dígitos, ":" o "h", 2 dígitos; \b evita trozos de números más largos (123:45)
    for m in re.finditer(r"\b(\d{1,2})[:h](\d{2})\b", texto):
        hora, minuto = int(m.group(1)), int(m.group(2))
        if hora <= 23 and minuto <= 59:                    # 25:10 y 7:75 encajan en el patrón, pero no son horas
            clave = f"{hora:02d}:{minuto:02d}"        # normalizar: 8:30 y 21h00 -> 08:30 y 21:00
            cuenta[clave] = cuenta.get(clave, 0) + 1
            total += 1
    with open(salida, "w", encoding="utf-8") as f:
        for clave in sorted(cuenta):                # "HH:MM" con dos cifras: el orden de texto es el del reloj
            f.write(f"{clave} x{cuenta[clave]}\n")
        f.write("-" * 10 + "\n")
        f.write(f"Total:{total:>3}, distintas:{len(cuenta):>3}\n")


if __name__ == "__main__":
    extraer_horas("texto_de_prueba.txt", "horas.txt")
    print(leer_texto("horas.txt"), end="")
