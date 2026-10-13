// Del artículo «Herencia en Java — ejercicios con animales, figuras y la plantilla de un restaurante (y el cast que convirtió a mi gato en perro)» — https://sergiolearns.com/herencia-en-java-ejercicios/

public class Gato extends Animal {

    private final boolean casero;

    public Gato(String nombre, int edad, boolean casero) {
        super(nombre, edad);
        this.casero = casero;
    }

    public boolean isCasero() { return casero; }

    @Override
    public String sonido() { return casero ? "Miau" : "¡Fffff!"; }
}
