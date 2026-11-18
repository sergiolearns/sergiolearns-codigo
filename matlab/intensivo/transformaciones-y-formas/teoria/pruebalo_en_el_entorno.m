% Script de «Pruébalo en el entorno de MATLAB» (con su función local al final)
% Del artículo «Transformaciones y formas en MATLAB — teoría para construir matrices por columnas, comprobar diagonalizaciones y dibujar con plot, fill y quiver (y el sofá que no cabía por la puerta)»
% https://sergiolearns.com/matlab-intensivo-transformaciones-y-formas/
% El sofá del salón: matriz de una regla y su efecto en las esquinas
sofa = [0 2 2 0 0; 0 0 0.9 0.9 0];
regla = @(v) [v(1) + 0.5*v(2); v(2)];     % la cizalla
A = matriz_de(regla, 2)
nuevo = A * sofa
area_antes_despues = [2*0.9, abs(det(A))*2*0.9]
[P, D] = eig([2 1; 1 2])

function A = matriz_de(f, n)
I = eye(n);  A = zeros(n);
for j = 1:n
    A(:, j) = f(I(:, j));
end
end
