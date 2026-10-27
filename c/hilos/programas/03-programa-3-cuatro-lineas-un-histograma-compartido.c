/*
 * Hilos en C práctica — Programa 3: cuatro líneas, un histograma compartido
 * Del artículo «Hilos en C — práctica con un informe de retrasos, dos tareas a la vez y un histograma con mutex (y un & que se me escapó)»
 * https://sergiolearns.com/hilos-en-c-practica/
 */

#include <stdio.h>
#include <pthread.h>

#define DIAS 7
#define LINEAS 4

// Lo que recibe cada hilo: el nombre de su línea y sus 7 retrasos
struct Linea {
    char* nombre;
    int v[DIAS];
};

int histograma[3] = {0, 0, 0};   // compartido: [0] puntuales, [1] leves, [2] graves
int minutos_totales = 0;         // compartido
pthread_mutex_t cerrojo = PTHREAD_MUTEX_INITIALIZER;

void* clasificar(void* arg) {
    struct Linea* l = (struct Linea*)arg;
    for (int d = 0; d < DIAS; d++) {
        int cat;   // la categoría se calcula FUERA del cerrojo: no toca nada compartido
        if (l->v[d] <= 2) {
            cat = 0;
        } else if (l->v[d] <= 5) {
            cat = 1;
        } else {
            cat = 2;
        }
        pthread_mutex_lock(&cerrojo);     // a partir de aquí, solo un hilo a la vez
        histograma[cat]++;
        minutos_totales += l->v[d];
        pthread_mutex_unlock(&cerrojo);
    }
    return NULL;
}

int main() {
    struct Linea lineas[LINEAS] = {
        {"Línea 1",  {3, 5, 2, 8, 4, 6, 1}},
        {"Línea 12", {9, 12, 7, 10, 14, 8, 11}},
        {"Línea 17", {0, 2, 1, 3, 0, 4, 2}},
        {"Línea 91", {6, 4, 9, 5, 7, 3, 8}},
    };
    pthread_t h[LINEAS];

    for (int k = 0; k < LINEAS; k++) {
        pthread_create(&h[k], NULL, clasificar, &lineas[k]);   // cuatro hilos, uno por línea
    }
    for (int k = 0; k < LINEAS; k++) {
        pthread_join(h[k], NULL);
    }

    printf("Viajes de la semana en las %d líneas: %d\n", LINEAS, LINEAS * DIAS);
    printf("Puntuales (0-2 min): %d\n", histograma[0]);
    printf("Leves (3-5 min):     %d\n", histograma[1]);
    printf("Graves (6+ min):     %d\n", histograma[2]);
    printf("Minutos perdidos:    %d\n", minutos_totales);
    return 0;
}
