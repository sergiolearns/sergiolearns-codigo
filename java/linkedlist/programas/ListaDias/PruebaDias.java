/*
 * Programa 2 · La lista ordenada de préstamos y «eliminar todos»
 * Del artículo «LinkedList en Java práctica — la cola de reservas con first y last, los préstamos ordenados y la cola al revés (como en el Examen 3)»
 * https://sergiolearns.com/linkedlist-en-java-practica/
 */
public class PruebaDias {
    public static void main(String[] args) {
        ListaDias lista = new ListaDias();
        int[] llegadas = {15, 8, 42, 3, 27, 8, 19, 8};     // solo para la prueba: la lista no usa el array
        for (int d : llegadas) {
            lista.insertarOrdenado(d);
            System.out.println("Inserto " + d + ": " + lista);
        }
        System.out.println("Quito los de 8: " + lista.eliminarTodos(8) + " -> " + lista + " | size " + lista.getSize());
        System.out.println("Quito los de 3: " + lista.eliminarTodos(3) + " -> " + lista);
        System.out.println("Quito los de 100: " + lista.eliminarTodos(100) + " -> " + lista + " | size " + lista.getSize());
    }
}
