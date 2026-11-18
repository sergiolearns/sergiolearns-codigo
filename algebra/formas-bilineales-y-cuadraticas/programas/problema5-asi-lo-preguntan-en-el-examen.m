% Problema 5: así lo preguntan en el examen
% Del artículo «Formas bilineales y cuadráticas — práctica guiada con rampas que parecen cuencos, conjugados que no son perpendiculares y un producto escalar con su coseno (y la diagonal que salía con fracciones)»
% https://sergiolearns.com/formas-bilineales-y-cuadraticas-practica/

format rat
A = [2 -1 1; -1 1 0; 1 0 2];
syms x y z
expand([x y z]*A*[x; y; z])          % a)
Ct = [1 0 0; 1/2 1 0; -1 -1 1];      % filas = B'
Ct*A*Ct'                             % b) D
det(A(1,1)), det(A(1:2,1:2)), det(A) % Sylvester
e1 = [1;0;0]; e2 = [0;1;0];
(e1'*A*e2)/sqrt((e1'*A*e1)*(e2'*A*e2))   % c) coseno
