#!/bin/bash
# revisar.sh: script de apoyo del programa 3
# Del artículo «Redirecciones y tuberías en Linux — práctica con un informe que crece con >>, un ranking guardado con tee y avisos separados de lo correcto (y el informe que se comió a sí mismo)»
# https://sergiolearns.com/redirecciones-y-tuberias-en-linux-practica/

# revisar.sh: repasa los cuatro ordenadores del aula (simulado con echo)
echo "pc01: correcto"
echo "pc02: correcto"
echo "AVISO pc03: disco casi lleno" >&2   # >&2: este mensaje sale por stderr
echo "pc04: correcto"
echo "AVISO pc04: sin red" >&2
