// Del artículo «Interfaces en Java — práctica con una pasarela de pagos, un carrito y un mando de dispositivos (y la clase abstracta que no pudo con dos padres)» — https://sergiolearns.com/interfaces-en-java-practica/

public class Bizum implements Pagable {

    private double saldo;

    public Bizum(double saldo) {
        this.saldo = saldo;
    }

    @Override
    public boolean pagar(double importe) {
        if (importe > saldo) {
            return false;
        }
        saldo -= importe;
        return true;
    }

    @Override
    public String nombre() {
        return "Bizum";
    }
}
