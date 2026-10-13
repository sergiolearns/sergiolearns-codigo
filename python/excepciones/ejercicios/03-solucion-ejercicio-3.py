# Solución Ejercicio 3:
# Del artículo «Excepciones en Python — ejercicios para escribir código que no se rompe»
# https://sergiolearns.com/excepciones-en-python-ejercicios/

class ErrorTelefono(Exception):
    pass

def cargar_agenda(nombre_fichero):
    agenda = {}
    fichero = None
    try:
        fichero = open(nombre_fichero, 'r', encoding='utf-8')
        for numero_linea, linea in enumerate(fichero, 1):
            linea = linea.strip()
            if not linea:
                continue
            try:
                partes = linea.split(',')
                if len(partes) != 2:
                    raise ValueError('formato incorrecto')
                nombre, telefono = partes[0].strip(), partes[1].strip()
                if not nombre or not telefono:
                    raise ValueError('nombre o teléfono vacío')
                agenda[nombre] = telefono
            except ValueError as err:
                print(f'Línea {numero_linea} ignorada: {err}')
    except FileNotFoundError:
        pass    # agenda vacía — no es un error
    finally:
        if fichero is not None:
            fichero.close()
    return agenda

def guardar_agenda(agenda, nombre_fichero):
    fichero = None
    try:
        fichero = open(nombre_fichero, 'w', encoding='utf-8')
        for nombre, telefono in agenda.items():
            fichero.write(f'{nombre},{telefono}\n')
        print(f'Agenda guardada: {len(agenda)} contactos')
    except PermissionError:
        print('Error: sin permisos para guardar el fichero')
    finally:
        if fichero is not None:
            fichero.close()

def validar_telefono(telefono):
    if not telefono.isdigit():
        raise ErrorTelefono('el teléfono solo puede contener dígitos')
    if len(telefono) < 9:
        raise ErrorTelefono('el teléfono debe tener al menos 9 dígitos')

FICHERO = 'agenda.txt'
print('=== AGENDA DE CONTACTOS ===')
print('Cargando agenda...')
agenda = cargar_agenda(FICHERO)
print(f'Agenda cargada: {len(agenda)} contactos\n')

try:
    while True:
        print('1. Ver todos')
        print('2. Añadir contacto')
        print('3. Buscar contacto')
        print('0. Guardar y salir\n')

        try:
            opcion = int(input('Opción: '))
        except ValueError:
            print('Error: introduce un número\n')
            continue

        if opcion == 0:
            break
        elif opcion == 1:
            if not agenda:
                print('Agenda vacía\n')
            else:
                for nombre, tel in agenda.items():
                    print(f'{nombre}: {tel}')
                print()
        elif opcion == 2:
            nombre = input('Nombre: ').strip()
            if not nombre:
                print('Error: el nombre no puede estar vacío\n')
                continue
            while True:
                try:
                    telefono = input('Teléfono: ').strip()
                    validar_telefono(telefono)
                    agenda[nombre] = telefono
                    print(f'Contacto añadido: {nombre} — {telefono}\n')
                    break
                except ErrorTelefono as err:
                    print(f'Error: {err}')
        elif opcion == 3:
            buscar = input('Nombre a buscar: ').strip()
            if buscar in agenda:
                print(f'{buscar}: {agenda[buscar]}\n')
            else:
                print(f'"{buscar}" no encontrado en la agenda\n')
        else:
            print('Opción no válida\n')

except KeyboardInterrupt:
    print('\nInterrupción detectada')

finally:
    guardar_agenda(agenda, FICHERO)
    print('Hasta luego')
