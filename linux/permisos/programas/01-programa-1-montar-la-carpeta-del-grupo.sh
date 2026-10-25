# Programa 1: montar la carpeta del grupo
# Del artículo «Permisos en Linux — práctica con la carpeta de un trabajo en grupo, tres usuarios y un revisor de permisos (y la compañera que no podía compilar)»
# https://sergiolearns.com/permisos-en-linux-practica/
# Sesión de terminal: ejecútala en una carpeta de pruebas, nunca como root.

# 1. La estructura del trabajo: código en src/, documentos en docs/
mkdir -p practica-ic2/src practica-ic2/docs
cat > practica-ic2/src/main.c << 'EOF'
int main(void) { return 0; }
EOF
touch practica-ic2/docs/entrega.txt practica-ic2/docs/apuntes-privados.txt
cat > practica-ic2/compilar.sh << 'EOF'
#!/bin/bash
gcc -Wall -std=c11 src/main.c -o main && echo "OK"
EOF
# 2. Todo el árbol pasa al grupo del trabajo (-R = recursivo)
chgrp -R ic2 practica-ic2
# 3. Carpetas: yo todo, el grupo entra y lista, otros fuera
chmod 750 practica-ic2 practica-ic2/src practica-ic2/docs
# 4. Ficheros: el grupo lee el código y la entrega; mis apuntes, solo yo
chmod 640 practica-ic2/src/main.c practica-ic2/docs/entrega.txt
chmod 600 practica-ic2/docs/apuntes-privados.txt
chmod 750 practica-ic2/compilar.sh      # el grupo también lo puede ejecutar
# 5. Comprobación: -R lista también lo que hay dentro de cada carpeta
ls -lR practica-ic2
