/* Simulacro práctico de FP2 · versión B · Clasificación de un torneo (solución)
   Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
   https://sergiolearns.com/simulacro-examen-fp2-practica/ */
public class Leaderboard extends ContainerBase {
    private int size;

    public void add(Player p) {
        Node n = new Node(p);
        // va delante del primero que tenga MENOS puntos (con empate, detrás)
        if (first == null || p.points > first.value.points) {
            n.next = first;
            first = n;
        } else {
            Node prev = first;
            while (prev.next != null && prev.next.value.points >= p.points) {
                prev = prev.next;
            }
            n.next = prev.next;
            prev.next = n;
        }
        size++;
    }

    public int getSize() {
        return size;
    }

    public int getPosition(String name) {
        int pos = 1;
        for (Node n = first; n != null; n = n.next, pos++) {
            if (n.value.name.equals(name)) {
                return pos;
            }
        }
        return -1;
    }

    // quita el nodo del jugador y devuelve el jugador (o null)
    private Player unhook(String name) {
        Node prev = null, n = first;
        while (n != null && !n.value.name.equals(name)) {
            prev = n;
            n = n.next;
        }
        if (n == null) {
            return null;
        }
        if (prev == null) {
            first = n.next;
        } else {
            prev.next = n.next;
        }
        size--;
        return n.value;
    }

    public boolean remove(String name) {
        return unhook(name) != null;
    }

    public boolean addPoints(String name, int points) {
        Player p = unhook(name);          // se saca…
        if (p == null) {
            return false;
        }
        p.points += points;
        add(p);                           // …y se vuelve a meter en su sitio nuevo
        return true;
    }

    public Player[] top(int n) {
        int k = Math.max(0, Math.min(n, size));
        Player[] result = new Player[k];
        Node node = first;
        for (int i = 0; i < k; i++) {
            result[i] = node.value;
            node = node.next;
        }
        return result;
    }
}
