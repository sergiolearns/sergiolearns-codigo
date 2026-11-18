% Problema 4: las raíces cúbicas de −8i
% Del artículo «Números complejos — práctica guiada con el plano de la feria, los cuatro cuadrantes, De Moivre y raíces paso a paso (y el ángulo que se me escapó de cuadrante)»
% https://sergiolearns.com/numeros-complejos-practica/

k = 0:2;
r = 2*exp(1i*(3*pi/2 + 2*pi*k)/3)    % 3*pi/2 son 270 grados
r.^3                                  % las tres al cubo
