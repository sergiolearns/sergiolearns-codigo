% Modelo para el trabajo práctico 4: transformación lineal
% Del artículo «Transformaciones y formas en MATLAB — ejercicios para construir matrices por columnas, dibujar un sticker deformado y clasificar formas con Sylvester (y la traspuesta del trabajo práctico 4)»
% https://sergiolearns.com/matlab-intensivo-transformaciones-y-formas-ejercicios/

%% Transformación lineal: plantilla para el trabajo práctico 4
format short
f  = @(v) [2*v(1) + v(2); v(2) + v(3); 3*v(3)];   % R^3 -> R^3
Bv = [1 0 1; 1 1 0; 0 1 1];   % base nueva (en columnas)

%% 1. Matriz en la canónica, por columnas
A = matriz_de(f, 3)

%% 2. Matriz en la base nueva: A' = Bv^(-1) * A * Bv
format rat
An = Bv \ A * Bv
format short

%% 3. Núcleo e imagen
nucleo = null(A, 'r')
r = rank(A)

%% 4. Autovalores de menor a mayor, con sus autovectores en ese orden
[P, D] = eig(A);
[l, orden] = sort(real(diag(D)));
l
P = P(:, orden)

%% ---- funciones (siempre al final) ----
function A = matriz_de(f, n)
  A = zeros(n); I = eye(n);
  for j = 1:n
    A(:, j) = f(I(:, j));        % imagen de e_j en la columna j
  end
end
