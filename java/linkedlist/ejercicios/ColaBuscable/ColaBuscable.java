/*
 * Solución del ejercicio 1 · Obtener la reserva de una posición y buscar a un socio
 * Del artículo «LinkedList en Java ejercicios — la reserva de la posición N, los socios repetidos y la cola partida por la mitad (con soluciones y chuletario)»
 * https://sergiolearns.com/linkedlist-en-java-ejercicios/
 */
/** Ejercicio 1: leer por posición y buscar la posición de un socio. */
public class ColaBuscable extends ContainerBase {
    private int size;

    public void insertarDetras(String socio) {
        Node nuevo = new Node(socio);
        if (first == null) {
            first = nuevo;
        } else {
            Node actual = first;
            while (actual.next != null) {
                actual = actual.next;
            }
            actual.next = nuevo;
        }
        size++;
    }

    public String obtener(int pos) {
        if (pos < 0 || pos >= size) {         // validamos ANTES de movernos
            return null;
        }
        Node actual = first;
        for (int i = 0; i < pos; i++) {       // pos saltos desde la cabeza
            actual = actual.next;
        }
        return actual.value;
    }

    public int indiceDe(String socio) {
        int pos = 0;
        for (Node n = first; n != null; n = n.next) {
            if (n.value.equals(socio)) {
                return pos;                   // el primero que coincide
            }
            pos++;
        }
        return -1;                            // no está
    }
}
