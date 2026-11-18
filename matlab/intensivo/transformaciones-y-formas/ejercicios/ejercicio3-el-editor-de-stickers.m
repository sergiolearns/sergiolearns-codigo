% Ejercicio 3: el editor de stickers
% Del artículo «Transformaciones y formas en MATLAB — ejercicios para construir matrices por columnas, dibujar un sticker deformado y clasificar formas con Sylvester (y la traspuesta del trabajo práctico 4)»
% https://sergiolearns.com/matlab-intensivo-transformaciones-y-formas-ejercicios/

f = @(v) [2*v(1) + v(2); v(1) + 2*v(2)];
A = matriz_de(f, 2)
det(A)

cas = [0 2 2 1 0 0; 0 0 2 3 2 0];
N = A * cas;
fill(N(1,:), N(2,:), 'r')
hold on
plot(cas(1,:), cas(2,:), 'k--')
axis equal
title('Inclinar y estirar')

[P, D] = eig(A)
norm(A*P - P*D)
A^5
P * D^5 / P

sylvester(A - eye(2))
null(A - eye(2), 'r')
