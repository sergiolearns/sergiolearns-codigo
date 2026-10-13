// Del artículo «Herencia en Java — ejercicios con animales, figuras y la plantilla de un restaurante (y el cast que convirtió a mi gato en perro)» — https://sergiolearns.com/herencia-en-java-ejercicios/

public abstract class Animal {

    private final String nombre;
    private final int edad;

    public Animal(String nombre, int edad) {
        this.nombre = nombre;
        this.edad = Math.max(0, edad);                // nada de edades negativas
    }

    public String getNombre() { return nombre; }
    public int getEdad()      { return edad; }

    // Todo animal hace un sonido, pero cada uno el suyo
    public abstract String sonido();

    public String presentarse() {
        return nombre + " (" + edad + " años) dice " + sonido();
    }
}
