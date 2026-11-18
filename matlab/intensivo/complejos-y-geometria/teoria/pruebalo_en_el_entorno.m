% Script de «Pruébalo en el entorno de MATLAB» (con su función local al final)
% Del artículo «Complejos y geometría en MATLAB — teoría para girar con exp(1i*θ), programar las raíces n-ésimas y medir distancias con funciones (y el robot aspirador que siempre giraba a la izquierda)»
% https://sergiolearns.com/matlab-intensivo-complejos-y-geometria/
% Robot, alfombra y lámpara del salón
pos = 0; rumbo = 1; camino = pos;
for t = [4 3 4 3]
    pos = pos + t*rumbo;  camino(end+1) = pos;  rumbo = rumbo*1i;
end
camino
esquinas = raices(8, 6)
lampara = [1; 2; 1.6];  A = [0; 0; 2.5];  n = [0; 0.6; 0.8];
distancia = abs(dot(n, lampara - A)) / norm(n)

function r = raices(w, n)
k = (0:n-1).';
r = abs(w)^(1/n) * exp(1i*(angle(w) + 2*pi*k)/n);
end
