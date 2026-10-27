/* Versión C, ejercicio 1b: máximo y posición con datos del usuario
   Del artículo «Simulacro del examen práctico de IC2 — diagrama de flujo, fork e hilos en C (y las capturas que no pueden faltar)»
   https://sergiolearns.com/simulacro-examen-ic2-practica/ */

#include <stdio.h>

#define N 5

int main() {
    int vec[N];
    int max;
    int pos = 0;
    int i;

    for (i = 0; i < N; i++) {
        printf("Introduce el número %d: ", i);
        scanf("%d", &vec[i]);
    }

    max = vec[0];   /* el máximo se inicializa DESPUÉS de leer el vector */
    for (i = 1; i < N; i++) {
        if (vec[i] > max) {   /* > y no >=: si se repite, se queda la primera posición */
            max = vec[i];
            pos = i;
        }
    }

    printf("Máximo: %d (posición %d)\n", max, pos);
    return 0;
}
