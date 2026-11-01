/*
 * Programa 2: recorrer las paradas con un puntero
 * Del artículo «Punteros en C — práctica con 4 programas de la guagua: swap, recorridos, resumen del día y búsqueda con NULL (para perderles el miedo)»
 * https://sergiolearns.com/punteros-en-c-practica/
 */
#include <stdio.h>

int main(void) {
    int subidas[6] = {15, 8, 42, 3, 27, 19};   /* viajeros que suben en cada parada */
    int n = 6;
    int *p;
    int total = 0;

    printf("Ida:    ");
    for (p = subidas; p < subidas + n; p++) {  /* de la primera a la última */
        printf("%d ", *p);
        total += *p;
    }
    printf("(total %d)\n", total);

    printf("Vuelta: ");
    for (p = subidas + n; p > subidas; p--)    /* p empieza justo detrás del final */
        printf("%d ", *(p - 1));                /* y lee la casilla anterior */
    printf("\n");

    printf("Paradas pares (0, 2, 4): ");
    for (p = subidas; p < subidas + n; p += 2) /* salta de dos en dos */
        printf("%d ", *p);
    printf("\n\n");

    for (p = subidas; p < subidas + n; p++)    /* p - subidas = número de parada */
        printf("parada %td: %p -> %d\n", p - subidas, (void *)p, *p);
    return 0;
}
