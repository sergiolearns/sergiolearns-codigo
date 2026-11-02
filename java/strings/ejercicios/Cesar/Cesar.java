/*
 * Ejercicio 3: cifrado César
 * Del artículo «Strings en Java — ejercicios con palíndromos, palabras y cifrado César (y una trampa con == que no vi a tiempo)»
 * https://sergiolearns.com/strings-en-java-ejercicios/
 */

public class Cesar {

    static String cifrar(String texto, int desplazamiento) {
        int d = ((desplazamiento % 26) + 26) % 26;   // lo deja entre 0 y 25, también con negativos
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < texto.length(); i++) {
            char c = texto.charAt(i);
            if (c >= 'a' && c <= 'z') {
                sb.append((char) ('a' + (c - 'a' + d) % 26));
            } else if (c >= 'A' && c <= 'Z') {
                sb.append((char) ('A' + (c - 'A' + d) % 26));
            } else {
                sb.append(c);                        // espacios, signos, tildes...: se quedan como están
            }
        }
        return sb.toString();
    }

    static String descifrar(String texto, int desplazamiento) {
        return cifrar(texto, -desplazamiento);       // descifrar es cifrar al revés
    }

    public static void main(String[] args) {
        String mensaje = "Hola, Mundo!";
        String cifrado = cifrar(mensaje, 3);
        System.out.println(cifrado);
        System.out.println(descifrar(cifrado, 3));
        System.out.println(cifrar("xyz", 3));
        System.out.println(cifrar("abc", -1));
        System.out.println(cifrar("abc", 29) + " " + cifrar("abc", 3));
        System.out.println(cifrar("Canción", 1));
    }
}
