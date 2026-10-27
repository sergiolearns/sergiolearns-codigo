/* Versión C, ejercicio 1a: máximo de un vector y su posición
   Del artículo «Simulacro del examen práctico de IC2 — diagrama de flujo, fork e hilos en C (y las capturas que no pueden faltar)»
   https://sergiolearns.com/simulacro-examen-ic2-practica/ */

#include <stdio.h>

#define N 6

int main() {
    int temp[N] = {18, 24, 21, 27, 19, 25};
    int max = temp[0];   /* empezamos con el primero, no con 0 (¿y si todos fueran negativos?) */
    int pos = 0;
    int i;

    /* empieza en 1: el elemento 0 ya está en max */
    for (i = 1; i < N; i++) {
        if (temp[i] > max) {
            max = temp[i];
            pos = i;   /* guardamos también DÓNDE está */
        }
    }

    printf("Máximo: %d (posición %d)\n", max, pos);
    return 0;
}
