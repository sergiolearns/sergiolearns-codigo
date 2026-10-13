/*
 * Solución Ejercicio 1:
 * Del artículo «Condicionales en C — ejercicios para dominar if, else y switch»
 * https://sergiolearns.com/condicionales-en-c-ejercicios/
 */

#include <stdio.h>

int main() {
    float nota;
    char letra;
    float nota_americana;
    int aprobado;

    printf("Nota española (0-10): ");
    scanf("%f", &nota);

    if (nota < 0 || nota > 10) {
        printf("Error: nota fuera de rango\n");
        return 1;
    }

    /* Conversión a letra */
    if (nota >= 9.0) {
        letra = 'A';
    } else if (nota >= 7.0) {
        letra = 'B';
    } else if (nota >= 5.0) {
        letra = 'C';
    } else if (nota >= 3.0) {
        letra = 'D';
    } else {
        letra = 'F';
    }

    nota_americana = nota * 10;
    aprobado = (nota >= 5.0);

    printf("\n--- Conversiones ---\n");
    printf("Sistema español:    %.2f / 10\n",  nota);
    printf("Sistema americano:  %.2f / 100\n", nota_americana);
    printf("Sistema de letras:  %c\n",          letra);
    printf("Estado:             %s\n", aprobado ? "Aprobado" : "Suspenso");

    return 0;
}
