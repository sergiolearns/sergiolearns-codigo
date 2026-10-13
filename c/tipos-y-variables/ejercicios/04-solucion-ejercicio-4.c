/*
 * Solución Ejercicio 4:
 * Del artículo «Tipos y variables en C — ejercicios para dominar printf, scanf y operadores»
 * https://sergiolearns.com/tipos-y-variables-en-c-ejercicios/
 */

#include <stdio.h>

int main() {
    int a, b;

    printf("=== CALCULADORA CIENTÍFICA ===\n");
    printf("Número A: ");
    scanf("%d", &a);    /* & obligatorio */
    printf("Número B: ");
    scanf("%d", &b);    /* & obligatorio */

    printf("\n--- Operaciones básicas ---\n");
    printf("A + B  = %d\n",     a + b);
    printf("A - B  = %d\n",     a - b);
    printf("A * B  = %d\n",     a * b);
    printf("A / B  = %d\n",     a / b);
    printf("A / B  = %.4f\n",   (float)a / b);
    printf("A %% B  = %d\n",    a % b);

    printf("\n--- Potencias y raíces ---\n");
    printf("A²     = %d\n",     a * a);
    printf("B²     = %d\n",     b * b);
    printf("A³     = %d\n",     a * a * a);

    printf("\n--- Información de tipos ---\n");
    printf("A como int:    %d\n",   a);
    printf("A como float:  %f\n",   (float)a);
    printf("A como hex:    %x\n",   a);
    printf("A como octal:  %o\n",   a);
    printf("sizeof(int):   %lu bytes\n",   sizeof(int));
    printf("sizeof(float): %lu bytes\n",   sizeof(float));

    printf("\n--- Comparaciones ---\n");
    printf("A > B:  %d\n",  (a > b));
    printf("A == B: %d\n",  (a == b));
    printf("A != B: %d\n",  (a != b));

    return 0;
}
