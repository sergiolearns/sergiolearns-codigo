/*
 * Solución Ejercicio 3: el simulador del día (ascensor.h)
 * Del artículo «El preprocesador en C — ejercicios con el aforo de un ascensor, un limitador de plantas y un simulador con trazas (y el DEBUG 0 que no apagaba nada)»
 * https://sergiolearns.com/preprocesador-en-c-ejercicios/
 */
/* ascensor.h: constantes, macros y el struct del simulador */
#ifndef ASCENSOR_H
#define ASCENSOR_H

#define CARGA_MAXIMA 1500
#define PESO_MEDIO 75
#define PERSONAS_MAX (CARGA_MAXIMA / PESO_MEDIO)        /* 20 */

#define ABS(x) ((x) < 0 ? -(x) : (x))
#define MIN(a, b) ((a) < (b) ? (a) : (b))
#define DIV_ARRIBA(a, b) (((a) + (b) - 1) / (b))        /* división redondeando hacia arriba */

struct Grupo {
    int origen;
    int destino;
    int personas;
};

#endif  /* ASCENSOR_H */
