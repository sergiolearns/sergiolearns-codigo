/*
 * Diagramas de flujo en C ejercicios — Solución del nivel 1: días por debajo de 7000 pasos
 * Del artículo «Diagramas de flujo en C — ejercicios con contadores, contraseñas y dos semanas de pasos (y un programa que se quedó colgado)»
 * https://sergiolearns.com/diagramas-de-flujo-en-c-ejercicios/
 */

#include <stdio.h>

#define N 7
#define LIMITE 7000

int main(void) {
    int pasos[N] = {6420, 11250, 8900, 12030, 4100, 9870, 10500};
    int bajos = 0;   // contador: empieza en 0
    int i;

    for (i = 0; i < N; i++) {
        if (pasos[i] < LIMITE) {   // < y no <=: un día con 7000 justos no es «por debajo»
            bajos = bajos + 1;
        }
    }

    printf("Días por debajo de %d pasos: %d\n", LIMITE, bajos);
    return 0;
}
