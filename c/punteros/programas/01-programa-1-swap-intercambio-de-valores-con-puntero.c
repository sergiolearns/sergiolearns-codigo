/*
 * Punteros en C práctica — Programa 1: Swap: intercambio de valores con punteros
 * Del artículo «Punteros en C — 4 programas reales para perderles el miedo»
 * https://sergiolearns.com/punteros-en-c-practica/
 */

#include <stdio.h>

/* Versión SIN punteros — no funciona */
void swap_mal(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
    /* a y b son copias locales — los originales no cambian */
}

/* Versión CON punteros — funciona */
void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 10, y = 20;

    printf("Antes del swap: x=%d, y=%d\n", x, y);

    swap_mal(x, y);
    printf("Después de swap_mal: x=%d, y=%d\n", x, y);

    swap(&x, &y);
    printf("Después de swap: x=%d, y=%d\n", x, y);

    return 0;
}
