% Función gauss_jordan
% Del artículo «Matrices y sistemas en MATLAB — teoría para programar tu propio Gauss-Jordan, funciones con varias salidas y el determinante recursivo (y el ticket que no cuadraba por cinco céntimos)»
% https://sergiolearns.com/matlab-intensivo-matrices-y-sistemas/
function [R, piv] = gauss_jordan(M, tol)
% GAUSS_JORDAN  Forma escalonada reducida de M con pivoteo parcial, como rref.
%   [R, piv] = gauss_jordan(M) devuelve la matriz reducida y las columnas pivote.
%   [R, piv] = gauss_jordan(M, tol) decide qué es cero con la tolerancia tol.
if nargin < 2
    tol = max(size(M)) * eps(norm(M, inf));   % la tolerancia por defecto de rref
end
[m, n] = size(M);
R = M;
piv = [];                % aquí se van apuntando las columnas pivote
fila = 1;                % fila en la que va el siguiente pivote
for j = 1:n
    if fila > m
        break            % ya no quedan filas: hemos terminado
    end
    [mayor, p] = max(abs(R(fila:m, j)));   % el más grande de lo que queda de la columna
    p = p + fila - 1;                       % posición en la matriz entera
    if mayor <= tol
        R(fila:m, j) = 0;                   % columna sin pivote: lo que hay es ruido
        continue
    end
    R([fila p], :) = R([p fila], :);        % sube la fila del pivote
    R(fila, :) = R(fila, :) / R(fila, j);   % pivote a 1
    for k = [1:fila-1, fila+1:m]            % ceros arriba y abajo
        R(k, :) = R(k, :) - R(k, j) * R(fila, :);
    end
    piv(end+1) = j;                         % apunta la columna pivote
    fila = fila + 1;
end
end
