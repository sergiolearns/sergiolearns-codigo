/*
 * Programa 2: una biblioteca con array de objetos
 * Del artículo «Clases y objetos en Java — práctica con la cuenta de Laura, la biblioteca de la facultad y el inventario del laboratorio (y la cuenta que era de nadie)»
 * https://sergiolearns.com/clases-y-objetos-en-java-practica/
 */
public class Libro {
    private final String isbn;
    private final String titulo;
    private final String autor;
    private boolean prestado;          // false por defecto: no hace falta inicializarlo

    public Libro(String isbn, String titulo, String autor) {
        this.isbn = isbn;
        this.titulo = titulo;
        this.autor = autor;
    }

    public String getIsbn()     { return isbn; }
    public boolean isPrestado() { return prestado; }    // los getters de boolean empiezan por "is"

    // La regla "no se presta dos veces" vive AQUÍ, en el libro
    public boolean prestar() {
        if (prestado) {
            return false;
        }
        prestado = true;
        return true;
    }

    public boolean devolver() {
        if (!prestado) {
            return false;
        }
        prestado = false;
        return true;
    }

    @Override
    public String toString() {
        return titulo + " (" + autor + ")" + (prestado ? " [prestado]" : "");
    }
}
