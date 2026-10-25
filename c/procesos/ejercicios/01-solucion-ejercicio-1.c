/*
 * Procesos en C ejercicios — Solución del nivel 1: el cocinero se presenta
 * Del artículo «Procesos en Linux con C — ejercicios con cocineros que se multiplican, búferes que se duplican y códigos de salida que mienten (y la cocina que contrató a siete cocineros)»
 * https://sergiolearns.com/procesos-en-c-ejercicios/
 */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid < 0) {
        perror("fork");
        return 1;
    }
    if (pid == 0) {
        /* el cocinero se presenta */
        printf("Cocinero: mi PID es %d y mi jefe es %d\n", getpid(), getppid());
        exit(0);
    }
    /* el jefe espera para que su mensaje salga siempre después */
    wait(NULL);
    printf("Jefe: mi PID es %d y fork() me devolvió %d\n", getpid(), pid);
    return 0;
}
