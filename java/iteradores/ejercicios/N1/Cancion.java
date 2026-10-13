// Del artículo «Iteradores en Java — ejercicios con playlists, títulos repetidos y un rango con paso (y el "Faro" que nunca se iba)» — https://sergiolearns.com/iteradores-en-java-ejercicios/

public record Cancion(String titulo, int segundos) {
    @Override
    public String toString() {
        return titulo + " (" + segundos / 60 + ":" + String.format("%02d", segundos % 60) + ")";
    }
}
