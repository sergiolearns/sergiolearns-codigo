% Problema 1: una forma bilineal que no es simétrica
% Del artículo «Formas bilineales y cuadráticas — práctica guiada con rampas que parecen cuencos, conjugados que no son perpendiculares y un producto escalar con su coseno (y la diagonal que salía con fracciones)»
% https://sergiolearns.com/formas-bilineales-y-cuadraticas-practica/

A = [3 1; -1 2];
u = [1; 2];  v = [3; -1];
u'*A*v, v'*A*u              % b) el orden importa
syms x y
w = expand([x y]*A*[x; y])  % c) el cruzado desaparece
(A + A')/2                  % matriz de la forma polar
C = [1 0; 1 1];             % B' en columnas
C'*A*C                      % d)
