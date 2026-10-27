/* Simulacro práctico de FP2 · versión A · Pila de cajas de un almacén (solución)
   Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
   https://sergiolearns.com/simulacro-examen-fp2-practica/ */
public class BoxStack extends ContainerBase {
    private int size;          // se lleva la cuenta para no recorrer

    public void push(Box box) {
        Node n = new Node(box);
        n.next = first;        // el nuevo apunta a la antigua cima…
        first = n;             // …y pasa a ser la cima
        size++;
    }

    public Box pop() {
        if (first == null) {
            return null;
        }
        Box b = first.value;
        first = first.next;
        size--;
        return b;
    }

    public Box peek() {
        return first == null ? null : first.value;
    }

    public int getSize() {
        return size;
    }

    public double getTotalKg() {
        double total = 0;
        for (Node n = first; n != null; n = n.next) {
            total += n.value.kg;
        }
        return total;
    }

    public Box heaviest() {
        Box best = null;
        for (Node n = first; n != null; n = n.next) {
            if (best == null || n.value.kg > best.kg) {   // > y no >=: en un empate gana la más cercana a la cima
                best = n.value;
            }
        }
        return best;
    }

    public int popUntil(String label) {
        boolean found = false;
        for (Node n = first; n != null && !found; n = n.next) {
            found = n.value.label.equals(label);          // equals, nunca == con String
        }
        if (!found) {
            return 0;          // si no está, no se saca nada
        }
        int count = 0;
        Box b;
        do {
            b = pop();
            count++;
        } while (!b.label.equals(label));
        return count;
    }
}
