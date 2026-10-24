/*
 * Solución Ejercicio 3: el simulador del día (compila con y sin -DDEBUG)
 * Del artículo «El preprocesador en C — ejercicios con el aforo de un ascensor, un limitador de plantas y un simulador con trazas (y el DEBUG 0 que no apagaba nada)»
 * https://sergiolearns.com/preprocesador-en-c-ejercicios/
 */
#include <stdio.h>
#include "ascensor.h"
#include "registro.h"

#define NUM_GRUPOS 5

int main(void) {
    struct Grupo dia[NUM_GRUPOS] = {
        {0, 6, 8}, {0, 3, 25}, {4, -1, 12}, {7, 0, 41}, {-2, 5, 3}
    };
    int total_viajes = 0, total_plantas = 0, mas_lleno = 0;

    for (int i = 0; i < NUM_GRUPOS; i++) {
        struct Grupo g = dia[i];
        int viajes = DIV_ARRIBA(g.personas, PERSONAS_MAX);
        int tramo = ABS(g.destino - g.origen);
        /* ida, vuelta vacía a por más gente, ida...: 2 * viajes - 1 tramos */
        int plantas = tramo * (2 * viajes - 1);
        int en_cabina = MIN(g.personas, PERSONAS_MAX);   /* el viaje más lleno del grupo */
        LOG("viajes", viajes);
        LOG("plantas", plantas);

        printf("Grupo %d: %2d pers. %2d -> %2d | %d viaje(s), %2d plantas\n",
               i + 1, g.personas, g.origen, g.destino, viajes, plantas);
        total_viajes += viajes;
        total_plantas += plantas;
        if (en_cabina > mas_lleno)
            mas_lleno = en_cabina;
    }
    printf("Total: %d viajes, %d plantas, máximo %d personas (%d kg) a la vez\n",
           total_viajes, total_plantas, mas_lleno, mas_lleno * PESO_MEDIO);
    return 0;
}
