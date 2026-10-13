/*
 * Punteros en C práctica — Programa 4: Búsqueda de máximo y mínimo con posición
 * Del artículo «Punteros en C — 4 programas reales para perderles el miedo»
 * https://sergiolearns.com/punteros-en-c-practica/
 */

#include <stdio.h>

/* Devuelve puntero al máximo elemento */
int* encontrar_maximo(int *vec, int n) {
    int *ptr;
    int *ptr_max = vec;

    for (ptr = vec + 1; ptr < vec + n; ptr++) {
        if (*ptr > *ptr_max) {
            ptr_max = ptr;
        }
    }

    return ptr_max;
}

/* Devuelve puntero al mínimo elemento */
int* encontrar_minimo(int *vec, int n) {
    int *ptr;
    int *ptr_min = vec;

    for (ptr = vec + 1; ptr < vec + n; ptr++) {
        if (*ptr < *ptr_min) {
            ptr_min = ptr;
        }
    }

    return ptr_min;
}

/* Busca un valor y devuelve puntero a él o NULL si no existe */
int* buscar_valor(int *vec, int n, int valor) {
    int *ptr;

    for (ptr = vec; ptr < vec + n; ptr++) {
        if (*ptr == valor) {
            return ptr;    /* devuelve puntero al elemento encontrado */
        }
    }

    return NULL;    /* no encontrado */
}

int main() {
    int vec[8] = {15, 8, 42, 3, 27, 19, 11, 35};
    int n = 8;
    int *resultado;
    int buscar;

    printf("Vector: ");
    int i;
    for (i = 0; i < n; i++) {
        printf("%d ", vec[i]);
    }
    printf("\n\n");

    /* Máximo con su posición */
    resultado = encontrar_maximo(vec, n);
    printf("Máximo: %d en posición %d\n",
           *resultado, (int)(resultado - vec));

    /* Mínimo con su posición */
    resultado = encontrar_minimo(vec, n);
    printf("Mínimo: %d en posición %d\n",
           *resultado, (int)(resultado - vec));

    /* Búsqueda de valor */
    printf("\n¿Qué valor buscas? ");
    scanf("%d", &buscar);

    resultado = buscar_valor(vec, n, buscar);

    if (resultado != NULL) {
        printf("Encontrado: %d en posición %d (dirección: %p)\n",
               *resultado,
               (int)(resultado - vec),
               resultado);
    } else {
        printf("%d no está en el vector\n", buscar);
    }

    return 0;
}
