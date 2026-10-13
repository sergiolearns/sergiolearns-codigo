// Del artículo «Comparable y Cloneable en Java — ejercicios con libros, jugadores y una plantilla clonada (y la resta que puso al más rico el primero)» — https://sergiolearns.com/comparable-y-cloneable-en-java-ejercicios/

import java.util.ArrayList;
import java.util.List;

public class Plantilla implements Cloneable {
    private String equipo;
    private List<Jugador> jugadores = new ArrayList<>();
    private Estadio estadio;

    public Plantilla(String equipo, Estadio estadio) {
        this.equipo = equipo;
        this.estadio = estadio;
    }

    public void fichar(Jugador j) { jugadores.add(j); }
    public List<Jugador> getJugadores() { return jugadores; }
    public Estadio getEstadio() { return estadio; }

    @Override
    public Plantilla clone() {
        try {
            Plantilla copia = (Plantilla) super.clone();
            // La lista nueva debe contener COPIAS de los jugadores, no los mismos objetos
            copia.jugadores = new ArrayList<>();
            for (Jugador j : this.jugadores) {
                copia.jugadores.add(j.clone());
            }
            copia.estadio = this.estadio.clone();
            return copia;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError(e);
        }
    }

    @Override
    public String toString() {
        return equipo + " " + jugadores + " en " + estadio;
    }
}
