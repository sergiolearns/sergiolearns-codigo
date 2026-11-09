import java.util.regex.*;
public class Main {
  static void c(String re, String s){ try{ System.out.println(Pattern.compile(re).matcher(s).matches()+"  "+re+"  |  "+s); }catch(Throwable e){ System.out.println("EXC "+re); } }
  public static void main(String[] a){
    String ip="\\d{1,3}(?:\\.\\d{1,3}){3}";
    c(ip,"10.0.0.7"); c(ip,"192.168.1.20"); c(ip,"172.16.0.3"); c(ip,"1.22.0.0"); c(ip,"1.2.33.4");c(ip,"1.2.3.44");
    c("\\d{1,3}(\\.\\d{1,3}){3}","192.168.1.20");
    c("(?:\\.\\d{1,3}){3}",".168.1.20"); c("(?:\\.\\d{1,3}){3}",".1.1.1"); c("(?:\\.\\d{1,3}){2}",".11.1"); c("(?:\\.\\d{1,3}){2}",".1.11");
    c("(?:\\.\\d+){2}",".11.1"); c("(?:x\\d{1,2}){2}","x11x1"); c("(?:x\\d{1,2})(?:x\\d{1,2})","x11x1"); c("(?:x\\d?\\d){2}","x11x1"); c("(?:ab{1,2}){2}","abbab"); c("(?:ab{1,2}){2}","ababb"); c("(ab{1,2}){2}","abbab"); c("(?:ab{1,2})+","abbab"); c("(?:ab{1,2}){2,}","abbab"); c("(?:ab*){2}","abbab");
  }
}
