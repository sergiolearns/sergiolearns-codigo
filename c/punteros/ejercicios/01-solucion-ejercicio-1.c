/*
 * Solución del ejercicio 1: copiar el horario con punteros
 * Del artículo «Punteros en C — ejercicios resueltos con la guagua: copiar horarios, contar viajeros, ajustar retrasos y una biblioteca de vectores (más el chuletario para el examen)»
 * https://sergiolearns.com/punteros-en-c-ejercicios/
 */
#include <stdio.h>

int main(void) {
    int horario[6] = {610, 640, 710, 740, 810, 840};   /* salidas de la línea 201 (hhmm) */
    int refuerzo[6];                                   /* vacío: aquí va la copia */
    int n = 6;
    int *o, *d;                                        /* origen y destino */
    int iguales = 0;

    printf("Horario original: ");
    for (o = horario; o < horario + n; o++)
        printf("%d ", *o);
    printf("\n\nCopiando con punteros...\n\n");

    /* dos punteros que avanzan a la vez; los dos empiezan apuntando a algo */
    for (o = horario, d = refuerzo; o < horario + n; o++, d++)
        *d = *o;

    printf("Horario refuerzo: ");
    for (d = refuerzo; d < refuerzo + n; d++)
        printf("%d ", *d);
    printf("\n\nComprobación casilla a casilla:\n");

    for (o = horario, d = refuerzo; o < horario + n; o++, d++) {
        int i = (int)(o - horario);                    /* posición = resta de punteros */
        if (*o == *d) {
            printf("[%d] %d == %d igual\n", i, *o, *d);
            iguales++;
        } else {
            printf("[%d] %d != %d DISTINTO\n", i, *o, *d);
        }
    }
    printf("Copia correcta: %d/%d casillas iguales\n", iguales, n);
    return 0;
}
