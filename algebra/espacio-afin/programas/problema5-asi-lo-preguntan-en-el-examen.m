% Problema 5: así lo preguntan en el examen
% Del artículo «Espacio afín — práctica guiada con la cámara araña, el balón que sube, el videomarcador y un ejercicio de examen paso a paso (y el plano que me salió perpendicular en lugar de paralelo)»
% https://sergiolearns.com/espacio-afin-practica/

P = [2 -1 3];  Q = [4 3 -1];
M = (P + Q)/2                    % punto medio
n = Q - P                        % normal de pi (sin simplificar)
d = -dot(n/2, M)                 % término independiente con n = (1, 2, -2)
abs(15 - (-3))/norm([1 2 -2])    % distancia entre pi y sigma
t = -(dot([1 2 -2], P) + 15)/9   % s cortada con sigma
H = P + t*[1 2 -2]
2*H - P                          % simétrico de P
