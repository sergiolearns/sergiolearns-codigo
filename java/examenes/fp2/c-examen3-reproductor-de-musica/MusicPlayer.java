/* Simulacro práctico de FP2 · versión C · Reproductor de música (solución)
   Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
   https://sergiolearns.com/simulacro-examen-fp2-practica/ */
public class MusicPlayer extends ContainerBase {
    private int size;

    public void add(Song s) {
        Node n = new Node(s);
        if (first == null) {
            first = n;
        } else {
            last.next = n;     // el último apunta al nuevo…
            n.prev = last;     // …y el nuevo, al último (los dos enlaces)
        }
        last = n;
        if (current == null) {
            current = n;
        }
        size++;
    }

    public boolean next() {
        if (current == null || current.next == null) {
            return false;
        }
        current = current.next;
        return true;
    }

    public boolean previous() {
        if (current == null || current.prev == null) {
            return false;
        }
        current = current.prev;
        return true;
    }

    public Song getCurrent() {
        return current == null ? null : current.value;
    }

    public Song removeCurrent() {
        if (current == null) {
            return null;
        }
        Node n = current;
        if (n.prev == null) {
            first = n.next;            // era el primero
        } else {
            n.prev.next = n.next;
        }
        if (n.next == null) {
            last = n.prev;             // era el último
        } else {
            n.next.prev = n.prev;
        }
        current = n.next != null ? n.next : n.prev;   // la siguiente o, si no hay, la anterior
        size--;
        return n.value;
    }

    public int getTotalSeconds() {
        int total = 0;
        for (Node n = first; n != null; n = n.next) {
            total += n.value.seconds;
        }
        return total;
    }

    public int getSize() {
        return size;
    }
}
