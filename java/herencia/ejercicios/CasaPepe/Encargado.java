// Del artículo «Herencia en Java — ejercicios con un refugio de animales, figuras que se ordenan y la plantilla de un restaurante (y el cast que convirtió a mi gato en perro)» — https://sergiolearns.com/herencia-en-java-ejercicios/

public class Encargado extends Camarero {

    private static final double PLUS_RESPONSABILIDAD = 120.0;

    public Encargado(String nombre, int horasSemana) {
        super(nombre, horasSemana);
    }

    @Override
    public String getPuesto() { return "Encargado"; }

    @Override
    public double costeSemanal() {
        return super.costeSemanal() + PLUS_RESPONSABILIDAD;   // lo del camarero + el plus
    }
}
