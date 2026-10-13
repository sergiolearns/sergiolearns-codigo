/*
 * Condicionales en C práctica — Programa 3: Calculadora con menú usando switch
 * Del artículo «Condicionales en C — 3 programas reales en gedit y Fedora»
 * https://sergiolearns.com/condicionales-en-c-practica/
 */

#include <stdio.h>

int main() {
    int opcion;
    float a, b;

    /* Menú */
    printf("=== CALCULADORA ===\n");
    printf("1. Suma\n");
    printf("2. Resta\n");
    printf("3. Multiplicación\n");
    printf("4. División\n");
    printf("5. Módulo (enteros)\n");
    printf("\nElige operación (1-5): ");
    scanf("%d", &opcion);

    /* Validación de opción */
    if (opcion < 1 || opcion > 5) {
        printf("Error: opción no válida\n");
        return 1;
    }

    /* Entrada de números */
    printf("Número A: ");
    scanf("%f", &a);
    printf("Número B: ");
    scanf("%f", &b);

    /* Operación con switch */
    printf("\n--- Resultado ---\n");

    switch (opcion) {
        case 1:
            printf("%.2f + %.2f = %.2f\n", a, b, a + b);
            break;
        case 2:
            printf("%.2f - %.2f = %.2f\n", a, b, a - b);
            break;
        case 3:
            printf("%.2f * %.2f = %.2f\n", a, b, a * b);
            break;
        case 4:
            if (b == 0) {
                printf("Error: no se puede dividir entre cero\n");
            } else {
                printf("%.2f / %.2f = %.4f\n", a, b, a / b);
            }
            break;
        case 5:
            if (b == 0) {
                printf("Error: no se puede dividir entre cero\n");
            } else {
                printf("%d %% %d = %d\n", (int)a, (int)b, (int)a % (int)b);
            }
            break;
        default:
            printf("Opción no válida\n");
            break;
    }

    return 0;
}
