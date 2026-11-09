import java.util.*;
import java.util.regex.*;
public class Main {
  static void t(String name, Runnable r){ try{ r.run(); }catch(Throwable e){ System.out.println(name+" EXC "+e); } }
  public static void main(String[] a){
    t("matches", ()->System.out.println("matches "+ "2026".matches("\\d{4}") + " " + Pattern.matches("\\d+","12a")));
    t("find", ()->{ Matcher m=Pattern.compile("\\d+").matcher("a12 b345 c6"); StringBuilder s=new StringBuilder(); while(m.find()) s.append(m.group()+"@"+m.start()+"-"+m.end()+" "); System.out.println("find "+s);});
    t("groups", ()->{ Matcher m=Pattern.compile("(\\w+)@(\\w+)\\.com").matcher("ana@ulpgc.com"); m.matches(); System.out.println("groups "+m.groupCount()+" "+m.group(1)+" "+m.group(2)+" "+m.start(2));});
    t("named", ()->{ Matcher m=Pattern.compile("(?<dia>\\d{2})/(?<mes>\\d{2})").matcher("09/11"); System.out.println("named "+m.matches()+" "+m.group("dia")+" "+m.group("mes"));});
    t("namedref", ()->System.out.println("namedref "+ "abab".matches("(?<x>ab)\\k<x>")));
    t("namedrepl", ()->System.out.println("namedrepl "+ "09/11".replaceAll("(?<d>\\d+)/(?<m>\\d+)","${m}-${d}")));
    t("repl", ()->System.out.println("repl "+ "09/11".replaceAll("(\\d+)/(\\d+)","$2-$1")));
    t("backref", ()->System.out.println("backref "+ "hola hola".matches("(\\w+) \\1")));
    t("lookbehind", ()->{ Matcher m=Pattern.compile("(?<=€)\\d+").matcher("cuesta €45"); System.out.println("lookbehind "+m.find()+" "+m.group());});
    t("neglook", ()->System.out.println("neglook "+ "abc".matches("(?!x)abc") + " " + "ab1".replaceAll("(?<!a)b","X")));
    t("flagsCI", ()->System.out.println("CI "+ Pattern.compile("hola",Pattern.CASE_INSENSITIVE).matcher("HOLA").matches()+" "+"ÁRBOL".matches("(?iu)árbol")));
    t("multiline", ()->{ Matcher m=Pattern.compile("^\\w+$",Pattern.MULTILINE).matcher("uno\ndos\ntres"); int c=0; while(m.find()) c++; System.out.println("multiline "+c);});
    t("dotall", ()->System.out.println("dotall "+ Pattern.compile("a.b",Pattern.DOTALL).matcher("a\nb").matches()+" "+"a\nb".matches("a.b")));
    t("comments", ()->System.out.println("comments "+ Pattern.compile("\\d+ # num",Pattern.COMMENTS).matcher("12").matches()));
    t("possessive", ()->System.out.println("possessive "+ "aaa".matches("a*+a") + " atomic " + "aaa".matches("(?>a*)a")));
    t("lazy", ()->{ Matcher m=Pattern.compile("<.+?>").matcher("<a><b>"); m.find(); System.out.println("lazy "+m.group());});
    t("split", ()->System.out.println("split "+ Arrays.toString("a, b,,c".split(",\\s*")) + Arrays.toString("a1b2".split("\\d",-1))));
    t("quote", ()->System.out.println("quote "+ Pattern.quote("1+1") + " " + "1+1".matches(Pattern.quote("1+1")) + " " + Matcher.quoteReplacement("$5")));
    t("unicode", ()->System.out.println("unicode "+ "Ñandú".matches("\\p{L}+") + " " + "Ñandú".matches("\\w+") + " " + "Ñandú".matches("(?U)\\w+") + " " + "ab".matches("\\p{Lower}+") + " " + "Ab".matches("\\p{IsUppercase}\\p{javaLowerCase}")));
    t("bounds", ()->System.out.println("bounds "+ "el gato".replaceAll("\\bgato\\b","perro") + " " + "x".matches("\\Ax\\z")));
    t("appendRepl", ()->{ Matcher m=Pattern.compile("\\d+").matcher("a1b22"); StringBuffer sb=new StringBuffer(); while(m.find()) m.appendReplacement(sb, String.valueOf(Integer.parseInt(m.group())*2)); m.appendTail(sb); System.out.println("appendRepl "+sb);});
    t("results", ()->System.out.println("results "+ Pattern.compile("\\d").matcher("a1b2").results().count()));
    t("lookingAt", ()->{ Matcher m=Pattern.compile("\\d+").matcher("12ab"); System.out.println("lookingAt "+m.lookingAt()+" "+m.matches()+" hitEnd "+m.hitEnd());});
    t("region", ()->{ Matcher m=Pattern.compile("\\d+").matcher("ab123cd"); m.region(2,5); System.out.println("region "+m.matches());});
    t("flags()", ()->System.out.println("flags "+ Pattern.compile("x",Pattern.CASE_INSENSITIVE|Pattern.MULTILINE).flags() + " pattern " + Pattern.compile("a\\d").pattern() + " toMatchResult " + Pattern.compile("a").matcher("a").toMatchResult()));
    t("groupNullOpt", ()->{ Matcher m=Pattern.compile("(a)?(b)").matcher("b"); m.matches(); System.out.println("optgroup "+m.group(1)+" "+m.start(1));});
    t("syntax1", ()->{ try{ Pattern.compile("(ab"); System.out.println("syntax1 noexc"); }catch(PatternSyntaxException e){ System.out.println("syntax1 desc="+e.getDescription()+" idx="+e.getIndex()+" msg="+e.getMessage().replace("\n","|")); }});
    t("syntax2", ()->{ try{ Pattern.compile("*a"); System.out.println("syntax2 noexc"); }catch(PatternSyntaxException e){ System.out.println("syntax2 desc="+e.getDescription()+" idx="+e.getIndex()+" msg="+e.getMessage().replace("\n","|")); }});
    t("syntax3", ()->{ try{ Pattern.compile("[a-"); System.out.println("syntax3 noexc"); }catch(PatternSyntaxException e){ System.out.println("syntax3 desc="+e.getDescription()+" idx="+e.getIndex()); }});
    t("badgroup", ()->{ try{ Matcher m=Pattern.compile("(a)").matcher("a"); m.matches(); m.group(2);}catch(Exception e){ System.out.println("badgroup "+e.getClass().getSimpleName()+" "+e.getMessage());}});
    t("nomatchgroup", ()->{ try{ Matcher m=Pattern.compile("a").matcher("b"); m.find(); m.group();}catch(Exception e){ System.out.println("nomatch "+e.getClass().getSimpleName()+" "+e.getMessage());}});
    t("dni", ()->System.out.println("dni "+ "12345678Z".matches("\\d{8}[A-HJ-NP-TV-Z]") + " email " + "sergio.medina@ulpgc.es".matches("[\\w.+-]+@[\\w-]+(\\.[\\w-]+)+")));
    t("catastroph", ()->{ long t0=System.currentTimeMillis(); boolean r="aaaaaaaaaaaaaaaaaaaaaaaa!".matches("(a+)+b"); System.out.println("catastroph "+r+" ms="+(System.currentTimeMillis()-t0));});
    t("intersect", ()->System.out.println("intersect "+ "e".matches("[a-z&&[^aeiou]]") + " " + "b".matches("[a-z&&[^aeiou]]")));
    t("posixclass", ()->System.out.println("posix "+ "ab12".matches("\\p{Alnum}+") + " " + " \t".matches("\\h+") + " " + "\r\n".matches("\\R")));
  }
}
