// Del artículo «Interfaces en Java — ejercicios con figuras, una biblioteca y sensores (y el cast que funcionó hasta que llegó una camiseta)» — https://sergiolearns.com/interfaces-en-java-ejercicios/

public class Circulo implements Medible {
    private final double radio;

    public Circulo(double radio) { this.radio = radio; }

    @Override public double area() { return Math.PI * radio * radio; }
    @Override public String nombre() { return "Círculo"; }
}
