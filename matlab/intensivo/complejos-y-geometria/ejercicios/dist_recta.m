% Función dist_recta
% Del artículo «Complejos y geometría en MATLAB — ejercicios para programar raíces n-ésimas, dibujar un logo en estrella y comprobar los cables de una tirolina (y los productos de vectores del trabajo práctico 1)»
% https://sergiolearns.com/matlab-intensivo-complejos-y-geometria-ejercicios/

function [d, Q] = dist_recta(P, A, u)
  % Distancia de P a la recta A + t*u, y el punto Q de la recta más cercano.
  t = dot(P - A, u) / dot(u, u);            % proyección de AP sobre u
  Q = A + t*u;
  d = norm(P - Q);
end
