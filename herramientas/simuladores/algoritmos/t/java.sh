# compara la salida de cada programa Java con la de su Python: t_java.sh <dir_py> <dir_java>
for f in $2/*.java; do b=$(basename $f .java); rm -rf tmpj; mkdir tmpj; cp $f tmpj/Main.java
 jo=$( (cd tmpj && javac Main.java 2>&1; java -Dstdout.encoding=UTF-8 Main 2>&1) | grep -v JAVA_TOOL ); po=$(python3 $1/$b.py)
 [ "$jo" == "$po" ] && echo "OK $b" || echo "DIF $b: [$jo] vs [$po]"; done
