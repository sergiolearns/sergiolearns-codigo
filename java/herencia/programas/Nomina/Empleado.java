// Del artículo «Herencia en Java — práctica con una nómina, unas figuras y dos tipos de cuenta (y el saldo que hice public para que compilara)» — https://sergiolearns.com/herencia-en-java-practica/

public abstract class Empleado {

    private final String nombre;

    public Empleado(String nombre) {
        this.nombre = nombre;
    }

    public String getNombre() { return nombre; }

    // Cada tipo de empleado cobra de una forma: lo deciden las hijas
    public abstract double salarioMensual();

    public abstract String getTipo();

    // final: la línea de la nómina es igual para todos, nadie la cambia
    public final String lineaNomina() {
        return String.format("%-9s %-7s %9.2f €", getTipo(), nombre, salarioMensual());
    }
}
