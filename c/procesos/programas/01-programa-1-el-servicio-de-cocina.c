/*
 * Procesos en C práctica — Programa 1: El servicio de cocina
 * Del artículo «Procesos en Linux con C — práctica con un jefe de cocina, cocineros que trabajan a la vez y un pase que lanza órdenes de verdad (y el servicio que cerró antes de tiempo)»
 * https://sergiolearns.com/procesos-en-c-practica/
 */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

#define N 3

int main(void) {
    const char *platos[N] = {"paella", "ensalada", "croquetas"};
    int segundos[N] = {3, 1, 2};   /* lo que tarda cada plato (simulado con sleep) */
    pid_t pids[N];                 /* el jefe apunta el PID de cada cocinero */

    printf("Jefe %d: abro el servicio con %d cocineros\n", getpid(), N);

    for (int i = 0; i < N; i++) {
        pids[i] = fork();
        if (pids[i] < 0) {
            perror("fork");
            exit(1);
        }
        if (pids[i] == 0) {
            /* CÓDIGO DEL COCINERO: prepara su plato y se va */
            printf("  Cocinero %d (PID %d): empiezo %s\n", i + 1, getpid(), platos[i]);
            sleep(segundos[i]);
            printf("  Cocinero %d (PID %d): termino %s\n", i + 1, getpid(), platos[i]);
            /* imprescindible: sin exit, el hijo seguiría el bucle y crearía más cocineros */
            exit(0);
        }
    }

    /* CÓDIGO DEL JEFE: espera a los N cocineros en el orden en que acaben */
    for (int k = 0; k < N; k++) {
        pid_t fin = wait(NULL);
        /* busca en la lista qué cocinero tenía ese PID */
        int num = -1;
        for (int i = 0; i < N; i++) {
            if (pids[i] == fin) {
                num = i + 1;
            }
        }
        printf("Jefe: recojo al cocinero %d (PID %d)\n", num, fin);
    }
    printf("Jefe: servicio cerrado\n");
    return 0;
}
