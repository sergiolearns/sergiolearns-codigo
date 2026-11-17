% Problema 1: cifrar un plan con la clave
% Del artículo «Matrices y determinantes — práctica guiada con cinco problemas a mano, cada uno comprobado en MATLAB (y la inversa que no daba la identidad)»
% https://sergiolearns.com/matrices-y-determinantes-practica/

K = [2 1; 5 3];
M = [3 14; 9 5];      % CINE: columnas CI y NE
C = K*M               % a) el cifrado
M*K                   % b) al revés: otra matriz
(K*M)' - M'*K'        % c) si son iguales, la resta da ceros
2*K - eye(2)          % d) eye(2) es la identidad 2x2
