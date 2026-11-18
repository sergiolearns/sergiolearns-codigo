% Problema 3: distancias, ángulos, proyección y simétrico
% Del artículo «Espacio afín — práctica guiada con la cámara araña, el balón que sube, el videomarcador y un ejercicio de examen paso a paso (y el plano que me salió perpendicular en lugar de paralelo)»
% https://sergiolearns.com/espacio-afin-practica/

F = [50 4 7];  n = [0 2 1];
d = abs(dot(n, F) + 15)/norm(n)       % distancia al plano
t = -(dot(n, F) + 15)/dot(n, n)       % parámetro de la proyección
H = F + t*n
Fs = 2*H - F                          % simétrico
C = [50 30 0];  A = [0 60 30];  u1 = [4 -2 -1];
norm(cross(C - A, u1))/norm(u1)       % distancia punto-recta
asin(1/norm(u1))*180/pi               % cable con el campo
acos(abs(dot(u1, [2 1 -1]))/(norm(u1)*norm([2 1 -1])))*180/pi
