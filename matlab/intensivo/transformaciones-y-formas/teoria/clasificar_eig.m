% Función clasificar_eig
% Del artículo «Transformaciones y formas en MATLAB — teoría para construir matrices por columnas, comprobar diagonalizaciones y dibujar con plot, fill y quiver (y el sofá que no cabía por la puerta)»
% https://sergiolearns.com/matlab-intensivo-transformaciones-y-formas/
function tipo = clasificar_eig(A, tol)
% CLASIFICAR_EIG  Clasifica la forma cuadrática de A por los signos de sus autovalores.
if nargin < 2
    tol = 1e-10;
end
l = eig(A);
if all(l > tol),               tipo = 'definida positiva';
elseif all(l < -tol),          tipo = 'definida negativa';
elseif all(l > -tol),          tipo = 'semidefinida positiva';
elseif all(l < tol),           tipo = 'semidefinida negativa';
else,                          tipo = 'indefinida';
end
end
