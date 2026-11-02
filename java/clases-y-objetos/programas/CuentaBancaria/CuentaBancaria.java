/*
 * Programa 1: una cuenta bancaria que se defiende sola
 * Del artículo «Clases y objetos en Java — práctica con la cuenta de Laura, la biblioteca de la facultad y el inventario del laboratorio (y la cuenta que era de nadie)»
 * https://sergiolearns.com/clases-y-objetos-en-java-practica/
 */
public class CuentaBancaria {

    private static int siguienteNumero = 1;    // compartido: genera números únicos

    private final int numero;                  // se asigna una vez y no cambia
    private final String titular;
    private double saldo;                      // solo se toca desde dentro, con métodos que validan

    public CuentaBancaria(String titular, double saldoInicial) {
        this.numero = siguienteNumero++;       // usa el valor actual y deja preparado el siguiente
        this.titular = titular;
        this.saldo = Math.max(0, saldoInicial);    // un saldo inicial negativo se queda en 0
    }

    public CuentaBancaria(String titular) {
        this(titular, 0);                      // sin saldo inicial: 0
    }

    public boolean ingresar(double cantidad) {
        if (cantidad <= 0) {
            return false;
        }
        saldo += cantidad;
        return true;
    }

    public boolean retirar(double cantidad) {
        if (cantidad <= 0 || cantidad > saldo) {
            return false;
        }
        saldo -= cantidad;
        return true;
    }

    public boolean transferir(CuentaBancaria destino, double cantidad) {
        if (destino == null || destino == this) {
            return false;                      // a nadie, o a sí misma: no tiene sentido
        }
        if (!retirar(cantidad)) {
            return false;                      // si no hay saldo, no sigue
        }
        destino.ingresar(cantidad);            // se usa un método de OTRO objeto de la misma clase
        return true;
    }

    public double getSaldo()   { return saldo; }
    public String getTitular() { return titular; }

    @Override
    public String toString() {
        return String.format("Cuenta %03d · %s · %.2f €", numero, titular, saldo);
    }

    public static void main(String[] args) {
        CuentaBancaria laura = new CuentaBancaria("Laura", 150);
        CuentaBancaria pablo = new CuentaBancaria("Pablo");

        System.out.println("Ingresar 50:          " + laura.ingresar(50));
        System.out.println("Retirar 500:          " + laura.retirar(500));
        System.out.println("Transferir 80:        " + laura.transferir(pablo, 80));
        System.out.println("Ingresar -20:         " + pablo.ingresar(-20));
        System.out.println("Transferirse a sí:    " + laura.transferir(laura, 10));

        System.out.println(laura);
        System.out.println(pablo);
    }
}
