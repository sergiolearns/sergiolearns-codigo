/*
 * Punteros en C práctica — Programa 2: Recorrido de vectores con punteros
 * Del artículo «Punteros en C — 4 programas reales para perderles el miedo»
 * https://sergiolearns.com/punteros-en-c-practica/
 */

#include <stdio.h>

int main() {
    int vec[6] = {15, 8, 42, 3, 27, 19};
    int *ptr;
    int n = 6;

    /* Recorrido hacia adelante */
    printf("Vector completo:\n");
    for (ptr = vec; ptr < vec + n; ptr++) {
        printf("%d ", *ptr);
    }
    printf("\n\n");

    /* Recorrido hacia atrás */
    printf("Vector al revés:\n");
    for (ptr = vec + n - 1; ptr >= vec; ptr--) {
        printf("%d ", *ptr);
    }
    printf("\n\n");

    /* Solo elementos en posición par */
    printf("Elementos en posición par (0,2,4):\n");
    for (ptr = vec; ptr < vec + n; ptr += 2) {
        printf("%d ", *ptr);
    }
    printf("\n\n");

    /* Mostrar dirección y valor de cada elemento */
    printf("Dirección y valor de cada elemento:\n");
    for (ptr = vec; ptr < vec + n; ptr++) {
        printf("Dirección: %p → Valor: %d\n", ptr, *ptr);
    }

    return 0;
}
