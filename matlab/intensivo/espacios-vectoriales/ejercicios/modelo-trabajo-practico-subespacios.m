% Modelo para el trabajo práctico 3: subespacios y producto escalar
% Del artículo «Espacios vectoriales en MATLAB — ejercicios para programar tu Gram-Schmidt, una proyección y la recta del gasto del móvil (y la base que fallé en el trabajo práctico 3)»
% https://sergiolearns.com/matlab-intensivo-espacios-vectoriales-ejercicios/

%% Subespacios y producto escalar: plantilla para el trabajo práctico 3
format short
A  = [1 2 -1 1; 3 -1 2 -2];   % implícitas de U (una fila por ecuación)
S1 = [1 0; 2 1; 0 1; 1 1];    % generadores de U1 (en columnas)
S2 = [1 0; 3 1; 1 1; 2 0];    % generadores de U2 (en columnas)
G  = [2 1 0; 1 2 0; 0 0 1];   % matriz de Gram de un producto escalar en R^3

%% 1. Base de U desde sus implícitas (con fracciones)
format rat
BU = null(A, 'r')
format short

%% 2. Base de U1 + U2 con vectores originales
BS = base_original([S1 S2])

%% 3. Coseno y ángulo con la matriz de Gram
[co, ang] = angulo([1; 0; 1], [0; 1; 1], G)

%% ---- funciones (siempre al final) ----
function B = base_original(S)
  % Columnas de S que forman base del subespacio que generan:
  % las que llevan pivote en la escalonada reducida.
  [~, piv] = rref(S);
  B = S(:, piv);
end

function [co, ang] = angulo(u, v, G)
  % Coseno y ángulo (en grados) entre u y v con el producto escalar u'*G*v.
  co  = (u' * G * v) / (sqrt(u' * G * u) * sqrt(v' * G * v));
  ang = acosd(co);
end
