/*
 * Llamadas al sistema en C ejercicios — Solución del nivel 2: añadir una partida con O_APPEND
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

int main(void) {
    if (preparar("partidas.sav") == -1)
        return 1;

    /* O_APPEND: el kernel lleva el puntero al final antes de CADA write */
    int fd = open("partidas.sav", O_WRONLY | O_APPEND);
    if (fd == -1) {
        perror("partidas.sav");
        return 1;
    }
    lseek(fd, 0, SEEK_SET);                   /* intento escribir al principio... */
    write(fd, "Sam   nivel 01 0050\n", TAM_RANURA);
    printf("Tras el write, el puntero está en %ld\n", (long) lseek(fd, 0, SEEK_CUR));
    close(fd);

    fd = open("partidas.sav", O_RDONLY);
    off_t tam = lseek(fd, 0, SEEK_END);
    printf("Tamaño: %ld bytes = %ld ranuras\n", (long) tam, (long) tam / TAM_RANURA);

    char ranura[TAM_RANURA + 1];
    lseek(fd, -TAM_RANURA, SEEK_END);         /* la última ranura */
    read(fd, ranura, TAM_RANURA);
    ranura[TAM_RANURA] = '\0';
    printf("Última ranura: %s", ranura);

    lseek(fd, 0, SEEK_SET);                   /* y la primera sigue intacta */
    read(fd, ranura, TAM_RANURA);
    printf("Primera ranura: %s", ranura);
    close(fd);
    return 0;
}
