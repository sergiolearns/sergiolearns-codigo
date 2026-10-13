// Del artículo «Comparable y Cloneable en Java — ejercicios con libros, jugadores y una plantilla clonada (y la resta que puso al más rico el primero)» — https://sergiolearns.com/comparable-y-cloneable-en-java-ejercicios/

public class Jugador {
    private final String nombre;
    private final int puntos;
    private final int partidos;

    public Jugador(String nombre, int puntos, int partidos) {
        this.nombre = nombre;
        this.puntos = puntos;
        this.partidos = partidos;
    }

    public String getNombre() { return nombre; }
    public int getPuntos() { return puntos; }
    public int getPartidos() { return partidos; }

    @Override
    public String toString() {
        return nombre + " " + puntos + " pts en " + partidos + " partidos";
    }
}
