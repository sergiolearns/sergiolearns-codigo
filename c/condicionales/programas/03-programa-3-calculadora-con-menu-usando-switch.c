/*
 * Programa 3: calculadora con menú usando switch
 * Del artículo «Condicionales en C — práctica con un clasificador de notas, un adivino de un solo intento y una calculadora con switch (y el punto y coma que me suspendió con un 7,5)»
 * https://sergiolearns.com/condicionales-en-c-practica/
 */

#include <stdio.h>

int main(void) {
    int opcion;
    float a, b;

    printf("=== CALCULADORA ===\n");
    printf("1. Suma\n");
    printf("2. Resta\n");
    printf("3. Multiplicación\n");
    printf("4. División\n");
    printf("5. Módulo (enteros)\n");
    printf("\nElige operación (1-5): ");
    scanf("%d", &opcion);

    // Validamos ANTES de pedir los números: si la opción no existe, no hace falta seguir
    if (opcion < 1 || opcion > 5) {
        printf("Error: opción no válida\n");
        return 1;
    }

    printf("Número A: ");
    scanf("%f", &a);
    printf("Número B: ");
    scanf("%f", &b);

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
            if (b == 0) {            // un if dentro de un case: se pueden anidar sin límite
                printf("Error: no se puede dividir entre cero\n");
            } else {
                printf("%.2f / %.2f = %.4f\n", a, b, a / b);
            }
            break;
        case 5:
            // % solo funciona con enteros: (int) trunca, así que 0.5 se convierte en 0.
            // Por eso miramos (int)b y no b: es el número entre el que de verdad dividimos
            if ((int)b == 0) {
                printf("Error: el módulo entre cero no existe\n");
            } else {
                printf("%d %% %d = %d\n", (int)a, (int)b, (int)a % (int)b);   // %% imprime un %
            }
            break;
        default:                     // ya validamos arriba, pero si amplías el menú te salva
            printf("Opción no válida\n");
            break;
    }
    return 0;
}
