% Función sylvester
% Del artículo «Transformaciones y formas en MATLAB — ejercicios para construir matrices por columnas, dibujar un sticker deformado y clasificar formas con Sylvester (y la traspuesta del trabajo práctico 4)»
% https://sergiolearns.com/matlab-intensivo-transformaciones-y-formas-ejercicios/

function t = sylvester(A)
  % Clasifica la forma cuadrática de la matriz simétrica A.
  n = size(A, 1);
  m = zeros(1, n);
  for k = 1:n
    m(k) = det(A(1:k, 1:k));             % menores principales
  end
  if all(m > 0)
    t = 'definida positiva';
  elseif all(m(1:2:end) < 0) && all(m(2:2:end) > 0)
    t = 'definida negativa';             % signos alternos, empezando en -
  else                                    % Sylvester no decide: autovalores
    l = eig(A);
    if all(l >= -1e-10)
      t = 'semidefinida positiva';
    elseif all(l <= 1e-10)
      t = 'semidefinida negativa';
    else
      t = 'indefinida';
    end
  end
end
