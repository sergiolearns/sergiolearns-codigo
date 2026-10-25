#!/bin/bash
# Programa 2: probar las salidas (después del programa 1)
# Del artículo «Shell scripts en Linux — práctica con un corrector que compila, prueba y pone nota a las entregas de C (y la práctica que «compilaba» sin compilar)»
# https://sergiolearns.com/shell-scripts-en-linux-practica/
# Ejecútalo dentro de linux/shell-scripts/, donde están entregas/ y los .txt de datos
# probar.sh: ejecuta cada entrega con entrada.txt y compara con esperado.txt
# Uso: ./probar.sh [carpeta]   (después de ./compilar.sh carpeta)

carpeta=${1:-entregas}                # si no me dan carpeta, uso entregas

probar() {                            # probar ALUMNO -> 0 bien, 1 salida distinta, 2 sin ejecutable
    local alumno=$1
    local binario="$carpeta/$alumno"
    if [ ! -x "$binario" ]; then      # -x: existe y se puede ejecutar
        return 2
    fi
    "$binario" < entrada.txt > "salidas/$alumno.txt"
    cmp -s "salidas/$alumno.txt" esperado.txt   # -s: sin mensajes; solo importa su $?
}

mkdir -p salidas
for fuente in "$carpeta"/*.c; do
    alumno=$(basename "$fuente" .c)
    probar "$alumno"
    case $? in                        # case mira el código que devolvió probar
        0) echo "CORRECTO        $alumno" ;;
        1) echo "SALIDA DISTINTA $alumno: da $(cat "salidas/$alumno.txt"), se esperaba $(cat esperado.txt)" ;;
        2) echo "SIN EJECUTABLE  $alumno" ;;
    esac
done
