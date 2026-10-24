/*
 * Structs y cadenas en C práctica — Programa 2: El buscador de espectadores
 * Del artículo «Structs y cadenas en C — práctica con la sala de un cine, un buscador de espectadores y una taquilla en el heap (y la Lucía que el programa juraba que no existía)»
 * https://sergiolearns.com/structs-y-cadenas-en-c-practica/
 */
#include <stdio.h>
#include <string.h>
#include <ctype.h>

#define MAX 20

struct espectador {
    char nombre[MAX];   // tal y como llegó del formulario
    char clave[MAX];    // normalizado: sin espacios sobrantes y en minúsculas
    char butaca[4];     // "A3", "C12"...: 3 caracteres + '\0'
};

// Copia origen en destino quitando los espacios del principio, del final y los repetidos,
// y pasando todo a minúsculas. tam es el tamaño de destino
void normalizar(char *destino, const char *origen, size_t tam) {
    size_t j = 0;
    int espacio_pendiente = 0;
    // Salta los espacios iniciales
    while (*origen == ' ')
        origen++;
    // tam - 1: siempre dejamos sitio para el '\0'
    for (; *origen != '\0' && j < tam - 1; origen++) {
        if (*origen == ' ') {
            // No lo escribimos aún: si es un espacio final, nunca se escribirá
            espacio_pendiente = 1;
            continue;
        }
        // Un solo espacio entre palabras, y solo si cabe junto a la letra que viene
        if (espacio_pendiente && j < tam - 2)
            destino[j++] = ' ';
        espacio_pendiente = 0;
        // (unsigned char): tolower espera un valor no negativo
        destino[j++] = (char)tolower((unsigned char)*origen);
    }
    // Sin esto no sería una cadena
    destino[j] = '\0';
}

// Un struct se puede asignar entero: el intercambio mueve todos sus campos de golpe
void intercambiar(struct espectador *a, struct espectador *b) {
    struct espectador tmp = *a;
    *a = *b;
    *b = tmp;
}

// Burbuja por la clave: strcmp(...) > 0 significa "v[j] va después que v[j + 1]"
void ordenar(struct espectador v[], int n) {
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - 1 - i; j++)
            if (strcmp(v[j].clave, v[j + 1].clave) > 0)
                intercambiar(&v[j], &v[j + 1]);
}

int main(void) {
    struct espectador v[] = {
        {"  Lucia  Perez", "", "A3"},
        {"marcos", "", "A4"},
        {"ANA lopez ", "", "B1"},
        {"Ivan", "", "C5"},
        {"ana Garcia", "", "B2"},
    };
    int n = sizeof v / sizeof v[0];
    for (int i = 0; i < n; i++)
        normalizar(v[i].clave, v[i].nombre, sizeof v[i].clave);
    ordenar(v, n);
    printf("Lista ordenada:\n");
    for (int i = 0; i < n; i++)
        printf("  %-3s [%s]\n", v[i].butaca, v[i].clave);

    // Búsqueda exacta: se normaliza también lo buscado y se compara con strcmp, nunca con ==
    char buscado[MAX];
    normalizar(buscado, "  LUCIA perez", sizeof buscado);
    for (int i = 0; i < n; i++)
        if (strcmp(v[i].clave, buscado) == 0)
            printf("\"%s\" está en la %s\n", buscado, v[i].butaca);

    // Búsqueda por prefijo: strncmp compara solo los primeros strlen(prefijo) caracteres
    const char *prefijo = "ana";
    printf("Empiezan por \"%s\":", prefijo);
    for (int i = 0; i < n; i++)
        if (strncmp(v[i].clave, prefijo, strlen(prefijo)) == 0)
            printf(" %s", v[i].butaca);
    printf("\n");
    return 0;
}
