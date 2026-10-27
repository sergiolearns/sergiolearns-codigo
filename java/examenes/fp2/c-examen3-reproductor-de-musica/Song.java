/* Simulacro práctico de FP2 · versión C · Reproductor de música (clase dada)
   Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
   https://sergiolearns.com/simulacro-examen-fp2-practica/ */
public class Song {
    public final String title;
    public final int seconds;

    public Song(String title, int seconds) {
        this.title = title;
        this.seconds = seconds;
    }

    @Override
    public String toString() {
        return title + " (" + seconds + " s)";
    }
}
