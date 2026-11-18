% Todos los ejemplos del artículo, en orden (necesita las funciones de esta carpeta)
% Del artículo «Complejos y geometría en MATLAB — teoría para girar con exp(1i*θ), programar las raíces n-ésimas y medir distancias con funciones (y el robot aspirador que siempre giraba a la izquierda)»
% https://sergiolearns.com/matlab-intensivo-complejos-y-geometria/
z = 3 + 2i                 % el robot, a 3 m de una pared y 2 m de la otra
modulo = abs(z)            % distancia a la esquina
argumento = angle(z)       % ángulo con el eje x, en radianes
grados = rad2deg(argumento)
conj(z)                    % el reflejo en el eje x

giro90 = exp(1i*pi/2)          % casi 1i: el cos(pi/2) del ordenador no es 0 exacto
z * 1i                         % z girado 90 grados
v = [1+1i; 2-1i];
v'                             % traspuesta conjugada
v.'                            % solo traspuesta

pos = 0;                   % sale de la esquina
rumbo = 1;                 % mirando al este
camino = pos;              % aquí se apunta cada parada
tramos = [4 3 4 3];        % metros hasta cada choque: el salón mide 4 x 3
for k = 1:numel(tramos)
    pos = pos + tramos(k) * rumbo;  % avanza en su dirección
    camino(end+1) = pos;
    rumbo = rumbo * 1i;              % gira 90 grados a la izquierda
end
camino

figure
plot(camino, 'o-')
axis equal
grid on
title('Recorrido del robot por el salón')
xlabel('x (m)'), ylabel('y (m)')

girar(3 + 2i, 90)                  % lo mismo que (3 + 2i)*1i
silla = [1+1i, 1.5+1i, 1.5+1.5i, 1+1.5i];
girar(silla, 90, 2 + 2i)           % la silla, alrededor del centro de la mesa

esquinas = raices_n(8, 6)
comprobacion = norm(esquinas.^6 - 8)

r2 = roots([1 0 0 0 0 0 -8]);       % coeficientes de z^6 - 8
[~, i1] = sort(angle(esquinas));
[~, i2] = sort(angle(r2));
diferencia = norm(esquinas(i1) - r2(i2))

figure
raices_n(8, 6)

robot = [3; 2];
d1 = dist_punto_recta(robot, [0; 3], [4; 0])
d2 = dist_punto_recta([1; 1; 1], [0; 0; 0], [1; 1; 0])   % también en el espacio

lampara = [1; 2; 1.6];
A = [0; 0; 2.5];  n = [0; 0.6; 0.8];
d = dist_punto_plano(lampara, A, n)
pie = lampara - dot(n, lampara - A) / dot(n, n) * n    % el punto del techo más cercano
dot(n, pie - A)                                        % ¿está en el plano?

barra = struct('A', [0; 3; 2.2], 'v', [1; 0; 0]);   % punto y dirección
viga  = struct('A', [0; 0; 2.4], 'v', [0; 1; 0]);
cable = struct('A', [1; 3; 0],   'v', [0; 0; 1]);
otra  = struct('A', [0; 0; 2.2], 'v', [2; 0; 0]);
misma = struct('A', [5; 3; 2.2], 'v', [-3; 0; 0]);
posicion_rectas(barra, viga)
posicion_rectas(barra, cable)
posicion_rectas(barra, otra)
posicion_rectas(barra, misma)

techo = [0 4 4 0 0;          % x de las esquinas del techo (cerrado)
         0 0 3 3 0;          % y
         2.5 2.5 0.25 0.25 2.5];   % z: de 2,5 m a 0,25 m, en el plano
figure
plot3(techo(1,:), techo(2,:), techo(3,:), 'b-')
hold on
plot3(lampara(1), lampara(2), lampara(3), 'ro')
plot3([lampara(1) pie(1)], [lampara(2) pie(2)], [lampara(3) pie(3)], 'r--')
plot3([0 4 4 0 0], [0 0 3 3 0], zeros(1, 5), 'k:')    % el suelo, de referencia
axis equal
grid on
xlabel('x (m)'), ylabel('y (m)'), zlabel('z (m)')
title('La lámpara y el techo inclinado')
view(120, 25)

[1 2 3] - [0; 0; 2.5]

dist_punto_plano(lampara, A, [0; 0; 0])

norm(esquinas - r2)
