/*
 * Llamadas al sistema en C ejercicios — Solución del nivel 3: el ranking
 * Del artículo «Llamadas al sistema en C — ejercicios con contadores de bytes, O_APPEND, un ranking de partidas y tres fallos de lseek y read (y la partida que se negó a ir al principio)»
 * https://sergiolearns.com/llamadas-al-sistema-en-c-ejercicios/
 */
#include <stdio.h>
#include <fcntl.h>      /* open y las constantes O_... */
#include <unistd.h>     /* read, write, lseek, close */
#include <stdlib.h>     /* atoi */

#define TAM_RANURA 20
#define PARTIDAS "Lia   nivel 03 0450\n" "Max   nivel 12 2750\n" \
                 "Ane   nivel 05 0980\n" "Teo   nivel 07 1200\n"
#define POS_PUNTOS 15
#define POS_MARCA 3                       /* el primer espacio tras el nombre */

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
    int fd = open("partidas.sav", O_RDWR);
    if (fd == -1) {
        perror("partidas.sav");
        return 1;
    }

    /* 1. Recorrer las ranuras de una en una y quedarse con la mejor */
    char ranura[TAM_RANURA + 1];
    int n = 0, mejor = -1, max = -1;
    while (read(fd, ranura, TAM_RANURA) == TAM_RANURA) {
        ranura[TAM_RANURA] = '\0';
        int puntos = atoi(ranura + POS_PUNTOS);   /* "2750\n" -> 2750 */
        if (puntos > max) {                   /* > y no >=: en empate gana la primera */
            max = puntos;
            mejor = n;
        }
        printf("Ranura %d: %4d puntos, mejor hasta ahora: ranura %d\n", n, puntos, mejor);
        n++;
    }

    /* 2. Marcar al ganador con un '*' justo detrás del nombre */
    off_t pos = lseek(fd, (off_t) mejor * TAM_RANURA + POS_MARCA, SEEK_SET);
    write(fd, "*", 1);
    printf("Marco la ranura %d en el byte %ld\n", mejor, (long) pos);

    /* 3. Volcar el fichero entero para comprobarlo */
    char buf[128];
    lseek(fd, 0, SEEK_SET);
    ssize_t leidos = read(fd, buf, sizeof buf - 1);
    buf[leidos] = '\0';
    printf("--- partidas.sav (%zd bytes) ---\n%s", leidos, buf);
    close(fd);
    return 0;
}
