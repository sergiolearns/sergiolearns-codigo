/*
 * Bucles en C práctica — Programa 2: Calculadora de series numéricas
 * Del artículo «Bucles en C — 3 programas reales con for, while y do…while»
 * https://sergiolearns.com/bucles-en-c-practica/
 */

#include <stdio.h>

int main() {
    int n, i;
    long suma, factorial;
    int fib_anterior, fib_actual, fib_siguiente;

    printf("=== CALCULADORA DE SERIES ===\n\n");

    /* Pedir n con validación */
    do {
        printf("Introduce n (1-15): ");
        scanf("%d", &n);
        if (n < 1 || n > 15) {
            printf("Error: n debe estar entre 1 y 15\n");
        }
    } while (n < 1 || n > 15);

    /* Serie 1 — Suma acumulada: 1+2+3+...+n */
    suma = 0;
    for (i = 1; i <= n; i++) {
        suma += i;
    }
    printf("\nSuma 1 a %d: %ld\n", n, suma);
    printf("Fórmula: n*(n+1)/2 = %d\n", n*(n+1)/2);

    /* Serie 2 — Factorial: n! */
    factorial = 1;
    for (i = 1; i <= n; i++) {
        factorial *= i;
    }
    printf("\n%d! = %ld\n", n, factorial);

    /* Serie 3 — Fibonacci hasta n términos */
    printf("\nFibonacci (%d términos): ", n);
    fib_anterior = 0;
    fib_actual   = 1;
    printf("%d %d ", fib_anterior, fib_actual);

    for (i = 2; i < n; i++) {
        fib_siguiente = fib_anterior + fib_actual;
        printf("%d ", fib_siguiente);
        fib_anterior = fib_actual;
        fib_actual   = fib_siguiente;
    }
    printf("\n");

    /* Serie 4 — Tabla de potencias */
    printf("\nTabla de potencias de 2:\n");
    long potencia = 1;
    for (i = 0; i <= n; i++) {
        printf("2^%2d = %ld\n", i, potencia);
        potencia *= 2;
    }

    return 0;
}
