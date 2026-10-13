# Solución del Nivel 2
# Del artículo «Módulos y paquetes en Python — ejercicios con temperaturas, divisas y una tienda (y el precio con IVA que salía con descuento)»
# https://sergiolearns.com/modulos-en-python-ejercicios/

def formatea(cantidad):
    return f"{cantidad:.2f} €"


if __name__ == "__main__":
    print(formatea(5))
    print(formatea(19.5))
