// Del artículo «Interfaces en Java — ejercicios con figuras, una biblioteca y sensores (y el cast que funcionó hasta que llegó una camiseta)» — https://sergiolearns.com/interfaces-en-java-ejercicios/

public interface Reservable extends Recurso {
    boolean reservar(String socio, String dia);
    String reservadoPor(String dia);   // null si el día está libre

    default boolean libre(String dia) {   // se apoya en reservadoPor
        return reservadoPor(dia) == null;
    }
}
