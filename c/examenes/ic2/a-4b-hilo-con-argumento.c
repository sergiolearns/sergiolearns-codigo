/* Versión A, ejercicio 4b: hilo que recibe x como argumento
   Del artículo «Simulacro del examen práctico de IC2 — diagrama de flujo, fork e hilos en C (y las capturas que no pueden faltar)»
   https://sergiolearns.com/simulacro-examen-ic2-practica/ */

#include <stdio.h>
#include <pthread.h>

#define N 8

int datos[N] = {14, 3, 8, 21, 6, 11, 2, 9};

void* contar_mayores(void* arg) {
    int x = *(int*)arg;   /* arg es la dirección de x: la convertimos a int* y leemos */
    int cont = 0;
    int i;

    for (i = 0; i < N; i++) {
        if (datos[i] > x) {
            cont++;
        }
    }
    printf("Hay %d números mayores que %d\n", cont, x);
    return NULL;
}

int main() {
    pthread_t hilo;
    int x;

    printf("Introduce un número entero: ");
    scanf("%d", &x);   /* se lee ANTES de crear el hilo */

    pthread_create(&hilo, NULL, contar_mayores, &x);   /* le pasamos la dirección de x */
    pthread_join(hilo, NULL);

    return 0;
}
