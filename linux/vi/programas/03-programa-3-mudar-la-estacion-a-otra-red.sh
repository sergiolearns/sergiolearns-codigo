#!/bin/bash
# Programa 3 · Mudar la estación a otra red
# Del artículo «vi en Linux — práctica con un ifcfg de verdad: activar la tarjeta, limpiar el archivo y mudarlo de red (sin tocar el ratón)»
# https://sergiolearns.com/vi-en-linux-practica/
#
# Recrea el archivo de partida, teclea las mismas teclas del artículo en vim (vim -s lee las teclas
# de un archivo, como si las pulsaras tú) y enseña el resultado con cat -n. Ejecútalo en una carpeta de pruebas.
# Las teclas, una orden por línea (<Esc> = Escape, <CR> = Enter):
#   /GATEWAY<CR>   # comprueba dónde está la puerta de enlace
#   /10<CR>        # busca 10 desde ahí
#   n              # siguiente
#   n              # y otra vez (vuelve arriba)
#   :%s/10\.0\.1\./10.0.5./g<CR>
#   :w<CR>         # guarda sin salir
#   :q<CR>

cat > ifcfg-enp2s0 <<'EOF'
DEVICE=enp2s0
BOOTPROTO=none
ONBOOT=yes
IPADDR=10.0.1.27
NETMASK=255.255.255.0
GATEWAY=10.0.1.1
NETWORK=10.0.1.0
EOF
cat -n ifcfg-enp2s0 2>/dev/null
printf '%s' $'/GATEWAY\r/10\rnn:%s/10\\.0\\.1\\./10.0.5./g\r:w\r:q\r' > teclas.tmp
vim -u DEFAULTS -i NONE -n -s teclas.tmp ifcfg-enp2s0
rm -f teclas.tmp
cat -n ifcfg-enp2s0
