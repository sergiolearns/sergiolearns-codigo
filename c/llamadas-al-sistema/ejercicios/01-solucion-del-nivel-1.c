/*
 * Llamadas al sistema en C ejercicios — Solución del nivel 1: contar bytes y líneas
 * Del artículo «Llamadas al sistema en C — ejercicios con contadores de bytes, O_APPEND, un ranking de partidas y tres fallos de lseek y read (y la partida que se negó a ir al principio)»
 * https://sergiolearns.com/llamadas-al-sistema-en-c-ejercicios/
 */
#include <stdio.h>
#include <fcntl.h>      /* open y las constantes O_... */
#include <unistd.h>     /* read, write, lseek, close */

#define TAM_RANURA 20
#define PARTIDAS "Lia   nivel 03 0450\n" "Max   nivel 12 2750\n" \
                 "Ane   nivel 05 0980\n" "Teo   nivel 07 1200\n"

/* Crea el fichero de partidas con las cuatro ranuras de ejemplo */
static int preparar(const char *nombre) {
    int fd = open(nombre, O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (fd == -1) {
        perror(nombre);
        return -1;
    }
    write(fd, PARTIDAS, 4 * TAM_RANURA);
    close(fd);
    return 0;
}

/* Cuenta bytes y líneas leyendo de 16 en 16 */
static void contar(const char *nombre) {
    int fd = open(nombre, O_RDONLY);
    if (fd == -1) {
        perror(nombre);
        return;
    }
    char buf[16];
    ssize_t leidos;
    long bytes = 0, lineas = 0;
    int lecturas = 0;
    while ((leidos = read(fd, buf, sizeof buf)) > 0) {
        lecturas++;
        bytes += leidos;
        for (ssize_t i = 0; i < leidos; i++)  /* solo los leidos, no 16 */
            if (buf[i] == '\n')
                lineas++;
    }
    close(fd);
    printf("%s: %ld bytes, %ld líneas, %d lecturas con datos\n",
           nombre, bytes, lineas, lecturas);
}

int main(void) {
    if (preparar("partidas.sav") == -1)
        return 1;
    contar("partidas.sav");
    contar("records.sav");                    /* no existe */
    return 0;
}
