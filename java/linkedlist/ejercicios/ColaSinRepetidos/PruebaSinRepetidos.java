/*
 * Solución del ejercicio 2 · Eliminar los socios repetidos sin colecciones
 * Del artículo «LinkedList en Java ejercicios — la reserva de la posición N, los socios repetidos y la cola partida por la mitad (con soluciones y chuletario)»
 * https://sergiolearns.com/linkedlist-en-java-ejercicios/
 */
public class PruebaSinRepetidos {
    public static void main(String[] args) {
        String[][] pruebas = {
            {"Laura", "Pablo", "Laura", "Marta", "Pablo", "Iván", "Laura"},
            {"Ana", "Nora", "Iván"},
            {"Marta", "Marta", "Marta", "Marta"},
            {}
        };
        for (String[] socios : pruebas) {               // el array solo prepara la prueba
            ColaSinRepetidos cola = new ColaSinRepetidos();
            for (String s : socios) {
                cola.insertarDetras(new String(s));      // como si llegaran de un archivo
            }
            String antes = cola.toString();
            int borrados = cola.eliminarDuplicados();
            System.out.println(antes + "  =>  " + cola + " (borrados " + borrados + ", size " + cola.getSize() + ")");
        }
    }
}
