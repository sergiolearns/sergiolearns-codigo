#!/bin/bash
# Programa 1: compilar todas las entregas (uso: ./01-programa-1-compilar-todas-las-entregas.sh entregas)
# Del artículo «Shell scripts en Linux — práctica con un corrector que compila, prueba y pone nota a las entregas de C (y la práctica que «compilaba» sin compilar)»
# https://sergiolearns.com/shell-scripts-en-linux-practica/
# Ejecútalo dentro de linux/shell-scripts/, donde están entregas/ y los .txt de datos
# compilar.sh: compila todas las entregas de una carpeta y dice cuáles compilan
# Uso: ./compilar.sh carpeta

if [ $# -ne 1 ]; then                 # exactamente un parámetro: la carpeta
    echo "Uso: $0 carpeta" >&2         # los mensajes de error van por stderr
    exit 2                            # 2 = me has llamado mal
fi
carpeta=$1
if [ ! -d "$carpeta" ]; then          # -d: existe y es una carpeta
    echo "No es una carpeta: $carpeta" >&2
    exit 2
fi

mkdir -p errores                      # -p: no falla si ya existe
ok=0
mal=0
for fuente in "$carpeta"/*.c; do      # comillas en la variable, el * fuera
    alumno=$(basename "$fuente" .c)   # entregas/ana.c -> ana
    binario="$carpeta/$alumno"
    rm -f "$binario"                  # sin esto, un ejecutable viejo se haría pasar por bueno
    if gcc -Wall "$fuente" -o "$binario" 2> "errores/$alumno.txt"; then
        ok=$((ok + 1))
        if [ -s "errores/$alumno.txt" ]; then   # -s: existe y NO está vacío
            echo "OK     $alumno (con avisos)"
        else
            echo "OK     $alumno"
        fi
    else
        mal=$((mal + 1))
        echo "ERROR  $alumno"
    fi
done
echo "Compilan: $ok. No compilan: $mal"
[ "$mal" -eq 0 ]                      # última orden = código del script: 0 si todo compiló
