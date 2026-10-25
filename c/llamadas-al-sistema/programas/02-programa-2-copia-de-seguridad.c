/*
 * Llamadas al sistema en C práctica — Programa 2: Copia de seguridad
 * Del artículo «Llamadas al sistema en C — práctica guardando, copiando y editando partidas con open, read, write y lseek (y la copia que medía 96 bytes)»
 * https://sergiolearns.com/llamadas-al-sistema-en-c-practica/
 */
#include <stdio.h>
#include <fcntl.h>      /* open y las constantes O_... */
#include <unistd.h>     /* read, write, lseek, close */

#define TAM_RANURA 20
#define PARTIDAS "Lia   nivel 03 0450\n" "Max   nivel 12 2750\n" \
                 "Ane   nivel 05 0980\n" "Teo   nivel 07 1200\n"
#define TAM_BUF 32

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

/* Copia origen en destino a trozos; devuelve los bytes copiados o -1 */
static long copiar(const char *origen, const char *destino) {
    int in = open(origen, O_RDONLY);
    if (in == -1) {
        perror(origen);
        return -1;
    }
    int out = open(destino, O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (out == -1) {
        perror(destino);
        close(in);                            /* no dejes el otro abierto */
        return -1;
    }
    char buf[TAM_BUF];
    ssize_t leidos;
    long total = 0;
    int vuelta = 1;
    while ((leidos = read(in, buf, TAM_BUF)) > 0) {
        ssize_t escritos = write(out, buf, leidos);   /* solo lo que se leyó */
        if (escritos != leidos) {
            perror("write");
            break;
        }
        total += escritos;
        printf("  vuelta %d: leídos %zd, escritos %zd, total %ld\n",
               vuelta, leidos, escritos, total);
        vuelta++;
    }
    printf("  vuelta %d: read devuelve %zd -> fin\n", vuelta, leidos);
    close(in);
    close(out);
    return total;
}

int main(void) {
    if (preparar("partidas.sav") == -1)
        return 1;

    printf("Copia de partidas.sav en partidas.bak:\n");
    long n = copiar("partidas.sav", "partidas.bak");
    printf("Copiados: %ld bytes\n", n);

    int fd = open("partidas.bak", O_RDONLY);
    printf("partidas.bak mide %ld bytes\n", (long) lseek(fd, 0, SEEK_END));
    close(fd);

    printf("Copia de un fichero que no existe:\n");
    n = copiar("partidas_2019.sav", "viejas.bak");
    printf("copiar devuelve %ld\n", n);
    return 0;
}
