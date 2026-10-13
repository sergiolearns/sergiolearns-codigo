/*
 * El código
 * Del artículo «Colecciones en Java — práctica con un contador de palabras, claves propias y colas de préstamos (y el HashMap que imprimía en un orden que no entendía)»
 * https://sergiolearns.com/colecciones-en-java-practica/
 */

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

public class Claves {

    static class LibroNada {
        final String isbn;
        LibroNada(String isbn) { this.isbn = isbn; }
    }

    static class LibroEquals {
        final String isbn;
        LibroEquals(String isbn) { this.isbn = isbn; }

        @Override
        public boolean equals(Object o) {
            return o instanceof LibroEquals otro && isbn.equals(otro.isbn);
        }
    }

    static class LibroCompleto {
        final String isbn;
        LibroCompleto(String isbn) { this.isbn = isbn; }

        @Override
        public boolean equals(Object o) {
            return o instanceof LibroCompleto otro && isbn.equals(otro.isbn);
        }

        @Override
        public int hashCode() {
            return Objects.hash(isbn);
        }

        @Override
        public String toString() {
            return "Libro " + isbn;
        }
    }

    record LibroRecord(String isbn) { }

    static class LibroMutable {
        private String titulo;
        LibroMutable(String titulo) { this.titulo = titulo; }
        void setTitulo(String titulo) { this.titulo = titulo; }

        @Override
        public boolean equals(Object o) {
            return o instanceof LibroMutable otro && titulo.equals(otro.titulo);
        }

        @Override
        public int hashCode() {
            return titulo.hashCode();
        }

        @Override
        public String toString() {
            return titulo;
        }
    }

    static void probar(String nombre, Object a, Object b) {
        Set<Object> conjunto = new HashSet<>();
        conjunto.add(a);
        conjunto.add(b);
        System.out.println(nombre + ": equals=" + a.equals(b)
                + ", mismo hashCode=" + (a.hashCode() == b.hashCode())
                + ", tamaño del conjunto=" + conjunto.size());
    }

    public static void main(String[] args) {
        System.out.println("== Dos objetos con el mismo ISBN ==");
        probar("Sin nada      ", new LibroNada("L-101"), new LibroNada("L-101"));
        probar("Solo equals   ", new LibroEquals("L-101"), new LibroEquals("L-101"));
        probar("equals+hash   ", new LibroCompleto("L-101"), new LibroCompleto("L-101"));
        probar("record        ", new LibroRecord("L-101"), new LibroRecord("L-101"));

        System.out.println("== Como clave de un HashMap ==");
        Map<LibroCompleto, Integer> copias = new HashMap<>();
        copias.merge(new LibroCompleto("L-101"), 1, Integer::sum);
        copias.merge(new LibroCompleto("L-102"), 1, Integer::sum);
        copias.merge(new LibroCompleto("L-101"), 1, Integer::sum);
        System.out.println("Copias: " + copias);

        System.out.println("== Clave que cambia después de guardarla ==");
        LibroMutable libro = new LibroMutable("Dune");
        Set<LibroMutable> estante = new HashSet<>();
        estante.add(libro);
        System.out.println("Antes de cambiar el título: contains=" + estante.contains(libro));
        libro.setTitulo("Dune (2.ª edición)");
        System.out.println("Después de cambiarlo:       contains=" + estante.contains(libro)
                + ", size=" + estante.size());
        System.out.println("Pero al recorrerlo sigue ahí: " + estante);
    }
}
