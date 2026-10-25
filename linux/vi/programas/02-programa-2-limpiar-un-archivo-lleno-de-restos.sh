#!/bin/bash
# Programa 2 · Limpiar un archivo lleno de restos
# Del artículo «vi en Linux — práctica con un ifcfg de verdad: activar la tarjeta, limpiar el archivo y mudarlo de red (sin tocar el ratón)»
# https://sergiolearns.com/vi-en-linux-practica/
#
# Recrea el archivo de partida, teclea las mismas teclas del artículo en vim (vim -s lee las teclas
# de un archivo, como si las pulsaras tú) y enseña el resultado con cat -n. Ejecútalo en una carpeta de pruebas.
# Las teclas, una orden por línea (<Esc> = Escape, <CR> = Enter):
#   5G             # la línea 5: el IPADDR repetido
#   dd             # fuera
#   3dd            # las tres líneas viejas comentadas
#   ddp            # GATEWAY baja debajo de NETMASK
#   GoNETWORK=10.0.1.0<Esc>   # la línea que faltaba
#   :wq<CR>

cat > ifcfg-enp2s0 <<'EOF'
DEVICE=enp2s0
BOOTPROTO=none
ONBOOT=yes
IPADDR=10.0.1.27
IPADDR=10.0.1.27
#IPADDR=192.168.2.27
#GATEWAY=192.168.2.1
#NETMASK=255.255.255.0
GATEWAY=10.0.1.1
NETMASK=255.255.255.0
EOF
cat -n ifcfg-enp2s0 2>/dev/null
printf '%s' $'5Gdd3ddddpGoNETWORK=10.0.1.0\x1b:wq\r' > teclas.tmp
vim -u DEFAULTS -i NONE -n -s teclas.tmp ifcfg-enp2s0
rm -f teclas.tmp
cat -n ifcfg-enp2s0
