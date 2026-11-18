% Función proyectar
% Del artículo «Espacios vectoriales en MATLAB — teoría para programar con bucles: bases que se eligen solas, tu propio Gram-Schmidt y la proyección como función (y la receta que no aportaba nada)»
% https://sergiolearns.com/matlab-intensivo-espacios-vectoriales/
function [p, c] = proyectar(v, B)
% PROYECTAR  Proyección ortogonal de v sobre el espacio generado por las columnas de B.
%   [p, c] = proyectar(v, B) devuelve la proyección p y los coeficientes c con p = B*c.
Q = gram_schmidt(B);
if size(Q, 2) < size(B, 2)
    error('proyectar:dependientes', ...
          'Las columnas de B no son independientes: rango %d de %d.', size(Q, 2), size(B, 2));
end
p = Q * (Q' * v);
c = B \ p;                       % cuánto de cada columna de B
end
