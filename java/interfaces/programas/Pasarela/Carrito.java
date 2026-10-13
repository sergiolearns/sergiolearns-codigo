// Del artículo «Interfaces en Java — práctica con una pasarela de pagos, un carrito y un mando de dispositivos (y la clase abstracta que no pudo con dos padres)» — https://sergiolearns.com/interfaces-en-java-practica/

public class Carrito {

    private final Vendible[] articulos = new Vendible[10];
    private int cantidad = 0;

    public void anadir(Vendible v) {
        articulos[cantidad++] = v;
    }

    public double envio() {
        double envio = 0;
        for (int i = 0; i < cantidad; i++) {
            if (articulos[i] instanceof Enviable e) {     // solo los productos físicos
                envio += e.gastosEnvio();
            }
        }
        return envio;
    }

    public double total() {
        double total = envio();
        for (int i = 0; i < cantidad; i++) {
            total += articulos[i].precioFinal();
        }
        return total;
    }

    public void ticket() {
        for (int i = 0; i < cantidad; i++) {
            System.out.printf("%s · %.2f €%n", articulos[i].nombre(), articulos[i].precioFinal());
        }
        System.out.printf("Envío: %.2f €%n", envio());
        System.out.printf("TOTAL: %.2f €%n", total());
    }

    // El carrito no sabe si paga con tarjeta, Bizum o efectivo: solo que es Pagable
    public boolean pagar(Pagable medio) {
        boolean ok = medio.pagar(total());
        System.out.println("Pago con " + medio.nombre() + ": " + (ok ? "aceptado" : "rechazado"));
        return ok;
    }
}
