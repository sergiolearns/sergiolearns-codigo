/*
 * Solución del ejercicio 1: área y perímetro de figuras geométricas
 * Del artículo «Tipos y variables en C — ejercicios de figuras, IMC, bases y una calculadora científica (y el scanf sin & que acaba en Segmentation fault)»
 * https://sergiolearns.com/tipos-y-variables-en-c-ejercicios/
 */

#include <stdio.h>
#define PI 3.14159f             /* constante: se cambia una vez y vale para todo */

int main(void) {
    float lado, base, altura, radio;

    printf("=== CALCULADORA DE FIGURAS ===\n");
    printf("Lado del cuadrado: ");
    scanf("%f", &lado);                 /* & obligatorio: scanf necesita la dirección */
    printf("Base del rectángulo: ");
    scanf("%f", &base);
    printf("Altura del rectángulo: ");
    scanf("%f", &altura);
    printf("Radio del círculo: ");
    scanf("%f", &radio);

    printf("\n--- Cuadrado de lado %.2f ---\n", lado);
    printf("Área:      %.2f\n", lado * lado);          /* lado² = lado * lado (no hay **) */
    printf("Perímetro: %.2f\n", 4 * lado);             /* int * float = float */
    printf("\n--- Rectángulo %.2f x %.2f ---\n", base, altura);
    printf("Área:      %.2f\n", base * altura);
    printf("Perímetro: %.2f\n", 2 * (base + altura));  /* paréntesis: primero la suma */
    printf("\n--- Círculo de radio %.2f ---\n", radio);
    printf("Área:      %.2f\n", PI * radio * radio);
    printf("Perímetro: %.2f\n", 2 * PI * radio);
    return 0;
}
