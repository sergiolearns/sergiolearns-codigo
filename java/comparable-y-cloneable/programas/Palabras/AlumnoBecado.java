// Del artículo «Comparable y Cloneable en Java — práctica con un ranking, copias de seguridad y árboles ordenados (y la palabra que desapareció del TreeSet)» — https://sergiolearns.com/comparable-y-cloneable-en-java-practica/

public class AlumnoBecado extends Alumno {
    private double beca;

    public AlumnoBecado(String nombre, String ciudad, double beca) {
        super(nombre, ciudad);
        this.beca = beca;
    }

    public AlumnoBecado(AlumnoBecado otro) {
        super(otro);
        this.beca = otro.beca;
    }

    @Override
    public String toString() {
        return super.toString() + " con beca de " + beca;
    }
}
