% Pruébalo en el entorno de MATLAB
% Del artículo «Espacio afín — práctica guiada con la cámara araña, el balón que sube, el videomarcador y un ejercicio de examen paso a paso (y el plano que me salió perpendicular en lugar de paralelo)»
% https://sergiolearns.com/espacio-afin-practica/

% Plano respecto del cual P y Q son simétricos: a*x + b*y + c*z + d = 0
P = [2 -1 3];  Q = [4 3 -1];
n = Q - P;                    % normal
M = (P + Q)/2;                % punto medio
d = -dot(n, M);               % término independiente
plano = [n d]                 % coeficientes [a b c d]
comprobacion = dot(n, M) + d  % tiene que dar 0
