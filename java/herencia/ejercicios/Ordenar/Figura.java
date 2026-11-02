// Del artículo «Herencia en Java — ejercicios con un refugio de animales, figuras que se ordenan y la plantilla de un restaurante (y el cast que convirtió a mi gato en perro)» — https://sergiolearns.com/herencia-en-java-ejercicios/

public abstract class Figura {

    public abstract double area();

    public abstract String getNombre();

    // final: las hijas deciden cómo se calcula el área, pero no cómo se comparan
    public final boolean esMayorQue(Figura otra) {
        return area() > otra.area();
    }

    @Override
    public String toString() {
        return String.format("%s de área %.2f", getNombre(), area());
    }

    // Burbuja: solo usa esMayorQue, así sirve para cualquier hija
    public static void ordenar(Figura[] figuras) {
        for (int i = 0; i < figuras.length - 1; i++) {
            for (int j = 0; j < figuras.length - 1 - i; j++) {
                if (figuras[j].esMayorQue(figuras[j + 1])) {
                    Figura aux = figuras[j];           // se mueven referencias, no objetos
                    figuras[j] = figuras[j + 1];
                    figuras[j + 1] = aux;
                }
            }
        }
    }
}
