/*
 * Tipos y variables en C práctica — Programa 3: Ficha de estudiante con datos personales
 * Del artículo «Tipos y variables en C — 3 programas reales en gedit y Fedora»
 * https://sergiolearns.com/tipos-y-variables-en-c-practica/
 */

#include <stdio.h>

int main() {
    /* Datos del estudiante */
    int dni;
    char inicial_nombre;
    char inicial_apellido;
    int edad;
    float nota_media;
    int creditos;
    int anio_ingreso; // en C no hay "ñ"

    /* Entrada de datos */
    printf("=== FICHA DE ESTUDIANTE ===\n\n");

    printf("DNI (solo números): ");
    scanf("%d", &dni);

    printf("Inicial del nombre: ");
    scanf(" %c", &inicial_nombre);    /* espacio antes de %c — importante */

    printf("Inicial del apellido: ");
    scanf(" %c", &inicial_apellido);

    printf("Edad: ");
    scanf("%d", &edad);

    printf("Nota media (0-10): ");
    scanf("%f", &nota_media);

    printf("Créditos matriculados: ");
    scanf("%d", &creditos);

    printf("Año de ingreso: ");
    scanf("%d", &anio_ingreso);

    /* Cálculos */
    int anios_carrera = 2026 - anio_ingreso;
    float nota_sobre_100 = nota_media * 10;
    int aprobado = (nota_media >= 5.0);

    /* Mostrar ficha */
    printf("\n=============================\n");
    printf("     FICHA DE ESTUDIANTE\n");
    printf("=============================\n");
    printf("DNI:          %d\n",    dni);
    printf("Iniciales:    %c.%c.\n", inicial_nombre, inicial_apellido);
    printf("Edad:         %d años\n", edad);
    printf("Nota media:   %.2f/10 (%.1f/100)\n", nota_media, nota_sobre_100);
    printf("Créditos:     %d\n",    creditos);
    printf("Ingreso:      %d (%d año/s)\n", anio_ingreso, anios_carrera);
    printf("Estado:       %s\n",    aprobado ? "Aprobado" : "Suspenso");
    printf("=============================\n");

    return 0;
}
