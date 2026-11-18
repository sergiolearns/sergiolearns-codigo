% Problema 4: un movimiento y dos cónicas
% Del artículo «Espacio afín — práctica guiada con la cámara araña, el balón que sube, el videomarcador y un ejercicio de examen paso a paso (y el plano que me salió perpendicular en lugar de paralelo)»
% https://sergiolearns.com/espacio-afin-practica/

R = [-1 0 100; 0 -1 60; 0 0 1];
R*[20; 10; 1]              % el jugador cambia de campo
R*[50; 30; 1]              % el centro no se mueve
M = [1 0; 0 -4];  det(M)   % bloque de la cónica: negativo, hipérbola
