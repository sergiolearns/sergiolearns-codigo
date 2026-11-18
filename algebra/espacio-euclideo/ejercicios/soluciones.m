% Comprobación en MATLAB de las soluciones de los ejercicios tipo examen
% Del artículo «Espacio euclídeo — ejercicios tipo examen con gustos musicales: módulos, cosenos, matriz de Gram, Gram-Schmidt y un test como el del Campus (y la forma que marqué de más)»
% https://sergiolearns.com/espacio-euclideo-ejercicios/

format short
%% Ejercicio 1
m = [1 2 2 4]; j = [2 0 1 2]; k = [0 3 0 0];
c = dot(m, j) / (norm(m) * norm(j))
acos(c) * 180 / pi
dot(j, k)
format rat
p = dot(m, j) / dot(j, j) * j
%% Ejercicio 2
G = [1 -1; -1 3]; C = [1 1; 1 0];
C' * G * C                            % G' en la base B'

%% Ejercicio 3
v = [1; 2; 3]; u1 = [1; 0; 1]; w2 = [1; 1; 0];
u2 = w2 - dot(w2, u1) / dot(u1, u1) * u1
p = dot(v, u1) / dot(u1, u1) * u1 + dot(v, u2) / dot(u2, u2) * u2
format short
norm(v - p)                           % la distancia
cross([1 0 1], [1 1 0])
det([1 0 1; 1 1 0; 1 2 3])            % el volumen
