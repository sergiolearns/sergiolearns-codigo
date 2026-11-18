% Función gj_simple
% Del artículo «Matrices y sistemas en MATLAB — teoría para programar tu propio Gauss-Jordan, funciones con varias salidas y el determinante recursivo (y el ticket que no cuadraba por cinco céntimos)»
% https://sergiolearns.com/matlab-intensivo-matrices-y-sistemas/
function M = gj_simple(M)
% GJ_SIMPLE  Gauss-Jordan sin elegir pivote: solo vale si nunca sale un 0 en la diagonal.
m = size(M, 1);
for i = 1:m
    M(i, :) = M(i, :) / M(i, i);           % pivote a 1
    for k = [1:i-1, i+1:m]                 % todas las filas menos la i
        M(k, :) = M(k, :) - M(k, i) * M(i, :);
    end
end
end
