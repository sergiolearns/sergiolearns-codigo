% Script de «Pruébalo en el entorno de MATLAB» (con su función local al final)
% Del artículo «Matrices y sistemas en MATLAB — teoría para programar tu propio Gauss-Jordan, funciones con varias salidas y el determinante recursivo (y el ticket que no cuadraba por cinco céntimos)»
% https://sergiolearns.com/matlab-intensivo-matrices-y-sistemas/
% Tickets del piso: precios con mi Gauss-Jordan
A = [2 6 1; 1 4 2; 3 2 1];      % arroz, leche, pollo
b = [12.60; 14.00; 10.00];      % totales
R = gj([A b]);
precios = R(:, end)'
comprobacion = norm(A*precios' - b)

function M = gj(M)
m = size(M, 1);
for i = 1:m
    [~, p] = max(abs(M(i:m, i))); p = p + i - 1;   % pivoteo parcial
    M([i p], :) = M([p i], :);
    M(i, :) = M(i, :) / M(i, i);
    for k = [1:i-1, i+1:m]
        M(k, :) = M(k, :) - M(k, i) * M(i, :);
    end
end
end
