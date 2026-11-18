% Problema 4: un parámetro, Sylvester y un producto escalar
% Del artículo «Formas bilineales y cuadráticas — práctica guiada con rampas que parecen cuencos, conjugados que no son perpendiculares y un producto escalar con su coseno (y la diagonal que salía con fracciones)»
% https://sergiolearns.com/formas-bilineales-y-cuadraticas-practica/

format short
syms a
Aa = [1 a 0; a 4 0; 0 0 2];
det(Aa(1:2,1:2)), det(Aa)       % menores con el parametro
A1 = [1 1 0; 1 4 0; 0 0 2];     % a = 1
eig(A1)                         % todos positivos: definida positiva
e1 = [1;0;0]; e2 = [0;1;0]; u = [1;1;0];
c = (e1'*A1*e2)/sqrt((e1'*A1*e1)*(e2'*A1*e2))
sqrt(u'*A1*u)                   % longitud de (1,1,0): sqrt(7)
