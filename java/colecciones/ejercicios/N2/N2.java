/*
 * Solución del Nivel 2
 * Del artículo «Colecciones en Java — ejercicios con autores, catálogos y una fusión de bibliotecas (y la "b" que estaba en el mapa pero no aparecía)»
 * https://sergiolearns.com/colecciones-en-java-ejercicios/
 */

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public class N2 {
    public static void main(String[] args) {
        List<Libro> libros = List.of(
                new Libro("L-101", "Dune", "Herbert"),
                new Libro("L-102", "Emma", "Austen"),
                new Libro("L-103", "Hamlet", "Shakespeare"),
                new Libro("L-104", "Macbeth", "Shakespeare"),
                new Libro("L-105", "Rebecca", "du Maurier"),
                new Libro("L-106", "Misery", "King"),
                new Libro("L-107", "Carrie", "King"),
                new Libro("L-108", "It", "King"));

        Map<String, List<String>> porAutor = new TreeMap<>();
        for (Libro l : libros) {
            porAutor.computeIfAbsent(l.autor(), k -> new ArrayList<>()).add(l.titulo());
        }

        String masLibros = null;
        for (Map.Entry<String, List<String>> e : porAutor.entrySet()) {
            System.out.println(e.getKey() + ": " + e.getValue());
            if (masLibros == null || e.getValue().size() > porAutor.get(masLibros).size()) {
                masLibros = e.getKey();
            }
        }
        System.out.println("Más libros: " + masLibros + " (" + porAutor.get(masLibros).size() + ")");
    }
}
