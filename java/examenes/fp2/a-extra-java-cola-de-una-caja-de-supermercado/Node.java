/* Simulacro práctico de FP2 · versión A · Cola de una caja de supermercado (clase dada)
   Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
   https://sergiolearns.com/simulacro-examen-fp2-practica/ */
public class Node {
    public Customer value;
    public Node next;

    public Node(Customer value) {
        this.value = value;
    }
}
