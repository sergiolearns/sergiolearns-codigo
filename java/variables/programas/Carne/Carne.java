/*
 * Programa 3: el carné universitario
 * Del artículo «Variables en Java práctica — el recibo, la nota final y el carné de Laura (con la nota que salía 0.0)»
 * https://sergiolearns.com/variables-en-java-practica/
 */
/**
 * Programa 3: el carné universitario de Laura (datos inventados).
 * Usuario hecho con char y String, expediente que no cabe en un int y la comparación de textos.
 */
public class Carne {
    public static void main(String[] args) {
        String nombre = "Laura";
        String apellido1 = "Santana";
        int anioIngreso = 2026;
        int numeroAlumno = 4321;

        // El usuario: inicial del nombre + primer apellido, en minúsculas
        char inicial = nombre.charAt(0);                     // 'L'
        char inicialMin = (char) (inicial + 32);             // en ASCII, 'a' - 'A' = 32
        String usuario = inicialMin + apellido1.toLowerCase();   // char + String = String
        System.out.println("Usuario:     " + usuario);
        System.out.println("Correo:      " + usuario + "@alu.ulpgc.es");

        // El expediente: año * 10 000 000 + número de alumno = 20260004321 (11 cifras)
        int expedienteMal = anioIngreso * 10000000 + numeroAlumno;     // pasa de 2 147 483 647
        long expediente = anioIngreso * 10000000L + numeroAlumno;      // 10000000L: cuenta en long
        System.out.println("Expediente (int):  " + expedienteMal);
        System.out.println("Expediente (long): " + expediente);

        // La letra de control: el resto entre 23, como la del DNI
        String letras = "TRWAGMYFPDXBNJZSQVHLCKE";
        int resto = (int) (expediente % 23);                 // long % int = long → cast a int
        char control = letras.charAt(resto);
        System.out.println("Resto entre 23: " + resto + " → letra " + control);
        System.out.println("Carné:       " + expediente + "-" + control);

        // ¿Es el usuario que tiene la secretaría?
        String usuarioSecretaria = "lsantana";
        System.out.println("usuario == \"lsantana\"      " + (usuario == usuarioSecretaria));
        System.out.println("usuario.equals(\"lsantana\") " + usuario.equals(usuarioSecretaria));
    }
}
