#!/bin/bash
# Solución del nivel 2: calificaciones y media (uso: ... notas.txt)
# Del artículo «Shell scripts en Linux — ejercicios con parámetros que llevan espacios, notas que hay que validar y una lista de alumnos que corregir (y el archivo «3» que apareció en la carpeta)»
# https://sergiolearns.com/shell-scripts-en-linux-ejercicios/
# Ejecútalo dentro de linux/shell-scripts/, donde están entregas/ y los .txt de datos
# notas.sh: lee "alumno nota" de un archivo, pone la calificación y calcula la media
# Uso: ./notas.sh archivo

[ $# -eq 1 ] || { echo "Uso: $0 archivo" >&2; exit 2; }
[ -f "$1" ] || { echo "No existe: $1" >&2; exit 1; }

suma=0
n=0
aprobados=0
raras=0
while read -r alumno nota; do         # read reparte la línea: 1.ª palabra y el resto
    case "$nota" in
        [0-9]|10) ;;                  # un dígito o 10: es una nota válida, seguimos
        *)
            echo "$alumno: nota no válida ($nota)"
            raras=$((raras + 1))
            continue ;;
    esac
    if [ "$nota" -ge 9 ]; then        # -ge y no >: comparamos números
        palabra="Sobresaliente"
    elif [ "$nota" -ge 7 ]; then
        palabra="Notable"
    elif [ "$nota" -ge 5 ]; then
        palabra="Aprobado"
    else
        palabra="Suspenso"
    fi
    echo "$alumno: $nota $palabra"
    suma=$((suma + nota))
    n=$((n + 1))
    if [ "$nota" -ge 5 ]; then
        aprobados=$((aprobados + 1))
    fi
done < "$1"
echo "Notas válidas: $n. Aprobados: $aprobados. No válidas: $raras"
echo "Media: $((suma / n)).$(( (suma * 10 / n) % 10 ))"   # bash solo hace cuentas con enteros
[ "$raras" -eq 0 ]
