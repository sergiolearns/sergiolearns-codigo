import java.util.regex.*;
public class Main {
  static void c(String re, String s){ try{ System.out.println(re+" | "+s+" -> "+Pattern.compile(re).matcher(s).matches()); }catch(Throwable e){ System.out.println(re+" | "+s+" -> EXC "+e.getClass().getSimpleName()); } }
  static void r(String re, String s, String rep){ try{ System.out.println(re+" => "+s.replaceAll(re,rep)); }catch(Throwable e){ System.out.println(re+" => EXC "+e.getClass().getSimpleName()+" "+e.getMessage()); } }
  public static void main(String[] a){
    c("\\p{L}+","Ñandú"); c("\\w+","Ñandú"); c("(?U)\\w+","Ñandú"); c("\\p{Lower}+","ab"); c("\\p{IsUppercase}","A"); c("\\p{javaLowerCase}","a"); c("\\p{IsAlphabetic}+","añ"); c("\\p{Lu}","Á"); c("\\p{IsLatin}+","añ"); c("\\p{InGreek}","α"); c("\\p{Punct}",";");
    c("\\h+"," \t"); c("\\R","\r\n"); c("\\v","\n"); c("\\X","e"); c("\\N{LATIN SMALL LETTER A}","a");
    c("(?<x>ab)\\k<x>","abab"); c("(?<x>ab)\\1","abab"); c("(?<año>\\d+)","12"); c("(?<a1>x)","x");
    r("(?<d>\\d+)/(?<m>\\d+)","09/11","${m}-${d}"); r("(\\d+)/(\\d+)","09/11","$2-$1"); r("(\\d+)","9","\\$$1"); r("x","x","$0$0");
    try{ Pattern.compile("(a)(?<n>b)"); Matcher m=Pattern.compile("(a)(?<n>b)").matcher("ab"); m.matches(); System.out.println("mix "+m.group(2)+" "+m.group("n")+" start "+m.start("n")+" end "+m.end("n")); }catch(Throwable e){ System.out.println("mix EXC "+e); }
    try{ Matcher m=Pattern.compile("(?<n>b)").matcher("b"); m.matches(); m.group("zz"); }catch(Throwable e){ System.out.println("badname "+e.getClass().getSimpleName()+" "+e.getMessage()); }
    try{ System.out.println("namedGroups "+Pattern.compile("(?<n>b)").namedGroups()); }catch(Throwable e){ System.out.println("namedGroups EXC "+e.getClass().getSimpleName()); }
    c("(?i)ñ","Ñ"); c("(?iu)ñ","Ñ"); c("[[:alpha:]]","a"); c("\\Qa.b\\E","a.b"); c("a{2,}","aaa"); c("(?x) a b # c","ab"); c("(?s).","\n"); c("(?m)^b$","b");
  }
}
