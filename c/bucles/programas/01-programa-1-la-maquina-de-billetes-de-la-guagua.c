/*
 * Programa 1: la máquina de billetes de la guagua
 * Del artículo «Bucles en C — práctica con la máquina de billetes de la guagua, series y el juego de adivinar con 7 intentos (y el céntimo que la máquina me cobraba de más)»
 * https://sergiolearns.com/bucles-en-c-practica/
 */
#include <stdio.h>

// Tarifas inventadas para el ejemplo, en céntimos para que las cuentas sean exactas
#define GENERAL 150
#define JOVEN   105               // 30 % de descuento sobre 1,50 €
#define NINO      0               // menores de 6 años: gratis

int main(void) {
    int tipo;                     // 1 general, 2 joven, 3 niño, 0 cerrar
    int precio;                   // céntimos del billete elegido
    int pagado;                   // céntimos que ha metido el viajero
    int recaudado = 0;            // céntimos de toda la jornada
    int viajeros = 0;
    float dinero;                 // lo que teclea el viajero, en euros
    int c;                        // para vaciar la línea si teclean letras

    printf("=== MÁQUINA DE BILLETES - LÍNEA 12 ===\n");

    while (1) {                   // una vuelta = un viajero
        // 1. Tipo de billete: se pide al menos una vez y hasta que sea válido
        do {
            printf("\nBillete (1 general, 2 joven, 3 niño, 0 cerrar): ");
            if (scanf("%d", &tipo) != 1) {
                while ((c = getchar()) != '\n' && c != EOF);   // tira lo tecleado
                tipo = -1;                                     // fuerza otra vuelta
            }
            if (tipo < 0 || tipo > 3) {
                printf("Opción no válida\n");
            }
        } while (tipo < 0 || tipo > 3);

        if (tipo == 0) {
            break;                // cierre de la máquina: sale del while (1)
        }

        switch (tipo) {
            case 1:  precio = GENERAL; break;
            case 2:  precio = JOVEN;   break;
            default: precio = NINO;    break;
        }

        // 2. Cobro: se suman las monedas hasta llegar al precio
        pagado = 0;
        while (pagado < precio) {
            printf("Faltan %d.%02d €. Introduce dinero: ", (precio - pagado) / 100, (precio - pagado) % 100);
            if (scanf("%f", &dinero) == 1 && dinero > 0) {
                pagado += (int)(dinero * 100 + 0.5f);          // euros -> céntimos, redondeando
            } else {
                while ((c = getchar()) != '\n' && c != EOF);
                printf("Cantidad no válida\n");
            }
        }

        viajeros++;
        recaudado += precio;
        printf("Billete emitido. Cambio: %d.%02d €\n", (pagado - precio) / 100, (pagado - precio) % 100);
    }

    printf("\n--- Cierre de la jornada ---\n");
    printf("Viajeros atendidos: %d\n", viajeros);
    printf("Recaudado: %d.%02d €\n", recaudado / 100, recaudado % 100);
    return 0;
}
