/*
 * Hilos en C práctica — Programa 2: dos hilos, dos tareas sobre la misma semana
 * Del artículo «Hilos en C — práctica con un informe de retrasos, dos tareas a la vez y un histograma con mutex (y un & que se me escapó)»
 * https://sergiolearns.com/hilos-en-c-practica/
 */

#include <stdio.h>
#include <pthread.h>

#define N 8

// Lo que comparten las dos tareas (los datos) y lo que devuelve cada una
struct Estadisticas {
    int* v;        // el vector de retrasos
    int n;         // cuántos viajes
    double media;  // resultado
    int max;       // resultado
    int pos_max;   // resultado: posición del máximo
};

struct Categorias {
    int* v;
    int n;
    int puntuales;   // 0-2 minutos
    int leves;       // 3-5 minutos
    int graves;      // 6 o más
};

void* estadisticas(void* arg) {
    struct Estadisticas* e = (struct Estadisticas*)arg;
    int suma = 0;
    e->max = e->v[0];
    e->pos_max = 0;
    for (int i = 0; i < e->n; i++) {
        suma += e->v[i];
        if (e->v[i] > e->max) {
            e->max = e->v[i];
            e->pos_max = i;
        }
    }
    e->media = (double)suma / e->n;   // el (double) evita la división entera
    return NULL;
}

void* categorias(void* arg) {
    struct Categorias* c = (struct Categorias*)arg;
    c->puntuales = c->leves = c->graves = 0;
    for (int i = 0; i < c->n; i++) {
        if (c->v[i] <= 2) {
            c->puntuales++;
        } else if (c->v[i] <= 5) {   // aquí ya sabemos que es mayor que 2
            c->leves++;
        } else {
            c->graves++;
        }
    }
    return NULL;
}

int main() {
    int retrasos[N] = {4, 0, 11, 7, 2, 15, 6, 9};
    struct Estadisticas e = {retrasos, N, 0, 0, 0};   // los dos structs apuntan al MISMO vector
    struct Categorias c = {retrasos, N, 0, 0, 0};
    pthread_t h1, h2;

    pthread_create(&h1, NULL, estadisticas, &e);   // dos tareas distintas a la vez
    pthread_create(&h2, NULL, categorias, &c);
    pthread_join(h1, NULL);
    pthread_join(h2, NULL);

    // main imprime en el orden que quiere: los hilos solo calculan
    printf("Media: %.2f minutos por viaje\n", e.media);
    printf("Peor viaje: el %d, con %d minutos\n", e.pos_max + 1, e.max);
    printf("Puntuales: %d · Leves: %d · Graves: %d\n", c.puntuales, c.leves, c.graves);
    return 0;
}
