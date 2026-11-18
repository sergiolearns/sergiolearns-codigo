% Función posicion_rectas
% Del artículo «Complejos y geometría en MATLAB — ejercicios para programar raíces n-ésimas, dibujar un logo en estrella y comprobar los cables de una tirolina (y los productos de vectores del trabajo práctico 1)»
% https://sergiolearns.com/matlab-intensivo-complejos-y-geometria-ejercicios/

function t = posicion_rectas(A, u, B, v)
  % Posición relativa de las rectas A + s*u y B + t*v (todo en columnas).
  r1 = rank([u v]);                         % ¿direcciones proporcionales?
  r2 = rank([u v B-A]);                     % ¿en un mismo plano?
  if r1 == 1 && r2 == 1
    t = 'coincidentes';
  elseif r1 == 1
    t = 'paralelas';
  elseif r2 == 2
    t = 'secantes';
  else
    t = 'se cruzan';
  end
end
