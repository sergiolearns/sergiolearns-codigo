% Comprobación en MATLAB de las soluciones de los ejercicios tipo examen
% Del artículo «Transformaciones lineales y diagonalización — ejercicios tipo examen con un filtro que borra los grises, potencias con dos autovalores y un parámetro que decide todo (y la P que no iba con su D)»
% https://sergiolearns.com/transformaciones-lineales-y-diagonalizacion-ejercicios/

format rat
%% Ejercicio 1
A1 = [1 -1 0; 0 1 -1];
A1*[5; 2; 1]                 % (3, 1)
rank(A1), null(A1, 'r')      % rango 2; nucleo: los grises
rref([A1 [1; 1]])            % antiimagen de (1, 1)
%% Ejercicio 2
A2 = [4 -2; 1 1];
eig(A2)                      % 3 y 2 (el orden es el de MATLAB)
P2 = [1 2; 1 1];
inv(P2)*A2*P2                % diagonal: c)
A2^4                         % la formula con n = 4
%% Ejercicio 3
syms k
A3 = [1 1 0; 1 1 0; 0 k 0];
rank(subs(A3, k, 5)), rank(subs(A3, k, 0))
A30 = [1 1 0; 1 1 0; 0 0 0];
A30^6 - 2^5*A30              % ceros: A^n = 2^(n-1) A
