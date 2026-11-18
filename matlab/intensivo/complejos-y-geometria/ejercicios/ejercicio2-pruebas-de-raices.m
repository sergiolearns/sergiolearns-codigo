% Ejercicio 2: pruebas de raices
% Del artículo «Complejos y geometría en MATLAB — ejercicios para programar raíces n-ésimas, dibujar un logo en estrella y comprobar los cables de una tirolina (y los productos de vectores del trabajo práctico 1)»
% https://sergiolearns.com/matlab-intensivo-complejos-y-geometria-ejercicios/

w = raices(32, 5)
max(abs(w.^5 - 32))
