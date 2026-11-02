/*
 * Programa 3 · Dar la vuelta a la cola sin crear nodos
 * Del artículo «LinkedList en Java práctica — la cola de reservas con first y last, los préstamos ordenados y la cola al revés (como en el Examen 3)»
 * https://sergiolearns.com/linkedlist-en-java-practica/
 */
public class PruebaInvertir {
    public static void main(String[] args) {
        ColaInvertible cola = new ColaInvertible();
        cola.invertir();
        System.out.println("Vacía invertida: " + cola);
        cola.insertarDetras("Laura");
        cola.invertir();
        System.out.println("Un nodo invertido: " + cola);
        cola.insertarDetras("Pablo");
        cola.insertarDetras("Marta");
        cola.insertarDetras("Iván");
        System.out.println("Cola: " + cola);
        cola.invertir();
        System.out.println("Invertida: " + cola);
        cola.invertir();
        System.out.println("Otra vez: " + cola);
    }
}
