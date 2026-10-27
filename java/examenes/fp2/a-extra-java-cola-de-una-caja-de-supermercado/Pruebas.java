/* Simulacro práctico de FP2 · versión A · Cola de una caja de supermercado (pruebas a mano)
   Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
   https://sergiolearns.com/simulacro-examen-fp2-practica/ */
public class Pruebas {
    public static void main(String[] args) {
        CheckoutQueue q = new CheckoutQueue();
        q.arrive(new Customer("Ana", 3));
        q.arrive(new Customer("Luis", 12));
        q.arrive(new Customer("Eva", 8));
        q.arrive(new Customer("Iker", 25));
        q.arrive(new Customer("Noa", 1));
        System.out.println(q);                          // ➡[Ana(3)]->[Luis(12)]->[Eva(8)]->[Iker(25)]->[Noa(1)]⬅->null
        System.out.println(q.getPendingItems());        // 49
        System.out.println(q.getCustomer(2) + " " + q.getCustomer(7));   // Eva(8) null
        CheckoutQueue express = q.expressLane(8);
        System.out.println(express);                    // ➡[Ana(3)]->[Eva(8)]->[Noa(1)]⬅->null
        System.out.println(q);                          // ➡[Luis(12)]->[Iker(25)]⬅->null
        System.out.println(q.serve() + " " + q.getSize());   // Luis(12) 1
    }
}
