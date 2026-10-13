// Del artículo «Interfaces en Java — ejercicios con figuras, una biblioteca y sensores (y el cast que funcionó hasta que llegó una camiseta)» — https://sergiolearns.com/interfaces-en-java-ejercicios/

public class Libro implements Prestable {
    private final String titulo;
    private String prestadoA;

    public Libro(String titulo) { this.titulo = titulo; }

    @Override public String nombre() { return titulo; }
    @Override public boolean disponible() { return prestadoA == null; }

    @Override
    public boolean prestar(String socio) {
        if (!disponible()) return false;
        prestadoA = socio;
        return true;
    }

    @Override public void devolver() { prestadoA = null; }
}
