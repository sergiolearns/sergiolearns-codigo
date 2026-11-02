/*
 * Solución del nivel 1: la clase Producto
 * Del artículo «Clases y objetos en Java — ejercicios con la cafetería de la facultad, fracciones y dos tiendas (y el static que vació todo el almacén)»
 * https://sergiolearns.com/clases-y-objetos-en-java-ejercicios/
 */
public class Producto {
    private final String nombre;    // un producto no cambia de nombre
    private double precio;
    private int stock;              // SIN static: cada producto tiene el suyo

    public Producto(String nombre, double precio, int stock) {
        this.nombre = nombre;
        this.precio = precio >= 0 ? precio : 0;    // un constructor no puede devolver false: corrige
        this.stock = Math.max(0, stock);
    }

    public String getNombre() { return nombre; }
    public double getPrecio() { return precio; }
    public int getStock()     { return stock; }

    public boolean setPrecio(double precio) {
        if (precio < 0) {
            return false;
        }
        this.precio = precio;
        return true;
    }

    public boolean vender(int unidades) {
        if (unidades <= 0 || unidades > stock) {    // vender -3 subiría el stock: también se rechaza
            return false;
        }
        stock -= unidades;
        return true;
    }

    public void reponer(int unidades) {
        if (unidades > 0) {
            stock += unidades;
        }
    }

    public boolean estaAgotado() {
        return stock == 0;
    }

    @Override
    public String toString() {
        return String.format("%s: %.2f € (%d uds.)", nombre, precio, stock);
    }
}
