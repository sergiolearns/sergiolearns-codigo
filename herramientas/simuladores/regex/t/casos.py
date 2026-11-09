# Casos del probador: (expresión, flags Java, reemplazo, texto, retos)
import random, sys
sys.path.insert(0, '/home/claude/jw'); 
CASOS = [
 (r"\d{1,3}(?:\.\d{1,3}){3}", 0, "<IP>", "desde 192.168.1.20 y 10.0.0.7 a las 9", ["192.168.1.20", "1.2.3", "999.1.1.1"]),
 (r"(?<dia>\d{2})/(?<mes>\d{2})/(?<anio>\d{4})", 0, "${anio}-${mes}-${dia}", "Entrega 07/03/2027, examen 15/01/2027.", ["07/03/2027", "7/3/2027"]),
 (r"\b[A-Z]{3}\b", 2, "[$0]", "abc DEF ghij Kl", ["ABC", "abcd"]),
 (r"^\w+$", 8, None, "uno\ndos tres\ncuatro", ["hola", "ho la"]),
 (r"a.b", 32, "X", "a\nb acb", ["a\nb"]),
 (r"(\w+)@(\w+)\.(es|com)", 0, "$1 en $2", "ana@ulpgc.es, luis@mail.com; x@y", ["a@b.es"]),
 (r"(a)|(b)", 0, "<$1|$2>", "abc", ["a", "ab"]),
 (r"", 0, "-", "abc", ["", "a"]),
 (r"\s*,\s*", 0, None, "a , b,c ,, d", []),
 (r"(\d+)(?=€)", 0, "$1 euros", "Cuesta 45€ y 3 €", ["45€"]),
 (r"(?<!\d)\d{4}(?!\d)", 0, "####", "12345 2027 99 1234", ["2027"]),
 (r"[\d", 0, None, "x", []),
 (r"(ab", 0, None, "x", []),
 (r"*a", 0, None, "x", []),
 (r"(\w)\1", 0, "<$1>", "aabbcd ee", ["aa", "ab"]),
 (r"\d{8}[A-HJ-NP-TV-Z]", 0, "DNI", "Mi DNI es 12345678Z y no 12345678I", ["12345678Z", "12345678I"]),
 (r"(\d+)", 0, "$2", "a1", []),
 (r"ñ+", 66, "N", "ÑñÑ y ñ", ["ÑÑ"]),
 (r"x*", 0, "-", "axxb", []),
 (r"(?i)hola", 0, "adiós", "HoLa hola HOLA", ["HOLA"]),
]
