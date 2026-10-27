/* Simulacro práctico de FP2 · versión A · Cola de una caja de supermercado (clase dada)
   Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
   https://sergiolearns.com/simulacro-examen-fp2-practica/ */
public class Customer {
    public final String name;
    public final int items;

    public Customer(String name, int items) {
        this.name = name;
        this.items = items;
    }

    @Override
    public String toString() {
        return name + "(" + items + ")";
    }
}
