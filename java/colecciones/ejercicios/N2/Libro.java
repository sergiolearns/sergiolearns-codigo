// Del artículo «Colecciones en Java — ejercicios con autores, catálogos y una fusión de bibliotecas (y la "b" que estaba en el mapa pero no aparecía)» — https://sergiolearns.com/colecciones-en-java-ejercicios/

public record Libro(String isbn, String titulo, String autor) {
    @Override
    public String toString() {
        return titulo + " (" + autor + ")";
    }
}
