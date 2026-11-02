/*
 * Programa 3 · Dar la vuelta a la cola sin crear nodos
 * Del artículo «LinkedList en Java práctica — la cola de reservas con first y last, los préstamos ordenados y la cola al revés (como en el Examen 3)»
 * https://sergiolearns.com/linkedlist-en-java-practica/
 */
public class Node {
    public String value;     // el dato: quién ha reservado
    public Node next;        // el siguiente nodo (null si es el último)

    public Node(String value) {
        this.value = value;
    }
}
