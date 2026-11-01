/*
 * Solución del ejercicio 1: conversor de números a palabras
 * Del artículo «Bucles en C — ejercicios con primos, piedra-papel-tijera, un login de 3 intentos y una calculadora con menú (y el ; que dejó la lista de primos vacía)»
 * https://sergiolearns.com/bucles-en-c-ejercicios/
 */
#include <stdio.h>

int main(void) {
    int numero;
    int c;

    printf("=== CONVERSOR NÚMERO A PALABRA ===\n");

    do {
        printf("Introduce un número (1-10, 0 para salir): ");
        if (scanf("%d", &numero) != 1) {
            while ((c = getchar()) != '\n' && c != EOF);   // tira la palabra
            numero = -1;                                   // y sigue como un número malo
        }

        if (numero == 0) {
            printf("Hasta luego\n");
        } else if (numero < 0 || numero > 10) {
            printf("Error: introduce un número entre 0 y 10\n\n");
        } else {
            printf("%d -> ", numero);
            switch (numero) {
                case 1:  printf("uno\n");    break;
                case 2:  printf("dos\n");    break;
                case 3:  printf("tres\n");   break;
                case 4:  printf("cuatro\n"); break;
                case 5:  printf("cinco\n");  break;
                case 6:  printf("seis\n");   break;
                case 7:  printf("siete\n");  break;
                case 8:  printf("ocho\n");   break;
                case 9:  printf("nueve\n");  break;
                default: printf("diez\n");   break;
            }
            printf("\n");
        }
    } while (numero != 0);    // el 0 se procesa (despedida) y después corta
    return 0;
}
