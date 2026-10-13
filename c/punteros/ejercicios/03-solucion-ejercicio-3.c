/*
 * Solución Ejercicio 3:
 * Del artículo «Punteros en C — ejercicios para dominar la memoria»
 * https://sergiolearns.com/punteros-en-c-ejercicios/
 */

#include <stdio.h>

void reemplazar_negativos(int *vec, int n, int valor) {
    int *ptr;
    for (ptr = vec; ptr < vec + n; ptr++) {
        if (*ptr < 0) {
            *ptr = valor;
        }
    }
}

void multiplicar_pares(int *vec, int n, int factor) {
    int *ptr;
    for (ptr = vec; ptr < vec + n; ptr++) {
        if (*ptr % 2 == 0) {
            *ptr *= factor;
        }
    }
}

void normalizar(int *vec, int n) {
    int *ptr;
    int minimo = *vec;

    /* Encontrar mínimo */
    for (ptr = vec + 1; ptr < vec + n; ptr++) {
        if (*ptr < minimo) minimo = *ptr;
    }

    printf("Mínimo actual: %d\n", minimo);

    /* Restar mínimo a todos */
    for (ptr = vec; ptr < vec + n; ptr++) {
        *ptr -= minimo;
    }
}

void mostrar_vector(int *vec, int n) {
    int *ptr;
    for (ptr = vec; ptr < vec + n; ptr++) {
        printf("%d ", *ptr);
    }
    printf("\n");
}

int main() {
    int vec[10] = {15, -3, 8, -12, 6, 7, -5, 22, 4, -8};
    int n = 10;

    printf("Vector inicial: ");
    mostrar_vector(vec, n);

    printf("\nReemplazando negativos por 0:\n");
    reemplazar_negativos(vec, n, 0);
    printf("Vector:         ");
    mostrar_vector(vec, n);

    printf("\nMultiplicando pares por 2:\n");
    multiplicar_pares(vec, n, 2);
    printf("Vector:         ");
    mostrar_vector(vec, n);

    printf("\nNormalizando (mínimo → 0):\n");
    normalizar(vec, n);
    printf("Vector:         ");
    mostrar_vector(vec, n);

    return 0;
}
