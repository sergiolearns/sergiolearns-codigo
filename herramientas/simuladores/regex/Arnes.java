// SergioLearns — probador de expresiones regulares: arnés de Java.
// En la web va detrás de SlRegex.java (java.util.regex de OpenJDK 21 aplanado); en las pruebas, con el JDK.
// Entrada (System.in), una línea por dato en Base64 (UTF-8): expresión, flags (número), reemplazo ("-" si no hay), texto y los textos del reto.
import java.util.Base64;
import java.util.Scanner;

public class Main {
    static final int LIM = 200;
    static StringBuilder o = new StringBuilder();

    static String de(String s) { return new String(Base64.getDecoder().decode(s.trim()), java.nio.charset.StandardCharsets.UTF_8); }

    static void str(String s) {
        if (s == null) { o.append("null"); return; }
        o.append('"');
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '"' || c == '\\') o.append('\\').append(c);
            else if (c < 0x20) { String h = Integer.toHexString(c); o.append("\\u").append("0000".substring(h.length())).append(h); }
            else o.append(c);
        }
        o.append('"');
    }

    static void m(Matcher m) {
        o.append("{\"s\":").append(m.start()).append(",\"e\":").append(m.end()).append(",\"t\":");
        str(m.group());
        o.append(",\"g\":[");
        for (int i = 1; i <= m.groupCount(); i++) {
            if (i > 1) o.append(',');
            if (m.start(i) < 0) o.append("null");
            else { o.append('[').append(m.start(i)).append(',').append(m.end(i)).append(','); str(m.group(i)); o.append(']'); }
        }
        o.append("]}");
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String re = de(in.nextLine());
        int flags = Integer.parseInt(de(in.nextLine()));
        String repB = in.nextLine().trim();
        String rep = repB.equals("-") ? null : de(repB);
        String text = de(in.nextLine());
        java.util.List<String> retos = new java.util.ArrayList<>();
        while (in.hasNextLine()) { String l = in.nextLine().trim(); if (!l.isEmpty()) retos.add(de(l)); }
        Pattern p;
        try {
            p = Pattern.compile(re, flags);
        } catch (PatternSyntaxException e) {
            o.append("{\"ok\":false,\"msg\":"); str(e.getDescription());
            o.append(",\"pos\":").append(e.getIndex()).append(",\"full\":"); str("java.util.regex.PatternSyntaxException: " + e.getMessage());
            o.append('}');
            System.out.println(o);
            return;
        } catch (RuntimeException e) {
            o.append("{\"ok\":false,\"msg\":"); str(String.valueOf(e.getMessage()));
            o.append(",\"pos\":null,\"full\":"); str(e.getClass().getName() + ": " + e.getMessage()); o.append('}');
            System.out.println(o);
            return;
        }
        Matcher mt = p.matcher(text);
        o.append("{\"ok\":true,\"ng\":").append(mt.groupCount()).append(",\"names\":{");
        boolean first = true;
        for (java.util.Map.Entry<String, Integer> en : p.namedGroups().entrySet()) {
            if (!first) o.append(','); first = false;
            str(en.getKey()); o.append(':').append(en.getValue());
        }
        o.append("},\"matches\":");
        if (mt.matches()) m(mt); else o.append("null");
        mt.reset();
        o.append(",\"lookingAt\":");
        if (mt.lookingAt()) m(mt); else o.append("null");
        mt.reset();
        o.append(",\"find\":[");
        int n = 0;
        while (mt.find()) {
            if (++n > LIM) { break; }
            if (n > 1) o.append(',');
            m(mt);
        }
        o.append(']');
        if (n > LIM) o.append(",\"mas\":true");
        if (rep != null) {
            o.append(",\"sub\":");
            try {
                Matcher r = p.matcher(text);
                int k = 0;
                while (r.find()) k++;
                String hecho = p.matcher(text).replaceAll(rep);
                o.append("{\"t\":"); str(hecho); o.append(",\"n\":").append(k).append('}');
            } catch (RuntimeException e) {
                o.append("{\"err\":"); str(e.getClass().getName() + ": " + e.getMessage()); o.append('}');
            }
        }
        o.append(",\"split\":[");
        String[] sp = p.split(text);
        for (int i = 0; i < sp.length; i++) { if (i > 0) o.append(','); str(sp[i]); }
        o.append("],\"retos\":[");
        for (int i = 0; i < retos.size(); i++) { if (i > 0) o.append(','); o.append(p.matcher(retos.get(i)).matches()); }
        o.append("]}");
        System.out.println(o);
    }
}
