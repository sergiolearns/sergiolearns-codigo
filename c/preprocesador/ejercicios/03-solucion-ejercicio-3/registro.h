/*
 * Solución Ejercicio 3: el simulador del día (registro.h)
 * Del artículo «El preprocesador en C — ejercicios con el aforo de un ascensor, un limitador de plantas y un simulador con trazas (y el DEBUG 0 que no apagaba nada)»
 * https://sergiolearns.com/preprocesador-en-c-ejercicios/
 */
/* registro.h: trazas que solo existen al compilar con -DDEBUG */
#ifndef REGISTRO_H
#define REGISTRO_H

#include "ascensor.h"   /* se incluye otra vez desde el .c: la guarda lo evita */

#ifdef DEBUG
#define LOG(msg, valor) printf("  [%s:%d] %s = %d\n", __FILE__, __LINE__, msg, valor)
#else
#define LOG(msg, valor) ((void)0)
#endif

#endif  /* REGISTRO_H */
