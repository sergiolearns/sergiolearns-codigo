/*
 * Solución Ejercicio 4:
 * Del artículo «Condicionales en C — ejercicios para dominar if, else y switch»
 * https://sergiolearns.com/condicionales-en-c-ejercicios/
 */

#include <stdio.h>

int main() {
    int edad, zonas, hora, tarjeta_joven;
    float precio_base, descuento, subtotal, recargo, total;

    printf("=== CALCULADORA DE TARIFAS ===\n");
    printf("Edad: ");              scanf("%d", &edad);
    printf("¿Tienes tarjeta joven? (1=sí, 0=no): ");
    scanf("%d", &tarjeta_joven);
    printf("Número de zonas: ");   scanf("%d", &zonas);
    printf("Hora actual (0-23): "); scanf("%d", &hora);

    /* Precio base por zonas */
    if (zonas <= 3) {
        precio_base = 1.50;
    } else if (zonas <= 6) {
        precio_base = 2.50;
    } else {
        precio_base = 3.50;
    }

    /* Descuento por edad */
    if (edad < 4) {
        descuento = precio_base;          /* gratis */
    } else if (edad <= 12) {
        descuento = precio_base * 0.50;
    } else if (edad <= 25 && tarjeta_joven) {
        descuento = precio_base * 0.30;
    } else if (edad >= 65) {
        descuento = precio_base * 0.40;
    } else {
        descuento = 0;
    }

    subtotal = precio_base - descuento;

    /* Recargo hora punta */
    int hora_punta = (hora >= 7 && hora <= 9) || (hora >= 17 && hora <= 19);
    recargo = hora_punta ? subtotal * 0.20 : 0;
    total = subtotal + recargo;

    /* Mostrar desglose */
    printf("\n--- Desglose ---\n");
    if (zonas <= 3) {
        printf("Precio base (1-3 zonas): %.2f€\n", precio_base);
    } else if (zonas <= 6) {
        printf("Precio base (4-6 zonas): %.2f€\n", precio_base);
    } else {
        printf("Precio base (7+ zonas):  %.2f€\n", precio_base);
    }

    if (descuento > 0) {
        printf("Descuento aplicado: -%.2f€\n", descuento);
    }

    printf("Subtotal: %.2f€\n", subtotal);

    if (hora_punta) {
        printf("Recargo hora punta: +%.2f€ (20%%)\n", recargo);
    }

    printf("TOTAL: %.2f€\n", total);

    return 0;
}
