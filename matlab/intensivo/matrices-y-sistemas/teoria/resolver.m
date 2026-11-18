% Función resolver
% Del artículo «Matrices y sistemas en MATLAB — teoría para programar tu propio Gauss-Jordan, funciones con varias salidas y el determinante recursivo (y el ticket que no cuadraba por cinco céntimos)»
% https://sergiolearns.com/matlab-intensivo-matrices-y-sistemas/
function [x, tipo] = resolver(A, b)
% RESOLVER  Resuelve A*x = b con gauss_jordan y dice qué tipo de sistema es.
%   En un indeterminado devuelve la solución con las variables libres a 0.
n = size(A, 2);
[R, piv] = gauss_jordan([A b]);
if any(piv == n + 1)
    tipo = 'incompatible';
    x = [];
elseif numel(piv) == n
    tipo = 'compatible determinado';
    x = R(1:n, end);
else
    tipo = 'compatible indeterminado';
    x = zeros(n, 1);
    x(piv) = R(1:numel(piv), end);   % las pivote, del lado derecho; las libres, 0
end
end
