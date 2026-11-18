% Función mi_gs
% Del artículo «Espacios vectoriales en MATLAB — ejercicios para programar tu Gram-Schmidt, una proyección y la recta del gasto del móvil (y la base que fallé en el trabajo práctico 3)»
% https://sergiolearns.com/matlab-intensivo-espacios-vectoriales-ejercicios/

function Q = mi_gs(V)
  % Gram-Schmidt: base ortonormal (en columnas) del subespacio de las columnas de V.
  Q = zeros(size(V, 1), 0);              % empieza sin columnas
  for j = 1:size(V, 2)
    w = V(:, j);
    for k = 1:size(Q, 2)
      w = w - dot(w, Q(:, k)) * Q(:, k);  % le quito su parte en cada q ya hecha
    end
    if norm(w) < 1e-10                    % casi cero: dependía de las anteriores
      fprintf('La columna %d depende de las anteriores: la salto.\n', j);
      continue
    end
    Q = [Q, w / norm(w)];                 % la normalizo y la añado
  end
end
