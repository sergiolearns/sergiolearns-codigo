/* Simulacro práctico de FP2 · versión B · Lista de tareas (clase dada)
   Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
   https://sergiolearns.com/simulacro-examen-fp2-practica/ */
public class ContainerBase {
    protected Node first;
    protected Node last;

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("➡");
        int steps = 0;        // tope por si hay un ciclo
        for (Node n = first; n != null && steps < 1000; n = n.next, steps++) {
            sb.append("[").append(n.value).append("]");
            if (n == last) sb.append("⬅");
            sb.append("->");
        }
        return sb.append("null").toString();
    }
}
