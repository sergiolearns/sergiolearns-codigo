/*
 * Programa 1 · La cola de reservas con first y last
 * Del artículo «LinkedList en Java práctica — la cola de reservas con first y last, los préstamos ordenados y la cola al revés (como en el Examen 3)»
 * https://sergiolearns.com/linkedlist-en-java-practica/
 */
/** Cola de reservas con first y last: encolar por detrás y atender por delante, las dos sin recorrer. */
public class ColaRapida extends ContainerBase {
    private Node last;                        // el último nodo: así no hay que recorrer para encolar
    private int size;

    public void encolar(String socio) {
        Node nuevo = new Node(socio);
        if (first == null) {                  // cola vacía: el nuevo es el primero Y el último
            first = nuevo;
        } else {
            last.next = nuevo;                // el último de antes apunta al nuevo...
        }
        last = nuevo;                         // ...y el nuevo pasa a ser el último
        size++;
    }

    public String atender() {
        if (first == null) {
            return null;                      // nadie a quien atender
        }
        String socio = first.value;
        first = first.next;
        if (first == null) {                  // se ha quedado vacía: last también a null
            last = null;
        }
        size--;
        return socio;
    }

    public String verPrimero() {
        return first == null ? null : first.value;
    }

    public String verUltimo() {
        return last == null ? null : last.value;
    }

    public int getSize() {
        return size;
    }
}
