% Pruébalo en el entorno de MATLAB
% Del artículo «Sistemas de ecuaciones lineales — práctica guiada con cinco problemas del batido, Rouché sin resolver y un parámetro de examen (y la ecuación que se me olvidó copiar)»
% https://sergiolearns.com/sistemas-de-ecuaciones-lineales-practica/

format rat
%% Problema 1: la merienda
A = [4 6 1; 18 10 24; 2 3 0];
rref([A [12; 76; 5]])
%% Problemas 2 y 4: requesón
A4 = [A [8; 2; 4]];
rref([A4 [15; 70; 7]])
null(A4, 'r')
%% Problema 3: avena y leche
rank([4 6; 18 10; 2 3]), rank([4 6 15; 18 10 70; 2 3 7])
