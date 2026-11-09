# Motor Java del probador de expresiones regulares

`java.util.regex` de **OpenJDK 21** (jdk21u), aplanado en una sola unidad de compilación (`SlRegex.java`) para compilarlo con el javac + TeaVM del entorno (`@live-codes/java-wasm` 0.1.0), que solo acepta un `Main.java` en el paquete por defecto.

## Por qué no se usa el regex que trae TeaVM

TeaVM trae el regex de Apache Harmony. Comprobado el 9 nov 2026 con el mismo paquete que usa el entorno (Chromium, `t/run_teavm.py`) frente a OpenJDK 21:

- **Da resultados falsos sin avisar.** Un grupo repetido `{n}` con un `\d{1,3}` dentro falla en cuanto un trozo tiene más de una cifra: `\d{1,3}(?:\.\d{1,3}){3}` **no** casa con `192.168.1.20` (`t/FalloTeaVM.java`). Por eso `ResumenLog` (ejercicios de Expresiones regulares en Java) da 3 líneas válidas en lugar de 6.
- En la batería aleatoria (`t/fuzz.py`), **60 de 300 casos distintos** del JDK y **4 de 10 trozos de 50 casos colgados** más de 40 s.
- Le faltan `\k<nombre>`, `${nombre}` en el reemplazo, `(?U)`, `(?x)` en línea, `\h`, `\R`, `\X`, `\p{IsAlphabetic}`, `\p{IsUppercase}`, `Matcher.replaceAll(Function)` (Java 9; lo usan `FechasIso` y `LimpiadorTexto`, que no compilan), `Pattern.splitAsStream` y `asPredicate`.
- Sus `PatternSyntaxException` no traen descripción («3, (ab,») en lugar de «Unclosed group near index 3».

## Con `SlRegex.java`

- **1500 de 1500 casos aleatorios iguales a OpenJDK 21**: posiciones de cada grupo, `matches`, `find`, `replaceAll` con `$0`, `split` y los errores de sintaxis con su descripción e índice. Los seis programas del repositorio (`java/expresiones-regulares`) dan la misma salida que el JDK.
- Coste: unos **0,8 s más de compilación** (javac pasa de ~0,1 s a ~0,9 s; TeaVM tarda lo mismo, ~2,5 s). 182 KB sin comentarios, **28 KB comprimido**.
- **No disponible** (da `PatternSyntaxException` o `UnsupportedOperationException` con `SL_NO_DISPONIBLE`, nunca un resultado falso): `\N{nombre}`, escrituras `\p{IsLatin}`, bloques `\p{InGreek}` (TeaVM no trae `Character.UnicodeScript`/`UnicodeBlock.forName`), `\p{IsIdeographic}`, `\p{IsMirrored}`, las de emoji y `CANON_EQ`.
- **Ojo:** `String.matches`, `split`, `replaceAll` y `replaceFirst` siguen yendo por el regex de TeaVM (son de `java.lang.String`, dentro de la biblioteca). El probador genera su código con `Pattern`/`Matcher`, así que no le afecta.

## Uso

El código del lector va **detrás** de `SlRegex.java`, con sus `import` arriba y sin los `import java.util.regex.…` (una importación de `java.util.regex.Pattern` choca con la clase `Pattern` de la unidad). Ver `t/envuelve.sh`.

## Regenerar

```
bash fuentes.sh      # baja las fuentes de jdk21u (raw.githubusercontent.com) y las pasa al paquete slre
python3 aplana.py    # escribe SlRegex.java (aplana, parchea para TeaVM y quita comentarios)
```

## Pruebas (en una carpeta con `node_modules/@live-codes/java-wasm` 0.1.0 copiado a `www/jw/` y `t/index.html` en `www/`)

```
python3 t/run_teavm.py <Programa.java>                     # con el regex de TeaVM
python3 t/run_teavm.py $(bash t/envuelve.sh <Programa.java>) # con SlRegex
python3 t/fuzz.py <semilla> 500 > F.java                    # batería aleatoria; comparar con javac + java -Dstdout.encoding=UTF-8
```

## Licencia

Las fuentes son de OpenJDK, **GPLv2 con la Classpath Exception** (`LICENCIA-OPENJDK.txt`, también al principio de `SlRegex.java`). Esta carpeta conserva el aviso y el código modificado completo.
