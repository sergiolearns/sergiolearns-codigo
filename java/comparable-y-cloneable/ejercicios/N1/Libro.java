// Del artículo «Comparable y Cloneable en Java — ejercicios con libros, jugadores y una plantilla clonada (y la resta que puso al más rico el primero)» — https://sergiolearns.com/comparable-y-cloneable-en-java-ejercicios/

public class Libro implements Comparable<Libro> {
    private final String titulo;
    private final int paginas;

    public Libro(String titulo, int paginas) {
        this.titulo = titulo;
        this.paginas = paginas;
    }

    public String getTitulo() { return titulo; }
    public int getPaginas() { return paginas; }

    // Orden natural: de menos a más páginas
    @Override
    public int compareTo(Libro otro) {
        return Integer.compare(this.paginas, otro.paginas);
    }

    @Override
    public String toString() {
        return titulo + " (" + paginas + " págs.)";
    }
}
