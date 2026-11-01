/*
 * Programa 2: calculadora de series numéricas
 * Del artículo «Bucles en C — práctica con la máquina de billetes de la guagua, series y el juego de adivinar con 7 intentos (y el céntimo que la máquina me cobraba de más)»
 * https://sergiolearns.com/bucles-en-c-practica/
 */
#include <stdio.h>

int main(void) {
    int n, i;
    long long suma, factorial, potencia;   // long long: 64 bits también en Windows
    int anterior, actual, siguiente;       // las tres de Fibonacci
    int c;

    printf("=== CALCULADORA DE SERIES ===\n");

    // Pedir n con validación: al menos una vez y hasta que esté entre 1 y 15
    do {
        printf("Introduce n (1-15): ");
        if (scanf("%d", &n) != 1) {
            while ((c = getchar()) != '\n' && c != EOF);
            n = 0;
        }
        if (n < 1 || n > 15) {
            printf("Error: n debe estar entre 1 y 15\n");
        }
    } while (n < 1 || n > 15);

    // Serie 1: suma 1 + 2 + ... + n (el acumulador de suma empieza en 0)
    suma = 0;
    for (i = 1; i <= n; i++) {
        suma += i;
    }
    printf("\nSuma 1 a %d: %lld\n", n, suma);
    printf("Fórmula n*(n+1)/2: %d\n", n * (n + 1) / 2);

    // Serie 2: factorial n! (el acumulador de producto empieza en 1, no en 0)
    factorial = 1;
    for (i = 1; i <= n; i++) {
        factorial *= i;
    }
    printf("\n%d! = %lld\n", n, factorial);

    // Serie 3: los n primeros términos de Fibonacci
    printf("\nFibonacci (%d términos): ", n);
    anterior = 0;
    actual = 1;
    for (i = 1; i <= n; i++) {
        printf("%d ", anterior);
        siguiente = anterior + actual;     // el nuevo término
        anterior = actual;                 // todo avanza un puesto
        actual = siguiente;
    }
    printf("\n");

    // Serie 4: potencias de 2, de 2^0 a 2^n
    printf("\nPotencias de 2:\n");
    potencia = 1;
    for (i = 0; i <= n; i++) {
        printf("2^%2d = %lld\n", i, potencia);
        potencia *= 2;
    }
    return 0;
}
