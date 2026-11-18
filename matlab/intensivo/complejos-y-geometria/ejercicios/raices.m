% Función raices
% Del artículo «Complejos y geometría en MATLAB — ejercicios para programar raíces n-ésimas, dibujar un logo en estrella y comprobar los cables de una tirolina (y los productos de vectores del trabajo práctico 1)»
% https://sergiolearns.com/matlab-intensivo-complejos-y-geometria-ejercicios/

function w = raices(z, n)
  % Las n raíces n-ésimas de z, en una COLUMNA.
  r = abs(z)^(1/n);                         % módulo común
  k = (0:n-1)';                             % k = 0, 1, ..., n-1 en columna
  w = r * exp(1i*(angle(z) + 2*pi*k)/n);    % las n a la vez
end
