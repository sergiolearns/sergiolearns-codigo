% Problema 5: así lo preguntan en el examen
% Del artículo «Transformaciones lineales y diagonalización — práctica guiada con filtros de color, capas que se pierden y una matriz con parámetro como en el examen (y la base que no arreglaba nada)»
% https://sergiolearns.com/transformaciones-lineales-y-diagonalizacion-practica/

format rat
syms k
Ak = [1 0 k^2-1; 0 3 0; 0 k 1];
det(Ak)                          % 3: biyectiva para todo k
rank(subs(Ak, k, 2) - eye(3))    % k = 2: rango 2, no diagonalizable
rank(subs(Ak, k, 1) - eye(3))    % k = 1: rango 1, diagonalizable
A = [1 0 0; 0 3 0; 0 1 1];       % k = 1
P = [1 0 0; 0 0 2; 0 1 1];
inv(sym(P))*A*P                  % D = diag(1, 1, 3)
A^5                              % la formula con n = 5
