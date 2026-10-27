/* Versión B, ejercicio 4a: hilo que invierte una palabra en la misma memoria
   Del artículo «Simulacro del examen práctico de IC2 — diagrama de flujo, fork e hilos en C (y las capturas que no pueden faltar)»
   https://sergiolearns.com/simulacro-examen-ic2-practica/ */

#include <stdio.h>
#include <string.h>    /* strlen */
#include <pthread.h>

char palabra[] = "terminal";   /* global: el hilo la modifica y main la imprime */

void* invertir(void* arg) {
    int izq = 0;
    int der = strlen(palabra) - 1;   /* -1: el último carácter útil está antes del '\0' */
    char aux;

    /* intercambiamos desde los dos extremos hasta que se cruzan */
    while (izq < der) {
        aux = palabra[izq];
        palabra[izq] = palabra[der];
        palabra[der] = aux;
        izq++;
        der--;
    }
    return NULL;
}

int main() {
    pthread_t hilo;

    pthread_create(&hilo, NULL, invertir, NULL);
    pthread_join(hilo, NULL);   /* imprimir ANTES del join sacaría la palabra sin invertir */

    printf("Palabra invertida: %s\n", palabra);
    return 0;
}
