# Solución del Nivel 1
# Del artículo «Permisos en Linux — ejercicios con chmod, umask y una carpeta de entregas compartida (y el chmod -R que me dejó fuera de mi propia carpeta)»
# https://sergiolearns.com/permisos-en-linux-ejercicios/
# Sesión de terminal: ejecútala en una carpeta de pruebas, nunca como root.

touch informe.txt compilar.sh
mkdir datos
chmod 640 informe.txt              # octal: rw- r-- ---
chmod u+x,g+x,o-r compilar.sh      # simbólico, partiendo de 644 (rw-r--r--) → rwxr-x---
chmod 750 datos                    # el grupo entra (x) y lista (r), pero no crea (sin w)
stat -c '%a %A %n' informe.txt compilar.sh datos
