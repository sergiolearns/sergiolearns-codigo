#!/bin/bash
# Solución del Nivel 3 · Clona la tarjeta
# Del artículo «vi en Linux — ejercicios con resolv.conf, líneas repetidas y una tarjeta clonada (y el NBOOT=yes que nadie había escrito)»
# https://sergiolearns.com/vi-en-linux-ejercicios/
#
# Recrea el archivo de partida, teclea las mismas teclas del artículo en vim (vim -s lee las teclas
# de un archivo, como si las pulsaras tú) y enseña el resultado con cat -n. Ejecútalo en una carpeta de pruebas.
# Las teclas, una orden por línea (<Esc> = Escape, <CR> = Enter):
#   :%s/enp2s0/enp3s0/g<CR>   # el nombre de la tarjeta
#   /IPADDR<CR>    # la línea de la IP
#   $<C-a>         # al final de la línea y suma 1 al número: 27 -> 28
#   :w ifcfg-enp3s0<CR>   # guarda con OTRO nombre
#   :q!<CR>        # el original no se toca

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
printf '%s' $':%s/enp2s0/enp3s0/g\r/IPADDR\r$\x01:w ifcfg-enp3s0\r:q!\r' > teclas.tmp
vim -u DEFAULTS -i NONE -n -s teclas.tmp ifcfg-enp2s0
rm -f teclas.tmp
cat -n ifcfg-enp2s0
cat -n ifcfg-enp3s0
