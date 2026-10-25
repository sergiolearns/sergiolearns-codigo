#!/bin/bash
# Programa 3: el script revisor de permisos (uso: ./revisar.sh carpeta)
# Del artículo «Permisos en Linux — práctica con la carpeta de un trabajo en grupo, tres usuarios y un revisor de permisos (y la compañera que no podía compilar)»
# https://sergiolearns.com/permisos-en-linux-practica/
# Revisa una carpeta y avisa de todo lo que "otros" pueden tocar.
carpeta=${1:-.}                       # la carpeta que se pasa como argumento (o la actual)
problemas=0
# sort: find no garantiza ningún orden; ordenado, el informe sale siempre igual
for f in $(find "$carpeta" | sort); do
    modo=$(stat -c '%a' "$f")         # permisos en octal, por ejemplo 640
    otros=${modo: -1}                 # el ÚLTIMO dígito es el de otros (vale también con 4 dígitos)
    if [ "$otros" -ne 0 ]; then       # 0 = otros no pueden nada; cualquier otro valor es un aviso
        echo "AVISO $modo $f"
        problemas=$((problemas + 1))
    fi
done
echo "Problemas: $problemas"
