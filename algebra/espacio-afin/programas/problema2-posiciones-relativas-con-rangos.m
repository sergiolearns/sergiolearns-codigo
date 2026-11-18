% Problema 2: posiciones relativas con rangos
% Del artículo «Espacio afín — práctica guiada con la cámara araña, el balón que sube, el videomarcador y un ejercicio de examen paso a paso (y el plano que me salió perpendicular en lugar de paralelo)»
% https://sergiolearns.com/espacio-afin-practica/

u1 = [4 -2 -1];  u = [2 1 -1];  A = [0 60 30];  D = [10 20 30];
rank([u1; u; D - A])                          % 3: se cruzan
abs(det([u1; u; D - A]))/norm(cross(u1, u))   % distancia entre ellas
w = [0 0 1];  P = [30 30 0];
rank([u; w]), rank([u; w; P - D])             % 2 y 2: se cortan
s = [u' -w'] \ (P - D)'                       % t y mu
D + s(1)*u                                    % el punto de corte
M = [0 1 -2; 0 2 1];  b = [20; -15];
rank(M), rank([M b])                          % 2 y 2: planos secantes
