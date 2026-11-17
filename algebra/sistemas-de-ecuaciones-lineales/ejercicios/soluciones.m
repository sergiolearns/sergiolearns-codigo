% Comprobación en MATLAB de las soluciones de los ejercicios tipo examen
% Del artículo «Sistemas de ecuaciones lineales — ejercicios tipo examen con el batido, un parámetro que lo cambia todo, las ecuaciones de un subespacio y un test de 20 (y la fila de ceros que me asustó)»
% https://sergiolearns.com/sistemas-de-ecuaciones-lineales-ejercicios/

format rat
%% Ejercicio 1
A = [4 6 1; 18 10 24; 2 3 0];
rref([A [17; 62; 8]])
A2 = A;  A2(:, 2) = [17; 62; 8];  det(A2)/det(A)   % Cramer para y
%% Ejercicio 2
syms m
Am = [m -1 1; 0 m -1; 2 -1 1];  Bm = [1; 1; 1];
d = det(Am)
rank(subs(Am, m, 1)), rank(subs([Am Bm], m, 1))   % 2 y 3: incompatible
rank(subs(Am, m, 2)), rank(subs([Am Bm], m, 2))   % 2 y 2: indeterminado
inv(subs(Am, m, 3))*Bm                             % m = 3: (0, 1, 2)
%% Ejercicio 3
H = [1 1 1 1; 1 -1 2 0; 2 0 3 1];
rank(H)
rref(H)
null(H, 'r')
