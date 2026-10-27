/* Simulacro práctico de FP2 · versión B · Lista de tareas (solución)
   Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
   https://sergiolearns.com/simulacro-examen-fp2-practica/ */
public class TaskList extends ContainerBase {
    private int size;

    public void add(Task t) {
        Node n = new Node(t);
        if (first == null) {
            first = n;
        } else {
            last.next = n;
        }
        last = n;
        size++;
    }

    private Node nodeAt(int pos) {
        if (pos < 0 || pos >= size) {
            return null;               // posición no válida
        }
        Node n = first;
        for (int i = 0; i < pos; i++) {
            n = n.next;
        }
        return n;
    }

    public Task getTask(int pos) {
        Node n = nodeAt(pos);
        return n == null ? null : n.value;
    }

    public boolean complete(int pos) {
        Node n = nodeAt(pos);
        if (n == null || n.value.done) {
            return false;
        }
        n.value.done = true;
        return true;
    }

    public int getPendingMinutes() {
        int total = 0;
        for (Node n = first; n != null; n = n.next) {
            if (!n.value.done) {
                total += n.value.minutes;
            }
        }
        return total;
    }

    public int removeDone() {
        int removed = 0;
        Node prev = null, n = first;
        while (n != null) {
            if (n.value.done) {
                if (prev == null) {
                    first = n.next;
                } else {
                    prev.next = n.next;
                }
                if (n == last) {
                    last = prev;
                }
                removed++;
            } else {
                prev = n;              // prev solo avanza si el nodo se queda
            }
            n = n.next;
        }
        size -= removed;
        return removed;
    }

    public String[] titles() {
        String[] result = new String[size];
        int i = 0;
        for (Node n = first; n != null; n = n.next) {
            result[i++] = n.value.title;
        }
        return result;
    }

    public int getSize() {
        return size;
    }
}
