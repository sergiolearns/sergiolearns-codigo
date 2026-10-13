/*
 * Solución Ejercicio 3
 * Del artículo «Métodos en Java — ejercicios con conversores, estadísticas y un juego de adivinar (y el return que el compilador no veía)»
 * https://sergiolearns.com/metodos-en-java-ejercicios/
 */

import java.util.Scanner;

public class AdivinaNumero {

    // ---------- Sobrecarga: dos versiones de leerEntero ----------

    // Versión 1: lee un entero, el que sea
    private static int leerEntero(Scanner sc, String mensaje) {
        System.out.print(mensaje);
        return sc.nextInt();
    }

    // Versión 2: lo repite hasta que esté entre min y max.
    // No duplica código de lectura: llama a la versión 1
    private static int leerEntero(Scanner sc, String mensaje, int min, int max) {
        int valor = leerEntero(sc, mensaje);
        while (valor < min || valor > max) {
            System.out.println("✗ Debe estar entre " + min + " y " + max);
            valor = leerEntero(sc, mensaje);
        }
        return valor;
    }

    // Devuelve el texto de ayuda según si el intento se quedó corto o se pasó
    private static String pista(int intento, int secreto) {
        if (intento < secreto) {
            return "Más alto ↑";
        }
        return "Más bajo ↓";    // si llegamos aquí, el intento es mayor (el igual se trata antes)
    }

    // Juega UNA partida. Devuelve los intentos usados si acierta, o -1 si se le acaban
    private static int jugarPartida(Scanner sc, int secreto, int maxIntentos) {
        for (int n = 1; n <= maxIntentos; n++) {
            // Un intento fuera de rango no llega aquí: leerEntero lo repite y no consume la vuelta
            int intento = leerEntero(sc, "Intento " + n + "/" + maxIntentos + " (1-100): ", 1, 100);

            if (intento == secreto) {
                System.out.println("✓ ¡Acertaste!");
                return n;    // sale del método entero, con el número de intentos usados
            }
            System.out.println(pista(intento, secreto));
        }
        // Si el for termina, es que se agotaron los intentos sin acertar
        System.out.println("✗ Sin intentos. El número era " + secreto);
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        final int SECRETO = 42;       // final = no se puede modificar; en mayúsculas por convención
        final int MAX_INTENTOS = 7;
        int mejor = -1;               // -1 = "todavía no he ganado ninguna"
        String otra;

        System.out.println("=== ADIVINA EL NÚMERO ===");
        do {
            int usados = jugarPartida(sc, SECRETO, MAX_INTENTOS);

            // Actualizamos la mejor partida solo si ganó (usados != -1) y es la primera o mejora la anterior
            if (usados != -1 && (mejor == -1 || usados < mejor)) {
                mejor = usados;
            }

            System.out.print("¿Jugar otra vez? (s/n): ");
            otra = sc.next();    // next() lee una palabra suelta, suficiente para "s" o "n"
            System.out.println();
        } while (otra.equalsIgnoreCase("s"));

        if (mejor == -1) {
            System.out.println("No ganaste ninguna partida");
        } else {
            // Ternario para singular/plural: "1 intento" pero "3 intentos"
            System.out.println("Mejor partida: " + mejor + (mejor == 1 ? " intento" : " intentos"));
        }

        sc.close();
    }
}
