/*
 * El código
 * Del artículo «Strings en Java — práctica con un importador de alumnos, un generador de usuarios y un buscador de contactos (y por qué hay que normalizar antes de comparar)»
 * https://sergiolearns.com/strings-en-java-practica/
 */

public class Contactos {

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

    // "612345678" -> "612 34 56 78"
    static String formatearTelefono(String t) {
        return t.substring(0, 3) + " " + t.substring(3, 5) + " " + t.substring(5, 7) + " " + t.substring(7);
    }

    // "ana.perez@alu.ulpgc.es" -> "a***@alu.ulpgc.es"
    static String ocultarCorreo(String correo) {
        int arroba = correo.indexOf('@');
        if (arroba < 1) {
            return correo;                           // sin arroba (o arroba al principio): lo dejamos tal cual
        }
        return correo.substring(0, 1) + "***" + correo.substring(arroba);
    }

    // Busca contactos cuyo nombre contenga la consulta (sin distinguir mayúsculas ni tildes)
    static void buscar(String[] contactos, String consulta) {
        String q = normalizar(consulta);
        System.out.println("Búsqueda: \"" + consulta + "\"");
        int encontrados = 0;
        for (String contacto : contactos) {
            String[] campos = contacto.split(";");   // nombre;teléfono;correo
            if (normalizar(campos[0]).contains(q)) {
                System.out.println("  " + campos[0] + " | " + formatearTelefono(campos[1]) + " | " + ocultarCorreo(campos[2]));
                encontrados++;
            }
        }
        if (encontrados == 0) {
            System.out.println("  Sin resultados");
        }
    }

    public static void main(String[] args) {
        String[] contactos = {
            "Ana Pérez Suárez;612345678;ana.perez@alu.ulpgc.es",
            "Álvaro Pérez Gil;623456789;alvaro.perez@alu.ulpgc.es",
            "María Núñez Ortega;634567890;maria.nunez@gmail.com",
            "Luis Gómez Vega;645678901;luis.gomez@alu.ulpgc.es"
        };

        buscar(contactos, "perez");
        buscar(contactos, "  PÉREZ ");
        buscar(contactos, "nunez");
        buscar(contactos, "gómez");
        buscar(contactos, "zzz");
    }
}
