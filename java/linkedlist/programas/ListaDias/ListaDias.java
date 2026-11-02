/*
 * Programa 2 · La lista ordenada de préstamos y «eliminar todos»
 * Del artículo «LinkedList en Java práctica — la cola de reservas con first y last, los préstamos ordenados y la cola al revés (como en el Examen 3)»
 * https://sergiolearns.com/linkedlist-en-java-practica/
 */
/** Días que duró cada préstamo, siempre de menor a mayor. */
public class ListaDias extends ContainerBase {
    private int size;

    public void insertarOrdenado(int dias) {
        Node nuevo = new Node(dias);
        if (first == null || dias <= first.value) {          // caso 1: vacía, o va delante de todos
            nuevo.next = first;
            first = nuevo;
        } else {
            Node actual = first;
            while (actual.next != null && actual.next.value < dias) {
                actual = actual.next;                        // paramos en el ÚLTIMO menor que dias
            }
            nuevo.next = actual.next;                        // 1. el nuevo apunta al resto...
            actual.next = nuevo;                             // 2. ...y actual apunta al nuevo
        }
        size++;
    }

    public int eliminarTodos(int dias) {
        int borrados = 0;
        while (first != null && first.value == dias) {      // los de la cabeza (puede haber varios seguidos)
            first = first.next;
            borrados++;
        }
        if (first != null) {
            Node anterior = first;
            while (anterior.next != null) {
                if (anterior.next.value == dias) {
                    anterior.next = anterior.next.next;      // saltamos el siguiente; anterior NO avanza
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
