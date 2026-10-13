// Del artículo «Excepciones en Java — ejercicios con un conversor, fechas y un banco (y el try que puse en el sitio equivocado)» — https://sergiolearns.com/excepciones-en-java-ejercicios/

public class Cuenta {

    private final String iban;
    private double saldo;

    public Cuenta(String iban, double saldo) {
        this.iban = iban;
        this.saldo = saldo;
    }

    public String getIban()  { return iban; }
    public double getSaldo() { return saldo; }

    // Solo el banco las usa, y solo después de validarlo todo
    void sacar(double cantidad)  { saldo -= cantidad; }
    void meter(double cantidad)  { saldo += cantidad; }
}
