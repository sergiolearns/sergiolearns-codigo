/*
 * Solución Ejercicio 1:
 * Del artículo «Tipos y variables en C — ejercicios para dominar printf, scanf y operadores»
 * https://sergiolearns.com/tipos-y-variables-en-c-ejercicios/
 */

#include <stdio.h>
#define PI 3.14159

int main() {
    int figura;
    float area, perimetro;

    printf("=== CALCULADORA DE FIGURAS ===\n");
    printf("1. Cuadrado\n");
    printf("2. Rectángulo\n");
    printf("3. Círculo\n");
    printf("Elige figura: ");
    scanf("%d", &figura);    /* & obligatorio */

    if (figura == 1) {
        float lado;
        printf("Lado: ");
        scanf("%f", &lado);    /* & obligatorio */
        area = lado * lado;
        perimetro = 4 * lado;
        printf("\n--- Cuadrado con lado %.2f ---\n", lado);
    }
    else if (figura == 2) {
        float base, altura;
        printf("Base: ");
        scanf("%f", &base);
        printf("Altura: ");
        scanf("%f", &altura);
        area = base * altura;
        perimetro = 2 * (base + altura);
        printf("\n--- Rectángulo %.2f x %.2f ---\n", base, altura);
    }
    else if (figura == 3) {
        float radio;
        printf("Radio: ");
        scanf("%f", &radio);    /* & obligatorio */
        area = PI * radio * radio;
        perimetro = 2 * PI * radio;
        printf("\n--- Círculo con radio %.2f ---\n", radio);
    }
    else {
        printf("Figura no válida\n");
        return 1;
    }

    printf("Área:      %.2f\n", area);
    printf("Perímetro: %.2f\n", perimetro);

    return 0;
}
