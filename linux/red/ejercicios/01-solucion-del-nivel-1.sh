#!/bin/bash
# Solución del Nivel 1 · La ficha de la estación
# Del artículo «Configuración de red en Linux — ejercicios con la ficha de la estación, órdenes de ifconfig traducidas y un ifcfg generado (y el /32 que dejó sola a la tarjeta)»
# https://sergiolearns.com/configuracion-de-red-en-linux-ejercicios/
# Solo mira: puedes ejecutarlo en tu ordenador (cambia enp2s0 por tu tarjeta) o en el laboratorio (estado conf)

ip -br link show enp2s0                  # la MAC
ip -br addr show enp2s0                  # la IP y el prefijo
ip route show default                    # la puerta de enlace
head -1 /etc/resolv.conf                 # el primer servidor DNS
