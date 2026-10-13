// Del artículo «Iteradores en Java — práctica con borrados seguros, una lista enlazada propia y una playlist de ida y vuelta (y el segundo for-each que no imprimía nada)» — https://sergiolearns.com/iteradores-en-java-practica/

public record Cancion(String titulo, int segundos) {
    @Override
    public String toString() {
        return titulo + " (" + segundos / 60 + ":" + String.format("%02d", segundos % 60) + ")";
    }
}
