/*
 * Nivel 1 — Conversor seguro
 * Del artículo «Excepciones en Java — ejercicios con un conversor, fechas y un banco (y el try que puse en el sitio equivocado)»
 * https://sergiolearns.com/excepciones-en-java-ejercicios/
 */

public class Conversor {

    // Intenta convertir; si no puede, devuelve el valor por defecto
    static int aEntero(String texto, int porDefecto) {
        try {
            return Integer.parseInt(texto.trim());
        } catch (NumberFormatException e) {
            return porDefecto;                       // aquí SÍ es correcto no relanzar: es el contrato del método
        }
    }

    // Simula pedir un número: recorre las entradas hasta encontrar una válida dentro del rango
    static int pedirEntre(String[] entradas, int min, int max) {
        for (int i = 0; i < entradas.length; i++) {
            try {
                int n = Integer.parseInt(entradas[i].trim());
                if (n < min || n > max) {
                    System.out.println("  \"" + entradas[i] + "\": fuera de rango [" + min + ", " + max + "]");
                    continue;                        // siguiente intento
                }
                System.out.println("  Aceptado " + n + " en el intento " + (i + 1));
                return n;
            } catch (NumberFormatException e) {
                System.out.println("  \"" + entradas[i] + "\": no es un número entero");
            }
        }
        throw new IllegalStateException("ninguna entrada válida en " + entradas.length + " intentos");
    }

    public static void main(String[] args) {
        System.out.println(aEntero("42", 0) + " " + aEntero(" 7 ", 0) + " " + aEntero("3.5", -1) + " " + aEntero("", -1));

        System.out.println("Edad:");
        int edad = pedirEntre(new String[]{"veinte", "-3", "150", " 19 "}, 0, 120);

        System.out.println("Nota:");
        try {
            pedirEntre(new String[]{"diez", "11"}, 0, 10);
        } catch (IllegalStateException e) {
            System.out.println("  Error: " + e.getMessage());
        }
        System.out.println("Edad guardada: " + edad);
    }
}
