% Ejercicio 3: el logo y la tirolina
% Del artículo «Complejos y geometría en MATLAB — ejercicios para programar raíces n-ésimas, dibujar un logo en estrella y comprobar los cables de una tirolina (y los productos de vectores del trabajo práctico 1)»
% https://sergiolearns.com/matlab-intensivo-complejos-y-geometria-ejercicios/

w = raices(32, 5);
orden = [1 3 5 2 4 1];
e = w(orden);
plot(real(e), imag(e), 'r-')
hold on
plot(real(w), imag(w), 'bo')
axis equal
title('Estrella del logo')

w2 = w * exp(1i*pi/5);
rad2deg(angle(w2(1)))

A = [0; 0; 12]; B = [40; 30; 4];
u = B - A
norm(u)
L = [20; 10; 9];
[d, Q] = dist_recta(L, A, u)

C = [0; 30; 10]; v = [40; -30; -4];
posicion_rectas(A, u, C, v)
posicion_rectas(A, u, C + [0; 0; 1], v)
