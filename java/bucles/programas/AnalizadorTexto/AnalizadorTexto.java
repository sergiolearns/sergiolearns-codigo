/*
 * Bucles en Java práctica — Programa 1: Analizador de texto
 * Del artículo «Bucles en Java — práctica con texto, estadísticas y patrones»
 * https://sergiolearns.com/bucles-en-java-practica/
 */

import java.util.Scanner;

public class AnalizadorTexto {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("=== ANALIZADOR DE TEXTO ===");
        System.out.println();

        System.out.print("Escribe una frase: ");
        String frase = sc.nextLine();

        // FORMA 1 — con charAt() y un for con índice
        // Es la más directa cuando necesitas saber también la posición
        int letras = 0, digitos = 0, espacios = 0, mayusculas = 0;

        for (int i = 0; i < frase.length(); i++) {
            char c = frase.charAt(i);    // el carácter en la posición i

            if (Character.isLetter(c)) {
                letras++;
                if (Character.isUpperCase(c)) {
                    mayusculas++;
                }
            } else if (Character.isDigit(c)) {
                digitos++;
            } else if (c == ' ') {
                espacios++;
            }
        }

        // FORMA 2 — con toCharArray() y for-each
        // Más limpia cuando solo te interesa el carácter, no su posición
        int vocales = 0;
        for (char c : frase.toLowerCase().toCharArray()) {
            // toLowerCase() antes de comparar — así "A" y "a" cuentan igual
            if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
                vocales++;
            }
        }

        System.out.println();
        System.out.println("--- Resultado ---");
        System.out.printf("Longitud total:  %d caracteres%n", frase.length());
        System.out.printf("Letras:          %d%n", letras);
        System.out.printf("  De las cuales, mayúsculas: %d%n", mayusculas);
        System.out.printf("Vocales:         %d%n", vocales);
        System.out.printf("Dígitos:         %d%n", digitos);
        System.out.printf("Espacios:        %d%n", espacios);

        // Palíndromo — comprobamos leyendo desde los dos extremos a la vez
        String limpio = frase.toLowerCase().replace(" ", "");
        boolean esPalindromo = true;
        for (int i = 0; i < limpio.length() / 2; i++) {
            // Comparamos el carácter i-ésimo desde el principio con el i-ésimo desde el final
            if (limpio.charAt(i) != limpio.charAt(limpio.length() - 1 - i)) {
                esPalindromo = false;
                break;    // en cuanto encontramos una diferencia, no hace falta seguir
            }
        }
        System.out.printf("¿Es palíndromo?  %s%n", esPalindromo ? "Sí" : "No");

        sc.close();
    }
}
