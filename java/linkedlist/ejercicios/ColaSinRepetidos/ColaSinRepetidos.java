/*
 * Solución del ejercicio 2 · Eliminar los socios repetidos sin colecciones
 * Del artículo «LinkedList en Java ejercicios — la reserva de la posición N, los socios repetidos y la cola partida por la mitad (con soluciones y chuletario)»
 * https://sergiolearns.com/linkedlist-en-java-ejercicios/
 */
/** Ejercicio 2: quitar los socios repetidos sin usar colecciones (prohibidas en el examen). */
public class ColaSinRepetidos extends ContainerBase {
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

    public int eliminarDuplicados() {
        int borrados = 0;
        for (Node actual = first; actual != null; actual = actual.next) {
            Node anterior = actual;                       // buscamos copias de actual DETRÁS de él
            while (anterior.next != null) {
                if (anterior.next.value.equals(actual.value)) {
                    anterior.next = anterior.next.next;   // saltamos la copia; anterior NO avanza
                    borrados++;
                } else {
                    anterior = anterior.next;
                }
            }
        }
        size -= borrados;
        return borrados;
    }

    public int getSize() {
        return size;
    }
}
