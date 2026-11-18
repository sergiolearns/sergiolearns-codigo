% Problema 2: un mezclador de capas que pierde información
% Del artículo «Transformaciones lineales y diagonalización — práctica guiada con filtros de color, capas que se pierden y una matriz con parámetro como en el examen (y la base que no arreglaba nada)»
% https://sergiolearns.com/transformaciones-lineales-y-diagonalizacion-practica/

format rat
A = [1 2 0 -1; 0 1 1 1; 1 3 1 0];
rank(A)                      % 2: dim Im = 2, dim Ker = 4 - 2
null(A, 'r')                 % base del nucleo, parametros a 1
rref(A)                      % pivotes en las columnas 1 y 2
rref([A [1; 1; 2]])          % compatible: infinitas soluciones
rref([A [1; 1; 1]])          % fila (0 0 0 0 | 1): no hay antiimagen
