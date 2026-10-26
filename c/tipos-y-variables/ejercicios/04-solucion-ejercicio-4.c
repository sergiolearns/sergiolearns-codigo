/*
 * Solución del ejercicio 4: calculadora científica básica
 * Del artículo «Tipos y variables en C — ejercicios de figuras, IMC, bases y una calculadora científica (y el scanf sin & que acaba en Segmentation fault)»
 * https://sergiolearns.com/tipos-y-variables-en-c-ejercicios/
 */

#include <stdio.h>

int main(void) {
    int a, b;

    printf("=== CALCULADORA CIENTÍFICA ===\n");
    printf("Número A: ");
    scanf("%d", &a);            /* & en los dos: si falta en uno, el programa puede romper */
    printf("Número B: ");
    scanf("%d", &b);

    printf("\n--- Operaciones básicas ---\n");
    printf("A + B  = %d\n", a + b);
    printf("A - B  = %d\n", a - b);
    printf("A * B  = %d\n", a * b);
    printf("A / B  = %-6d (división entera)\n", a / b);   /* %-6d: 6 de ancho, a la izquierda */
    printf("A / B  = %.4f (división real)\n", (float)a / b);
    printf("A %% B  = %-6d (módulo/resto)\n", a % b);      /* %% escribe un % */

    printf("\n--- Potencias ---\n");
    printf("A²     = %d\n", a * a);
    printf("B²     = %d\n", b * b);
    printf("A³     = %d\n", a * a * a);

    printf("\n--- Información de tipos ---\n");
    printf("A como int:    %d\n", a);
    printf("A como float:  %f\n", (float)a);     /* el cast hace que %f reciba un float */
    printf("A como hex:    %x\n", a);
    printf("A como octal:  %o\n", a);
    printf("sizeof(int):   %zu bytes\n", sizeof(int));
    printf("sizeof(float): %zu bytes\n", sizeof(float));

    printf("\n--- Comparaciones ---\n");
    printf("A > B:  %d\n", a > b);
    printf("A == B: %d\n", a == b);
    printf("A != B: %d\n", a != b);
    return 0;
}
