// Del artículo «Herencia en Java — ejercicios con animales, figuras y la plantilla de un restaurante (y el cast que convirtió a mi gato en perro)» — https://sergiolearns.com/herencia-en-java-ejercicios/

public class Perro extends Animal {

    private final String raza;

    public Perro(String nombre, int edad, String raza) {
        super(nombre, edad);                          // primero la parte de Animal
        this.raza = raza;
    }

    public String getRaza() { return raza; }

    @Override
    public String sonido() { return "¡Guau!"; }

    @Override
    public String presentarse() {
        return super.presentarse() + " y es un " + raza;
    }
}
