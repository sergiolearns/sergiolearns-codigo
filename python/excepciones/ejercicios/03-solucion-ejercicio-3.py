# Solución del ejercicio 3 · Agenda con lectura y escritura de ficheros
# Del artículo «Excepciones en Python — ejercicios con un conversor, contraseñas con su familia de errores y una agenda que siempre se guarda (y el finally que cerró un fichero que no existía)»
# https://sergiolearns.com/excepciones-en-python-ejercicios/

# Lo que teclearía la persona (en tu ordenador, cambia leer() por input()):
TECLEO = iter(['1', '2', 'Ana', '123abc', '6121', '612111222', '3', 'Juan', '9', '0'])


def leer(mensaje):
    texto = next(TECLEO)     # el siguiente dato «tecleado»
    print(mensaje + texto)   # lo enseñamos como se vería en la terminal
    return texto


class ErrorTelefono(Exception):
    pass


def cargar_agenda(nombre_fichero):
    agenda = {}
    try:
        with open(nombre_fichero, encoding='utf-8') as fichero:   # with cierra solo
            for num, linea in enumerate(fichero, start=1):
                linea = linea.strip()
                if not linea:
                    continue
                try:                     # una línea mala no tumba la carga
                    partes = linea.split(',')
                    if len(partes) != 2:
                        raise ValueError('formato incorrecto (falta la coma)')
                    nombre, tel = partes[0].strip(), partes[1].strip()
                    if not nombre or not tel:
                        raise ValueError('nombre o teléfono vacío')
                    agenda[nombre] = tel
                except ValueError as err:
                    print(f'  Línea {num} ignorada: {err}')
    except FileNotFoundError:
        pass                             # primera vez: agenda vacía, no es un error
    return agenda


def guardar_agenda(agenda, nombre_fichero):
    try:
        with open(nombre_fichero, 'w', encoding='utf-8') as fichero:
            for nombre, tel in agenda.items():
                fichero.write(f'{nombre},{tel}\n')
        print(f'Agenda guardada: {len(agenda)} contactos')
    except PermissionError:
        print('Error: sin permiso para guardar la agenda')


def validar_telefono(tel):
    if not tel.isdigit():
        raise ErrorTelefono('el teléfono solo puede contener dígitos')
    if len(tel) != 9:
        raise ErrorTelefono(f'el teléfono tiene que tener 9 dígitos (tiene {len(tel)})')


FICHERO = 'agenda.txt'
print('=== AGENDA DE CONTACTOS ===')
agenda = cargar_agenda(FICHERO)
print(f'Agenda cargada: {len(agenda)} contactos')
try:
    while True:
        print('1. Ver todos | 2. Añadir | 3. Buscar | 0. Guardar y salir')
        try:
            opcion = int(leer('Opción: '))
        except ValueError:
            print('  Error: introduce un número')
            continue
        if opcion == 0:
            break
        elif opcion == 1:
            for nombre, tel in agenda.items():
                print(f'  {nombre}: {tel}')
        elif opcion == 2:
            nombre = leer('Nombre: ').strip()
            while True:                  # insiste hasta que el teléfono valga
                try:
                    tel = leer('Teléfono: ').strip()
                    validar_telefono(tel)
                    break
                except ErrorTelefono as err:
                    print('  Error:', err)
            agenda[nombre] = tel
            print(f'  Contacto añadido: {nombre}, {tel}')
        elif opcion == 3:
            buscado = leer('Nombre a buscar: ').strip()
            try:
                print(f'  {buscado}: {agenda[buscado]}')
            except KeyError:             # EAFP: intentarlo y capturar
                print(f'  {buscado!r} no está en la agenda')
        else:
            print('  Opción no válida')
except KeyboardInterrupt:                # Ctrl+C en la terminal
    print('\nInterrumpido')
finally:                                 # se guarda SIEMPRE, también tras Ctrl+C
    guardar_agenda(agenda, FICHERO)
    print('Hasta luego')
