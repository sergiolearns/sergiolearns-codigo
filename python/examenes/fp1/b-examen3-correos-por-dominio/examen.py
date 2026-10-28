# Simulacro práctico de FP1 · versión B · Correos por dominio (solución)
# Del artículo «Simulacro práctico de FP1 — los exámenes de continuidad en Python, con nota al momento (y la regla del 8 incluida)»
# https://sergiolearns.com/simulacro-examen-fp1-practica/
import re
import ayuda_re
from ficheros import leer_texto



def contar_dominios(entrada, salida):
    texto = leer_texto(entrada)
    # usuario (letras, dígitos, _ . + -) @ dominio con al menos un punto; el punto final de una frase no entra
    correos = {c.lower() for c in re.findall(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+", texto)}   # conjunto: sin repetidos
    por_dominio = {}
    for c in correos:
        dominio = c.split("@")[1]
        por_dominio[dominio] = por_dominio.get(dominio, 0) + 1
    # más correos primero; si empatan, el dominio en orden alfabético
    orden = sorted(por_dominio.items(), key=lambda par: (-par[1], par[0]))
    with open(salida, "w", encoding="utf-8") as f:
        for dominio, n in orden:
            f.write(f"{dominio:<15}{n:>3}\n")
        f.write("=" * 10 + "\n")
        f.write(f"Correos:{len(correos):>3}, dominios:{len(por_dominio):>3}\n")


if __name__ == "__main__":
    contar_dominios("texto_de_prueba.txt", "dominios.txt")
    print(leer_texto("dominios.txt"), end="")
