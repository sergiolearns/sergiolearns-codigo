/* Versión A, ejercicio 1a: contar los mayores que 10
   Del artículo «Simulacro del examen práctico de IC2 — diagrama de flujo, fork e hilos en C (y las capturas que no pueden faltar)»
   https://sergiolearns.com/simulacro-examen-ic2-practica/ */

#include <stdio.h>

#define N 7   /* tamaño del vector: así no escribimos 7 por todo el código */

int main() {
    int vec[N] = {12, 5, 23, 8, 17, 30, 9};
    int x = 10;       /* el valor con el que comparamos */
    int cont = 0;     /* los contadores SIEMPRE empiezan en 0 */
    int i;

    /* i va de 0 a N-1: por eso i < N y no i <= N */
    for (i = 0; i < N; i++) {
        if (vec[i] > x) {   /* > y no >=: el 10 no es mayor que 10 */
            cont++;
        }
    }

    /* el printf va DESPUÉS del bucle: si no, imprimiría en cada vuelta */
    printf("Hay %d números mayores que %d\n", cont, x);
    return 0;
}
