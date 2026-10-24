/*
 * El preprocesador en C práctica — Programa 3: Tres modelos en un solo archivo (compila con -DMODELO=1, 2 o 3)
 * Del artículo «El preprocesador en C — práctica con el panel de un ascensor, un registro de depuración y tres modelos en un solo archivo (y la entrega que llegó llena de trazas)»
 * https://sergiolearns.com/preprocesador-en-c-practica/
 */
#include <stdio.h>

#ifndef MODELO
#define MODELO 1        /* sin -DMODELO=..., se compila el básico */
#endif

#if MODELO == 1
#define NOMBRE_MODELO "Básico"
#define PLANTAS 4
#define CARGA_MAXIMA 630
#elif MODELO == 2
#define NOMBRE_MODELO "Residencial"
#define PLANTAS 10
#define CARGA_MAXIMA 1000
#define CON_PANTALLA
#elif MODELO == 3
#define NOMBRE_MODELO "Hospital"
#define PLANTAS 12
#define CARGA_MAXIMA 2500
#define CON_PANTALLA
#define CON_CAMILLA
#else
#error "MODELO tiene que ser 1, 2 o 3"
#endif

#define PERSONAS_MAX (CARGA_MAXIMA / 75)   /* división entera: se redondea hacia abajo */

int main(void) {
    printf("Modelo %d (%s)\n", MODELO, NOMBRE_MODELO);
    printf("Plantas: 0-%d | Carga: %d kg | Personas: %d\n",
           PLANTAS - 1, CARGA_MAXIMA, PERSONAS_MAX);

#ifdef CON_PANTALLA
    printf("Pantalla: muestra la planta y la carga\n");
#else
    printf("Sin pantalla: solo botones\n");
#endif

#ifdef CON_CAMILLA
    printf("Modo camilla: puertas abiertas 20 s\n");
#endif
    return 0;
}
