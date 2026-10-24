/*
 * Solución Ejercicio 3: fichas de espectadores que llegan rotas
 * Del artículo «Structs y cadenas en C — ejercicios con la cartelera, tus propias funciones de string.h y fichas de espectadores que llegan rotas (y la entrada VIP que siempre costaba 8 euros)»
 * https://sergiolearns.com/structs-y-cadenas-en-c-ejercicios/
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

struct ficha {
    int dni;
    char nombre[12];   // 11 caracteres + '\0'
    char butaca[4];    // 3 caracteres + '\0'
};

// Lee "DNI;Nombre;Butaca". Devuelve 0 si va bien o el número del error
int leer_ficha(const char *linea, struct ficha *f) {
    // strchr devuelve un puntero al ';' (o NULL): así sabemos dónde acaba cada campo
    const char *p1 = strchr(linea, ';');
    if (p1 == NULL)
        return 1;
    const char *p2 = strchr(p1 + 1, ';');
    if (p2 == NULL)
        return 1;
    // Restar punteros da cuántos caracteres hay entre ellos
    size_t largo_dni = p1 - linea;
    if (largo_dni != 8)
        return 2;
    for (const char *c = linea; c < p1; c++)
        if (!isdigit((unsigned char)*c))
            return 2;
    size_t largo_nombre = p2 - (p1 + 1);
    // >= y no >: hay que dejar sitio para el '\0'
    if (largo_nombre == 0 || largo_nombre >= sizeof f->nombre)
        return 3;
    size_t largo_butaca = strlen(p2 + 1);
    if (largo_butaca < 2 || largo_butaca >= sizeof f->butaca)
        return 4;
    // Solo escribimos en f cuando todo está comprobado
    // atoi lee cifras y se para sola en el ';'
    f->dni = atoi(linea);
    // El nombre no acaba en '\0' dentro de la línea: copiamos largo_nombre bytes y lo ponemos nosotros
    memcpy(f->nombre, p1 + 1, largo_nombre);
    f->nombre[largo_nombre] = '\0';
    // La butaca es el final de la línea: ya trae su '\0'
    strcpy(f->butaca, p2 + 1);
    return 0;
}

int main(void) {
    const char *lineas[] = {
        "42345678;Pepito;A3",
        "12343278;Juan;C12",
        "1234567;Ana;B1",
        "33333333;Maximiliano Ruiz;C6",
        "44444444 Lucia A4",
        "55555555;Ivan;",
    };
    const char *errores[] = {"", "faltan los ';'", "DNI no válido", "nombre vacío o demasiado largo", "butaca no válida"};
    int n = sizeof lineas / sizeof lineas[0];
    struct ficha fichas[6];
    int validas = 0;
    for (int i = 0; i < n; i++) {
        // &fichas[validas]: la siguiente casilla libre; si la línea falla, se reutiliza
        int e = leer_ficha(lineas[i], &fichas[validas]);
        if (e == 0)
            validas++;
        else
            printf("Línea %d (%s): %s\n", i + 1, lineas[i], errores[e]);
    }
    printf("Fichas válidas: %d de %d\n", validas, n);
    for (int i = 0; i < validas; i++)
        printf("  %-3s %08d %s\n", fichas[i].butaca, fichas[i].dni, fichas[i].nombre);
    // ¿Quién está en la C12?
    for (int i = 0; i < validas; i++)
        if (strcmp(fichas[i].butaca, "C12") == 0)
            printf("En la C12 está %s\n", fichas[i].nombre);
    return 0;
}
