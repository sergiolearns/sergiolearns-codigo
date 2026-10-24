/*
 * Structs y cadenas en C práctica — Programa 3: La taquilla con memoria dinámica
 * Del artículo «Structs y cadenas en C — práctica con la sala de un cine, un buscador de espectadores y una taquilla en el heap (y la Lucía que el programa juraba que no existía)»
 * https://sergiolearns.com/structs-y-cadenas-en-c-practica/
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct venta {
    char *pelicula;   // puntero: cada título ocupa en el heap justo lo que necesita
    int entradas;
    double precio;    // precio de una entrada
};

// Un struct dentro de otro: el vector dinámico y sus dos contadores van juntos
struct taquilla {
    struct venta *ventas;
    int n;            // ventas guardadas
    int cap;          // casillas reservadas
};

// Copia el texto en el heap: strlen + 1 para que quepa el '\0'
char *copiar_texto(const char *s) {
    char *copia = malloc(strlen(s) + 1);
    if (copia != NULL)
        strcpy(copia, s);
    return copia;
}

// Añade una venta; si el vector está lleno, duplica su capacidad con realloc
int anadir(struct taquilla *t, const char *peli, int entradas, double precio) {
    if (t->n == t->cap) {
        int nueva = t->cap * 2;
        // tmp: si realloc falla, t->ventas sigue apuntando al bloque viejo y no se pierde
        struct venta *tmp = realloc(t->ventas, nueva * sizeof *tmp);
        if (tmp == NULL)
            return 0;
        t->ventas = tmp;
        printf("  (realloc: capacidad %d -> %d)\n", t->cap, nueva);
        t->cap = nueva;
    }
    // v apunta a la primera casilla libre
    struct venta *v = &t->ventas[t->n];
    v->pelicula = copiar_texto(peli);
    if (v->pelicula == NULL)
        return 0;
    v->entradas = entradas;
    v->precio = precio;
    t->n++;
    printf("  + %-12s -> %zu bytes para el título\n", peli, strlen(peli) + 1);
    return 1;
}

// Primero lo de dentro (cada título) y después el vector: al revés perderíamos los punteros
void liberar(struct taquilla *t) {
    for (int i = 0; i < t->n; i++)
        free(t->ventas[i].pelicula);
    free(t->ventas);
    t->ventas = NULL;
    t->n = t->cap = 0;
}

int main(void) {
    struct taquilla t = {malloc(2 * sizeof(struct venta)), 0, 2};
    if (t.ventas == NULL)
        return 1;
    printf("Ventas del día:\n");
    anadir(&t, "Coco", 12, 6.50);
    anadir(&t, "Interstellar", 30, 8.00);
    anadir(&t, "Up", 7, 6.50);
    // Otra sesión de la misma película: es otra venta
    anadir(&t, "Coco", 5, 6.50);
    anadir(&t, "Wonka", 18, 7.00);

    double total = 0;
    char linea[64];
    printf("Resumen:\n");
    for (int i = 0; i < t.n; i++) {
        struct venta *v = &t.ventas[i];
        double importe = v->entradas * v->precio;
        total += importe;
        // La línea se monta en un buffer con tamaño conocido: snprintf no se pasa de 64
        snprintf(linea, sizeof linea, "  %-12s %3d x %5.2f = %7.2f", v->pelicula, v->entradas, v->precio, importe);
        puts(linea);
    }
    printf("Total del día: %.2f euros\n", total);

    // ¿Cuántas entradas de Coco? Se compara el texto, no los punteros
    int coco = 0;
    for (int i = 0; i < t.n; i++)
        if (strcmp(t.ventas[i].pelicula, "Coco") == 0)
            coco += t.ventas[i].entradas;
    printf("Entradas de Coco: %d\n", coco);
    liberar(&t);
    return 0;
}
