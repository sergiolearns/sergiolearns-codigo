% Pruébalo en el entorno de MATLAB
% Del artículo «Matrices y determinantes — práctica guiada con cinco problemas a mano, cada uno comprobado en MATLAB (y la inversa que no daba la identidad)»
% https://sergiolearns.com/matrices-y-determinantes-practica/

format rat
%% Problema 2: rango
B = [1 -1 2 1; 2 0 1 3; 3 -1 3 4; 0 2 -3 2];
rref(B), rank(B)
%% Problema 3: inversa y descifrado
K3 = [1 1 1; 0 1 1; -2 -1 0];
C = [50 28 49; 36 28 36; -44 -23 -42];
M = inv(K3)*C
%% Problema 4: determinante 4x4
D = [2 0 1 3; 1 -1 0 2; 0 3 1 -1; 1 2 0 1];
det(D)
