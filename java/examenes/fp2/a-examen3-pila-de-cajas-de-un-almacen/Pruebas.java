/* Simulacro práctico de FP2 · versión A · Pila de cajas de un almacén (pruebas a mano)
   Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
   https://sergiolearns.com/simulacro-examen-fp2-practica/ */
public class Pruebas {
    public static void main(String[] args) {
        BoxStack s = new BoxStack();
        System.out.println(s);                     // ➡null
        s.push(new Box("libros", 12.5));
        s.push(new Box("vasos", 3.0));
        s.push(new Box("ropa", 7.25));
        s.push(new Box("platos", 9.0));
        System.out.println(s);                     // ➡[platos (9.0 kg)]->[ropa (7.25 kg)]->[vasos (3.0 kg)]->[libros (12.5 kg)]->null
        System.out.println(s.getSize() + " " + s.getTotalKg());   // 4 31.75
        System.out.println(s.heaviest());          // [libros (12.5 kg)]
        System.out.println(s.popUntil("ropa"));       // 2
        System.out.println(s.peek());              // [vasos (3.0 kg)]
        System.out.println(s.popUntil("sillas"));      // 0
        s.pop();
        s.pop();
        System.out.println(s.pop());               // null
    }
}
