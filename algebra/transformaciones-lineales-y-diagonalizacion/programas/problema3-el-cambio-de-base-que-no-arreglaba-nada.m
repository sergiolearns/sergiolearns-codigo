% Problema 3: el cambio de base que no arreglaba nada
% Del artículo «Transformaciones lineales y diagonalización — práctica guiada con filtros de color, capas que se pierden y una matriz con parámetro como en el examen (y la base que no arreglaba nada)»
% https://sergiolearns.com/transformaciones-lineales-y-diagonalizacion-practica/

format rat
A = [3 -1; 1 1];
C = [1 1; 1 2];              % vectores de B' en columnas
Ap = inv(C)*A*C              % la matriz en la base nueva
eig(A)                       % 2 doble
2 - rank(A - 2*eye(2))       % d = 1: no diagonalizable
