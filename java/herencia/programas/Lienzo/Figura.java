// Del artículo «Herencia en Java — práctica con una nómina, unas figuras y dos tipos de cuenta (y el saldo que hice public para que compilara)» — https://sergiolearns.com/herencia-en-java-practica/

public abstract class Figura {

    private final String nombre;

    protected Figura(String nombre) {                 // protected: solo lo usan las hijas
        this.nombre = nombre;
    }

    public String getNombre() { return nombre; }

    public abstract double area();
    public abstract double perimetro();

    @Override
    public String toString() {
        return String.format("%-10s área %7.2f  perímetro %6.2f", nombre, area(), perimetro());
    }
}
