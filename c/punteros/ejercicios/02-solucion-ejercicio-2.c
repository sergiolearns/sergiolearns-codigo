/*
 * Solución Ejercicio 2:
 * Del artículo «Punteros en C — ejercicios para dominar la memoria»
 * https://sergiolearns.com/punteros-en-c-ejercicios/
 */

#include <stdio.h>

int main() {
    int vec[8];
    int n = 8;
    int *ptr;
    int i;
    int positivos = 0, negativos = 0, ceros = 0;
    int pares = 0, impares = 0, mayores_media = 0;
    int suma = 0;
    float media;

    /* Lectura con validación */
    printf("Introduce 8 números:\n");
    for (i = 0; i < n; i++) {
        printf("Número %d: ", i + 1);
        scanf("%d", &vec[i]);
    }

    /* Mostrar vector */
    printf("\nVector: ");
    for (ptr = vec; ptr < vec + n; ptr++) {
        printf("%d ", *ptr);
    }
    printf("\n\n--- Estadísticas ---\n");

    /* Calcular suma para la media */
    for (ptr = vec; ptr < vec + n; ptr++) {
        suma += *ptr;
    }
    media = (float)suma / n;

    /* Contar con punteros */
    printf("Positivos:         ");
    for (ptr = vec; ptr < vec + n; ptr++) {
        if (*ptr > 0) { positivos++; printf("%d ", *ptr); }
    }
    printf("(%d)\n", positivos);

    printf("Negativos:         ");
    for (ptr = vec; ptr < vec + n; ptr++) {
        if (*ptr < 0) { negativos++; printf("%d ", *ptr); }
    }
    printf("(%d)\n", negativos);

    for (ptr = vec; ptr < vec + n; ptr++) {
        if (*ptr == 0) ceros++;
    }
    printf("Ceros:             %d\n", ceros);

    printf("Pares:             ");
    for (ptr = vec; ptr < vec + n; ptr++) {
        if (*ptr % 2 == 0) { pares++; printf("%d ", *ptr); }
    }
    printf("(%d)\n", pares);

    printf("Impares:           ");
    for (ptr = vec; ptr < vec + n; ptr++) {
        if (*ptr % 2 != 0) { impares++; printf("%d ", *ptr); }
    }
    printf("(%d)\n", impares);

    printf("Media:             %.2f\n", media);

    printf("Mayores que media: ");
    for (ptr = vec; ptr < vec + n; ptr++) {
        if (*ptr > media) { mayores_media++; printf("%d ", *ptr); }
    }
    printf("(%d)\n", mayores_media);

    return 0;
}
