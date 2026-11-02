/*
 * Solución del ejercicio 3 · Partir la cola por la mitad en un solo recorrido
 * Del artículo «LinkedList en Java ejercicios — la reserva de la posición N, los socios repetidos y la cola partida por la mitad (con soluciones y chuletario)»
 * https://sergiolearns.com/linkedlist-en-java-ejercicios/
 */
public class PruebaPartir {
    public static void main(String[] args) {
        String[][] pruebas = {
            {"Laura", "Pablo", "Marta", "Iván", "Nora"},
            {"Laura", "Pablo", "Marta", "Iván"},
            {"Ana"},
            {}
        };
        for (String[] socios : pruebas) {
            ColaPartible cola = new ColaPartible();
            for (String s : socios) {
                cola.insertarDetras(s);
            }
            String antes = cola.toString();
            ColaPartible segunda = cola.partirPorLaMitad();
            System.out.println(antes + "  =>  " + cola + " (" + cola.getSize() + ") + " + segunda + " (" + segunda.getSize() + ")");
        }
    }
}
