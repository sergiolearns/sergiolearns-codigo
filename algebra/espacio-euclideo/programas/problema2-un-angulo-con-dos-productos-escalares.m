% Problema 2: un ángulo con dos productos escalares
% Del artículo «Espacio euclídeo — práctica guiada con gustos musicales: matriz de Gram, ángulos, bases ortonormales, Gram-Schmidt y el coseno del examen (y los decimales que se me escaparon)»
% https://sergiolearns.com/espacio-euclideo-practica/

format short
G = [2 1; 1 3]; u = [1; 0]; v = [0; 1];
c = (u' * G * v) / (sqrt(u' * G * u) * sqrt(v' * G * v))
acos(c) * 180 / pi
c2 = dot([1 2 -1], [3 0 2]) / (norm([1 2 -1]) * norm([3 0 2]))
