/*
 * Structs y cadenas en C práctica — Programa 1: La sala del cine
 * Del artículo «Structs y cadenas en C — práctica con la sala de un cine, un buscador de espectadores y una taquilla en el heap (y la Lucía que el programa juraba que no existía)»
 * https://sergiolearns.com/structs-y-cadenas-en-c-practica/
 */
#include <stdio.h>
#include <string.h>

#define FILAS 3
#define ASIENTOS 6
// 11 caracteres + '\0'
#define MAX_NOMBRE 12

struct butaca {
    int ocupada;               // 0 libre, 1 ocupada
    char nombre[MAX_NOMBRE];
};

// Lo que llega de la taquilla web
struct reserva {
    char fila;                 // 'A', 'B' o 'C'
    int numero;                // de 1 a 6, como lo cuenta el público
    const char *nombre;
};

// Devuelve 0 si reserva, 1 si ya estaba ocupada y 2 si la butaca no existe
int reservar(struct butaca sala[FILAS][ASIENTOS], struct reserva r) {
    // Las letras son números consecutivos: 'A' - 'A' = 0, 'B' - 'A' = 1...
    int f = r.fila - 'A';
    // El público cuenta desde 1; el array, desde 0
    int a = r.numero - 1;
    if (f < 0 || f >= FILAS || a < 0 || a >= ASIENTOS)
        return 2;
    // Puntero a la butaca de verdad (no una copia), para poder modificarla
    struct butaca *b = &sala[f][a];
    if (b->ocupada)
        return 1;
    b->ocupada = 1;
    // snprintf recorta si el nombre no cabe y siempre deja el '\0'
    snprintf(b->nombre, sizeof b->nombre, "%s", r.nombre);
    return 0;
}

void dibujar(struct butaca sala[FILAS][ASIENTOS]) {
    printf("     1 2 3 4 5 6\n");
    for (int f = 0; f < FILAS; f++) {
        printf("  %c  ", 'A' + f);
        for (int a = 0; a < ASIENTOS; a++)
            printf("%c ", sala[f][a].ocupada ? 'X' : '.');
        printf("\n");
    }
}

int main(void) {
    // = {0}: todas libres y todos los nombres vacíos (0 es '\0')
    struct butaca sala[FILAS][ASIENTOS] = {0};
    struct reserva pedidos[] = {
        {'A', 3, "Lucia"}, {'A', 4, "Marcos"}, {'B', 1, "Ana"},
        {'A', 3, "Pepito"},             // repetida: la A3 ya es de Lucia
        {'C', 6, "Maximiliano Ruiz"},   // nombre largo: se recorta
        {'D', 2, "Juan"},               // la fila D no existe
        {'B', 7, "Carla"},              // la butaca 7 tampoco
        {'C', 5, "Ivan"},
    };
    int n = sizeof pedidos / sizeof pedidos[0];
    const char *motivo[] = {"ok", "ocupada", "no existe"};
    int hechas = 0;
    for (int i = 0; i < n; i++) {
        int res = reservar(sala, pedidos[i]);
        printf("%c%d %-17s -> %s\n", pedidos[i].fila, pedidos[i].numero, pedidos[i].nombre, motivo[res]);
        if (res == 0)
            hechas++;
    }
    dibujar(sala);
    printf("Ocupación: %d de %d (%.1f %%)\n", hechas, FILAS * ASIENTOS, 100.0 * hechas / (FILAS * ASIENTOS));
    printf("C6 quedó a nombre de \"%s\" (%zu caracteres)\n", sala[2][5].nombre, strlen(sala[2][5].nombre));
    return 0;
}
