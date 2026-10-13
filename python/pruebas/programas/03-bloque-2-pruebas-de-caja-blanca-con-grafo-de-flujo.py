# Pruebas en Python práctica — Bloque 2: Pruebas de caja blanca con grafo de flujo
# Del artículo «Pruebas en Python — caja negra, caja blanca y TDD con programas reales»
# https://sergiolearns.com/pruebas-en-python-practica/

def descuento_cliente(compra, puntos, es_premium):
    """
    Calcula el descuento aplicable a una compra.
    
    Parámetros:
        compra (float): importe de la compra en euros
        puntos (int): puntos acumulados del cliente
        es_premium (bool): si el cliente tiene tarjeta premium
    
    Devuelve:
        float: porcentaje de descuento (0, 5, 10 o 15)
    """
    descuento = 0                     # línea 1
    if compra >= 50:                  # línea 2 — predicado
        descuento = 5                 # línea 3
        if puntos >= 100:             # línea 4 — predicado
            descuento = 10            # línea 5
    if es_premium:                    # línea 6 — predicado
        descuento += 5                # línea 7
    return descuento                  # línea 8
