// Del artículo «Herencia en Java — práctica con una nómina, unas figuras y dos tipos de cuenta (y el saldo que hice public para que compilara)» — https://sergiolearns.com/herencia-en-java-practica/

public class CuentaAhorro extends Cuenta {

    private static final int MAX_RETIRADAS = 2;       // al mes

    private final double interes;                     // 0.02 = 2 %
    private int retiradas = 0;

    public CuentaAhorro(String titular, double saldoInicial, double interes) {
        super(titular, saldoInicial);
        this.interes = interes;
    }

    @Override
    public boolean retirar(double cantidad) {
        if (retiradas == MAX_RETIRADAS) return false; // regla extra de la hija
        boolean ok = super.retirar(cantidad);         // y además, la regla del padre
        if (ok) retiradas++;
        return ok;
    }

    public void aplicarIntereses() {
        saldo += saldo * interes;                     // protected: lo tocamos directamente
        retiradas = 0;                                // empieza un mes nuevo
    }

    @Override
    public String toString() {
        return "[Ahorro] " + super.toString();
    }
}
