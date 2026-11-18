% Modelo: complejos y geometría
% Del artículo «Complejos y geometría en MATLAB — ejercicios para programar raíces n-ésimas, dibujar un logo en estrella y comprobar los cables de una tirolina (y los productos de vectores del trabajo práctico 1)»
% https://sergiolearns.com/matlab-intensivo-complejos-y-geometria-ejercicios/

%% Complejos y geometría: plantilla
format short

%% 1. Un complejo en las dos formas
z = -2 + 2i;
modulo = abs(z), argumento_grados = rad2deg(angle(z))
w = raices(z, 3)                       % raíces cúbicas, en columna

%% 2. Rectas en el espacio (puntos y direcciones en columna)
A = [1; 0; 2]; u = [2; 1; -1];
B = [0; 1; 1]; v = [1; 1; 0];
posicion = posicion_rectas(A, u, B, v)
[d, Q] = dist_recta(B, A, u)           % distancia del punto B a la recta 1

%% 3. Ángulo entre las dos direcciones (entre 0 y 90 grados)
ang = acosd(abs(dot(u, v)) / (norm(u) * norm(v)))

%% ---- funciones (siempre al final) ----
function w = raices(z, n)
  r = abs(z)^(1/n); k = (0:n-1)';
  w = r * exp(1i*(angle(z) + 2*pi*k)/n);
end

function [d, Q] = dist_recta(P, A, u)
  t = dot(P - A, u) / dot(u, u); Q = A + t*u; d = norm(P - Q);
end

function t = posicion_rectas(A, u, B, v)
  r1 = rank([u v]); r2 = rank([u v B-A]);
  if r1 == 1 && r2 == 1, t = 'coincidentes';
  elseif r1 == 1,        t = 'paralelas';
  elseif r2 == 2,        t = 'secantes';
  else,                  t = 'se cruzan';
  end
end
