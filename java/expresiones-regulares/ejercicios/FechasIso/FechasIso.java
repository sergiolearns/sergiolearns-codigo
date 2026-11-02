/*
 * Nivel 2: fechas al formato internacional
 * Del artículo «Expresiones regulares en Java — ejercicios con la matrícula del parking, fechas y el log de la secretaría (y la matrícula con vocales que se me coló)»
 * https://sergiolearns.com/expresiones-regulares-en-java-ejercicios/
 */

import java.util.regex.Pattern;

public class FechasIso {

    // d/m/aaaa con día y mes de 1 o 2 cifras; \b para no coger trozos de números más largos
    static final Pattern FECHA = Pattern.compile("\\b(\\d{1,2})/(\\d{1,2})/(\\d{4})\\b");

    static String fechasAIso(String texto) {
        return FECHA.matcher(texto).replaceAll(m -> {
            int dia = Integer.parseInt(m.group(1));
            int mes = Integer.parseInt(m.group(2));
            if (dia < 1 || dia > 31 || mes < 1 || mes > 12) {
                return m.group();                     // sin sentido: se deja tal cual
            }
            return String.format("%s-%02d-%02d", m.group(3), mes, dia);
        });
    }

    public static void main(String[] args) {
        String texto = "Entrega: 7/3/2027. Examen: 15/01/2027. Mal: 31/13/2027 y 3/4/27. Código: 1/2/20271.";
        System.out.println(texto);
        System.out.println(fechasAIso(texto));
    }
}
