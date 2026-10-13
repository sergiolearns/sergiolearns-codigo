// Del artículo «Iteradores en Java — práctica con borrados seguros, una lista enlazada propia y una playlist de ida y vuelta (y el segundo for-each que no imprimía nada)» — https://sergiolearns.com/iteradores-en-java-practica/

import java.util.Iterator;
import java.util.NoSuchElementException;

public class ListaEnlazada<T> implements Iterable<T> {
    private class Nodo {
        T dato;
        Nodo siguiente;

        Nodo(T dato) {
            this.dato = dato;
        }
    }

    private Nodo primero;
    private Nodo ultimo;
    private int cuantos;

    public void anadir(T dato) {
        Nodo nodo = new Nodo(dato);
        if (primero == null) {
            primero = nodo;
        } else {
            ultimo.siguiente = nodo;
        }
        ultimo = nodo;
        cuantos++;
    }

    public int tamano() {
        return cuantos;
    }

    @Override
    public Iterator<T> iterator() {
        return new IteradorLista();
    }

    private class IteradorLista implements Iterator<T> {
        private Nodo actual = primero;          // cada iterador empieza en el primero

        @Override
        public boolean hasNext() {
            return actual != null;
        }

        @Override
        public T next() {
            if (actual == null) {
                throw new NoSuchElementException();
            }
            T dato = actual.dato;
            actual = actual.siguiente;
            return dato;
        }
    }
}
