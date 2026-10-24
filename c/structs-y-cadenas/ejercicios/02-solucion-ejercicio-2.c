/*
 * Solución Ejercicio 2: tus propias funciones de string.h
 * Del artículo «Structs y cadenas en C — ejercicios con la cartelera, tus propias funciones de string.h y fichas de espectadores que llegan rotas (y la entrada VIP que siempre costaba 8 euros)»
 * https://sergiolearns.com/structs-y-cadenas-en-c-ejercicios/
 */
#include <stdio.h>
#include <string.h>

// Cuenta hasta el '\0'
size_t mi_strlen(const char *s) {
    const char *p = s;
    while (*p != '\0')
        p++;
    // La distancia entre dos punteros es el número de caracteres recorridos
    return p - s;
}

// Copia también el '\0': por eso el bucle mira el carácter DESPUÉS de copiarlo
char *mi_strcpy(char *destino, const char *origen) {
    char *d = destino;
    while ((*d++ = *origen++) != '\0')
        ;
    // Como la de verdad, devuelve destino
    return destino;
}

// Avanza mientras sean iguales y no se acabe la primera; devuelve la diferencia del primer carácter distinto
int mi_strcmp(const char *a, const char *b) {
    while (*a != '\0' && *a == *b) {
        a++;
        b++;
    }
    // unsigned char: así 'ñ' u otros bytes altos no salen negativos
    return (unsigned char)*a - (unsigned char)*b;
}

// Solo nos importa el signo: la de string.h puede devolver otro número con el mismo signo
int signo(int x) {
    return (x > 0) - (x < 0);
}

int main(void) {
    const char *pruebas[][2] = {
        {"Ana", "Ana"}, {"Ana", "Anabel"}, {"Bruno", "Ana"}, {"ana", "Ana"},
    };
    for (int i = 0; i < 4; i++) {
        const char *a = pruebas[i][0], *b = pruebas[i][1];
        printf("%-6s %-7s mi_strcmp = %4d (signo %2d) | strcmp signo %2d\n",
               a, b, mi_strcmp(a, b), signo(mi_strcmp(a, b)), signo(strcmp(a, b)));
    }
    char copia[10];
    mi_strcpy(copia, "Pepito");
    printf("mi_strcpy -> %s, mi_strlen = %zu, strlen = %zu\n", copia, mi_strlen(copia), strlen(copia));
    return 0;
}
