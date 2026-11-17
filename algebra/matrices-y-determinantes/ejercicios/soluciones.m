% Comprobación en MATLAB de las soluciones de los ejercicios tipo examen
% Del artículo «Matrices y determinantes — ejercicios tipo examen con el cifrado, un parámetro, el determinante de la diagonalización y un test de 20 (y la fila que multipliqué por 2)»
% https://sergiolearns.com/matrices-y-determinantes-ejercicios/

format rat
%% Ejercicio 1
A = [1 2 0; -1 1 3];  B = [2 1; 0 -1; 1 1];
A*B, B*A
trace(A*B), trace(B*A)     % las dos trazas
A*A'                       % simétrica
%% Ejercicio 2
syms k
Ak = [1 1 k; 1 k 1; k 1 1];
d = det(Ak)                % 3k - k^3 - 2 desarrollado
rank(subs(Ak, k, 1)), rank(subs(Ak, k, -2))
A0 = [1 1 0; 1 0 1; 0 1 1];
inv(A0)
X = inv(A0)*[42 40; 25 24; 27 26]
%% Ejercicio 3
A3 = [2 1 1; 1 2 1; 1 1 2];
syms lambda
p = det(A3 - lambda*eye(3))
rank(A3 - eye(3)), rank(A3 - 4*eye(3))
