/* Versión B, ejercicio 4b: hilo que cuenta una letra recibida como argumento
   Del artículo «Simulacro del examen práctico de IC2 — diagrama de flujo, fork e hilos en C (y las capturas que no pueden faltar)»
   https://sergiolearns.com/simulacro-examen-ic2-practica/ */

#include <stdio.h>
#include <pthread.h>

char texto[] = "paralelismo";

void* contar_letra(void* arg) {
    char letra = *(char*)arg;   /* la letra llega como dirección: char* y la leemos */
    int cont = 0;
    int i;

    for (i = 0; texto[i] != '\0'; i++) {
        if (texto[i] == letra) {
            cont++;
        }
    }
    printf("La letra '%c' aparece %d veces en \"%s\"\n", letra, cont, texto);
    return NULL;
}

int main() {
    pthread_t hilo;
    char letra = 'l';

    pthread_create(&hilo, NULL, contar_letra, &letra);
    pthread_join(hilo, NULL);

    return 0;
}
