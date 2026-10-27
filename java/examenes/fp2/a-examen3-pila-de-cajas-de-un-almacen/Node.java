/* Simulacro práctico de FP2 · versión A · Pila de cajas de un almacén (clase dada)
   Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
   https://sergiolearns.com/simulacro-examen-fp2-practica/ */
public class Node {
    public Box value;
    public Node next;

    public Node(Box value) {
        this.value = value;
    }
}
