// Del artículo «Excepciones en Java — práctica con un importador de notas, un cajero y un lector de ficheros (y el "Error" que no decía nada)» — https://sergiolearns.com/excepciones-en-java-practica/

public class SaldoInsuficienteException extends Exception {

    private final double faltan;

    public SaldoInsuficienteException(double faltan) {
        super(String.format("Saldo insuficiente: faltan %.2f €", faltan));
        this.faltan = faltan;
    }

    public double getFaltan() { return faltan; }
}
