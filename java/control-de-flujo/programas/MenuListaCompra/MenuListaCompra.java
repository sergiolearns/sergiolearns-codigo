/*
 * Control de flujo en Java práctica — Programa 2: Menú interactivo con switch
 * Del artículo «Control de flujo en Java — práctica con validador, menú y adivina el número»
 * https://sergiolearns.com/control-de-flujo-en-java-practica/
 */

import java.util.Scanner;

public class MenuListaCompra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // Array de tamaño fijo para simplificar — 10 huecos como máximo
        String[] lista = new String[10];
        int contador = 0;    // cuántos productos hay realmente guardados

        int opcion;
        do {
            System.out.println("\n=== LISTA DE LA COMPRA ===");
            System.out.println("1. Añadir producto");
            System.out.println("2. Ver lista completa");
            System.out.println("3. Buscar producto");
            System.out.println("4. Vaciar lista");
            System.out.println("5. Salir");
            System.out.print("Elige una opción: ");
            opcion = sc.nextInt();
            sc.nextLine();    // limpiador — lo necesitamos antes del próximo nextLine()

            switch (opcion) {
                case 1:
                    if (contador < lista.length) {
                        System.out.print("Producto a añadir: ");
                        lista[contador] = sc.nextLine();
                        contador++;
                        System.out.println("✓ Producto añadido");
                    } else {
                        System.out.println("✗ La lista está llena");
                    }
                    break;

                case 2:
                    if (contador == 0) {
                        System.out.println("La lista está vacía");
                    } else {
                        System.out.println("--- Productos ---");
                        for (int i = 0; i < contador; i++) {
                            System.out.println((i + 1) + ". " + lista[i]);
                        }
                    }
                    break;

                case 3:
                    System.out.print("¿Qué producto buscas? ");
                    String busqueda = sc.nextLine();
                    boolean encontrado = false;
                    for (int i = 0; i < contador; i++) {
                        // equalsIgnoreCase compara sin distinguir mayúsculas
                        if (lista[i].equalsIgnoreCase(busqueda)) {
                            encontrado = true;
                            break;
                        }
                    }
                    System.out.println(encontrado ? "✓ Sí está en la lista" : "✗ No está en la lista");
                    break;

                case 4:
                    contador = 0;    // no hace falta borrar cada posición, basta con "olvidar" cuántas hay
                    System.out.println("✓ Lista vaciada");
                    break;

                case 5:
                    System.out.println("Hasta luego");
                    break;

                default:
                    System.out.println("✗ Opción no válida, elige entre 1 y 5");
            }
        } while (opcion != 5);

        sc.close();
    }
}
