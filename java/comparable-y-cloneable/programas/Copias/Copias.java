/*
 * El código
 * Del artículo «Comparable y Cloneable en Java — práctica con un ranking, copias de seguridad y árboles ordenados (y la palabra que desapareció del TreeSet)»
 * https://sergiolearns.com/comparable-y-cloneable-en-java-practica/
 */

public class Copias {
    public static void main(String[] args) {
        Alumno ana = new Alumno("Ana", "Telde");
        ana.anotar(8.0);

        // 1. Copia superficial: comparte la lista y la dirección
        Alumno sup = ana.cloneSuperficial();
        sup.anotar(5.0);
        sup.getDireccion().setCiudad("Arucas");
        System.out.println("Original:    " + ana);
        System.out.println("Superficial: " + sup);

        // 2. Las dos copias profundas
        Alumno porClone = ana.clone();
        Alumno porConstructor = new Alumno(ana);
        porClone.anotar(10.0);
        porConstructor.getDireccion().setCiudad("Gáldar");
        System.out.println("\nOriginal:     " + ana);
        System.out.println("Con clone:    " + porClone);
        System.out.println("Con ctor:     " + porConstructor);

        // 3. ¿Qué tipo tiene la copia cuando hay herencia?
        Alumno becado = new AlumnoBecado("Luis", "Agüimes", 1500);
        Alumno copiaClone = becado.clone();
        Alumno copiaCtor = new Alumno(becado);
        System.out.println("\nclone():     " + copiaClone);
        System.out.println("constructor: " + copiaCtor);
    }
}
