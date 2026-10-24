/*
 * El preprocesador en C práctica — Programa 2: El registro de depuración (compila con y sin -DDEBUG)
 * Del artículo «El preprocesador en C — práctica con el panel de un ascensor, un registro de depuración y tres modelos en un solo archivo (y la entrega que llegó llena de trazas)»
 * https://sergiolearns.com/preprocesador-en-c-practica/
 */
#include <stdio.h>

#define CARGA_MAXIMA 1500

#ifdef DEBUG
/* Con -DDEBUG: cada traza dice archivo, línea, función y el valor */
#define LOG(msg, valor) \
    printf("  [%s:%d %s] %s = %d\n", __FILE__, __LINE__, __func__, msg, valor)
#else
/* Sin DEBUG: LOG se convierte en una expresión que no hace nada */
#define LOG(msg, valor) ((void)0)
#endif

int carga_total(const int pesos[], int n) {
    int total = 0;
    for (int i = 0; i < n; i++) {
        total += pesos[i];
        LOG("total parcial", total);   /* una traza por persona o palé */
    }
    return total;
}

void comprobar(const char *grupo, const int pesos[], int n) {
    LOG("elementos", n);
    int total = carga_total(pesos, n);
    printf("%s: %d kg -> %s\n", grupo, total,
           total > CARGA_MAXIMA ? "SOBRECARGA" : "puede subir");
}

int main(void) {
    int vecinos[] = {82, 64, 91, 70};
    int mudanza[] = {650, 420, 480};
    /* sizeof del array entre sizeof de un elemento = número de elementos */
    comprobar("Vecinos", vecinos, sizeof vecinos / sizeof vecinos[0]);
    comprobar("Mudanza", mudanza, sizeof mudanza / sizeof mudanza[0]);
    return 0;
}
