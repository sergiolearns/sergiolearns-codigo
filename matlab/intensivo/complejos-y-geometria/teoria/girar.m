% Función girar
% Del artículo «Complejos y geometría en MATLAB — teoría para girar con exp(1i*θ), programar las raíces n-ésimas y medir distancias con funciones (y el robot aspirador que siempre giraba a la izquierda)»
% https://sergiolearns.com/matlab-intensivo-complejos-y-geometria/
function w = girar(z, grados, centro)
% GIRAR  Gira los puntos z (complejos) un ángulo en grados alrededor de centro (0 por defecto).
if nargin < 3
    centro = 0;
end
w = centro + (z - centro) .* exp(1i * deg2rad(grados));
end
