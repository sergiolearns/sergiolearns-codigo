/*
 * Solución del ejercicio 3: adivina el número
 * Del artículo «Métodos en Java — ejercicios con un conversor, la semana de temperaturas y el adivino del 31 (y el return que el compilador no veía)»
 * https://sergiolearns.com/metodos-en-java-ejercicios/
 */
import java.util.Random;
import java.util.Scanner;

public class AdivinaNumero {

    // ---------- Sobrecarga: dos versiones de leerEntero ----------

    // Versión 1: muestra el mensaje y lee un entero, el que sea
    private static int leerEntero(Scanner sc, String mensaje) {
        System.out.print(mensaje);
        return sc.nextInt();
    }

    // Versión 2: repite hasta que esté entre min y max. No copia la lectura: llama a la versión 1
    private static int leerEntero(Scanner sc, String mensaje, int min, int max) {
        int valor = leerEntero(sc, mensaje);
        while (valor < min || valor > max) {
            System.out.println("Fuera de rango (" + min + "-" + max + "): no cuenta.");
            valor = leerEntero(sc, mensaje);
        }
        return valor;
    }

    // Devuelve la pista; el caso de acertar se trata antes de llamarla
    private static String pista(int intento, int secreto) {
        if (intento < secreto) {
            return "Más alto.";
        }
        return "Más bajo.";
    }

    // UNA partida completa: el bloque que en Control de flujo se copiaba tres veces, escrito una vez.
    // Devuelve cuántos intentos usó si acierta, o -1 si se le acaban.
    private static int jugarPartida(Scanner sc, int secreto, int maxIntentos) {
        for (int n = 1; n <= maxIntentos; n++) {
            // leerEntero con rango no deja pasar un 150: ese intento no gasta vuelta del for
            int intento = leerEntero(sc, "Intento " + n + "/" + maxIntentos + ": ", 1, 100);
            if (intento == secreto) {
                System.out.println("¡Acertaste!");
                return n;    // sale del método entero, con el número de intentos
            }
            System.out.println(pista(intento, secreto));
        }
        System.out.println("Sin intentos. Era el " + secreto + ".");
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        final int MAX_INTENTOS = 7;
        // Semilla 42: el mismo 31 de Control de flujo y Bucles. Se elige UNA vez para toda la sesión.
        final int SECRETO = new Random(42).nextInt(100) + 1;
        int mejor = -1;    // -1 = "todavía no he ganado ninguna"
        String otra;

        System.out.println("=== ADIVINA EL NÚMERO (1-100) ===");
        do {
            int usados = jugarPartida(sc, SECRETO, MAX_INTENTOS);
            // Solo cuenta si ganó, y si es la primera victoria o mejora la anterior
            if (usados != -1 && (mejor == -1 || usados < mejor)) {
                mejor = usados;
            }
            System.out.print("¿Jugar otra vez? (s/n): ");
            otra = sc.next();
            System.out.println();
        } while (otra.equalsIgnoreCase("s"));    // equalsIgnoreCase, nunca == con String

        if (mejor == -1) {
            System.out.println("No ganaste ninguna partida.");
        } else {
            System.out.println("Mejor partida: " + mejor + (mejor == 1 ? " intento" : " intentos"));
        }
        sc.close();
    }
}
