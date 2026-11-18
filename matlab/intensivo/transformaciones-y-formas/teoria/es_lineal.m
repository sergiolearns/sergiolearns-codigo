% Función es_lineal
% Del artículo «Transformaciones y formas en MATLAB — teoría para construir matrices por columnas, comprobar diagonalizaciones y dibujar con plot, fill y quiver (y el sofá que no cabía por la puerta)»
% https://sergiolearns.com/matlab-intensivo-transformaciones-y-formas/
function lineal = es_lineal(f, n, tol)
% ES_LINEAL  Comprueba con vectores de prueba si la regla f de R^n en R^n es lineal.
%   No es una demostración: si da false, seguro que no lo es; si da true, probablemente sí.
if nargin < 3
    tol = 1e-10;
end
u = (1:n)';                 % dos vectores de prueba cualesquiera
v = (n:-1:1)' - 2;
a = 2;  b = -0.5;
izquierda = f(a*u + b*v);
derecha = a*f(u) + b*f(v);
lineal = norm(izquierda - derecha) < tol && norm(f(zeros(n, 1))) < tol;
end
