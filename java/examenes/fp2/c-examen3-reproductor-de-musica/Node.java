/* Simulacro práctico de FP2 · versión C · Reproductor de música (clase dada)
   Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
   https://sergiolearns.com/simulacro-examen-fp2-practica/ */
public class Node {
    public Song value;
    public Node prev;
    public Node next;

    public Node(Song value) {
        this.value = value;
    }
}
