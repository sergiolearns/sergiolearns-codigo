% Pruébalo en el entorno de MATLAB
% Del artículo «Transformaciones lineales y diagonalización — práctica guiada con filtros de color, capas que se pierden y una matriz con parámetro como en el examen (y la base que no arreglaba nada)»
% https://sergiolearns.com/transformaciones-lineales-y-diagonalizacion-practica/

format rat
A = [1 1 0; 1 1 0; 0 0 2];          % filtro nuevo
rank(A)                              % dim Im
null(A, 'r')                         % base del nucleo
eig(A)                               % autovalores
P = [null(A, 'r') null(A - 2*eye(3), 'r')]
inv(sym(P))*A*P                      % D
A^4 - P*diag([0 2^4 2^4])*inv(P)     % ceros: la formula funciona
