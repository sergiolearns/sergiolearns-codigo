% Pruébalo en el entorno de MATLAB
% Del artículo «Números complejos — práctica guiada con el plano de la feria, los cuatro cuadrantes, De Moivre y raíces paso a paso (y el ángulo que se me escapó de cuadrante)»
% https://sergiolearns.com/numeros-complejos-practica/

% Raíces n-ésimas de w
w = -16;                  % el número
n = 4;                    % cuántas raíces
R = abs(w)^(1/n);         % módulo común
a = angle(w);             % argumento de w, en radianes
raices = R*exp(1i*(a + 2*pi*(0:n-1))/n)
comprobacion = raices.^n
