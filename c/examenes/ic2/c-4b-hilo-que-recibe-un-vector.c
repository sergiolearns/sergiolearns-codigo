/* Versión C, ejercicio 4b: hilo que recibe el vector y calcula la media
   Del artículo «Simulacro del examen práctico de IC2 — diagrama de flujo, fork e hilos en C (y las capturas que no pueden faltar)»
   https://sergiolearns.com/simulacro-examen-ic2-practica/ */

#include <stdio.h>
#include <pthread.h>

#define N 6

float media;   /* el hilo deja aquí el resultado */

void* calcular_media(void* arg) {
    int* v = (int*)arg;   /* el argumento es el vector: lo convertimos a int* */
    int suma = 0;
    int i;

    for (i = 0; i < N; i++) {
        suma = suma + v[i];
    }
    media = (float) suma / N;   /* (float): si no, 41 / 6 daría 6 */
    return NULL;
}

int main() {
    pthread_t hilo;
    int notas[N] = {6, 9, 4, 7, 10, 5};   /* local de main: el hilo la recibe por argumento */

    pthread_create(&hilo, NULL, calcular_media, notas);   /* el nombre del vector ya es una dirección */
    pthread_join(hilo, NULL);

    printf("Media: %.2f\n", media);
    return 0;
}
