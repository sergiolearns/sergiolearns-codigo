/*
 * Solución del ejercicio 3: números primos hasta n
 * Del artículo «Bucles en C — ejercicios con primos, piedra-papel-tijera, un login de 3 intentos y una calculadora con menú (y el ; que dejó la lista de primos vacía)»
 * https://sergiolearns.com/bucles-en-c-ejercicios/
 */
#include <stdio.h>

int main(void) {
    int n, x, i;
    int es_primo;
    int total = 0;
    int pruebas = 0;             // cuántas divisiones hemos hecho en total
    int c;

    do {
        printf("Hasta qué número buscar primos (2-1000): ");
        if (scanf("%d", &n) != 1) {
            while ((c = getchar()) != '\n' && c != EOF);
            n = 0;
        }
        if (n < 2 || n > 1000) {
            printf("Error: introduce un número entre 2 y 1000\n");
        }
    } while (n < 2 || n > 1000);

    printf("\nPrimos hasta %d:\n", n);

    for (x = 2; x <= n; x++) {            // cada candidato
        es_primo = 1;                     // inocente hasta que se demuestre lo contrario
        for (i = 2; i * i <= x; i++) {    // basta probar hasta la raíz de x
            pruebas++;
            if (x % i == 0) {
                es_primo = 0;
                break;                    // ya hay un divisor: no hace falta seguir
            }
        }
        if (es_primo) {
            printf("%d ", x);
            total++;
        }
    }

    printf("\n\nTotal de primos encontrados: %d\n", total);
    printf("Divisiones hechas: %d\n", pruebas);
    return 0;
}
