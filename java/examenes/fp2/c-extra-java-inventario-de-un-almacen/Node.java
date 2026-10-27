/* Simulacro práctico de FP2 · versión C · Inventario de un almacén (clase dada)
   Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
   https://sergiolearns.com/simulacro-examen-fp2-practica/ */
public class Node {
    public Item value;
    public Node next;

    public Node(Item value) {
        this.value = value;
    }
}
