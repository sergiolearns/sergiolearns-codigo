% Función dibujar_cuadricula
% Del artículo «Transformaciones y formas en MATLAB — teoría para construir matrices por columnas, comprobar diagonalizaciones y dibujar con plot, fill y quiver (y el sofá que no cabía por la puerta)»
% https://sergiolearns.com/matlab-intensivo-transformaciones-y-formas/
function dibujar_cuadricula(A, lado)
% DIBUJAR_CUADRICULA  Dibuja la cuadrícula de -lado a lado y su imagen por la matriz A.
if nargin < 2
    lado = 2;
end
t = linspace(-lado, lado, 2);           % los dos extremos de cada línea
hold on
for k = -lado:lado
    vertical = [k k; t];                % la recta x = k, por sus dos extremos
    horizontal = [t; k k];              % la recta y = k
    plot(vertical(1,:), vertical(2,:), 'k:')        % original, de puntos
    plot(horizontal(1,:), horizontal(2,:), 'k:')
    v2 = A * vertical;  h2 = A * horizontal;          % las mismas, transformadas
    plot(v2(1,:), v2(2,:), 'b')
    plot(h2(1,:), h2(2,:), 'r')
end
axis equal
grid on
end
