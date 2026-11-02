/*
 * Solución del ejercicio 2 · Eliminar los socios repetidos sin colecciones
 * Del artículo «LinkedList en Java ejercicios — la reserva de la posición N, los socios repetidos y la cola partida por la mitad (con soluciones y chuletario)»
 * https://sergiolearns.com/linkedlist-en-java-ejercicios/
 */
public class Node {
    public String value;     // el dato: quién ha reservado
    public Node next;        // el siguiente nodo (null si es el último)

    public Node(String value) {
        this.value = value;
    }
}
