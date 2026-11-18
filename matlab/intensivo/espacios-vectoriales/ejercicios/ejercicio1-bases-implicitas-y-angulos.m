% Ejercicio 1: bases, implícitas y ángulos
% Del artículo «Espacios vectoriales en MATLAB — ejercicios para programar tu Gram-Schmidt, una proyección y la recta del gasto del móvil (y la base que fallé en el trabajo práctico 3)»
% https://sergiolearns.com/matlab-intensivo-espacios-vectoriales-ejercicios/

A = [1 2 -1 1; 3 -1 2 -2];
B = null(A, 'r')
format rat
B
format short
A * B

u = [1 2 2]; v = [2 0 1];
co = dot(u, v) / (norm(u) * norm(v))
ang = acosd(co)

dot([0.1 0.2 0.3], [3 0 -1]) == 0
