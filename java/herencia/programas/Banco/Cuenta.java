// Del artículo «Herencia en Java — práctica con una nómina, unas figuras y dos tipos de cuenta (y el saldo que hice public para que compilara)» — https://sergiolearns.com/herencia-en-java-practica/

public class Cuenta {

    private final String titular;
    protected double saldo;                           // las hijas necesitan tocarlo

    public Cuenta(String titular, double saldoInicial) {
        this.titular = titular;
        this.saldo = saldoInicial;
    }

    public void ingresar(double cantidad) {
        if (cantidad > 0) saldo += cantidad;
    }

    // Regla general: no se puede sacar más de lo que hay
    public boolean retirar(double cantidad) {
        if (cantidad <= 0 || cantidad > saldo) return false;
        saldo -= cantidad;
        return true;
    }

    public double getSaldo() { return saldo; }

    @Override
    public String toString() {
        return String.format("%s: %.2f €", titular, saldo);
    }
}
