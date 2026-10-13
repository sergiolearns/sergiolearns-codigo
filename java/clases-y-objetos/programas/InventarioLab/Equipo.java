// Del artículo «Clases y objetos en Java — práctica con un banco, una biblioteca y el inventario de un laboratorio (y la cuenta que era de nadie)» — https://sergiolearns.com/clases-y-objetos-en-java-practica/

public class Equipo {
    public static final String PREFIJO = "LAB";
    private static int contador = 0;

    private final String codigo;
    private final String tipo;
    private boolean averiado;

    public Equipo(String tipo) {
        contador++;
        this.codigo = PREFIJO + "-" + String.format("%03d", contador);
        this.tipo = tipo;
    }

    public static int getContador() { return contador; }

    public String getCodigo()     { return codigo; }
    public String getTipo()       { return tipo; }
    public boolean isAveriado()   { return averiado; }
    public void marcarAveriado()  { averiado = true; }
    public void reparar()         { averiado = false; }

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
