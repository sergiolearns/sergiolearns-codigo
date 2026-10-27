/* Simulacro práctico de FP2 · versión C · Inventario de un almacén (pruebas a mano)
   Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
   https://sergiolearns.com/simulacro-examen-fp2-practica/ */
public class Pruebas {
    public static void main(String[] args) {
        Inventory inv = new Inventory();
        inv.add("tornillos", 50);
        inv.add("clavos", 200);
        inv.add("tuercas", 80);
        inv.add("arandelas", 120);
        inv.add("tornillos", 25);
        System.out.println(inv);                               // ➡[arandelas×120]->[clavos×200]->[tornillos×75]->[tuercas×80]->null
        System.out.println(inv.take("clavos", 200) + " " + inv.getSize());   // true 3
        System.out.println(inv.take("tuercas", 500) + " " + inv.getQuantity("tuercas"));   // false 80
        System.out.println(java.util.Arrays.toString(inv.names()));   // [arandelas, tornillos, tuercas]
        try {
            inv.add("brocas", 0);
        } catch (IllegalArgumentException e) {
            System.out.println("Error esperado: " + e.getMessage());   // Error esperado: cantidad no válida
        }
    }
}
