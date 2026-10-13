/*
 * El código
 * Del artículo «Strings en Java — práctica con un importador de alumnos, un generador de usuarios y un buscador de contactos (y por qué hay que normalizar antes de comparar)»
 * https://sergiolearns.com/strings-en-java-practica/
 */

public class GeneradorUsuarios {

    // Pasa a minúsculas y quita tildes y eñes (primero minúsculas: así solo hay que tratar las minúsculas)
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

    // Inicial del nombre + primer apellido: "Ana Pérez Suárez" -> "aperez". Devuelve null si faltan datos.
    static String usuarioBase(String nombreCompleto) {
        String[] palabras = normalizar(nombreCompleto).split(" ");
        String nombre = null;
        String apellido = null;
        for (String palabra : palabras) {
            if (palabra.isEmpty()) {
                continue;                            // espacios dobles: saltamos las Strings vacías
            }
            if (nombre == null) {
                nombre = palabra;
            } else if (apellido == null) {
                apellido = palabra;
            }
        }
        if (nombre == null || apellido == null) {
            return null;
        }
        return nombre.substring(0, 1) + apellido;
    }

    static boolean existe(String[] usados, int cuantos, String usuario) {
        for (int i = 0; i < cuantos; i++) {
            if (usados[i].equals(usuario)) {         // equals, no ==
                return true;
            }
        }
        return false;
    }

    // Si "aperez" ya existe, prueba "aperez2", "aperez3"...
    static String usuarioUnico(String base, String[] usados, int cuantos) {
        String candidato = base;
        int numero = 2;
        while (existe(usados, cuantos, candidato)) {
            candidato = base + numero;
            numero++;
        }
        return candidato;
    }

    public static void main(String[] args) {
        String[] nombres = {
            "Ana Pérez Suárez",
            "Álvaro Pérez Gil",
            "  luis   gómez  vega ",
            "María Núñez Ortega",
            "Ángela PÉREZ Díaz",
            "Pedro"
        };

        String[] usados = new String[nombres.length];
        int cuantos = 0;

        for (String nombre : nombres) {
            String base = usuarioBase(nombre);
            if (base == null) {
                System.out.println("[" + nombre.trim() + "] -> nombre incompleto, no se genera usuario");
                continue;
            }
            String usuario = usuarioUnico(base, usados, cuantos);
            usados[cuantos] = usuario;
            cuantos++;
            System.out.println("[" + nombre.trim() + "] -> " + usuario + "@alu.ulpgc.es");
        }
    }
}
