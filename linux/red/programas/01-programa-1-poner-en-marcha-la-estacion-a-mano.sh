#!/bin/bash
# Programa 1 · Poner en marcha la estación a mano
# Del artículo «Configuración de red en Linux — práctica con una estación desde cero, otra mal configurada y un script que lee el ifcfg (y un ping que solo llegaba a medias)»
# https://sergiolearns.com/configuracion-de-red-en-linux-practica/
# Cambia la red: ejecútalo SOLO dentro del laboratorio (sudo ./laboratorio.sh base, después sudo ip netns exec estacion bash <este archivo>)

ip -br addr                              # punto de partida
ping -c 1 10.110.7.1                     # antes de nada: ¿llego a la pasarela?
ip link set enp2s0 up                    # paso 1: encender
ip addr add 10.110.7.4/24 dev enp2s0     # paso 2: IP con su máscara
ping -c 2 10.110.7.1                     # la pasarela ya contesta
ping -c 1 10.110.1.1                     # el router todavía no
ip route add default via 10.110.7.1      # paso 3: puerta de enlace
ping -c 2 10.110.1.1                     # ahora sí
ip -br addr
ip route
