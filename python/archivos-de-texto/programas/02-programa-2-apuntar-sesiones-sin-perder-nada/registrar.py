# Programa 2 · Apuntar sesiones sin perder nada
# Del artículo «Archivos de texto en Python — práctica con el resumen del diario, sesiones que se apuntan sin borrar nada y un informe del mes (y la sesión que se pegó a la del día anterior)»
# https://sergiolearns.com/archivos-de-texto-en-python-practica/

# Programa 2 · Apuntar sesiones sin perder nada
DEPORTES = {'bici', 'carrera', 'fútbol', 'natación', 'yoga'}


def termina_en_salto(nombre):
    """True si el archivo está vacío o acaba en '\n' (se puede añadir sin pegar líneas)."""
    with open(nombre, 'r', encoding='utf-8') as f:
        texto = f.read()                  # el diario es pequeño: leerlo entero no cuesta nada
    return texto == '' or texto.endswith('\n')


def registrar(nombre, fecha, deporte, minutos):
    """Añade una sesión al final del diario. Devuelve True si la ha escrito."""
    if deporte not in DEPORTES or minutos <= 0:     # mejor no escribir que escribir basura
        print('  No apunto', fecha, deporte, minutos, '(datos raros)')
        return False
    salto = '' if termina_en_salto(nombre) else '\n'   # cierra antes la última línea si le falta su '\n'
    with open(nombre, 'a', encoding='utf-8') as f:      # 'a' y nunca 'w', que vaciaría el diario
        f.write(f'{salto}{fecha};{deporte};{minutos}\n')
    return True


def mostrar_numerado(nombre):
    with open(nombre, 'r', encoding='utf-8') as f:
        for numero, linea in enumerate(f, start=1):
            texto = linea.rstrip('\n')               # quito solo el salto, no los espacios
            print(f'{numero:>3} | {texto}')


print('Antes:')
mostrar_numerado('diario.txt')
apuntadas = 0
for sesion in [('2026-10-15', 'carrera', 40), ('2026-10-16', 'pesas', 30),
               ('2026-10-17', 'natación', 0), ('2026-10-18', 'yoga', 25)]:
    if registrar('diario.txt', *sesion):      # *sesion reparte la tupla en fecha, deporte y minutos
        apuntadas += 1
print('Apuntadas:', apuntadas)
print('Después:')
mostrar_numerado('diario.txt')
