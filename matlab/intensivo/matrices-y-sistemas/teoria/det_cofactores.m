% Función det_cofactores
% Del artículo «Matrices y sistemas en MATLAB — teoría para programar tu propio Gauss-Jordan, funciones con varias salidas y el determinante recursivo (y el ticket que no cuadraba por cinco céntimos)»
% https://sergiolearns.com/matlab-intensivo-matrices-y-sistemas/
function [d, llamadas] = det_cofactores(A)
% DET_COFACTORES  Determinante por desarrollo de la primera fila (recursivo).
%   [d, llamadas] = det_cofactores(A) cuenta también cuántas veces se ha llamado.
n = size(A, 1);
llamadas = 1;                    % esta llamada
if n == 1
    d = A(1, 1);                 % caso base: el determinante de un número
    return
end
d = 0;
for j = 1:n
    menor = A(2:n, [1:j-1, j+1:n]);       % sin la fila 1 ni la columna j
    [dm, c] = det_cofactores(menor);      % la misma función, un orden menos
    d = d + (-1)^(1+j) * A(1, j) * dm;
    llamadas = llamadas + c;
end
end
