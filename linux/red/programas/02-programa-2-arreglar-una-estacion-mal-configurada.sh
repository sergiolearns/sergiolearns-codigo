#!/bin/bash
# Programa 2 · Arreglar una estación mal configurada
# Del artículo «Configuración de red en Linux — práctica con una estación desde cero, otra mal configurada y un script que lee el ifcfg (y un ping que solo llegaba a medias)»
# https://sergiolearns.com/configuracion-de-red-en-linux-practica/
# Cambia la red: ejecútalo SOLO dentro del laboratorio (sudo ./laboratorio.sh mal, después sudo ip netns exec estacion bash <este archivo>)

ip -br addr                              # 1. ¿qué IP tengo?
ip route                                 # 2. ¿por dónde salgo?
ping -c 2 10.110.7.1                     # 3. ¿llego a la pasarela?
ip route get 10.110.7.1                  # 4. ¿qué camino elige el núcleo para llegar?
ip addr del 10.110.70.4/24 dev enp2s0    # fuera la IP equivocada
ip route                                 # la ruta por defecto se ha ido con ella
ip addr add 10.110.7.4/24 dev enp2s0
ip route add default via 10.110.7.1
ip route get 10.110.7.1
ping -c 2 10.110.1.1
