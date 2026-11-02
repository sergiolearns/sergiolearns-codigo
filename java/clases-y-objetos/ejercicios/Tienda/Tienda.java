/*
 * Solución del nivel 3: una Tienda con varios productos
 * Del artículo «Clases y objetos en Java — ejercicios con la cafetería de la facultad, fracciones y dos tiendas (y el static que vació todo el almacén)»
 * https://sergiolearns.com/clases-y-objetos-en-java-ejercicios/
 */
public class Tienda {
    private static int ventasTotales = 0;    // de TODAS las tiendas: el único static

    private final String nombre;
    private final Producto[] productos;
    private int numProductos = 0;

    public Tienda(String nombre, int capacidad) {
        this.nombre = nombre;
        this.productos = new Producto[capacidad];
    }

    public String getNombre() { return nombre; }

    public Producto buscar(String nombre) {
        for (int i = 0; i < numProductos; i++) {
            if (productos[i].getNombre().equalsIgnoreCase(nombre)) {    // "café" y "Café" son el mismo
                return productos[i];
            }
        }
        return null;
    }

    public boolean agregar(Producto p) {
        if (numProductos == productos.length || buscar(p.getNombre()) != null) {
            return false;
        }
        productos[numProductos++] = p;
        return true;
    }

    public boolean vender(String nombre, int unidades) {
        Producto p = buscar(nombre);
        if (p == null || !p.vender(unidades)) {    // la regla del stock vive en Producto
            return false;
        }
        ventasTotales += unidades;                 // solo si la venta se hizo de verdad
        return true;
    }

    public double valorInventario() {
        double total = 0;
        for (int i = 0; i < numProductos; i++) {   // hasta numProductos: los huecos libres son null
            total += productos[i].getPrecio() * productos[i].getStock();
        }
        return total;
    }

    public int agotados() {
        int n = 0;
        for (int i = 0; i < numProductos; i++) {
            if (productos[i].estaAgotado()) {
                n++;
            }
        }
        return n;
    }

    public static int getVentasTotales() {
        return ventasTotales;
    }
}
