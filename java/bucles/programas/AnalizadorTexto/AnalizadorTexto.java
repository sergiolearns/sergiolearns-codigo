/*
 * Programa 1: analizador de texto
 * Del artículo «Bucles en Java — práctica con un analizador de texto, el adivino que por fin repite y un generador de patrones (y la vuelta de más que me tumbó el programa)»
 * https://sergiolearns.com/bucles-en-java-practica/
 */
import java.util.Scanner;

/**
 * Analizador de texto: recorre una frase carácter a carácter con for e índice y con for-each,
 * cuenta lo que hay y mira si es un palíndromo comparando desde los dos extremos.
 */
public class AnalizadorTexto {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("=== ANALIZADOR DE TEXTO ===");
        System.out.print("Frase: ");
        String frase = sc.nextLine();

        // 1. Contadores: todos empiezan en 0 y cada vuelta suma donde toque
        int letras = 0, vocales = 0, digitos = 0, espacios = 0, mayusculas = 0;
        for (int i = 0; i < frase.length(); i++) {        // < y no <=: la última posición es length() - 1
            char c = frase.charAt(i);
            if (Character.isLetter(c)) {
                letras++;
                if ("aeiouáéíóúAEIOUÁÉÍÓÚ".indexOf(c) >= 0) {   // ¿está c en la lista de vocales?
                    vocales++;
                }
                if (Character.isUpperCase(c)) {
                    mayusculas++;
                }
            } else if (Character.isDigit(c)) {
                digitos++;
            } else if (c == ' ') {
                espacios++;
            }
        }
        System.out.println("Caracteres: " + frase.length());
        System.out.println("Letras: " + letras + " (vocales: " + vocales + ", mayúsculas: " + mayusculas + ")");
        System.out.println("Dígitos: " + digitos + ", espacios: " + espacios);

        // 2. Al revés: recorrer de la última posición a la 0
        String alReves = "";
        for (int i = frase.length() - 1; i >= 0; i--) {
            alReves += frase.charAt(i);
        }
        System.out.println("Al revés: " + alReves);

        // 3. Palíndromo: primero solo letras y en minúscula (for-each: aquí no hace falta la posición)
        String limpia = "";
        for (char c : frase.toLowerCase().toCharArray()) {
            if (Character.isLetter(c)) {
                limpia += c;
            }
        }
        // Dos índices que se acercan: i desde el principio, j desde el final. Basta con llegar a la mitad.
        boolean palindromo = true;
        int comparaciones = 0;
        for (int i = 0, j = limpia.length() - 1; i < j; i++, j--) {
            comparaciones++;
            if (limpia.charAt(i) != limpia.charAt(j)) {
                palindromo = false;
                break;                                    // en cuanto falla una pareja, ya no lo es
            }
        }
        System.out.println("Solo letras: " + limpia + " (" + limpia.length() + ")");
        System.out.println("¿Palíndromo? " + (palindromo ? "sí" : "no") + " (parejas comparadas: " + comparaciones + ")");
        sc.close();
    }
}
