# Solución Ejercicio 2:
# Del artículo «Excepciones en Python — ejercicios para escribir código que no se rompe»
# https://sergiolearns.com/excepciones-en-python-ejercicios/

# Jerarquía de excepciones
class ErrorContrasena(Exception):
    pass

class ErrorLongitud(ErrorContrasena):
    pass

class ErrorMayuscula(ErrorContrasena):
    pass

class ErrorDigito(ErrorContrasena):
    pass

class ErrorEspecial(ErrorContrasena):
    pass

class ErrorEspacio(ErrorContrasena):
    pass

CARACTERES_ESPECIALES = '!@#$%^&*'

def validar_contrasena(contrasena):
    if len(contrasena) < 8:
        raise ErrorLongitud(
            f'mínimo 8 caracteres (tiene {len(contrasena)})')
    if not any(c.isupper() for c in contrasena):
        raise ErrorMayuscula('debe contener al menos una mayúscula')
    if not any(c.isdigit() for c in contrasena):
        raise ErrorDigito('debe contener al menos un número')
    if not any(c in CARACTERES_ESPECIALES for c in contrasena):
        raise ErrorEspecial(
            f'debe contener al menos un carácter especial ({CARACTERES_ESPECIALES})')
    if ' ' in contrasena:
        raise ErrorEspacio('no puede contener espacios')

print('=== VALIDADOR DE CONTRASEÑA ===\n')

while True:
    contrasena = input('Contraseña: ')

    try:
        validar_contrasena(contrasena)
        print('✓ Contraseña válida')
        break
    except ErrorLongitud as err:
        print(f'Error de longitud: {err}')
    except ErrorMayuscula as err:
        print(f'Error de mayúscula: {err}')
    except ErrorDigito as err:
        print(f'Error de dígito: {err}')
    except ErrorEspecial as err:
        print(f'Error especial: {err}')
    except ErrorEspacio as err:
        print(f'Error de espacio: {err}')
    print()
