"""Parche por líneas de <viejo> a <nuevo> (sin la línea <?php), en gzip + base64, para aplicarlo en el navegador al código del fragmento.
Uso: python3 parche.py viejo.php nuevo.php > parche.b64   → imprime también el sha256 del resultado en stderr"""
import difflib, gzip, base64, json, sys, hashlib
def body(p):
    s = open(p, encoding='utf-8').read()
    return s[6:] if s.startswith('<?php\n') else s
a, b = body(sys.argv[1]), body(sys.argv[2])
A, B = a.split('\n'), b.split('\n')
ops = []
for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, A, B, autojunk=False).get_opcodes():
    if tag != 'equal':
        ops.append([i1, i2, B[j1:j2]])
z = base64.b64encode(gzip.compress(json.dumps({'ops': ops, 'old': hashlib.sha256(a.encode()).hexdigest(), 'new': hashlib.sha256(b.encode()).hexdigest()}, ensure_ascii=False).encode(), 9)).decode()
print(z)
print(len(ops), 'cambios', len(z), 'b64', hashlib.sha256(b.encode()).hexdigest()[:12], file=sys.stderr)
