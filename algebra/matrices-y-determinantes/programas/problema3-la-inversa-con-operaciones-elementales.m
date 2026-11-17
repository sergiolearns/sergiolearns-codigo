% Problema 3: la inversa con operaciones elementales
% Del artículo «Matrices y determinantes — práctica guiada con cinco problemas a mano, cada uno comprobado en MATLAB (y la inversa que no daba la identidad)»
% https://sergiolearns.com/matrices-y-determinantes-practica/

K3 = [1 1 1; 0 1 1; -2 -1 0];
C  = [50 28 49; 36 28 36; -44 -23 -42];
rref([K3 eye(3)])     % (K3 | I) -> (I | inversa): la mitad derecha
Ki = inv(K3)          % lo mismo, directo
M  = Ki*C             % el mensaje en números
K3*Ki                 % comprobación: la identidad
