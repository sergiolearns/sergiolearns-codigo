/*
 * Solución del ejercicio 3: sistema de login con intentos limitados
 * Del artículo «Condicionales en C — ejercicios con notas, triángulos, un login sin bucles y las tarifas de la guagua (y el saldo de 1,10 € que no era 1,10 €)»
 * https://sergiolearns.com/condicionales-en-c-ejercicios/
 */

#include <stdio.h>

int main(void) {
    char inicial;
    int pin;
    int dentro = 0;                  // 0 = todavía no ha entrado; 1 = login correcto

    printf("=== SISTEMA DE LOGIN ===\n");

    // Intento 1
    printf("\nIntento 1 de 3\n");
    printf("Inicial del usuario: ");
    scanf(" %c", &inicial);          // el espacio antes de %c se salta el Enter pendiente
    printf("PIN: ");
    scanf("%d", &pin);
    if (inicial == 's' && (pin == 1234 || pin == 5678 || pin == 9999)) {
        dentro = 1;
    } else {
        printf("✗ Usuario o PIN incorrectos\n");
    }

    // Intento 2: solo si el primero ha fallado
    if (!dentro) {
        printf("\nIntento 2 de 3\n");
        printf("Inicial del usuario: ");
        scanf(" %c", &inicial);
        printf("PIN: ");
        scanf("%d", &pin);
        if (inicial == 's' && (pin == 1234 || pin == 5678 || pin == 9999)) {
            dentro = 1;
        } else {
            printf("✗ Usuario o PIN incorrectos\n");
        }
    }

    // Intento 3: el mismo bloque otra vez (en el tema de bucles lo escribiremos una sola vez)
    if (!dentro) {
        printf("\nIntento 3 de 3\n");
        printf("Inicial del usuario: ");
        scanf(" %c", &inicial);
        printf("PIN: ");
        scanf("%d", &pin);
        if (inicial == 's' && (pin == 1234 || pin == 5678 || pin == 9999)) {
            dentro = 1;
        } else {
            printf("✗ Usuario o PIN incorrectos\n");
        }
    }

    if (dentro) {
        printf("\n✓ Acceso concedido. Bienvenido, sergio.\n");
        printf("Nivel de acceso: ");
        switch (pin) {               // pin vale un número exacto: trabajo para switch
            case 1234:
                printf("Administrador\n");
                break;
            case 5678:
                printf("Usuario\n");
                break;
            case 9999:
                printf("Invitado\n");
                break;
        }
    } else {
        printf("\nCuenta bloqueada: 3 intentos fallidos\n");
        return 1;
    }
    return 0;
}
