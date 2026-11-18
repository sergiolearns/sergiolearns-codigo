% Problema 1: un filtro de color que se puede deshacer
% Del artículo «Transformaciones lineales y diagonalización — práctica guiada con filtros de color, capas que se pierden y una matriz con parámetro como en el examen (y la base que no arreglaba nada)»
% https://sergiolearns.com/transformaciones-lineales-y-diagonalizacion-practica/

format rat
A = [1 1 0; 0 1 1; 1 0 1];   % filtro: coeficientes por filas
A*[100; 50; 20]              % b) la imagen
rref([A [90; 60; 50]])       % c) la antiimagen, como en el TP4
det(A)                       % d) distinto de 0: biyectiva
inv(A)                       % el filtro que lo deshace
