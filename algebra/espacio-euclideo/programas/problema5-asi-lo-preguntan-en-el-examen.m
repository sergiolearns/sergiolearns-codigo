% Problema 5: así lo preguntan en el examen
% Del artículo «Espacio euclídeo — práctica guiada con gustos musicales: matriz de Gram, ángulos, bases ortonormales, Gram-Schmidt y el coseno del examen (y los decimales que se me escaparon)»
% https://sergiolearns.com/espacio-euclideo-practica/

G = [2 1 0; 1 1 0; 0 0 3]; u = [1; 0; 1]; v = [0; 1; -1];
nu = sqrt(u' * G * u), nv = sqrt(v' * G * v)
c = (u' * G * v) / (nu * nv)
acos(c) * 180 / pi
format rat
null((G * u)', 'r')     % los vectores ortogonales a u con f, en columnas
