/*
 * Ejercicio 1: palíndromos
 * Del artículo «Strings en Java — ejercicios con palíndromos, palabras y cifrado César (y una trampa con == que no vi a tiempo)»
 * https://sergiolearns.com/strings-en-java-ejercicios/
 */

public class Palindromos {

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

    // Se queda solo con las letras y los dígitos (ya normalizados)
    static String soloLetrasYDigitos(String s) {
        String r = "";
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (Character.isLetterOrDigit(c)) {
                r += c;
            }
        }
        return r;
    }

    static boolean esPalindromo(String texto) {
        String limpio = soloLetrasYDigitos(normalizar(texto));
        int i = 0;                                   // desde el principio
        int j = limpio.length() - 1;                 // desde el final
        while (i < j) {
            if (limpio.charAt(i) != limpio.charAt(j)) {   // char: aquí sí se puede usar !=
                return false;
            }
            i++;
            j--;
        }
        return true;                                 // si nunca hubo diferencia (o está vacío), es palíndromo
    }

    public static void main(String[] args) {
        String[] pruebas = {"ana", "Ana", "Anita lava la tina", "Dábale arroz a la zorra el abad",
                            "¿Acaso hubo búhos acá?", "hola", "a", ""};
        for (String p : pruebas) {
            System.out.println("\"" + p + "\" -> " + esPalindromo(p));
        }
    }
}
