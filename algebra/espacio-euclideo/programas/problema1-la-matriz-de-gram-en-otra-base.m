% Problema 1: la matriz de Gram en otra base
% Del artículo «Espacio euclídeo — práctica guiada con gustos musicales: matriz de Gram, ángulos, bases ortonormales, Gram-Schmidt y el coseno del examen (y los decimales que se me escaparon)»
% https://sergiolearns.com/espacio-euclideo-practica/

format rat
C = [1 0 1; 2 1 0; 0 1 -1];    % los vectores de B' en columnas
Gp = C' * C                    % G' = C^t I C
X = [1; 1; 0]; Y = [0; 1; 1];  % coordenadas en B'
X' * Gp * Y                    % producto con G'
dot(C * X, C * Y)              % el mismo, pasando a la canónica
