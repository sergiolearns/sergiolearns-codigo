% Ejercicio 3: las cuentas del piso, mes completo
% Del artículo «Matrices y sistemas en MATLAB — ejercicios para programar tu Gauss-Jordan, un determinante recursivo y las cuentas del piso (y el sistema que fallé en el trabajo práctico 2)»
% https://sergiolearns.com/matlab-intensivo-matrices-y-sistemas-ejercicios/

A = [2 3 1; 1 2 2; 3 1 1];
b = [7.35; 7.70; 6.85];
Ab = [A b]
Ab([1 2], :) = Ab([2 1], :)
Ab(2,:) = Ab(2,:) - 2*Ab(1,:)
Ab(3,:) = Ab(3,:) - 3*Ab(1,:)

A = [A; 5 4 2];
b = [b; 14.20];
rank(A), rank([A b])

R = mi_gj([A b])

A(1,:) + A(3,:) - A(4,:), b(1) + b(3) - b(4)

x = R(1:3, end);
max(abs(A*x - b))

for k = 0:5
  A3 = [A(1:2,:); k 5 3];               % Ana, Bruno y el ticket nuevo
  b3 = [b(1:2); 15.50];
  rA = rank(A3); rAb = rank([A3 b3]);
  if rA < rAb
    tipo = 'incompatible';
  elseif rA == size(A3, 2)
    tipo = 'compatible determinado';
  else
    tipo = 'compatible indeterminado';
  end
  fprintf('k = %d: rg(A) = %d, rg(A|b) = %d -> %s\n', k, rA, rAb, tipo);
end
