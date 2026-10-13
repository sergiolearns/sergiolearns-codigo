/*
 * Solución Ejercicio 1:
 * Del artículo «Funciones en C — ejercicios para dominar el paso por referencia»
 * https://sergiolearns.com/funciones-en-c-ejercicios/
 */

#include <stdio.h>

/* Prototipos */
int maximo(int vec[], int n);
int segundo_maximo(int vec[], int n);
void mostrar_array(int vec[], int n);

int main(void) {
    int a[8] = {42, 7, 19, 85, 26, 85, 54, 13};
    int b[4] = {10, 10, 10, 10};
    int c[2] = {5, 3};
    int segundo;

    /* Array A */
    printf("Array: "); mostrar_array(a, 8);
    printf("Máximo:         %d\n", maximo(a, 8));
    segundo = segundo_maximo(a, 8);
    if (segundo == -1)
        printf("Segundo máximo: no existe\n\n");
    else
        printf("Segundo máximo: %d\n\n", segundo);

    /* Array B — todos iguales */
    printf("Array: "); mostrar_array(b, 4);
    printf("Máximo:         %d\n", maximo(b, 4));
    segundo = segundo_maximo(b, 4);
    if (segundo == -1)
        printf("Segundo máximo: no existe (todos los elementos son iguales)\n\n");
    else
        printf("Segundo máximo: %d\n\n", segundo);

    /* Array C — dos elementos */
    printf("Array: "); mostrar_array(c, 2);
    printf("Máximo:         %d\n", maximo(c, 2));
    segundo = segundo_maximo(c, 2);
    if (segundo == -1)
        printf("Segundo máximo: no existe\n\n");
    else
        printf("Segundo máximo: %d\n\n", segundo);

    return 0;
}

int maximo(int vec[], int n) {
    int i, max = vec[0];
    for (i = 1; i < n; i++)
        if (vec[i] > max) max = vec[i];
    return max;
}

int segundo_maximo(int vec[], int n) {
    int i;
    int max = maximo(vec, n);    /* primero encontramos el máximo */
    int segundo = -1;            /* -1 = no encontrado todavía */

    /* buscamos el mayor valor estrictamente menor que max */
    for (i = 0; i < n; i++) {
        if (vec[i] < max) {      /* solo valores distintos del máximo */
            if (segundo == -1 || vec[i] > segundo)
                segundo = vec[i];
        }
    }
    return segundo;    /* -1 si no existe segundo máximo */
}

void mostrar_array(int vec[], int n) {
    int i;
    for (i = 0; i < n; i++) printf("%d ", vec[i]);
    printf("\n");
}
