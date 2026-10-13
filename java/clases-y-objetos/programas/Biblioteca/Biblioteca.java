/*
 * Programa 2: una biblioteca con array de objetos
 * Del artículo «Clases y objetos en Java — práctica con un banco, una biblioteca y el inventario de un laboratorio (y la cuenta que era de nadie)»
 * https://sergiolearns.com/clases-y-objetos-en-java-practica/
 */

public class Biblioteca {
    private final Libro[] libros;
    private int numLibros = 0;

    public Biblioteca(int capacidad) {
        libros = new Libro[capacidad];
    }

    public boolean agregar(Libro libro) {
        if (numLibros == libros.length || buscar(libro.getIsbn()) != null) return false;
        libros[numLibros++] = libro;
        return true;
    }

    // Devuelve el libro o null si no está
    public Libro buscar(String isbn) {
        for (int i = 0; i < numLibros; i++) {
            if (libros[i].getIsbn().equals(isbn)) return libros[i];
        }
        return null;
    }

    public boolean prestar(String isbn) {
        Libro l = buscar(isbn);
        return l != null && l.prestar();     // si es null, no llega a llamar a prestar()
    }

    public boolean devolver(String isbn) {
        Libro l = buscar(isbn);
        return l != null && l.devolver();
    }

    public void listarDisponibles() {
        for (int i = 0; i < numLibros; i++) {
            if (!libros[i].isPrestado()) System.out.println("  " + libros[i]);
        }
    }

    public static void main(String[] args) {
        Biblioteca bib = new Biblioteca(10);
        bib.agregar(new Libro("978-84-01", "Java para todos", "L. Pérez"));
        bib.agregar(new Libro("978-84-02", "Estructuras de datos", "M. Ruiz"));
        bib.agregar(new Libro("978-84-03", "Python a fondo", "A. Gil"));
        System.out.println(bib.agregar(new Libro("978-84-01", "Copia", "X")));  // ISBN repetido

        System.out.println(bib.prestar("978-84-02"));   // true
        System.out.println(bib.prestar("978-84-02"));   // false: ya prestado
        System.out.println(bib.prestar("999"));         // false: no existe
        System.out.println("Disponibles:");
        bib.listarDisponibles();
        System.out.println(bib.devolver("978-84-02"));
        System.out.println(bib.buscar("978-84-02"));
    }
}
