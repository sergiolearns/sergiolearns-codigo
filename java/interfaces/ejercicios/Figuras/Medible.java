// Del artículo «Interfaces en Java — ejercicios con figuras, una biblioteca y sensores (y el cast que funcionó hasta que llegó una camiseta)» — https://sergiolearns.com/interfaces-en-java-ejercicios/

public interface Medible {
    double area();
    String nombre();

    default String describir() {          // se apoya en nombre() y area(): vale para todas las figuras
        return nombre() + " con área " + String.format("%.2f", area());
    }
}
