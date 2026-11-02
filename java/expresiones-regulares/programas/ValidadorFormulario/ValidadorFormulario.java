/*
 * Programa 1: validador de un formulario de registro
 * Del artículo «Expresiones regulares en Java — práctica con el formulario de Laura, el log de la secretaría y un limpiador de texto (y el \r invisible que me rompió todas las líneas)»
 * https://sergiolearns.com/expresiones-regulares-en-java-practica/
 */

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ValidadorFormulario {

    // Cada patrón se compila UNA vez, al cargar la clase, y se reutiliza en cada registro
    static final Pattern USUARIO  = Pattern.compile("[a-z][a-z0-9_]{3,15}");
    static final Pattern CORREO   = Pattern.compile("[\\w.+-]+@[\\w-]+(\\.[\\w-]+)+");
    static final Pattern TELEFONO = Pattern.compile("[6-9]\\d{8}");
    static final Pattern DNI      = Pattern.compile("(\\d{8})([A-Z])");
    static final Pattern CLAVE    = Pattern.compile("(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,}");
    static final String LETRAS_DNI = "TRWAGMYFPDXBNJZSQVHLCKE";

    // Devuelve TODOS los errores juntos (cadena vacía si no hay ninguno)
    static String validar(String usuario, String correo, String telefono, String dni, String clave) {
        String errores = "";
        if (!USUARIO.matcher(usuario).matches()) {
            errores += "  - usuario no válido\n";
        }
        if (!CORREO.matcher(correo).matches()) {
            errores += "  - correo no válido\n";
        }
        // quien rellena el formulario puede escribir espacios: fuera antes de validar
        if (!TELEFONO.matcher(telefono.replaceAll("\\s+", "")).matches()) {
            errores += "  - teléfono no válido\n";
        }
        // normalizar primero (mayúsculas) y validar después
        if (!dniValido(dni.strip().toUpperCase())) {
            errores += "  - DNI no válido\n";
        }
        if (!CLAVE.matcher(clave).matches()) {
            errores += "  - contraseña débil\n";
        }
        return errores;
    }

    static boolean dniValido(String dni) {
        Matcher m = DNI.matcher(dni);
        if (!m.matches()) {
            return false;                                // primero, la FORMA
        }
        int numero = Integer.parseInt(m.group(1));       // grupo 1: los 8 dígitos
        char letra = m.group(2).charAt(0);               // grupo 2: la letra
        return LETRAS_DNI.charAt(numero % 23) == letra;  // después, el SIGNIFICADO
    }

    public static void main(String[] args) {
        String[][] registros = {
            {"laura_s", "laura.santana101@alu.ulpgc.es", "612 345 678", "12345678z", "Regex2026"},
            {"4dmin", "admin@", "512345678", "12345678A", "admin"},
            {"ana", "ana.perez102@alu.ulpgc.es", "928123456", "87654321X", "MiClave1"}
        };
        for (String[] r : registros) {
            String errores = validar(r[0], r[1], r[2], r[3], r[4]);
            if (errores.isEmpty()) {
                System.out.println(r[0] + ": todo correcto");
            } else {
                System.out.println(r[0] + ":");
                System.out.print(errores);
            }
        }
    }
}
