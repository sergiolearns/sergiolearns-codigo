/*
 * Nivel 1: validar y normalizar una matrícula
 * Del artículo «Expresiones regulares en Java — ejercicios con la matrícula del parking, fechas y el log de la secretaría (y la matrícula con vocales que se me coló)»
 * https://sergiolearns.com/expresiones-regulares-en-java-ejercicios/
 */

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Matricula {

    // 4 dígitos + 3 consonantes (sin vocales, sin Ñ ni Q), y en medio un espacio, un guion o nada
    static final Pattern MATRICULA = Pattern.compile("(\\d{4})[ -]?([BCDFGHJKLMNPRSTVWXYZ]{3})");

    static String normalizarMatricula(String texto) {
        Matcher m = MATRICULA.matcher(texto.strip().toUpperCase());
        if (!m.matches()) {
            return null;                              // no hay matrícula
        }
        return m.group(1) + " " + m.group(2);         // siempre con el mismo formato
    }

    public static void main(String[] args) {
        String[] pruebas = {"1234BCD", "1234 bcd", " 4521-lkp ", "1234 AEI", "1234 QWR", "123 BCD", "1234  BCD"};
        for (String p : pruebas) {
            System.out.println("\"" + p + "\" -> " + normalizarMatricula(p));
        }
    }
}
