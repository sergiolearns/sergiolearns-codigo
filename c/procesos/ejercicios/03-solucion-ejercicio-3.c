/*
 * Procesos en C ejercicios — Solución del nivel 3: las estadísticas del servicio (compila con -lm)
 * Del artículo «Procesos en Linux con C — ejercicios con cocineros que se multiplican, búferes que se duplican y códigos de salida que mienten (y la cocina que contrató a siete cocineros)»
 * https://sergiolearns.com/procesos-en-c-ejercicios/
 */

#define _DEFAULT_SOURCE   /* pide a glibc usleep(), que -std=c11 esconde */
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>
#include <math.h>

#define N 5

int main(void) {
    int minutos[N] = {4, 8, 2, 10, 6};
    pid_t pids[N];

    for (int i = 0; i < N; i++) {
        pids[i] = fork();
        if (pids[i] < 0) {
            perror("fork");
            return 1;
        }
        if (pids[i] == 0) {
            /* cada minuto simulado dura 0,1 s: el que menos tarda acaba antes */
            usleep(minutos[i] * 100000);
            exit(minutos[i]);
        }
    }

    int recogidos[N];   /* los tiempos, en el orden en que llegan */
    for (int k = 0; k < N; k++) {
        int estado;
        pid_t fin = wait(&estado);
        int num = 0;
        for (int i = 0; i < N; i++) {
            if (pids[i] == fin) {
                num = i + 1;
            }
        }
        recogidos[k] = WEXITSTATUS(estado);
        printf("Llega el cocinero %d: %d min\n", num, recogidos[k]);
    }

    /* media: suma entre N, en double para no perder decimales */
    double suma = 0;
    for (int k = 0; k < N; k++) {
        suma += recogidos[k];
    }
    double media = suma / N;

    /* desviación típica: raíz de la media de los cuadrados de (x - media) */
    double cuadrados = 0;
    for (int k = 0; k < N; k++) {
        cuadrados += (recogidos[k] - media) * (recogidos[k] - media);
    }
    double desviacion = sqrt(cuadrados / N);

    printf("Tiempo medio: %.2f min\n", media);
    printf("Desviación típica: %.2f min\n", desviacion);
    return 0;
}
