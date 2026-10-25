#!/bin/bash
# Solución del nivel 1: información de varios archivos .c
# Del artículo «Shell scripts en Linux — ejercicios con parámetros que llevan espacios, notas que hay que validar y una lista de alumnos que corregir (y el archivo «3» que apareció en la carpeta)»
# https://sergiolearns.com/shell-scripts-en-linux-ejercicios/
# Ejecútalo dentro de linux/shell-scripts/, donde están entregas/ y los .txt de datos
# info.sh: para cada archivo .c que recibe, cuenta sus líneas y mira si tiene main
# Uso: ./info.sh archivo.c [archivo.c ...]

if [ $# -eq 0 ]; then                 # sin parámetros no hay nada que mirar
    echo "Uso: $0 archivo.c [archivo.c ...]" >&2
    exit 2
fi
problemas=0
for f in "$@"; do                     # "$@": cada parámetro entero, aunque tenga espacios
    if [ ! -f "$f" ]; then
        echo "$f: no existe"
        problemas=$((problemas + 1))
        continue
    fi
    lineas=$(wc -l < "$f")            # con < wc solo escribe el número, sin el nombre
    if grep -q "int main" "$f"; then  # -q: callado; if solo mira el código de grep
        echo "$f: $lineas líneas, tiene main"
    else
        echo "$f: $lineas líneas, SIN main"
        problemas=$((problemas + 1))
    fi
done
[ "$problemas" -eq 0 ]                # 0 si todos existen y tienen main
