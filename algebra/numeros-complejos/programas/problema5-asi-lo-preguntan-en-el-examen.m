% Problema 5: así lo preguntan en el examen
% Del artículo «Números complejos — práctica guiada con el plano de la feria, los cuatro cuadrantes, De Moivre y raíces paso a paso (y el ángulo que se me escapó de cuadrante)»
% https://sergiolearns.com/numeros-complejos-practica/

k = 3;
A = (k + 3i)/(1 - 1i)              % imaginario puro
B = A*A - 7                        % A^2 - 7
n = 0:3;
v = 2*exp(1i*(pi + 2*pi*n)/4)      % las cuatro raíces
abs(v(1) - v(2))                   % el lado del cuadrado
