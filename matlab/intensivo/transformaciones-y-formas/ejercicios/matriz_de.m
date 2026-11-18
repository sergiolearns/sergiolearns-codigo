% Función matriz_de
% Del artículo «Transformaciones y formas en MATLAB — ejercicios para construir matrices por columnas, dibujar un sticker deformado y clasificar formas con Sylvester (y la traspuesta del trabajo práctico 4)»
% https://sergiolearns.com/matlab-intensivo-transformaciones-y-formas-ejercicios/

function A = matriz_de(f, n)
  % Matriz de la transformación f en la base canónica de R^n:
  % la columna j es la imagen de e_j.
  A = zeros(n);
  I = eye(n);
  for j = 1:n
    A(:, j) = f(I(:, j));
  end
end
