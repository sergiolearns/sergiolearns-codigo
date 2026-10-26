/*
 * Solución del ejercicio 3: conversor de bases numéricas
 * Del artículo «Tipos y variables en C — ejercicios de figuras, IMC, bases y una calculadora científica (y el scanf sin & que acaba en Segmentation fault)»
 * https://sergiolearns.com/tipos-y-variables-en-c-ejercicios/
 */

#include <stdio.h>
#include <limits.h>     /* INT_MAX */

int main(void) {
    int numero;

    printf("Introduce un número entero: ");
    scanf("%d", &numero);

    printf("\n--- Conversiones de %d ---\n", numero);
    printf("Decimal:     %d\n", numero);
    printf("Hexadecimal: %x\n", numero);    /* printf convierte solo */
    printf("Hexadecimal: %X\n", numero);    /* X mayúscula: letras en mayúscula */
    printf("Octal:       %o\n", numero);

    int unidades = numero % 10;             /* la última cifra */
    int decenas = numero / 10 % 10;         /* quita una cifra y coge la última */
    int centenas = numero / 100 % 10;
    printf("\n--- Cifras (base 10) ---\n");
    printf("Centenas: %d, decenas: %d, unidades: %d\n", centenas, decenas, unidades);
    printf("Suma de cifras: %d\n", centenas + decenas + unidades);

    printf("\n--- Información adicional ---\n");
    printf("¿Es par? (1 = sí): %d\n", numero % 2 == 0);
    printf("Tamaño de int: %zu bytes\n", sizeof(int));
    printf("Valor máximo de int: %d\n", INT_MAX);
    return 0;
}
