#!/bin/bash
# Baja las fuentes de java.util.regex de OpenJDK 21 (jdk21u) a src/ y slre/
set -e; cd "$(dirname "$0")"
B=https://raw.githubusercontent.com/openjdk/jdk21u/master/src/java.base/share/classes
for f in Pattern Matcher MatchResult PatternSyntaxException ASCII CharPredicates IntHashSet; do
  mkdir -p src/java/util/regex; curl -sSf -o src/java/util/regex/$f.java $B/java/util/regex/$f.java; done
curl -sSf -o Grapheme.java $B/jdk/internal/util/regex/Grapheme.java
sed -n 1,25p src/java/util/regex/Pattern.java > LICENCIA-OPENJDK.txt
rm -rf slre; mkdir slre
for f in src/java/util/regex/*.java Grapheme.java; do n=$(basename $f)
  sed -e 's/^package java\.util\.regex;/package slre;/' -e 's/^package jdk\.internal\.util\.regex;/package slre;/' \
      -e 's/java\.util\.regex\./slre./g' -e '/^import jdk\.internal\.util\.regex\.Grapheme;/d' -e '/^import jdk\.internal\.util\.ArraysSupport;/d' $f > slre/$n; done
python3 - <<'P'
p='slre/Pattern.java'; s=open(p).read()
s=s.replace("""            len = ArraysSupport.newLength(len,
                    1 + index - len, /* minimum growth */
                    len              /* preferred growth */);""","""            len = len + Math.max(1 + index - len, len);""")
s=s.replace("return sun.text.Normalizer.getCombiningClass(c);","return 0; // SL: CANON_EQ sin clases de combinación")
open(p,'w').write(s)
g='slre/Grapheme.java'; s=open(g).read().replace('Character.isExtendedPictographic(cp)','false'); open(g,'w').write(s)
P
echo "Fuentes listas. Ahora: python3 aplana.py"
