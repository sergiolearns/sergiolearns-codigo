% Función matriz_de
% Del artículo «Transformaciones y formas en MATLAB — teoría para construir matrices por columnas, comprobar diagonalizaciones y dibujar con plot, fill y quiver (y el sofá que no cabía por la puerta)»
% https://sergiolearns.com/matlab-intensivo-transformaciones-y-formas/
function A = matriz_de(f, n)
% MATRIZ_DE  Matriz de una transformación lineal de R^n en R^n.
%   A = matriz_de(f, n): la columna j es la imagen f(e_j) del j-ésimo vector canónico.
I = eye(n);
A = zeros(n);                 % reservar el tamaño antes de rellenar
for j = 1:n
    A(:, j) = f(I(:, j));     % imagen de e_j, en la columna j
end
end
