/*
 * Programa 4: buscar una parada y volver con NULL
 * Del artículo «Punteros en C — práctica con 4 programas de la guagua: swap, recorridos, resumen del día y búsqueda con NULL (para perderles el miedo)»
 * https://sergiolearns.com/punteros-en-c-practica/
 */
#include <stdio.h>

/* Devuelve la DIRECCIÓN de la espera más larga */
int *encontrar_maximo(int *v, int n) {
    int *mejor = v;
    for (int *p = v + 1; p < v + n; p++)
        if (*p > *mejor)
            mejor = p;               /* me quedo con la dirección, no con el valor */
    return mejor;
}

/* Devuelve la dirección de la espera más corta */
int *encontrar_minimo(int *v, int n) {
    int *mejor = v;
    for (int *p = v + 1; p < v + n; p++)
        if (*p < *mejor)
            mejor = p;
    return mejor;
}

/* Busca un código de parada: su dirección, o NULL si no está */
int *buscar(int *v, int n, int valor) {
    for (int *p = v; p < v + n; p++)
        if (*p == valor)
            return p;                /* encontrado: salgo ya */
    return NULL;                     /* recorrí todo y no estaba */
}

int main(void) {
    int codigos[8] = {101, 104, 112, 118, 125, 131, 140, 152};
    int esperas[8] = {4, 9, 2, 12, 6, 3, 15, 7};        /* minutos de espera en cada parada */
    int n = 8;
    int *r;
    int buscado;

    r = encontrar_maximo(esperas, n);
    int i = (int)(r - esperas);                         /* resta de punteros = posición */
    printf("Espera más larga: %d min en la parada %d (posición %d)\n", *r, codigos[i], i);

    r = encontrar_minimo(esperas, n);
    i = (int)(r - esperas);
    printf("Espera más corta: %d min en la parada %d (posición %d)\n", *r, codigos[i], i);

    printf("\n¿Qué parada buscas? ");
    if (scanf("%d", &buscado) != 1) {                   /* si no es un número, paro */
        printf("Eso no es un código de parada\n");
        return 1;
    }

    r = buscar(codigos, n, buscado);
    if (r != NULL)                                      /* SIEMPRE antes de usar *r */
        printf("La %d es la parada %d de la línea (%p)\n", *r, (int)(r - codigos), (void *)r);
    else
        printf("La %d no está en la línea 201\n", buscado);
    return 0;
}
