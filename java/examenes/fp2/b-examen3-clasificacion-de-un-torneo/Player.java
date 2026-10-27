/* Simulacro práctico de FP2 · versión B · Clasificación de un torneo (clase dada)
   Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
   https://sergiolearns.com/simulacro-examen-fp2-practica/ */
public class Player {
    public final String name;
    public int points;

    public Player(String name, int points) {
        this.name = name;
        this.points = points;
    }

    @Override
    public String toString() {
        return name + ":" + points;
    }
}
