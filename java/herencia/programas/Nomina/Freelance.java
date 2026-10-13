// Del artículo «Herencia en Java — práctica con una nómina, unas figuras y dos tipos de cuenta (y el saldo que hice public para que compilara)» — https://sergiolearns.com/herencia-en-java-practica/

public class Freelance extends Empleado {

    private final double precioHora;
    private int horas;                                // cambia cada mes

    public Freelance(String nombre, double precioHora) {
        super(nombre);
        this.precioHora = precioHora;
    }

    public void registrarHoras(int horas) {
        if (horas > 0) this.horas += horas;
    }

    @Override
    public double salarioMensual() {
        return horas * precioHora;
    }

    @Override
    public String getTipo() { return "Freelance"; }
}
