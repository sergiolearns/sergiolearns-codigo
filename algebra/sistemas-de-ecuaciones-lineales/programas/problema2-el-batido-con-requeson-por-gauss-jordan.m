% Problema 2: el batido con requesón, por Gauss-Jordan
% Del artículo «Sistemas de ecuaciones lineales — práctica guiada con cinco problemas del batido, Rouché sin resolver y un parámetro de examen (y la ecuación que se me olvidó copiar)»
% https://sergiolearns.com/sistemas-de-ecuaciones-lineales-practica/

format rat
A4 = [4 6 1 8; 18 10 24 2; 2 3 0 4];
B  = [15; 70; 7];
p = rank(A4), q = rank([A4 B]), n = size(A4, 2)
R = rref([A4 B])                 % la misma reducida que a mano
t = 1/4;
x = [2 + t; 1 - 2*t; 1; t];      % una solución concreta
A4*x                             % tiene que dar 15, 70, 7
