# Solución del Nivel 3
# Del artículo «Permisos en Linux — ejercicios con chmod, umask y una carpeta de entregas compartida (y el chmod -R que me dejó fuera de mi propia carpeta)»
# https://sergiolearns.com/permisos-en-linux-ejercicios/
# Sesión con varios usuarios: cada línea "# @usuario" indica que lo que sigue se teclea en la terminal de esa persona.

# @sergio — Sergio prepara la carpeta común de entregas
mkdir entregas
chgrp ic2 entregas
chmod 3770 entregas        # 3 = 2 (setgid) + 1 (sticky) · 770 = dueño y grupo todo, otros nada
ls -ld entregas
touch entregas/sergio.txt
# @laura — Laura entrega lo suyo e intenta borrar lo de Sergio
touch entregas/laura.txt
ls -l entregas
rm entregas/sergio.txt
rm entregas/laura.txt
ls entregas
# @pablo — Pablo no es del grupo
ls entregas
