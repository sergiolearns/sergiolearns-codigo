#!/bin/bash
# Compila el núcleo de SPIM (S20, v9.1.20, James R. Larus, licencia BSD) a WebAssembly para el entorno MIPS de SergioLearns.
# Necesita: git, bison, flex, clang 18 con wasm32-wasi (Ubuntu 24.04: apt install clang lld-18 wasi-libc libc++-18-dev-wasm32 libc++abi-18-dev-wasm32 libclang-rt-18-dev-wasm32).
# Fuente del núcleo: la copia de SPIM 9.1.20 de https://github.com/ShawnZhong/JsSpim (carpeta spim/CPU, cabeceras BSD intactas).
set -e
D=$(cd "$(dirname "$0")" && pwd); W=${W:-/tmp/sl-spim-build}
rm -rf "$W"; mkdir -p "$W"; cd "$W"
git clone -q --depth 1 https://github.com/ShawnZhong/JsSpim src
cp src/spim/CPU/* . ; cp "$D/sl-spim.cpp" .
bison -d --defines=parser_yacc.h --output=parser_yacc.cpp -p yy parser.y
flex -I -8 -o lex.yy.cpp scanner.l          # -8: los caracteres no ASCII (tildes) ya no cuelgan el escáner
python3 "$D/patch.py"
CXX="clang++ --target=wasm32-wasi --sysroot=/usr -isystem /usr/include/wasm32-wasi/c++/v1 -isystem /usr/include/wasm32-wasi"
FL="-O2 -fno-exceptions -I. -DTEXT_SIZE=65536 -DDATA_SIZE=131072 -DK_TEXT_SIZE=65536 -DDEFAULT_EXCEPTION_HANDLER=\"\\\"@exc\\\"\" -Wno-everything -x c++ -std=c++11"
mkdir -p o
for f in sl-spim spim-utils run mem inst data sym-tbl parser_yacc lex.yy syscall display-utils string-stream; do $CXX $FL -c $f.cpp -o o/$f.o; done
clang++ --target=wasm32-wasi --sysroot=/usr -L/usr/lib/wasm32-wasi -nostartfiles /usr/lib/wasm32-wasi/crt1-reactor.o o/*.o -lc++ -lc++abi -lc \
  -Wl,--no-entry -Wl,--export=_initialize -Wl,--export-memory -Wl,-z,stack-size=1048576 -Wl,--strip-all -O2 -o "$D/../sl-spim.wasm"
ls -la "$D/../sl-spim.wasm"
