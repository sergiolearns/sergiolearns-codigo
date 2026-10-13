/*
 * Solución Ejercicio 2:
 * Del artículo «Condicionales en C — ejercicios para dominar if, else y switch»
 * https://sergiolearns.com/condicionales-en-c-ejercicios/
 */

#include <stdio.h>

int main() {
    float a, b, c;
    float mayor, cuadrado_mayor, suma_cuadrados;
    int valido;

    printf("Lado A: "); scanf("%f", &a);
    printf("Lado B: "); scanf("%f", &b);
    printf("Lado C: "); scanf("%f", &c);

    /* Validar triángulo */
    valido = (a + b > c) && (a + c > b) && (b + c > a);

    printf("\n--- Clasificación ---\n");
    printf("¿Es triángulo válido? %s\n", valido ? "Sí" : "No");

    if (!valido) {
        printf("No se puede clasificar\n");
        return 1;
    }

    /* Clasificación por lados */
    if (a == b && b == c) {
        printf("Tipo por lados:   Equilátero\n");
    } else if (a == b || b == c || a == c) {
        printf("Tipo por lados:   Isósceles\n");
    } else {
        printf("Tipo por lados:   Escaleno\n");
    }

    /* Encontrar lado mayor para Pitágoras */
    if (a >= b && a >= c) {
        mayor = a;
        suma_cuadrados = b*b + c*c;
    } else if (b >= a && b >= c) {
        mayor = b;
        suma_cuadrados = a*a + c*c;
    } else {
        mayor = c;
        suma_cuadrados = a*a + b*b;
    }

    cuadrado_mayor = mayor * mayor;

    /* Clasificación por ángulos */
    if (cuadrado_mayor == suma_cuadrados) {
        printf("Tipo por ángulos: Rectángulo\n");
    } else if (cuadrado_mayor > suma_cuadrados) {
        printf("Tipo por ángulos: Obtusángulo\n");
    } else {
        printf("Tipo por ángulos: Acutángulo\n");
    }

    return 0;
}
