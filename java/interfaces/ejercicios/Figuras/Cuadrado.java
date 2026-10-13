// Del artículo «Interfaces en Java — ejercicios con figuras, una biblioteca y sensores (y el cast que funcionó hasta que llegó una camiseta)» — https://sergiolearns.com/interfaces-en-java-ejercicios/

public class Cuadrado implements Medible {
    private final double lado;

    public Cuadrado(double lado) { this.lado = lado; }

    @Override public double area() { return lado * lado; }
    @Override public String nombre() { return "Cuadrado"; }
}
