/*
 * Solución Ejercicio 4:
 * Del artículo «Bucles en C — ejercicios para dominar for, while y do…while»
 * https://sergiolearns.com/bucles-en-c-ejercicios/
 */

#include <stdio.h>

int main() {
    int opcion;
    float a, b, resultado, mayor = 0;
    char continuar;
    int operaciones = 0;
    int primera = 1;

    printf("=== CALCULADORA INTERACTIVA ===\n");

    do {
        printf("1. Suma        2. Resta\n");
        printf("3. Multiplicar 4. Dividir\n");
        printf("5. Módulo      6. Potencia\n");
        printf("0. Salir\n\n");

        do {
            printf("Operación: ");
            scanf("%d", &opcion);
            if (opcion < 0 || opcion > 6) {
                printf("Error: elige entre 0 y 6\n");
            }
        } while (opcion < 0 || opcion > 6);

        if (opcion == 0) break;

        printf("Número A: ");
        scanf("%f", &a);

        /* Validar B para división y módulo */
        do {
            printf("Número B: ");
            scanf("%f", &b);
            if ((opcion == 4 || opcion == 5) && b == 0) {
                printf("Error: no se puede dividir entre cero\n");
            }
        } while ((opcion == 4 || opcion == 5) && b == 0);

        /* Calcular */
        switch (opcion) {
            case 1:
                resultado = a + b;
                printf("%.2f + %.2f = %.2f\n\n", a, b, resultado);
                break;
            case 2:
                resultado = a - b;
                printf("%.2f - %.2f = %.2f\n\n", a, b, resultado);
                break;
            case 3:
                resultado = a * b;
                printf("%.2f * %.2f = %.2f\n\n", a, b, resultado);
                break;
            case 4:
                resultado = a / b;
                printf("%.2f / %.2f = %.4f\n\n", a, b, resultado);
                break;
            case 5:
                resultado = (int)a % (int)b;
                printf("%d %% %d = %.0f\n\n", (int)a, (int)b, resultado);
                break;
            case 6: {
                resultado = 1;
                int exp = (int)b;
                int j;
                for (j = 0; j < exp; j++) {
                    resultado *= a;
                }
                printf("%.2f ^ %d = %.2f\n\n", a, exp, resultado);
                break;
            }
        }

        operaciones++;

        /* Actualizar mayor resultado */
        if (primera || resultado > mayor) {
            mayor = resultado;
            primera = 0;
        }

        printf("¿Otra operación? (s/n): ");
        scanf(" %c", &continuar);
        printf("\n");

    } while (continuar == 's');

    printf("--- Resumen ---\n");
    printf("Operaciones realizadas: %d\n", operaciones);
    if (operaciones > 0) {
        printf("Mayor resultado obtenido: %.2f\n", mayor);
    }

    return 0;
}
