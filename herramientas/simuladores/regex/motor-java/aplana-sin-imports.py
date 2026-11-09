# SlRegex.java sin import (nombres completos): para añadirlo al FINAL del código del lector sin mover sus líneas
import re, sys
s = open(sys.argv[1], encoding='utf-8').read()
imps = re.findall(r'^import ([\w.]+);\n', s, flags=re.M)
s = re.sub(r'^import [\w.]+;\n', '', s, flags=re.M)
lic_end = s.index('*/', s.index('/* SergioLearns')) + 2
head, body = s[:lic_end], s[lic_end:]
full = {i.rsplit('.', 1)[1]: i for i in imps}
# 'Form' viene de java.text.Normalizer.Form y ya no se usa
for short, q in sorted(full.items(), key=lambda x: -len(x[0])):
    body = re.sub(r'(?<![\w.$"])' + short + r'\b(?!\s*")', q, body)
open(sys.argv[2], 'w', encoding='utf-8').write(head + body)
print(sorted(full))
