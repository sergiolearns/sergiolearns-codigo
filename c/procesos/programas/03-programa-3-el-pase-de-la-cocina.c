/*
 * Procesos en C práctica — Programa 3: El pase de la cocina
 * Del artículo «Procesos en Linux con C — práctica con un jefe de cocina, cocineros que trabajan a la vez y un pase que lanza órdenes de verdad (y el servicio que cerró antes de tiempo)»
 * https://sergiolearns.com/procesos-en-c-practica/
 */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

/* escribe por pantalla la orden como la verías en la terminal: $ wc -l comandas.txt */
void mostrar(char *argv[]) {
    printf("$");
    for (int i = 0; argv[i] != NULL; i++) {
        printf(" %s", argv[i]);
    }
    printf("\n");
    fflush(stdout);   /* que salga antes de que el hijo escriba */
}

/* fork + exec + waitpid: lo mismo que hace la shell con cada orden */
int ejecutar(char *argv[]) {
    pid_t pid = fork();
    if (pid < 0) {
        perror("fork");
        return -1;
    }
    if (pid == 0) {
        execvp(argv[0], argv);
        /* si seguimos aquí, la orden no existe o no se pudo ejecutar */
        perror(argv[0]);
        exit(127);
    }
    int estado;
    waitpid(pid, &estado, 0);
    return WIFEXITED(estado) ? WEXITSTATUS(estado) : -1;
}

int main(void) {
    /* 1. el jefe apunta las comandas del día en un fichero */
    FILE *f = fopen("comandas.txt", "w");
    if (f == NULL) {
        perror("comandas.txt");
        return 1;
    }
    fprintf(f, "mesa 1: paella\nmesa 2: pizza margarita\nmesa 3: croquetas\nmesa 4: pizza cuatro quesos\n");
    fclose(f);

    /* 2. las órdenes que va a lanzar, cada una terminada en NULL */
    char *ordenes[][5] = {
        {"wc", "-l", "comandas.txt", NULL},
        {"grep", "-c", "pizza", "comandas.txt", NULL},
        {"head", "-n", "2", "comandas.txt", NULL},
        {"cat", "reservas.txt", NULL},
        {"lavavajillas", NULL},
    };
    int n = sizeof ordenes / sizeof ordenes[0];

    /* 3. una a una: lanzar, esperar y apuntar cómo ha ido */
    int fallos = 0;
    for (int i = 0; i < n; i++) {
        mostrar(ordenes[i]);
        int codigo = ejecutar(ordenes[i]);
        printf("  -> código de salida %d\n", codigo);
        if (codigo != 0) {
            fallos++;
        }
    }
    printf("Pase terminado: %d órdenes, %d con problemas\n", n, fallos);
    return 0;
}
