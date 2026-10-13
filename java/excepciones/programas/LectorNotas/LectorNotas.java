/*
 * El código
 * Del artículo «Excepciones en Java — práctica con un importador de notas, un cajero y un lector de ficheros (y el "Error" que no decía nada)»
 * https://sergiolearns.com/excepciones-en-java-practica/
 */

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

public class LectorNotas {

    // Crea el fichero de ejemplo (en un programa real ya existiría)
    static void crearFichero(String ruta) throws IOException {
        try (PrintWriter salida = new PrintWriter(new FileWriter(ruta))) {
            salida.println("Ana;8.5");
            salida.println("Luis;7,5");
            salida.println("Marta;nueve");
            salida.println("Pablo");
            salida.println("Sara;6");
        }                                                   // aquí se cierra solo
    }

    // Lee el fichero y devuelve la media. Los errores de UNA línea se tratan aquí;
    // los errores del FICHERO (no existe, no se puede leer) se dejan subir con throws.
    static double media(String ruta) throws IOException {
        double suma = 0;
        int validas = 0;
        int numLinea = 0;
        try (BufferedReader lector = new BufferedReader(new FileReader(ruta))) {
            String linea;
            while ((linea = lector.readLine()) != null) {   // null = fin del fichero
                numLinea++;
                try {
                    String[] campos = linea.split(";");
                    double nota = Double.parseDouble(campos[1].trim().replace(',', '.'));
                    suma += nota;
                    validas++;
                } catch (NumberFormatException | ArrayIndexOutOfBoundsException e) {
                    System.out.println("  Línea " + numLinea + " ignorada (" + linea + "): "
                            + e.getClass().getSimpleName());
                }
            }
        }
        if (validas == 0) {
            throw new IOException("no hay ninguna nota válida en " + ruta);
        }
        return suma / validas;
    }

    public static void main(String[] args) {
        try {
            crearFichero("notas.txt");
        } catch (IOException e) {
            System.out.println("No se pudo crear el fichero: " + e.getMessage());
            return;
        }

        String[] rutas = {"notas.txt", "notas-2025.txt"};
        for (String ruta : rutas) {
            System.out.println("Leyendo " + ruta + "...");
            try {
                System.out.printf("  Media: %.2f%n", media(ruta));
            } catch (IOException e) {
                System.out.println("  No se pudo leer: " + e.getMessage());
            }
        }
    }
}
