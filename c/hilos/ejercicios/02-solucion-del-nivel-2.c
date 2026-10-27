/*
 * Hilos en C ejercicios — Solución del nivel 2: dos consultas con struct
 * Del artículo «Hilos en C — ejercicios con una parada al revés, consultas con struct y un mes repartido entre cuatro hilos (y cuatro hilos que decían ser la misma guagua)»
 * https://sergiolearns.com/hilos-en-c-ejercicios/
 */

#include <stdio.h>
#include <pthread.h>

#define N 8

// Una consulta: el vector, su tamaño, el umbral y el hueco para la respuesta
struct Consulta {
    int* v;
    int n;
    int umbral;
    int resultado;
};

void* contar_menores(void* arg) {
    struct Consulta* c = (struct Consulta*)arg;
    c->resultado = 0;
    for (int i = 0; i < c->n; i++) {
        if (c->v[i] < c->umbral) {   // < estricto: el 5 no es menor que 5
            c->resultado++;
        }
    }
    return NULL;
}

void* contar_mayores(void* arg) {
    struct Consulta* c = (struct Consulta*)arg;
    c->resultado = 0;
    for (int i = 0; i < c->n; i++) {
        if (c->v[i] > c->umbral) {   // > estricto: el 5 tampoco es mayor que 5
            c->resultado++;
        }
    }
    return NULL;
}

int main() {
    int semana2[N] = {3, 8, 0, 12, 5, 6, 1, 10};
    // Un struct para cada hilo: si compartieran uno, se pisarían el resultado
    struct Consulta menores = {semana2, N, 5, 0};
    struct Consulta mayores = {semana2, N, 5, 0};
    pthread_t h1, h2;

    pthread_create(&h1, NULL, contar_menores, &menores);
    pthread_create(&h2, NULL, contar_mayores, &mayores);
    pthread_join(h1, NULL);
    pthread_join(h2, NULL);

    printf("Viajes con menos de %d minutos: %d\n", menores.umbral, menores.resultado);
    printf("Viajes con más de %d minutos: %d\n", mayores.umbral, mayores.resultado);
    printf("Viajes con %d minutos justos: %d\n", menores.umbral, N - menores.resultado - mayores.resultado);
    return 0;
}
