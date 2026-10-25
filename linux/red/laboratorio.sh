#!/bin/bash
# Laboratorio aislado de los artículos de configuración de red en Linux (sergiolearns.com):
# estacion:enp2s0 <-> pasarela:enp2s0 (10.110.7.1/24) · pasarela:enp3s0 (10.110.1.7/24) <-> router:enp2s0 (10.110.1.1/24)
# Usa network namespaces y tarjetas virtuales: la red real de tu ordenador no se toca.
# Uso: sudo ./laboratorio.sh base|conf|mal     (base: estación apagada y sin IP; conf: configurada; mal: IP 10.110.70.4)
#      sudo ./laboratorio.sh borrar
set -e
ip -all netns delete 2>/dev/null || true
rm -rf /etc/netns/estacion
[ "$1" = borrar ] && exit 0
for ns in estacion pasarela router; do ip netns add $ns; ip -n $ns link set lo up; done
ip link add va type veth peer name vb; ip link add vc type veth peer name vd
ip link set va netns estacion; ip -n estacion link set va name enp2s0; ip -n estacion link set enp2s0 address 08:00:27:a1:07:04
ip link set vb netns pasarela; ip -n pasarela link set vb name enp2s0; ip -n pasarela link set enp2s0 address 08:00:27:a1:07:01
ip link set vc netns pasarela; ip -n pasarela link set vc name enp3s0; ip -n pasarela link set enp3s0 address 08:00:27:b1:01:07
ip link set vd netns router; ip -n router link set vd name enp2s0; ip -n router link set enp2s0 address 08:00:27:b1:01:01
ip -n pasarela addr add 10.110.7.1/24 dev enp2s0; ip -n pasarela addr add 10.110.1.7/24 dev enp3s0
ip -n pasarela link set enp2s0 up; ip -n pasarela link set enp3s0 up; ip -n pasarela route add default via 10.110.1.1
ip -n router addr add 10.110.1.1/24 dev enp2s0; ip -n router link set enp2s0 up; ip -n router route add 10.110.7.0/24 via 10.110.1.7
ip netns exec pasarela sysctl -qw net.ipv4.ip_forward=1
case "$1" in
    conf) ip -n estacion addr add 10.110.7.4/24 dev enp2s0; ip -n estacion link set enp2s0 up; ip -n estacion route add default via 10.110.7.1 ;;
    mal)  ip -n estacion addr add 10.110.70.4/24 dev enp2s0; ip -n estacion link set enp2s0 up; ip -n estacion route add default via 10.110.70.1 ;;
esac
mkdir -p /etc/netns/estacion          # ip netns exec monta estos dos archivos encima de /etc/resolv.conf y /etc/hosts
printf 'nameserver 193.145.147.22\nnameserver 193.145.138.100\nnameserver 193.145.138.200\n' > /etc/netns/estacion/resolv.conf
printf '127.0.0.1 localhost\n10.110.7.4 estacion\n10.110.7.1 pasarela\n10.110.1.1 router\n' > /etc/netns/estacion/hosts
echo "Laboratorio listo ($1). Entra en la estación con: sudo ip netns exec estacion bash"
