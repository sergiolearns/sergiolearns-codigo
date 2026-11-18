% Problema 4: Gram-Schmidt y una proyección
% Del artículo «Espacio euclídeo — práctica guiada con gustos musicales: matriz de Gram, ángulos, bases ortonormales, Gram-Schmidt y el coseno del examen (y los decimales que se me escaparon)»
% https://sergiolearns.com/espacio-euclideo-practica/

format rat
W = [1 1 1; 1 2 0]';                                 % w1 y w2 en columnas
u1 = W(:,1); u2 = W(:,2) - dot(W(:,2), u1) / dot(u1, u1) * u1
s = [2; 1; 2];
p = dot(s, u1) / dot(u1, u1) * u1 + dot(s, u2) / dot(u2, u2) * u2
r = s - p
format short
norm(r)
