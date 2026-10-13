# Chuletario — Pruebas en Python
# Del artículo «Pruebas en Python — ejercicios para dominar unittest, caja negra y TDD»
# https://sergiolearns.com/pruebas-en-python-ejercicios/

# ============================================
# CHULETARIO — Pruebas en Python
# Sergio Learns · sergiolearns.com
# ============================================

# QUÉ ES UNA PRUEBA
# Entrada conocida + resultado esperado + comparación
# Objetivo: ENCONTRAR errores, no confirmar que funciona
# Una prueba que pasa no garantiza ausencia de errores —
# solo garantiza ausencia de errores para ese caso concreto

# ── CAJA NEGRA ───────────────────────────────────────────────

# CLASES DE EQUIVALENCIA
# Dividir entradas en grupos con el mismo comportamiento
# Probar un valor representativo por grupo
# Tipos:
#   Válidas   → entrada correcta → resultado esperado
#   Inválidas → entrada incorrecta → error esperado

# VALORES LÍMITE
# Probar los extremos de cada clase, no solo el centro
# Para cada frontera: mínimo, mínimo+1, máximo-1, máximo
# Ejemplo para rango [8, 15]:
#   Probar: 7, 8, 9 (frontera inferior) y 14, 15, 16 (frontera superior)

# PROCESO CAJA NEGRA
# 1. Leer solo la especificación (no el código)
# 2. Identificar clases válidas e inválidas
# 3. Elegir un valor representativo por clase
# 4. Añadir valores límite en cada frontera
# 5. Escribir una prueba por caso

# ── CAJA BLANCA ──────────────────────────────────────────────

# GRAFO DE FLUJO
# Nodo          → bloque de instrucciones consecutivas
# Nodo predicado → condición (if, while, for) — dos salidas
# Arco          → flecha entre nodos

# COMPLEJIDAD CICLOMÁTICA
# = número de nodos predicado + 1
# = número mínimo de pruebas para cubrir todos los arcos

# PROCESO CAJA BLANCA
# 1. Identificar nodos predicado (if, while, for)
# 2. Dibujar el grafo de flujo
# 3. Calcular: complejidad = predicados + 1
# 4. Encontrar caminos que cubran todos los arcos
# 5. Diseñar un caso de prueba por camino

# ── TDD ──────────────────────────────────────────────────────

# CICLO TDD
# 1. ROJO    → escribe la prueba ANTES del código (falla)
# 2. VERDE   → escribe el mínimo código para que pase
# 3. REFACTOR → mejora sin romper las pruebas
# 4. Repite

# ORDEN TDD PARA UNA CLASE
# 1. Constructor básico
# 2. Validaciones del constructor
# 3. Propiedades (getters)
# 4. Métodos simples
# 5. Métodos que dependen de otros
# 6. __str__, __repr__, __eq__

# ── UNITTEST ─────────────────────────────────────────────────

import unittest

class TestMiClase(unittest.TestCase):

    def setUp(self):
        """Se ejecuta ANTES de cada prueba."""
        self.objeto = MiClase(...)    # preparar el terreno

    def tearDown(self):
        """Se ejecuta DESPUÉS de cada prueba."""
        pass    # limpiar recursos (ficheros, conexiones...)

    def test_caso_normal(self):
        """Descripción clara de qué prueba este método."""
        resultado = self.objeto.metodo(entrada)
        self.assertEqual(resultado, esperado)

    def test_caso_limite(self):
        with self.assertRaises(ValueError):
            self.objeto.metodo(entrada_invalida)

if __name__ == "__main__":
    unittest.main(verbosity=2)    # verbosity=2 → muestra nombre de cada prueba

# MÉTODOS ASSERT ESENCIALES
self.assertEqual(a, b)           # a == b
self.assertNotEqual(a, b)        # a != b
self.assertTrue(x)               # bool(x) es True
self.assertFalse(x)              # bool(x) es False
self.assertIsNone(x)             # x is None
self.assertIsNotNone(x)          # x is not None
self.assertIn(a, b)              # a in b
self.assertNotIn(a, b)           # a not in b
self.assertRaises(Error, f, *args)   # f(*args) lanza Error
self.assertAlmostEqual(a, b)     # para flotantes (evita imprecisión)
self.assertAlmostEqual(a, b, places=2)  # hasta 2 decimales

# USO DE assertRaises — dos formas
# Forma 1 — como gestor de contexto (recomendada)
with self.assertRaises(ValueError):
    funcion(dato_invalido)

# Forma 2 — como llamada directa
self.assertRaises(ValueError, funcion, dato_invalido)

# INFORME DE RESULTADOS
# . → prueba pasada
# F → fallo (assert incorrecto)
# E → error inesperado (excepción no capturada)
# S → prueba saltada (skip)

# ERRORES TÍPICOS
# 1. Método sin prefijo test_ → no se ejecuta
def mi_prueba(self): ...         # MAL — no se ejecuta
def test_mi_prueba(self): ...    # BIEN

# 2. Comparar flotantes con assertEqual
self.assertEqual(0.1 + 0.2, 0.3)         # FALLA por imprecisión
self.assertAlmostEqual(0.1 + 0.2, 0.3)   # BIEN

# 3. Assert incorrecto para excepciones
resultado = funcion(malo)
self.assertFalse(resultado)               # MAL — puede no capturar el error
with self.assertRaises(ValueError):       # BIEN
    funcion(malo)

# 4. Valor esperado incorrecto
cuenta = CuentaBancaria("Sergio", 500)
cuenta.retirar(200)
self.assertEqual(cuenta.saldo, 200)       # MAL — 500-200=300, no 200

# 5. Prueba que hace demasiadas cosas
def test_todo(self):                      # MAL — si falla no sabes dónde
    objeto.metodo1()
    objeto.metodo2()
    objeto.metodo3()
    self.assertEqual(objeto.estado, ...)

def test_metodo1_actualiza_estado(self):  # BIEN — una cosa por prueba
    objeto.metodo1()
    self.assertEqual(objeto.estado, ...)

# 6. Solo probar el camino feliz
def test_ingreso(self):                   # MAL — falta probar errores
    self.assertTrue(ingresar(100))
# BIEN — probar también casos inválidos:
def test_ingreso_cantidad_negativa(self):
    with self.assertRaises(ValueError): ingresar(-100)
def test_ingreso_supera_limite(self):
    with self.assertRaises(ValueError): ingresar(999999)
