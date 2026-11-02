// Del artículo «Herencia en Java — ejercicios con un refugio de animales, figuras que se ordenan y la plantilla de un restaurante (y el cast que convirtió a mi gato en perro)» — https://sergiolearns.com/herencia-en-java-ejercicios/

public class Triangulo extends Figura {

    private final double a, b, c;

    public Triangulo(double a, double b, double c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    // static: se puede comprobar ANTES de crear el triángulo
    public static boolean esValido(double a, double b, double c) {
        return a > 0 && b > 0 && c > 0 && a + b > c && a + c > b && b + c > a;
    }

    @Override
    public double area() {
        double s = (a + b + c) / 2;                    // semiperímetro
        return Math.sqrt(s * (s - a) * (s - b) * (s - c));   // fórmula de Herón
    }

    @Override
    public String getNombre() { return "Triángulo " + a + "-" + b + "-" + c; }
}
