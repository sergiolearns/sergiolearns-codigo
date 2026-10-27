/* Simulacro práctico de FP2 · versión C · Reproductor de música (clase dada)
   Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
   https://sergiolearns.com/simulacro-examen-fp2-practica/ */
public class ContainerBase {
    protected Node first;
    protected Node last;
    protected Node current;   // la canción que suena

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("->");
        int steps = 0;        // tope por si hay un ciclo
        for (Node n = first; n != null && steps < 1000; n = n.next, steps++) {
            if (n != first) sb.append("<->");
            sb.append(n == current ? "{*" + n.value + "*}" : "[" + n.value + "]");
        }
        return sb.append("->null").toString().replace("->->null", "->null");
    }
}
