/* Simulacro práctico de FP2 · versión B · Lista de tareas (pruebas a mano)
   Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
   https://sergiolearns.com/simulacro-examen-fp2-practica/ */
public class Pruebas {
    public static void main(String[] args) {
        TaskList l = new TaskList();
        l.add(new Task("Estudiar", 30));
        l.add(new Task("Correr", 45));
        l.add(new Task("Leer", 20));
        l.add(new Task("Cocinar", 50));
        l.complete(1);
        l.complete(3);
        System.out.println(l);                           // ➡[Estudiar 30min]->[Correr 45min ✔]->[Leer 20min]->[Cocinar 50min ✔]⬅->null
        System.out.println(l.complete(1) + " " + l.complete(9));   // false false
        System.out.println(l.getPendingMinutes());       // 50
        System.out.println(l.removeDone() + " " + l.getSize());    // 2 2
        System.out.println(java.util.Arrays.toString(l.titles()));   // [Estudiar, Leer]
        System.out.println(l.getTask(1) + " " + l.getTask(2));       // Leer 20min null
    }
}
