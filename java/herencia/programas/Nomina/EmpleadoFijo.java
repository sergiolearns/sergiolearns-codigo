// Del artículo «Herencia en Java — práctica con una nómina, unas figuras y dos tipos de cuenta (y el saldo que hice public para que compilara)» — https://sergiolearns.com/herencia-en-java-practica/

public class EmpleadoFijo extends Empleado {

    private static final double PLUS_TRIENIO = 30.0;   // 30 € por cada 3 años

    private final double sueldoBase;
    private final int anios;

    public EmpleadoFijo(String nombre, double sueldoBase, int anios) {
        super(nombre);
        this.sueldoBase = sueldoBase;
        this.anios = anios;
    }

    @Override
    public double salarioMensual() {
        int trienios = anios / 3;                     // división entera: 7 años = 2 trienios
        return sueldoBase + trienios * PLUS_TRIENIO;
    }

    @Override
    public String getTipo() { return "Fijo"; }
}
