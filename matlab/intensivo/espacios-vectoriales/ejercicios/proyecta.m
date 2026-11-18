% Función proyecta
% Del artículo «Espacios vectoriales en MATLAB — ejercicios para programar tu Gram-Schmidt, una proyección y la recta del gasto del móvil (y la base que fallé en el trabajo práctico 3)»
% https://sergiolearns.com/matlab-intensivo-espacios-vectoriales-ejercicios/

function [p, c] = proyecta(v, U)
  % Proyección ortogonal de v sobre el subespacio de las columnas de U,
  % y sus coeficientes en esas columnas.
  Q = mi_gs(U);
  p = Q * (Q' * v);                       % suma de <v, q_k> q_k
  c = U \ p;                              % p sí está en el subespacio: solución exacta
end
