% Problema 1: la merienda, por Gauss y por Cramer
% Del artículo «Sistemas de ecuaciones lineales — práctica guiada con cinco problemas del batido, Rouché sin resolver y un parámetro de examen (y la ecuación que se me olvidó copiar)»
% https://sergiolearns.com/sistemas-de-ecuaciones-lineales-practica/

A = [4 6 1; 18 10 24; 2 3 0];
B = [12; 76; 5];
p = rank(A), q = rank([A B])     % 3 y 3, con n = 3: CD
rref([A B])                      % la solución en la última columna
A3 = A;  A3(:, 3) = B;           % Cramer: la columna 3 cambiada por B
det(A3) / det(A)                 % el valor de z
