/*
 * Solución del Nivel 1
 * Del artículo «Colecciones en Java — ejercicios con autores, catálogos y una fusión de bibliotecas (y la "b" que estaba en el mapa pero no aparecía)»
 * https://sergiolearns.com/colecciones-en-java-ejercicios/
 */

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

public class N1 {
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

        Set<String> autores = new TreeSet<>();
        Map<String, Libro> porIsbn = new HashMap<>();
        for (Libro l : libros) {
            autores.add(l.autor());       // un conjunto no guarda repetidos
            porIsbn.put(l.isbn(), l);     // clave: ISBN, valor: el libro entero
        }

        System.out.println("Libros en la lista: " + libros.size());
        System.out.println("Autores distintos (ordenados): " + autores);
        for (String isbn : new String[]{"L-103", "L-999"}) {
            if (porIsbn.containsKey(isbn)) {
                System.out.println(isbn + " -> " + porIsbn.get(isbn));
            } else {
                System.out.println(isbn + " -> no existe");
            }
        }
    }
}
