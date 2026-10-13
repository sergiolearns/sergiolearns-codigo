/*
 * Solución Ejercicio 3:
 * Del artículo «Tipos y variables en C — ejercicios para dominar printf, scanf y operadores»
 * https://sergiolearns.com/tipos-y-variables-en-c-ejercicios/
 */

#include <stdio.h>
#include <limits.h>

int main() {
    int numero;

    printf("Introduce un número entero: ");
    scanf("%d", &numero);    /* & obligatorio */

    printf("\n--- Conversiones de %d ---\n", numero);
    printf("Decimal:     %d\n", numero);
    printf("Hexadecimal: %x\n", numero);
    printf("Hexadecimal: %X\n", numero);
    printf("Octal:       %o\n", numero);

    printf("\n--- Información adicional ---\n");
    printf("¿Par o impar?: %s\n",  (numero % 2 == 0) ? "Par" : "Impar");
    printf("Tamaño de int: %lu bytes\n", sizeof(int));
    printf("Valor máximo int: %d\n",     INT_MAX);

    return 0;
}
