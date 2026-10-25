/*
 * Procesos en C ejercicios — Solución del nivel 2: ¿cuántos platos habéis hecho?
 * Del artículo «Procesos en Linux con C — ejercicios con cocineros que se multiplican, búferes que se duplican y códigos de salida que mienten (y la cocina que contrató a siete cocineros)»
 * https://sergiolearns.com/procesos-en-c-ejercicios/
 */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int platos[2] = {4, 7};   /* platos que prepara cada cocinero */
    pid_t pids[2];

    for (int i = 0; i < 2; i++) {
        pids[i] = fork();
        if (pids[i] < 0) {
            perror("fork");
            return 1;
        }
        if (pids[i] == 0) {
            /* cada cocinero devuelve su número de platos como código de salida */
            exit(platos[i]);
        }
    }

    int total = 0;
    for (int k = 0; k < 2; k++) {
        int estado;
        pid_t fin = wait(&estado);   /* el primero que acabe, sea cual sea */
        if (WIFEXITED(estado)) {
            int p = WEXITSTATUS(estado);
            /* averiguamos qué cocinero era comparando el PID */
            int num = (fin == pids[0]) ? 1 : 2;
            printf("Cocinero %d: %d platos\n", num, p);
            total += p;
        }
    }
    printf("Total de platos: %d\n", total);
    return 0;
}
