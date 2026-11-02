/*
 * Programa 3 · Dar la vuelta a la cola sin crear nodos
 * Del artículo «LinkedList en Java práctica — la cola de reservas con first y last, los préstamos ordenados y la cola al revés (como en el Examen 3)»
 * https://sergiolearns.com/linkedlist-en-java-practica/
 */
/** Cola de reservas que se puede dar la vuelta sin crear nodos nuevos. */
public class ColaInvertible extends ContainerBase {

    public void insertarDetras(String socio) {
        Node nuevo = new Node(socio);
        if (first == null) {
            first = nuevo;
            return;
        }
        Node actual = first;
        while (actual.next != null) {
            actual = actual.next;
        }
        actual.next = nuevo;
    }

    public void invertir() {
        Node anterior = null;
        Node actual = first;
        while (actual != null) {
            Node siguiente = actual.next;     // 1. guardar el resto ANTES de tocar nada
            actual.next = anterior;           // 2. darle la vuelta a la flecha
            anterior = actual;                // 3. avanzar anterior...
            actual = siguiente;               // 4. ...y actual
        }
        first = anterior;                     // la nueva cabeza es la antigua cola
    }
}
