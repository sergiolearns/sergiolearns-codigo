% Función posicion_rectas
% Del artículo «Complejos y geometría en MATLAB — teoría para girar con exp(1i*θ), programar las raíces n-ésimas y medir distancias con funciones (y el robot aspirador que siempre giraba a la izquierda)»
% https://sergiolearns.com/matlab-intensivo-complejos-y-geometria/
function pos = posicion_rectas(r, s)
% POSICION_RECTAS  Posición relativa de dos rectas de R^3.
%   Cada recta es un struct con un punto (campo A) y un vector director (campo v).
r1 = rank([r.v s.v]);
r2 = rank([r.v s.v s.A - r.A]);
if r1 == 1 && r2 == 1
    pos = 'coinciden';
elseif r1 == 1
    pos = 'paralelas';
elseif r2 == 2
    pos = 'se cortan';
else
    pos = 'se cruzan';
end
end
