// Del artículo «Excepciones en Java — ejercicios con un conversor, fechas y un banco (y el try que puse en el sitio equivocado)» — https://sergiolearns.com/excepciones-en-java-ejercicios/

public class SaldoInsuficienteException extends BancoException {

    private final double faltan;

    public SaldoInsuficienteException(String iban, double faltan) {
        super(String.format("saldo insuficiente en %s: faltan %.2f €", iban, faltan));
        this.faltan = faltan;
    }

    public double getFaltan() { return faltan; }
}
