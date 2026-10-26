/*
 * Programa 3: ficha de estudiante con la letra del DNI
 * Del artículo «Tipos y variables en C — práctica con una calculadora, la nota final de IC2 y una ficha con la letra del DNI (y la división entre cero que mata el programa)»
 * https://sergiolearns.com/tipos-y-variables-en-c-practica/
 */

#include <stdio.h>
#define CREDITOS_GRADO 240      /* créditos de un grado de 4 años */

int main(void) {
    int dni;                    /* 8 cifras caben en un int (máximo 2147483647) */
    char inicial_nombre, inicial_apellido;
    int edad, creditos, anio_ingreso;   // en los nombres no se usa la ñ
    float nota_media;

    printf("=== FICHA DE ESTUDIANTE ===\n\n");
    printf("DNI (solo números): ");
    scanf("%d", &dni);
    printf("Inicial del nombre: ");
    scanf(" %c", &inicial_nombre);      /* espacio antes de %c: salta el Enter del DNI */
    printf("Inicial del apellido: ");
    scanf(" %c", &inicial_apellido);
    printf("Edad: ");
    scanf("%d", &edad);
    printf("Nota media (0-10): ");
    scanf("%f", &nota_media);
    printf("Créditos superados: ");
    scanf("%d", &creditos);
    printf("Año de ingreso: ");
    scanf("%d", &anio_ingreso);

    /* la letra del DNI: el resto de dividir entre 23 elige una letra de esta cadena */
    char letra = "TRWAGMYFPDXBNJZSQVHLCKE"[dni % 23];
    char nombre_min = inicial_nombre + 32;      /* en ASCII, minúscula = mayúscula + 32 */
    int cursos = 2026 - anio_ingreso;
    int faltan = CREDITOS_GRADO - creditos;
    float porcentaje = creditos * 100.0f / CREDITOS_GRADO;   /* 100.0f: división real */
    int aprobado = nota_media >= 5.0f;

    printf("\n=============================\n");
    printf("     FICHA DE ESTUDIANTE\n");
    printf("=============================\n");
    printf("DNI:          %08d-%c\n", dni, letra);
    printf("Iniciales:    %c.%c. (%c en minúscula)\n", inicial_nombre, inicial_apellido, nombre_min);
    printf("Edad:         %d años\n", edad);
    printf("Nota media:   %.2f/10 (%.1f/100)\n", nota_media, nota_media * 10);
    printf("Créditos:     %d de %d (%.1f %%)\n", creditos, CREDITOS_GRADO, porcentaje);
    printf("Le faltan:    %d créditos\n", faltan);
    printf("Ingreso:      %d (%d curso/s)\n", anio_ingreso, cursos);
    printf("Aprobado:     %d (1 = sí)\n", aprobado);
    printf("=============================\n");
    return 0;
}
