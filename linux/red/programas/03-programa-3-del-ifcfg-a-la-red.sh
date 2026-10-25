#!/bin/bash
# Programa 3 · Del ifcfg a la red, con un script
# Del artículo «Configuración de red en Linux — práctica con una estación desde cero, otra mal configurada y un script que lee el ifcfg (y un ping que solo llegaba a medias)»
# https://sergiolearns.com/configuracion-de-red-en-linux-practica/
# Cambia la red: ejecútalo SOLO dentro del laboratorio (sudo ./laboratorio.sh base, después sudo ip netns exec estacion bash <este archivo>)
# Necesita aplicar-ifcfg.sh, ifcfg-enp2s0 e ifcfg-enp3s0 en la misma carpeta

cat -n ifcfg-enp2s0
cat -n ifcfg-enp3s0
./aplicar-ifcfg.sh ifcfg-enp3s0          # ONBOOT=no
./aplicar-ifcfg.sh ifcfg-enp2s0          # ONBOOT=yes
ip -br addr
ip route
ping -c 2 router
