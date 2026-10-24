/*
 * Solución Ejercicio 1: la calculadora de aforo
 * Del artículo «El preprocesador en C — ejercicios con el aforo de un ascensor, un limitador de plantas y un simulador con trazas (y el DEBUG 0 que no apagaba nada)»
 * https://sergiolearns.com/preprocesador-en-c-ejercicios/
 */
#include <stdio.h>

#define CARGA_MAXIMA 1500
#define PESO_ADULTO 75
#define PESO_NINO 35
#define NUM_GRUPOS 4

/* Paréntesis en cada parámetro: así PESO_GRUPO(a + 1, n) sigue funcionando */
#define PESO_GRUPO(adultos, ninos) ((adultos) * PESO_ADULTO + (ninos) * PESO_NINO)
#define CABE(kg) ((kg) <= CARGA_MAXIMA)    /* <= : justo 1500 kg todavía cabe */

int main(void) {
    int adultos[NUM_GRUPOS] = {4, 15, 20, 16};
    int ninos[NUM_GRUPOS]   = {2, 6, 0, 10};

    for (int i = 0; i < NUM_GRUPOS; i++) {
        int kg = PESO_GRUPO(adultos[i], ninos[i]);
        int con_uno_mas = PESO_GRUPO(adultos[i] + 1, ninos[i]);   /* prueba de fuego */
        printf("Grupo %d (%2d+%2d): %4d kg %-9s | con un adulto más: %4d kg %s\n",
               i + 1, adultos[i], ninos[i], kg, CABE(kg) ? "cabe" : "NO cabe",
               con_uno_mas, CABE(con_uno_mas) ? "cabe" : "NO cabe");
    }
    return 0;
}
