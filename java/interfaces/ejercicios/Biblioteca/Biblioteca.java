/*
 * Solución del Nivel 2
 * Del artículo «Interfaces en Java — ejercicios con figuras, una biblioteca y sensores (y el cast que funcionó hasta que llegó una camiseta)»
 * https://sergiolearns.com/interfaces-en-java-ejercicios/
 */

public class Biblioteca {

    public static void main(String[] args) {
        Recurso[] recursos = {
            new Libro("Java para FP2"),
            new Sala("Sala 3"),
            new Portatil("Portátil 07")
        };

        // Ana pide prestado todo lo que se pueda prestar
        for (Recurso r : recursos) {
            if (r instanceof Prestable p) {   // solo si es prestable
                System.out.println("Ana pide " + r.nombre() + ": " + (p.prestar("Ana") ? "OK" : "no disponible"));
            }
        }
        // Luis lo intenta con el libro
        Prestable libro = (Prestable) recursos[0];
        System.out.println("Luis pide " + libro.nombre() + ": " + (libro.prestar("Luis") ? "OK" : "no disponible"));

        // Reservas
        Reservable sala = (Reservable) recursos[1];
        System.out.println("Luis reserva " + sala.nombre() + " el Lunes: " + (sala.reservar("Luis", "Lunes") ? "OK" : "ocupada"));
        System.out.println("Marta reserva " + sala.nombre() + " el Lunes: " + (sala.reservar("Marta", "Lunes") ? "OK" : "ocupada"));
        Reservable portatil = (Reservable) recursos[2];
        System.out.println("Marta reserva " + portatil.nombre() + " el Martes: " + (portatil.reservar("Marta", "Martes") ? "OK" : "ocupado"));

        // Estados
        System.out.println("--- Estado ---");
        for (Recurso r : recursos) {
            if (r instanceof Prestable p) {   // solo si es prestable
                System.out.println(p.estado());
            }
            if (r instanceof Reservable rv) {   // solo si es reservable
                System.out.println(r.nombre() + ": Lunes " + (rv.libre("Lunes") ? "libre" : "de " + rv.reservadoPor("Lunes"))
                        + ", Martes " + (rv.libre("Martes") ? "libre" : "de " + rv.reservadoPor("Martes")));
            }
        }
    }
}
