/*
 * Programa 3: inventario de un laboratorio
 * Del artículo «Clases y objetos en Java — práctica con la cuenta de Laura, la biblioteca de la facultad y el inventario del laboratorio (y la cuenta que era de nadie)»
 * https://sergiolearns.com/clases-y-objetos-en-java-practica/
 */
public class Equipo {
    public static final String PREFIJO = "LAB";    // constante de clase: pública, nadie la cambia
    private static int contador = 0;               // de la clase, pero privado

    private final String codigo;
    private final String tipo;
    private boolean averiado;

    public Equipo(String tipo) {
        contador++;                                // cada equipo nuevo suma uno al contador COMPARTIDO
        this.codigo = PREFIJO + "-" + String.format("%03d", contador);
        this.tipo = tipo;
    }

    public static int getContador() { return contador; }

    public String getCodigo()    { return codigo; }
    public String getTipo()      { return tipo; }
    public boolean isAveriado()  { return averiado; }
    public void marcarAveriado() { averiado = true; }
    public void reparar()        { averiado = false; }

    // Dos equipos son el mismo si tienen el mismo código (no el mismo tipo)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Equipo)) return false;
        return codigo.equals(((Equipo) o).codigo);
    }

    @Override
    public int hashCode() { return codigo.hashCode(); }

    @Override
    public String toString() {
        return codigo + " " + tipo + (averiado ? " (averiado)" : "");
    }
}
