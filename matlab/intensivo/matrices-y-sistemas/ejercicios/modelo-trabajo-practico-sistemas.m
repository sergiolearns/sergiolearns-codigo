% Modelo para los trabajos prácticos: clasificar, resolver y comprobar un sistema
% Del artículo «Matrices y sistemas en MATLAB — ejercicios para programar tu Gauss-Jordan, un determinante recursivo y las cuentas del piso (y el sistema que fallé en el trabajo práctico 2)»
% https://sergiolearns.com/matlab-intensivo-matrices-y-sistemas-ejercicios/

%% Sistema de ecuaciones: clasificar, resolver y comprobar
% Cambia A y b; el resto no se toca.
format short
A = [2 3 1; 1 2 2; 3 1 1];
b = [7.35; 7.70; 6.85];

%% 1. Clasificar con Rouché-Frobenius
tipo = tipo_sistema(A, b)

%% 2. Resolver (con la reducida, que sirve para todos los casos)
R = mi_gj([A b])

%% 3. Comprobar
if strcmp(tipo, 'compatible determinado')
  x = R(1:size(A,2), end)
  error_max = max(abs(A*x - b))
end

%% 4. Lo mismo con fracciones, para copiarlo al cuestionario
format rat
R
format short

%% ---- funciones (siempre al final) ----
function t = tipo_sistema(A, b)
  % Devuelve el tipo de sistema según los rangos.
  rA = rank(A); rAb = rank([A b]); n = size(A, 2);
  if rA < rAb
    t = 'incompatible';
  elseif rA == n
    t = 'compatible determinado';
  else
    t = 'compatible indeterminado';
  end
end

function R = mi_gj(M)
  % Gauss-Jordan con pivote parcial (copia la del ejercicio 2).
  [m, n] = size(M); fila = 1;
  for col = 1:n
    if fila > m, break; end
    [~, p] = max(abs(M(fila:m, col))); p = p + fila - 1;
    if abs(M(p, col)) < 1e-10, continue; end
    M([fila p], :) = M([p fila], :);
    M(fila, :) = M(fila, :) / M(fila, col);
    for i = 1:m
      if i ~= fila, M(i, :) = M(i, :) - M(i, col) * M(fila, :); end
    end
    fila = fila + 1;
  end
  R = M;
end
