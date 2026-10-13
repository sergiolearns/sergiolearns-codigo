/*
 * Solución Ejercicio 3:
 * Del artículo «Funciones en C — ejercicios para dominar el paso por referencia»
 * https://sergiolearns.com/funciones-en-c-ejercicios/
 */

#include <stdio.h>

#define MAX 200

/* Prototipos */
void fusionar(int a[], int na, int b[], int nb,
              int resultado[], int *nr);
void ordenar(int vec[], int n);
void intercambiar(int *a, int *b);
void mostrar_array(int vec[], int n);

int main(void) {
    int a[5] = {3, 7, 11, 15, 22};
    int b[7] = {1, 5, 9, 12, 18, 25, 30};
    int resultado[MAX];
    int nr;

    /* Caso normal */
    printf("Array A (ordenado): "); mostrar_array(a, 5);
    printf("Array B (ordenado): "); mostrar_array(b, 7);
    fusionar(a, 5, b, 7, resultado, &nr);
    printf("Fusionados: "); mostrar_array(resultado, nr);
    printf("Longitud resultado: %d\n\n", nr);

    /* Caso con repetidos */
    int c[4] = {2, 4, 6, 8};
    int d[5] = {3, 4, 7, 8, 9};
    printf("Caso con repetidos:\n");
    printf("Array A: "); mostrar_array(c, 4);
    printf("Array B: "); mostrar_array(d, 5);
    fusionar(c, 4, d, 5, resultado, &nr);
    printf("Fusionados: "); mostrar_array(resultado, nr);
    printf("Longitud resultado: %d\n\n", nr);

    /* Caso vacío */
    int e[3] = {1, 3, 5};
    int f[1] = {0};    /* array vacío — na=0 */
    printf("Caso vacío:\n");
    printf("Array A: "); mostrar_array(e, 3);
    printf("Array B: (vacío)\n");
    fusionar(e, 3, f, 0, resultado, &nr);
    printf("Fusionados: "); mostrar_array(resultado, nr);
    printf("Longitud resultado: %d\n", nr);

    return 0;
}

void fusionar(int a[], int na, int b[], int nb,
              int resultado[], int *nr) {
    int i = 0, j = 0, k = 0;

    /* Mientras ambos arrays tengan elementos */
    while (i < na && j < nb) {
        if (a[i] <= b[j]) {
            resultado[k++] = a[i++];    /* toma de A */
        } else {
            resultado[k++] = b[j++];    /* toma de B */
        }
    }

    /* Copiar el resto de A si queda algo */
    while (i < na)
        resultado[k++] = a[i++];

    /* Copiar el resto de B si queda algo */
    while (j < nb)
        resultado[k++] = b[j++];

    *nr = k;    /* tamaño del resultado por referencia */
}

void intercambiar(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void ordenar(int vec[], int n) {
    int i, j;
    for (i = 0; i < n - 1; i++)
        for (j = 0; j < n - i - 1; j++)
            if (vec[j] > vec[j + 1])
                intercambiar(&vec[j], &vec[j + 1]);
}

void mostrar_array(int vec[], int n) {
    int i;
    for (i = 0; i < n; i++) printf("%d ", vec[i]);
    printf("\n");
}
