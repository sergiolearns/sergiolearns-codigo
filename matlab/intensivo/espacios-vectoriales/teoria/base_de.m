% Función base_de
% Del artículo «Espacios vectoriales en MATLAB — teoría para programar con bucles: bases que se eligen solas, tu propio Gram-Schmidt y la proyección como función (y la receta que no aportaba nada)»
% https://sergiolearns.com/matlab-intensivo-espacios-vectoriales/
function [B, cuales] = base_de(V)
% BASE_DE  Columnas de V que forman una base del espacio que generan.
%   [B, cuales] = base_de(V): recorre las columnas y se queda con las que suben el rango.
B = zeros(size(V, 1), 0);        % una matriz sin columnas, con las filas de V
cuales = [];
for j = 1:size(V, 2)
    candidata = [B V(:, j)];     % lo que tengo más la columna j
    if rank(candidata) > size(B, 2)
        B = candidata;           % aporta: se queda
        cuales(end+1) = j;
    end
end
end
