% Función det_cof
% Del artículo «Matrices y sistemas en MATLAB — ejercicios para programar tu Gauss-Jordan, un determinante recursivo y las cuentas del piso (y el sistema que fallé en el trabajo práctico 2)»
% https://sergiolearns.com/matlab-intensivo-matrices-y-sistemas-ejercicios/

function d = det_cof(A)
  % Determinante por cofactores de la primera fila (recursivo).
  n = size(A, 1);
  if n == 1
    d = A;                                % caso base: el único número
    return
  end
  d = 0;
  for j = 1:n
    menor = A(2:end, [1:j-1, j+1:end]);   % quito la fila 1 y la columna j
    d = d + (-1)^(1+j) * A(1,j) * det_cof(menor);
  end
end
