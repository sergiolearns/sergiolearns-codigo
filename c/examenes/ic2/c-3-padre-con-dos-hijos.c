/* Versión C, ejercicio 3: un padre con dos hijos
   Del artículo «Simulacro del examen práctico de IC2 — diagrama de flujo, fork e hilos en C (y las capturas que no pueden faltar)»
   https://sergiolearns.com/simulacro-examen-ic2-practica/ */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>

int main() {
    pid_t pid1, pid2;

    pid1 = fork();
    if (pid1 < 0) {
        perror("Error en fork");
        exit(1);
    }
    if (pid1 == 0) {
        /* HIJO 1: duerme 1 segundo y termina */
        printf("Hijo 1: PID %d, padre %d\n", getpid(), getppid());
        sleep(1);
        printf("Hijo 1 termina\n");
        exit(0);
    }

    /* aquí solo llega el padre: el hijo 1 ya ha hecho exit */
    pid2 = fork();
    if (pid2 < 0) {
        perror("Error en fork");
        exit(1);
    }
    if (pid2 == 0) {
        /* HIJO 2: duerme 3 segundos (da tiempo a escribir ps) */
        sleep(3);
        printf("Hijo 2: PID %d, padre %d. Termino\n", getpid(), getppid());
        exit(0);
    }

    /* PADRE: un wait por cada hijo */
    wait(NULL);
    wait(NULL);
    printf("Padre (PID %d): mis hijos %d y %d han terminado\n", getpid(), pid1, pid2);
    return 0;
}
