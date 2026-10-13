/*
 * Solución Ejercicio 2
 * Del artículo «Control de flujo en Java — ejercicios con validaciones, menús y bucles»
 * https://sergiolearns.com/control-de-flujo-en-java-ejercicios/
 */

import java.util.Scanner;

public class Biblioteca {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // Arrays paralelos: la posición i de uno corresponde a la posición i del otro
        String[] titulos = new String[5];
        boolean[] prestado = new boolean[5];
        int contador = 0;    // cuántos libros hay realmente guardados

        int opcion;
        do {
            System.out.println("\n=== BIBLIOTECA ===");
            System.out.println("1. Añadir libro");
            System.out.println("2. Prestar libro");
            System.out.println("3. Devolver libro");
            System.out.println("4. Ver todos");
            System.out.println("5. Salir");
            System.out.print("Opción: ");
            opcion = sc.nextInt();
            sc.nextLine();    // limpiador — ya sabes por qué

            switch (opcion) {
                case 1:
                    if (contador < titulos.length) {
                        System.out.print("Título: ");
                        titulos[contador] = sc.nextLine();
                        prestado[contador] = false;    // nuevo libro, disponible por defecto
                        contador++;
                        System.out.println("✓ Libro añadido");
                    } else {
                        System.out.println("✗ La biblioteca está llena");
                    }
                    break;

                case 2: {
                    System.out.print("Título a prestar: ");
                    String buscado = sc.nextLine();
                    int indice = -1;    // -1 significa "todavía no encontrado"
                    for (int i = 0; i < contador; i++) {
                        if (titulos[i].equalsIgnoreCase(buscado)) {
                            indice = i;
                            break;    // encontrado — no hace falta seguir buscando
                        }
                    }
                    if (indice == -1) {
                        System.out.println("✗ Ese libro no existe");
                    } else if (prestado[indice]) {
                        System.out.println("✗ Ya está prestado");
                    } else {
                        prestado[indice] = true;
                        System.out.println("✓ Prestado");
                    }
                    break;
                }

                case 3: {
                    System.out.print("Título a devolver: ");
                    String buscado = sc.nextLine();
                    int indice = -1;
                    for (int i = 0; i < contador; i++) {
                        if (titulos[i].equalsIgnoreCase(buscado)) {
                            indice = i;
                            break;
                        }
                    }
                    if (indice == -1) {
                        System.out.println("✗ Ese libro no existe");
                    } else if (!prestado[indice]) {
                        System.out.println("✗ Ese libro no estaba prestado");
                    } else {
                        prestado[indice] = false;
                        System.out.println("✓ Devuelto");
                    }
                    break;
                }

                case 4:
                    if (contador == 0) {
                        System.out.println("La biblioteca está vacía");
                    } else {
                        System.out.println("--- Estado de la biblioteca ---");
                        for (int i = 0; i < contador; i++) {
                            String estado = prestado[i] ? "Prestado" : "Disponible";
                            System.out.printf("%d. %s — %s%n", i + 1, titulos[i], estado);
                        }
                    }
                    break;

                case 5:
                    System.out.println("Hasta luego");
                    break;

                default:
                    System.out.println("✗ Opción no válida");
            }
        } while (opcion != 5);

        sc.close();
    }
}
