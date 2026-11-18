% Script de «Pruébalo en el entorno de MATLAB» (con su función local al final)
% Del artículo «Espacios vectoriales en MATLAB — teoría para programar con bucles: bases que se eligen solas, tu propio Gram-Schmidt y la proyección como función (y la receta que no aportaba nada)»
% https://sergiolearns.com/matlab-intensivo-espacios-vectoriales/
% Recetas del piso: base ortonormal y la semana más parecida
R = [2 0 2 2; 1 3 0 4; 1 0 1 1; 0 1 1 1];
Q = gs(R);
fprintf('Dimensión del espacio de recetas: %d\n', size(Q, 2));
d = [3; 3; 2; 2];
p = Q * (Q' * d)
fprintf('Error: %.4f\n', norm(d - p));

function Q = gs(V)
Q = zeros(size(V, 1), 0);
for j = 1:size(V, 2)
    w = V(:, j);
    for k = 1:size(Q, 2)
        w = w - (Q(:, k)' * w) * Q(:, k);
    end
    if norm(w) > 1e-10
        Q(:, end+1) = w / norm(w);
    end
end
end
