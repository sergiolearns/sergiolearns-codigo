% Ejercicio 2: pruebas de mi_gs
% Del artículo «Espacios vectoriales en MATLAB — ejercicios para programar tu Gram-Schmidt, una proyección y la recta del gasto del móvil (y la base que fallé en el trabajo práctico 3)»
% https://sergiolearns.com/matlab-intensivo-espacios-vectoriales-ejercicios/

Q = mi_gs([1 1 0; 1 0 1; 0 1 1])
Q' * Q
Q2 = mi_gs([1 2 0; 2 4 1; 0 0 1])
