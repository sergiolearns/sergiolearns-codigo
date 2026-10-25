#!/bin/bash
# Solución del Nivel 3 · Genera el ifcfg de lo que hay (ficha-ifcfg.sh)
# Del artículo «Configuración de red en Linux — ejercicios con la ficha de la estación, órdenes de ifconfig traducidas y un ifcfg generado (y el /32 que dejó sola a la tarjeta)»
# https://sergiolearns.com/configuracion-de-red-en-linux-ejercicios/
# Uso: ./03-solucion-del-nivel-3.sh enp2s0 > ifcfg-generado   (solo mira, no cambia nada)

# ficha-ifcfg.sh: escribe el ifcfg que reproduciría la configuración que la tarjeta tiene AHORA
# Uso: ./ficha-ifcfg.sh enp2s0 > ifcfg-generado
dev=$1
cidr=$(ip -br -4 addr show dev "$dev" | awk '{print $3}')   # tercera columna: 10.110.7.4/24
ip=${cidr%/*}                                               # lo de antes de la barra
p=${cidr#*/}                                                # lo de después de la barra
gw=$(ip route show default | awk '{print $3}')              # "default via 10.110.7.1 dev …": tercera palabra

mascara() {                          # 24 -> 255.255.255.0: cuatro bytes, cada uno con hasta 8 bits a 1
    local p=$1 m="" i b
    for i in 1 2 3 4; do
        if [ "$p" -ge 8 ]; then b=255; p=$((p - 8))   # byte lleno
        else b=$((256 - 2 ** (8 - p))); p=0           # byte a medias (o 0 si ya no quedan bits)
        fi
        m="$m$b"; [ $i -lt 4 ] && m="$m."
    done
    echo "$m"
}

echo "DEVICE=$dev"
echo "BOOTPROTO=none"
echo "ONBOOT=yes"
echo "IPADDR=$ip"
echo "NETMASK=$(mascara "$p")"
[ -n "$gw" ] && echo "GATEWAY=$gw"   # sin ruta por defecto, no se escribe la línea
