/*
 * Solución del ejercicio 1 · Obtener la reserva de una posición y buscar a un socio
 * Del artículo «LinkedList en Java ejercicios — la reserva de la posición N, los socios repetidos y la cola partida por la mitad (con soluciones y chuletario)»
 * https://sergiolearns.com/linkedlist-en-java-ejercicios/
 */
public class PruebaBuscable {
    public static void main(String[] args) {
        ColaBuscable cola = new ColaBuscable();
        System.out.println("Vacía: obtener(0) = " + cola.obtener(0) + ", indiceDe(\"Laura\") = " + cola.indiceDe("Laura"));
        cola.insertarDetras("Laura");
        cola.insertarDetras("Pablo");
        cola.insertarDetras("Marta");
        cola.insertarDetras("Pablo");
        System.out.println(cola);
        System.out.println("obtener(0) = " + cola.obtener(0) + ", obtener(2) = " + cola.obtener(2) + ", obtener(3) = " + cola.obtener(3));
        System.out.println("obtener(4) = " + cola.obtener(4) + ", obtener(-1) = " + cola.obtener(-1));
        System.out.println("indiceDe(\"Pablo\") = " + cola.indiceDe("Pablo") + ", indiceDe(\"Nora\") = " + cola.indiceDe("Nora"));
        System.out.println("indiceDe(new String(\"Marta\")) = " + cola.indiceDe(new String("Marta")));
    }
}
