/*
 * Procesos en C práctica — Programa 2: Cuánto ha tardado cada plato
 * Del artículo «Procesos en Linux con C — práctica con un jefe de cocina, cocineros que trabajan a la vez y un pase que lanza órdenes de verdad (y el servicio que cerró antes de tiempo)»
 * https://sergiolearns.com/procesos-en-c-practica/
 */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

#define N 4

int main(void) {
    const char *platos[N] = {"paella", "ensalada", "croquetas", "flan"};
    int minutos[N] = {25, 8, 12, 15};   /* cada cocinero lo devuelve con exit() */
    pid_t pids[N];

    for (int i = 0; i < N; i++) {
        pids[i] = fork();
        if (pids[i] < 0) {
            perror("fork");
            exit(1);
        }
        if (pids[i] == 0) {
            printf("  Cocinero %d: %s en %d minutos\n", i + 1, platos[i], minutos[i]);
            /* el código de salida es un número de 0 a 255: sirve para mandar un dato pequeño */
            exit(minutos[i]);
        }
    }

    int total = 0;
    for (int i = 0; i < N; i++) {
        int estado;
        /* waitpid espera a ESE cocinero: así recogemos en el orden de la lista */
        waitpid(pids[i], &estado, 0);
        if (WIFEXITED(estado)) {
            int m = WEXITSTATUS(estado);   /* el número que el hijo pasó a exit() */
            total += m;
            printf("Jefe: %s -> %d min (acumulado %d)\n", platos[i], m, total);
        }
    }
    /* (double) para que la división no se haga con enteros */
    printf("Jefe: %d minutos en total, %.1f de media por plato\n", total, (double)total / N);
    return 0;
}
