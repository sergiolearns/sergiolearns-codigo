/*
 * Programa 1: una cuenta bancaria que se defiende sola
 * Del artículo «Clases y objetos en Java — práctica con un banco, una biblioteca y el inventario de un laboratorio (y la cuenta que era de nadie)»
 * https://sergiolearns.com/clases-y-objetos-en-java-practica/
 */

public class CuentaBancaria {

    private static int siguienteNumero = 1;   // compartido: genera números únicos

    private final int numero;                 // asignado una vez, no cambia
    private final String titular;
    private double saldo;                     // solo se toca desde dentro

    public CuentaBancaria(String titular, double saldoInicial) {
        this.numero = siguienteNumero++;      // usa el valor y lo prepara para la siguiente
        this.titular = titular;
        this.saldo = Math.max(0, saldoInicial);
    }

    public CuentaBancaria(String titular) {
        this(titular, 0);
    }

    public boolean ingresar(double cantidad) {
        if (cantidad <= 0) return false;
        saldo += cantidad;
        return true;
    }

    public boolean retirar(double cantidad) {
        if (cantidad <= 0 || cantidad > saldo) return false;
        saldo -= cantidad;
        return true;
    }

    public boolean transferir(CuentaBancaria destino, double cantidad) {
        if (destino == null || destino == this) return false;
        if (!retirar(cantidad)) return false;     // si no hay saldo, no sigue
        destino.ingresar(cantidad);               // accede a OTRO objeto de la misma clase
        return true;
    }

    public double getSaldo() { return saldo; }
    public String getTitular() { return titular; }

    @Override
    public String toString() {
        return String.format("Cuenta %03d · %s · %.2f €", numero, titular, saldo);
    }

    public static void main(String[] args) {
        CuentaBancaria sergio = new CuentaBancaria("Sergio", 150);
        CuentaBancaria laura = new CuentaBancaria("Laura");

        System.out.println(sergio.ingresar(50));      // true
        System.out.println(sergio.retirar(500));      // false: no hay tanto
        System.out.println(sergio.transferir(laura, 80));
        System.out.println(laura.ingresar(-20));      // false: cantidad negativa

        System.out.println(sergio);
        System.out.println(laura);
    }
}
