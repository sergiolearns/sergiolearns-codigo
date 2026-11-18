% Problema 2: cuatro puntos, cuatro cuadrantes
% Del artículo «Números complejos — práctica guiada con el plano de la feria, los cuatro cuadrantes, De Moivre y raíces paso a paso (y el ángulo que se me escapó de cuadrante)»
% https://sergiolearns.com/numeros-complejos-practica/

z = [-sqrt(3)+1i, -2-2i, 3-3*sqrt(3)*1i, -5i];
R = abs(z)
grados = mod(angle(z)*180/pi, 360)    % de 0 a 360, como en los apuntes
w = [4*exp(1i*240*pi/180), 6*exp(1i*135*pi/180)]
