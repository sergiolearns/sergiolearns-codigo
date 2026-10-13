// Del artículo «Excepciones en Java — ejercicios con un conversor, fechas y un banco (y el try que puse en el sitio equivocado)» — https://sergiolearns.com/excepciones-en-java-ejercicios/

public class CuentaNoEncontradaException extends BancoException {

    private final String iban;

    public CuentaNoEncontradaException(String iban) {
        super("no existe la cuenta " + iban);
        this.iban = iban;
    }

    public String getIban() { return iban; }
}
