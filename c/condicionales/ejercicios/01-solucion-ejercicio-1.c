/*
 * Solución del ejercicio 1: conversor de calificaciones entre sistemas
 * Del artículo «Condicionales en C — ejercicios con notas, triángulos, un login sin bucles y las tarifas de la guagua (y el saldo de 1,10 € que no era 1,10 €)»
 * https://sergiolearns.com/condicionales-en-c-ejercicios/
 */

#include <stdio.h>

int main(void) {
    float nota;
    char letra;
    float nota_americana;

    printf("Nota española (0-10): ");
    // Un solo if para los dos fallos: si scanf falla, el || ya no mira el rango
    if (scanf("%f", &nota) != 1 || nota < 0 || nota > 10) {
        printf("Error: nota fuera de rango\n");
        return 1;
    }

    // Letra: de la más alta a la más baja, cada rama con sus llaves
    if (nota >= 9.0f) {
        letra = 'A';
    } else if (nota >= 7.0f) {
        letra = 'B';
    } else if (nota >= 5.0f) {
        letra = 'C';
    } else if (nota >= 3.0f) {
        letra = 'D';
    } else {
        letra = 'F';
    }

    nota_americana = nota * 10;      // 0-10 pasa a 0-100: basta con multiplicar

    printf("\n--- Conversiones ---\n");
    printf("Sistema español:    %.2f / 10\n", nota);
    printf("Sistema americano:  %.2f / 100\n", nota_americana);
    printf("Sistema de letras:  %c\n", letra);
    printf("Estado:             %s\n", (nota >= 5.0f) ? "Aprobado" : "Suspenso");
    return 0;
}
