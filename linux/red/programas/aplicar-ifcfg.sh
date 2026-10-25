#!/bin/bash
# Script del programa 3 · aplicar-ifcfg.sh
# Del artículo «Configuración de red en Linux — práctica con una estación desde cero, otra mal configurada y un script que lee el ifcfg (y un ping que solo llegaba a medias)»
# https://sergiolearns.com/configuracion-de-red-en-linux-practica/

# aplicar-ifcfg.sh: hace a mano lo que el servicio network de CentOS hace al arrancar con cada ifcfg
# Uso: ./aplicar-ifcfg.sh ifcfg-enp2s0
source "$1"                          # cada línea CLAVE=valor del ifcfg se convierte en una variable

if [ "$ONBOOT" != "yes" ]; then      # ONBOOT=no: al arrancar, nadie toca esta tarjeta
    echo "$DEVICE: ONBOOT=$ONBOOT, no se activa"
    exit 0
fi
if [ "$BOOTPROTO" = "dhcp" ]; then   # con DHCP la IP la da un servidor (dhclient), no el archivo
    echo "$DEVICE: BOOTPROTO=dhcp, la IP la pide dhclient"
    exit 0
fi

prefijo() {                          # 255.255.255.0 -> 24: suma los bits a 1 de cada byte de la máscara
    local n=0 b
    for b in ${1//./ }; do           # ${1//./ } cambia los puntos por espacios: cuatro números
        case $b in
            255) n=$((n + 8)) ;; 254) n=$((n + 7)) ;; 252) n=$((n + 6)) ;; 248) n=$((n + 5)) ;;
            240) n=$((n + 4)) ;; 224) n=$((n + 3)) ;; 192) n=$((n + 2)) ;; 128) n=$((n + 1)) ;;
        esac                         # 0 no suma nada
    done
    echo $n
}

p=$(prefijo "$NETMASK")
ip link set "$DEVICE" up                       # 1. encender la tarjeta
ip addr add "$IPADDR/$p" dev "$DEVICE"         # 2. la IP CON su prefijo (sin él sería /32)
echo "$DEVICE: $IPADDR/$p"
if [ -n "$GATEWAY" ]; then                     # 3. la ruta por defecto, solo si hay GATEWAY
    ip route add default via "$GATEWAY"
    echo "$DEVICE: puerta de enlace $GATEWAY"
fi
