% Problema 4: un determinante 4 × 4 de dos formas
% Del artículo «Matrices y determinantes — práctica guiada con cinco problemas a mano, cada uno comprobado en MATLAB (y la inversa que no daba la identidad)»
% https://sergiolearns.com/matrices-y-determinantes-practica/

D = [2 0 1 3; 1 -1 0 2; 0 3 1 -1; 1 2 0 1];
det(D)                   % el determinante completo
det(D([2 3 4], [1 2 4])) % menor M13: sin la fila 1 ni la columna 3
det(D([1 2 4], [1 2 4])) % menor M33: sin la fila 3 ni la columna 3
