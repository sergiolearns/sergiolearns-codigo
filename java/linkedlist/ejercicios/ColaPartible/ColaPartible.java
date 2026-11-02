/*
 * Solución del ejercicio 3 · Partir la cola por la mitad en un solo recorrido
 * Del artículo «LinkedList en Java ejercicios — la reserva de la posición N, los socios repetidos y la cola partida por la mitad (con soluciones y chuletario)»
 * https://sergiolearns.com/linkedlist-en-java-ejercicios/
 */
/** Desafío: partir la cola por la mitad en un solo recorrido (dos referencias a distinta velocidad). */
public class ColaPartible extends ContainerBase {
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

    public ColaPartible partirPorLaMitad() {
        ColaPartible segunda = new ColaPartible();
        if (first == null || first.next == null) {     // 0 o 1 nodos: no hay segunda mitad
            return segunda;
        }
        Node lento = first;
        Node rapido = first.next;
        while (rapido != null && rapido.next != null) {
            lento = lento.next;                        // 1 salto
            rapido = rapido.next.next;                 // 2 saltos
        }
        segunda.first = lento.next;                    // la segunda mitad empieza detrás de lento
        lento.next = null;                             // cortamos la cadena
        segunda.size = size / 2;                       // la primera se queda con el de más si es impar
        size = size - segunda.size;
        return segunda;
    }

    public int getSize() {
        return size;
    }
}
