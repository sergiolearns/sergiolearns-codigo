# Simuladores de la tanda 3 (SergioLearns)

Tres simuladores de IC2 de [sergiolearns.com/laboratorio/simuladores/](https://sergiolearns.com/laboratorio/simuladores/), con la misma estructura que el de planificación de CPU (`../planifica/`):

| Carpeta | Simulador | Página |
|---|---|---|
| `../paginas/` | Reemplazo de páginas: FIFO, LRU y óptimo (`pagina --algoritmo lru --marcos 3`) | `/laboratorio/simuladores/reemplazo-paginas/` · `/en/lab/simulators/page-replacement/` |
| `../subredes/` | Subredes IPv4: AND bit a bit, red, difusión y hosts (`ipcalc 10.110.7.24/24`) | `/laboratorio/simuladores/subredes-ipv4/` · `/en/lab/simulators/ipv4-subnets/` |
| `../paquete/` | El viaje de un paquete: encapsulado TCP/IP u OSI y el camino por switch y routers (`envia --datos 3000 --mss 1460`) | `/laboratorio/simuladores/viaje-paquete/` · `/en/lab/simulators/packet-journey/` |

Cada uno tiene `engine.js` (el motor, también como módulo de Node), `ui.js` (la interfaz) y `test.py` (pruebas). Este directorio guarda lo común:

- `kit.js`: ventana de terminal, aspecto tinta/claro (`localStorage('sl_entorno_tema')`, el mismo que los entornos), reproductor Paso/Ejecutar, Compartir (`#sim=`) y «Ponte a prueba».
- `sim2.css`: estilos de los tres (usa las variables de `../planifica/sim.css`).
- `simuladores.tpl.php` y `build.py`: plantilla del fragmento de WordPress «SergioLearns — simuladores» (v1.1) y el script que mete dentro el JS y el CSS minificados (esbuild). Cada página carga solo el JS de su simulador.

## Pruebas
```
cd ../paginas && python3 test.py    # trazas del artículo, Belady y 5000 casos contra ref.py
cd ../subredes && python3 test.py   # 20000 casos contra el módulo ipaddress de Python
cd ../paquete && python3 test.py    # el ejemplo de 3000 B (3174 B en el cable) y 3000 casos; suma IP real
```

## Criterios
- Reemplazo: los marcos se llenan de arriba abajo; la página nueva ocupa el marco de su víctima; en el óptimo, los empates se resuelven por el orden de los marcos.
- Subredes: hosts = 2^h − 2 (con /31, 2; con /32, 1); máscaras no contiguas, rechazadas con su explicación.
- Paquete: cabeceras mínimas (TCP 20, UDP 8, IP 20, Ethernet 14 + 4 de FCS), sin preámbulo, MTU 1500, relleno hasta 46 B de carga, números de secuencia relativos; UDP que no cabe → fragmentación IP (1480 B, desplazamiento en unidades de 8 B).

Licencia: la del repositorio.
