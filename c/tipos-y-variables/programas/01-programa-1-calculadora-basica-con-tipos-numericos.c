/*
 * Tipos y variables en C práctica — Programa 1: Calculadora básica con tipos numéricos
 * Del artículo «Tipos y variables en C — 3 programas reales en gedit y Fedora»
 * https://sergiolearns.com/tipos-y-variables-en-c-practica/
 */

#include <stdio.h>

int main() {
    /* Variables */
    int a, b;
    float resultado_float;
    int resultado_entero;

    /* Entrada de datos */
    printf("Introduce el primer número: ");
    scanf("%d", &a);
    printf("Introduce el segundo número: ");
    scanf("%d", &b);

    /* Operaciones */
    resultado_entero = a / b;
    resultado_float  = (float)a / b;

    /* Resultados */
    printf("\n--- Resultados con %d y %d ---\n", a, b);
    printf("Suma:              %d\n",   a + b);
    printf("Resta:             %d\n",   a - b);
    printf("Multiplicación:    %d\n",   a * b);
    printf("División entera:   %d\n",   resultado_entero);
    printf("División real:     %.4f\n", resultado_float);
    printf("Módulo (resto):    %d\n",   a % b);
    printf("a al cuadrado:     %d\n",   a * a);

    return 0;
}
