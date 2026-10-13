// Del artículo «Comparable y Cloneable en Java — práctica con un ranking, copias de seguridad y árboles ordenados (y la palabra que desapareció del TreeSet)» — https://sergiolearns.com/comparable-y-cloneable-en-java-practica/

import java.util.ArrayList;
import java.util.List;

public class Alumno implements Cloneable {
    private String nombre;
    private List<Double> notas = new ArrayList<>();
    private Direccion direccion;

    public Alumno(String nombre, String ciudad) {
        this.nombre = nombre;
        this.direccion = new Direccion(ciudad);
    }

    // Constructor de copia (copia profunda)
    public Alumno(Alumno otro) {
        this.nombre = otro.nombre;
        this.notas = new ArrayList<>(otro.notas);
        this.direccion = otro.direccion.clone();
    }

    public void anotar(double nota) { notas.add(nota); }
    public Direccion getDireccion() { return direccion; }
    public List<Double> getNotas() { return notas; }

    // clone() superficial: solo lo que hace super.clone()
    public Alumno cloneSuperficial() {
        try {
            return (Alumno) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError(e);
        }
    }

    // clone() profundo: super.clone() y después duplicamos lo mutable
    @Override
    public Alumno clone() {
        Alumno copia = cloneSuperficial();
        copia.notas = new ArrayList<>(this.notas);
        copia.direccion = this.direccion.clone();
        return copia;
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + " " + nombre + " " + notas + " en " + direccion;
    }
}
