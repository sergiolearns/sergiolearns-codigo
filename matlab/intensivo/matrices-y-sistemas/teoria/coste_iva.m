% Función coste_iva
% Del artículo «Matrices y sistemas en MATLAB — teoría para programar tu propio Gauss-Jordan, funciones con varias salidas y el determinante recursivo (y el ticket que no cuadraba por cinco céntimos)»
% https://sergiolearns.com/matlab-intensivo-matrices-y-sistemas/
function total = coste_iva(cantidades, precios, iva)
% COSTE_IVA  Total con impuesto; si no se indica, el 7 % del IGIC general.
if nargin < 3
    iva = 0.07;
end
total = sum(cantidades .* precios) * (1 + iva);
end
