/*
 * Programa 2: juego de adivinar el número con un solo intento
 * Del artículo «Condicionales en C — práctica con un clasificador de notas, un adivino de un solo intento y una calculadora con switch (y el punto y coma que me suspendió con un 7,5)»
 * https://sergiolearns.com/condicionales-en-c-practica/
 */

#include <stdio.h>

int main(void) {
    int secreto = 42;                // fijo para que la partida se pueda repetir
    int intento;
    int diferencia;

    printf("=== ADIVINA EL NÚMERO ===\n");
    printf("Tengo un número entre 1 y 100. Tienes UN intento.\n\n");
    printf("Tu intento: ");

    // Si scanf falla, el || ya es verdad y C no mira intento (que estaría sin valor)
    if (scanf("%d", &intento) != 1 || intento < 1 || intento > 100) {
        printf("Tiene que ser un número entre 1 y 100\n");
        return 1;
    }

    // Distancia sin abs(): siempre el mayor menos el menor, así nunca sale negativa
    if (intento > secreto) {
        diferencia = intento - secreto;
    } else {
        diferencia = secreto - intento;
    }

    // ¿Alto, bajo o justo?
    if (intento == secreto) {
        printf("¡Correcto! El número era %d\n", secreto);
    } else if (intento > secreto) {
        printf("Demasiado alto\n");
    } else {
        printf("Demasiado bajo\n");
    }

    // Pista de proximidad: de la franja más estrecha a la más ancha
    if (diferencia == 0) {
        printf("Puntuación: perfecta\n");
    } else if (diferencia <= 5) {
        printf("Muy cerca: diferencia de %d\n", diferencia);
    } else if (diferencia <= 15) {
        printf("Cerca: diferencia de %d\n", diferencia);
    } else if (diferencia <= 30) {
        printf("Lejos: diferencia de %d\n", diferencia);
    } else {
        printf("Muy lejos: diferencia de %d\n", diferencia);
    }
    return 0;
}
