% Ejercicio 3: la recta del gasto del móvil
% Del artículo «Espacios vectoriales en MATLAB — ejercicios para programar tu Gram-Schmidt, una proyección y la recta del gasto del móvil (y la base que fallé en el trabajo práctico 3)»
% https://sergiolearns.com/matlab-intensivo-espacios-vectoriales-ejercicios/

g = [12; 15; 14; 18; 20; 21];
uno = ones(6, 1); mes = (1:6)';
U = [uno mes];
rank(U), rank([U g])

[p, c] = proyecta(g, U)

r = g - p;
U' * r
all(abs(U' * r) < 1e-10)

c(1) + c(2)*7
m = 6;
while c(1) + c(2)*m <= 30
  m = m + 1;
end
m
