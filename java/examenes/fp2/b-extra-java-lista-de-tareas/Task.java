/* Simulacro práctico de FP2 · versión B · Lista de tareas (clase dada)
   Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
   https://sergiolearns.com/simulacro-examen-fp2-practica/ */
public class Task {
    public final String title;
    public final int minutes;
    public boolean done;

    public Task(String title, int minutes) {
        this.title = title;
        this.minutes = minutes;
    }

    @Override
    public String toString() {
        return title + " " + minutes + "min" + (done ? " ✔" : "");
    }
}
