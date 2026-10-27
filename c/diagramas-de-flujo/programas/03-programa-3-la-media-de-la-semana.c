/*
 * Diagramas de flujo en C práctica — Programa 3: la media de la semana y los días por encima
 * Del artículo «Diagramas de flujo en C — práctica con la racha de la pulsera, un número capicúa y la media de la semana (diagrama primero, código después)»
 * https://sergiolearns.com/diagramas-de-flujo-en-c-practica/
 */

#include <stdio.h>

#define N 7

int main(void) {
    const char *dias[N] = {"lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"};
    int pasos[N];
    int suma = 0;
    int encima = 0;   // días por encima de la media
    double media;
    int i;

    // Bucle 1: leer los siete días (romboide dentro del bucle)
    for (i = 0; i < N; i++) {
        printf("Pasos del %s: ", dias[i]);
        scanf("%d", &pasos[i]);
        suma = suma + pasos[i];      // se va sumando a la vez que se lee
    }

    media = (double) suma / N;       // la media solo se conoce al terminar el bucle 1
    printf("Media: %.1f pasos\n", media);

    // Bucle 2: con la media ya calculada, se vuelve a recorrer el vector
    for (i = 0; i < N; i++) {
        if (pasos[i] > media) {
            printf("  %s: %d (por encima)\n", dias[i], pasos[i]);
            encima = encima + 1;
        }
    }
    printf("Días por encima de la media: %d de %d\n", encima, N);
    return 0;
}
