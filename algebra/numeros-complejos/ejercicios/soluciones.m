% Soluciones de los ejercicios, comprobadas en MATLAB
% Del artículo «Números complejos — ejercicios tipo examen con la noria, un polinomio con raíz compleja, un triángulo que se vuelve hexágono y un test de 20 preguntas (y el opuesto que marqué como conjugado)»
% https://sergiolearns.com/numeros-complejos-ejercicios/

%% Ejercicio 1
z1 = 1 + 3i;  z2 = 2 - 1i;
z1*z2, z1/z2
w = -2*sqrt(3) + 2i;
abs(w), angle(w)*180/pi
%% Ejercicio 2
k = 2;
(2 + k*1i)*(1 - 1i)                 % real puro: 4
z = 1 + 2i;
z*z*z - 3*z*z + 7*z - 5             % P(1 + 2i) = 0
%% Ejercicio 3
w3 = (-1 + 1i)^6
r = 2*exp(1i*(pi/2 + 2*pi*(0:2))/3) % raíces cúbicas de 8i
h = r(1)*exp(1i*pi/3*(0:5))         % el hexágono
abs(r(1))^6, angle(r(1))*6*180/pi   % 64 a 180 grados: -64
