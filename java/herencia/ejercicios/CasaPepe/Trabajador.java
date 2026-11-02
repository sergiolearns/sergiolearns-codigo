// Del artículo «Herencia en Java — ejercicios con un refugio de animales, figuras que se ordenan y la plantilla de un restaurante (y el cast que convirtió a mi gato en perro)» — https://sergiolearns.com/herencia-en-java-ejercicios/

public abstract class Trabajador {

    public static final double PRECIO_HORA = 10.0;

    private final String nombre;
    protected final int horasSemana;                   // las hijas lo pueden leer

    public Trabajador(String nombre, int horasSemana) {
        this.nombre = nombre;
        this.horasSemana = Math.max(0, horasSemana);
    }

    public String getNombre() { return nombre; }

    public abstract String getPuesto();

    // Coste base: horas × precio. Las hijas lo amplían si hace falta
    public double costeSemanal() {
        return horasSemana * PRECIO_HORA;
    }

    @Override
    public String toString() {
        return String.format("%-9s %-6s %7.2f €", getPuesto(), nombre, costeSemanal());
    }
}
