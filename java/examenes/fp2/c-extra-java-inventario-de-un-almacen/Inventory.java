/* Simulacro práctico de FP2 · versión C · Inventario de un almacén (solución)
   Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
   https://sergiolearns.com/simulacro-examen-fp2-practica/ */
public class Inventory extends ContainerBase {
    private int size;

    public void add(String name, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("cantidad no válida");
        }
        Node prev = null, n = first;
        while (n != null && n.value.name.compareTo(name) < 0) {   // avanzar mientras el nombre sea menor
            prev = n;
            n = n.next;
        }
        if (n != null && n.value.name.equals(name)) {
            n.value.quantity += quantity;          // ya estaba: se suma
            return;
        }
        Node created = new Node(new Item(name, quantity));
        created.next = n;
        if (prev == null) {
            first = created;
        } else {
            prev.next = created;
        }
        size++;
    }

    public boolean take(String name, int quantity) {
        Node prev = null, n = first;
        while (n != null && !n.value.name.equals(name)) {
            prev = n;
            n = n.next;
        }
        if (n == null || quantity <= 0 || quantity > n.value.quantity) {
            return false;
        }
        n.value.quantity -= quantity;
        if (n.value.quantity == 0) {               // se agota: el artículo desaparece
            if (prev == null) {
                first = n.next;
            } else {
                prev.next = n.next;
            }
            size--;
        }
        return true;
    }

    public int getQuantity(String name) {
        for (Node n = first; n != null; n = n.next) {
            if (n.value.name.equals(name)) {
                return n.value.quantity;
            }
        }
        return 0;
    }

    public int getSize() {
        return size;
    }

    public String[] names() {
        String[] result = new String[size];
        int i = 0;
        for (Node n = first; n != null; n = n.next) {
            result[i++] = n.value.name;
        }
        return result;
    }
}
