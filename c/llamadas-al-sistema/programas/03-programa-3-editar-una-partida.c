/*
 * Llamadas al sistema en C práctica — Programa 3: Editar una partida
 * Del artículo «Llamadas al sistema en C — práctica guardando, copiando y editando partidas con open, read, write y lseek (y la copia que medía 96 bytes)»
 * https://sergiolearns.com/llamadas-al-sistema-en-c-practica/
 */
#include <stdio.h>
#include <fcntl.h>      /* open y las constantes O_... */
#include <unistd.h>     /* read, write, lseek, close */
#include <string.h>     /* strlen */

#define TAM_RANURA 20
#define PARTIDAS "Lia   nivel 03 0450\n" "Max   nivel 12 2750\n" \
                 "Ane   nivel 05 0980\n" "Teo   nivel 07 1200\n"
#define POS_PUNTOS 15                     /* los puntos empiezan en el byte 15 de la ranura */

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

/* Lee la ranura n en buf (21 bytes); devuelve lo que devuelve read */
static ssize_t leer_ranura(int fd, int n, char *buf) {
    lseek(fd, (off_t) n * TAM_RANURA, SEEK_SET);   /* salto directo, sin leer las de antes */
    ssize_t leidos = read(fd, buf, TAM_RANURA);
    buf[leidos > 0 ? leidos : 0] = '\0';
    return leidos;
}

/* Sobrescribe los 4 dígitos de puntos de la ranura n */
static void cambiar_puntos(int fd, int n, int nuevos) {
    char cifras[8];
    snprintf(cifras, sizeof cifras, "%04d", nuevos);  /* siempre 4 dígitos */
    off_t pos = lseek(fd, (off_t) n * TAM_RANURA + POS_PUNTOS, SEEK_SET);
    write(fd, cifras, strlen(cifras));                /* 4 bytes, ni uno más */
    printf("Escribo \"%s\" en el byte %ld\n", cifras, (long) pos);
}

int main(void) {
    if (preparar("partidas.sav") == -1)
        return 1;
    int fd = open("partidas.sav", O_RDWR);    /* leer Y escribir */
    if (fd == -1) {
        perror("partidas.sav");
        return 1;
    }
    char ranura[TAM_RANURA + 1];

    leer_ranura(fd, 2, ranura);
    printf("Antes:   %s", ranura);
    cambiar_puntos(fd, 2, 3100);
    leer_ranura(fd, 2, ranura);
    printf("Después: %s", ranura);

    /* La última ranura, sin saber cuántas hay: 20 bytes antes del final */
    off_t pos = lseek(fd, -TAM_RANURA, SEEK_END);
    read(fd, ranura, TAM_RANURA);
    ranura[TAM_RANURA] = '\0';
    printf("Última (byte %ld): %s", (long) pos, ranura);

    /* Una ranura que no existe: read devuelve 0 */
    ssize_t n = leer_ranura(fd, 7, ranura);
    printf("Ranura 7: read devuelve %zd (vacía)\n", n);
    printf("Tamaño: %ld bytes (no ha crecido)\n", (long) lseek(fd, 0, SEEK_END));
    close(fd);
    return 0;
}
