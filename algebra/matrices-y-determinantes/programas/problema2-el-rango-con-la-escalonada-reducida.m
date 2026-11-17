% Problema 2: el rango con la escalonada reducida
% Del artículo «Matrices y determinantes — práctica guiada con cinco problemas a mano, cada uno comprobado en MATLAB (y la inversa que no daba la identidad)»
% https://sergiolearns.com/matrices-y-determinantes-practica/

format rat                 % fracciones como fracciones
B = [1 -1 2 1; 2 0 1 3; 3 -1 3 4; 0 2 -3 2];
rref(B)                    % la escalonada reducida
rank(B)                    % el número de pivotes
