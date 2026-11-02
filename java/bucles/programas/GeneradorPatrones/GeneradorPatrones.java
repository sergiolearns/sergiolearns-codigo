/*
 * Programa 3: generador de patrones con validación
 * Del artículo «Bucles en Java — práctica con un analizador de texto, el adivino que por fin repite y un generador de patrones (y la vuelta de más que me tumbó el programa)»
 * https://sergiolearns.com/bucles-en-java-practica/
 */
import java.util.Scanner;

/**
 * Generador de patrones: un menú con do-while (se enseña al menos una vez) y bucles anidados:
 * el de fuera recorre las filas y el de dentro, las columnas de cada fila.
 */
public class GeneradorPatrones {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int opcion;
        do {
            System.out.println();
            System.out.println("=== GENERADOR DE PATRONES ===");
            System.out.println("1. Triángulo   2. Marco   3. Tablero   0. Salir");
            System.out.print("Opción: ");
            opcion = sc.nextInt();
            if (opcion == 0) {
                break;                             // sale del do-while sin pedir tamaño
            }
            if (opcion < 1 || opcion > 3) {
                System.out.println("Opción no válida.");
                continue;                          // en un do-while, continue salta a la condición del final
            }
            System.out.print("Tamaño (1-9): ");
            int n = sc.nextInt();
            if (n < 1 || n > 9) {
                System.out.println("Tamaño no válido.");
                continue;
            }

            for (int fila = 1; fila <= n; fila++) {           // una vuelta por fila
                String linea = "";
                for (int col = 1; col <= n; col++) {          // una vuelta por columna, en cada fila
                    if (opcion == 1) {
                        linea += (col <= fila) ? "* " : "";  // la fila 1 tiene 1 asterisco, la 2 tiene 2...
                    } else if (opcion == 2) {
                        boolean borde = fila == 1 || fila == n || col == 1 || col == n;
                        linea += borde ? "# " : "  ";         // dentro del marco, espacios
                    } else {
                        linea += ((fila + col) % 2 == 0) ? "# " : ". ";   // suma par: casilla oscura
                    }
                }
                System.out.println(linea.stripTrailing());     // quita el espacio sobrante del final
            }
        } while (opcion != 0);
        System.out.println("Hasta luego.");
        sc.close();
    }
}
