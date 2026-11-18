% Comprobación en MATLAB de las soluciones de los ejercicios tipo examen
% Del artículo «Formas bilineales y cuadráticas — ejercicios tipo examen con una rampa que engaña, un parámetro que Sylvester no resuelve y un producto escalar que no lo es (y la base leída por columnas)»
% https://sergiolearns.com/formas-bilineales-y-cuadraticas-ejercicios/

format rat
%% Ejercicio 1
A1 = [3 -2; -2 1];
syms x y z
expand([x y]*A1*[x; y])          % vuelve a dar w
null([1 0]*A1, 'r')              % conjugados con (1,0): (2,3)/3
Ct1 = [1 0; 2/3 1];
Ct1*A1*Ct1'                      % D = diag(3, -1/3)
%% Ejercicio 2 (a = -1)
A2 = [1 1 0; 1 1 0; 0 0 -1];
Ct2 = [1 0 0; -1 1 0; 0 0 1];
Ct2*A2*Ct2'                      % D = diag(1, 0, -1)
%% Ejercicio 3
A3 = [2 1 0; 1 1 1; 0 1 -1];
det(A3(1,1)), det(A3(1:2,1:2)), det(A3)
Ct3 = [1 0 0; -1/2 1 0; 1 -2 1];
Ct3*A3*Ct3'                      % D = diag(2, 1/2, -3)
null([0 1 0]*A3, 'r')            % b) base de U
