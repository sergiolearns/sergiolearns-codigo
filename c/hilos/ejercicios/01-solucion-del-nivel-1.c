/*
 * Hilos en C ejercicios — Solución del nivel 1: la parada al revés
 * Del artículo «Hilos en C — ejercicios con una parada al revés, consultas con struct y un mes repartido entre cuatro hilos (y cuatro hilos que decían ser la misma guagua)»
 * https://sergiolearns.com/hilos-en-c-ejercicios/
 */

#include <stdio.h>
#include <string.h>    // strlen
#include <pthread.h>

char parada[] = "San Telmo";   // global: el hilo la modifica y main la lee después

void* invertir(void* arg) {
    int izq = 0;
    int der = strlen(parada) - 1;   // -1: el último carácter útil está antes del '\0'
    while (izq < der) {             // cuando se cruzan, ya está todo intercambiado
        char aux = parada[izq];
        parada[izq] = parada[der];
        parada[der] = aux;
        izq++;
        der--;
    }
    return NULL;
}

int main() {
    pthread_t hilo;
    printf("Antes:   %s\n", parada);
    pthread_create(&hilo, NULL, invertir, NULL);
    pthread_join(hilo, NULL);   // sin esto podríamos imprimir la cadena a medio invertir
    printf("Después: %s\n", parada);
    return 0;
}
