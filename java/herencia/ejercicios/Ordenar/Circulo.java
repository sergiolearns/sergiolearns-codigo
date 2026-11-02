// Del artículo «Herencia en Java — ejercicios con un refugio de animales, figuras que se ordenan y la plantilla de un restaurante (y el cast que convirtió a mi gato en perro)» — https://sergiolearns.com/herencia-en-java-ejercicios/

public class Circulo extends Figura {

    private final double radio;

    public Circulo(double radio) {
        this.radio = Math.abs(radio);                  // super() implícito: Figura no tiene constructor
    }

    @Override
    public double area() { return Math.PI * radio * radio; }

    @Override
    public String getNombre() { return "Círculo r=" + radio; }
}
