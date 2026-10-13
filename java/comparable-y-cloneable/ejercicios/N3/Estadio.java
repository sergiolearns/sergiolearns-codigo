// Del artículo «Comparable y Cloneable en Java — ejercicios con libros, jugadores y una plantilla clonada (y la resta que puso al más rico el primero)» — https://sergiolearns.com/comparable-y-cloneable-en-java-ejercicios/

public class Estadio implements Cloneable {
    private String nombre;
    private int aforo;

    public Estadio(String nombre, int aforo) {
        this.nombre = nombre;
        this.aforo = aforo;
    }

    public void setAforo(int aforo) { this.aforo = aforo; }

    @Override
    public Estadio clone() {
        try {
            return (Estadio) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError(e);
        }
    }

    @Override
    public String toString() { return nombre + " (" + aforo + ")"; }
}
