% Pruébalo en el entorno de MATLAB
% Del artículo «Formas bilineales y cuadráticas — práctica guiada con rampas que parecen cuencos, conjugados que no son perpendiculares y un producto escalar con su coseno (y la diagonal que salía con fracciones)»
% https://sergiolearns.com/formas-bilineales-y-cuadraticas-practica/

format rat
A = [1 -1 2; -1 3 -1; 2 -1 2];      % la rampa del problema 3
Ct = [1 0 0; 1 1 0; -5 -1 2];       % B' sin fracciones
D = Ct*A*Ct'                         % la diagonal cambia, los signos no
format short
eig(A)                               % autovalores: dos positivos y uno negativo
v = Ct(3,:)';                        % el tercer vector de B'
v'*A*v                               % altura negativa: indefinida
