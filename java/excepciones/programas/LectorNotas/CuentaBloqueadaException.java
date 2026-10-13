// Del artículo «Excepciones en Java — práctica con un importador de notas, un cajero y un lector de ficheros (y el "Error" que no decía nada)» — https://sergiolearns.com/excepciones-en-java-practica/

public class CuentaBloqueadaException extends Exception {

    public CuentaBloqueadaException() {
        super("Cuenta bloqueada: 3 PIN incorrectos seguidos");
    }
}
