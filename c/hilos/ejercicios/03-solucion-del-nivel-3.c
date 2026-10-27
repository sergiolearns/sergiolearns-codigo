/*
 * Hilos en C ejercicios — Solución del nivel 3: el mes repartido entre cuatro hilos
 * Del artículo «Hilos en C — ejercicios con una parada al revés, consultas con struct y un mes repartido entre cuatro hilos (y cuatro hilos que decían ser la misma guagua)»
 * https://sergiolearns.com/hilos-en-c-ejercicios/
 */

#include <stdio.h>
#include <pthread.h>

#define DIAS 30
#define HILOS 4

int mes[DIAS] = {4, 0, 11, 7, 2, 15, 6, 9, 3, 5, 1, 8, 12, 0, 2,
                 6, 10, 4, 7, 3, 0, 14, 5, 9, 1, 6, 2, 8, 11, 3};

int total = 0;      // compartido: suma de todos los tramos
int peor = -1;      // compartido: el mayor retraso del mes
pthread_mutex_t cerrojo = PTHREAD_MUTEX_INITIALIZER;

struct Tramo {
    int id;
    int inicio;
    int fin;   // no incluido
};

void* resumir(void* arg) {
    struct Tramo* t = (struct Tramo*)arg;
    int suma = 0;          // primero se trabaja en local, sin cerrojo...
    int max = mes[t->inicio];
    for (int i = t->inicio; i < t->fin; i++) {
        suma += mes[i];
        if (mes[i] > max) {
            max = mes[i];
        }
    }
    pthread_mutex_lock(&cerrojo);   // ...y se entra UNA sola vez a la sección crítica
    total += suma;
    if (max > peor) {
        peor = max;
    }
    pthread_mutex_unlock(&cerrojo);
    printf("Hilo %d: días %d-%d, %d minutos, máximo %d\n", t->id, t->inicio + 1, t->fin, suma, max);
    return NULL;
}

int main() {
    struct Tramo tramos[HILOS];
    pthread_t h[HILOS];
    int base = DIAS / HILOS;    // 30 / 4 = 7 días para cada uno...
    int resto = DIAS % HILOS;   // ...y sobran 2, que se reparten a los primeros
    int inicio = 0;

    for (int k = 0; k < HILOS; k++) {
        int cuantos = base + (k < resto ? 1 : 0);   // los dos primeros hacen 8, los otros 7
        tramos[k].id = k + 1;
        tramos[k].inicio = inicio;
        tramos[k].fin = inicio + cuantos;
        inicio += cuantos;
        pthread_create(&h[k], NULL, resumir, &tramos[k]);
    }
    for (int k = 0; k < HILOS; k++) {
        pthread_join(h[k], NULL);
    }
    printf("Mes completo: %d minutos de retraso, media %.2f por día, peor día %d minutos\n",
           total, (double)total / DIAS, peor);
    return 0;
}
