// Del artículo «Interfaces en Java — práctica con una pasarela de pagos, un carrito y un mando de dispositivos (y la clase abstracta que no pudo con dos padres)» — https://sergiolearns.com/interfaces-en-java-practica/

public class Efectivo implements Pagable {

    private double cartera;

    public Efectivo(double cartera) {
        this.cartera = cartera;
    }

    @Override
    public boolean pagar(double importe) {
        if (importe > cartera) {
            return false;
        }
        cartera -= importe;
        return true;
    }

    @Override
    public String nombre() {
        return "Efectivo";
    }
}
