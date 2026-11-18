% Función coste
% Del artículo «Matrices y sistemas en MATLAB — teoría para programar tu propio Gauss-Jordan, funciones con varias salidas y el determinante recursivo (y el ticket que no cuadraba por cinco céntimos)»
% https://sergiolearns.com/matlab-intensivo-matrices-y-sistemas/
function total = coste(cantidades, precios)
% COSTE  Lo que cuesta una compra: cantidades por precios, sumado.
%   total = coste(cantidades, precios) con dos vectores del mismo tamaño.
total = sum(cantidades .* precios);
end
