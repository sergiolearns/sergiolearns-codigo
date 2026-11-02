/*
 * Programa 2: validador de contraseña
 * Del artículo «Métodos en Java — práctica con la calculadora de Laura, su contraseña del campus y su boletín (y el formato que cambié en tres sitios de cuatro)»
 * https://sergiolearns.com/metodos-en-java-practica/
 */
import java.util.Scanner;

public class ValidadorPassword {

    // ---------- Piezas pequeñas: cada una comprueba UNA cosa ----------
    // private: son ladrillos internos. boolean: la respuesta es sí o no.

    private static boolean tieneLongitudMinima(String pw, int minimo) {
        return pw.length() >= minimo;    // la comparación ya ES un boolean: no hace falta if
    }

    private static boolean tieneMayuscula(String pw) {
        for (int i = 0; i < pw.length(); i++) {
            if (Character.isUpperCase(pw.charAt(i))) {
                return true;    // con UNA basta: return sale del método, sin break ni bandera
            }
        }
        return false;           // el bucle terminó sin encontrar ninguna
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
        return pw.contains(" ");    // contains: true si el texto aparece dentro
    }

    // ---------- La pieza que las junta (la única public) ----------
    public static boolean esValida(String pw) {
        // && se para en el primer false: si falta la mayúscula, ni mira el dígito ni los espacios
        return tieneLongitudMinima(pw, 8)
                && tieneMayuscula(pw)
                && tieneDigito(pw)
                && !tieneEspacios(pw);    // ! porque queremos que NO tenga
    }

    // Traduce un boolean a texto para la lista. Un método de una línea también merece nombre.
    private static String siNo(boolean b) {
        return b ? "sí" : "no";
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== CONTRASEÑA DEL CAMPUS VIRTUAL ===");
        System.out.print("Contraseña: ");
        String pw = sc.nextLine();    // nextLine: una contraseña puede llevar espacios
        System.out.println();

        System.out.println("--- Requisitos ---");
        System.out.println("8 caracteres o más:     " + siNo(tieneLongitudMinima(pw, 8)));
        System.out.println("Al menos una mayúscula: " + siNo(tieneMayuscula(pw)));
        System.out.println("Al menos un dígito:     " + siNo(tieneDigito(pw)));
        System.out.println("Sin espacios:           " + siNo(!tieneEspacios(pw)));
        System.out.println();
        System.out.println(esValida(pw) ? "Contraseña válida" : "Contraseña no válida");

        sc.close();
    }
}
