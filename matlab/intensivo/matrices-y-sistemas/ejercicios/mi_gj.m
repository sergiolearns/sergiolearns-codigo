% Función mi_gj
% Del artículo «Matrices y sistemas en MATLAB — ejercicios para programar tu Gauss-Jordan, un determinante recursivo y las cuentas del piso (y el sistema que fallé en el trabajo práctico 2)»
% https://sergiolearns.com/matlab-intensivo-matrices-y-sistemas-ejercicios/

function R = mi_gj(M)
  % Lleva M a su forma escalonada reducida (Gauss-Jordan con pivote parcial).
  [m, n] = size(M);
  fila = 1;                               % fila donde va el siguiente pivote
  for col = 1:n
    if fila > m, break; end               % ya no quedan filas
    [~, p] = max(abs(M(fila:m, col)));    % el más grande en valor absoluto...
    p = p + fila - 1;                     % ...contado desde la fila 1
    if abs(M(p, col)) < 1e-10
      continue                            % columna sin pivote: no avanzo de fila
    end
    M([fila p], :) = M([p fila], :);      % F_fila <-> F_p
    M(fila, :) = M(fila, :) / M(fila, col);   % pivote = 1
    for i = 1:m
      if i ~= fila                        % ceros encima y debajo, no en su fila
        M(i, :) = M(i, :) - M(i, col) * M(fila, :);
      end
    end
    fila = fila + 1;
  end
  R = M;
end
