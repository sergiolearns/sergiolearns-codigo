% Función potencia_diag
% Del artículo «Transformaciones y formas en MATLAB — teoría para construir matrices por columnas, comprobar diagonalizaciones y dibujar con plot, fill y quiver (y el sofá que no cabía por la puerta)»
% https://sergiolearns.com/matlab-intensivo-transformaciones-y-formas/
function Ak = potencia_diag(A, k)
% POTENCIA_DIAG  A^k diagonalizando: P * D^k * inv(P).
%   Da error si A no es diagonalizable (los autovectores no forman una base).
[P, D] = eig(A);
if rank(P) < size(A, 1)
    error('potencia_diag:noDiag', 'La matriz no es diagonalizable: rango de P = %d.', rank(P));
end
Ak = P * diag(diag(D).^k) / P;    % / P es multiplicar por la inversa de P
end
