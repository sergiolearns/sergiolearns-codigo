# Compruébalo con Python · Simulador de encapsulado: la práctica que baja por TCP/IP
# Del artículo «Modelos OSI y TCP/IP — teoría con capas, sobres dentro de sobres y un switch que no sabe tu IP (y la práctica que subí a las 23:57)»
# https://sergiolearns.com/modelos-osi-y-tcp-ip/

# Simulador de encapsulado: entregar la práctica de IC2 en el campus virtual
# Cada capa de TCP/IP envuelve lo que le da la de arriba con su propia cabecera.

DATOS = 3000                          # bytes que la aplicación (HTTPS) quiere enviar
MSS = 1460                            # máximo de datos por segmento TCP sobre Ethernet
CAB_TCP, CAB_IP, CAB_ETH = 20, 20, 18  # cabeceras mínimas; Ethernet = 14 + 4 de FCS

origen = {"puerto": 51234, "ip": "10.110.7.24", "mac": "3c:52:82:1a:7e:04"}
destino = {"puerto": 443, "ip": "10.200.1.80"}
mac_salto = "00:1b:21:aa:10:01"       # la MAC del router de la facultad, NO la del servidor

# Transporte: trocea los datos en fragmentos de como mucho MSS bytes
trozos, resto = [], DATOS
while resto > 0:
    trozos.append(min(MSS, resto))    # el último trozo se lleva lo que sobre
    resto -= trozos[-1]

print(f"Datos de aplicación: {DATOS} B -> {len(trozos)} segmentos")
print(f"{'Nº':>2} {'sec':>5} {'datos':>6} {'segmento':>9} {'datagrama':>10} {'trama':>6} {'bits':>6}")
total, sec = 0, 1                     # sec = número de secuencia (primer byte del trozo)
for n, datos in enumerate(trozos, start=1):
    segmento = datos + CAB_TCP        # + puertos, nº de secuencia y código de error
    datagrama = segmento + CAB_IP     # + IP de origen y de destino
    trama = datagrama + CAB_ETH       # + MAC de origen y del siguiente salto
    print(f"{n:>2} {sec:>5} {datos:>6} {segmento:>9} {datagrama:>10} {trama:>6} {trama * 8:>6}")
    total += trama
    sec += datos                      # el siguiente trozo empieza donde acabó este

extra = total - DATOS
print(f"Bytes en el cable: {total} (cabeceras: {extra} B, {100 * extra / total:.1f} %)")
print(f"Puerto: {origen['puerto']} -> {destino['puerto']}  (lo mira el servidor: ¿qué servicio?)")
print(f"IP:     {origen['ip']} -> {destino['ip']}  (lo mira el router: ¿qué red?)")
print(f"MAC:    {origen['mac']} -> {mac_salto}  (lo mira el switch: ¿qué puerto de la LAN?)")
