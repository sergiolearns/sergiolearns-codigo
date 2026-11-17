% Problema 3: tres sistemas que se clasifican sin resolver
% Del artículo «Sistemas de ecuaciones lineales — práctica guiada con cinco problemas del batido, Rouché sin resolver y un parámetro de examen (y la ecuación que se me olvidó copiar)»
% https://sergiolearns.com/sistemas-de-ecuaciones-lineales-practica/

A  = [4 6; 18 10; 2 3];
rank(A)
rank([A [14; 46; 7]])     % a) 2: compatible determinado
rank([A [15; 70; 7]])     % b) 3: incompatible
rank([4 6; 2 3])          % c) 1 < 2: indeterminado
null([4 6; 2 3], 'r')     % c) la dirección de las soluciones
