/*
 * El preprocesador en C práctica — Programa 1: El panel de configuración (config.h)
 * Del artículo «El preprocesador en C — práctica con el panel de un ascensor, un registro de depuración y tres modelos en un solo archivo (y la entrega que llegó llena de trazas)»
 * https://sergiolearns.com/preprocesador-en-c-practica/
 */
/* config.h: la configuración del ascensor en un solo sitio */
#ifndef CONFIG_H
#define CONFIG_H

#define CARGA_MAXIMA 1500        /* kg */
#define PESO_MEDIO 75            /* kg por persona */
#define PLANTA_MIN (-2)          /* entre paréntesis: es un número negativo */
#define PLANTA_MAX 8
#define NUM_VIAJES 6

/* Constante calculada: el preprocesador copia la cuenta, la hace el compilador */
#define PERSONAS_MAX (CARGA_MAXIMA / PESO_MEDIO)

/* Macros con parámetros: paréntesis en cada parámetro y alrededor de todo */
#define PESO_PERSONAS(n) ((n) * PESO_MEDIO)
#define SUPERA_CARGA(kg) ((kg) > CARGA_MAXIMA)
#define PLANTA_VALIDA(p) ((p) >= PLANTA_MIN && (p) <= PLANTA_MAX)

#endif  /* CONFIG_H */
