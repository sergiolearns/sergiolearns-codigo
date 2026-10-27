/* Simulacro práctico de FP2 · versión B · Clasificación de un torneo (pruebas a mano)
   Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
   https://sergiolearns.com/simulacro-examen-fp2-practica/ */
public class Pruebas {
    public static void main(String[] args) {
        Leaderboard lb = new Leaderboard();
        lb.add(new Player("Ana", 20));
        lb.add(new Player("Luis", 35));
        lb.add(new Player("Eva", 20));
        lb.add(new Player("Iker", 50));
        System.out.println(lb);                         // ➡[Iker:50]->[Luis:35]->[Ana:20]->[Eva:20]->null
        System.out.println(lb.getPosition("Eva"));      // 4
        System.out.println(lb.addPoints("Ana", 30));    // true
        System.out.println(lb);                         // ➡[Iker:50]->[Ana:50]->[Luis:35]->[Eva:20]->null
        System.out.println(java.util.Arrays.toString(lb.top(2)));   // [Iker:50, Ana:50]
        System.out.println(lb.remove("Iker") + " " + lb.getSize());   // true 3
        System.out.println(lb.getPosition("Iker"));     // -1
    }
}
