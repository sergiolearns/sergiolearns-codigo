/*
 * Solución Ejercicio 1:
 * Del artículo «Bucles en C — ejercicios para dominar for, while y do…while»
 * https://sergiolearns.com/bucles-en-c-ejercicios/
 */

#include <stdio.h>

int main() {
    int numero;

    printf("=== CONVERSOR NÚMERO A PALABRA ===\n");

    do {
        printf("Introduce un número (1-10, 0 para salir): ");
        scanf("%d", &numero);

        if (numero == 0) {
            printf("Hasta luego\n");
        } else if (numero < 0 || numero > 10) {
            printf("Error: introduce un número entre 0 y 10\n");
        } else {
            printf("%d → ", numero);
            switch (numero) {
                case 1:  printf("uno\n");   break;
                case 2:  printf("dos\n");   break;
                case 3:  printf("tres\n");  break;
                case 4:  printf("cuatro\n"); break;
                case 5:  printf("cinco\n"); break;
                case 6:  printf("seis\n");  break;
                case 7:  printf("siete\n"); break;
                case 8:  printf("ocho\n");  break;
                case 9:  printf("nueve\n"); break;
                case 10: printf("diez\n");  break;
            }
            printf("\n");
        }
    } while (numero != 0);

    return 0;
}
