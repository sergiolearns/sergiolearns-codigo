#!/bin/bash
# Solución del Nivel 2 · De ifconfig a ip
# Del artículo «Configuración de red en Linux — ejercicios con la ficha de la estación, órdenes de ifconfig traducidas y un ifcfg generado (y el /32 que dejó sola a la tarjeta)»
# https://sergiolearns.com/configuracion-de-red-en-linux-ejercicios/
# Cambia la red: ejecútalo SOLO dentro del laboratorio (sudo ./laboratorio.sh base, después sudo ip netns exec estacion bash <este archivo>)

ip link set enp2s0 up                            # ifconfig enp2s0 up
ip addr add 10.110.7.5/24 brd + dev enp2s0       # ifconfig enp2s0 10.110.7.5 netmask 255.255.255.0 broadcast 10.110.7.255
ip route add default via 10.110.7.1              # route add default gw 10.110.7.1
ip addr show enp2s0
route -n                                         # comprobación con la orden vieja
ping -c 2 10.110.1.1
