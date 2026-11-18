% Ejercicio 2: pruebas de mi_gj y det_cof
% Del artículo «Matrices y sistemas en MATLAB — ejercicios para programar tu Gauss-Jordan, un determinante recursivo y las cuentas del piso (y el sistema que fallé en el trabajo práctico 2)»
% https://sergiolearns.com/matlab-intensivo-matrices-y-sistemas-ejercicios/

A = [2 3 1; 1 2 2; 3 1 1];
b = [7.35; 7.70; 6.85];
Ab = [A b]
Ab = [A b];
R = mi_gj(Ab)
isequal(round(R, 10), round(rref(Ab), 10))
d = det_cof(A)
mi_gj(magic(4))
det_cof(magic(4))
