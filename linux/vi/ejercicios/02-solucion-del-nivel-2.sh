#!/bin/bash
# Solución del Nivel 2 · Fuera los repetidos
# Del artículo «vi en Linux — ejercicios con resolv.conf, líneas repetidas y una tarjeta clonada (y el NBOOT=yes que nadie había escrito)»
# https://sergiolearns.com/vi-en-linux-ejercicios/
#
# Recrea el archivo de partida, teclea las mismas teclas del artículo en vim (vim -s lee las teclas
# de un archivo, como si las pulsaras tú) y enseña el resultado con cat -n. Ejecútalo en una carpeta de pruebas.
# Las teclas, una orden por línea (<Esc> = Escape, <CR> = Enter):
#   j2dd           # en la línea 2, borra las dos copias
#   j2dd           # baja a 8.8.8.8 y borra esa línea y 8.8.4.4
#   :wq<CR>

cat > resolv.conf <<'EOF'
nameserver 193.145.147.22
nameserver 193.145.147.22
nameserver 193.145.147.22
nameserver 193.145.138.100
nameserver 8.8.8.8
nameserver 8.8.4.4
nameserver 193.145.138.200
EOF
cat -n resolv.conf 2>/dev/null
printf '%s' $'j2ddj2dd:wq\r' > teclas.tmp
vim -u DEFAULTS -i NONE -n -s teclas.tmp resolv.conf
rm -f teclas.tmp
cat -n resolv.conf
