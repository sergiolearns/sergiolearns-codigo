% Problema 3: diagonalizar por congruencia con fracciones
% Del artículo «Formas bilineales y cuadráticas — práctica guiada con rampas que parecen cuencos, conjugados que no son perpendiculares y un producto escalar con su coseno (y la diagonal que salía con fracciones)»
% https://sergiolearns.com/formas-bilineales-y-cuadraticas-practica/

format rat
A = [1 -1 2; -1 3 -1; 2 -1 2];
Ct = [1 0 0; 1 1 0; -5/2 -1/2 1];   % filas = B'
Ct*A*Ct'                            % D de papel
det(A(1,1)), det(A(1:2,1:2)), det(A)
