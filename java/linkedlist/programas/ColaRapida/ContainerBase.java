/*
 * Programa 1 · La cola de reservas con first y last
 * Del artículo «LinkedList en Java práctica — la cola de reservas con first y last, los préstamos ordenados y la cola al revés (como en el Examen 3)»
 * https://sergiolearns.com/linkedlist-en-java-practica/
 */
public class ContainerBase {
    protected Node first;    // la cabeza: el primer nodo (null si está vacía)

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("➡");
        int steps = 0;       // tope por si hay un ciclo
        for (Node n = first; n != null && steps < 1000; n = n.next, steps++) {
            sb.append(n.value).append("->");
        }
        return sb.append("null").toString();
    }
}
