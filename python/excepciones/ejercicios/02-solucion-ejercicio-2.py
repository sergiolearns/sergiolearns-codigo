# Solución del ejercicio 2 · Validador de contraseñas con excepciones propias
# Del artículo «Excepciones en Python — ejercicios con un conversor, contraseñas con su familia de errores y una agenda que siempre se guarda (y el finally que cerró un fichero que no existía)»
# https://sergiolearns.com/excepciones-en-python-ejercicios/

# Lo que teclearía la persona (en tu ordenador, cambia leer() por input()):
TECLEO = iter(['abc', 'abcdefgh', 'Abcdefgh', 'Abcdef1h', 'Abc def1!', 'Abcdef1!'])


def leer(mensaje):
    texto = next(TECLEO)     # el siguiente dato «tecleado»
    print(mensaje + texto)   # lo enseñamos como se vería en la terminal
    return texto


class ErrorContrasena(Exception):        # la base de la familia
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


ESPECIALES = '!@#$%^&*'


def validar_contrasena(c):
    """No devuelve nada si es válida; si no, lanza la excepción del PRIMER fallo."""
    if len(c) < 8:
        raise ErrorLongitud(f'mínimo 8 caracteres (tiene {len(c)})')
    if not any(x.isupper() for x in c):
        raise ErrorMayuscula('debe contener al menos una mayúscula')
    if not any(x.isdigit() for x in c):
        raise ErrorDigito('debe contener al menos un número')
    if not any(x in ESPECIALES for x in c):
        raise ErrorEspecial(f'debe contener al menos un carácter especial ({ESPECIALES})')
    if ' ' in c:
        raise ErrorEspacio('no puede contener espacios')


print('=== VALIDADOR DE CONTRASEÑA ===')
while True:
    c = leer('Contraseña: ')
    try:
        validar_contrasena(c)
    except ErrorLongitud as err:
        print('  Error de longitud:', err)
    except ErrorMayuscula as err:
        print('  Error de mayúscula:', err)
    except ErrorDigito as err:
        print('  Error de dígito:', err)
    except ErrorContrasena as err:       # las dos que quedan, con su nombre
        print(f'  {type(err).__name__}: {err}')
    else:                                # solo si validar no lanzó nada
        print('  Contraseña válida')
        break
