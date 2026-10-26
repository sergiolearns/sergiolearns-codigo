/*
 * Programa 1: calculadora básica con tipos numéricos
 * Del artículo «Tipos y variables en C — práctica con una calculadora, la nota final de IC2 y una ficha con la letra del DNI (y la división entre cero que mata el programa)»
 * https://sergiolearns.com/tipos-y-variables-en-c-practica/
 */

#include <stdio.h>

int main(void) {
    int a, b;                   /* los dos números que llegan por teclado */
    int resultado_entero;       /* aquí cabe la división entera */
    float resultado_real;       /* y aquí la de verdad, con decimales */

    printf("Introduce el primer número: ");
    scanf("%d", &a);            /* & = "guárdalo en la dirección de a" */
    printf("Introduce el segundo número: ");
    scanf("%d", &b);

    resultado_entero = a / b;            /* int / int: se tiran los decimales */
    resultado_real = (float)a / b;       /* convierte a ANTES de dividir */

    printf("\n--- Resultados con %d y %d ---\n", a, b);
    printf("Suma:              %d\n", a + b);
    printf("Resta:             %d\n", a - b);
    printf("Multiplicación:    %d\n", a * b);
    printf("División entera:   %d\n", resultado_entero);
    printf("División real:     %.4f\n", resultado_real);
    printf("Módulo (resto):    %d\n", a % b);
    printf("Comprobación:      %d * %d + %d = %d\n", b, resultado_entero, a % b, b * resultado_entero + a % b);
    printf("a al cuadrado:     %d\n", a * a);   /* en C no hay **: se multiplica */
    return 0;
}
