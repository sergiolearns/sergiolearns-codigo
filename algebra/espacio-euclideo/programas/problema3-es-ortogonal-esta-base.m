% Problema 3: ¿es ortogonal esta base?
% Del artículo «Espacio euclídeo — práctica guiada con gustos musicales: matriz de Gram, ángulos, bases ortonormales, Gram-Schmidt y el coseno del examen (y los decimales que se me escaparon)»
% https://sergiolearns.com/espacio-euclideo-practica/

G = [2 1 0; 1 2 0; 0 0 1];
S = [1 -1 0; 1 1 0; 0 0 1];    % los vectores de S en filas
S * G * S'                     % su matriz de Gram: diagonal
