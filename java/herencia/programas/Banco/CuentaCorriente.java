// Del artículo «Herencia en Java — práctica con una nómina, unas figuras y dos tipos de cuenta (y el saldo que hice public para que compilara)» — https://sergiolearns.com/herencia-en-java-practica/

public class CuentaCorriente extends Cuenta {

    private final double limiteDescubierto;           // cuánto puede quedar en negativo

    public CuentaCorriente(String titular, double saldoInicial, double limiteDescubierto) {
        super(titular, saldoInicial);
        this.limiteDescubierto = limiteDescubierto;
    }

    @Override
    public boolean retirar(double cantidad) {
        // Aquí NO llamamos a super.retirar(): su regla (no bajar de 0) es justo la que cambiamos
        if (cantidad <= 0 || saldo - cantidad < -limiteDescubierto) return false;
        saldo -= cantidad;
        return true;
    }

    @Override
    public String toString() {
        return "[Corriente] " + super.toString();
    }
}
