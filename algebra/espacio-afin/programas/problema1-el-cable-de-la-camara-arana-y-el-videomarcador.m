% Problema 1: el cable de la cámara araña y el videomarcador
% Del artículo «Espacio afín — práctica guiada con la cámara araña, el balón que sube, el videomarcador y un ejercicio de examen paso a paso (y el plano que me salió perpendicular en lugar de paralelo)»
% https://sergiolearns.com/espacio-afin-practica/

A = [0 60 30];  B = [80 20 10];
u1 = (B - A)/20                       % director simplificado
n = cross([20 0 0], [0 -4 8])         % normal sin simplificar
n = n/(-80)                           % (0, 2, 1)
