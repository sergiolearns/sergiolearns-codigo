/*
 * Programa 1 · La cola de reservas con first y last
 * Del artículo «LinkedList en Java práctica — la cola de reservas con first y last, los préstamos ordenados y la cola al revés (como en el Examen 3)»
 * https://sergiolearns.com/linkedlist-en-java-practica/
 */
public class PruebaRapida {
    public static void main(String[] args) {
        ColaRapida cola = new ColaRapida();
        System.out.println("Atender en vacía: " + cola.atender());
        cola.encolar("Laura");
        cola.encolar("Pablo");
        cola.encolar("Marta");
        System.out.println(cola + " | primero " + cola.verPrimero() + ", último " + cola.verUltimo() + ", size " + cola.getSize());
        System.out.println("Atiendo a " + cola.atender() + ": " + cola);
        System.out.println("Atiendo a " + cola.atender() + ": " + cola);
        System.out.println("Atiendo a " + cola.atender() + ": " + cola);
        System.out.println("Vacía: primero " + cola.verPrimero() + ", último " + cola.verUltimo() + ", size " + cola.getSize());
        cola.encolar("Nora");
        System.out.println("Llega Nora: " + cola + " | primero " + cola.verPrimero() + ", último " + cola.verUltimo());
    }
}
