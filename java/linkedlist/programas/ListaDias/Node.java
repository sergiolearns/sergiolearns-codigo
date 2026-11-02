/*
 * Programa 2 · La lista ordenada de préstamos y «eliminar todos»
 * Del artículo «LinkedList en Java práctica — la cola de reservas con first y last, los préstamos ordenados y la cola al revés (como en el Examen 3)»
 * https://sergiolearns.com/linkedlist-en-java-practica/
 */
public class Node {
    public int value;        // el dato: días que duró un préstamo
    public Node next;        // el siguiente nodo (null si es el último)

    public Node(int value) {
        this.value = value;
    }
}
