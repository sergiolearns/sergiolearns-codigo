/*
 * El preprocesador en C práctica — Programa 1: El panel de configuración
 * Del artículo «El preprocesador en C — práctica con el panel de un ascensor, un registro de depuración y tres modelos en un solo archivo (y la entrega que llegó llena de trazas)»
 * https://sergiolearns.com/preprocesador-en-c-practica/
 */
#include <stdio.h>
#include "config.h"   /* todas las constantes y macros salen de aquí */

int main(void) {
    /* Cada viaje: planta de destino, personas y kg extra (maletas, carros...) */
    int destino[NUM_VIAJES]  = {3, 9, -1, 5, -3, 0};
    int personas[NUM_VIAJES] = {4, 2, 19, 6, 1, 12};
    int extra[NUM_VIAJES]    = {0, 40, 0, 120, 0, 650};
    int aceptados = 0;

    printf("Capacidad: %d kg (%d personas)\n", CARGA_MAXIMA, PERSONAS_MAX);
    printf("Plantas de %d a %d\n\n", PLANTA_MIN, PLANTA_MAX);

    for (int i = 0; i < NUM_VIAJES; i++) {
        int carga = PESO_PERSONAS(personas[i]) + extra[i];
        printf("Viaje %d -> planta %2d, %2d pers., %4d kg: ",
               i + 1, destino[i], personas[i], carga);

        /* El ! funciona porque PLANTA_VALIDA lleva paréntesis exteriores */
        if (!PLANTA_VALIDA(destino[i])) {
            printf("RECHAZADO (planta fuera de rango)\n");
        } else if (SUPERA_CARGA(carga)) {
            printf("RECHAZADO (sobran %d kg)\n", carga - CARGA_MAXIMA);
        } else {
            printf("OK (quedan %d kg)\n", CARGA_MAXIMA - carga);
            aceptados++;
        }
    }
    printf("\nAceptados: %d de %d\n", aceptados, NUM_VIAJES);
    return 0;
}
