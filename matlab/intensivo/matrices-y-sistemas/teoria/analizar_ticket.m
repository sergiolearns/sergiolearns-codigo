% Función analizar_ticket
% Del artículo «Matrices y sistemas en MATLAB — teoría para programar tu propio Gauss-Jordan, funciones con varias salidas y el determinante recursivo (y el ticket que no cuadraba por cinco céntimos)»
% https://sergiolearns.com/matlab-intensivo-matrices-y-sistemas/
function [total, caro] = analizar_ticket(cantidades, precios)
% ANALIZAR_TICKET  Total del ticket y posición del producto en el que más se gastó.
gasto = cantidades .* precios;
total = sum(gasto);
[~, caro] = max(gasto);   % ~ descarta la primera salida de max (el valor)
end
