/*
 * Hilos en C práctica — Programa 1: informe de retrasos con el umbral tecleado
 * Del artículo «Hilos en C — práctica con un informe de retrasos, dos tareas a la vez y un histograma con mutex (y un & que se me escapó)»
 * https://sergiolearns.com/hilos-en-c-practica/
 */

#include <stdio.h>
#include <pthread.h>

#define N 8

int retrasos[N] = {4, 0, 11, 7, 2, 15, 6, 9};   // minutos de retraso de los 8 viajes de la semana

// El hilo recibe el umbral por argumento y hace todo el informe
void* informe(void* arg) {
    int umbral = *(int*)arg;   // copia local: a partir de aquí no depende de main
    int n = 0;
    int peor = 0;              // posición del viaje con más retraso

    printf("Viajes con más de %d minutos:", umbral);
    for (int i = 0; i < N; i++) {
        if (retrasos[i] > umbral) {
            printf(" %d", retrasos[i]);
            n++;
        }
        if (retrasos[i] > retrasos[peor]) {   // > y no >=: con un empate se queda el primero
            peor = i;
        }
    }
    printf("\n");
    printf("Hay %d viajes con más de %d minutos de retraso\n", n, umbral);
    printf("El peor fue el viaje %d, con %d minutos\n", peor + 1, retrasos[peor]);
    return NULL;
}

int main() {
    int umbral;
    pthread_t hilo;

    printf("¿A partir de cuántos minutos cuenta como retraso? ");
    if (scanf("%d", &umbral) != 1) {   // si no escribe un número, no seguimos
        printf("Eso no es un número\n");
        return 1;
    }
    // umbral ya tiene valor ANTES de crear el hilo: el hilo lo lee nada más empezar
    if (pthread_create(&hilo, NULL, informe, &umbral) != 0) {
        printf("No se pudo crear el hilo\n");
        return 1;
    }
    pthread_join(hilo, NULL);
    printf("main: informe terminado\n");
    return 0;
}
