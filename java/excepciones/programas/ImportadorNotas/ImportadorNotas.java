/*
 * El código
 * Del artículo «Excepciones en Java — práctica con un importador de notas, un cajero y un lector de ficheros (y el "Error" que no decía nada)»
 * https://sergiolearns.com/excepciones-en-java-practica/
 */

public class ImportadorNotas {

    // Devuelve la nota de una línea "nombre;asignatura;nota" o lanza una excepción explicando el problema
    static double leerNota(String linea) {
        String[] campos = linea.split(";", -1);
        if (campos.length != 3) {
            throw new IllegalArgumentException("se esperaban 3 campos y hay " + campos.length);
        }
        String texto = campos[2].trim().replace(',', '.');   // aceptamos "7,5" además de "7.5"
        double nota = Double.parseDouble(texto);              // puede lanzar NumberFormatException
        if (nota < 0 || nota > 10) {
            throw new IllegalArgumentException("nota fuera de rango (" + nota + ")");
        }
        return nota;
    }

    public static void main(String[] args) {
        String[] lineas = {
            "Ana Pérez;FP2;8.5",
            "Luis Gómez;FP2;7,5",
            "Marta Ruiz;FP2",
            "Pablo Sosa;FP2;9x",
            "Elena Díaz;FP2;12",
            "Sara Vega;FP2;",
            "Iván Mora;FP2;10"
        };

        double suma = 0;
        int validas = 0;
        int procesadas = 0;

        for (int i = 0; i < lineas.length; i++) {
            try {
                double nota = leerNota(lineas[i]);
                suma += nota;
                validas++;
                System.out.printf("Línea %d: OK (%.2f)%n", i + 1, nota);
            } catch (NumberFormatException e) {
                // va ANTES que IllegalArgumentException: es su hija
                System.out.println("Línea " + (i + 1) + ": la nota no es un número -> " + e.getMessage());
            } catch (IllegalArgumentException e) {
                System.out.println("Línea " + (i + 1) + ": " + e.getMessage());
            } finally {
                procesadas++;                                  // se cuenta pase lo que pase
            }
        }

        System.out.printf("%nProcesadas: %d · válidas: %d · con error: %d%n", procesadas, validas, procesadas - validas);
        if (validas > 0) {
            System.out.printf("Media: %.2f%n", suma / validas);
        }
    }
}
