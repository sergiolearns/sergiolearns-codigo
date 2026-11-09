/* SergioLearns — probador de expresiones regulares: motores de verdad (window.SLRx).
 * Python: Pyodide (CPython 3.14, módulo re) en un worker de tipo módulo, con el arnés de arnes.py.
 * Java: javac + TeaVM (@live-codes/java-wasm 0.1.0) con el java.util.regex de OpenJDK 21 (SlRegex.java, va comprimido
 * en SL_RX_JAVA_GZ) y el arnés Arnes.java. Las versiones son las del entorno de programación (fragmento 16).
 * Las tres piezas marcadas (arnés de Python, arnés de Java y SlRegex comprimido) las rellena build.py. */
(function (G) {
  'use strict';
  if (G.SLRx) return;
  var BASE = {
    py: 'https://cdn.jsdelivr.net/npm/pyodide@314.0.7/',
    java: 'https://cdn.jsdelivr.net/npm/@live-codes/java-wasm@0.1.0/dist/'
  };
  var PY_ARNES = "# SergioLearns \u2014 probador de expresiones regulares: arn\u00e9s de Python (se ejecuta en Pyodide; tambi\u00e9n en CPython para las pruebas)\n# Entrada: dict {re, flags: [\"I\",\"M\",\"S\",\"X\",\"A\"], rep, text, retos: [textos]}; salida: dict serializable a JSON.\nimport re, json\n\n_FL = {\"I\": re.IGNORECASE, \"M\": re.MULTILINE, \"S\": re.DOTALL, \"X\": re.VERBOSE, \"A\": re.ASCII}\nLIM = 200  # coincidencias como mucho\n\n\ndef _m(m):\n    if m is None:\n        return None\n    g = []\n    for i in range(1, (m.re.groups or 0) + 1):\n        s, e = m.span(i)\n        g.append(None if s < 0 else [s, e, m.group(i)])\n    return {\"s\": m.start(), \"e\": m.end(), \"t\": m.group(0), \"g\": g}\n\n\ndef sl_regex(q):\n    out = {\"ok\": True}\n    fl = 0\n    for f in q.get(\"flags\", []):\n        fl |= _FL.get(f, 0)\n    try:\n        p = re.compile(q[\"re\"], fl)\n    except re.error as e:\n        return {\"ok\": False, \"msg\": e.msg, \"pos\": e.pos, \"full\": \"re.error: \" + str(e)}\n    except (OverflowError, RecursionError, ValueError) as e:\n        return {\"ok\": False, \"msg\": str(e), \"pos\": None, \"full\": type(e).__name__ + \": \" + str(e)}\n    t = q.get(\"text\", \"\")\n    out[\"ng\"] = p.groups\n    out[\"names\"] = {k: v for k, v in p.groupindex.items()}\n    out[\"match\"] = _m(p.match(t))\n    out[\"search\"] = _m(p.search(t))\n    out[\"fullmatch\"] = _m(p.fullmatch(t))\n    it, n = [], 0\n    for m in p.finditer(t):\n        n += 1\n        if n > LIM:\n            out[\"mas\"] = True\n            break\n        it.append(_m(m))\n    out[\"finditer\"] = it\n    out[\"findall\"] = repr(p.findall(t)) if not out.get(\"mas\") else None\n    rep = q.get(\"rep\")\n    if rep is not None:\n        try:\n            r, k = p.subn(rep, t)\n            out[\"sub\"] = {\"t\": r, \"n\": k}\n        except (re.error, IndexError) as e:\n            out[\"sub\"] = {\"err\": type(e).__name__ + \": \" + str(e)}\n    out[\"split\"] = p.split(t)\n    out[\"retos\"] = [p.fullmatch(x) is not None for x in q.get(\"retos\", [])]\n    return out\n\n\ndef sl_regex_json(s):\n    return json.dumps(sl_regex(json.loads(s)), ensure_ascii=False)\n";
  var JAVA_ARNES = "// SergioLearns \u2014 probador de expresiones regulares: arn\u00e9s de Java.\n// En la web va detr\u00e1s de SlRegex.java (java.util.regex de OpenJDK 21 aplanado); en las pruebas, con el JDK.\n// Entrada (System.in), una l\u00ednea por dato en Base64 (UTF-8): expresi\u00f3n, flags (n\u00famero), reemplazo (\"-\" si no hay), texto y los textos del reto.\nimport java.util.Base64;\nimport java.util.Scanner;\n\npublic class Main {\n    static final int LIM = 200;\n    static StringBuilder o = new StringBuilder();\n\n    static String de(String s) { return new String(Base64.getDecoder().decode(s.trim()), java.nio.charset.StandardCharsets.UTF_8); }\n\n    static void str(String s) {\n        if (s == null) { o.append(\"null\"); return; }\n        o.append('\"');\n        for (int i = 0; i < s.length(); i++) {\n            char c = s.charAt(i);\n            if (c == '\"' || c == '\\\\') o.append('\\\\').append(c);\n            else if (c < 0x20) { String h = Integer.toHexString(c); o.append(\"\\\\u\").append(\"0000\".substring(h.length())).append(h); }\n            else o.append(c);\n        }\n        o.append('\"');\n    }\n\n    static void m(Matcher m) {\n        o.append(\"{\\\"s\\\":\").append(m.start()).append(\",\\\"e\\\":\").append(m.end()).append(\",\\\"t\\\":\");\n        str(m.group());\n        o.append(\",\\\"g\\\":[\");\n        for (int i = 1; i <= m.groupCount(); i++) {\n            if (i > 1) o.append(',');\n            if (m.start(i) < 0) o.append(\"null\");\n            else { o.append('[').append(m.start(i)).append(',').append(m.end(i)).append(','); str(m.group(i)); o.append(']'); }\n        }\n        o.append(\"]}\");\n    }\n\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        String re = de(in.nextLine());\n        int flags = Integer.parseInt(de(in.nextLine()));\n        String repB = in.nextLine().trim();\n        String rep = repB.equals(\"-\") ? null : de(repB);\n        String text = de(in.nextLine());\n        java.util.List<String> retos = new java.util.ArrayList<>();\n        while (in.hasNextLine()) { String l = in.nextLine().trim(); if (!l.isEmpty()) retos.add(de(l)); }\n        Pattern p;\n        try {\n            p = Pattern.compile(re, flags);\n        } catch (PatternSyntaxException e) {\n            o.append(\"{\\\"ok\\\":false,\\\"msg\\\":\"); str(e.getDescription());\n            o.append(\",\\\"pos\\\":\").append(e.getIndex()).append(\",\\\"full\\\":\"); str(\"java.util.regex.PatternSyntaxException: \" + e.getMessage());\n            o.append('}');\n            System.out.println(o);\n            return;\n        } catch (RuntimeException e) {\n            o.append(\"{\\\"ok\\\":false,\\\"msg\\\":\"); str(String.valueOf(e.getMessage()));\n            o.append(\",\\\"pos\\\":null,\\\"full\\\":\"); str(e.getClass().getName() + \": \" + e.getMessage()); o.append('}');\n            System.out.println(o);\n            return;\n        }\n        Matcher mt = p.matcher(text);\n        o.append(\"{\\\"ok\\\":true,\\\"ng\\\":\").append(mt.groupCount()).append(\",\\\"names\\\":{\");\n        boolean first = true;\n        for (java.util.Map.Entry<String, Integer> en : p.namedGroups().entrySet()) {\n            if (!first) o.append(','); first = false;\n            str(en.getKey()); o.append(':').append(en.getValue());\n        }\n        o.append(\"},\\\"matches\\\":\");\n        if (mt.matches()) m(mt); else o.append(\"null\");\n        mt.reset();\n        o.append(\",\\\"lookingAt\\\":\");\n        if (mt.lookingAt()) m(mt); else o.append(\"null\");\n        mt.reset();\n        o.append(\",\\\"find\\\":[\");\n        int n = 0;\n        while (mt.find()) {\n            if (++n > LIM) { break; }\n            if (n > 1) o.append(',');\n            m(mt);\n        }\n        o.append(']');\n        if (n > LIM) o.append(\",\\\"mas\\\":true\");\n        if (rep != null) {\n            o.append(\",\\\"sub\\\":\");\n            try {\n                Matcher r = p.matcher(text);\n                int k = 0;\n                while (r.find()) k++;\n                String hecho = p.matcher(text).replaceAll(rep);\n                o.append(\"{\\\"t\\\":\"); str(hecho); o.append(\",\\\"n\\\":\").append(k).append('}');\n            } catch (RuntimeException e) {\n                o.append(\"{\\\"err\\\":\"); str(e.getClass().getName() + \": \" + e.getMessage()); o.append('}');\n            }\n        }\n        o.append(\",\\\"split\\\":[\");\n        String[] sp = p.split(text);\n        for (int i = 0; i < sp.length; i++) { if (i > 0) o.append(','); str(sp[i]); }\n        o.append(\"],\\\"retos\\\":[\");\n        for (int i = 0; i < retos.size(); i++) { if (i > 0) o.append(','); o.append(p.matcher(retos.get(i)).matches()); }\n        o.append(\"]}\");\n        System.out.println(o);\n    }\n}\n";
  var JAVA_GZ = "H4sIAAAAAAAC/+297VobOdIw/J+j6PDc92APhrVNvoHMGjCJdwmwmMzHZthcxm6gibG9bjuBSXhO6jmE98TeKkndrY+SWm1MktkN1wXY3VKpVCqVSqVS1V9+XAh+DLaHo5txdH4xCUrdclB79uxZJahX62uV4GDc6fbDoDPo/WU4DqJJHHTOzqJ+1JmE8WrQ6PcDVi8OxmEcjj+EvVWEt3MQ7B8cB4294+ZRcHAUHDVfH/zcDLYPDn87ar18dYxvW9vNNr47ftVqB7utvWbwqtnYaR4hAIRxfBHFQXfYCwP4fzYOwyAenk0+dsbhenAznAbdzgAa7UXxZBydTidQbJKgeTXsRWc38ADhTAe9cBxMLsJgEo6v4mB4xr683H8TvAwH4bjTDw6np/2oG+xF3XAQh8GHcBxHw0FQD4aD/k0l6MQIZ4SF4ouwF5zeMAi7iFNb4BTsDqGhzgTqrQYJ1XphHJ0PkFRQIeJQOuNJ1J32O+MAyAiEjYN4enoZdifBZMjALm73O3E86kwuFoPwuhuOECaWG42HH6Je2EMwgIJoIxqwWntAzv12kwOdXHSAFt3u8GrUGUSA8SShJUncjIa9BNzFcCTAAFU/RjDMp2EwjcOzab8SQMngl9bxq4M3xwirsf9b8Evj6Kixf/zbOhSeXAyhQPgh5KCiq1EfcQAqjTuDyQ0OwOvm0fYrKN/Yau21jn8LhmMEtNs63m+2gRmAKxrBYeMIeOTNXuMoOHxzdHjQbgJh22GYM3oIKBvAM8YNYxyKSSfqx0GpA90e3WC3o0G3P+1lfTZIiKBIKpYTMv4GfBhDd/u94KLzIQR+7IYRTIJAtOLNawisHnT6w8E5oyBv6+Nw/H49iM6CwXBSCT6OI+BywSU25qsgpNagu1oJHtWgVGfwvg/9a0P93egMAO/2h8NxJdgaxhMoHbxuBNV6rVZdqa1Va8GbdiPp2mE/7AB+3eFg0gHm5NwGQKvVhPMOO+P3HzswP47C3sfhsBe0L4DScSXYbgTPHlYfP0JwCArG4EMUIyN9/Lg6ZJVXgarYMZzIgxAJ1utFiD9QKBrAqF2x3mBVRtjO4AYh/Xsaxvg8Riz/svCXH4EhxufRcC/sjAfx8+Cy86GzOp1E/dVxeB5ew6gHB6Nw8Ledvwf1WlC67L2v16bloDPqdwad3jAAFp0OOvAb9To9nJud4Djs/PyaCbHtztVpNASoow60C6QfATa98Azm6rASxEBVkHhRpx/90elG/9//G/Bn+4g7PAOZU9pu7B/sv2v+o8xGBd/+vv9pdXX1thKEcReGczqGef376FMr3oP+Dm6DQYTTfATc1gHhgfiHV8PL6C8w74fn484VFC/1QPCF4zGO4mA66CL6KH2n/Ql26azTj4flVSQPzLzheMKJEg1XWwfNRJysK+8YwRowO2/2QBLY3sXEi+3hoDsdj8PB5DWK3KjLRs3VzKtOfPG6MyLetEA8dybDMfFqLxq8D3tYtR1OyPck2nvDbqcfEi9oBPaH7Wn3otkPr6A/rj4cMHlN0YNGrw0C0N456S0F8gyGmK0qQOt4ehWOXWV2xQdXmUNcNGGgKMLAOhB2rlbb7F/e+/Z0hK/XF84inLZdXLZAKEygMyDP4AclPyNmnPJgO5kxp/1w4RMrNeICMZ4A73QDDisaTII3+61f3+21YEUINoPqdbW27iy+3Wg337VAfu+3W8ctUDZYpXpOpYPXr5v7x6KFh+7Cr9/sHbcQIV76qbs0rGvNo8YeK1urusvuHBw39njRek5RoMr2wU7zHXaXVXhYzaMLl0Gs8FNf6K8aR41t6MC77b1Guy06kVQeRx+Afcza0Id3u3uNl1jeGI7PEv0+MzjJj+j9Z7VvnzPMP8u88DmlrArFhvrndJAd2LN1l0vzn/mC/Ka1A714VH2yVn/0tPa4/vjhw8cPnz58XNtTwcBUiKDuiLO9+g5pctbvnMfq4wksynEE0yIrULWV+DDsA5qw2J4Oh7AgDwLURuB7z1ZB4DNIVqHeoYxZVm4fdb/xcDghX8Dq2704It4Cxm9PQAE8O0NBpL7bvuiMU+ECqKViRi2Wdgmk8AZHtwIaywQW7PGLYNC5Cnsvx8PpKNYrsqevwk4PMDjHz4iqUQrXgg188wJUpdF2fxhPxyFZEqnfxyXieHt/GxQoo7MJzS86MWv7KDxzjCRgNQmvRlQr3c4IlnroKANDtpUiI72lGQYW3Hg4dpUQzLgXDs4nF7aCUudQkHNB3RnfUAJC8FDCfCXBZEzHKgef0nk4DqGbA1DoPiZVSqxMJaiWOdzbgtAr2Rzxa4gXJRpTJ2qJgKbMYaruZMg/FKv8GucSaINX/H8Jp0k7BI1y0EURMZpOZHCgE5ceJJNcfoE/8c2gezEeDnBel3CHoBcwIRiv8SehtKBT8nO7YH5KsQdpiOQW31nrFYH+uk6MK4IM6ThS1JOFIMUiCbNyGsYai7gpmrDXCHogPq8mBOAcvE72drSajJitl6sJOnZ+A6EQo35HjDpn7X50FU0IivBaoiArVGGqfZjf1i+wf9wJWR1Yy+bS8mQ81RpWlj+/XlbSYfyoYKiwPxRmVGViEPWOdeVdBMaca/Wxwht7DGYPSjDowQu5ZLrFEcvOi6ROPBHcnZV4UbKwhY0pPl4gQ12tgkLRK5X1ickmpYLh589yRzcEvitBzTanRdeh78EPPwTptytQysGmBLMKnmZf2JuQQiUTAgPYck7DdePtrfFEzDeGMNCA9X0V7FbJWHPkKln75dVMWJoNpGRfhW1/iX0jSiVjLfqxTlLFzkr2Bk30U7wrvFUZ/bIPgZaXs8HUhGoQwqxluMqMvekecF+C8xd9ttJ/Iao7ukqsHyrnqsuRtIqncuQT71HWj9v1hYKTSG0kb+hzCVlWJRC3tLRhCU6EAQMewwOZWogrH2HWb22ImbAIShKsF3xaZwDPw4n0fqVWXo3i5tVockPPaKnoSv6opOTm1YT0E08zUCfmmpd1eHqK/0vVitQ20o3JUIH6TAtj3ppUdayEQl8Q0+ff0+Ek1SeNdSYGg8VFsyX4PV5lnHBwVlr8/ffmojaUStnNAIaD4mSo+Y/FYDmI4ZdBUVkHuOtVxFa1OOW0rET2tpR83Ej2RauvG7+++7mx96YJAuMp/IoS5eAngxOy2hsoW54HJRKI1DIn0NY06uNJSXyqsIN4nECVqsWnq53RCKUE67c2T4RdUF2rwT6pabQpDNAmRZWKPDK0Ais13Pz9d/ZHQYCtbykC8uAtB/Ws2G0yEUtOXkgxg5n3gA2+MS8s/cgEyoKrC4vEa12Sq3pXsutJdjVin6TvJEpnwQ/B/03tMgx9QxhNYEvxkY14q98Pzzv9xvh8qthAS4tvBu8Hw49cUQdb0CI5Ko6f5ZSTJ8NX4bXo2pksXDPpJPZSqINnr9kWAR6drWs9ZM9/sNl/RJcVfHmVz5uKwUlrqYpNZbYbxlDmLh4K1aQZnO7fVa5XjAyaTotLmuivXcBPxjeEyLft4gBR1BqANzrd9wdwwHTWH35s4oEBnKCG1OLBOYCdKZQWWbVgKOoFvam8bxaNMjP/on37yHUetSE0NqWSBZUtmHKTRhdZTAOUWp9QjU8L6ZxyS5nzdPNXSd3260sAmD0Ym4kBMIWyKhpHYPgihSPCkWp1YU1jmJsbGHzKuq++YjW6XfUhHl6W2K6HPYd/GwzjdX0MeW2pI/igAQumRljkNmyE7yFMhsI3S7//vsQ2GDBna6JB/K6DxtflpAK5ZwmWN0HYEnRw70BuTZRZM28ZWgzaA0erWRdtmwGmmqXDsBFEZas0S/moDcpFWBI0qGSjCHK3wtiCUJTZ1JeGO/LZSHS7y8vWDQQnxIkXIbpdXRH0JE/aZ/BD+OMPus84+P79xtJ5fVe/CZ7pauwrkyarAMdO4XiS9UtTwqWRZtN0oeAAYyWjr4nVD57mrNRCMH0YRj29tUQxHXf58j08O5PNJb5rrCqjerHYAH3SdU9UbMZdQsiJtnHJg3+aSSMowbPUPgGM12hvt1qwVjXibhSVEKIQCVCubCxd8JAeNRwbhJzshPWKPdyxCZUKCYQICnuUxnN8LKg2oI48CZImNxiwso4n774kp3DeeeCE/XYRzbAFoXZ8URXDgf4kh0N4JihoSuzF1f/5XCq/Pfl0+6+fflz+/ffFVDsFKIlGSkxmCdsSDlEZi5vzUBuhQsIZenIJ/Xg57owu4ABhdRBeT7aYL8r4JiURPWqcCppcSGZE+G9BHdhlxnxyMUCXZbL84Awtfu0++l6sZms/gEEXiX5fq8XH+tKkNMDJxoNpa7i9xaepHg8bdZLYfEAVADCgFL2h00RJ3AaDnw0oyDhUvG0cL4vZKysOdoLjm1EIhflynL3B09P2YWO7tf/y3evG0d9tAh+cFlKDaKc/GcRCxVG8LlSDqPzDqjDjCtDbUgZ8WnrTbtj89xSEItBy0uijnGVqJFK9wqFYakuMvFj66fmiExFQmpqd7kUJNuErL5QZW04+LX1eKjua6oV98PYp4cdk2NFMVwnkJx6olm2I+lpeb2le7xbhdbbBgJerYGIBowkQu8ssxQ+QAaVn5YU8qqNdA+YlWDY+42ecc9KXLn42epxqLioKvdmas7XggqXy5K3vAs11ny+1QEv4mgNrSkEuTsVw5yodzrkn9bDolt4UHk7Vo4siDYVTzBcGEKw13cgmaSdMLwgHpFbQY8uvtxYg+niK7oz6qlKtqDs3URZ2uafRAD69Bh/H2KhF1QGD5oj5F28mFD+Er9MJo3NcUiGWlU0e2+PxUy34t8HhCErAk+VlnQqJKIDVFmqxji3zWm+vT9ZJgmFZjWKiOu7oh3F4MAjbk3BEFWRLIxYGVYPxHLGQuCU8VGbiM+fA2bGlR/ISZBWUII/RVZM+MpTEg5ktuVb2PZXQjiI84dfLpAKI6oK06EuqQFKVUphqebVIPcJQIxB9UByYp3mpyxWH7HvVcsLgQRfbsmU5aqif6JMYy7ytniRnXpS6l2Oormt9TU2z2wm1sMf5ZaplErca4gblbSdtgky8NLnxgXEcpO3EqWhMnxhHy2z+STVABa3bjbgH08nB2WtwGx7fNLlFL/GAmAyHbLb3w+vFsg01zs+qYTM1RKGQqjMhtSn3YR0OBa91jASgHzeD63XXERQ6TalcwWueKBtUKIgilHGoKI1PJSROCJm6CfMv2kSxuqGgS8hUNr3yZpduUEtRArkbyFNIn29oC6PnpnUgCFcHMT7rC+DDP3qudxR0gzic0L1N3i5vEouqsUCL3vIq6jotk/dm83qlBpdxXmCbNysrVntcSqWbEy4mM6rleScE2NVZFOUcKaHPMWlZHcL9ijEjBJ/pYj+QUEMQEuloFQLZGef09CiRe9T6lbVF4wJelGfRtewBkCmCOjbGIAWZehfCOWCKi6l84xx8yxhuefmEocqaXcaa60XPjxkcaTa2b2KAv4rXf27wVkwJW2NLI6/NPnK3C8PAJotRUjtAPkynHZvDxPFxdT33xEDTgqx6BaXPymu9oUqeReN4cvxxmE7+mBhNtGxRemhKXmNbYII1tn849TiAZOdlVrLoPgBINYPRCug4vOpE7Hqd2SWTI5UhBd5Ka7v3Z2wTcwTr2YfwH81/wIm+7oGZOaCP9uTjHNn/NRWqqkAVxjp2sALFTTsa0pBPjpPU2E6fdNQsO19eG03gHMI/bADqHhvbU7h38d5mTY2CF5ucBOhU5NwcJYY76UhCx4GpKeHHY0B/L5SqmmeRWSmACK5yF7jhaF4Dg5Uu8by9wh9ewahHo/4NfwNXSwWqkXIInBxeNuB21MVVCDO0md2BDItoPUfA9BE4oadHl0IhQS0Irl+eh1YdCOQagJT0EqZppL30Em0CAPssWy0Tb8VogKyMG1L0rTTfn4bntiIa09oUGc54IM8Jg5BqwweRCY5U6bP+6KIDz6iVWfTq7SVfJrrWk6oE2E50Hk0swLBc1k3rcZTaJM7Ada+C157l1pZ8zuW8e97NO51M++vVM+92HWSUhRgeIDaXrEej1EkAZ6qEF5nrFUExapm48xiSBW8XvBrWe/2Pu/RanYGKSLZPVE+bbwHKddetJ9oR8h2TB/bTbBWYRUDkqddKhzVuMHx49pLdpHTaIgQrv1S6imITjrJSecmWDNKoyRSB1OlFM/bANZbsui0zcOMTcVXMED/G9SgU9KlulTiLrLsdWiggyjUQN0WM6sTJrLYGqSCATtLQ6fd4zMFhC0OFK64WRxPZCKkoUfBoedOygTW8UcjOybvpa8IcFanoW9YMopfmnFP5lbE567Qxh+yD01W9m9miGSgcpbRhqKfSgs7uykmDuCaPWnaPTZTILrnVqlI56VpcsKnp59o1N+IqQ013inDNDdn7CgBxVwU+NxUqVYzBsLlxrQpLM+nLRc0sGYXwejS2u4phZ9SxAynIb8jZVsJRGL7n5tqlsnVJUDzi3gz4pQ+QPkBn3PhATepwT1YDGA7Yij5payidGFOqb1Zwh+DwpyLQgiACnREGphhDbAt+xtF9z1xZHdj5Qb4ewRV3FhuDmfH7/NVi2X+tUDcn2ZBGA9h5g7M3xMZgvFWm/QS3Bq9Xh6D3X6FETmsTw8/Lb2ZMQxqvOVBDfPyU+SO2pVbAWpL5KdoaN/wdrf3cwiUzvaygv93FXbmFCtpF3Dznyrn1Tx28B9INWB1RtnawS8MD/PNcF0e2achKS1TYAzufje1LJfZ2wEKvgJkm8dNWHGspJS6fN5MVVpGomcxWHqvCWnmlrx+ya6e4imksVYTcTmGqmk/eTWl4ryhEZPnzdPXQr1inJ0KiBH3Kpy5BGTTgIxHUA1aaOslDwvJzLrWpXZF194+6Mgp1Ut1Ro4SiPSr3/HmMimOIndOCIDP6vcOINBldda71x9mVw+ufQcvpmW8g3BCYeeHAF8LVSApH0nLJmO4QPWtSIonH1F7xXl8nI5Lj+BJ67XjFsCZ1JwVxowRln5MukpeMSwhisErCp/4HfPtgkzbIso522CrPLbmgYtju7kBILWZ8TbYxfLlV9jLprkCEf9BUNgkCxP2Jw0NQMX65gFtlEHqLKTz8taY4dZmCkb4kzVF8EY3LHmbNK3AGMK3WpnIg6a23RogJodCoBGLXBiXS+BOG1USYGkWU24JiXLsXNqTAUNnLRarIeHG0iJEqjleTq03F0MuFjEquA+Ty8tcZCEQrv8MEdrmQCdQ4ULkZYaxM7IHtpAeoDWHzoO/+nyXL9UijUplwpnT0QJq0dDsGlcHl0SsqQj5tCEb9isQh+NkkjoU0SU902sxCDQ6jyLQTveVyl12RfRDFCKYdYrg2CJpl9j1XzPA+M2hin/ZC1eAMk4bYzdmOlnJbvS0+rXJoRfD73WhlEVBfhFbFKZWeo2gdNCdZImWzGFJlU/sSLfH992Apb7cltJqsAsxY2uwrSoytJQDI5+Qi1RRirj7LhTWtVp8+WspRL9gF5/fRyOAgPAGVQwiZnBUt16TxSIczUu/OOkeHKTfTgaEEcGDJnQzySmv7Bnau19mhH9emKD3QDAKk1cW7uIYhspJ2aSV1bKFZCyN5qDZJRlRxBQo+gr+Ycg4tX9djxfiVPSi2jmcM1NmybvUUBxaEMBe9pfRxOZBOZvK9tYc7yyaP2T918mQz44Vs/n3dgqsFbw4P95qouDSOfnvH7tEeHrT2jwn2zSpiizCg54BSeimFHARmUWC2P/5JJTV7Bk4qH4yNOHvD/RzAJma83oL4V9CZU/6PrMzfQbTFgfGejfC6cf0ys35sos86jyuBGK/TxQRmY8Wsk5onWa9cjra81wDHtHcoHRctrfsfl8ldt2PAHRFkIsEM3Eof2O6JZFUSezBODI+j19RatLmp84F6HMMGQB0xv0M2QakErwxTX/SSQeM13UTj7thoyiqIptyQgw4yk5C0yG1I4SQfotCEkRDJ5lvKKqwrFUb7igS8XOwwUjLo47H75yWH5zI26Doo4hs4eln9KwpKMMLEv0CgYViJ4tIiiNo+bvin5xcifoMiu1JBYJVfF7A60iJoQomuVHzwR3sHB4fP8yRTurBzGmlOzxA7CV1tTIbt4o2CpdLS8wXLJGOWvKotJlMyWZkAKXgazrQ1RhhX/YR0pBAkPaeYXUViZ7rqxCaZ7UhzWr0laOVxLO0UZDBV9ne3eVRNCMc+hsgQXXYtiUVjKxfoeAaxADTN1yzrK5xPPaf3ioqtwXL5nCuxoyVpj3toPe9KFJXhINwLUX1zu2JIMVIxjE4Gft2qUBuznkAYJcunJZe8TVTdGYWt3D2Lf41dxM7KZjmsdta5ivo3pRS1CiOr7d6jlfUc7OffgpOAbtqLtmFveFXyiuRmZft/UeLQwjzJmKQhj8uuYBT67tRnuN4MouttCP1v5V3PEQmsQHJVpmQ5x8PNO9L2f2agbS7FNGrtDPvg9qkPy0xSNPCFZe3w6gwd5nGyy+X8IVGmGdQplWfRNXOMJj5tY3VA23pdOlcy2gA7gd6FEz9rA8OflonhYiCYGkbBOSHh3NpVKpuEsmL6E9nCj+TT5QLspniC7HQG58yzBFyxOyzOENvHB0t4JzvbwePVbMMjhjVdpfWixJS46bYl5tHaHFzIz9EBR/N5kFnbHfD6XX5iT23gDNWV8l/jiusk26J7bs+9dVcCpsWrw4Wr2DIpO3TJaUJCRiki3FAmitlBwMLm1u+0peJjp9kz2UbVvCYnNp4rNfNs3tNTkto2WbZZeTspv0npmtafLPsL3ntLTBLVGm/sfpWtPhUs6g4LOL3K0YoUvduk91UzCemvvImRx6k6+y7C0h3vpbTo7qj4/strT2Xuq5yBJ/Jp4lR0C+yu7rqX0o4k7raf8upY1todWvLRluyDIMSsfqCkcAP3Ui0x0lcSeb2ph/El+OOFI0qdCJeCPkIMYtkh26zXOyi38wunouvlf+7er1vtcd5XRTKB4orjl1y3JG1ZROBB90JhE6Rz1O9mVu1ymNCDVaxsUpBFvNnjdqGQ4PQJxua8G5qyS82i6elCBN3c4ZoN94SFgBzlst+ZeHpjgNcUJHfeFbB6x4mBS3wB06AI9IVs3mASNocIQM+iZpNChQPAv8virmrnulSDL1JF/Ya24ies3mVKuq5WuNXci8U9eWTcC+sJKNzDL3G3tbP96ZWMd+ppCnLeXNh4NooH+HJOZwKZ6lRdqgRLNfxTxz9r+Och/nmEfx7jnyf45yn+AXcGCMNmUYz4FeMj1jdUSXgvIVUiXFjB/WUXb0VAey7zLBGUeYUFrk0hu+S5oJ5bp3FpXRbRK3qU4rBuKUevqiZUIftYSDsbytQ+T3LcN+pkyo6aqs0eD2m7tQUXTACWGCk2rUtyFG1ZTBj6iwRJhVO2+UIJ1SG7NM0cuLNEMl2g4CSsSA4NcJB4HpJeU9wbRgpfT7J6wuLPKcyHcn1esiaV5E/qxpM148lD48kj48lj48kT48lT48kzDXMu/hjZyhQjsznEqOi4NoNSKJuMZdcqJCgl77s5Yo07ICaFDietzdZGt+bUKIY0LbG/GFWzqfG9FnHeF7ltDTkNH15oh+iBfbzSpHv8LpAVRSJthO6vk2byi1d3Wi9bYG6Fuz3aC+aD+k68Xndik34GuxHz/rGo/Q+S4aEFZjomirKSAp+NNZvGLNr1GZqX82GuPfD1ZAmmvLn61cw88Wo4jv74pV0qf4Oj0DJG4W/Gk78bT/aMJ699xm6fFvD7poA/MBo4NJ78w6fJozmxC7i7Ngc9e+Q5k7Ltb0CG/PIKDCgsHHHTLknE6z+vJDk2WOOND2v8PPMAQbbayTc6n3/5Frju4GjHzm787Z+X2369D10PZcyvSUD30myI/ebD9P+cK/beXgFSNyWvAJsl0mqDlcA4QHjSq0OvRku/V6tPlvTCp3OnmxQR4ZPzFENcKMCC505/KB56jjn/Y+FbZ2GNnAnvcaXbYR+3kNRviz7Tvj61gzss4reuiSVvJLYOjl8V2kh4MlOXZqauqdr0/sR7i68lc0PrVF1bM6bqma3wmVH03EdkXtxd8f92KBkZutKlDw3eO8Sfz6mFJJrw/HGDOH9UPGB+//09mJXArQJcDUDQDz9CJIfTG6zIvAFY7IEsNRz3jF60pCmBsonzNH4WeGiFRQAEcMu4OuVBKLTwBiw1KD6kwrSLSjbnaaVrJO7BBku3gKiCUw+aG0Pe+/AaYgIslossLi7rY0ErJCFMM2sk77XbGllkRVfhzsbefYO9r3zYe2ATGQNDZAyNFkbGk3/7tDm2tTk22oz/9FvJryXuJjYiTwwiT+miU3MF/0AJQ2EDt12DgaWqpse8LL7h/HYI+/FPu8/8WhS7pvnr2uSvGx/x8cd8DFtNU9snekA6AWh3kTVnRXnJExlu/zIdxHAaPRxjiDN+yJRe2FokT6OUgQ34zZnMowqgXSnsphYnr+NpEOFarHlbNeKBzYPTaJLEWkqelaigwvF+eG4eBkuOj1sckM3fUfc/kJzd/rWUxq0Tt7hFuLq3S2Y6UosrQ4Kf7RJzYfdK9wWsJAs0c9tNrzqt516utN87U71NxjPcvBC18d/qdICX1BGQ64LSbK5CnCo/2KjiefMJx/cH5+bdy99PZfVxdH4xcd5ONYJZiJyn4ssPueYECf23uYXTXQHHK2/8FcEjupLLXoX8+nTo7H/CLc47e4UcQv1dLO1U8gBv0slmbJu5B25i8eZ82luY/W3uVHWDELsgFM8+vJ0XJMAhs9BTClqZE++Y4gyB53Gm8611lSpGTc4PD3xmsyALq+H2DS5C9xlEiqKqbHV6Il5hzMKaLOZQ1UusiPHK6arX8As3z/EduseCy8YQaBYDvfj1Uma4Dnp12ldPO4/k9u9unvizLNXV5wsOIpO+tAtedH4zwCtLaOdJL28xrlq0hukgO0bfajPmhphveC/CQ5zx5FBceXaOus+FAj/tTQ5K4RSDqad10o+FucpBvlMHddjrQgGDaz+AzA104WZNy5Bb/a297sslQhVtERQxDPFB2w/FUkB4O7oC2eTzglOLT8c+4WkmZRZm1udvF3JVhdvcPSfS8GDc5n7Zys6wEtBRz6ChjaD+6DGozgoCD2iDK2rYhgVVrxukEeGuIYt2ev2pen36iAj8lLx8+Ewu+viZo+ijNbnokzUX1FMF6qmjaPeRXDR8ZCaqR0Ky0DzsngALV0tbI9RtixGBSzjOW8JaqUMqymYJrOjIdaZpnHDpxpMJMIGDVSMcE/dSDcs4MXNYXSUF4mT4Bp9tg/BXw44mP6xVrcoePmNVGECL4Ys39mCTgyi7rrBwnn9T4iVzcw6JpEb0LY0EYV5YIEv3LSFHUpSRgi6KzXPI0CHe6/wOtUrymJX9Lu1Sl1EWrE20yWCx7QIsyuW3Im5I72pdnkk7cCKfQd5Fy2KXLIvcbPS/0ei0bHjcYLTrkFZN3eOmYhrnj7zj57lEau7yWtxSYddbIVIv2fsk3/RDelYC/jc5jXBdpF2pOWdLau3OSb/wySOaV87tQs0bZoVO4sVDPx6RpKP7mRV3WqREh5WVni/wpNS5dbfF7Wb2vGoO6x+Gvc+xZ7BkF3n5SvDnSmcMcRHUYS3LDwviQP7Wge5GYI/OZzsrkDZOjJUXy7NFZ8pZw/NXbJ+NwnaLjf0bpsVc5W8VRHln8dzRELA8IBWK7ec5GywnPVIOGzlsyXIWtGQ5C1niWgGFqE1kJtfZEqmbSdJtllgbl2V5ZHVGlTxBbCdBZjoS5nonNevM+GiNgv5AjcIqKRFS0nM66yP3W+G4r37o9KfhwVlCR981RwDJ8gSLnFIcXzPJtM4L6rJDNmMLb8yTXkCmBXREXDeDqcv+QKar4i0BBxwzjVuJSU5VqnWk/6UROHuhqOGGsyLlg8MSzOKSdpkDtXk1mtzkgrQNVgT5+VailZo9abnwV1pll1uBS5Y2lzStkCUqNDPtipnBuCsBkmUTZv2zIKmWxFzSZWUXsodZgsLV5v7LvVb7leXCK/Onsp0uLsbdxefWV+NoNFmkrSQjsTWSXALgjBP8jjEbXpvVLLEez2CMWzztv7didQqpkd7PgtQWVpwdp3M7oc7DQTju9N9hi+eQprcQdqnrA8OMe3qZS+r6lzNvMU3R08/uzeD9YPhxEAgSYyJ41pngE3LdpupwVwkW3YZ0KMSIwOvx+YIVbxdz5eMZ5/NVFpw8/gUyLIOWM1gkhb4Hl2gzr162783NZmO62STQ+wX4ZuyTE7xO3dhwIZvFNEiA+vNPzjB7MOyXbFQVLGnL5QKWU6c/epH+H7Rbv2LjbOi/JMH927v7jM7W0XROs4n8SZ7St4vWbahNbfSOJYK0GBEnA4ZZcmRXdBPENSczTSvVDZMWUpFGUl5eToh4NVLAWyMOpAUFUiWj5kiLODALFeUQB4qfXY6BXgirzKHbtOHyIlvTqN8DLolPFa1KPNbtZg+0VOy6iU9hRd19m3Fd6rTNRG4AOs5F0IGbxnACCVFJUAeVebI31B2uTldF7BWu5GsbLj0FUaMPjtJQclP4s5M505ZeLDl6Qbuig9/9VRSzjKtpilOAs2iaNAHjyVCoqvZ8EknYciKMihpHxLS/pRHbiVDtqiNd3PnAArKwIwTzVZKuEhlRTQC5GmOq07IRTVGbSx6+ej/RBlc9Aoavb91zRwwXEdCS+3My2rncoJzx1RNwaWRJzP6BNbxMXxzVTYw58+Dbw1cboE2nxUwLEor5bYYxC9c5q4XGhAgnz06I3hR/8W0S2+zxP6YhJ2Il+MfkZhSutvZ3modN+LN/XIDDNhz9ZbPM5TkiicNN2aPxgZMfbNeHSKOwruwrN4fQCaUD6/DfQ64n5RgVFRG9774t5OWkJ/YvL1Cyd/pIqRvch0FIg57L8ccQzu54TQTb5bkc5vKelgGXk3M0nQh10xKGquxG0peZZ3I4SpNVOULjfeVJKscRhgzP77fCC7AbwUUAXA9hfraPG/vbTbpumsQ3wj98imfpdR24xZNpD1NdnQ0dkxRfr2aJcoU64H10gJ1ZOWW9EfMk1cguUD1YXPCcKXhSefohGk5jTNsbXUFUMR7grtgphCv0sZHlTGQ4U22Vc13SSmae8hz3Lwz8hNRsCwmejA/HrpLvuczKR2kYyuee7c2nufks27NQbX84+dKES5u8X9rZgxTISvaGRcl2OE/q5aene3DxVQFbsUFd7cI0G5cKqBP/gwrrX5lOQVoYuPRAfYWa8VJYwFmSo4C70y5sU0qu6yce6gxO/7Jz+pNWAb/hFBrS8yVv4ZuQLhrAhjEMroa96CxSd7z5TX8T+5ocFwcPtchTFbLin4d3hqFI3A6MABbs9OzKuA4vEsFvsr0wkdxMSrGgbU/kzGLslR6Also9IDOfkhiBToXAekfDNfMqeMCdQRbNWf6kVJOsb7gTCuCyY0y5v+DzVZQ3SA++UQJbbrvZbjMfUXvcIDIpBUkjk9GV7BbObJKCU9MK6z4deHnUbO785sjHIaUl5IsWSqpKQExS65ptQuIwODwKUiHuVU1P8smKNrjb03H/BhX+/g01vOzFFx/fIsp6Mh9lRZ3Ci0kzlusUz6ZRP0qflAk6SmOkBBvC7RrSpJSKugqn3moXlJCKj6KeFO9cJ1WRrF5VSxLSjEdW+3ha3cLT8xkBMJHrD8C2nJStg62yovtECcReMjoc0VdMcjP5LXXVbAt2UCNw1h2O1m3x5Q02ts9y7vg7HCUhFOFjaXIRxRyDRKSGVyOXnpMOMrb4uvHru6PmYdtfj0TXcsShaCYuGe/OHzeFcDdVGzja6A/P8bQK/wnjIvtiQ05rK1iGGPKUH/hwxCYMNzaI2WMth0SUpo2l3OmwhztUk9/0JYPmEzHNLS8T31Lse77rteoYiNfW0GUfqkJObfZ00X7qICtfyUa8MxgObq5gW2/Esk/nBEM9IbucmwCLZZNcS32Ex0cZcKVfSh3CYCW3kc5VeV1LH5YyLInjiqQkyiSpZEVCQKrFxG6yw81kmaqKqt1Cw6nUmQ0MF2/2lE27t1m5E4OV5pGYiicqSPZRPp7xM+aQioird0KZ/gzn4dpRd4E8cldOwGl6wwIQYydEnsawALieE1wW8LEAyGkeyNTttgDQbs4I8ZRCBQBeuwEevH4NRxdFuv3GCdDm9xF8VihSJEfhiivJFmVVgN0OZZGw+mrxKZx7225uqb3ZdE+R/DrT/YfN4P/ez3xHyHOe8AhynjMe4c17yguYc57zfJjmOekZxLnOeoQ412l/nxMVtrgTULey25KJEg7v2F3RXf6zLpcOwTWF7w+kacZ3CpVgr/FP+JttfyuBdCZMqHMczr/xLz35C/lkUDJQqCR8Q4PokXt+AXK5OMisrw5fMXk7Zddq2aZ5n/uzhh/EHWRQ+mWcJIIBdQThVPL822cTl97FpnzIuLMWabqwOpK9BONDT3YnE0B4V1g3rL6sOiIFsKBQ8GzfPlwMMBuNrHYlnRwVTnbH9kSYW9Oh9FrWXNlzfqLjy6VOGBxNwQ1GzLkfLfGLpR5WjUrL+ZVqRiU9qarVSUq+XbwTnUcT2+3iZA4ELL0hvbWdwMEdvdU3/PAU5DhYlp4M9hvNa/A7LfFkZSBwo1H/hj/iow87oqLWH3euLcPpL6FDekRUzj8kquSHEsuLuyJBy48q7hfZiuAVYgIWjo8jrBxVd+MWqpZ9ojqJFjxYAi2TxVnCkzUKj6E7eNOMIXsSoxJpdrK4tIEcYEKsMQYHWchwHnWb13iKheGIOlZvD/KS6DgcQX1W03pL9NZ1jfzWco3ccicMDTb4nwvvRdv9aiTKBmfn+fbFPrXEdCpxgQUTgPm5CbtpzW4w/cm2QFhrPLcsfZzfzfXFnWDdTYlF63rsikiqRuK5tWS565aMyC085NOGO3tqkuGV3178V/D4oW/8UxaNCkyffrFPEcehofAOiJmOuJdKgxUUFp9LkLBuZQCSjLxpL66YU1zEoVxJUK4sUBJIQ4fU4dBKQwncMAUHrCkjvCYhnHNJvzQQQhHSVT5+iNkqr7IHT/H70Co1b2eYTgMN+hUJXYVMQ9UhejPNsDvpFGCZa2+WSVa/V+E1XwAH5aL8YoC4Kjt08SSkS9Iaphx9DFRVn1+VcyJOsPNXkTcFWclAgmvNZWsK1ipxG5kih6RkUV76FyLqycZG8LBsdGPgyLAtBe7BDQPb7R8etMAjOn+5APQ6vbAbXTF50gtHQ3YDOIajryHc2j9fzL1uNbCufPSqdyG1aGHDmUNC+wAnRDcT1AqjZ+pk6nJL5DaOw4moi2BGQ+UgKMvFPYxtLU+v4YecYVXN+Jjcy66uwz/gEPi3vGxlSdsEe2BwpUVLJYmbXH3NGTWVRbAzA3pqWiJAJDtNK9FIgglSqjJJjpbwCsJltiGs25Bds+N3omgRBSOXultTVJSSIkHYFJQZ0pOpNdzMoE6haUMXrr4b2NbLzhg7cvyuLByEqFsJUiCu4cpYGv7NNDz7hiIkUcdMTeWK9yBEqTOyw0wBNvNiNLBbGoXYXL3eQcVcEAiuQG/NSwW0PYGjicDEFGyMz6foN5zucIzcbsluyFYhuM6d7u29d/sHkLSpfXiw39raawa//75vvwvrd9huROFxUVjlKcNizLZNyOsxmzBtURvBSPnl/bfJIvs8MEtrkE6bWGdiswTbCuHs5wnmX4hdUiTOswEdkce+ZARgfGAXTFgNydSY8Iz3prYgJmDNFr6DN4pWMAkD1fMAN9mR6rNj6SOlsEMMObBzgs6dtKT0fJPVgHBvNFn61FUEfYnLCrKq6TcZNXIFzBf8En2voX7ZlSpPRcMqnWWQZafR51p2z7hzUKVrFCbqKEquvGKQyFHYNIeBX5jJBpDkuaqD52DkVohRWrCP8QuBE6cyrdG4VkWJ7isrFsrzYRQt+XEFhLWxDuL1ykoBf299zeT0XQmuC8i5lJKGsDO8jvLnvYdmySuuB8aplM663tMssk0zHkio6BSLHHOWml7eo6NoNMpo8AjuafzMKIn2EBsxECTEeFXhK/b2RItUnWWAIULYCg0iqQvRf0+oiZcihG6JjGP4+sfOhS1Cu5uKgi6KgfqjR4TZhgEIfgjM6MIPbPYbM3SrdZSwh2+1eKzlE+eFUKWKiPbqqCLt7NO+qAGRbf1IG6Nj4XrhaYm868LXIesZyO6JK+QFendS/DGanvaBh7PwdkRoC2WbnUaaFq1enLjtnvzCR/ixDc2wuBnI5tOzSia+KtZbi5r0gpqTq8RHFr+z6ifrM8RR9o2UTEk/1qpVs2B6LYTni06s0ZLztU6aPYBsALbsl4tWuDxqFOW2dzYWb9olwLMsjOv8EXvi2sIUp0dKC3Vqir54pDVzdKFldqGldeF2YTbUU7Q5oo5NrnlZM8PGxE9CT1lE+PLBJgu4dkBEljg4OL2EsJYSXmIqyXdh8FGJcg4BzA/5HneVX9iiepDMuyvcD+KBYvcCtl1X/L/YJ1UCl04RsEiJrPwq9ACbjdbJt8w/N35bRZomz86icTxxFq/JxbEBWrhZ0oyloTzZBRPlbgolERjdHtizFKTuDdcT++Vy67lTqt/BrddeCCMDR1hw3yvquvfJBJfsAR0UTmFfPs15WFkgXUF5zkKvxaU8ARECLe7Atf1XB0dcQ3+QjdRkWLYHtDbCXX+bDEQQvs2iLFiozg4uktvMciBYqFNKrz0acgZvXSQX4ozLVUWuU7nZMsWM7erli9f3Jxi47v5C4grY10hXzM05kpS8iCYQHMKqC9lZ6dawG55PO+NesGlBgjAxsJVhk9dz2g8YwTmFMspUGCFsioHCtyarz8jys7G+cwr4aJ0eg0UP1EwC2s3eWhgPijVMwUuXc+Fs3fexWd5ORQMXFJ9UIdC2SwHIUQo6EXvzfTrqpv1sOn6fieZ4bia0KRIS9+52Gdk247Ji07uamSw3VutNcePoHUWX3fwTnoMv1P2qZWi8GQ+vkvt9mY4GV9GHLNgkbGp6MZXYOuVcqA+bkioVXhxDIKXgQa8rOLc85hU1p/KLecwh6/zJ08mdkitnyJF/7n3AAfpdxhuE7POMnuHkGBDeM4y/Cg8kLd59WXAwkMfuv9j82+5AtfsfDhY4KxkQeVKtu0YuGw3C6cI6qib5ldYJr2OiSeeY3943B+QrBkIzyXpGez91xsJ1X1ovVmrurE2/D+T4i7+Pl8jlA90Duxefa9yD4PdpvVp/Zi2ZwJpWq08fLQU5/oOW/E63jjxJiCY2pKyL/MVgqVywsduFWSdlzmQDV5/r7xPu+4QzJ9w8ZsS9sS1azxgv3r/5TLGJDfs9bLqIYWyOvd4Z9vswmnldxuskGEwtg8srlqQShv03qYT8P+3f4wb2S2tCD9KuuY6mU5RWgnp5Br43BAADZI08TM3J/CjEsKKU86L2OdKwGy0SaXossmDGVm9zxdeGU2L6E0ped+2yK5WZVX1lxhRHm3kk9qAxt7inHJcLyluxttwqRiUjy7iZaDNmat1ASwr8Oekv15KcBLvv7liaziH2HU0DSZExyKpoHOZYEApI77maRD3OmzwUvJnXjazyf+faMTf55CeelMmWxrFOD+akpaV2l3XAc07PMqWdM3r2teL7fM40Xxgz6Bz6oH8B1XdDPg22XaEvxP/V62pDzu5e3VK+bdvWrqTEUyU3PCxeT7Xvz5zqGznwqAfZOFrBfKeQQ6I/GZUotLq9gFHMYZFPuc7erbz76c5Dizte9fbc9dpbmEkO+ZmOPXC7va+zUPUA33C6VeKwYxzHul2QkeLG6gCh5BGzyBAucbSkYmZmbwVUyVKc9JZI3+K9ORPw7deVZtkhVzdxy4bpyO+dUDICx0eqA59YjEY654vAZdNDJug51eHMjcVwcUuDu8yUr+gcUGRC6G8LzQbNEV+c+qmxhdKJoTzMENaLG6nu7PzP/QSy11+b6ykmUw9zHfxWaD29ixye5aSPHOj93W0fCZgr+3Q4/ynirzqD/BM3TmgRWLXUwPTbL8ed0QU43TLvObZ7YzltWEMVGV2bGF0O2JX+S9eWShOf1fJMe57LmfY8qfsLIrphx1O+WnqGTk3t/v5wfLU6gD/gDvVHjsM5ztcspaKcihsQL/MI+Xnpx8662WjzsYOoWPg0cQsp85gwObqkQXEFMLBRtZy3gFkly6WfOuut0s4S24hvRiyzZCsE98OQM/Clg+CXwUqR6eKb5I9nrt9wuvDmCNI/qars7xM4g8b8ayKmvokt993E5t0cOr45jfBexz0hM6Pwn/GAPH0HkcHiERzzDyZf/YTcflwtnW7kGV5138fUDfGwE40V7ZUZSyuBn3fiLN4ejrkoe7pVpP5ARs25nK7fUZ32NJnO9RBfeFrjLSrX7Zf0iuFZKIUKSatlVxCNW7WsCr/yNVfpg1t8DlzoQ3n2Gkfh2SUSo0DmoZ6S8ZNKIzt9+OYTX9zrMQ1vPNg0hlCNIwBvSQKl1/wuN+GS3+UGixpwab/FAS7OlywQXL5JpYA5chZpgDcNL0/wtEZxwL4s35/H1zJQp9jMa+VzUOs7C30VFsIteGAwz3oOr3VtG6qsiH6p/qvzo3Lzhl1czufKN9+58j+LK+m79bbACt8g07ZVptUZtv3tM+y1eXMj41J+yx5NChJHuxj2+pthVocN8zqfdWfxAby2HgNZ2rtWLvJ9YVp5z43rgspF20O7mHlesByFYhFjI22JcaIvd9/n2Lc3x1j8mfTr7KrJf/ncMxUpbQbCjNT1qHuffwUXdu8OsmzIFqMB+9qZyPYyntIG/0jPMGh9eou7IpUhj+oQIBnXgb0VyXLUFuYtYpL0LRSOLDkKz8Pz3BqOHPtgsdbYroeqtit26kKyPThfeduSGa6YJ+n5DGZpW+tz6hyBaZZ+6TkpQhwNl5mZ3uumqzf1crJ1BXOhQ36814LxeNgEeZAkjJIydtlOoNHi5ohvkvyw3lr9LAn73SaDbCnmcYxw9+BB+Sj7wS/m4sUzV93R0UsKVqmkbCFSZClOEd0RnWqMdITojlaJptOiScJiBYHb+zqHiUyVjQismS2JjpOYLARGMGe/s9TeUND5bJlVexHMRfHxvcjEMa35WlIf6F5vxYJjoD6I1hXjjRHflLxVuWmhTeFjcDH4AwRJzQKf8CfFA42kuS7syYRy7rM5WFJ2cqDdIUWaKzgPKfHJVGHB0C1cSoAY6OF3v5BvAXKNmZSKh0yWghPRk1g/AUqS+rnD6dzfIbYS1ITKqEg6OYpXVldHIeZ1B8hTl6gXewosoiVruw/5fWcZjeqSwx2SHH2QKv8logWm5l3mpz3uB6YGu+PeztRQ+BM5teN2lguVbwCTSpW08H1sCt16jPRWZMbrXN/vLLkk7FGSLYqh57JCOXc/FmdMrwhamO0sGviFzyoSK4FMXWuDyNCsKj0jHUBTjxUVOm5y3bBrfrCdMOpuGBauqVrZhrGFn5/aJRc6neu8GKvFfcwQi9NO9/1edBVh9KlLUlIXZD8E+l5jP8yqQKtO73luhGIKZx5vX1J3xERv+IyjqZkqxK4uWz1NLejKe4H3coQLxD3vipo+OVQzwuVyLQ8pbwddB/a3FhEDipelxmV+1gBlSIDDUz60kGSm5dWr9xF6CNs6kp+c4n7DCRkypXZXmcKjtq5/ud1RJsBmjPZRfDp6RhBRZuIsgIpLotu88a3PZ3yDRM45NYvilHVEyPQk6UxS/fbLXi33tI6yYrAPTYsle1K1WDa+1z9LRdn+li4J29SrpKQj+Dl7Pw4hwZzuEew2gLI9WshyQ2ib8h95PvVlwoLLVC+stMFekskLOMzq9S7/yd2OyzZjrEz5VQPNfghybQJKd1LTwI88wfIyG6X1PEMChYPecyhs1RzygyoX8Cz2gHZLm05UGwdLMh0JCxUlg0m7CDKgh4r8pWwqLzGo6ZfatTJb77Db6be0dG4YjxkR0Z4nkxYS70EvpcYyrP33wJWseTLdXopERW/3W9g9p28z+kEZ9oUolBETCrEvVDu8d9iUTt/78S/hAXTlqxfswTpRlHVMLsofmMI27nwIqwkl4rcZdU7osjXaroav6sQrDJxBMwGbTwKgiAycUf1knSxbp8ou105cwsfsGOauq9GrG8bApGxulKPOvRhH3PRKfkx62QOfk+WXPQOZ385owskLAWRfgxx6WF4gOYBrGwrS7ONEj7D9cNHovP9rMQLlt1Qr2lIuxLo/xBy6PrAQlpxZTJ5YIui4GZtkaiYh1hcKMDWTEzP5XsG/L2A34/q7adIqJuJTuV31F9P5srhaQBbXZpDFORv8nO24Y4M3v91iQRPhhiO14JcV5syIV1SKOyp5CeGcQf3zUwGxX17OYUwPE+u3a7fNDg2+tKnWZXUNLEeZd0gUU4AZXQy2XqwWZ8oVG3+5Q0zk0tzF0ysunp5lRuYSoGjnb+9i2CZY7bbIemdVNwjtxaFq1L4b1f97jOr5E0fLdeO1nFnr+OzSbv/LTP+2NM6+2sqfZAxJlr1z378fZHw/yPh+kHHvBxm2pvKPMtyoehxn3M7XYXSMUdW3hwNrKrysBCavnrfZ+96F0N1DcXMCuM5+wKqDoiIWWX/Zo/qJengTQ3C/QAnvywCBF5x0wMGb4gc2LCtfhZeKQyjXE19O0wExLonhMG5KBUxxJnL4Efkw+Vuu9bLmKMJ/GMI06vR69vSoLLY19hVURAZSXHWlpoyg3YQJnZRycq0f64Rtqn0TgyBZ7YzHnZvucHTDzPBxJYA4hgCK/Vdapm8V4WhNdEF1S5AEe7O8fGKcZM17KqQnENyxmQWSxLaZw7HrBCJ+OzhByWTLhZ4qRcARq/N3Y5IM4wk2BVW7mdMaz/WCwNdRVpJ28eCrNZiE56C54Y2Cnxt7b5p023XieKs481i1HoO1HgjWIscuHXLnjbekh/y+SDQosQcVjdRURdHf9KIJe1DRiE9X/JknDyFUH2fsQ2SCZX6NsK4nn7jmrxAHXyUym3U5GbHlyymE4mjcOzG1MVXb+YEV+fkLZtZmPgevwk7PEe+N9G5gFY87UT+YwB/tOQIspTXZdSKdoc0Tf1bsnu8Pgm3IOH63H6/by5l7TvWw2tvB2tkEorvueSjmHmE2UAVH2Oa/kgLURriS1ZhtxFOjnuLjwQrBTib7cr88wlUbXxZhWySo8cJy5JSShOes33TYMdbtlfmtI5c5IzfBs2owmVDbvRxzieW4bQajf8FM7M6eZMQt3KGEtIXC2edF9mRnkySx7PmzfacyXOnrD63ZhfaGwxHMq6E0srxCKX1D+nzhCzYj5Zr3tGnERjiztAbR5J42jqyRYtE7GYVcroKnw96N5gSIoogQmaeYpJ54zp09TNfB0TDWSiMyJbWJigaaHMisOHq/EeilJTNAuPckEM6iAAjsNP31ftIgvNDFbobaifV2PlseDIGddf/EcmTA6m1Yr2cSi7MEMyEw5tOwnNQLupwihYF5/HMvJgb303Ju5iY7Ys5ISKfeNvmUSO4LUCmXPEA2ceUQUDE/HMZvk7onq3i9sBMNYpbY5NNcs9/ZDza/6hif3uEa0qw8YI5X2SNHGDVeaFSKZsyJMPcjWbaezH9vYJUjkr5vaoTGfHDR0WUHclZj9jcwQLzqxBdtcxdrWsmrDnnnZKcaqc0U4XrJ4lR1CJR7xkJySk2TeJYdPpv+92RtamFROAve1CiyOZwp8obzCOZejRJ7nT9uFI2MfZE0XfG+oJLEY13I5aWy33Wb4useGM8g7NnMCg6vfm9aDgfvq+rM3+XGR3n6Pgpf5VL0V1QWLOL0m1mdC5pzbHdzvo31/r93ORXn4BAk4Sg8c1l+KQuvqFZy23P5clr+1uy3lwWMrPrFgnzLambP5c4B78GR9nJ9gUr1Vi0XEHGJ53gGOy8I8hwzcyqnkRH2G3MgsA8bKULiARxNLuQlx16OuPql5lq5FI+LOnk6kwOk6M3J/S13pt4hu3NrxumYOscN3wwijPWHsZmlqFkter5W6Ir3MI1Ta6HSEPpS0Rj/yac9ohPf59znDXxhAWCJhi/xVC8cYZDJOD11SVBd95ckGZRMnth2P7UZ4thjvbq7ni09CrSHse/rLkOncyYZiGg9UCKr11xJX1nlur1yPSdjbFf0BWDk5HOlo8FDfZTeM9Ws+11Zctw0dl6mTbqopZFg+Oq5JeaAise+xZ7ggBrjS2vpOsmXyJYv5BqvW/vv2m8OD/earyFWd+Pot3fbBzvNd4cHLTpydyrOs6mXf5fndoYVmImCb3kZlk1Mu+hNWSA4CCtvd6GUg2dsDV6vDkcTiE0GuaFZ4fu1LbFm4dhkAi6k4fAM23eE/nNc4yBZ587x6T2uO0VfM+PHHQJDOOZFHn1sd0GWhU2FTaY0b3CtbHduYH7BRe4OeUzAvFsU897PzjyN4UTEOYlVp2goXUofW47QGWfZfKnn64nWO3bFPU7D9QAu0SQaDnhzvSK5hK1Mo0RcduYKnoxvCO7XkRI08zQ2sRHs3zh0WoafoJGHLdBAxyK1ooJJe/bD8wLsBaW/s9dc2Msv37qFER94c2KusumZh3l+yPyZJkrqOfV+K7yAvRxQx5U4ejSOPmA2EaOCekdJADfBtvbbx4397aY49ybArN+Pz5p65ROaPWXNyvS2G2BZ0QIyBFEbsxhvYyWOGgeUiZeKVJJ/sqRxIUVO+nbMo7KN6ahsYx4TZ3z/eV2QgXfHTH1O9Zrx8MpPZNlUkImU0R7vFTywS7LgJ+dGUUEqeE7F9znj2KeXHjDCAh+eDIkyHRaot7d1HOSxmHqAkZUgLDazyWzRgaojxhrvEwZYe0AJEhZjgA0bhosoz642XPqf5QisUwbyIlhC9PUvqUvwGZwlABSi4ZM2xdvF5nji04ClM7lxz2k8sKHECErsVlbwPcHriJm7moJ5MeHwBad7cTlkEw6JyeQ/TkIQZmH2kyM3zAqXGGz98gVr+ieDa0BQoPvi86D2XdokKsf+cDI3rSOF9R+tePhOrv9eTeW74vEFRMGDe7NiJLO4LYmEiaF/ZMW+qyCzqyBFBMqfUkzk6SzfVZDvckfseHAwbVqIUh7Hbq+5e8xiKEluf0aho9bLV8dYqO4otHVw/IpBWnMU2j/Yb7JCD1U1SA1un8zQaRy++eXgaEcyyGDnePiGilHMUIh44HwqLn5SBV6bjZiSM4p/GY55u90Li8EqBfmTmj44XsWnpbLI2uoUEM/1quxo/Z0CwJaFHril+/5O0r1ric3RD88mnsLRLaaBI/WCuoHcLaGoWM1y80S8SqJNp2mcTFEpy11K3syYGFYQtiTYC1nr82eSQUqlDDyiD5zNim/K7cLketc+bGy39l++e904+ruF10DOXHTiLfAbSatK0mYlSVbmpEvqWh2dXzicq/E0IRmAIoRzJXlOmvymqGahWd619ZxDdc+DEPLMoVRi3PUvTi/QTOD+FaPcT1zmP+dSHddQFMrle7+EXuICSqcZhJzhWUVfBNUFTzcI55KYnHiItSfpgzF4lu64FTjCG0vpOqut+pbGIgRFAb3RriamOtf1ZrQOPlCgPzH48NncgvmkUTfUdZi1WfEo3gsn8OFgvBOdRxM667j1So4K6w4TkM6AmhfTynxPHRUNXjscgyHm2un07Cwcr2tP0cHkoNvVH4MD0rB9NjEUIAY59U5yhoR7wJyXZM+idj/qhmVXXlEjb9AtkU4hHqM3SKnEwfH2V/XepeEROjjsWbRMqCyCxBHXbpWyG8HDu6HKorCTeXw4zcVJJD6r1Z+eUCXFMEglFRxPqH0MjwaGC5ZSdh0zWZMZPzg2b4Eyb6OTH6rXT3aToPtGHOz95q/Hz/XW9GZQAK5jNmmqtTQbsUrsFWiL76IiqxEmvSoAiF6ya8/s00p04vKkFSSEcq5I57k+o8nMDZAEcwmGb00xkWC8snJpwdjlbJnUVujL+14zWZ6cou2yPfHvRxQ0bRyDSsI5laTNCpsVLPJZ2eKnxaoXqZ11DiumAqCiTqWKOl9E2EwGirItc2HBpQGVTSydn4Z0TMtkM9MQlWkZbF/c3r7vLGJcJt5ZCGJALh6ASHIQWdFmuCIFBENHmDTFFs9asa/Y5n3VPe8TDUC5J3TpuJgKpR8ICeGUD8xnMrVSXaLUA6wSodi94AKxksmRE4fz/JykhOKbSYsAj3hx0BWF2DkRDfL8Zh3IEMGyqnKEdCL2rKWaZwqzghHAIrt/q+cmZq5hR/XQj3zaWmbkvbuyozzPvApAi9RC+zGsWro9lK0CdxfH3PhvWw/MhSQVJd0R7Cc44UilRsbaemViVC6YMuGbltLaSBWV0pThzJDexKGHgna5wi6BmUKeFpmXXFdkJnJyhBhA+7LgZa/yXCauT/IuZA3k84zr3JXi2rVS2Fz1B3+i1UVhuP/i1cXz1sVcFx3SRKTY3IMOHDCoT0a1ilZmVPe0E6Wxyq5GCEEeThaJzHwsW8y2+Ou03TLOu5UXgJA4C0AD2aguvshrF7UvS6DOCNKXftMBnGnNj4L3T8PPn+dOQxvIr0ZDreJa5YtSlX1Zuz8SW+H70nsQnsM/g+By751oPUjxKsuWxr/uTgddPOLFKMaw0p51uqGsT0bJQw2dT8QBZHL4mPWuF551MARRrviyDOIh1zZWsQZuvEEnqYjgbJSuTjdHcmpOg7zOfJus+U0FfQIVwRTmH8y4wugK3sppSZTCptx7kIxn9DmY7kZszHQvDDNSLsHqYuGLMtK9ovLFGCy/mVHN1dG82AMcRL0QrRQONBr8ORxPfmmXCGkJ202QjrBjZKaq62qD5YcasVTB19Ud4+AWXm3iq6ePUKQn3+rV+lPt+7N1D7xeDcfRHw7EyKarz9Sm5G8d5Vvt8dOqrQO1p9VQlH3B4VSrct/hewffy306swGrVx+dyQ2vATCi/2rnG3t7ZMfZepUpzQ4IOwfHVggKnmI3uPT7YIn1UXwbLy1oZ7lQ8DMPGbH0+xRH0SiR1J1Wq08fLZVzcXyz3/rVhWcQZLjlAmtHg/N+2OYrrRUibp5h4+LDgBzgvOG1RAaIj4khZYohSnLgs+KMidhXVsWTIG+y9qyNcPDYjwubM0ZWho5hYgm6oqlUltP9aHDUGZyHOmW6F24KcZQ2GNqc+zZ8aUO2Z7SDqjR7COeKajCRV+B9ARFFjo4OXjaOmzrROGIv5DqQ6mjv4Bepiibn6WasMUsKqfUJeUVXkay8q9JKofCDtUIuXbdbfpT1a87KjDxmTRQ34m4UiX0vXbKkAU+i3TAe5aa2nLYCCwQRLyeD4E2dN8XIQ0TGtQ5oAfcO1q49XNIFfZqpNT0d5dBPK08Lj+morHIYo+O6zYTPQ810u+FoIiXUS1wBzaJo9GrIxffggVxlND2FI+AgHaiN9mQMwvNF0InTZ9QiFePwCJtWKS6DUQ50a1Xg2SEzq3oh8PxjTLYAcMPOVQo+HvWjSSPmT0ucFoq5PhqMpop9kp+LCFN/C0YI4pmMg+hq1A+vQgxgljxL21D5MhHt2mHBOlmISffpGH2o6AK8DWaEbXIE7IAg2erkRpQiguxlBEoglqz5msHNbJ8VoN0IJxfj4UfBcO1p90I02rxG3sKtgMUUbGDINEGbdTjBVBihyf4nP1KBgEfEd1p3BwVjORiIU1GwJPiLi8X8NsTYSF5++67xETyVlwQyLZZOHs7t6359ZIkMobw4hyoxh7cqeF7WzEsf7tjYyciIzIKowJmtvaACH/oFy+YzCNFTEZ4lJbw4LcvOF1CU2Sissh1vPJ6eJtIlwSwL6cTcHAEeiH3O3iXLaKR9SquGmUwl56yEC2gETaRvyScXij0kiRSHOUHH4blE8pB+9l7kqMqbuNqgO2mb0VWtRXNWMaL6pE395D33qnORdH75tO1+p3zlbINSMhyjiwFbR9u4qvJVMF6Nsy9vBu8Hw48DDOhXIobzo76slkDdkWCtwgWR5lFzJ/isPAXP2v03e3tl1Wh5u3C7IHsyJOuttFKzR0c8wj2nuzBYBdxtWXzj8PghPT8rTJ+wa12QZniYPTFv5Cn6xCT19zJuDTX3dyAGzauDo8wbj7hZlBapZm1yHe816nCbaREJSXF8ipcehG+AVHnY7+11xHupG6gLgqY56EFgM3aBS6mF7hws0jl/kiWKSV9ANf4uXbTYWab6LHP5V58bvuOqd0tSDPNaD3Emp4WyucWy4w57kqKTaV4joZtVkhS7L4JB5yrsvZRGV/BLusbeKk9VRqmYYyzLAJ7sTGYp5gWhanWs0IQ7BU4Up0Du/oGlX2bBkiVnA/5utdsZwYyEXr2UojTXqpLk4syr+AtrUH8M5ATbfCCN8qtZfk2jMMbM03MHKdWOt/f1mkqaXHU7kFKZ/ad0f2KmKiDkOT4ZSt8UYCLrspbqUSiYnLAQBEsdFRD/F2J3Yor8BFiwmX40EgFLYMWYK8tXUg+Vg+sm0zLIlYtcOKT29dTQWrvqCmHIdzaUV1fTSee0H8rkE/noeQzKLHA3iOwFMkIsBG3oDwchinQZA7O0NBOxcNIT0j4mj5sxoOOEquYanrotMdS4Uzz/uLGpdGY9WOZBaMkAD4LCcohvbQqlbumsqC2R61hOhT0W95893M+SLBJW0gjGIQhTnTcxQuanopMC/aAIcmDhfGKAbANiQNk7kkK5CkMxs1spkEFlK7HmWGQWUF2IzPdUsHujlKZymGWEjFJXDLWI33pHI2kKRVIYpASppF3XMzbnnPjJfa3Ivcqpl9e5itIN0uE/UY8IV7HU41+4+xNvz+U12ZnAIF1+9RF1L//ZjYGsVyi3qQFMyxLrDyXk/3rwIRyPo164oFkaUvFm2BjY/Uax6tEeaSoZCzWWsox/q+wNo0OJ1ySRcohoTwRDTZB60ULlmQItfTFCaALaE0V5VaCP/t0ZeazAxcRntYuTm1erlmdvcv50x+WuZLAf2qIwtAdYukrkkIgC9stWxsY+sS4IPTLmiqLZ8kqQaZZ00yu60uVJyTxZbOMVUpR5tCeZQ8XI0PC5gH+hKD23xqL3YQiXKKTBtLICjqjQjwLmKsG/vJDTWS3YTeIsTMDBdHJwxnetmVV8cX8oYC0mGVvKfhjT3U9M9ckexYVUvw+uWX0Y9EmoIsTMi6AjAqqLNqdDaasFFhYIESL2Y+k2GZoQH/Vj4+xNaq1ecKLYGJ9P1cOExQRAtzMYDDFJJ4MjY6tvvrNWszLa8qrMr7wteAbvS2zDpdbIrXiWJCe77iv2YH3puq+ZlCmGO77ajpGCxRGywxI58AxYuSYCpVeEpSCx58hW40TsgdazbudJYWOQmC8zikkIKsYxdmHWMI4JonCasAREG3egrQxmVrLahwhIrYAj5EOW/BngPqBmoDJyUAr28WFHSep1qxDQZjVkqBohtliMcWuomrsOuPsoV6jb7LkB326VonVjWkEwdWILKHK1oWE6FA63tmtpOjlHBflHGNgSWOFERPB6mWYyK/EqjgZ0pdlJpExZJuHcK4UkNZhsfA40sjVhVXlJpdZedT70MdTVH+3K6o/1ZYuiSiqpSX/CSVsycxq8atFKTeOnnRSW0ZJtXPax+vPTwrFDo6zmlMqSXctUICv3XcOYAs2vAvJzsfREq+yAxU/QtWHCU8w2LDOYTpmHNVO30onngFJGmHBU8mul5JWEArLB1igniECP5kjBAe9j43L3LHqZS38oEB4oZqjpWOYOS7pI6OPThxg/E9fKzeYOt3pjxko2X4QRnFcuW/V8+/5IbAGE4Z2leFwsWw6SzM7H5jGC2mU8uoVZ0Jjk8XVyxEoBE8ZmIYL+PR1OwqNw1IerLLhrSURTrO+DSvEq68/BWWnp99+XyomcQX9y6dX/pG9IIRPrh1db06jfA3UoPhU6t/KYPBIR2micHZtQuiNeww7wwnqcRtwgDB9dRBb7w3yy2RfsARHf8HS1w/RG3nvX3disaLfs4vhTt5BMFEUOyxyiLR4GJj5NrdHjrEz+Eis892BiII1OiTMoMztR1jNm+Ca06YqQcCp9eKXm9QiuLIVKVxB7GW351LDLNvYl27Y6MJP5nq7C/BJTnfdNT7jEJnHovTNQZfrsyr59DBPu/z6I3+AgymYse/d5g3jihIXyBtIcEDGI8XBsOk0JZz7xekMGmvmLkRE9QfrhYoobTEwmINUT4pDDtPiNZVW5eLSGsGBAbE5ywvGO9WyTxt16eOZhV8u9X7fYTbzUcRsPZrcwBlUSYjxHMViQ4xiGabFs91KbgXZioiQzLIFi95G0UE/yXFSG4n/+rCORaEZ8nzAOYenCHcVz8YDpD/c7LMyxIDzbn14RWqqV9z8tudxF3URPWj0Nz1lGD17aXnbWyT4nApkJpiHuKLsbk7Kx/W4Nfa2HX86ZuTqPdppWz+u734h4BUxML/6Du+j7HFgLxd+w0A6cKxK2cEckn8ccZPOQHSIE6YZaTD84g4GTIs5jzCqxmJNjPWUzvNR5u/RVkc+kBrplRn38ADi5upAYYxCgNlOyk0k2QJUgd87I84VzLIObzLlqufyFyKMThvXuEzuqYx+XCwVVXrzl29g4+BgBV/SwZ0G6oLqoK45WwaJ0dcpubyhHrBiBmFMoj8dEdZvN/15omJ5wsk4bFASquHqeri8c9/UZF45c8ZS1k8zDlWCpuuSmZ0nUSs0d4vuL4NmX4lCLFuAiab5AT6wjPfDepIMMEovsAyydt6BIWtOLzZmW4zuvIbK9kQkX58KexwYpK2TgUm7IHjGG+HId+3iUcHPCkT/ieTRMthSl/B4p5uSNDKpPPwTj2O8RFVYbpPkp8Fifl+ZSUNu4tQeiZmdrY0GlB6gTozEPty3KQ7tokDY63JSggKzIoIrmnp7LHsrmk5saJQ4cdohM5jXiGCKrQKHmeAwH4iEuYK/DOO7Abeiy2+NEsdTx/hyDhqJb8OS2fcwzmlGbMCifrtuR4SYnApvEFvUl0UmEWaOf4GEznBjG8+yODvOF3gzkW9tZ8EZ8qQ9uUdszlxIEr5qGPbsxTOoIjS9nTrFACcQpGxwbNBgm8qCFMCuT5mfmhudzYikNUBJHbUNyrU7sXS+Sgkr8g4PTy7A7iZPUKfvDwT7ocqW06Pq3PbzsdB0PEdSLWsRWQhpyKJ7SAidP/0aPJ6bcNOiimE3g511X3x4OxAVQuEwXnWHEARRMrnvr/+EsisESJHZ8IXBXj36lG5a8mDMuggKOvFUzCQkbEmOW6xHwe9hLHPD0MqarqOUqmDO8gdoK+o2ylVt5er9MdV9BFmy0lblCvSTnOolzUts3VgFHiV0Gct1TFphvUtGi5zZmzgva6cE4yzxIz12ZxrycNRqCzsp2EZgc8SO8mYeDHbLAGW+zg2N71YkGOOmBNWPYaY43fuLB1gNlbnbYavQNzxKUFsEmpzjNFjGPIOIYbfsAegzaSs3W7AYnxwMRH6IQAuRa6blesjWCjdsqvxVe0ia0I0SEz1p550FLlzdBmfWvGGlAXazuFm3Aqtnt4mFvjvLNdS1JxXG7wqOSx0LZh2PJO0YC4PSKYYsLxZcuvWAWva+IamTTazy9OSiSf1F1+osR1SEDSF3ZrSrnTfuZpvoXHPfM3fsckUj91SqJ567pZ0X7pOmb7Bm80xioRd0HDq86p62xe8/zaCtUb+NIV8xZp2dEntd2Co8kRbR6o5R58YeyeuJ23OGHxThk5tX9RN1JXSwtNfWb7an+6vDwA2X0WA8tQgLRC607rzuZMNO486pvihnV5NSXZFIXGmrYE6oDWmQUN/o6PBJ5M9aKN+rJbe50Iktgi4q/zGC2KHqwaCoqaZEk0d3mYjl5lsYScVQTHLbpAK1wbwp8qbJUVks0afUvawotfsy3dNMQHdm9Re4HmlwRSK7plK2uZ6IkufuXXC1PlopLXDWcD8V7cqAfsmoW9YeqrscEulVC/ghf3iT2khFmJ82Yop1TsZdKhmGtABNs4oc7eDMd/if4fa75e0tRAwxfcJ7/L701lnzioESmW/HwS1/Y++K3wRxhqUgLpHorYTwcJomFeOR4EWtLzfvF9C5hKbOHdpAJpI1QGuJBK+FwZOTNUdzJ0c0Cg7HgXExwfmfUPwuj8vHyZlM25Ed/Il5lt4NUDZRQgMy4SbdmMDvt+lLqjMf0zFQF51dNLG3IEa/kumk9uXF+6UBcN0DOsUHVriQoHTevfVmui1l2g1isEiy+TH2AFvWbdYYfuYfHDnH1zOWg43MtnvC12UBfm8TV5sWiufrLjjWEl3ZeeASP0AilWbY71sAINhzNgAjOYAgzBkIQ+Y8Uu+sssTDYaMvhB+i4vWa4DEMaKS24wrrpITccXXGG2bCE2MDom1kOHzOmlnSHel17kDEWf5Nkr/G9sMzLMAj7jJv53DJEgRQv17xibDadfws4VbytzapXfdfNZzYEfG63KteF87uvBHZTGpNYN5dzs4nzBk4SmGk27B2M0FaqWIcWFQCL1mB+Mt5zFMt3EsAP3LNRc0W8XbgXGX2rDJFzSnqPSVZ7UQqayw9zhUBp3wwmEEQwqbPAD0F4Ai5brxY+UdH3eEw5CAEJlx/DcdTpQz6lGEq/ae2g0rP29PHDx2vPavXH9frj6qNn9drTPTVsqxLvrgdXTRyvR3JwFzOqHbsOsU5EGtW6W5Jaky4enSfKTaRrNkwbw9LQpQxFKQZsEoCGAdHeRuJysYSdea07nHCdhZj5tnqJ8AgnO4DSOBL2WhNAhrGl/qErDqstAmtWPfXqmov9B7HVJiynIBVYUjIbAXzQInlR3TM2KxZJyqfNftK+iSfh1Sp4xIftENZhfohEIivIY8WX5SMV3JFEwYdHkbiTPkoC41j8YgvgZNt6ce6h9ltqA0lXMh2bX2KbwE2en9h/2DguBb53eJf+tVT4Fq8a2JvdDRAoG/GyIS9Q84htlCHnGf7UkqRiRlFIO6QWrVuL7rReto7log+tRduHje2mXPSptejhm/1tGWqtai26vX98tCcVrduLbu019v8uFX1oL/qq+auwKvCiT+1F3+zvyMRCVG1F+fhkUHd37UX3Dl81WNESG7jPbEzK1tL7b14bpT+zwbHVeXnUOHzF6zByf/au+QscBwdma4wQ7pq/CnaBmkDh8rp9deRBULuTm1Eohfs6keYjG/jKV//KuHqZPVxmDEa+mtvD719NEmlkZ9z8n/yVTaJlmEDLVephjXpYpx6uUQ8fUg8fUQ8fUw+fUA+fUg+ffQXSMXnFqVQln9bIp3Xy6Rr59CH59JH+tPbYePLEePLUePJMf1I3+lE3+lA38K8buNcNvOsGznUD57qBc93AuW7gvGbgvGbgvGbgvGbgvGbgvPZojmzDVzRrGbbqGbwkPa2RT+vk0zXy6UPy6SP9qcxL4skT48lT48kz/Und6Efd6EPdwL9u4F438K4bONcNnOsGznUD57qB85qB85qB85qB85qB85qB87x4SVqzbte1zN7s+AF0nCTZO5F/HjNy/gAK4y77eVpNc4sx5eht9+IEvWqpTJJZLnmpCb5dx6pUYwk6LD+mKPVAMmWS0HlKzaI9cGPc6I8uOnaYokvYHaYpu4Hxu9JOBFfgNmP5c2np2dIKZqBV7LcWBMHc5YkgKOduBF+OO6MLL2BMa3cDO4QtYl5vMcc0dLd6/aTp2d9DdCH0QpGxvxvF9qjTDb2AMQ3PDexVeJ0zwBK8bNthgXbQnRRglye+7LI9mIz7XhgyceHGkcfKyEGwwxD8wxdBHkAjB2aDwfynL8xfhuOeV59xR0l1mYmqYd54JIKQCZknuyfs/9quHWAO/RJi4MufWLLzZZaUvQyCtnthhZpDwWTYMqgrBNTE6KxkAY4pm05yzqVngQdpuNU8bm1Tpsk0l+7z50LEnoYA0Zo2l26DqfC54KXr1N6Q95rHx82jXNB7IVYuCLu10zxg0pMmTbu/PxxfrQ6GpcUobvXC4TnK5Ki7WC7aB1QethvtZn43kmzGBVtgqq5XC2ly5oItHLeO95peLRxHk344Qwu/vGodN98x6V6ypbFW7KQl+KkFG3K6c1b7Xbt52DhqHEMIysCI+aPX2GvtF6uAJRnTSLVA8Ml52iWVCXUm7RY7Kk/M3xl6hPLy+lmWd7563Ssn71Ajun76qCizbR/AanGwZyUhjSe2lr0QMAq2zFb5N43j1sH+zAMILe83t4Gm7yRoHqOy02i/Klilfdw4Oi5YB2L2FqxxcPyqWbQzrf3Wcaux9+4fbw5gRhSru9vaJ2sWZtGCgw9a1DvrKiBerE4HeLjG2TBl/2p1rSrPAPj+jIzWJdV4WFNrPHycV+OxVuNxTo3d3ZqCFXx/llejXlNr1HPbeKjVgH4Une+Ndrv1cr+5U3TCP5An/Jv9BEzB1uHC1/YrkILbsEi/2z7YAaY7aO0f25FJdn5nEH6C7/rYR0UgnvV6Cu3P4GS/MFlwi0WhIatDgiEFexZtghmZ/SSdh8zVli6dcZIF4VlBJNlS9WdbT/NriRXKR8y/OTo6eNk4bnqUzaZBMXm5WVxeHh5ZpokYMMGagsfg3gQcB6dL++oAfEsmYXGW/RtMzne5GkLCa3Bwus1iU2ffi8oH3MZ5zkIhH0wmBBnD1MLW/st3rxtHfycGkvgxl+7tvYP23WBsH7zegsUZYNwdn53mdus1LNVM+LwDYbXVPJoVK0pnKudDcnM40wIcCSZVXio7covSrIEuMxDG5zp9Ivu0VVKbQRd2Eq1BTPkyglsYhlLSfeB4Hl8I77TIuGwR2Urmt3WiJNuisZKivVzq/SRv6wQLS9uwirxjyh+L5zI0CkEGuiCCEjoCQamRwghK0CgE2VLBEFQ2clRRxqasqLJloIpy9wBWVtIw18mxhjkkxpot/VQhZkljhVLGpYpljToaZKKZFRJCmirEpDkrJOQ6SQ9cCzg9+KqgRQcSfo3wXstHPcucezOIunCX475nHZtrXlMvWXJ54VSbJYePD1r+ADZfH/ytxYqxT45C7w6Pmu3m/jHjwayG8thV/fXBTmu3Jaam+sin2rstmFBEXfbcBQCWosOD/abgG+2ZpeKvx7B/bcIOtgWrhTB88erUGxoIzEI+Oyrs8zvv+SkZ21hxxfhGVcD1JRnwCv/6TmYAdf0hhTqzHbLCiRnRKvu3k3HwFa/zXwO81gF5w4X7LbbdQvpYdmKsT9ZdGtVCivMM5JD6S604Em18ySFBtC4lb7LJm7ugpCjM0Lt5rqdeaypbSfnCWhHf3hVYZ1H55iWZFj7TqqLk7aEXlTOMKCMWlSFYlyc3yZoygu/7eetKUgiv64iPq+LoBK3IpT28pxiuHh0cHEtdoFERycuMNS5DJEFA9TUe0dckE/dtKjWZprvaWihExkPYoPyKUAoRMBcnipzN/Zd7rfarMo2v53i3mcN8zp2bjLsKwd6C+6nvbaD5llPauEt1glP868pCwwoEm5b6q4ADGwMiTLiyTRZgrHCGZ7iZKpKQJupgLyVv8BlJqM/D+el22wMhN+HK0HB84zCgkCvtVK0tMMHDT92MlAjWd3zl9tsZOyw7iaCdE7xU1ifwCkB7no8dTb3+d+pR1DN6S1Nv8p16FPUMaDT1rpzzPt22CBgkiKETBD8oc9R/7RY9hpWQhBE6YWg2QhJC1wnBYiEkNfmeExJpHyTh9J1wOEWdAHwGxlH/n7Gzvn6GQILI6YN6qEBCGDkhUKcMpIUhb3j5sQNZ9cxZdffg6HXjmK7pHgAwCv0M5xfv3rSbdPUc+qcHIOQGKocL9XN1EkYOAsZBOwkkb2ru5IPIHTzCTk4C8pkReUDaOSKzcQzM+NvrLQs7tXM6A6MK4uo3J4j3fkLbBcKHEo76h5Gzvt3TgQSWM8Msrg/kYqRCKs1nzZ6PJpG7Qs8ERV+iZwKiLNK0pvA6h7Lf/Gke3a39nG7N7zhPXbDvMEwCAt2ff+b0J//k36crec4AHjBIfzt6Hczpkt1nwAMNsXzP1gVpAZ8JgMuHwWcDIrk10II1j7nzvet8euHhcOc19XfuDsTXz9B7st0ZTBGnPx9+tfkB0st8DgPIysps9NbUlbstYXcBoqgsls3u9r1oB/MyNOTv4Ole7fy5ezUbmJnUHrfeMxsIUkGwjFSNjRQERIZ4MOisWmHOoWTZTp9vnRNbcGNvz3bMDpEmCLhPaLjsMhtnGLxLI5KMyhfX9PJwdYQon93E07wn+p3Be6M886SgF3e8LWWUl29GaS4ceNdE6i7czqoEcJeP9tLAix0GcPlinW7Kgmsa8gFicvdS6bbnGaDAr4P4/UHjx+7vKWNX52Nn2dPjxTyjO/IlPE364907o7x8z047Q8XDpDl3v4Hd/+eSxQkoHUy5mV/lwCJqjcvOh056l0bHVPWJli7dlLreWaK1HxlcdtQ2F3DpdRoAVwjWc+fVIpNeKd559JpzB+dM/nnRS7soZdIruyy3qFCIukhn1pbvk2H1vMtmJoS0o3njJVPk2xsvmZvuMl7atTOTXpkQsV1KJOqEcNIc9oha/IVV9rDriGY1+ZqirdbB2IKp8toG42+ctwYTyEISjlkIfhMSUcgP3qEHuEMHNHE+nosgXc4b6qEfUBemWanW+WA47pz2QxMiUcgGj62xWNmEkr6y1f0FwqGHcbpIK5Wzd9aetA8gPc1kPOwTHUjf2Wq/jjDxrJgCipBK39yfu2q6V8niheH6/7oTv7dfMEpKgBO7roPLPu5mFAsvlLi6kuHTR2lYkQKaTVGeUXfSE3hbVyMFZJnjzQDhfSe8IJXcfWLAipONKUkZSl1bbI8clBCHoFZ/ivhwlUu6oM+B5l4H0UFzQPargvaW+Z3/1KOmeJu2uyj2Jlm0gju06L7MTDbJ42D4tKk2KPycc26xN6+Gl9HiTLA1j2ifhg4xQdJgwiLrztho5kvt0yBPvoVZb+7UmHC+LtLiFuphs7UqeW37tLg9vBpBzvgsjZ1/c7SXd16jLKBx2DuMuhMzAkISnAJiSL/qxBftMIlhLsWthhiNgO44CuN14hXEWb4g3gSjYZylmRT+k1krJSOwsGhCCg1Ze4zSv3aiRRLmDUrlSlDwL0EdlFmlcGM87txg5gmIny23UMG89I5iHL5Uikzz04VlF/KMxmaqBnwAF+4EYd5Gwf+KjyLArYSiSBZ5gUsZNEekAhE4v4WQUOCoGJUXvLO6XrCkZaI2hDuRSWNEopWysCi9ZTkHOr2epZdVDOis90/N5oe5iDNiXFRPzNdVNpbXE4Mu/GUubXgxN4FU2iStqhBsNMpwRxfnYZyVSerDw+VlfBs53qldZF7LQ5YNQZQU5FN7ADlZO1kof3NsRN4XiTpzY3vWlDyJiXQUCXoqY4BUgLQuGX3XtZfK7IWSouf6bGcsBq8wtqxUKpnqOtQLGSrWs8gCJyku9JdpNOkBjyY9wIDVwANlIrl3xFMNvZVbTjsSXySTBVAz3yfzBPgsvtDqi4fYPfUFsq7BeOoLletubTJXHiRVyl7EdGRqZnOFhJfJeqF4yCc9YrlOOrABUDLrxOMuj1k3PDvjH/rRVTSh8iCwfCe7kG/oeMhDw7MqrHgF4WRBw1W+6TLZlO0c2HUCTCoLQb1Z8wBHqwKCAsfv7AwEgVQRPvFEEgBSq8FkSLYn0V+PoySTMhbcDI5aZsLsZDk5P63V0oLkQm9IR8R3w6RcRoGamwJQv2zy4aSm9KmmF8EcOIgrqLwc2X/+8jf2pWbFXMfuNghhteFpgQWJ/jeos/TnGVggVgr1qOUCMe0Dt0+qJ28ntRNbOm+k1Qs25pbk06eQcPk9lc+ZtUPXScas5jFmyoqU8gWRhPvWEVg+qbgMAjGjDJmEnbHmpGbcfsC6NHPXXJHq4Z9jF5vtVNk5m6T22cptY6FaTqG9XShUz4PEnUKg5FpOST5CUPBhTkHk6M3gUU4pYNDN4HFOIdhzHfJGn+SUFC5M6MEEpZ/mkQbKPMsp8zOSOG8gjrFQ7kAwUPXcUgyY3zBoEwUr5g3Lbuuoffzu+LfDpgeD7TWysk7IQgC/PQENgokSJZ6rtLXCd0LBSOpkjaDqqH215ALMesEyU2xmmBLZBdOal1rNS63mpV4zRRmSA769REVA3SHwd3uA9ImZhDF9+bPr5V7O22P765+doOGtva6zqrMmYuR4bXlZaPD0JErJAHCeJ6ArpUDu5BWRpISzqJA7JzwxpVbsdt6cuX0kODKJO8f4kVg1XRyplrkUqJtlbrVx2z4CZtu1Dispbhwj4qxljlDOetj+bW+vsbXXZBYpliSksV3NlV3bB2/2mSzNFfFJyXqeCD9OS+YtLftJSQH8R1E3b/1Kqu0l1falakYcWbgz2Z+CVQrNpXDD8XVn/J7HWZUzLgrlAx7y+EW1an2LxTPKvm+r39eeEiea8PoFf/24zkzzIx6WDL4/dBd/ohXfoYuLxp+uOaE91aA93XZD23VCe9ZQoT1zQmtA+DyZUI3Ha9r3h47qjcYThe7wXYkj9dc2nHOArTj+pTMewGjGpUWYIn1M1TY9vxB5xm0R0o0Um12WXxO8m8CzibD6sNdrdZumn+AIuXh26PPoJObp0XoegIYTwN7uus0ap8TftOjyvCRTmCnRjKgwOWPJzJez37hVN6o85w5xkDaSE3qx28Ml/bCJnSVSzsjPF6y0W3vy1Gqq1LqsgReke257r7qkW4sRXufWsql39vMFn7HUanPHcjstRBA2gxrJVG5igit5LjcZ59uox8d93dXcjrUyrF9kTR5j83FVwQO+P7Igzgf58c6OLBWqT6q7zvJPn1WV8k+f1dzlm3VFSNWqWzvag217X4UKtD7LmOp3XKyso15jeb7gMWAMQu4tFpOf6DUTJrDvRJMPiDI10koD2c/6uZVparu15mNlJdqt7dq596i1vlBYJGguwM9zyzmQ3uRxWp81ZUaC77uuKVrbXdvdUju5tltsinp1VPZSdgjX5pqyeFebW2tWXMiRNgaxps78Gg6hfX0VZR7tupfH9Zz6jSfO+j9bV9dj17rKEiknyUahsRVVBzeJEKt5KuMkKyVXaG1kEMX+N1WsMf2Jkxz2/sDG1NkjaaQazx4rI9V49mTbOvZ79hHfebKlwNl5sv3YCudnF5ztLRXO7lbZc9ySYCWqBqhMDWDunYfasiy9rNVq23Xn2zXH22dru663D2uOt421huvt04fOt4+cbx873z5xvn3qfPvM8Xbnoavd3SpB57zF9tZuT5bkoH6uxJ0XGEc4naTAu0FEx/l3+ZPql/PJP0t0e+/d/gF4M7XBhaMFQiLA/NT/Lq+DsxsY/wUCSRQewKvTj/4ItdOsijitCs4yRGI5sytAul34/wFSgAsU6MYCAA==";   // SlRegex.java, gzip + base64

  /* ---------- Python ---------- */
  var PY_WORKER = [
    "var py=null;",
    "self.onmessage=async function(e){var m=e.data;",
    " if(m.cmd==='init'){try{var mod=await import(m.base+'pyodide.mjs');py=await mod.loadPyodide({indexURL:m.base});py.runPython(m.code);postMessage({type:'ready'});}catch(x){postMessage({type:'fail',s:String(x)});}return;}",
    " try{var r=py.globals.get('sl_regex_json')(m.q);postMessage({type:'res',id:m.id,r:r});}catch(x){postMessage({type:'res',id:m.id,crash:String(x)});}};"
  ].join('\n');
  var PY = { w: null, ready: null, seq: 0, pend: null };
  function pyStart() {
    if (PY.ready) return PY.ready;
    var w;
    try { w = new Worker(URL.createObjectURL(new Blob([PY_WORKER], { type: 'text/javascript' })), { type: 'module' }); }
    catch (e) { return Promise.reject(e); }
    PY.w = w;
    PY.ready = new Promise(function (ok, ko) {
      var t = setTimeout(function () { pyKill(); ko(new Error('timeout')); }, 120000);
      w.onmessage = function (e) {
        var d = e.data;
        if (d.type === 'ready') { clearTimeout(t); ok(); }
        else if (d.type === 'fail') { clearTimeout(t); pyKill(); ko(new Error(d.s)); }
        else if (d.type === 'res' && PY.pend && PY.pend.id === d.id) { var p = PY.pend; PY.pend = null; p.done(d); }
      };
      w.onerror = function (e) { clearTimeout(t); pyKill(); ko(new Error(e.message || 'worker')); if (e.preventDefault) e.preventDefault(); };
      w.postMessage({ cmd: 'init', base: BASE.py, code: PY_ARNES });
    });
    return PY.ready;
  }
  function pyKill() { try { if (PY.w) PY.w.terminate(); } catch (e) {} PY.w = null; PY.ready = null; if (PY.pend) { var p = PY.pend; PY.pend = null; p.done({ stopped: true }); } }
  // q = {re, flags:[...], rep|null, text, retos:[...]}; resuelve {r} | {timeout} | {crash} | {fail}
  function runPy(q, limit) {
    return pyStart().then(function () {
      return new Promise(function (ok) {
        if (PY.pend) { var old = PY.pend; PY.pend = null; old.done({ stopped: true }); }
        var id = ++PY.seq, timer = setTimeout(function () { PY.pend = null; pyKill(); ok({ timeout: true }); }, (limit || 6) * 1000);
        PY.pend = { id: id, done: function (d) { clearTimeout(timer); if (d.stopped) ok({ stopped: true }); else if (d.crash) ok({ crash: d.crash }); else { try { ok({ r: JSON.parse(d.r) }); } catch (x) { ok({ crash: String(x) }); } } } };
        PY.w.postMessage({ id: id, q: JSON.stringify(q) });
      });
    }, function (e) { return { fail: String(e && e.message || e) }; });
  }

  /* ---------- Java ---------- */
  var JV = { rt: null, p: null, src: null, busy: null };
  function b64bytes(s) { var bin = atob(s), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }
  function javaSrc() {
    if (JV.src) return JV.src;
    JV.src = new Response(new Blob([b64bytes(JAVA_GZ)]).stream().pipeThrough(new DecompressionStream('gzip'))).text().then(function (sl) {
      var imp = {}, body = [];
      (sl + '\n' + JAVA_ARNES).split('\n').forEach(function (l) { if (/^import\s/.test(l)) imp[l.trim()] = 1; });
      var strip = function (s) { return s.split('\n').filter(function (l) { return !/^import\s/.test(l); }).join('\n'); };
      return Object.keys(imp).join('\n') + '\n' + strip(sl) + '\n' + strip(JAVA_ARNES);
    });
    return JV.src;
  }
  function javaRuntime(onp) {
    if (JV.rt) return Promise.resolve(JV.rt);
    if (!JV.p) JV.p = new Promise(function (ok, ko) {
      var t = setTimeout(function () { JV.p = null; ko(new Error('timeout')); }, 120000);
      var go = function () { G.JavaWasm.createRuntime({ baseUrl: BASE.java, onProgress: onp }).then(function (r) { clearTimeout(t); JV.rt = r; JV.p = null; ok(r); }, function (e) { clearTimeout(t); JV.p = null; ko(e); }); };
      if (G.JavaWasm) return go();
      var s = document.createElement('script'); s.src = BASE.java + 'java-wasm.iife.js';
      s.onload = function () { if (G.JavaWasm) go(); else { clearTimeout(t); JV.p = null; ko(new Error('java-wasm')); } };
      s.onerror = function () { clearTimeout(t); JV.p = null; ko(new Error('java-wasm')); };
      document.head.appendChild(s);
    });
    return JV.p;
  }
  function javaKill() { try { if (JV.rt) JV.rt.destroy(); } catch (e) {} JV.rt = null; }
  function b64(s) { var u = new TextEncoder().encode(s), bin = ''; for (var i = 0; i < u.length; i++) bin += String.fromCharCode(u[i]); return btoa(bin); }
  // q = {re, flags:número, rep|null, text, retos:[...]}; una ejecución hace todo (compilar es lo caro)
  function runJava(q, limit, onp) {
    var input = [b64(q.re), b64(String(q.flags || 0)), q.rep == null ? '-' : b64(q.rep), b64(q.text)].concat((q.retos || []).map(b64)).join('\n') + '\n';
    var job = Promise.all([javaRuntime(onp), javaSrc()]).then(function (a) {
      var rt = a[0], src = a[1];
      return new Promise(function (ok) {
        var done = false, end = function (r) { if (done) return; done = true; clearTimeout(timer); ok(r); };
        var timer = setTimeout(function () { javaKill(); end({ timeout: true }); }, (limit || 25) * 1000);
        JV.busy = { stop: function () { javaKill(); end({ stopped: true }); } };
        rt.run(src, { input: input }).then(function (r) {
          JV.busy = null;
          var out = String(r && r.stdout || '').trim();
          if (r && r.ok && out) { try { end({ r: JSON.parse(out.split('\n').pop()) }); } catch (x) { end({ crash: out.slice(0, 400) }); } }
          else end({ crash: String(r && (r.stderr || r.error) || 'java').slice(0, 600) });
        }, function (e) { JV.busy = null; javaKill(); end({ crash: String(e) }); });
      });
    }, function (e) { return { fail: String(e && e.message || e) }; });
    return job;
  }
  function stopJava() { if (JV.busy) JV.busy.stop(); }

  /* ---------- el código que escribirías ---------- */
  var PYF = { I: 're.IGNORECASE', M: 're.MULTILINE', S: 're.DOTALL', X: 're.VERBOSE', A: 're.ASCII' };
  var JF = [[2, 'Pattern.CASE_INSENSITIVE'], [8, 'Pattern.MULTILINE'], [32, 'Pattern.DOTALL'], [4, 'Pattern.COMMENTS'], [64, 'Pattern.UNICODE_CASE'], [256, 'Pattern.UNICODE_CHARACTER_CLASS']];
  // Literal de Python: r"…" si se puede (lo habitual con regex); si no, "…" con escapes
  function pyLit(s) {
    if (!/[\n\r]/.test(s) && !/\\$/.test(s.replace(/\\\\/g, '')) && s.indexOf('"') < 0) return 'r"' + s + '"';
    if (!/[\n\r]/.test(s) && !/\\$/.test(s.replace(/\\\\/g, '')) && s.indexOf("'") < 0) return "r'" + s + "'";
    return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t') + '"';
  }
  // Literal de Java: cada \ se escribe \\ (la barra doble de las cadenas)
  function jLit(s) { return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t') + '"'; }
  function pyStr(s) { return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t') + '"'; }
  function pyCode(q, fn) {
    var fl = (q.flags || []).map(function (f) { return PYF[f]; }).filter(Boolean).join(' | ');
    var L = ['import re', '', 'patron = re.compile(' + pyLit(q.re) + (fl ? ', ' + fl : '') + ')', 'texto = ' + pyStr(q.text)];
    if (fn === 'sub' && q.rep != null) L.push('print(patron.sub(' + pyLit(q.rep) + ', texto))');
    else if (fn === 'split') L.push('print(patron.split(texto))');
    else if (fn === 'findall') L.push('print(patron.findall(texto))');
    else if (fn === 'match' || fn === 'fullmatch' || fn === 'search') L.push('m = patron.' + fn + '(texto)', 'if m:', '    print(m.group(), m.span(), m.groups())', 'else:', '    print(None)');
    else L.push('for m in patron.finditer(texto):', '    print(m.start(), m.end(), m.group(), m.groups())');
    return L.join('\n');
  }
  function javaCode(q, fn, cls) {
    var fl = JF.filter(function (f) { return (q.flags || 0) & f[0]; }).map(function (f) { return f[1]; }).join(' | ');
    var I = '        ', L = ['import java.util.regex.Matcher;', 'import java.util.regex.Pattern;', '', 'public class ' + (cls || 'Main') + ' {', '    public static void main(String[] args) {',
      I + 'Pattern patron = Pattern.compile(' + jLit(q.re) + (fl ? ', ' + fl : '') + ');', I + 'String texto = ' + jLit(q.text) + ';'];
    if (fn === 'replaceAll' && q.rep != null) L.push(I + 'System.out.println(patron.matcher(texto).replaceAll(' + jLit(q.rep) + '));');
    else if (fn === 'split') L.push(I + 'System.out.println(java.util.Arrays.toString(patron.split(texto)));');
    else if (fn === 'matches' || fn === 'lookingAt') L.push(I + 'Matcher m = patron.matcher(texto);', I + 'if (m.' + fn + '()) {', I + '    System.out.println(m.group() + " " + m.start() + "-" + m.end());', I + '} else {', I + '    System.out.println("no");', I + '}');
    else L.push(I + 'Matcher m = patron.matcher(texto);', I + 'while (m.find()) {', I + '    System.out.println(m.start() + "-" + m.end() + " " + m.group());', I + '}');
    L.push('    }', '}');
    return L.join('\n');
  }

  G.SLRx = { base: BASE, runPy: runPy, runJava: runJava, stopJava: stopJava, pyStart: pyStart, javaWarm: function (onp) { return Promise.all([javaRuntime(onp), javaSrc()]); }, pyLit: pyLit, jLit: jLit, pyCode: pyCode, javaCode: javaCode, JF: JF };
})(typeof window !== 'undefined' ? window : this);

/* SergioLearns — interfaz del probador de expresiones regulares (.sl-sim[data-sim="regex"]). Necesita kit.js y engine.js (SLRx). */
(function () {
  'use strict';
  var K6 = window.SL6K, ico = K6.ico, esc = K6.esc, fill = K6.fill, R = window.SLRx;
  var MAXT = 4000;   // caracteres de texto como mucho
  var COLS = ['#5B4BDB', '#FF6B4A', '#16794B', '#D9651C', '#2F5FD0', '#C2362B', '#A99EF5', '#F5A524'];
  var PYF = [['I', 're.I', 'IGNORECASE'], ['M', 're.M', 'MULTILINE'], ['S', 're.S', 'DOTALL'], ['X', 're.X', 'VERBOSE'], ['A', 're.A', 'ASCII']];
  var JFL = [[2, 'CASE_INSENSITIVE'], [8, 'MULTILINE'], [32, 'DOTALL'], [4, 'COMMENTS'], [64, 'UNICODE_CASE'], [256, 'UNICODE_CHARACTER_CLASS']];
  // Ejemplos: se escriben en Python; a Java se pasan con toJava()
  var EX = {
    es: [
      { k: 'ip', n: 'Las IP de un log (el que TeaVM leía mal)', re: '\\d{1,3}(?:\\.\\d{1,3}){3}', f: [], rep: '<IP>', t: '09:00:01 INFO 10.0.0.7 arranque del servidor\n09:01:02 WARN 192.168.1.20 sesión a punto de caducar\n09:01:40 ERROR 172.16.0.3 acceso denegado a /actas' },
      { k: 'fecha', n: 'Fechas dd/mm/aaaa a ISO con grupos con nombre', re: '(?P<dia>\\d{1,2})/(?P<mes>\\d{1,2})/(?P<anio>\\d{4})', f: [], rep: '\\g<anio>-\\g<mes>-\\g<dia>', t: 'Entrega: 7/3/2027. Examen: 15/01/2027. Revisión: 22/01/2027.' },
      { k: 'matricula', n: 'Matrículas del parking (sin vocales)', re: '\\b\\d{4} ?[B-DF-HJ-NPR-TV-Z]{3}\\b', f: ['I'], rep: null, t: 'Entran 1234 BCD, 4521-LKP, 0000AEI y 7788 xyz por la barrera.' },
      { k: 'correo', n: 'Correos de la ULPGC', re: '[\\w.+-]+@(?:alu\\.)?ulpgc\\.es', f: [], rep: null, t: 'Escribid a laura.santana101@alu.ulpgc.es o a secretaria@ulpgc.es, no a laura@gmail.com.' },
      { k: 'notas', n: 'Nombre y nota, línea a línea (MULTILINE)', re: '^(\\w+):\\s*(\\d+(?:[.,]\\d+)?)$', f: ['M'], rep: '\\2 → \\1', t: 'Laura: 9,5\nPablo: 4\nAna: 7.25\nsin nota\nLuis: 10' },
      { k: 'voraz', n: 'Voraz frente a perezoso: <.+> y <.+?>', re: '<.+?>', f: [], rep: '', t: 'Hola <b>Laura</b>, tu nota es <i>9,5</i>.' },
      { k: 'csv', n: 'Partir una línea con ; y espacios (split)', re: '\\s*;\\s*', f: [], rep: null, t: 'FP1 ; 8,5;IC1 ;  7;FP2;9' }
    ],
    en: [
      { k: 'ip', n: 'IP addresses in a log (the one TeaVM got wrong)', re: '\\d{1,3}(?:\\.\\d{1,3}){3}', f: [], rep: '<IP>', t: '09:00:01 INFO 10.0.0.7 server starting\n09:01:02 WARN 192.168.1.20 session about to expire\n09:01:40 ERROR 172.16.0.3 access denied to /marks' },
      { k: 'fecha', n: 'dd/mm/yyyy dates to ISO with named groups', re: '(?P<day>\\d{1,2})/(?P<month>\\d{1,2})/(?P<year>\\d{4})', f: [], rep: '\\g<year>-\\g<month>-\\g<day>', t: 'Deadline: 7/3/2027. Exam: 15/01/2027. Review: 22/01/2027.' },
      { k: 'matricula', n: 'Car park number plates (no vowels)', re: '\\b\\d{4} ?[B-DF-HJ-NPR-TV-Z]{3}\\b', f: ['I'], rep: null, t: 'In come 1234 BCD, 4521-LKP, 0000AEI and 7788 xyz through the barrier.' },
      { k: 'correo', n: 'University email addresses', re: '[\\w.+-]+@(?:alu\\.)?ulpgc\\.es', f: [], rep: null, t: 'Write to laura.santana101@alu.ulpgc.es or secretaria@ulpgc.es, not laura@gmail.com.' },
      { k: 'notas', n: 'Name and mark, line by line (MULTILINE)', re: '^(\\w+):\\s*(\\d+(?:[.,]\\d+)?)$', f: ['M'], rep: '\\2 → \\1', t: 'Laura: 9.5\nPablo: 4\nAna: 7.25\nno mark\nLuis: 10' },
      { k: 'voraz', n: 'Greedy versus lazy: <.+> and <.+?>', re: '<.+?>', f: [], rep: '', t: 'Hi <b>Laura</b>, your mark is <i>9.5</i>.' },
      { k: 'csv', n: 'Split a line on ; and spaces (split)', re: '\\s*;\\s*', f: [], rep: null, t: 'FP1 ; 8.5;IC1 ;  7;FP2;9' }
    ]
  };
  var RETOS = {
    es: [
      { k: 'dni', n: 'Un DNI: 8 cifras y una letra mayúscula (la letra nunca es I, Ñ, O ni U).', si: ['12345678Z', '00000001R'], no: ['1234567Z', '12345678I', '12345678z', '123456789Z', '12345678 Z'], sol: '\\d{8}[A-HJ-NP-TV-Z]', pista: 'Las cifras, con \\d{8}; la letra, con una clase de rangos que se salte la I, la O y la U.' },
      { k: 'matricula', n: 'Una matrícula: 4 cifras, un espacio opcional y 3 consonantes mayúsculas (ni vocales, ni Ñ, ni Q).', si: ['1234BCD', '4521 LKP'], no: ['1234 AEI', '123 BCD', '1234BCDF', '1234 bcd', '1234 QWE'], sol: '\\d{4} ?[B-DF-HJ-NPR-TV-Z]{3}', pista: 'El espacio opcional es « ?». En la clase de letras, salta las vocales con rangos: B-D, F-H, J-N…, y la Q.' },
      { k: 'hora', n: 'Una hora de 24 h con dos cifras: de 00:00 a 23:59.', si: ['00:00', '09:45', '23:59'], no: ['24:00', '9:45', '12:60', '12-30'], sol: '([01]\\d|2[0-3]):[0-5]\\d', pista: 'Las horas tienen dos casos: 0 o 1 seguido de cualquier cifra, o 2 seguido de 0 a 3. Los minutos empiezan por 0-5.' },
      { k: 'nota', n: 'Una nota de 0 a 10, con hasta dos decimales y coma o punto (el 10 sin decimales).', si: ['7', '9,5', '10', '6.25', '0'], no: ['11', '10,5', '-3', '7,', '7,123'], sol: '10|\\d([.,]\\d{1,2})?', pista: 'Separa el caso del 10 con | y deja los decimales solo para la otra rama.' },
      { k: 'correo', n: 'Un correo de la ULPGC: algo antes de la @ (letras, cifras o puntos) y después ulpgc.es o alu.ulpgc.es.', si: ['laura.santana101@alu.ulpgc.es', 'ana@ulpgc.es'], no: ['laura@gmail.com', '@ulpgc.es', 'ana@ulpgc.es.com', 'ana@@ulpgc.es', 'ana@aluXulpgc.es'], sol: '[\\w.]+@(alu\\.)?ulpgc\\.es', pista: 'El punto suelto significa «cualquier carácter»: el de ulpgc.es se escapa (\\.).' },
      { k: 'cp', n: 'Un código postal de la provincia de Las Palmas: empieza por 35 y tiene 5 cifras.', si: ['35001', '35450'], no: ['38001', '3500', '350011', '35 001'], sol: '35\\d{3}', pista: 'Dos cifras fijas y tres cualesquiera.' }
    ],
    en: [
      { k: 'dni', n: 'A Spanish ID number (DNI): 8 digits and a capital letter (never I, Ñ, O or U).', si: ['12345678Z', '00000001R'], no: ['1234567Z', '12345678I', '12345678z', '123456789Z', '12345678 Z'], sol: '\\d{8}[A-HJ-NP-TV-Z]', pista: 'The digits with \\d{8}; the letter with a class of ranges that skips I, O and U.' },
      { k: 'matricula', n: 'A Spanish number plate: 4 digits, an optional space and 3 capital consonants (no vowels, no Ñ, no Q).', si: ['1234BCD', '4521 LKP'], no: ['1234 AEI', '123 BCD', '1234BCDF', '1234 bcd', '1234 QWE'], sol: '\\d{4} ?[B-DF-HJ-NPR-TV-Z]{3}', pista: 'The optional space is « ?». In the letter class, skip the vowels with ranges: B-D, F-H, J-N…, and the Q.' },
      { k: 'hora', n: 'A 24-hour time with two digits: from 00:00 to 23:59.', si: ['00:00', '09:45', '23:59'], no: ['24:00', '9:45', '12:60', '12-30'], sol: '([01]\\d|2[0-3]):[0-5]\\d', pista: 'Hours have two cases: 0 or 1 followed by any digit, or 2 followed by 0 to 3. Minutes start with 0-5.' },
      { k: 'nota', n: 'A mark from 0 to 10, with up to two decimals and a comma or a point (10 with no decimals).', si: ['7', '9,5', '10', '6.25', '0'], no: ['11', '10,5', '-3', '7,', '7,123'], sol: '10|\\d([.,]\\d{1,2})?', pista: 'Split off the 10 with | and keep the decimals for the other branch only.' },
      { k: 'correo', n: 'A ULPGC email: something before the @ (letters, digits or dots) and then ulpgc.es or alu.ulpgc.es.', si: ['laura.santana101@alu.ulpgc.es', 'ana@ulpgc.es'], no: ['laura@gmail.com', '@ulpgc.es', 'ana@ulpgc.es.com', 'ana@@ulpgc.es', 'ana@aluXulpgc.es'], sol: '[\\w.]+@(alu\\.)?ulpgc\\.es', pista: 'A bare dot means «any character»: the one in ulpgc.es is escaped (\\.).' },
      { k: 'cp', n: 'A postcode in the province of Las Palmas: it starts with 35 and has 5 digits.', si: ['35001', '35450'], no: ['38001', '3500', '350011', '35 001'], sol: '35\\d{3}', pista: 'Two fixed digits and any three.' }
    ]
  };
  var TX = {
    es: {
      title: 'sergio@learns: ~/laboratorio/simuladores', ps: 'sergio@learns:~/laboratorio/simuladores$', cmd: 'regex', file: 'texto.txt',
      langL: 'Lenguaje', ex: 'Ejemplo', share: 'Compartir', copy: 'Copiar', copied: 'Copiado',
      reL: 'expresión', flagsL: 'Opciones', repL: 'Reemplazo', repOn: 'Probar un reemplazo', textL: 'texto', textH: 'Hasta 4000 caracteres. Las coincidencias se marcan debajo.',
      hits: 'coincidencias', none: 'Ninguna coincidencia.', more: 'Hay más de 200: se enseñan las 200 primeras.', fnL: 'qué devuelve cada función', grL: 'grupos', codeL: 'tu código', steps: 'paso a paso',
      pyLoad: 'Cargando Python (Pyodide, CPython 3.14)… la primera vez tarda unos segundos.', pyRun: 'Python', jvLoad: 'Cargando javac y TeaVM… la primera vez tarda unos segundos.', jvRun: 'javac + TeaVM compilan tu prueba (unos 3 s)…', jvBtn: 'Probar en Java', jvStale: 'Has cambiado algo: el resultado de abajo es de la prueba anterior.', jvOk: 'Compilado y ejecutado con javac + TeaVM en {ms} s.',
      fail: 'No se pudo cargar el motor (¿sin conexión?). Prueba otra vez.', timeout: 'Tu expresión tarda demasiado (más de {s} s) y se ha parado: seguramente es un backtracking catastrófico, como (a+)+b con un texto largo que no casa.', crash: 'El motor ha fallado: {m}',
      errL: '{l} dice', errH: 'En español', fnPy: { match: 'solo mira el principio del texto', search: 'la primera coincidencia, esté donde esté', fullmatch: 'el texto entero tiene que encajar', findall: 'una lista con todas (si hay grupos, solo los grupos)', sub: 'el texto con los reemplazos', split: 'el texto partido por cada coincidencia' },
      fnJv: { matches: 'el texto entero tiene que encajar', lookingAt: 'solo mira el principio del texto', find: 'cada llamada busca la siguiente', replaceAll: 'el texto con los reemplazos', split: 'el texto partido por cada coincidencia (sin los vacíos del final)' },
      no: 'no casa', nMatches: '{n} coincidencias', nRep: '{n} reemplazos', th: { n: '#', pos: 'posición', txt: 'texto', g: 'grupo' }, noGroups: 'La expresión no tiene grupos. Los paréntesis ( ) crean uno; (?:…) agrupa sin guardar.',
      start: 'Pulsa Paso para ver cómo busca {f}, coincidencia a coincidencia.', step: 'Búsqueda {k}: empieza en la posición {from} y encuentra «{t}» de {s} a {e}.', stepEmpty: 'Búsqueda {k}: desde la posición {from} encuentra una coincidencia vacía en {s} (la expresión puede casar con nada). La siguiente búsqueda avanza un carácter.', stepEnd: 'Después ya no encuentra nada más: {n} en total.', stepG: 'grupo {g}{nm} = {v}',
      codeHpy: 'El r delante de la cadena (raw string) hace que Python no toque las barras: la expresión llega tal cual a re.', codeHjv: 'Fíjate: en Java cada \\ de la expresión se escribe \\\\ dentro de la cadena, porque la propia cadena usa la barra para \\n, \\t…',
      toJ: 'Pasada a Java: {c}.', toP: 'Pasada a Python: {c}.', cvNamed: '(?P<n>…) es (?<n>…)', cvNamedP: '(?<n>…) es (?P<n>…)', cvRep: 'en el reemplazo, \\g<n> y \\1 son ${n} y $1', cvRepP: 'en el reemplazo, ${n} y $1 son \\g<n> y \\1',
      rules: 'Motores de verdad, no el de JavaScript del navegador: Python con Pyodide (CPython 3.14, módulo re) y Java con javac + TeaVM y el java.util.regex de OpenJDK 21 (el de TeaVM da resultados falsos con algunas expresiones; comprobado en 1500 casos frente al JDK). Lo que ves es lo que haría tu programa. Las dos sintaxis se parecen pero no son iguales: grupos con nombre (?P<n>…) en Python y (?<n>…) en Java; en el reemplazo, \\g<n> y \\1 frente a ${n} y $1; match/search/fullmatch frente a lookingAt()/find()/matches().',
      reto: 'Reto: escribe la expresión', retoLead: 'Tiene que encajar entera (fullmatch en Python, matches() en Java) con las de la izquierda y con ninguna de las de la derecha. Se comprueba con el motor de verdad del lenguaje elegido.', retoIn: 'Tu expresión', yes: 'tiene que encajar', nope: 'no debe encajar', allOk: 'Bien: encaja con todas las que debe y con ninguna de las otras.', someBad: 'Aún no: mira las marcadas en rojo.', hint: 'Pista', solL: 'Probarla en el simulador', solShow: 'Una solución: {s}', running: 'Comprobando…'
    },
    en: {
      title: 'sergio@learns: ~/lab/simulators', ps: 'sergio@learns:~/lab/simulators$', cmd: 'regex', file: 'text.txt',
      langL: 'Language', ex: 'Example', share: 'Share', copy: 'Copy', copied: 'Copied',
      reL: 'pattern', flagsL: 'Flags', repL: 'Replacement', repOn: 'Try a replacement', textL: 'text', textH: 'Up to 4000 characters. Matches are marked below.',
      hits: 'matches', none: 'No matches.', more: 'There are more than 200: only the first 200 are shown.', fnL: 'what each function returns', grL: 'groups', codeL: 'your code', steps: 'step by step',
      pyLoad: 'Loading Python (Pyodide, CPython 3.14)… the first time takes a few seconds.', pyRun: 'Python', jvLoad: 'Loading javac and TeaVM… the first time takes a few seconds.', jvRun: 'javac + TeaVM are compiling your test (about 3 s)…', jvBtn: 'Run in Java', jvStale: 'You changed something: the result below is from the previous run.', jvOk: 'Compiled and run with javac + TeaVM in {ms} s.',
      fail: 'The engine could not be loaded (offline?). Try again.', timeout: 'Your pattern takes too long (over {s} s) and was stopped: it is most likely catastrophic backtracking, like (a+)+b on a long text that does not match.', crash: 'The engine failed: {m}',
      errL: '{l} says', errH: 'In plain words', fnPy: { match: 'only looks at the start of the text', search: 'the first match, wherever it is', fullmatch: 'the whole text has to fit', findall: 'a list with all of them (with groups, only the groups)', sub: 'the text with the replacements', split: 'the text split at every match' },
      fnJv: { matches: 'the whole text has to fit', lookingAt: 'only looks at the start of the text', find: 'each call looks for the next one', replaceAll: 'the text with the replacements', split: 'the text split at every match (without the trailing empty ones)' },
      no: 'no match', nMatches: '{n} matches', nRep: '{n} replacements', th: { n: '#', pos: 'position', txt: 'text', g: 'group' }, noGroups: 'The pattern has no groups. Parentheses ( ) create one; (?:…) groups without saving.',
      start: 'Press Step to watch how {f} searches, match by match.', step: 'Search {k}: it starts at position {from} and finds «{t}» from {s} to {e}.', stepEmpty: 'Search {k}: from position {from} it finds an empty match at {s} (the pattern can match nothing). The next search moves on one character.', stepEnd: 'After that it finds nothing else: {n} in total.', stepG: 'group {g}{nm} = {v}',
      codeHpy: 'The r before the string (raw string) stops Python from touching the backslashes: the pattern reaches re exactly as written.', codeHjv: 'Note: in Java every \\ in the pattern is written \\\\ inside the string, because the string itself uses the backslash for \\n, \\t…',
      toJ: 'Converted to Java: {c}.', toP: 'Converted to Python: {c}.', cvNamed: '(?P<n>…) is (?<n>…)', cvNamedP: '(?<n>…) is (?P<n>…)', cvRep: 'in the replacement, \\g<n> and \\1 are ${n} and $1', cvRepP: 'in the replacement, ${n} and $1 are \\g<n> and \\1',
      rules: 'Real engines, not the browser’s JavaScript one: Python with Pyodide (CPython 3.14, the re module) and Java with javac + TeaVM and OpenJDK 21’s java.util.regex (TeaVM’s own gives wrong results with some patterns; checked on 1500 cases against the JDK). What you see is what your program would do. The two syntaxes look alike but are not the same: named groups are (?P<n>…) in Python and (?<n>…) in Java; in the replacement, \\g<n> and \\1 versus ${n} and $1; match/search/fullmatch versus lookingAt()/find()/matches().',
      reto: 'Challenge: write the pattern', retoLead: 'It has to fit whole (fullmatch in Python, matches() in Java) every string on the left and none on the right. It is checked with the real engine of the chosen language.', retoIn: 'Your pattern', yes: 'must fit', nope: 'must not fit', allOk: 'Right: it fits all the ones it should and none of the others.', someBad: 'Not yet: look at the ones in red.', hint: 'Hint', solL: 'Try it in the simulator', solShow: 'A solution: {s}', running: 'Checking…'
    }
  };
  // Mensajes de los motores, en español sencillo (el original se enseña siempre)
  var ERR = {
    es: [
      [/missing \), unterminated subpattern|Unclosed group/i, 'Falta un ): hay un grupo sin cerrar.'],
      [/unbalanced parenthesis|Unmatched closing '\)'/i, 'Sobra un ): cierra un grupo que no se abrió.'],
      [/unterminated character set|Unclosed character class/i, 'Falta el ] de una clase [ ].'],
      [/nothing to repeat|multiple repeat|Dangling meta character/i, 'Hay un *, + o ? sin nada delante que repetir (o dos seguidos). Si lo querías literal, escápalo: \\*, \\+, \\?'],
      [/Illegal repetition/i, 'Una { } que no es una repetición válida. Si querías una llave literal, escápala: \\{'],
      [/bad escape|Illegal\/unsupported escape|Illegal escape/i, 'Una secuencia con \\ que este lenguaje no conoce.'],
      [/look-behind requires fixed-width|Look-behind group does not have an obvious maximum length/i, 'El lookbehind (?<=…) o (?<!…) necesita saber cuánto mide lo que mira hacia atrás.'],
      [/bad character range|Illegal character range/i, 'Un rango de clase al revés, como [z-a]: el primero tiene que ir antes.'],
      [/unknown extension \?<[A-Za-z_]/i, 'Python escribe los grupos con nombre así: (?P<nombre>…). (?<nombre>…) es la forma de Java.'],
      [/unknown inline flag|Unknown inline modifier|unknown extension \?P/i, 'Una opción en línea (?…) que este lenguaje no conoce. Java escribe los grupos con nombre (?<nombre>…), sin la P.'],
      [/unknown group name|named capturing group .* does not exist|No group with name/i, 'Usas un grupo con nombre que no existe.'],
      [/invalid group reference|No group \d+|unknown group/i, 'Usas un número de grupo que no existe.'],
      [/SL_NO_DISPONIBLE|Unknown character (script|block|property)|Unknown character name/i, 'Esa propiedad Unicode no está disponible en el probador ni en el entorno (TeaVM no la trae). Las de siempre (\\p{L}, \\p{Lu}, \\p{Digit}…) sí funcionan.']
    ],
    en: [
      [/missing \), unterminated subpattern|Unclosed group/i, 'A ) is missing: a group is not closed.'],
      [/unbalanced parenthesis|Unmatched closing '\)'/i, 'There is a ) too many: it closes a group that was never opened.'],
      [/unterminated character set|Unclosed character class/i, 'The ] of a [ ] class is missing.'],
      [/nothing to repeat|multiple repeat|Dangling meta character/i, 'There is a *, + or ? with nothing before it to repeat (or two in a row). If you wanted it literally, escape it: \\*, \\+, \\?'],
      [/Illegal repetition/i, 'A { } that is not a valid repetition. If you wanted a literal brace, escape it: \\{'],
      [/bad escape|Illegal\/unsupported escape|Illegal escape/i, 'A \\ sequence this language does not know.'],
      [/look-behind requires fixed-width|Look-behind group does not have an obvious maximum length/i, 'A look-behind (?<=…) or (?<!…) needs to know how long the thing it looks back at is.'],
      [/bad character range|Illegal character range/i, 'A class range written backwards, like [z-a]: the first one has to come first.'],
      [/unknown extension \?<[A-Za-z_]/i, 'Python writes named groups like this: (?P<name>…). (?<name>…) is the Java form.'],
      [/unknown inline flag|Unknown inline modifier|unknown extension \?P/i, 'An inline flag (?…) this language does not know. Java writes named groups (?<name>…), without the P.'],
      [/unknown group name|named capturing group .* does not exist|No group with name/i, 'You use a named group that does not exist.'],
      [/invalid group reference|No group \d+|unknown group/i, 'You use a group number that does not exist.'],
      [/SL_NO_DISPONIBLE|Unknown character (script|block|property)|Unknown character name/i, 'That Unicode property is not available in the tester or the playground (TeaVM does not ship it). The usual ones (\\p{L}, \\p{Lu}, \\p{Digit}…) do work.']
    ]
  };
  function plainErr(L, s) { var a = ERR[L]; for (var i = 0; i < a.length; i++) if (a[i][0].test(s)) return a[i][1]; return ''; }
  // Python ↔ Java: lo que cambia de sintaxis (grupos con nombre y referencias del reemplazo)
  function toJava(x) {
    var c = [], re = x.re.replace(/\(\?P<([A-Za-z]\w*)>/g, function (m, n) { c.push('n'); return '(?<' + n + '>'; }).replace(/\(\?P=([A-Za-z]\w*)\)/g, function (m, n) { c.push('n'); return '\\k<' + n + '>'; });
    var rep = x.rep == null ? null : x.rep.replace(/\$/g, '\\$').replace(/\\g<([A-Za-z]\w*)>/g, function (m, n) { c.push('r'); return '${' + n + '}'; }).replace(/\\g<(\d+)>|\\(\d+)/g, function (m, a, b) { c.push('r'); return '$' + (a || b); });
    var fl = 0; (x.f || []).forEach(function (f) { fl |= { I: 2, M: 8, S: 32, X: 4 }[f] || 0; });
    return { re: re, rep: rep, f: fl, t: x.t, c: c };
  }
  function toPy(x) {
    var c = [], re = x.re.replace(/\(\?<([A-Za-z]\w*)>/g, function (m, n) { c.push('n'); return '(?P<' + n + '>'; }).replace(/\\k<([A-Za-z]\w*)>/g, function (m, n) { c.push('n'); return '(?P=' + n + ')'; });
    var rep = x.rep == null ? null : x.rep.replace(/\\\$/g, '\u0000').replace(/\$\{([A-Za-z]\w*)\}/g, function (m, n) { c.push('r'); return '\\g<' + n + '>'; }).replace(/\$(\d+)/g, function (m, d) { c.push('r'); return '\\' + d; }).replace(/\u0000/g, '$');
    var f = []; [[2, 'I'], [8, 'M'], [32, 'S'], [4, 'X']].forEach(function (p) { if ((x.f || 0) & p[0]) f.push(p[1]); });
    return { re: re, rep: rep, f: f, t: x.t, c: c };
  }

  function mount(el) {
    var K = K6.mount(el, ''), L = K.lang, t = TX[L], q = K.q, exs = EX[L];
    K.title = t.title;
    // Estado: lenguaje y, para cada uno, expresión, opciones, reemplazo y texto
    var S = { l: 'py', fn: 'search', ex: 'ip', py: null, java: null };
    var ex0 = exs[0]; S.py = { re: ex0.re, f: ex0.f.slice(), rep: ex0.rep, t: ex0.t }; S.java = toJava(S.py);
    (function () {
      var h = K6.hashState() || K6.store('sl_sim_regex_' + L);
      if (!h) return;
      try {
        var o = JSON.parse(h);
        if (o.l === 'java') { S.l = 'java'; S.java = { re: String(o.re || ''), f: (+o.f || 0) & 511, rep: o.rp == null ? null : String(o.rp), t: String(o.t || '').slice(0, MAXT) }; S.py = toPy(S.java); }
        else { S.l = 'py'; S.py = { re: String(o.re || ''), f: [].concat(o.f || []).filter(function (f) { return /^[IMSXA]$/.test(f); }), rep: o.rp == null ? null : String(o.rp), t: String(o.t || '').slice(0, MAXT) }; S.java = toJava(S.py); }
        S.ex = o.ex || ''; S.fn = o.fn || (S.l === 'py' ? 'search' : 'find');
      } catch (e) {}
    })();
    var cur = function () { return S[S.l]; };
    var state = function () { var c = cur(); return JSON.stringify({ l: S.l, re: c.re, f: c.f, rp: c.rep, t: c.t, ex: S.ex, fn: S.fn }); };

    var seg = '<div class="sl6-seg" role="group" aria-label="' + esc(t.langL) + '"><span class="sl6-seg__l">' + esc(t.langL) + '</span><button type="button" data-l="py">Python</button><button type="button" data-l="java">Java</button></div>';
    var ctl = '<div class="sl6-ctl">' + seg + '<div class="sl6-ctl__r"><label class="sl6-selw">' + ico('file', 16) + '<select class="sl6-sel" aria-label="' + esc(t.ex) + '"><option value="">' + esc(t.ex) + '…</option>' + exs.map(function (x) { return '<option value="' + x.k + '">' + esc(x.n) + '</option>'; }).join('') + '</select></label><button type="button" class="sl6-btn sl6-btn--g" data-a="share">' + ico('link', 16) + '<span>' + esc(t.share) + '</span></button></div></div>';
    var body = ctl
      + '<div class="sl6-rx-top"><section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.reL) + '</h3>'
      + '<div class="sl6-rx-re"><span class="sl6-rx-del" aria-hidden="true">/</span><input type="text" class="sl6-rx-in" id="' + K.id + '-re" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="' + esc(t.reL) + '"><span class="sl6-rx-del" aria-hidden="true">/</span></div>'
      + '<div class="sl6-rx-err" hidden></div>'
      + '<p class="sl6-lbl sl6-rx-fl">' + esc(t.flagsL) + '</p><div class="sl6-rx-flags"></div>'
      + '<label class="sl6-rx-ron"><input type="checkbox" class="sl6-rx-rc"> ' + esc(t.repOn) + '</label><input type="text" class="sl6-rx-rep" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="' + esc(t.repL) + '" hidden>'
      + '<p class="sl6-h sl6-h--2">── ' + esc(t.textL) + '</p><textarea class="sl6-rx-t" rows="5" spellcheck="false" aria-label="' + esc(t.textL) + '" maxlength="' + MAXT + '"></textarea><p class="sl6-help">' + esc(t.textH) + '</p>'
      + '<p class="sl6-rx-conv" hidden></p></section>'
      + '<section class="sl6-pan"><h3 class="sl6-h">── <span class="sl6-rx-nh">' + esc(t.hits) + '</span></h3><div class="sl6-rx-st" aria-live="polite"></div><div class="sl6-rx-view"></div>'
      + '<p class="sl6-h sl6-h--2">── ' + esc(t.steps) + '</p>' + K6.toolsHTML(K) + '<div class="sl6-rx-card"></div></section></div>'
      + '<div class="sl6-rx-bot"><section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.fnL) + '</h3><div class="sl6-rx-fns"></div></section>'
      + '<section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.grL) + '</h3><div class="sl6-rx-grp"></div></section></div>'
      + '<section class="sl6-pan sl6-pan--gantt"><h3 class="sl6-h">── <span class="sl6-rx-ch"></span><button type="button" class="sl6-btn sl6-btn--g sl6-rx-cp" data-a="copy">' + ico('file', 15) + '<span>' + esc(t.copy) + '</span></button></h3><pre class="sl6-rx-code"><code></code></pre><p class="sl6-help sl6-rx-codeh"></p></section>'
      + '<p class="sl6-rules">' + esc(t.rules) + '</p>';
    el.innerHTML = K6.winHTML(K, t.ps, body) + K6.tryHTML(K);
    K6.themeBtn(K); K.onTheme = function () {};
    var reIn = q('.sl6-rx-in'), repIn = q('.sl6-rx-rep'), repC = q('.sl6-rx-rc'), tIn = q('.sl6-rx-t');

    var RES = null, RES_FOR = '', JV_T = 0, JV_BUSY = false, JV_AGAIN = false, PY_T = 0, ST = { msg: '', kind: '' };
    var PL = K6.player(K);
    K.N = function () { return RES && RES.ok ? Math.max(1, (S.l === 'py' ? RES.finditer : RES.find).length + 1) : 1; };
    K.draw = function (k) { drawView(k); drawCard(k); };

    function fill2() {
      var c = cur();
      [].forEach.call(K.qa('[data-l]'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-l') === S.l ? 'true' : 'false'); });
      reIn.value = c.re; tIn.value = c.t; repC.checked = c.rep != null; repIn.hidden = c.rep == null; repIn.value = c.rep == null ? '' : c.rep;
      var fl = S.l === 'py' ? PYF.map(function (f) { return '<label class="sl6-rx-f" title="' + esc(f[1] + ' · ' + f[2]) + '"><input type="checkbox" data-f="' + f[0] + '"' + (c.f.indexOf(f[0]) >= 0 ? ' checked' : '') + '><span>' + f[2] + '</span></label>'; }).join('')
        : JFL.map(function (f) { return '<label class="sl6-rx-f" title="Pattern.' + f[1] + '"><input type="checkbox" data-f="' + f[0] + '"' + (c.f & f[0] ? ' checked' : '') + '><span>' + f[1] + '</span></label>'; }).join('');
      q('.sl6-rx-flags').innerHTML = fl;
      q('.sl6-sel').value = S.ex;
    }
    function readIn() {
      var c = cur(); c.re = reIn.value; c.t = tIn.value.slice(0, MAXT); c.rep = repC.checked ? repIn.value : null;
      if (S.l === 'py') { c.f = []; [].forEach.call(K.qa('[data-f]'), function (b) { if (b.checked) c.f.push(b.getAttribute('data-f')); }); }
      else { c.f = 0; [].forEach.call(K.qa('[data-f]'), function (b) { if (b.checked) c.f |= +b.getAttribute('data-f'); }); }
    }
    function cmdLine() {
      var c = cur(), o = S.l === 'py' ? '--python' : '--java', fl = S.l === 'py' ? c.f.map(function (f) { return '-' + f.toLowerCase(); }) : JFL.filter(function (f) { return c.f & f[0]; }).map(function (f) { return '-' + f[1].toLowerCase().replace(/_/g, '-'); });
      var shown = c.re.length > 40 ? c.re.slice(0, 39) + '…' : c.re;
      q('.sl6-cmdl').innerHTML = esc(t.cmd) + ' <span class="o">' + o + (fl.length ? ' ' + fl.join(' ') : '') + '</span> <b>\'' + esc(shown) + '\'</b> ' + esc(t.file);
    }
    function setStatus(kind, msg) { ST = { kind: kind, msg: msg }; var s = q('.sl6-rx-st'); s.className = 'sl6-rx-st' + (kind ? ' is-' + kind : ''); s.innerHTML = msg ? (kind === 'run' || kind === 'load' ? '<i class="sl6-rx-spin" aria-hidden="true"></i>' : '') + '<span>' + msg + '</span>' + (S.l === 'java' && kind !== 'run' && kind !== 'load' ? '' : '') : ''; }

    function query() {
      var c = cur();
      return { re: c.re, flags: c.f, rep: c.rep, text: c.t, retos: [] };
    }
    function changed(now) {
      readIn(); cmdLine(); drawCode(); K6.store('sl_sim_regex_' + L, state()); K6.keepHash(state());
      var key = S.l + '\u0001' + JSON.stringify(query());
      if (key === RES_FOR) return;
      if (S.l === 'py') { clearTimeout(PY_T); PY_T = setTimeout(runPy, now ? 0 : 140); }
      else {
        el.classList.add('is-stale'); if (RES && RES.ok !== undefined) setStatus('stale', esc(t.jvStale) + ' <button type="button" class="sl6-btn sl6-btn--p sl6-rx-go" data-a="java">' + ico('play', 13) + esc(t.jvBtn) + '</button>');
        clearTimeout(JV_T); JV_T = setTimeout(runJava, now ? 0 : 900);
      }
    }
    function got(r, key, extra) {
      PL.reset();
      if (r.fail) { setStatus('bad', esc(t.fail)); return; }
      if (r.timeout) { RES = null; RES_FOR = key; setStatus('bad', esc(fill(t.timeout, { s: S.l === 'py' ? 6 : 25 }))); drawAll(); return; }
      if (r.crash) { setStatus('bad', esc(fill(t.crash, { m: String(r.crash).slice(0, 300) }))); return; }
      if (r.stopped) return;
      RES = r.r; RES_FOR = key; el.classList.remove('is-stale');
      setStatus(extra ? 'ok' : '', extra || '');
      drawAll();
    }
    function runPy() {
      var key = 'py\u0001' + JSON.stringify(query()), first = !el.classList.contains('is-pyok');
      if (first) setStatus('load', esc(t.pyLoad));
      R.runPy(query(), 6).then(function (r) { if (key !== 'py\u0001' + JSON.stringify(query()) || S.l !== 'py') return; el.classList.add('is-pyok'); got(r, key); });
    }
    function runJava() {
      if (S.l !== 'java') return;
      if (JV_BUSY) { JV_AGAIN = true; return; }
      var key = 'java\u0001' + JSON.stringify(query()), t0 = Date.now(), first = !el.classList.contains('is-jvok');
      if (key === RES_FOR) { el.classList.remove('is-stale'); return; }
      JV_BUSY = true; el.classList.add('is-jvbusy');
      setStatus(first ? 'load' : 'run', esc(first ? t.jvLoad : t.jvRun));
      R.runJava(query(), 25, function (p) { if (first && p && /compil|generat/i.test(p.stage || '')) setStatus('run', esc(t.jvRun)); }).then(function (r) {
        JV_BUSY = false; el.classList.remove('is-jvbusy'); el.classList.add('is-jvok');
        var again = JV_AGAIN; JV_AGAIN = false;
        if (S.l === 'java' && key === 'java\u0001' + JSON.stringify(query())) got(r, key, esc(fill(t.jvOk, { ms: K6.num((Date.now() - t0) / 1000, L, 1) })));
        else if (again || S.l === 'java') runJava();
      });
    }

    /* ---------- dibujo ---------- */
    function list() { return !RES || !RES.ok ? [] : (S.l === 'py' ? RES.finditer : RES.find); }
    function gname(i) { if (!RES || !RES.names) return ''; for (var k in RES.names) if (RES.names[k] === i) return k; return ''; }
    function drawAll() { drawErr(); drawView(-1); drawCard(-1); drawFns(); drawGroups(-1); PL.draw(); }
    function drawErr() {
      var box = q('.sl6-rx-err'), bad = RES && RES.ok === false;
      reIn.classList.toggle('is-bad', !!bad); box.hidden = !bad;
      if (!bad) return;
      var c = cur(), pos = RES.pos, where = '';
      if (pos != null && pos >= 0) where = '<pre class="sl6-rx-caret">' + esc(c.re) + '\n' + ' '.repeat(Math.min(pos, c.re.length)) + '^</pre>';
      var plain = plainErr(L, RES.full + ' ' + RES.msg);
      box.innerHTML = '<p class="sl6-rx-eh">' + esc(fill(t.errL, { l: S.l === 'py' ? 'Python' : 'Java' })) + '</p><pre class="sl6-rx-emsg">' + esc(String(RES.full).replace(/SL_NO_DISPONIBLE /, '').split('\n')[0]) + '</pre>' + where + (plain ? '<p class="sl6-rx-ep"><b>' + esc(t.errH) + ':</b> ' + esc(plain) + '</p>' : '');
    }
    function drawView(k) {
      var v = q('.sl6-rx-view'), c = cur(), M = list(), nh = q('.sl6-rx-nh');
      nh.textContent = RES && RES.ok ? fill(t.nMatches, { n: M.length + (RES.mas ? '+' : '') }) : t.hits;
      if (!RES || !RES.ok) { v.innerHTML = '<p class="sl6-rx-txt is-dim">' + esc(c.t) + '</p>'; return; }
      var txt = c.t, n = txt.length, own = new Array(n + 1), gown = new Array(n + 1), cut = {};
      M.forEach(function (m, i) {
        for (var j = m.s; j < m.e; j++) own[j] = i;
        if (m.s === m.e) cut[m.s] = (cut[m.s] || []).concat([i]);
      });
      if (k >= 0 && M[k]) {   // grupos de la coincidencia actual: gana el más interno (el más corto)
        var g = M[k].g, len = new Array(n + 1);
        g.forEach(function (x, gi) { if (!x) return; for (var j = x[0]; j < x[1]; j++) if (len[j] == null || x[1] - x[0] <= len[j]) { len[j] = x[1] - x[0]; gown[j] = gi; } });
      }
      var h = '', run = null, flush = function (j) {
        if (!run) return;
        var seg = esc(txt.slice(run.a, j)).replace(/\n/g, '<span class="sl6-rx-nl">↵</span>\n');
        if (run.m == null) h += seg;
        else {
          var cls = 'sl6-rx-m' + (run.m % 2 ? ' is-odd' : '') + (k >= 0 ? (run.m === k ? ' is-cur' : ' is-off') : '');
          var gs = run.g != null ? ' style="--g:' + COLS[run.g % COLS.length] + '" data-g="' + (run.g + 1) + '"' : '';
          h += '<mark class="' + cls + (run.g != null ? ' is-g' : '') + '"' + gs + ' data-m="' + run.m + '">' + seg + '</mark>';
        }
        run = null;
      };
      for (var j = 0; j <= n; j++) {
        if (cut[j]) { flush(j); cut[j].forEach(function (i) { h += '<i class="sl6-rx-e' + (k >= 0 ? (i === k ? ' is-cur' : ' is-off') : '') + '" title="' + esc(fill(t.th.pos + ' {p}', { p: j })) + '"></i>'; }); }
        if (j === n) break;
        var m = own[j], gg = m === k ? gown[j] : null;
        if (!run || run.m !== m || run.g !== gg) { flush(j); run = { a: j, m: m, g: gg == null ? null : gg }; }
      }
      flush(n);
      v.innerHTML = '<p class="sl6-rx-txt">' + (h || '&nbsp;') + '</p>' + (M.length ? '' : '<p class="sl6-help">' + esc(t.none) + '</p>') + (RES.mas ? '<p class="sl6-help">' + esc(t.more) + '</p>' : '');
      var curM = v.querySelector('.is-cur'); if (curM && k >= 0 && v.scrollHeight > v.clientHeight) v.scrollTop = Math.max(0, curM.offsetTop - v.clientHeight / 2);
    }
    function grpLine(m) {
      return m.g.map(function (x, gi) { var nm = gname(gi + 1); return '<span class="sl6-rx-gc" style="--g:' + COLS[gi % COLS.length] + '">' + esc(fill(t.stepG, { g: gi + 1, nm: nm ? ' (' + nm + ')' : '', v: x ? '«' + x[2] + '»' : 'None' }).replace('None', S.l === 'py' ? 'None' : 'null')) + '</span>'; }).join('');
    }
    function drawCard(k) {
      var c = q('.sl6-rx-card'), M = list(), f = S.l === 'py' ? 're.finditer()' : 'find()';
      if (!RES || !RES.ok) { c.innerHTML = ''; return; }
      if (k < 0) { c.innerHTML = '<p class="sl6-co-0">' + esc(fill(t.start, { f: f })) + '</p>'; drawGroups(-1); return; }
      if (k >= M.length) { c.innerHTML = '<p class="sl6-rx-sx">' + esc(fill(t.stepEnd, { n: M.length })) + '</p>'; drawGroups(-1); return; }
      var m = M[k], from = k ? M[k - 1].e + (M[k - 1].s === M[k - 1].e ? 0 : 0) : 0;
      c.innerHTML = '<p class="sl6-rx-sx">' + esc(fill(m.s === m.e ? t.stepEmpty : t.step, { k: k + 1, from: from, t: m.t, s: m.s, e: m.e })) + '</p>' + (m.g.length ? '<p class="sl6-rx-gl">' + grpLine(m) + '</p>' : '');
      drawGroups(k);
    }
    function mv(m) { return m ? '<code>«' + esc(m.t) + '»</code> <span class="sl6-rx-pos">' + m.s + '–' + m.e + '</span>' : '<span class="sl6-rx-no">' + esc(S.l === 'py' ? 'None' : t.no) + '</span>'; }
    function arr(a) { var py = S.l === 'py'; return '<code class="sl6-rx-arr">[' + a.map(function (s) { return py ? (s.indexOf("'") >= 0 && s.indexOf('"') < 0 ? '"' + esc(s) + '"' : "'" + esc(s.replace(/'/g, "\\'")) + "'") : esc(s); }).join(', ') + ']</code>'; }
    function drawFns() {
      var box = q('.sl6-rx-fns');
      if (!RES || !RES.ok) { box.innerHTML = ''; return; }
      var rows = [], c = cur();
      if (S.l === 'py') {
        rows.push(['match', 're.match()', t.fnPy.match, mv(RES.match)], ['search', 're.search()', t.fnPy.search, mv(RES.search)], ['fullmatch', 're.fullmatch()', t.fnPy.fullmatch, mv(RES.fullmatch)],
          ['findall', 're.findall()', t.fnPy.findall, RES.findall == null ? '…' : '<code class="sl6-rx-arr">' + esc(RES.findall) + '</code>']);
        if (c.rep != null) rows.push(['sub', 're.sub()', t.fnPy.sub, RES.sub && RES.sub.err ? '<span class="sl6-rx-no">' + esc(RES.sub.err) + '</span>' : '<code>«' + esc(RES.sub.t) + '»</code> <span class="sl6-rx-pos">' + esc(fill(t.nRep, { n: RES.sub.n })) + '</span>']);
        rows.push(['split', 're.split()', t.fnPy.split, arr(RES.split)]);
      } else {
        rows.push(['matches', 'matches()', t.fnJv.matches, mv(RES.matches)], ['lookingAt', 'lookingAt()', t.fnJv.lookingAt, mv(RES.lookingAt)], ['find', 'find()', t.fnJv.find, esc(fill(t.nMatches, { n: RES.find.length + (RES.mas ? '+' : '') })) + (RES.find[0] ? ' · ' + mv(RES.find[0]) + '…' : '')]);
        if (c.rep != null) rows.push(['replaceAll', 'replaceAll()', t.fnJv.replaceAll, RES.sub && RES.sub.err ? '<span class="sl6-rx-no">' + esc(RES.sub.err) + '</span>' : '<code>«' + esc(RES.sub.t) + '»</code> <span class="sl6-rx-pos">' + esc(fill(t.nRep, { n: RES.sub.n })) + '</span>']);
        rows.push(['split', 'split()', t.fnJv.split, arr(RES.split)]);
      }
      if (!rows.some(function (r) { return r[0] === S.fn; })) S.fn = S.l === 'py' ? 'search' : 'find';
      box.innerHTML = rows.map(function (r) { return '<button type="button" class="sl6-rx-fn' + (r[0] === S.fn ? ' is-on' : '') + '" data-fn="' + r[0] + '" aria-pressed="' + (r[0] === S.fn) + '"><b>' + esc(r[1]) + '</b><span class="sl6-rx-fd">' + esc(r[2]) + '</span><span class="sl6-rx-fr">' + r[3] + '</span></button>'; }).join('');
    }
    function drawGroups(k) {
      var box = q('.sl6-rx-grp'), M = list();
      if (!RES || !RES.ok) { box.innerHTML = ''; return; }
      if (!RES.ng) { box.innerHTML = '<p class="sl6-help">' + esc(t.noGroups) + '</p>'; return; }
      var h = '<div class="sl6-rx-gw"><table class="sl6-rx-gt"><thead><tr><th>' + esc(t.th.n) + '</th><th>' + esc(t.th.txt) + '</th>';
      for (var i = 1; i <= RES.ng; i++) { var nm = gname(i); h += '<th><span class="sl6-chip" style="--c:' + COLS[(i - 1) % COLS.length] + '"></span> ' + i + (nm ? ' <em>' + esc(nm) + '</em>' : '') + '</th>'; }
      h += '</tr></thead><tbody>' + M.slice(0, 60).map(function (m, j) {
        return '<tr' + (j === k ? ' class="is-cur"' : '') + '><th>' + (j + 1) + '</th><td><code>' + esc(m.t) + '</code></td>' + m.g.map(function (x) { return '<td>' + (x ? '<code>' + esc(x[2]) + '</code>' : '<span class="sl6-rx-no">' + (S.l === 'py' ? 'None' : 'null') + '</span>') + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
      box.innerHTML = h;
    }
    function drawCode() {
      var c = cur(), fn = S.fn, code;
      if (S.l === 'py') code = R.pyCode({ re: c.re, flags: c.f, rep: c.rep, text: c.t }, fn);
      else code = R.javaCode({ re: c.re, flags: c.f, rep: c.rep, text: c.t }, fn);
      q('.sl6-rx-ch').textContent = t.codeL + (S.l === 'py' ? ' · main.py' : ' · Main.java');
      q('.sl6-rx-code code').textContent = code;
      q('.sl6-rx-codeh').textContent = S.l === 'py' ? t.codeHpy : t.codeHjv;
    }

    /* ---------- eventos ---------- */
    function setLang(l) {
      if (l === S.l) return;
      readIn();
      var conv = l === 'java' ? toJava(S.py) : toPy(S.java), c = [];
      S[l] = { re: conv.re, f: conv.f, rep: conv.rep, t: conv.t };
      if (conv.c.indexOf('n') >= 0) c.push(l === 'java' ? t.cvNamed : t.cvNamedP);
      if (conv.c.indexOf('r') >= 0) c.push(l === 'java' ? t.cvRep : t.cvRepP);
      S.l = l; S.fn = l === 'py' ? 'search' : 'find'; RES = null; RES_FOR = '';
      var cv = q('.sl6-rx-conv'); cv.hidden = !c.length; cv.textContent = c.length ? fill(l === 'java' ? t.toJ : t.toP, { c: c.join('; ') }) : '';
      fill2(); drawAll(); setStatus('', ''); changed(true);
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-l],[data-a],[data-fn],[data-m]'); if (!b || !el.contains(b) || b.closest('.sl6-reto')) return;
      if (b.hasAttribute('data-l')) setLang(b.getAttribute('data-l'));
      else if (b.hasAttribute('data-fn')) { S.fn = b.getAttribute('data-fn'); drawFns(); drawCode(); K6.keepHash(state()); K6.store('sl_sim_regex_' + L, state()); }
      else if (b.hasAttribute('data-m')) { var i = +b.getAttribute('data-m'); PL.stop(); el.classList.add('is-going'); PL.k = i; PL.going = true; PL.draw(); }
      else { var a = b.getAttribute('data-a');
        if (a === 'theme') K6.toggleTheme(K);
        else if (a === 'share') K6.share(K, b, state());
        else if (a === 'java') { clearTimeout(JV_T); runJava(); }
        else if (a === 'copy') { var sp = b.querySelector('span'), txt = q('.sl6-rx-code code').textContent; var say = function (m) { sp.textContent = m; setTimeout(function () { sp.textContent = t.copy; }, 1800); }; if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { say(t.copied); }, function () {}); }
      }
    });
    var onIn = function () { S.ex = ''; q('.sl6-sel').value = ''; q('.sl6-rx-conv').hidden = true; changed(); };
    reIn.addEventListener('input', onIn); tIn.addEventListener('input', onIn); repIn.addEventListener('input', onIn);
    repC.addEventListener('change', function () { repIn.hidden = !repC.checked; if (repC.checked) repIn.focus(); onIn(); });
    q('.sl6-rx-flags').addEventListener('change', onIn);
    reIn.addEventListener('keydown', function (e) { if (e.key === 'Enter' && S.l === 'java') { clearTimeout(JV_T); runJava(); } });
    q('.sl6-sel').addEventListener('change', function (e) {
      var x = exs.filter(function (z) { return z.k === e.target.value; })[0]; if (!x) return;
      S.ex = x.k; S.py = { re: x.re, f: x.f.slice(), rep: x.rep, t: x.t }; S.java = toJava(S.py);
      S.fn = S.l === 'py' ? (x.k === 'csv' ? 'split' : x.rep != null ? 'sub' : 'search') : (x.k === 'csv' ? 'split' : x.rep != null ? 'replaceAll' : 'find');
      q('.sl6-rx-conv').hidden = true; fill2(); changed(true);
    });

    /* ---------- reto ---------- */
    var RT = { i: 0 };
    function retoDraw(res) {
      var r = RETOS[L][RT.i], box = q('.sl6-reto');
      var li = function (s, want, j) {
        var st = res ? (res[j] === want ? 'ok' : 'bad') : '';
        return '<li class="' + (st ? 'is-' + st : '') + '"><code>' + esc(s || ' ') + '</code>' + (st ? ico(st === 'ok' ? 'check' : 'wave', 15) : '') + '</li>';
      };
      box.innerHTML = '<h3 class="sl6-reto__h">' + esc(t.reto) + '</h3><p class="sl6-reto__lead">' + esc(t.retoLead) + '</p><p class="sl6-rd-q">' + esc(r.n) + '</p>'
        + '<label class="sl6-lbl" for="' + K.id + '-rt">' + esc(t.retoIn) + ' · ' + (S.l === 'py' ? 'Python' : 'Java') + '</label><div class="sl6-rx-re"><span class="sl6-rx-del" aria-hidden="true">/</span><input type="text" id="' + K.id + '-rt" class="sl6-rx-in sl6-rx-rin" spellcheck="false" autocomplete="off" autocapitalize="off"><span class="sl6-rx-del" aria-hidden="true">/</span></div>'
        + '<div class="sl6-rx-rl"><div><p class="sl6-lbl">' + esc(t.yes) + '</p><ul class="sl6-rx-ul">' + r.si.map(function (s, j) { return li(s, true, j); }).join('') + '</ul></div><div><p class="sl6-lbl">' + esc(t.nope) + '</p><ul class="sl6-rx-ul">' + r.no.map(function (s, j) { return li(s, false, r.si.length + j); }).join('') + '</ul></div></div>'
        + '<div class="sl6-reto__act"><button type="button" class="sl6-btn sl6-btn--p" data-rr="check">' + ico('check', 16) + esc(K.t.check) + '</button><button type="button" class="sl6-btn" data-rr="new">' + ico('dice', 16) + esc(K.t.retoNew) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-rr="hint">' + ico('book', 16) + esc(t.hint) + '</button></div><p class="sl6-reto__msg" aria-live="polite"></p>';
      var inp = q('.sl6-rx-rin'); inp.value = RT.v || ''; inp.addEventListener('input', function () { RT.v = inp.value; });
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') retoCheck(); });
    }
    function retoCheck() {
      var r = RETOS[L][RT.i], v = (RT.v || '').trim(), msg = q('.sl6-reto__msg'); if (!v) return;
      msg.innerHTML = '<i class="sl6-rx-spin" aria-hidden="true"></i> ' + esc(t.running);
      var all = r.si.concat(r.no), qq = { re: S.l === 'py' ? v : toJava({ re: v, rep: null, f: [] }).re, flags: S.l === 'py' ? [] : 0, rep: null, text: '', retos: all };
      (S.l === 'py' ? R.runPy(qq, 6) : R.runJava(qq, 25)).then(function (x) {
        if (!x.r) { msg.textContent = x.timeout ? fill(t.timeout, { s: S.l === 'py' ? 6 : 25 }) : t.fail; return; }
        if (!x.r.ok) { retoDraw(null); q('.sl6-reto__msg').innerHTML = '<span class="is-bad">' + esc(x.r.full) + '</span>' + (plainErr(L, x.r.full) ? ' ' + esc(plainErr(L, x.r.full)) : ''); return; }
        var res = x.r.retos, good = all.every(function (s, j) { return res[j] === j < r.si.length; });
        retoDraw(res);
        var m = q('.sl6-reto__msg'); m.className = 'sl6-reto__msg ' + (good ? 'is-ok' : 'is-bad');
        m.innerHTML = esc(good ? t.allOk : t.someBad) + (good ? '' : '') + ' <button type="button" class="sl6-btn sl6-btn--g" data-rr="sol">' + ico('arrow', 15) + esc(t.solL) + '</button>';
      });
    }
    q('.sl6-reto').addEventListener('click', function (e) {
      var b = e.target.closest('[data-rr]'); if (!b) return;
      var a = b.getAttribute('data-rr'), r = RETOS[L][RT.i];
      if (a === 'check') retoCheck();
      else if (a === 'new') { RT.i = (RT.i + 1 + Math.floor(Math.random() * (RETOS[L].length - 1))) % RETOS[L].length; RT.v = ''; retoDraw(null); }
      else if (a === 'hint') { var m = q('.sl6-reto__msg'); m.className = 'sl6-reto__msg'; m.innerHTML = esc(r.pista) + '<br><span class="sl6-rx-sol">' + esc(fill(t.solShow, { s: r.sol })) + '</span>'; }
      else if (a === 'sol') {
        var v = (RT.v || r.sol), txt = r.si.concat(r.no).join('\n');
        S.ex = ''; S.py = { re: '^(?:' + v + ')$', f: ['M'], rep: null, t: txt }; S.java = toJava(S.py);
        S.fn = S.l === 'py' ? 'search' : 'find'; fill2(); changed(true);
        q('.sl6-win').scrollIntoView({ behavior: K6.reduced ? 'auto' : 'smooth', block: 'start' });
      }
    });

    fill2(); cmdLine(); drawCode(); retoDraw(null); drawAll(); setStatus('', '');
    if (S.l === 'py') changed(true);
    else { setStatus('load', esc(t.jvLoad)); changed(true); }
  }
  K6.boot('.sl-sim[data-sim="regex"]', mount);
})();
