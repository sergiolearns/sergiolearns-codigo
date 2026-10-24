/*
 * Solución Ejercicio 2: el limitador de plantas
 * Del artículo «El preprocesador en C — ejercicios con el aforo de un ascensor, un limitador de plantas y un simulador con trazas (y el DEBUG 0 que no apagaba nada)»
 * https://sergiolearns.com/preprocesador-en-c-ejercicios/
 */
#include <stdio.h>

#define PLANTA_MIN (-2)
#define PLANTA_MAX 8
#define NUM_PEDIDOS 7

#define MIN(a, b) ((a) < (b) ? (a) : (b))
#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define LIMITAR(x, lo, hi) MIN(MAX((x), (lo)), (hi))   /* primero el suelo, luego el techo */
#define ABS(x) ((x) < 0 ? -(x) : (x))

int main(void) {
    int pedidos[NUM_PEDIDOS] = {5, 12, -4, 0, 8, -2, 9};
    int actual = 0, corregidos = 0, recorrido = 0;

    for (int i = 0; i < NUM_PEDIDOS; i++) {
        int pedido = pedidos[i];          /* copia: nada de pedidos[i++] dentro de la macro */
        int planta = LIMITAR(pedido, PLANTA_MIN, PLANTA_MAX);
        if (planta != pedido)
            corregidos++;
        recorrido += ABS(planta - actual);   /* plantas que se mueve la cabina */
        printf("Pedido %3d -> va a %2d%s\n", pedido, planta,
               planta != pedido ? " (corregido)" : "");
        actual = planta;
    }
    printf("Corregidos: %d | Plantas recorridas: %d\n", corregidos, recorrido);
    return 0;
}
