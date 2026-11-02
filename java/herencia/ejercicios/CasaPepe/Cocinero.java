// Del artículo «Herencia en Java — ejercicios con un refugio de animales, figuras que se ordenan y la plantilla de un restaurante (y el cast que convirtió a mi gato en perro)» — https://sergiolearns.com/herencia-en-java-ejercicios/

public class Cocinero extends Trabajador {

    private final boolean turnoNoche;

    public Cocinero(String nombre, int horasSemana, boolean turnoNoche) {
        super(nombre, horasSemana);
        this.turnoNoche = turnoNoche;
    }

    @Override
    public String getPuesto() { return "Cocinero"; }

    @Override
    public double costeSemanal() {
        double base = super.costeSemanal();            // reutilizamos el cálculo del padre
        return turnoNoche ? base * 1.25 : base;        // +25 % por nocturnidad
    }
}
