// Del artículo «Comparable y Cloneable en Java — práctica con un ranking, copias de seguridad y árboles ordenados (y la palabra que desapareció del TreeSet)» — https://sergiolearns.com/comparable-y-cloneable-en-java-practica/

public class Direccion implements Cloneable {
    private String ciudad;

    public Direccion(String ciudad) { this.ciudad = ciudad; }

    public void setCiudad(String ciudad) { this.ciudad = ciudad; }

    @Override
    public Direccion clone() {
        try {
            return (Direccion) super.clone();   // solo hay un String (inmutable): basta con esto
        } catch (CloneNotSupportedException e) {
            throw new AssertionError(e);
        }
    }

    @Override
    public String toString() { return ciudad; }
}
