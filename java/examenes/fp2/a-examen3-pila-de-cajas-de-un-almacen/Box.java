/* Simulacro práctico de FP2 · versión A · Pila de cajas de un almacén (clase dada)
   Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
   https://sergiolearns.com/simulacro-examen-fp2-practica/ */
public class Box {
    public final String label;
    public final double kg;

    public Box(String label, double kg) {
        this.label = label;
        this.kg = kg;
    }

    @Override
    public String toString() {
        return "[" + label + " (" + kg + " kg)]";
    }
}
