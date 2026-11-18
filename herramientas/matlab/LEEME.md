# sl-matlab — intérprete de MATLAB en el navegador

Intérprete propio (subconjunto de MATLAB para Álgebra y Geometría) que usa el entorno `/entornos/matlab/` de sergiolearns.com.

- `parse.js`, `interp.js`, `mat.js`, `la.js`, `sym.js`, `builtins.js`, `fmt.js`: analizador, intérprete, matrices, álgebra lineal (rref, rank, det, inv, null, eig), cálculo simbólico mínimo (syms, solve, simplify) y formato de salida idéntico al de MATLAB R2025a.
- `build.js` junta todo en `slmat.js` (lo que se sube a la web).
- `t1.js`–`t3.js`, `cmp.js`, `cases.json`, `gen.py`: pruebas; `pruebas-r2025a/` guarda los scripts y las salidas reales sacadas del MATLAB R2025a de Sergio, con las que se comparan.

- 18 nov 2026 (tanda 4 de AG): complejos reforzados. `z^n` con n entero exacto (`1i^2 = -1`), `polyval` con complejos, `format rat` con complejos, complejos sueltos muy grandes o muy pequeños en notación científica, `sin`/`cos`/`tan`/`asin`/`acos`/`atan`/`log10`/`log2`/`round`/`floor`/`ceil`/`fix`/`sign` con complejos, y funciones nuevas: `rad2deg`, `deg2rad`, `nthroot`, `cart2pol`, `pol2cart`, `conv`, `deconv`, `acosd`, `asind` y `atan2d` (`compass` y `polarplot` avisan como `plot`). Pruebas en `t4.js`.
