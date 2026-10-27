/* Versión A, ejercicio 4a: hilo que cuenta los pares
   Del artículo «Simulacro del examen práctico de IC2 — diagrama de flujo, fork e hilos en C (y las capturas que no pueden faltar)»
   https://sergiolearns.com/simulacro-examen-ic2-practica/ */

#include <stdio.h>
#include <pthread.h>

#define N 8

/* global: los hilos comparten la memoria del proceso, así el hilo la ve */
int datos[N] = {14, 3, 8, 21, 6, 11, 2, 9};

/* firma obligatoria de la función de un hilo: recibe y devuelve void* */
void* contar_pares(void* arg) {
    int pares = 0;
    int i;

    for (i = 0; i < N; i++) {
        if (datos[i] % 2 == 0) {   /* resto 0 al dividir entre 2 = par */
            pares++;
        }
    }
    printf("El hilo ha contado %d números pares\n", pares);
    return NULL;
}

int main() {
    pthread_t hilo;

    pthread_create(&hilo, NULL, contar_pares, NULL);   /* arranca el hilo */
    pthread_join(hilo, NULL);   /* sin esto, main podría acabar antes que el hilo */

    return 0;
}
