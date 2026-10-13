/*
 * Condicionales en C práctica — Programa 2: Juego de adivinar el número con if
 * Del artículo «Condicionales en C — 3 programas reales en gedit y Fedora»
 * https://sergiolearns.com/condicionales-en-c-practica/
 */

#include <stdio.h>

int main() {
    int secreto = 42;    /* número a adivinar */
    int intento;
    int diferencia;

    printf("=== ADIVINA EL NÚMERO ===\n");
    printf("Tengo un número entre 1 y 100\n\n");

    printf("Tu intento: ");
    scanf("%d", &intento);

    /* Calcular diferencia absoluta */
    if (intento > secreto) {
        diferencia = intento - secreto;
    } else {
        diferencia = secreto - intento;
    }

    /* Resultado */
    if (intento == secreto) {
        printf("¡Correcto! El número era %d\n", secreto);
    } else if (intento > secreto) {
        printf("Demasiado alto\n");
    } else {
        printf("Demasiado bajo\n");
    }

    /* Pista de proximidad */
    if (diferencia == 0) {
        printf("Puntuación: perfecta\n");
    } else if (diferencia <= 5) {
        printf("Muy cerca — diferencia de %d\n", diferencia);
    } else if (diferencia <= 15) {
        printf("Cerca — diferencia de %d\n", diferencia);
    } else if (diferencia <= 30) {
        printf("Lejos — diferencia de %d\n", diferencia);
    } else {
        printf("Muy lejos — diferencia de %d\n", diferencia);
    }

    return 0;
}
