% Función clasificar
% Del artículo «Transformaciones y formas en MATLAB — teoría para construir matrices por columnas, comprobar diagonalizaciones y dibujar con plot, fill y quiver (y el sofá que no cabía por la puerta)»
% https://sergiolearns.com/matlab-intensivo-transformaciones-y-formas/
function tipo = clasificar(A, tol)
% CLASIFICAR  Clasifica la forma cuadrática de matriz simétrica A con el criterio de Sylvester.
if nargin < 2
    tol = 1e-10;
end
if norm(A - A') > tol
    error('clasificar:noSimetrica', 'La matriz de una forma cuadrática tiene que ser simétrica.');
end
n = size(A, 1);
menores = zeros(1, n);
for k = 1:n
    menores(k) = det(A(1:k, 1:k));        % el menor principal de orden k
end
if all(menores > tol)
    tipo = 'definida positiva';
elseif all(menores(1:2:end) < -tol) && all(menores(2:2:end) > tol)
    tipo = 'definida negativa';           % impares negativos, pares positivos
elseif any(abs(menores) <= tol)
    tipo = 'Sylvester no decide';         % hay un menor nulo
else
    tipo = 'indefinida';
end
end
