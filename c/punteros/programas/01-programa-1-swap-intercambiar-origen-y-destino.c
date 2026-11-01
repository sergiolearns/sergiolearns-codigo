/*
 * Programa 1: swap, intercambiar origen y destino
 * Del artículo «Punteros en C — práctica con 4 programas de la guagua: swap, recorridos, resumen del día y búsqueda con NULL (para perderles el miedo)»
 * https://sergiolearns.com/punteros-en-c-practica/
 */
#include <stdio.h>

/* Versión SIN punteros: recibe copias de los dos códigos */
void swap_mal(int a, int b) {
    printf("  en swap_mal, a vive en %p\n", (void *)&a);
    int temp = a;
    a = b;
    b = temp;            /* se intercambian las copias, no los originales */
}

/* Versión CON punteros: recibe las direcciones de los originales */
void swap(int *a, int *b) {
    printf("  en swap, a apunta a   %p\n", (void *)a);
    int temp = *a;       /* guardo lo que hay en la primera dirección */
    *a = *b;             /* copio el segundo encima del primero */
    *b = temp;           /* y pongo el guardado en el segundo */
}

int main(void) {
    int origen = 101, destino = 152;     /* códigos de parada: San Telmo y Teror */

    printf("Ida:    origen=%d destino=%d\n", origen, destino);
    printf("  en main, origen vive en %p\n", (void *)&origen);

    swap_mal(origen, destino);
    printf("Tras swap_mal: origen=%d destino=%d\n", origen, destino);

    swap(&origen, &destino);
    printf("Vuelta: origen=%d destino=%d\n", origen, destino);
    return 0;
}
