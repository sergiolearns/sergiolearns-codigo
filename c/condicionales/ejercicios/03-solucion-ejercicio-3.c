/*
 * Solución Ejercicio 3:
 * Del artículo «Condicionales en C — ejercicios para dominar if, else y switch»
 * https://sergiolearns.com/condicionales-en-c-ejercicios/
 */

#include <stdio.h>

int main() {
    char inicial;
    int contrasena;
    int acceso;

    printf("=== SISTEMA DE LOGIN ===\n");
    printf("Inicial del usuario (s=sergio): ");
    scanf(" %c", &inicial);
    printf("Contraseña: ");
    scanf("%d", &contrasena);

    acceso = (inicial == 's') && (contrasena == 1234 ||
             contrasena == 5678 || contrasena == 9999);

    if (inicial != 's') {
        printf("\n✗ Usuario incorrecto.\n");
        printf("Acceso denegado.\n");
        return 1;
    }

    if (contrasena == 1234 || contrasena == 5678 || contrasena == 9999) {
        printf("\n✓ Acceso concedido. Bienvenido, sergio.\n");
        printf("Nivel de acceso: ");

        switch (contrasena) {
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
        printf("\n✗ Contraseña incorrecta.\n");
        printf("Acceso denegado.\n");
    }

    return 0;
}
