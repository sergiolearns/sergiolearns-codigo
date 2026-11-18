% Soluciones de los ejercicios, comprobadas en MATLAB
% Del artículo «Espacio afín — ejercicios tipo examen con rectas que se cruzan, el plano por tres puntos, un simétrico, una cónica y un test de 20 preguntas (y el ángulo que me salió de 66° en lugar de 24°)»
% https://sergiolearns.com/espacio-afin-ejercicios/

%% Ejercicio 1
A = [1 0 2];  B = [3 4 0];  C = [0 1 1];
n = cross(B - A, C - A)          % normal sin simplificar: (-2, 4, 6)
d = -dot(n, A)                   % -2x + 4y + 6z - 10 = 0
rank([n; 2 -4 -6])               % 1: normales proporcionales
%% Ejercicio 2
P = [2 -2 -1];  n = [1 -2 -3];
t = -(dot(n, P) + 5)/dot(n, n)
H = P + t*n
2*H - P                          % simétrico
acos(3/norm(n))*180/pi           % ángulo con z = 0
%% Ejercicio 3
u = [2 1 -2];  v = cross([1 1 -1], [1 -1 2])
P = [1 -1 0];  Q = [2 0 1];
rank([u; v; Q - P])              % 3: se cruzan
w = cross(u, v)
abs(det([u; v; Q - P]))/norm(w)  % distancia entre r y s
asin(2/norm(v))*180/pi           % ángulo de s con z = 0
