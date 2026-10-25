/*
 * Llamadas al sistema en C práctica — Programa 1: Guardar las partidas
 * Del artículo «Llamadas al sistema en C — práctica guardando, copiando y editando partidas con open, read, write y lseek (y la copia que medía 96 bytes)»
 * https://sergiolearns.com/llamadas-al-sistema-en-c-practica/
 */
#include <stdio.h>
#include <fcntl.h>      /* open y las constantes O_... */
#include <unistd.h>     /* read, write, lseek, close */

#define TAM_RANURA 20

int main(void) {
    const char *nombres[] = {"Lia", "Max", "Ane", "Teo"};
    int niveles[] = {3, 12, 5, 7};
    int puntos[] = {450, 2750, 980, 1200};

    /* O_TRUNC: cada vez que guardamos, el fichero empieza de cero */
    int fd = open("partidas.sav", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (fd == -1) {
        perror("partidas.sav");
        return 1;
    }

    char ranura[64];                          /* de sobra: snprintf nunca se sale */
    for (int i = 0; i < 4; i++) {
        /* %-6s: nombre a la izquierda en 6 huecos; %02d y %04d: ceros delante */
        int n = snprintf(ranura, sizeof ranura, "%-6snivel %02d %04d\n",
                         nombres[i], niveles[i], puntos[i]);
        ssize_t escritos = write(fd, ranura, n);  /* n = 20: sin el '\0' */
        if (escritos != TAM_RANURA) {
            perror("write");
            close(fd);
            return 1;
        }
        printf("Ranura %d: write devuelve %zd, el puntero queda en %ld\n",
               i, escritos, (long) lseek(fd, 0, SEEK_CUR));
    }
    close(fd);

    /* Releer el fichero y volcarlo a la salida estándar (fd 1) */
    fd = open("partidas.sav", O_RDONLY);
    if (fd == -1) {
        perror("partidas.sav");
        return 1;
    }
    char buf[64];
    ssize_t leidos;
    printf("--- partidas.sav ---\n");
    fflush(stdout);                           /* vacía printf antes de usar write */
    while ((leidos = read(fd, buf, sizeof buf)) > 0)
        write(1, buf, leidos);                /* leidos, no sizeof buf */
    close(fd);
    return 0;
}
