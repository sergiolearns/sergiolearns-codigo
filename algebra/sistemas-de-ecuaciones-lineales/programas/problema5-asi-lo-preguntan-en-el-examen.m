% Problema 5: así lo preguntan en el examen
% Del artículo «Sistemas de ecuaciones lineales — práctica guiada con cinco problemas del batido, Rouché sin resolver y un parámetro de examen (y la ecuación que se me olvidó copiar)»
% https://sergiolearns.com/sistemas-de-ecuaciones-lineales-practica/

syms a
A = [1 1 a; 1 a 1; a 1 1];
B = [1; 1; 1];
d = det(A)                                 % el determinante con a
rank(subs(A, a, -2)), rank(subs([A B], a, -2))   % 2 y 3: incompatible
rank(subs(A, a, 1)),  rank(subs([A B], a, 1))    % 1 y 1: indeterminado
inv(subs(A, a, 3))*B                       % con a = 3, x = y = z = 1/5
