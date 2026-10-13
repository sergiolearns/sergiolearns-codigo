/*
 * Métodos en java práctica — Programa 2: Validador de contraseña
 * Del artículo «Métodos en Java — práctica: tres programas que crecen a base de trocitos»
 * https://sergiolearns.com/metodos-en-java-practica/
 */

import java.util.Scanner;

public class ValidadorPassword {

    // ---------- Piezas pequeñas: cada una comprueba UNA cosa ----------
    // Todas son private: son ladrillos internos, no la API de la clase.
    // Todas devuelven boolean: la respuesta es sí o no.

    private static boolean tieneLongitudMinima(String pw, int minimo) {
        return pw.length() >= minimo;    // la propia comparación ya ES un boolean
    }

    private static boolean tieneMayuscula(String pw) {
        for (int i = 0; i < pw.length(); i++) {
            if (Character.isUpperCase(pw.charAt(i))) {
                return true;    // con UNA mayúscula basta: cortamos ya, sin mirar el resto
            }
        }
        return false;    // si el bucle termina sin encontrar ninguna, es que no hay
    }

    private static boolean tieneDigito(String pw) {
        for (int i = 0; i < pw.length(); i++) {
            if (Character.isDigit(pw.charAt(i))) {
                return true;
            }
        }
        return false;
    }

    private static boolean tieneEspacios(String pw) {
        return pw.contains(" ");    // contains devuelve true si el texto aparece dentro
    }

    // ---------- La pieza que las junta ----------
    // public: es la que usaría cualquier otra parte del programa.
    public static boolean esValida(String pw) {
        // && corta en cuanto una es false: si es corta, ni mira lo demás
        return tieneLongitudMinima(pw, 8)
                && tieneMayuscula(pw)
                && tieneDigito(pw)
                && !tieneEspacios(pw);    // ! porque queremos que NO tenga espacios
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== VALIDADOR DE CONTRASEÑA ===");
        System.out.print("Contraseña: ");
        String pw = sc.nextLine();    // nextLine porque una contraseña puede llevar espacios

        System.out.println();
        System.out.println("--- Requisitos ---");
        // El operador ternario decide qué símbolo pintar según el boolean que devuelve el método
        System.out.println("8 caracteres o más: " + (tieneLongitudMinima(pw, 8) ? "✓" : "✗"));
        System.out.println("Al menos una mayúscula: " + (tieneMayuscula(pw) ? "✓" : "✗"));
        System.out.println("Al menos un dígito: " + (tieneDigito(pw) ? "✓" : "✗"));
        System.out.println("Sin espacios: " + (!tieneEspacios(pw) ? "✓" : "✗"));

        System.out.println();
        System.out.println(esValida(pw) ? "Contraseña válida" : "Contraseña no válida");

        sc.close();
    }
}
