"""Fragmento 18 «interfaz»: icono «barras» (el visualizador de algoritmos) en sl3_ico(). Uso: python3 build-fragmento18.py <entrada> <salida>"""
import sys
s = open(sys.argv[1], encoding='utf-8').read()
a = """		'velocimetro' => """
assert s.count(a) == 1
s = s.replace(a, """		'barras' => '<path d="M5 20v-6M10 20V9M15 20v-8M20 20V6"/><path d="M8.5 4.5h6.5l-2-2M15 4.5l-2 2"/>',
""" + a)
open(sys.argv[2], 'w', encoding='utf-8').write(s); print(sys.argv[2], len(s))
