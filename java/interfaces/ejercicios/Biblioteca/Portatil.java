// Del artículo «Interfaces en Java — ejercicios con figuras, una biblioteca y sensores (y el cast que funcionó hasta que llegó una camiseta)» — https://sergiolearns.com/interfaces-en-java-ejercicios/

public class Portatil implements Prestable, Reservable {   // dos capacidades en una sola clase
    private static final String[] DIAS = { "Lunes", "Martes", "Miércoles", "Jueves", "Viernes" };
    private final String nombre;
    private String prestadoA;
    private final String[] reservas = new String[DIAS.length];

    public Portatil(String nombre) { this.nombre = nombre; }

    @Override public String nombre() { return nombre; }
    @Override public boolean disponible() { return prestadoA == null; }

    @Override
    public boolean prestar(String socio) {
        if (!disponible()) return false;
        prestadoA = socio;
        return true;
    }

    @Override public void devolver() { prestadoA = null; }

    private int indice(String dia) {
        for (int i = 0; i < DIAS.length; i++) {
            if (DIAS[i].equals(dia)) return i;
        }
        return -1;
    }

    @Override
    public boolean reservar(String socio, String dia) {
        int i = indice(dia);
        if (i == -1 || reservas[i] != null) return false;
        reservas[i] = socio;
        return true;
    }

    @Override
    public String reservadoPor(String dia) {
        int i = indice(dia);
        return i == -1 ? null : reservas[i];
    }
}
