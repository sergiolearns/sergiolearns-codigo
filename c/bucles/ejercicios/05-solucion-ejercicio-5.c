/*
 * Solución del ejercicio 5: calculadora interactiva completa
 * Del artículo «Bucles en C — ejercicios con primos, piedra-papel-tijera, un login de 3 intentos y una calculadora con menú (y el ; que dejó la lista de primos vacía)»
 * https://sergiolearns.com/bucles-en-c-ejercicios/
 */
#include <stdio.h>

int main(void) {
    int opcion;
    float a, b, resultado = 0, mayor = 0;
    char otra = 'n';
    int operaciones = 0;
    int exp, j;
    int c;

    printf("=== CALCULADORA INTERACTIVA ===\n");

    do {
        printf("\n1. Suma        2. Resta\n");
        printf("3. Multiplicar 4. Dividir\n");
        printf("5. Módulo      6. Potencia\n");
        printf("0. Salir\n");

        do {                                  // opción válida
            printf("Operación: ");
            if (scanf("%d", &opcion) != 1) {
                while ((c = getchar()) != '\n' && c != EOF);
                opcion = -1;
            }
            if (opcion < 0 || opcion > 6) {
                printf("Error: elige entre 0 y 6\n");
            }
        } while (opcion < 0 || opcion > 6);

        if (opcion == 0) {
            break;                            // sale del do...while principal
        }

        printf("Número A: ");
        scanf("%f", &a);
        do {                                  // B no puede ser 0 al dividir
            printf("Número B: ");
            scanf("%f", &b);
            if ((opcion == 4 || opcion == 5) && b == 0) {
                printf("Error: no se puede dividir entre cero\n");
            }
        } while ((opcion == 4 || opcion == 5) && b == 0);

        switch (opcion) {
            case 1: resultado = a + b; printf("%.2f + %.2f = %.2f\n", a, b, resultado); break;
            case 2: resultado = a - b; printf("%.2f - %.2f = %.2f\n", a, b, resultado); break;
            case 3: resultado = a * b; printf("%.2f * %.2f = %.2f\n", a, b, resultado); break;
            case 4: resultado = a / b; printf("%.2f / %.2f = %.4f\n", a, b, resultado); break;
            case 5:
                resultado = (int)a % (int)b;  // % solo con enteros
                printf("%d %% %d = %.0f\n", (int)a, (int)b, resultado);
                break;
            default:
                exp = (int)b;
                resultado = 1;                // acumulador de producto: empieza en 1
                for (j = 0; j < exp; j++) {
                    resultado *= a;
                }
                printf("%.2f ^ %d = %.2f\n", a, exp, resultado);
                break;
        }

        operaciones++;
        if (operaciones == 1 || resultado > mayor) {
            mayor = resultado;                // la primera siempre es la mayor por ahora
        }

        printf("¿Otra operación? (s/n): ");
        scanf(" %c", &otra);
    } while (otra == 's' || otra == 'S');

    printf("\n--- Resumen ---\n");
    printf("Operaciones realizadas: %d\n", operaciones);
    if (operaciones > 0) {
        printf("Mayor resultado obtenido: %.2f\n", mayor);
    }
    return 0;
}
