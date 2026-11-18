% Función raices_n
% Del artículo «Complejos y geometría en MATLAB — teoría para girar con exp(1i*θ), programar las raíces n-ésimas y medir distancias con funciones (y el robot aspirador que siempre giraba a la izquierda)»
% https://sergiolearns.com/matlab-intensivo-complejos-y-geometria/
function r = raices_n(w, n)
% RAICES_N  Las n raíces n-ésimas del complejo w, ordenadas por k = 0, ..., n-1.
%   Sin salida (raices_n(w, n) suelto), las dibuja como un polígono.
k = (0:n-1).';                                     % columna de k
r = abs(w)^(1/n) * exp(1i * (angle(w) + 2*pi*k) / n);
if nargout == 0                                    % nadie recoge la salida: dibujar
    plot([r; r(1)], 'o-')                          % repetir la primera para cerrar
    axis equal
    grid on
    title(sprintf('Las %d raíces %d-ésimas de %s', n, n, num2str(w)))
end
end
