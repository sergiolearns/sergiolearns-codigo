% Problema 2: la forma polar y los conjugados de una rampa en ℝ³
% Del artículo «Formas bilineales y cuadráticas — práctica guiada con rampas que parecen cuencos, conjugados que no son perpendiculares y un producto escalar con su coseno (y la diagonal que salía con fracciones)»
% https://sergiolearns.com/formas-bilineales-y-cuadraticas-practica/

format rat
A = [1 2 -1; 2 3 3; -1 3 -1];
syms x y z
expand([x y z]*A*[x; y; z])     % vuelve a dar la w del enunciado
null([1 0 0]*A, 'r')            % c) conjugados con (1,0,0)
null([1 0 0; 0 0 1]*A, 'r')     % d) conjugados con los dos
