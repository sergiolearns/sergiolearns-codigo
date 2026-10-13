/*
 * El código
 * Del artículo «Strings en Java — práctica con un importador de alumnos, un generador de usuarios y un buscador de contactos (y por qué hay que normalizar antes de comparar)»
 * https://sergiolearns.com/strings-en-java-practica/
 */

public class ImportadorAlumnos {

    // Parte una línea CSV y limpia los espacios de cada campo
    static String[] partir(String linea) {
        String[] campos = linea.split(",", -1);      // -1: conserva los campos vacíos del final
        for (int i = 0; i < campos.length; i++) {
            campos[i] = campos[i].trim();            // trim devuelve una String NUEVA: la guardamos
        }
        return campos;
    }

    // Una nota válida: solo dígitos y como mucho un punto, y entre 0 y 10
    static boolean esNota(String s) {
        int digitos = 0;
        int puntos = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '.') {
                puntos++;
            } else if (c >= '0' && c <= '9') {
                digitos++;
            } else {
                return false;                        // cualquier otro carácter la invalida
            }
        }
        if (digitos == 0 || puntos > 1) {
            return false;
        }
        return Double.parseDouble(s) <= 10;          // ya sabemos que se puede convertir
    }

    static boolean esCorreoUniversitario(String correo) {
        int arroba = correo.indexOf('@');            // -1 si no hay arroba
        return arroba > 0 && correo.endsWith("@alu.ulpgc.es");
    }

    public static void main(String[] args) {
        String[] lineas = {
            "Ana Pérez Suárez, ana.perez@alu.ulpgc.es, fp2, 8.5",
            "  Luis Gómez ,luis.gomez@alu.ulpgc.es,FP2,6",
            "Marta Ruiz,marta.ruiz@alu.ulpgc.es,fp2",
            "Pablo Sosa,pablo.sosa@gmail.com,fp2,7.25",
            "Elena Díaz,elena.diaz@alu.ulpgc.es,fp2,9x",
            "Sara Vega,sara.vega@alu.ulpgc.es,fp2,",
            "Iván Mora,ivan.mora@alu.ulpgc.es,fp2,10"
        };

        // Arrays paralelos con espacio para todas las líneas; 'validos' dice cuántas posiciones están en uso
        String[] nombres = new String[lineas.length];
        double[] notas = new double[lineas.length];
        int validos = 0;

        System.out.println("Líneas con error:");
        for (int i = 0; i < lineas.length; i++) {
            String[] campos = partir(lineas[i]);
            String motivo = null;                    // null = todavía no hemos encontrado ningún problema
            if (campos.length != 4) {
                motivo = "se esperaban 4 campos y hay " + campos.length;
            } else if (!esCorreoUniversitario(campos[1])) {
                motivo = "correo no universitario (" + campos[1] + ")";
            } else if (!esNota(campos[3])) {
                motivo = "nota no válida (" + campos[3] + ")";
            }

            if (motivo != null) {
                System.out.println("  Línea " + (i + 1) + ": " + motivo);
            } else {
                nombres[validos] = campos[0];
                notas[validos] = Double.parseDouble(campos[3]);
                validos++;
            }
        }

        System.out.println("\nAlumnos válidos:");
        double suma = 0;
        for (int i = 0; i < validos; i++) {
            System.out.printf("  %-18s %5.2f%n", nombres[i], notas[i]);
            suma += notas[i];
        }
        if (validos > 0) {
            System.out.printf("Media: %.2f%n", suma / validos);
        }
    }
}
