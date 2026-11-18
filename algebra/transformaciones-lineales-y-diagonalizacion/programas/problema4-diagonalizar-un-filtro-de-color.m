% Problema 4: diagonalizar un filtro de color
% Del artículo «Transformaciones lineales y diagonalización — práctica guiada con filtros de color, capas que se pierden y una matriz con parámetro como en el examen (y la base que no arreglaba nada)»
% https://sergiolearns.com/transformaciones-lineales-y-diagonalizacion-practica/

format rat
A = [3 1 1; 0 2 0; 1 1 3];
eig(A)                         % autovalores, en el orden de MATLAB
rank(A - 2*eye(3))             % 1 -> d = 3 - 1 = 2
P = [null(A - 2*eye(3), 'r') null(A - 4*eye(3), 'r')]
D = inv(sym(P))*A*P            % diagonal: 2, 2, 4
