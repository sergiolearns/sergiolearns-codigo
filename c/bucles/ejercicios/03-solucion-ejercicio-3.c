/*
 * Solución Ejercicio 3:
 * Del artículo «Bucles en C — ejercicios para dominar for, while y do…while»
 * https://sergiolearns.com/bucles-en-c-ejercicios/
 */

#include <stdio.h>

int main() {
    int n, x, i, es_primo, total = 0;

    do {
        printf("Hasta qué número buscar primos (2-1000): ");
        scanf("%d", &n);
        if (n < 2 || n > 1000) {
            printf("Error: introduce un número entre 2 y 1000\n");
        }
    } while (n < 2 || n > 1000);

    printf("\nPrimos hasta %d:\n", n);

    for (x = 2; x <= n; x++) {
        es_primo = 1;

        for (i = 2; i < x; i++) {
            if (x % i == 0) {
                es_primo = 0;
                break;    /* sale del bucle interno */
            }
        }

        if (es_primo) {
            printf("%d ", x);
            total++;
        }
    }

    printf("\n\nTotal de primos encontrados: %d\n", total);

    return 0;
}
