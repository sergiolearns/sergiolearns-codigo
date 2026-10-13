/*
 * El código
 * Del artículo «Colecciones en Java — práctica con un contador de palabras, claves propias y colas de préstamos (y el HashMap que imprimía en un orden que no entendía)»
 * https://sergiolearns.com/colecciones-en-java-practica/
 */

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.NoSuchElementException;
import java.util.PriorityQueue;

public class Cola {

    record Reserva(String socio, int prioridad) implements Comparable<Reserva> {
        @Override
        public int compareTo(Reserva otra) {
            return Integer.compare(prioridad, otra.prioridad);   // menor número = más urgente
        }
    }

    public static void main(String[] args) {
        // 1. Cola (FIFO): el primero en llegar es el primero en salir
        Deque<String> espera = new ArrayDeque<>();
        espera.offer("Ana");
        espera.offer("Luis");
        espera.offer("Marta");
        System.out.println("Cola: " + espera);
        System.out.println("Quién va primero (peek): " + espera.peek());
        System.out.println("Atiendo a (poll): " + espera.poll());
        System.out.println("Cola ahora: " + espera);

        // 2. Pila (LIFO): el último en llegar es el primero en salir
        Deque<String> devueltos = new ArrayDeque<>();
        devueltos.push("Dune");
        devueltos.push("Emma");
        devueltos.push("Hamlet");
        System.out.println("Pila: " + devueltos);
        System.out.println("Cima (peek): " + devueltos.peek());
        System.out.println("Recoloco (pop): " + devueltos.pop());
        System.out.println("Pila ahora: " + devueltos);

        // 3. Cola de prioridad: sale primero el "menor" según compareTo
        PriorityQueue<Reserva> reservas = new PriorityQueue<>();
        reservas.add(new Reserva("Pablo", 3));
        reservas.add(new Reserva("Lucía", 1));
        reservas.add(new Reserva("Irene", 2));
        reservas.add(new Reserva("Mario", 5));
        System.out.println("Imprimirla no la ordena: " + reservas);
        System.out.println("Orden de atención:");
        while (!reservas.isEmpty()) {
            System.out.println("  " + reservas.poll());
        }

        // 4. Colas y pilas vacías
        Deque<String> vacia = new ArrayDeque<>();
        System.out.println("poll() en una cola vacía: " + vacia.poll());
        try {
            vacia.pop();
        } catch (NoSuchElementException e) {
            System.out.println("pop() en una pila vacía: " + e.getClass().getSimpleName());
        }
    }
}
