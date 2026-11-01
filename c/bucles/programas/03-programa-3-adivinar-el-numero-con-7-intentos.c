/*
 * Programa 3: adivinar el número con 7 intentos
 * Del artículo «Bucles en C — práctica con la máquina de billetes de la guagua, series y el juego de adivinar con 7 intentos (y el céntimo que la máquina me cobraba de más)»
 * https://sergiolearns.com/bucles-en-c-practica/
 */
#include <stdio.h>

#define MAX_INTENTOS 7

int main(void) {
    int secreto = 42;            // fijo para poder repetir la partida
    int numero;                  // lo que teclea el jugador
    int intento;                 // 1, 2, 3... hasta MAX_INTENTOS
    int acertado = 0;            // bandera: 0 = todavía no, 1 = acertó
    int diferencia;
    int c;

    printf("=== ADIVINA EL NÚMERO ===\n");
    printf("Tengo un número entre 1 y 100. Tienes %d intentos.\n\n", MAX_INTENTOS);

    // Dos formas de salir: gastar los intentos o acertar (la bandera)
    for (intento = 1; intento <= MAX_INTENTOS && !acertado; intento++) {
        printf("Intento %d de %d: ", intento, MAX_INTENTOS);
        if (scanf("%d", &numero) != 1 || numero < 1 || numero > 100) {
            while ((c = getchar()) != '\n' && c != EOF);
            printf("Tiene que ser un número entre 1 y 100 (no cuenta)\n");
            intento--;           // el intento++ del for lo deja igual
            continue;
        }

        // Distancia al secreto, siempre positiva
        diferencia = numero > secreto ? numero - secreto : secreto - numero;

        if (diferencia == 0) {
            acertado = 1;        // el for lo verá en su próxima comprobación
            printf("¡Correcto!\n");
        } else {
            printf(numero > secreto ? "Demasiado alto" : "Demasiado bajo");
            if (diferencia <= 3) {
                printf(" - ¡muy cerca!\n");
            } else if (diferencia <= 10) {
                printf(" - cerca\n");
            } else if (diferencia <= 25) {
                printf(" - lejos\n");
            } else {
                printf(" - muy lejos\n");
            }
        }
    }

    // Al salir, intento vale UNO MÁS que el último intento usado
    if (acertado) {
        printf("\nLo conseguiste en %d intento(s)\n", intento - 1);
    } else {
        printf("\nSe acabaron los intentos. El número era %d\n", secreto);
    }
    return 0;
}
