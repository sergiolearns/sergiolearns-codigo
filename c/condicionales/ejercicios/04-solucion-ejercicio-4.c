/*
 * Solución del ejercicio 4: calculadora de tarifas de transporte
 * Del artículo «Condicionales en C — ejercicios con notas, triángulos, un login sin bucles y las tarifas de la guagua (y el saldo de 1,10 € que no era 1,10 €)»
 * https://sergiolearns.com/condicionales-en-c-ejercicios/
 */

#include <stdio.h>

int main(void) {
    int edad, tarjeta_joven, zonas, hora;
    int tipo;                        // 0 normal, 1 menor de 4, 2 infantil, 3 joven, 4 mayor
    double precio_base, porcentaje, descuento, subtotal, recargo, total;

    printf("=== TARIFAS DE LA GUAGUA ===\n");
    printf("Edad: ");
    scanf("%d", &edad);
    printf("¿Tienes tarjeta joven? (1 = sí, 0 = no): ");
    scanf("%d", &tarjeta_joven);
    printf("Número de zonas: ");
    scanf("%d", &zonas);
    printf("Hora de salida (0-23): ");
    scanf("%d", &hora);

    if (zonas < 1 || hora < 0 || hora > 23) {
        printf("Error: datos fuera de rango\n");
        return 1;
    }

    // 1) Precio base por zonas
    if (zonas <= 3) {
        precio_base = 1.50;
    } else if (zonas <= 6) {
        precio_base = 2.50;
    } else {
        precio_base = 3.50;
    }

    // 2) Qué descuento toca. El orden importa: un niño de 10 años con tarjeta joven es niño
    if (edad < 4) {
        tipo = 1;
    } else if (edad <= 12) {
        tipo = 2;
    } else if (edad <= 25 && tarjeta_joven) {
        tipo = 3;
    } else if (edad >= 65) {
        tipo = 4;
    } else {
        tipo = 0;
    }

    printf("\n--- Desglose ---\n");
    printf("Precio base (%d zonas): %.2f €\n", zonas, precio_base);

    // 3) tipo vale un número exacto: switch elige porcentaje y texto a la vez
    switch (tipo) {
        case 1:
            porcentaje = 100;
            printf("Descuento menor de 4 años: ");
            break;
        case 2:
            porcentaje = 50;
            printf("Descuento infantil: ");
            break;
        case 3:
            porcentaje = 30;
            printf("Descuento tarjeta joven: ");
            break;
        case 4:
            porcentaje = 40;
            printf("Descuento mayores de 65: ");
            break;
        default:
            porcentaje = 0;
            printf("Sin descuento: ");
            break;
    }
    descuento = precio_base * porcentaje / 100;
    printf("-%.2f € (%.0f %%)\n", descuento, porcentaje);
    subtotal = precio_base - descuento;
    printf("Subtotal: %.2f €\n", subtotal);

    // 4) Recargo de hora punta: 7 a 9 o 17 a 19, sobre el subtotal
    int hora_punta = (hora >= 7 && hora <= 9) || (hora >= 17 && hora <= 19);
    recargo = hora_punta ? subtotal * 0.20 : 0;
    if (hora_punta) {
        printf("Recargo hora punta: +%.2f € (20 %%)\n", recargo);
    }
    total = subtotal + recargo;
    printf("TOTAL: %.2f €\n", total);
    return 0;
}
