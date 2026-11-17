% Problema 4: el homogéneo de los intercambios
% Del artículo «Sistemas de ecuaciones lineales — práctica guiada con cinco problemas del batido, Rouché sin resolver y un parámetro de examen (y la ecuación que se me olvidó copiar)»
% https://sergiolearns.com/sistemas-de-ecuaciones-lineales-practica/

A4 = [4 6 1 8; 18 10 24 2; 2 3 0 4];
N  = null(A4, 'r')               % la dirección de los intercambios
A4*N                             % ceros: no cambia ningún macro
A4*([2; 1; 1; 0] + 3*N)          % el batido de la teoría más 3 intercambios
