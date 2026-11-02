/*
 * Programa 3: limpiador de texto con replaceAll
 * Del artículo «Expresiones regulares en Java — práctica con el formulario de Laura, el log de la secretaría y un limpiador de texto (y el \r invisible que me rompió todas las líneas)»
 * https://sergiolearns.com/expresiones-regulares-en-java-practica/
 */

import java.util.regex.Pattern;

public class LimpiadorTexto {

    static String limpiar(String texto) {
        String t = texto.strip();
        t = t.replaceAll("\\s+", " ");                                              // 1. un solo espacio
        t = t.replaceAll(" ([,.;:!?])", "$1");                                      // 2. sin espacio ANTES de un signo
        t = t.replaceAll("\\b(\\d{2})/(\\d{2})/(\\d{4})\\b", "$3-$2-$1");           // 3. fechas a aaaa-mm-dd
        t = t.replaceAll("\\b([6-9]\\d{2})[ -]?(\\d{3})[ -]?(\\d{3})\\b", "$1 $2 $3");  // 4. teléfonos
        return t;
    }

    // Los mismos pasos 1 y 2, pero al revés
    static String alReves(String texto) {
        String t = texto.replaceAll(" ([,.;:!?])", "$1");
        return t.replaceAll("\\s+", " ");
    }

    static String ocultarCorreos(String texto) {
        // replaceAll con una función: el reemplazo depende de lo que se ha encontrado
        return Pattern.compile("([\\w.+-])([\\w.+-]*)@([\\w.-]+)")
                      .matcher(texto)
                      .replaceAll(m -> m.group(1) + "*".repeat(m.group(2).length()) + "@" + m.group(3));
    }

    public static void main(String[] args) {
        String sucio = "  Hola   ,  soy Laura .  Mi móvil es el 612-345-678 y el de casa 928123456 ;"
                     + " pido revisión del examen del 15/01/2027 .  Escribidme a laura.santana101@alu.ulpgc.es  ";
        String limpio = limpiar(sucio);
        System.out.println(limpio);
        System.out.println(ocultarCorreos(limpio));
        System.out.println("[" + alReves("Hola   , soy Laura") + "]");
    }
}
