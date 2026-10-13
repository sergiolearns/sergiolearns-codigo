/*
 * Solución Ejercicio 1:
 * Del artículo «Punteros en C — ejercicios para dominar la memoria»
 * https://sergiolearns.com/punteros-en-c-ejercicios/
 */

#include <stdio.h>

int main() {
    int vec_origen[6] = {10, 25, 8, 42, 17, 33};
    int vec_destino[6];
    int n = 6;
    int *origen, *destino;
    int i, iguales = 0;

    /* Mostrar original */
    printf("Vector original: ");
    for (origen = vec_origen; origen < vec_origen + n; origen++) {
        printf("%d ", *origen);
    }
    printf("\n\nCopiando con punteros...\n\n");

    /* Copia con dos punteros simultáneos */
    for (origen = vec_origen, destino = vec_destino;
         origen < vec_origen + n;
         origen++, destino++) {
        *destino = *origen;
    }

    /* Mostrar copia */
    printf("Vector copia:    ");
    for (destino = vec_destino; destino < vec_destino + n; destino++) {
        printf("%d ", *destino);
    }
    printf("\n\n");

    /* Verificación */
    printf("Verificación elemento a elemento:\n");
    for (i = 0; i < n; i++) {
        if (vec_origen[i] == vec_destino[i]) {
            printf("[%d] %d == %d ✓\n", i, vec_origen[i], vec_destino[i]);
            iguales++;
        } else {
            printf("[%d] %d != %d ✗\n", i, vec_origen[i], vec_destino[i]);
        }
    }
    printf("Copia correcta: %d/%d elementos iguales\n", iguales, n);

    return 0;
}
