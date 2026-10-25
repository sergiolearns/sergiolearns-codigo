#!/bin/bash
# Programa 3: el corrector completo (uso: ./03-programa-3-el-corrector-completo.sh [-c | -p] entregas)
# Del artículo «Shell scripts en Linux — práctica con un corrector que compila, prueba y pone nota a las entregas de C (y la práctica que «compilaba» sin compilar)»
# https://sergiolearns.com/shell-scripts-en-linux-practica/
# Ejecútalo dentro de linux/shell-scripts/, donde están entregas/ y los .txt de datos
# corregir.sh: el corrector completo de la práctica "suma"
# Uso: ./corregir.sh [-c | -p] carpeta
#   -c  solo compila    -p  compila y prueba (lo que hace si no le dices nada)

uso() {                               # una función para no repetir el mensaje tres veces
    echo "Uso: $0 [-c | -p] carpeta" >&2
    exit 2                            # exit dentro de una función termina TODO el script
}

compilar() {                          # compilar FUENTE BINARIO: devuelve el código de gcc
    gcc -Wall "$1" -o "$2" 2> /dev/null
}

modo=probar
case "$1" in
    -c) modo=compilar; shift ;;       # shift: tira $1 y el resto se mueve ($2 pasa a $1)
    -p) shift ;;
    -*) uso ;;                        # cualquier otra opción que empiece por -
esac
[ $# -eq 1 ] || uso                   # || : si la comprobación falla, uso
[ -d "$1" ] || uso
carpeta=$1

correctas=0
total=0
for fuente in "$carpeta"/*.c; do
    alumno=$(basename "$fuente" .c)
    binario="$carpeta/$alumno"
    total=$((total + 1))
    rm -f "$binario"
    if ! compilar "$fuente" "$binario"; then
        echo "$alumno: 0 (no compila)"
        continue                      # a por el siguiente alumno
    fi
    if [ "$modo" = compilar ]; then   # = compara CADENAS
        echo "$alumno: compila"
        correctas=$((correctas + 1))
        continue
    fi
    salida=$("$binario" < entrada.txt)
    if [ "$salida" = "$(cat esperado.txt)" ]; then
        echo "$alumno: 10"
        correctas=$((correctas + 1))
    else
        echo "$alumno: 5 (compila, pero da $salida)"
    fi
done
echo "Correctas: $correctas de $total"
[ "$correctas" -eq "$total" ]         # código de salida: 0 solo si todas están bien
