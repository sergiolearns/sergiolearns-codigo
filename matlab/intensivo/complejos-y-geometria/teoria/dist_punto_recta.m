% Función dist_punto_recta
% Del artículo «Complejos y geometría en MATLAB — teoría para girar con exp(1i*θ), programar las raíces n-ésimas y medir distancias con funciones (y el robot aspirador que siempre giraba a la izquierda)»
% https://sergiolearns.com/matlab-intensivo-complejos-y-geometria/
function d = dist_punto_recta(P, A, v)
% DIST_PUNTO_RECTA  Distancia del punto P a la recta que pasa por A con dirección v (en R^2 o R^3).
AP = P - A;
perp = AP - (dot(AP, v) / dot(v, v)) * v;     % lo que no va en la dirección de v
d = norm(perp);
end
