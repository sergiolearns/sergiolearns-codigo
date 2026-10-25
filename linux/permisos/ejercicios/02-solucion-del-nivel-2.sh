# Solución del Nivel 2
# Del artículo «Permisos en Linux — ejercicios con chmod, umask y una carpeta de entregas compartida (y el chmod -R que me dejó fuera de mi propia carpeta)»
# https://sergiolearns.com/permisos-en-linux-ejercicios/
# Sesión de terminal: ejecútala en una carpeta de pruebas, nunca como root.

umask 027                # quita w al grupo (2) y todo a otros (7)
umask                    # comprobación en octal
umask -S                 # y en letras: lo que SÍ se deja
touch acta.txt
mkdir capturas
stat -c '%a %A %n' acta.txt capturas
