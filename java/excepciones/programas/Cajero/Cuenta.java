// Del artículo «Excepciones en Java — práctica con un importador de notas, un cajero y un lector de ficheros (y el "Error" que no decía nada)» — https://sergiolearns.com/excepciones-en-java-practica/

public class Cuenta {

    private static final int MAX_FALLOS = 3;

    private final String pin;
    private double saldo;
    private int fallos = 0;

    public Cuenta(String pin, double saldo) {
        this.pin = pin;
        this.saldo = saldo;
    }

    public void comprobarPin(String intento) throws CuentaBloqueadaException {
        if (fallos >= MAX_FALLOS) {
            throw new CuentaBloqueadaException();             // ya estaba bloqueada
        }
        if (!pin.equals(intento)) {
            fallos++;
            if (fallos == MAX_FALLOS) {
                throw new CuentaBloqueadaException();         // este fallo la bloquea
            }
            throw new IllegalArgumentException("PIN incorrecto (intentos restantes: " + (MAX_FALLOS - fallos) + ")");
        }
        fallos = 0;                                           // PIN correcto: se reinicia la cuenta de fallos
    }

    public void retirar(double cantidad) throws SaldoInsuficienteException {
        if (cantidad <= 0 || cantidad % 10 != 0) {
            throw new IllegalArgumentException("cantidad no válida: " + cantidad + " (múltiplos de 10)");
        }
        if (cantidad > saldo) {
            throw new SaldoInsuficienteException(cantidad - saldo);
        }
        saldo -= cantidad;                                    // solo llega aquí si todo es correcto
    }

    public double getSaldo() { return saldo; }
}
