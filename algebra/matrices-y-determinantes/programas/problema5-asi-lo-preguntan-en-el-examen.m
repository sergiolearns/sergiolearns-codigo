% Problema 5: así lo preguntan en el examen
% Del artículo «Matrices y determinantes — práctica guiada con cinco problemas a mano, cada uno comprobado en MATLAB (y la inversa que no daba la identidad)»
% https://sergiolearns.com/matrices-y-determinantes-practica/

syms a
A = [1 a 0; 0 1 a; a 0 1];
d = det(A)             % el determinante con el parámetro
subs(d, a, -1)         % vale 0 en a = -1
rank(subs(A, a, -1))   % y ahí el rango baja a 2
inv(subs(A, a, 1))     % la inversa para a = 1, exacta
