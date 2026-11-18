% Función dist_punto_plano
% Del artículo «Complejos y geometría en MATLAB — teoría para girar con exp(1i*θ), programar las raíces n-ésimas y medir distancias con funciones (y el robot aspirador que siempre giraba a la izquierda)»
% https://sergiolearns.com/matlab-intensivo-complejos-y-geometria/
function d = dist_punto_plano(P, A, n)
% DIST_PUNTO_PLANO  Distancia del punto P al plano que pasa por A con vector normal n.
d = abs(dot(n, P - A)) / norm(n);
end
