% Ejercicio 1: operaciones elementales con los tickets del piso
% Del artículo «Matrices y sistemas en MATLAB — ejercicios para programar tu Gauss-Jordan, un determinante recursivo y las cuentas del piso (y el sistema que fallé en el trabajo práctico 2)»
% https://sergiolearns.com/matlab-intensivo-matrices-y-sistemas-ejercicios/

A = [2 3 1; 1 2 2; 3 1 1];
b = [7.35; 7.70; 6.85];
Ab = [A b]
Ab([1 2], :) = Ab([2 1], :)
Ab(2,:) = Ab(2,:) - 2*Ab(1,:)
Ab(3,:) = Ab(3,:) - 3*Ab(1,:)

rref(Ab)
