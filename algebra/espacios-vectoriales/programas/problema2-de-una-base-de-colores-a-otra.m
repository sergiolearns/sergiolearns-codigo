% Problema 2: de una base de colores a otra
% Del artículo «Espacios vectoriales — práctica guiada con colores: independencia, cambio de base, vectores originales y el ejercicio de subespacios del examen (y la base que no salía de rref)»
% https://sergiolearns.com/espacios-vectoriales-practica/

P = [1 0 1; 1 1 0; 0 1 1];   % columnas: amarillo, cian, magenta (B')
Q = [1 1 1; 1 1 0; 1 0 0];   % columnas: blanco, amarillo, rojo (B'')
C = inv(Q) * P               % de B' a B''
C * [2; 3; 1]
