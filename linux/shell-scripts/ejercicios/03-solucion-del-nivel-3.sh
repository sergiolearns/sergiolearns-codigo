#!/bin/bash
# Solución del nivel 3: corregir a toda la lista (uso: ... alumnos.txt entregas)
# Del artículo «Shell scripts en Linux — ejercicios con parámetros que llevan espacios, notas que hay que validar y una lista de alumnos que corregir (y el archivo «3» que apareció en la carpeta)»
# https://sergiolearns.com/shell-scripts-en-linux-ejercicios/
# Ejecútalo dentro de linux/shell-scripts/, donde están entregas/ y los .txt de datos
# revisar_lista.sh: corrige a todos los de la lista, hayan entregado o no
# Uso: ./revisar_lista.sh lista carpeta

if [ $# -ne 2 ]; then
    echo "Uso: $0 lista carpeta" >&2
    exit 2
fi
lista=$1
carpeta=$2

nota_de() {                           # nota_de ALUMNO: escribe su nota (o el motivo)
    local fuente="$carpeta/$1.c"
    local binario="$carpeta/$1"
    if [ ! -f "$fuente" ]; then
        echo "NO ENTREGADO"
        return 1
    fi
    rm -f "$binario"
    if ! gcc -Wall "$fuente" -o "$binario" 2> /dev/null; then
        echo "0"
        return 0
    fi
    if [ "$("$binario" < entrada.txt)" = "$(cat esperado.txt)" ]; then
        echo "10"
    else
        echo "5"
    fi
}

en_lista=0
entregadas=0
correctas=0
while read -r alumno; do
    en_lista=$((en_lista + 1))
    nota=$(nota_de "$alumno")         # $( ) recoge lo que la función escribe
    if [ $? -eq 0 ]; then             # justo después: el $? es el de nota_de
        entregadas=$((entregadas + 1))
    fi
    if [ "$nota" = "10" ]; then
        correctas=$((correctas + 1))
    fi
    printf "%-8s %s\n" "$alumno" "$nota"   # %-8s: nombre a la izquierda en 8 columnas
done < "$lista"
echo "En la lista: $en_lista. Entregadas: $entregadas. Correctas: $correctas"
[ "$entregadas" -eq "$en_lista" ]
