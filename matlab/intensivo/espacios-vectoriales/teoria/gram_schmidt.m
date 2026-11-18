% Función gram_schmidt
% Del artículo «Espacios vectoriales en MATLAB — teoría para programar con bucles: bases que se eligen solas, tu propio Gram-Schmidt y la proyección como función (y la receta que no aportaba nada)»
% https://sergiolearns.com/matlab-intensivo-espacios-vectoriales/
function Q = gram_schmidt(V, tol)
% GRAM_SCHMIDT  Base ortonormal (por columnas) del espacio generado por las columnas de V.
%   Q = gram_schmidt(V, tol) salta los vectores cuya parte nueva tiene norma < tol (1e-10 por defecto).
if nargin < 2
    tol = 1e-10;
end
Q = zeros(size(V, 1), 0);
for j = 1:size(V, 2)
    w = V(:, j);
    for k = 1:size(Q, 2)
        w = w - (Q(:, k)' * w) * Q(:, k);   % Gram-Schmidt modificado
    end
    if norm(w) > tol
        Q(:, end+1) = w / norm(w);
    end
end
end
