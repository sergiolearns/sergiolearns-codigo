/* Versión A, ejercicio 3: hijo con getpid/getppid y padre con wait
   Del artículo «Simulacro del examen práctico de IC2 — diagrama de flujo, fork e hilos en C (y las capturas que no pueden faltar)»
   https://sergiolearns.com/simulacro-examen-ic2-practica/ */

#include <stdio.h>
#include <stdlib.h>      /* exit */
#include <unistd.h>      /* fork, getpid, getppid, sleep */
#include <sys/types.h>   /* pid_t */
#include <sys/wait.h>    /* wait */

int main() {
    pid_t pid;

    pid = fork();   /* desde aquí hay DOS procesos ejecutando este código */

    if (pid < 0) {
        /* fork devuelve -1 si no puede crear el proceso */
        perror("Error en fork");
        exit(1);
    }
    else if (pid == 0) {
        /* HIJO: fork le devuelve 0 */
        printf("Soy el hijo: mi PID es %d y el de mi padre, %d\n", getpid(), getppid());
        sleep(2);
        exit(0);   /* el hijo acaba aquí y no sigue por el código del padre */
    }
    else {
        /* PADRE: fork le devuelve el PID del hijo */
        wait(NULL);   /* se bloquea hasta que el hijo termina */
        printf("Soy el padre (PID %d): mi hijo %d ha terminado\n", getpid(), pid);
    }

    return 0;
}
