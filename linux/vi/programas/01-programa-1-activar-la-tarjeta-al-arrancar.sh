#!/bin/bash
# Programa 1 · Activar la tarjeta al arrancar
# Del artículo «vi en Linux — práctica con un ifcfg de verdad: activar la tarjeta, limpiar el archivo y mudarlo de red (sin tocar el ratón)»
# https://sergiolearns.com/vi-en-linux-practica/
#
# Recrea el archivo de partida, teclea las mismas teclas del artículo en vim (vim -s lee las teclas
# de un archivo, como si las pulsaras tú) y enseña el resultado con cat -n. Ejecútalo en una carpeta de pruebas.
# Las teclas, una orden por línea (<Esc> = Escape, <CR> = Enter):
#   /dhcp<CR>      # el cursor salta a la d de dhcp
#   cwnone<Esc>    # dirección fija: sin DHCP
#   /=no<CR>       # el cursor cae en el = de ONBOOT=no
#   lcwyes<Esc>    # un paso a la derecha y cambia no por yes
#   GoNETWORK=192.168.2.0<Esc>   # abre una línea al final y escribe la red
#   :wq<CR>        # guarda y sale

cat > ifcfg-enp2s0 <<'EOF'
DEVICE=enp2s0
BOOTPROTO=dhcp
ONBOOT=no
IPADDR=192.168.2.27
NETMASK=255.255.255.0
GATEWAY=192.168.2.1
EOF
cat -n ifcfg-enp2s0 2>/dev/null
printf '%s' $'/dhcp\rcwnone\x1b/=no\rlcwyes\x1bGoNETWORK=192.168.2.0\x1b:wq\r' > teclas.tmp
vim -u DEFAULTS -i NONE -n -s teclas.tmp ifcfg-enp2s0
rm -f teclas.tmp
cat -n ifcfg-enp2s0
