/*
 * Programa 3: limpiador de texto con replaceAll
 * Del artículo «Expresiones regulares en Java — práctica con un validador, un lector de logs y un limpiador de texto (y el \r invisible que me rompió todas las líneas)»
 * https://sergiolearns.com/expresiones-regulares-en-java-practica/
 */

import java.util.regex.Pattern;

public class LimpiadorTexto {

    static String limpiar(String texto) {
        String t = texto.strip();
        t = t.replaceAll("\\s+", " ");                     // 1. un solo espacio entre palabras
        t = t.replaceAll(" ([,.;:!?])", "$1");             // 2. sin espacio ANTES de un signo
        t = t.replaceAll("\\b(\\d{2})/(\\d{2})/(\\d{4})\\b", "$3-$2-$1");   // 3. fechas a aaaa-mm-dd
        t = t.replaceAll("\\b([6-9]\\d{2})[ -]?(\\d{3})[ -]?(\\d{3})\\b", "$1 $2 $3");  // 4. teléfonos
        return t;
    }

    static String ocultarCorreos(String texto) {
        // replaceAll con una función: decide el reemplazo de cada coincidencia
        return Pattern.compile("([\\w.+-])([\\w.+-]*)@([\\w.-]+)")
                      .matcher(texto)
                      .replaceAll(m -> m.group(1) + "*".repeat(m.group(2).length()) + "@" + m.group(3));
    }

    public static void main(String[] args) {
        String sucio = "  Hola   ,  soy Sergio .  Llámame al 612-345-678 o al 928123456 ;"
                     + " examen el 15/01/2027 .  Escribe a sergio@sergiolearns.com  ";
        String limpio = limpiar(sucio);
        System.out.println(limpio);
        System.out.println(ocultarCorreos(limpio));
    }
}
