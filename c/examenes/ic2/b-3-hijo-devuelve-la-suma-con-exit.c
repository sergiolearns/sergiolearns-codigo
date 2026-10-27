/* Versión B, ejercicio 3: el hijo devuelve la suma con exit y el padre la lee con WEXITSTATUS
   Del artículo «Simulacro del examen práctico de IC2 — diagrama de flujo, fork e hilos en C (y las capturas que no pueden faltar)»
   https://sergiolearns.com/simulacro-examen-ic2-practica/ */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>

int main() {
    pid_t pid;
    int estado;   /* aquí deja wait la información de cómo acabó el hijo */
    int suma = 0;
    int i;

    pid = fork();

    if (pid < 0) {
        perror("Error en fork");
        exit(1);
    }
    else if (pid == 0) {
        /* HIJO: hace el cálculo y lo devuelve como código de salida */
        printf("Hijo (PID %d): sumo los números del 1 al 10\n", getpid());
        for (i = 1; i <= 10; i++) {
            suma = suma + i;
        }
        exit(suma);   /* ojo: el código de salida solo llega de 0 a 255 */
    }
    else {
        /* PADRE: espera y saca el valor con WEXITSTATUS */
        wait(&estado);
        printf("Padre (PID %d): mi hijo %d ha devuelto %d\n", getpid(), pid, WEXITSTATUS(estado));
    }

    return 0;
}
