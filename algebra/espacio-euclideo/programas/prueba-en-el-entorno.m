% Prueba en el entorno de MATLAB
% Del artículo «Espacio euclídeo — práctica guiada con gustos musicales: matriz de Gram, ángulos, bases ortonormales, Gram-Schmidt y el coseno del examen (y los decimales que se me escaparon)»
% https://sergiolearns.com/espacio-euclideo-practica/

G = [2 1 0; 1 1 0; 0 0 3];          % cambia aquí el producto escalar
u = [1; 0; 1]; v = [0; 1; -1];      % y aquí los vectores (en columnas)
pe = u' * G * v;
nu = sqrt(u' * G * u); nv = sqrt(v' * G * v);
fprintf('u·v = %g, |u| = %.4f, |v| = %.4f, cos = %.4f\n', pe, nu, nv, pe / (nu * nv))
