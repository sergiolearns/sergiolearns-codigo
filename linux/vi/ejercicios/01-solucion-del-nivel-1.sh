#!/bin/bash
# Solución del Nivel 1 · Crea el resolv.conf
# Del artículo «vi en Linux — ejercicios con resolv.conf, líneas repetidas y una tarjeta clonada (y el NBOOT=yes que nadie había escrito)»
# https://sergiolearns.com/vi-en-linux-ejercicios/
#
# Recrea el archivo de partida, teclea las mismas teclas del artículo en vim (vim -s lee las teclas
# de un archivo, como si las pulsaras tú) y enseña el resultado con cat -n. Ejecútalo en una carpeta de pruebas.
# Las teclas, una orden por línea (<Esc> = Escape, <CR> = Enter):
#   inameserver 193.145.147.22<CR>nameserver 193.145.138.100<Esc>
#   :wq<CR>

[ -e resolv.conf ] && { echo "resolv.conf ya existe: ejecútalo en una carpeta vacía"; exit 1; }
cat -n resolv.conf 2>/dev/null
printf '%s' $'inameserver 193.145.147.22\rnameserver 193.145.138.100\x1b:wq\r' > teclas.tmp
vim -u DEFAULTS -i NONE -n -s teclas.tmp resolv.conf
rm -f teclas.tmp
cat -n resolv.conf
