// Del artículo «Interfaces en Java — práctica con una pasarela de pagos, un carrito y un mando de dispositivos (y la clase abstracta que no pudo con dos padres)» — https://sergiolearns.com/interfaces-en-java-practica/

public class Tarjeta implements Pagable {

    private double limite;

    public Tarjeta(double limite) {
        this.limite = limite;
    }

    @Override
    public double comision(double importe) {
        return importe * 0.01;                      // 1 % de comisión
    }

    @Override
    public boolean pagar(double importe) {
        double total = importe + comision(importe);
        if (total > limite) {
            return false;
        }
        limite -= total;
        return true;
    }

    @Override
    public String nombre() {
        return "Tarjeta";
    }
}
