% Todos los ejemplos del artículo, en orden (necesita las funciones de esta carpeta)
% Del artículo «Espacios vectoriales en MATLAB — teoría para programar con bucles: bases que se eligen solas, tu propio Gram-Schmidt y la proyección como función (y la receta que no aportaba nada)»
% https://sergiolearns.com/matlab-intensivo-espacios-vectoriales/
R = [2 0 2 2; 1 3 0 4; 1 0 1 1; 0 1 1 1];   % las recetas, por columnas
for j = 1:size(R, 2)
    fprintf('Receta %d: %d raciones en total\n', j, sum(R(:, j)));
end

caras = [];                       % aquí irán las recetas de más de 6 raciones
for j = 1:size(R, 2)
    if sum(R(:, j)) > 6
        caras(end+1) = j;         % crece una posición
    end
end
caras

despensa = [10; 6; 5; 3];         % raciones que quedan: arroz, huevo, tomate, queso
r2 = R(:, 2);                     % la tortilla con queso
alcanza = despensa >= r2          % ¿hay bastante de cada ingrediente?
if all(alcanza)
    disp('Hay para una tortilla con queso')
else
    disp('Falta algo')
end

elegidas = false(1, 4);           % ninguna, para empezar
elegidas([1 3]) = true;           % la cubana y el arroz con tomate
R(:, elegidas)

quedan = despensa;
r1 = R(:, 1);
veces = 0;
while all(quedan >= r1)           % mientras alcance cada ingrediente
    quedan = quedan - r1;
    veces = veces + 1;
end
veces
quedan'

0.1 + 0.2 == 0.3
abs((0.1 + 0.2) - 0.3) < 1e-12

rank(R(:, 1))
rank(R(:, [1 2]))
rank(R(:, [1 2 3]))
rank(R)

[B, cuales] = base_de(R)
dimension = size(B, 2)

[~, pivotes] = rref(R)
relacion = null(R, 'r')
norm(R * relacion)

Q = zeros(4, 0);
for j = 1:4
    w = R(:, j);
    for k = 1:size(Q, 2)
        w = w - (Q(:, k)' * w) * Q(:, k);   % quita la parte en la dirección de q_k
    end
    fprintf('Vuelta %d: norma de w = %.4g\n', j, norm(w));
    if norm(w) < 1e-10
        continue                           % depende de las anteriores: fuera
    end
    Q(:, end+1) = w / norm(w);
end

Q = gram_schmidt(R)
ortonormal = norm(Q' * Q - eye(size(Q, 2)))

O = orth(R);
size(O, 2)                         % también 3 vectores
norm(Q * (Q' * O) - O)             % proyectar O sobre el espacio de Q no lo cambia

d = [3; 3; 2; 2];
[p, c] = proyectar(d, B)
error_dieta = norm(d - p)
perpendicular = norm(B' * (d - p))

c2 = B \ d
diferencia = norm(B*c2 - p)

[2 1 1 0] + [2; 1; 1; 0]

Q(:, 1)' * Q(:, 2) == 0
abs(Q(:, 1)' * Q(:, 2)) < 1e-10
