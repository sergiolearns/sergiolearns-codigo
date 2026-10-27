/* Versión C, ejercicio 4a: dos hilos, suma y máximo
   Del artículo «Simulacro del examen práctico de IC2 — diagrama de flujo, fork e hilos en C (y las capturas que no pueden faltar)»
   https://sergiolearns.com/simulacro-examen-ic2-practica/ */

#include <stdio.h>
#include <pthread.h>

#define N 6

int notas[N] = {6, 9, 4, 7, 10, 5};
int suma = 0;   /* resultado del hilo 1 */
int max;        /* resultado del hilo 2 */

void* sumar(void* arg) {
    int i;
    for (i = 0; i < N; i++) {
        suma = suma + notas[i];
    }
    return NULL;
}

void* maximo(void* arg) {
    int i;
    max = notas[0];
    for (i = 1; i < N; i++) {
        if (notas[i] > max) {
            max = notas[i];
        }
    }
    return NULL;
}

int main() {
    pthread_t h1, h2;

    /* los dos hilos trabajan a la vez; cada uno escribe en SU variable */
    pthread_create(&h1, NULL, sumar, NULL);
    pthread_create(&h2, NULL, maximo, NULL);
    pthread_join(h1, NULL);
    pthread_join(h2, NULL);

    /* main imprime cuando los dos han terminado: el orden de la salida es siempre el mismo */
    printf("Suma: %d\n", suma);
    printf("Máximo: %d\n", max);
    return 0;
}
