// Del artículo «Herencia en Java — ejercicios con un refugio de animales, figuras que se ordenan y la plantilla de un restaurante (y el cast que convirtió a mi gato en perro)» — https://sergiolearns.com/herencia-en-java-ejercicios/

public class Camarero extends Trabajador {

    private double propinas;                           // no es coste: lo pagan los clientes

    public Camarero(String nombre, int horasSemana) {
        super(nombre, horasSemana);
    }

    public void registrarPropina(double cantidad) {
        if (cantidad > 0) propinas += cantidad;
    }

    public double getPropinas() { return propinas; }

    @Override
    public String getPuesto() { return "Camarero"; }
    // costeSemanal(): el heredado de Trabajador sirve tal cual
}
