/*
 * Solución Ejercicio 1: la cartelera
 * Del artículo «Structs y cadenas en C — ejercicios con la cartelera, tus propias funciones de string.h y fichas de espectadores que llegan rotas (y la entrada VIP que siempre costaba 8 euros)»
 * https://sergiolearns.com/structs-y-cadenas-en-c-ejercicios/
 */
#include <stdio.h>
#include <string.h>

struct pelicula {
    char titulo[30];   // 29 caracteres como mucho + '\0'
    int minutos;
    char sala;
};

int main(void) {
    struct pelicula cartelera[] = {
        {"Coco", 105, 'A'},
        {"Interstellar", 169, 'B'},
        {"Up", 96, 'A'},
        {"La sociedad de la nieve", 144, 'C'},
    };
    int n = sizeof cartelera / sizeof cartelera[0];
    // Guardamos POSICIONES, no copias: así luego accedemos al struct original
    int mas_largo = 0, mas_titulo = 0;
    for (int i = 0; i < n; i++) {
        // Puntero para escribir p->campo en lugar de cartelera[i].campo
        struct pelicula *p = &cartelera[i];
        // División entera: 169 / 60 = 2 horas; el resto, 169 % 60 = 49 minutos
        printf("Sala %c  %-24s %d h %02d min\n", p->sala, p->titulo, p->minutos / 60, p->minutos % 60);
        if (p->minutos > cartelera[mas_largo].minutos)
            mas_largo = i;
        // strlen cuenta caracteres hasta el '\0'; sizeof daría siempre 30
        if (strlen(p->titulo) > strlen(cartelera[mas_titulo].titulo))
            mas_titulo = i;
    }
    printf("La más larga: %s (%d min)\n", cartelera[mas_largo].titulo, cartelera[mas_largo].minutos);
    printf("Título más largo: %s (%zu caracteres)\n", cartelera[mas_titulo].titulo, strlen(cartelera[mas_titulo].titulo));
    return 0;
}
