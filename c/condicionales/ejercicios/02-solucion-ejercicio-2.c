/*
 * Solución del ejercicio 2: clasificador de triángulos por lados
 * Del artículo «Condicionales en C — ejercicios con notas, triángulos, un login sin bucles y las tarifas de la guagua (y el saldo de 1,10 € que no era 1,10 €)»
 * https://sergiolearns.com/condicionales-en-c-ejercicios/
 */

#include <stdio.h>

int main(void) {
    int a, b, c;                     // lados enteros: así == compara sin errores de redondeo
    int mayor, suma_cuadrados, cuadrado_mayor;

    printf("Lado A: ");
    scanf("%d", &a);
    printf("Lado B: ");
    scanf("%d", &b);
    printf("Lado C: ");
    scanf("%d", &c);

    // Desigualdad triangular: cada lado menor que la suma de los otros dos.
    // Con > estricto también deja fuera los lados 0 o negativos
    int valido = (a + b > c) && (a + c > b) && (b + c > a);

    printf("\n--- Clasificación ---\n");
    printf("¿Es triángulo válido? %s\n", valido ? "Sí" : "No");
    if (!valido) {
        printf("No se puede clasificar\n");
        return 1;
    }

    // Por lados: primero el caso más estricto (los tres iguales)
    if (a == b && b == c) {
        printf("Tipo por lados:   Equilátero\n");
    } else if (a == b || b == c || a == c) {
        printf("Tipo por lados:   Isósceles\n");
    } else {
        printf("Tipo por lados:   Escaleno\n");
    }

    // Pitágoras necesita saber cuál es el lado mayor
    if (a >= b && a >= c) {
        mayor = a;
        suma_cuadrados = b * b + c * c;
    } else if (b >= a && b >= c) {
        mayor = b;
        suma_cuadrados = a * a + c * c;
    } else {
        mayor = c;
        suma_cuadrados = a * a + b * b;
    }
    cuadrado_mayor = mayor * mayor;

    if (cuadrado_mayor == suma_cuadrados) {
        printf("Tipo por ángulos: Rectángulo\n");
    } else if (cuadrado_mayor > suma_cuadrados) {
        printf("Tipo por ángulos: Obtusángulo\n");
    } else {
        printf("Tipo por ángulos: Acutángulo\n");
    }
    return 0;
}
