// Del artículo «Herencia en Java — ejercicios con un refugio de animales, figuras que se ordenan y la plantilla de un restaurante (y el cast que convirtió a mi gato en perro)» — https://sergiolearns.com/herencia-en-java-ejercicios/

public class Plantilla {

    private final Trabajador[] trabajadores;
    private int numTrabajadores = 0;

    public Plantilla(int capacidad) {
        trabajadores = new Trabajador[capacidad];
    }

    public boolean contratar(Trabajador t) {
        if (t == null || numTrabajadores == trabajadores.length) return false;   // llena
        for (int i = 0; i < numTrabajadores; i++) {
            if (trabajadores[i].getNombre().equalsIgnoreCase(t.getNombre())) return false;
        }
        trabajadores[numTrabajadores++] = t;
        return true;
    }

    public double costeTotal() {
        double total = 0;
        for (int i = 0; i < numTrabajadores; i++) {
            total += trabajadores[i].costeSemanal();   // cada uno con su fórmula
        }
        return total;
    }

    public Trabajador masCaro() {
        if (numTrabajadores == 0) return null;
        Trabajador max = trabajadores[0];
        for (int i = 1; i < numTrabajadores; i++) {
            if (trabajadores[i].costeSemanal() > max.costeSemanal()) max = trabajadores[i];
        }
        return max;
    }

    // Solo los que están en sala (Camarero y sus hijas) tienen propinas
    public double propinasSala() {
        double total = 0;
        for (int i = 0; i < numTrabajadores; i++) {
            if (trabajadores[i] instanceof Camarero c) total += c.getPropinas();
        }
        return total;
    }

    public void listar() {
        for (int i = 0; i < numTrabajadores; i++) {
            System.out.println(trabajadores[i]);       // toString de Trabajador
        }
    }
}
