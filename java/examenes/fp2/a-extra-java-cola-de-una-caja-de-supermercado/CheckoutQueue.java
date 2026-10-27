/* Simulacro práctico de FP2 · versión A · Cola de una caja de supermercado (solución)
   Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
   https://sergiolearns.com/simulacro-examen-fp2-practica/ */
public class CheckoutQueue extends ContainerBase {
    private int size;

    public void arrive(Customer c) {
        Node n = new Node(c);
        if (first == null) {
            first = n;
        } else {
            last.next = n;
        }
        last = n;
        size++;
    }

    public Customer serve() {
        if (first == null) {
            return null;
        }
        Customer c = first.value;
        first = first.next;
        if (first == null) {
            last = null;               // la cola se ha vaciado
        }
        size--;
        return c;
    }

    public Customer getCustomer(int pos) {
        if (pos < 0 || pos >= size) {
            return null;
        }
        Node n = first;
        for (int i = 0; i < pos; i++) {
            n = n.next;
        }
        return n.value;
    }

    public int getPendingItems() {
        int total = 0;
        for (Node n = first; n != null; n = n.next) {
            total += n.value.items;
        }
        return total;
    }

    public int getSize() {
        return size;
    }

    public CheckoutQueue expressLane(int maxItems) {
        CheckoutQueue express = new CheckoutQueue();
        Node prev = null, n = first;
        while (n != null) {
            Node next = n.next;
            if (n.value.items <= maxItems) {
                if (prev == null) {
                    first = next;      // se va el primero
                } else {
                    prev.next = next;
                }
                if (n == last) {
                    last = prev;       // se va el último
                }
                size--;
                express.arrive(n.value);
            } else {
                prev = n;
            }
            n = next;
        }
        return express;
    }
}
