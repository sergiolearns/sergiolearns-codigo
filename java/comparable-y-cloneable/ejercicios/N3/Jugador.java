// Del artículo «Comparable y Cloneable en Java — ejercicios con libros, jugadores y una plantilla clonada (y la resta que puso al más rico el primero)» — https://sergiolearns.com/comparable-y-cloneable-en-java-ejercicios/

public class Jugador implements Cloneable {
    private final String nombre;
    private int puntos;

    public Jugador(String nombre, int puntos) {
        this.nombre = nombre;
        this.puntos = puntos;
    }

    public void sumar(int p) { puntos += p; }

    @Override
    public Jugador clone() {
        try {
            return (Jugador) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError(e);
        }
    }

    @Override
    public String toString() { return nombre + ":" + puntos; }
}
