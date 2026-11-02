/*
 * Ejercicio 2: contar palabras y vocales
 * Del artículo «Strings en Java — ejercicios con palíndromos, palabras y cifrado César (y una trampa con == que no vi a tiempo)»
 * https://sergiolearns.com/strings-en-java-ejercicios/
 */

public class PalabrasVocales {

    // Pasa a minúsculas y quita tildes y eñes
    static String normalizar(String s) {
        String r = s.trim().toLowerCase();
        r = r.replace('á', 'a');
        r = r.replace('é', 'e');
        r = r.replace('í', 'i');
        r = r.replace('ó', 'o');
        r = r.replace('ú', 'u');
        r = r.replace('ü', 'u');
        r = r.replace('ñ', 'n');
        return r;
    }

    static int contarPalabras(String texto) {
        String limpio = texto.trim();
        if (limpio.isEmpty()) {
            return 0;                                // "".split("\\s+") daría 1 elemento (una String vacía)
        }
        return limpio.split("\\s+").length;
    }

    static int contarVocales(String palabra) {
        String p = normalizar(palabra);              // así 'ó' cuenta como 'o'
        int vocales = 0;
        for (int i = 0; i < p.length(); i++) {
            if ("aeiou".indexOf(p.charAt(i)) != -1) {
                vocales++;
            }
        }
        return vocales;
    }

    static String palabraMasLarga(String texto) {
        String limpio = texto.trim();
        if (limpio.isEmpty()) {
            return "";
        }
        String[] palabras = limpio.split("\\s+");
        String mejor = palabras[0];
        for (int i = 1; i < palabras.length; i++) {
            if (palabras[i].length() > mejor.length()) {   // > estricto: en empate gana la primera
                mejor = palabras[i];
            }
        }
        return mejor;
    }

    public static void main(String[] args) {
        String frase = "  El   gato  come   pescado fresco  ";
        System.out.println("Palabras: " + contarPalabras(frase));
        System.out.println("Más larga: " + palabraMasLarga(frase));
        for (String palabra : frase.trim().split("\\s+")) {
            System.out.println("  " + palabra + ": " + contarVocales(palabra) + " vocales");
        }
        System.out.println("Vacío: " + contarPalabras("") + ", solo espacios: " + contarPalabras("   "));
        System.out.println("Canción: " + contarVocales("Canción") + " vocales");
    }
}
