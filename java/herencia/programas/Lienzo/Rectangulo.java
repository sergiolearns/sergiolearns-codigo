// Del artículo «Herencia en Java — práctica con una nómina, unas figuras y dos tipos de cuenta (y el saldo que hice public para que compilara)» — https://sergiolearns.com/herencia-en-java-practica/

public class Rectangulo extends Figura {

    private final double base;
    private final double altura;

    public Rectangulo(double base, double altura) {
        this("Rectángulo", base, altura);             // reutiliza el constructor de abajo
    }

    protected Rectangulo(String nombre, double base, double altura) {
        super(nombre);
        this.base = base;
        this.altura = altura;
    }

    @Override
    public double area() { return base * altura; }

    @Override
    public double perimetro() { return 2 * (base + altura); }
}
