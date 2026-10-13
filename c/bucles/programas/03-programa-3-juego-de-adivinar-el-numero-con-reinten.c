/*
 * Bucles en C práctica — Programa 3: Juego de adivinar el número con reintentos
 * Del artículo «Bucles en C — 3 programas reales con for, while y do…while»
 * https://sergiolearns.com/bucles-en-c-practica/
 */

#include <stdio.h>

int main() {
    int secreto = 42;
    int intento;
    int intentos = 0;
    int acertado = 0;
    int diferencia;

    printf("=== ADIVINA EL NÚMERO ===\n");
    printf("Tengo un número entre 1 y 100\n");
    printf("¡Tienes intentos ilimitados!\n\n");

    while (!acertado) {
        printf("Intento %d — Tu número: ", intentos + 1);
        scanf("%d", &intento);
        intentos++;

        /* Calcular diferencia */
        if (intento > secreto) {
            diferencia = intento - secreto;
        } else {
            diferencia = secreto - intento;
        }

        /* Resultado del intento */
        if (intento == secreto) {
            acertado = 1;
        } else if (intento > secreto) {
            printf("Demasiado alto — ");
        } else {
            printf("Demasiado bajo — ");
        }

        /* Pista de proximidad */
        if (!acertado) {
            if (diferencia <= 3) {
                printf("¡Muy cerca!\n");
            } else if (diferencia <= 10) {
                printf("Cerca\n");
            } else if (diferencia <= 25) {
                printf("Lejos\n");
            } else {
                printf("Muy lejos\n");
            }
        }
    }

    /* Resultado final */
    printf("\n✓ ¡Correcto! El número era %d\n", secreto);
    printf("Lo conseguiste en %d intento/s\n\n", intentos);

    /* Puntuación */
    printf("Puntuación: ");
    if (intentos == 1) {
        printf("¡Increíble! Adivinaste a la primera\n");
    } else if (intentos <= 3) {
        printf("Excelente — menos de 4 intentos\n");
    } else if (intentos <= 7) {
        printf("Bien — menos de 8 intentos\n");
    } else {
        printf("Puedes mejorar — %d intentos\n", intentos);
    }

    return 0;
}
