// Del artículo «Interfaces en Java — ejercicios con figuras, una biblioteca y sensores (y el cast que funcionó hasta que llegó una camiseta)» — https://sergiolearns.com/interfaces-en-java-ejercicios/

public interface Prestable extends Recurso {   // hereda nombre() de Recurso
    boolean prestar(String socio);
    void devolver();
    boolean disponible();

    default String estado() {
        return nombre() + ": " + (disponible() ? "disponible" : "prestado");
    }
}
