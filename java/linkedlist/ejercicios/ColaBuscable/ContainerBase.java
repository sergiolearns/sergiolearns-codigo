/*
 * Solución del ejercicio 1 · Obtener la reserva de una posición y buscar a un socio
 * Del artículo «LinkedList en Java ejercicios — la reserva de la posición N, los socios repetidos y la cola partida por la mitad (con soluciones y chuletario)»
 * https://sergiolearns.com/linkedlist-en-java-ejercicios/
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
