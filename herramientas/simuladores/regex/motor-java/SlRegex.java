/*
 * Copyright (c) 1999, 2023, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */
/* SergioLearns: java.util.regex de OpenJDK 21 (jdk21u) aplanado en una unidad para TeaVM.
 * Cambios: paquete por defecto, sin serialización, sin Normalizer (CANON_EQ),
 * sin \N{...}, escrituras \p{IsLatin} ni propiedades de emoji/ideogramas (dan error, nunca un resultado falso). */
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.ConcurrentModificationException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Set;
import java.util.Spliterator;
import java.util.Spliterators;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;
final class Pattern
    implements java.io.Serializable
{
    public static final int UNIX_LINES = 0x01;
    public static final int CASE_INSENSITIVE = 0x02;
    public static final int COMMENTS = 0x04;
    public static final int MULTILINE = 0x08;
    public static final int LITERAL = 0x10;
    public static final int DOTALL = 0x20;
    public static final int UNICODE_CASE = 0x40;
    public static final int CANON_EQ = 0x80;
    public static final int UNICODE_CHARACTER_CLASS = 0x100;
    private static final int ALL_FLAGS = CASE_INSENSITIVE | MULTILINE |
            DOTALL | UNICODE_CASE | CANON_EQ | UNIX_LINES | LITERAL |
            UNICODE_CHARACTER_CLASS | COMMENTS;
    private static final long serialVersionUID = 5073258162644648461L;
    private String pattern;
    private int flags;
    private transient int flags0;
    private transient volatile boolean compiled;
    private transient String normalizedPattern;
    transient Node root;
    transient Node matchRoot;
    transient int[] buffer;
    transient CharPredicate predicate;
    transient volatile Map<String, Integer> namedGroups;
    transient GroupHead[] groupNodes;
    transient List<Node> topClosureNodes;
    transient int localTCNCount;
    transient boolean hasGroupRef;
    private transient int[] temp;
    transient int capturingGroupCount;
    transient int localCount;
    private transient int cursor;
    private transient int patternLength;
    private transient boolean hasSupplementary;
    public static Pattern compile(String regex) {
        return new Pattern(regex, 0);
    }
    public static Pattern compile(String regex, int flags) {
        return new Pattern(regex, flags);
    }
    public String pattern() {
        return pattern;
    }
    public String toString() {
        return pattern;
    }
    public Matcher matcher(CharSequence input) {
        if (!compiled) {
            synchronized(this) {
                if (!compiled)
                    compile();
            }
        }
        Matcher m = new Matcher(this, input);
        return m;
    }
    public int flags() {
        return flags0;
    }
    public static boolean matches(String regex, CharSequence input) {
        Pattern p = Pattern.compile(regex);
        Matcher m = p.matcher(input);
        return m.matches();
    }
    public String[] split(CharSequence input, int limit) {
        return split(input, limit, false);
    }
    public String[] splitWithDelimiters(CharSequence input, int limit) {
        return split(input, limit, true);
    }
    private String[] split(CharSequence input, int limit, boolean withDelimiters) {
        int matchCount = 0;
        int index = 0;
        boolean matchLimited = limit > 0;
        ArrayList<String> matchList = new ArrayList<>();
        Matcher m = matcher(input);
        while(m.find()) {
            if (!matchLimited || matchCount < limit - 1) {
                if (index == 0 && index == m.start() && m.start() == m.end()) {
                    continue;
                }
                String match = input.subSequence(index, m.start()).toString();
                matchList.add(match);
                index = m.end();
                if (withDelimiters) {
                    matchList.add(input.subSequence(m.start(), index).toString());
                }
                ++matchCount;
            } else if (matchCount == limit - 1) {
                String match = input.subSequence(index, input.length()).toString();
                matchList.add(match);
                index = m.end();
                ++matchCount;
            }
        }
        if (index == 0)
            return new String[] {input.toString()};
        if (!matchLimited || matchCount < limit)
            matchList.add(input.subSequence(index, input.length()).toString());
        int resultSize = matchList.size();
        if (limit == 0) {
            while (resultSize > 0 && matchList.get(resultSize-1).isEmpty()) {
                resultSize--;
            }
        }
        String[] result = new String[resultSize];
        return matchList.subList(0, resultSize).toArray(result);
    }
    public String[] split(CharSequence input) {
        return split(input, 0, false);
    }
    public static String quote(String s) {
        int slashEIndex = s.indexOf("\\E");
        if (slashEIndex == -1)
            return "\\Q" + s + "\\E";
        int lenHint = s.length();
        lenHint = (lenHint < Integer.MAX_VALUE - 8 - lenHint) ?
                (lenHint << 1) : (Integer.MAX_VALUE - 8);
        StringBuilder sb = new StringBuilder(lenHint);
        sb.append("\\Q");
        int current = 0;
        do {
            sb.append(s, current, slashEIndex)
                    .append("\\E\\\\E\\Q");
            current = slashEIndex + 2;
        } while ((slashEIndex = s.indexOf("\\E", current)) != -1);
        return sb.append(s, current, s.length())
                .append("\\E")
                .toString();
    }
    private Pattern(String p, int f) {
        if ((f & ~ALL_FLAGS) != 0) {
            throw new IllegalArgumentException("Unknown flag 0x"
                                               + Integer.toHexString(f));
        }
        pattern = p;
        flags = f;
        if ((flags & UNICODE_CHARACTER_CLASS) != 0)
            flags |= UNICODE_CASE;
        flags0 = flags;
        capturingGroupCount = 1;
        localCount = 0;
        localTCNCount = 0;
        if (!pattern.isEmpty()) {
            try {
                compile();
            } catch (StackOverflowError soe) {
                throw error("Stack overflow during pattern compilation");
            }
        } else {
            root = new Start(lastAccept);
            matchRoot = lastAccept;
        }
    }
    private static String normalize(String pattern) {
        int plen = pattern.length();
        StringBuilder pbuf = new StringBuilder(plen);
        char last = 0;
        int lastStart = 0;
        char cc = 0;
        for (int i = 0; i < plen;) {
            char c = pattern.charAt(i);
            if (cc == 0 &&
                c == '\\' && i + 1 < plen && pattern.charAt(i + 1) == '\\') {
                i += 2; last = 0;
                continue;
            }
            if (c == '[' && last != '\\') {
                if (cc == 0) {
                    if (lastStart < i)
                        normalizeSlice(pattern, lastStart, i, pbuf);
                    lastStart = i;
                }
                cc++;
            } else if (c == ']' && last != '\\') {
                cc--;
                if (cc == 0) {
                    normalizeClazz(pattern, lastStart, i + 1, pbuf);
                    lastStart = i + 1;
                }
            }
            last = c;
            i++;
        }
        assert (cc == 0);
        if (lastStart < plen)
            normalizeSlice(pattern, lastStart, plen, pbuf);
        return pbuf.toString();
    }
    private static void normalizeSlice(String src, int off, int limit,
                                       StringBuilder dst)
    {
        int len = src.length();
        int off0 = off;
        while (off < limit && ASCII.isAscii(src.charAt(off))) {
            off++;
        }
        if (off == limit) {
            dst.append(src, off0, limit);
            return;
        }
        off--;
        if (off < off0)
            off = off0;
        else
            dst.append(src, off0, off);
        while (off < limit) {
            int ch0 = src.codePointAt(off);
            if (".$|()[]{}^?*+\\".indexOf(ch0) != -1) {
                dst.append((char)ch0);
                off++;
                continue;
            }
            int j = Grapheme.nextBoundary(src, off, limit);
            int ch1;
            String seq = src.substring(off, j);
            String nfd = SlNorm.normalize(seq, null);
            off = j;
            if (nfd.codePointCount(0, nfd.length()) > 1) {
                ch0 = nfd.codePointAt(0);
                ch1 = nfd.codePointAt(Character.charCount(ch0));
                if (Character.getType(ch1) == Character.NON_SPACING_MARK) {
                    Set<String> altns = new LinkedHashSet<>();
                    altns.add(seq);
                    produceEquivalentAlternation(nfd, altns);
                    dst.append("(?:");
                    altns.forEach( s -> dst.append(s).append('|'));
                    dst.delete(dst.length() - 1, dst.length());
                    dst.append(")");
                    continue;
                }
            }
            String nfc = SlNorm.normalize(seq, null);
            if (!seq.equals(nfc) && !nfd.equals(nfc))
                dst.append("(?:" + seq + "|" + nfd  + "|" + nfc + ")");
            else if (!seq.equals(nfd))
                dst.append("(?:" + seq + "|" + nfd + ")");
            else
                dst.append(seq);
        }
    }
    private static void normalizeClazz(String src, int off, int limit,
                                       StringBuilder dst)
    {
        dst.append(SlNorm.normalize(src.substring(off, limit), null));
    }
    private static void produceEquivalentAlternation(String src,
                                                     Set<String> dst)
    {
        int len = countChars(src, 0, 1);
        if (src.length() == len) {
            dst.add(src);
            return;
        }
        String base = src.substring(0,len);
        String combiningMarks = src.substring(len);
        String[] perms = producePermutations(combiningMarks);
        for(int x = 0; x < perms.length; x++) {
            String next = base + perms[x];
            dst.add(next);
            next = composeOneStep(next);
            if (next != null) {
                produceEquivalentAlternation(next, dst);
            }
        }
    }
    private static String[] producePermutations(String input) {
        if (input.length() == countChars(input, 0, 1))
            return new String[] {input};
        if (input.length() == countChars(input, 0, 2)) {
            int c0 = Character.codePointAt(input, 0);
            int c1 = Character.codePointAt(input, Character.charCount(c0));
            if (getClass(c1) == getClass(c0)) {
                return new String[] {input};
            }
            String[] result = new String[2];
            result[0] = input;
            StringBuilder sb = new StringBuilder(2);
            sb.appendCodePoint(c1);
            sb.appendCodePoint(c0);
            result[1] = sb.toString();
            return result;
        }
        int nCodePoints = countCodePoints(input);
        if (nCodePoints > 12) {
            throw new OutOfMemoryError("Pattern too complex");
        }
        int length = 1;
        for (int x = 2; x <= nCodePoints; ++x) {
            length *= x;
        }
        String[] temp = new String[length];
        int[] combClass = new int[nCodePoints];
        for(int x=0, i=0; x<nCodePoints; x++) {
            int c = Character.codePointAt(input, i);
            combClass[x] = getClass(c);
            i +=  Character.charCount(c);
        }
        int index = 0;
        int len;
loop:   for(int x=0, offset=0; x<nCodePoints; x++, offset+=len) {
            len = countChars(input, offset, 1);
            for(int y=x-1; y>=0; y--) {
                if (combClass[y] == combClass[x]) {
                    continue loop;
                }
            }
            StringBuilder sb = new StringBuilder(input);
            String otherChars = sb.delete(offset, offset+len).toString();
            String[] subResult = producePermutations(otherChars);
            String prefix = input.substring(offset, offset+len);
            for (String sre : subResult)
                temp[index++] = prefix + sre;
        }
        String[] result = new String[index];
        System.arraycopy(temp, 0, result, 0, index);
        return result;
    }
    private static int getClass(int c) {
        return 0;
    }
    private static String composeOneStep(String input) {
        int len = countChars(input, 0, 2);
        String firstTwoCharacters = input.substring(0, len);
        String result = SlNorm.normalize(firstTwoCharacters, null);
        if (result.equals(firstTwoCharacters))
            return null;
        else {
            String remainder = input.substring(len);
            return result + remainder;
        }
    }
    private void RemoveQEQuoting() {
        final int pLen = patternLength;
        int i = 0;
        while (i < pLen-1) {
            if (temp[i] != '\\')
                i += 1;
            else if (temp[i + 1] != 'Q')
                i += 2;
            else
                break;
        }
        if (i >= pLen - 1)
            return;
        int j = i;
        i += 2;
        int newTempLen;
        try {
            newTempLen = Math.addExact(j + 2, Math.multiplyExact(3, pLen - i));
        } catch (ArithmeticException ae) {
            throw new OutOfMemoryError("Required pattern length too large");
        }
        int[] newtemp = new int[newTempLen];
        System.arraycopy(temp, 0, newtemp, 0, j);
        boolean inQuote = true;
        boolean beginQuote = true;
        while (i < pLen) {
            int c = temp[i++];
            if (!ASCII.isAscii(c) || ASCII.isAlpha(c)) {
                newtemp[j++] = c;
            } else if (ASCII.isDigit(c)) {
                if (beginQuote) {
                    newtemp[j++] = '\\';
                    newtemp[j++] = 'x';
                    newtemp[j++] = '3';
                }
                newtemp[j++] = c;
            } else if (c != '\\') {
                if (inQuote) newtemp[j++] = '\\';
                newtemp[j++] = c;
            } else if (inQuote) {
                if (temp[i] == 'E') {
                    i++;
                    inQuote = false;
                } else {
                    newtemp[j++] = '\\';
                    newtemp[j++] = '\\';
                }
            } else {
                if (temp[i] == 'Q') {
                    i++;
                    inQuote = true;
                    beginQuote = true;
                    continue;
                } else {
                    newtemp[j++] = c;
                    if (i != pLen)
                        newtemp[j++] = temp[i++];
                }
            }
            beginQuote = false;
        }
        patternLength = j;
        temp = Arrays.copyOf(newtemp, j + 2);
    }
    private void compile() {
        if (has(CANON_EQ) && !has(LITERAL)) {
            normalizedPattern = normalize(pattern);
        } else {
            normalizedPattern = pattern;
        }
        patternLength = normalizedPattern.length();
        temp = new int[patternLength + 2];
        hasSupplementary = false;
        int c, count = 0;
        for (int x = 0; x < patternLength; x += Character.charCount(c)) {
            c = normalizedPattern.codePointAt(x);
            if (isSupplementary(c)) {
                hasSupplementary = true;
            }
            temp[count++] = c;
        }
        patternLength = count;
        if (! has(LITERAL))
            RemoveQEQuoting();
        buffer = new int[32];
        groupNodes = new GroupHead[10];
        namedGroups = null;
        topClosureNodes = new ArrayList<>(10);
        if (has(LITERAL)) {
            matchRoot = newSlice(temp, patternLength, hasSupplementary);
            matchRoot.next = lastAccept;
        } else {
            matchRoot = expr(lastAccept);
            if (patternLength != cursor) {
                if (peek() == ')') {
                    throw error("Unmatched closing ')'");
                } else if (cursor == patternLength + 1 && temp[patternLength - 1] == '\\') {
                    throw error("Unescaped trailing backslash");
                } else {
                    throw error("Unexpected internal error");
                }
            }
        }
        if (matchRoot instanceof Slice) {
            root = BnM.optimize(matchRoot);
            if (root == matchRoot) {
                root = hasSupplementary ? new StartS(matchRoot) : new Start(matchRoot);
            }
        } else if (matchRoot instanceof Begin || matchRoot instanceof First) {
            root = matchRoot;
        } else {
            root = hasSupplementary ? new StartS(matchRoot) : new Start(matchRoot);
        }
        if (!hasGroupRef) {
            for (Node node : topClosureNodes) {
                if (node instanceof Loop) {
                    ((Loop)node).posIndex = localTCNCount++;
                }
            }
        }
        temp = null;
        buffer = null;
        groupNodes = null;
        patternLength = 0;
        compiled = true;
        topClosureNodes = null;
    }
    private Map<String, Integer> namedGroupsMap() {
        Map<String, Integer> groups = namedGroups;
        if (groups == null) {
            namedGroups = groups = new HashMap<>(2);
        }
        return groups;
    }
    public Map<String, Integer> namedGroups() {
        return Map.copyOf(namedGroupsMap());
    }
    static final class TreeInfo {
        int minLength;
        int maxLength;
        boolean maxValid;
        boolean deterministic;
        TreeInfo() {
            reset();
        }
        void reset() {
            minLength = 0;
            maxLength = 0;
            maxValid = true;
            deterministic = true;
        }
    }
    private boolean has(int f) {
        return (flags0 & f) != 0;
    }
    private void accept(int ch, String s) {
        int testChar = temp[cursor++];
        if (has(COMMENTS))
            testChar = parsePastWhitespace(testChar);
        if (ch != testChar) {
            throw error(s);
        }
    }
    private void mark(int c) {
        temp[patternLength] = c;
    }
    private int peek() {
        int ch = temp[cursor];
        if (has(COMMENTS))
            ch = peekPastWhitespace(ch);
        return ch;
    }
    private int read() {
        int ch = temp[cursor++];
        if (has(COMMENTS))
            ch = parsePastWhitespace(ch);
        return ch;
    }
    private int readEscaped() {
        int ch = temp[cursor++];
        return ch;
    }
    private int next() {
        int ch = temp[++cursor];
        if (has(COMMENTS))
            ch = peekPastWhitespace(ch);
        return ch;
    }
    private int nextEscaped() {
        int ch = temp[++cursor];
        return ch;
    }
    private int peekPastWhitespace(int ch) {
        while (ASCII.isSpace(ch) || ch == '#') {
            while (ASCII.isSpace(ch))
                ch = temp[++cursor];
            if (ch == '#') {
                ch = peekPastLine();
            }
        }
        return ch;
    }
    private int parsePastWhitespace(int ch) {
        while (ASCII.isSpace(ch) || ch == '#') {
            while (ASCII.isSpace(ch))
                ch = temp[cursor++];
            if (ch == '#')
                ch = parsePastLine();
        }
        return ch;
    }
    private int parsePastLine() {
        int ch = temp[cursor++];
        while (ch != 0 && !isLineSeparator(ch))
            ch = temp[cursor++];
        if (ch == 0 && cursor > patternLength) {
            cursor = patternLength;
            ch = temp[cursor++];
        }
        return ch;
    }
    private int peekPastLine() {
        int ch = temp[++cursor];
        while (ch != 0 && !isLineSeparator(ch))
            ch = temp[++cursor];
        if (ch == 0 && cursor > patternLength) {
            cursor = patternLength;
            ch = temp[cursor];
        }
        return ch;
    }
    private boolean isLineSeparator(int ch) {
        if (has(UNIX_LINES)) {
            return ch == '\n';
        } else {
            return (ch == '\n' ||
                    ch == '\r' ||
                    (ch|1) == '\u2029' ||
                    ch == '\u0085');
        }
    }
    private int skip() {
        int i = cursor;
        int ch = temp[i+1];
        cursor = i + 2;
        return ch;
    }
    private void unread() {
        cursor--;
    }
    private PatternSyntaxException error(String s) {
        return new PatternSyntaxException(s, normalizedPattern,  cursor - 1);
    }
    private boolean findSupplementary(int start, int end) {
        for (int i = start; i < end; i++) {
            if (isSupplementary(temp[i]))
                return true;
        }
        return false;
    }
    private static final boolean isSupplementary(int ch) {
        return ch >= Character.MIN_SUPPLEMENTARY_CODE_POINT ||
               Character.isSurrogate((char)ch);
    }
    private Node expr(Node end) {
        Node prev = null;
        Node firstTail = null;
        Branch branch = null;
        Node branchConn = null;
        for (;;) {
            Node node = sequence(end);
            Node nodeTail = root;
            if (prev == null) {
                prev = node;
                firstTail = nodeTail;
            } else {
                if (branchConn == null) {
                    branchConn = new BranchConn();
                    branchConn.next = end;
                }
                if (node == end) {
                    node = null;
                } else {
                    nodeTail.next = branchConn;
                }
                if (prev == branch) {
                    branch.add(node);
                } else {
                    if (prev == end) {
                        prev = null;
                    } else {
                        firstTail.next = branchConn;
                    }
                    prev = branch = new Branch(prev, node, branchConn);
                }
            }
            if (peek() != '|') {
                return prev;
            }
            next();
        }
    }
    @SuppressWarnings("fallthrough")
    private Node sequence(Node end) {
        Node head = null;
        Node tail = null;
        Node node;
    LOOP:
        for (;;) {
            int ch = peek();
            switch (ch) {
            case '(':
                node = group0();
                if (node == null)
                    continue;
                if (head == null)
                    head = node;
                else
                    tail.next = node;
                tail = root;
                continue;
            case '[':
                if (has(CANON_EQ) && !has(LITERAL))
                    node = new NFCCharProperty(clazz(true));
                else
                    node = newCharProperty(clazz(true));
                break;
            case '\\':
                ch = nextEscaped();
                if (ch == 'p' || ch == 'P') {
                    boolean oneLetter = true;
                    boolean comp = (ch == 'P');
                    ch = next();
                    if (ch != '{') {
                        unread();
                    } else {
                        oneLetter = false;
                    }
                    if (has(CANON_EQ) && !has(LITERAL))
                        node = new NFCCharProperty(family(oneLetter, comp));
                    else
                        node = newCharProperty(family(oneLetter, comp));
                } else {
                    unread();
                    node = atom();
                }
                break;
            case '^':
                next();
                if (has(MULTILINE)) {
                    if (has(UNIX_LINES))
                        node = new UnixCaret();
                    else
                        node = new Caret();
                } else {
                    node = new Begin();
                }
                break;
            case '$':
                next();
                if (has(UNIX_LINES))
                    node = new UnixDollar(has(MULTILINE));
                else
                    node = new Dollar(has(MULTILINE));
                break;
            case '.':
                next();
                if (has(DOTALL)) {
                    node = new CharProperty(ALL());
                } else {
                    if (has(UNIX_LINES)) {
                        node = new CharProperty(UNIXDOT());
                    } else {
                        node = new CharProperty(DOT());
                    }
                }
                break;
            case '|':
            case ')':
                break LOOP;
            case ']':
            case '}':
                node = atom();
                break;
            case '?':
            case '*':
            case '+':
                next();
                throw error("Dangling meta character '" + ((char)ch) + "'");
            case 0:
                if (cursor >= patternLength) {
                    break LOOP;
                }
            default:
                node = atom();
                break;
            }
            node = closure(node);
            if (head == null) {
                head = tail = node;
            } else {
                tail.next = node;
                tail = node;
            }
        }
        if (head == null) {
            return end;
        }
        tail.next = end;
        root = tail;
        return head;
    }
    @SuppressWarnings("fallthrough")
    private Node atom() {
        int first = 0;
        int prev = -1;
        boolean hasSupplementary = false;
        int ch = peek();
        for (;;) {
            switch (ch) {
            case '*':
            case '+':
            case '?':
            case '{':
                if (first > 1) {
                    cursor = prev;
                    first--;
                }
                break;
            case '$':
            case '.':
            case '^':
            case '(':
            case '[':
            case '|':
            case ')':
                break;
            case '\\':
                ch = nextEscaped();
                if (ch == 'p' || ch == 'P') {
                    if (first > 0) {
                        unread();
                        break;
                    } else {
                        boolean comp = (ch == 'P');
                        boolean oneLetter = true;
                        ch = next();
                        if (ch != '{')
                            unread();
                        else
                            oneLetter = false;
                        if (has(CANON_EQ) && !has(LITERAL))
                            return new NFCCharProperty(family(oneLetter, comp));
                        else
                            return newCharProperty(family(oneLetter, comp));
                    }
                }
                unread();
                prev = cursor;
                ch = escape(false, first == 0, false);
                if (ch >= 0) {
                    append(ch, first);
                    first++;
                    if (isSupplementary(ch)) {
                        hasSupplementary = true;
                    }
                    ch = peek();
                    continue;
                } else if (first == 0) {
                    return root;
                }
                cursor = prev;
                break;
            case 0:
                if (cursor >= patternLength) {
                    break;
                }
            default:
                prev = cursor;
                append(ch, first);
                first++;
                if (isSupplementary(ch)) {
                    hasSupplementary = true;
                }
                ch = next();
                continue;
            }
            break;
        }
        if (first == 1) {
            return newCharProperty(single(buffer[0]));
        } else {
            return newSlice(buffer, first, hasSupplementary);
        }
    }
    private void append(int ch, int index) {
        int len = buffer.length;
        if (index - len >= 0) {
            len = len + Math.max(1 + index - len, len);
            buffer = Arrays.copyOf(buffer, len);
        }
        buffer[index] = ch;
    }
    private Node ref(int refNum) {
        boolean done = false;
        while(!done) {
            int ch = peek();
            switch (ch) {
                case '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' -> {
                    int newRefNum = (refNum * 10) + (ch - '0');
                    if (capturingGroupCount - 1 < newRefNum) {
                        done = true;
                        break;
                    }
                    refNum = newRefNum;
                    read();
                }
                default -> done = true;
            }
        }
        hasGroupRef = true;
        if (has(CASE_INSENSITIVE))
            return new CIBackRef(refNum, has(UNICODE_CASE));
        else
            return new BackRef(refNum);
    }
    private int escape(boolean inclass, boolean create, boolean isrange) {
        int ch = skip();
        switch (ch) {
        case '0':
            return o();
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            if (inclass) break;
            if (create) {
                root = ref((ch - '0'));
            }
            return -1;
        case 'A':
            if (inclass) break;
            if (create) root = new Begin();
            return -1;
        case 'B':
            if (inclass) break;
            if (create) root = new Bound(Bound.NONE, has(UNICODE_CHARACTER_CLASS));
            return -1;
        case 'C':
            break;
        case 'D':
            if (create) {
                predicate = has(UNICODE_CHARACTER_CLASS) ?
                            CharPredicates.DIGIT() : CharPredicates.ASCII_DIGIT();
                predicate = predicate.negate();
                if (!inclass)
                    root = newCharProperty(predicate);
            }
            return -1;
        case 'E':
        case 'F':
            break;
        case 'G':
            if (inclass) break;
            if (create) root = new LastMatch();
            return -1;
        case 'H':
            if (create) {
                predicate = HorizWS().negate();
                if (!inclass)
                    root = newCharProperty(predicate);
            }
            return -1;
        case 'I':
        case 'J':
        case 'K':
        case 'L':
        case 'M':
            break;
        case 'N':
            return N();
        case 'O':
        case 'P':
        case 'Q':
            break;
        case 'R':
            if (inclass) break;
            if (create) root = new LineEnding();
            return -1;
        case 'S':
            if (create) {
                predicate = has(UNICODE_CHARACTER_CLASS) ?
                            CharPredicates.WHITE_SPACE() : CharPredicates.ASCII_SPACE();
                predicate = predicate.negate();
                if (!inclass)
                    root = newCharProperty(predicate);
            }
            return -1;
        case 'T':
        case 'U':
            break;
        case 'V':
            if (create) {
                predicate = VertWS().negate();
                if (!inclass)
                    root = newCharProperty(predicate);
            }
            return -1;
        case 'W':
            if (create) {
                predicate = has(UNICODE_CHARACTER_CLASS) ?
                            CharPredicates.WORD() : CharPredicates.ASCII_WORD();
                predicate = predicate.negate();
                if (!inclass)
                    root = newCharProperty(predicate);
            }
            return -1;
        case 'X':
            if (inclass) break;
            if (create) {
                root = new XGrapheme();
            }
            return -1;
        case 'Y':
            break;
        case 'Z':
            if (inclass) break;
            if (create) {
                if (has(UNIX_LINES))
                    root = new UnixDollar(false);
                else
                    root = new Dollar(false);
            }
            return -1;
        case 'a':
            return '\007';
        case 'b':
            if (inclass) break;
            if (create) {
                if (peek() == '{') {
                    if (skip() == 'g') {
                        if (read() == '}') {
                            root = new GraphemeBound();
                            return -1;
                        }
                        break;
                    }
                    unread(); unread();
                }
                root = new Bound(Bound.BOTH, has(UNICODE_CHARACTER_CLASS));
            }
            return -1;
        case 'c':
            return c();
        case 'd':
            if (create) {
                predicate = has(UNICODE_CHARACTER_CLASS) ?
                            CharPredicates.DIGIT() : CharPredicates.ASCII_DIGIT();
                if (!inclass)
                    root = newCharProperty(predicate);
            }
            return -1;
        case 'e':
            return '\033';
        case 'f':
            return '\f';
        case 'g':
            break;
        case 'h':
            if (create) {
                predicate = HorizWS();
                if (!inclass)
                    root = newCharProperty(predicate);
            }
            return -1;
        case 'i':
        case 'j':
            break;
        case 'k':
            if (inclass)
                break;
            if (read() != '<')
                throw error("\\k is not followed by '<' for named capturing group");
            String name = groupname(read());
            Integer number = namedGroupsMap().get(name);
            if (number == null)
                throw error("named capturing group <" + name + "> does not exist");
            if (create) {
                hasGroupRef = true;
                if (has(CASE_INSENSITIVE))
                    root = new CIBackRef(number, has(UNICODE_CASE));
                else
                    root = new BackRef(number);
            }
            return -1;
        case 'l':
        case 'm':
            break;
        case 'n':
            return '\n';
        case 'o':
        case 'p':
        case 'q':
            break;
        case 'r':
            return '\r';
        case 's':
            if (create) {
                predicate = has(UNICODE_CHARACTER_CLASS) ?
                            CharPredicates.WHITE_SPACE() : CharPredicates.ASCII_SPACE();
                if (!inclass)
                    root = newCharProperty(predicate);
            }
            return -1;
        case 't':
            return '\t';
        case 'u':
            return u();
        case 'v':
            if (isrange)
                return '\013';
            if (create) {
                predicate = VertWS();
                if (!inclass)
                    root = newCharProperty(predicate);
            }
            return -1;
        case 'w':
            if (create) {
                predicate = has(UNICODE_CHARACTER_CLASS) ?
                            CharPredicates.WORD() : CharPredicates.ASCII_WORD();
                if (!inclass)
                    root = newCharProperty(predicate);
            }
            return -1;
        case 'x':
            return x();
        case 'y':
            break;
        case 'z':
            if (inclass) break;
            if (create) root = new End();
            return -1;
        default:
            return ch;
        }
        throw error("Illegal/unsupported escape sequence");
    }
    private CharPredicate clazz(boolean consume) {
        CharPredicate prev = null;
        CharPredicate curr = null;
        BitClass bits = new BitClass();
        boolean isNeg = false;
        boolean hasBits = false;
        int ch = next();
        if (ch == '^' && temp[cursor-1] == '[') {
            ch = next();
            isNeg = true;
        }
        for (;;) {
            switch (ch) {
                case '[':
                    curr = clazz(true);
                    if (prev == null)
                        prev = curr;
                    else
                        prev = prev.union(curr);
                    ch = peek();
                    continue;
                case '&':
                    ch = next();
                    if (ch == '&') {
                        ch = next();
                        CharPredicate right = null;
                        while (ch != ']' && ch != '&') {
                            if (ch == '[') {
                                if (right == null)
                                    right = clazz(true);
                                else
                                    right = right.union(clazz(true));
                            } else {
                                unread();
                                if (right == null) {
                                    right = clazz(false);
                                } else {
                                    right = right.union(clazz(false));
                                }
                            }
                            ch = peek();
                        }
                        if (hasBits) {
                            if (prev == null) {
                                prev = curr = bits;
                            } else {
                                prev = prev.union(bits);
                            }
                            hasBits = false;
                        }
                        if (right != null)
                            curr = right;
                        if (prev == null) {
                            if (right == null)
                                throw error("Bad class syntax");
                            else
                                prev = right;
                        } else {
                            if (curr == null)
                                throw error("Bad intersection syntax");
                            prev = prev.and(curr);
                        }
                    } else {
                        unread();
                        break;
                    }
                    continue;
                case 0:
                    if (cursor >= patternLength)
                        throw error("Unclosed character class");
                    break;
                case ']':
                    if (prev != null || hasBits) {
                        if (consume)
                            next();
                        if (prev == null)
                            prev = bits;
                        else if (hasBits)
                            prev = prev.union(bits);
                        if (isNeg)
                            return prev.negate();
                        return prev;
                    }
                    break;
                default:
                    break;
            }
            curr = range(bits);
            if (curr == null) {
                hasBits = true;
            } else {
                if (prev == null)
                    prev = curr;
                else if (prev != curr)
                    prev = prev.union(curr);
            }
            ch = peek();
        }
    }
    private CharPredicate bitsOrSingle(BitClass bits, int ch) {
        if (ch < 256 &&
            !(has(CASE_INSENSITIVE) && has(UNICODE_CASE) &&
              (ch == 0xff || ch == 0xb5 ||
               ch == 0x49 || ch == 0x69 ||
               ch == 0x53 || ch == 0x73 ||
               ch == 0x4b || ch == 0x6b ||
               ch == 0xc5 || ch == 0xe5))) {
            bits.add(ch, flags0);
            return null;
        }
        return single(ch);
    }
    private CharPredicate single(final int ch) {
        if (has(CASE_INSENSITIVE)) {
            int lower, upper;
            if (has(UNICODE_CASE)) {
                upper = Character.toUpperCase(ch);
                lower = Character.toLowerCase(upper);
                if (upper != lower)
                    return SingleU(lower);
            } else if (ASCII.isAscii(ch)) {
                lower = ASCII.toLower(ch);
                upper = ASCII.toUpper(ch);
                if (lower != upper)
                    return SingleI(lower, upper);
            }
        }
        if (isSupplementary(ch))
            return SingleS(ch);
        return Single(ch);
    }
    private CharPredicate range(BitClass bits) {
        int ch = peek();
        if (ch == '\\') {
            ch = nextEscaped();
            if (ch == 'p' || ch == 'P') {
                boolean comp = (ch == 'P');
                boolean oneLetter = true;
                ch = next();
                if (ch != '{')
                    unread();
                else
                    oneLetter = false;
                return family(oneLetter, comp);
            } else {
                boolean isrange = temp[cursor+1] == '-';
                unread();
                ch = escape(true, true, isrange);
                if (ch == -1)
                    return predicate;
            }
        } else {
            next();
        }
        if (ch >= 0) {
            if (peek() == '-') {
                int endRange = temp[cursor+1];
                if (endRange == '[') {
                    return bitsOrSingle(bits, ch);
                }
                if (endRange != ']') {
                    next();
                    int m = peek();
                    if (m == '\\') {
                        m = escape(true, false, true);
                    } else {
                        next();
                    }
                    if (m < ch) {
                        throw error("Illegal character range");
                    }
                    if (has(CASE_INSENSITIVE)) {
                        if (has(UNICODE_CASE))
                            return CIRangeU(ch, m);
                        return CIRange(ch, m);
                    } else {
                        return Range(ch, m);
                    }
                }
            }
            return bitsOrSingle(bits, ch);
        }
        throw error("Unexpected character '"+((char)ch)+"'");
    }
    private CharPredicate family(boolean singleLetter, boolean isComplement) {
        next();
        String name;
        CharPredicate p = null;
        if (singleLetter) {
            int c = temp[cursor];
            if (!Character.isSupplementaryCodePoint(c)) {
                name = String.valueOf((char)c);
            } else {
                name = new String(temp, cursor, 1);
            }
            read();
        } else {
            int i = cursor;
            mark('}');
            while(read() != '}') {
            }
            mark('\000');
            int j = cursor;
            if (j > patternLength)
                throw error("Unclosed character family");
            if (i + 1 >= j)
                throw error("Empty character family");
            name = new String(temp, i, j-i-1);
        }
        int i = name.indexOf('=');
        if (i != -1) {
            String value = name.substring(i + 1);
            name = name.substring(0, i).toLowerCase(Locale.ENGLISH);
            switch (name) {
                case "sc":
                case "script":
                    p = CharPredicates.forUnicodeScript(value);
                    break;
                case "blk":
                case "block":
                    p = CharPredicates.forUnicodeBlock(value);
                    break;
                case "gc":
                case "general_category":
                    p = CharPredicates.forProperty(value, has(CASE_INSENSITIVE));
                    break;
                default:
                    break;
            }
            if (p == null)
                throw error("Unknown Unicode property {name=<" + name + ">, "
                             + "value=<" + value + ">}");
        } else {
            if (name.startsWith("In")) {
                p = CharPredicates.forUnicodeBlock(name.substring(2));
            } else if (name.startsWith("Is")) {
                String shortName = name.substring(2);
                p = CharPredicates.forUnicodeProperty(shortName, has(CASE_INSENSITIVE));
                if (p == null)
                    p = CharPredicates.forProperty(shortName, has(CASE_INSENSITIVE));
                if (p == null)
                    p = CharPredicates.forUnicodeScript(shortName);
            } else {
                if (has(UNICODE_CHARACTER_CLASS))
                    p = CharPredicates.forPOSIXName(name, has(CASE_INSENSITIVE));
                if (p == null)
                    p = CharPredicates.forProperty(name, has(CASE_INSENSITIVE));
            }
            if (p == null)
                throw error("Unknown character property name {" + name + "}");
        }
        if (isComplement) {
            hasSupplementary = true;
            p = p.negate();
        }
        return p;
    }
    private CharProperty newCharProperty(CharPredicate p) {
        if (p == null)
            return null;
        if (p instanceof BmpCharPredicate)
            return new BmpCharProperty((BmpCharPredicate)p);
        else {
            hasSupplementary = true;
            return new CharProperty(p);
        }
    }
    private String groupname(int ch) {
        StringBuilder sb = new StringBuilder();
        if (!ASCII.isAlpha(ch))
            throw error("capturing group name does not start with a Latin letter");
        do {
            sb.append((char) ch);
        } while (ASCII.isAlnum(ch=read()));
        if (ch != '>')
            throw error("named capturing group is missing trailing '>'");
        return sb.toString();
    }
    private Node group0() {
        boolean capturingGroup = false;
        Node head;
        Node tail;
        int save = flags0;
        int saveTCNCount = topClosureNodes.size();
        root = null;
        int ch = next();
        if (ch == '?') {
            ch = skip();
            switch (ch) {
                case ':' -> {
                    head = createGroup(true);
                    tail = root;
                    head.next = expr(tail);
                }
                case '=', '!' -> {
                    head = createGroup(true);
                    tail = root;
                    head.next = expr(tail);
                    if (ch == '=') {
                        head = tail = new Pos(head);
                    } else {
                        head = tail = new Neg(head);
                    }
                }
                case '>' -> {
                    head = createGroup(true);
                    tail = root;
                    head.next = expr(tail);
                    head = tail = new Ques(head, Qtype.INDEPENDENT);
                }
                case '<' -> {
                    ch = read();
                    if (ch != '=' && ch != '!') {
                        String name = groupname(ch);
                        if (namedGroupsMap().containsKey(name))
                            throw error("Named capturing group <" + name
                                        + "> is already defined");
                        capturingGroup = true;
                        head = createGroup(false);
                        tail = root;
                        namedGroupsMap().put(name, capturingGroupCount - 1);
                        head.next = expr(tail);
                        break;
                    }
                    int start = cursor;
                    head = createGroup(true);
                    tail = root;
                    head.next = expr(tail);
                    tail.next = LookBehindEndNode.INSTANCE;
                    TreeInfo info = new TreeInfo();
                    head.study(info);
                    if (info.maxValid == false) {
                        throw error("Look-behind group does not have "
                                    + "an obvious maximum length");
                    }
                    boolean hasSupplementary = findSupplementary(start, patternLength);
                    if (ch == '=') {
                        head = tail = (hasSupplementary ?
                            new BehindS(head, info.maxLength,
                                info.minLength) :
                            new Behind(head, info.maxLength,
                                info.minLength));
                    } else {
                        head = tail = (hasSupplementary ?
                            new NotBehindS(head, info.maxLength,
                                info.minLength) :
                            new NotBehind(head, info.maxLength,
                                info.minLength));
                    }
                    if (saveTCNCount < topClosureNodes.size())
                        topClosureNodes.subList(saveTCNCount, topClosureNodes.size()).clear();
                }
                case '$', '@' -> throw error("Unknown group type");
                default -> {
                    unread();
                    addFlag();
                    ch = read();
                    if (ch == ')') {
                        return null;
                    }
                    if (ch != ':') {
                        throw error("Unknown inline modifier");
                    }
                    head = createGroup(true);
                    tail = root;
                    head.next = expr(tail);
                }
            }
        } else {
            capturingGroup = true;
            head = createGroup(false);
            tail = root;
            head.next = expr(tail);
        }
        accept(')', "Unclosed group");
        flags0 = save;
        Node node = closure(head);
        if (node == head) {
            root = tail;
            return node;
        }
        if (head == tail) {
            root = node;
            return node;
        }
        if (saveTCNCount < topClosureNodes.size())
            topClosureNodes.subList(saveTCNCount, topClosureNodes.size()).clear();
        if (node instanceof Ques ques) {
            if (ques.type == Qtype.POSSESSIVE) {
                root = node;
                return node;
            }
            tail.next = new BranchConn();
            tail = tail.next;
            if (ques.type == Qtype.GREEDY) {
                head = new Branch(head, null, tail);
            } else {
                head = new Branch(null, head, tail);
            }
            root = tail;
            return head;
        } else if (node instanceof Curly curly) {
            if (curly.type == Qtype.POSSESSIVE) {
                root = node;
                return node;
            }
            TreeInfo info = new TreeInfo();
            if (head.study(info)) {
                GroupTail temp = (GroupTail) tail;
                head = root = new GroupCurly(head.next, curly.cmin,
                                   curly.cmax, curly.type,
                                   ((GroupTail)tail).localIndex,
                                   ((GroupTail)tail).groupIndex,
                                             capturingGroup);
                return head;
            } else {
                int temp = ((GroupHead) head).localIndex;
                Loop loop;
                if (curly.type == Qtype.GREEDY) {
                    loop = new Loop(this.localCount, temp);
                    if (curly.cmax == MAX_REPS)
                        topClosureNodes.add(loop);
                } else {
                    loop = new LazyLoop(this.localCount, temp);
                }
                Prolog prolog = new Prolog(loop);
                this.localCount += 1;
                loop.cmin = curly.cmin;
                loop.cmax = curly.cmax;
                loop.body = head;
                tail.next = loop;
                root = loop;
                return prolog;
            }
        }
        throw error("Internal logic error");
    }
    private Node createGroup(boolean anonymous) {
        int localIndex = localCount++;
        int groupIndex = 0;
        if (!anonymous)
            groupIndex = capturingGroupCount++;
        GroupHead head = new GroupHead(localIndex);
        root = new GroupTail(localIndex, groupIndex);
        head.tail = (GroupTail)root;
        if (!anonymous && groupIndex < 10)
            groupNodes[groupIndex] = head;
        return head;
    }
    @SuppressWarnings("fallthrough")
    private void addFlag() {
        int ch = peek();
        for (;;) {
            switch (ch) {
            case 'i':
                flags0 |= CASE_INSENSITIVE;
                break;
            case 'm':
                flags0 |= MULTILINE;
                break;
            case 's':
                flags0 |= DOTALL;
                break;
            case 'd':
                flags0 |= UNIX_LINES;
                break;
            case 'u':
                flags0 |= UNICODE_CASE;
                break;
            case 'c':
                flags0 |= CANON_EQ;
                break;
            case 'x':
                flags0 |= COMMENTS;
                break;
            case 'U':
                flags0 |= (UNICODE_CHARACTER_CLASS | UNICODE_CASE);
                break;
            case '-':
                ch = next();
                subFlag();
            default:
                return;
            }
            ch = next();
        }
    }
    @SuppressWarnings("fallthrough")
    private void subFlag() {
        int ch = peek();
        for (;;) {
            switch (ch) {
            case 'i':
                flags0 &= ~CASE_INSENSITIVE;
                break;
            case 'm':
                flags0 &= ~MULTILINE;
                break;
            case 's':
                flags0 &= ~DOTALL;
                break;
            case 'd':
                flags0 &= ~UNIX_LINES;
                break;
            case 'u':
                flags0 &= ~UNICODE_CASE;
                break;
            case 'c':
                flags0 &= ~CANON_EQ;
                break;
            case 'x':
                flags0 &= ~COMMENTS;
                break;
            case 'U':
                flags0 &= ~(UNICODE_CHARACTER_CLASS | UNICODE_CASE);
                break;
            default:
                return;
            }
            ch = next();
        }
    }
    static final int MAX_REPS   = 0x7FFFFFFF;
    static enum Qtype {
        GREEDY, LAZY, POSSESSIVE, INDEPENDENT
    }
    private Qtype qtype() {
        int ch = next();
        if (ch == '?') {
            next();
            return Qtype.LAZY;
        } else if (ch == '+') {
            next();
            return Qtype.POSSESSIVE;
        }
        return Qtype.GREEDY;
    }
    private Node curly(Node prev, int cmin) {
        Qtype qtype = qtype();
        if (qtype == Qtype.GREEDY) {
            if (prev instanceof BmpCharProperty) {
                return new BmpCharPropertyGreedy((BmpCharProperty)prev, cmin);
            } else if (prev instanceof CharProperty) {
                return new CharPropertyGreedy((CharProperty)prev, cmin);
            }
        }
        return new Curly(prev, cmin, MAX_REPS, qtype);
    }
    private Node closure(Node prev) {
        int ch = peek();
        switch (ch) {
        case '?':
            return new Ques(prev, qtype());
        case '*':
            return curly(prev, 0);
        case '+':
            return curly(prev, 1);
        case '{':
            ch = skip();
            if (ASCII.isDigit(ch)) {
                int cmin = 0, cmax;
                try {
                    do {
                        cmin = Math.addExact(Math.multiplyExact(cmin, 10),
                                             ch - '0');
                    } while (ASCII.isDigit(ch = read()));
                    if (ch == ',') {
                        ch = read();
                        if (ch == '}') {
                            unread();
                            return curly(prev, cmin);
                        } else {
                            cmax = 0;
                            while (ASCII.isDigit(ch)) {
                                cmax = Math.addExact(Math.multiplyExact(cmax, 10),
                                                     ch - '0');
                                ch = read();
                            }
                        }
                    } else {
                        cmax = cmin;
                    }
                } catch (ArithmeticException ae) {
                    throw error("Illegal repetition range");
                }
                if (ch != '}')
                    throw error("Unclosed counted closure");
                if (cmax < cmin)
                    throw error("Illegal repetition range");
                unread();
                return (cmin == 0 && cmax == 1)
                        ? new Ques(prev, qtype())
                        : new Curly(prev, cmin, cmax, qtype());
            } else {
                throw error("Illegal repetition");
            }
        default:
            return prev;
        }
    }
    private int c() {
        if (cursor < patternLength) {
            return read() ^ 64;
        }
        throw error("Illegal control escape sequence");
    }
    private int o() {
        int n = read();
        if (((n-'0')|('7'-n)) >= 0) {
            int m = read();
            if (((m-'0')|('7'-m)) >= 0) {
                int o = read();
                if ((((o-'0')|('7'-o)) >= 0) && (((n-'0')|('3'-n)) >= 0)) {
                    return (n - '0') * 64 + (m - '0') * 8 + (o - '0');
                }
                unread();
                return (n - '0') * 8 + (m - '0');
            }
            unread();
            return (n - '0');
        }
        throw error("Illegal octal escape sequence");
    }
    private int x() {
        int n = read();
        if (ASCII.isHexDigit(n)) {
            int m = read();
            if (ASCII.isHexDigit(m)) {
                return ASCII.toDigit(n) * 16 + ASCII.toDigit(m);
            }
        } else if (n == '{' && ASCII.isHexDigit(peek())) {
            int ch = 0;
            while (ASCII.isHexDigit(n = read())) {
                ch = (ch << 4) + ASCII.toDigit(n);
                if (ch > Character.MAX_CODE_POINT)
                    throw error("Hexadecimal codepoint is too big");
            }
            if (n != '}')
                throw error("Unclosed hexadecimal escape sequence");
            return ch;
        }
        throw error("Illegal hexadecimal escape sequence");
    }
    private int cursor() {
        return cursor;
    }
    private void setcursor(int pos) {
        cursor = pos;
    }
    private int uxxxx() {
        int n = 0;
        for (int i = 0; i < 4; i++) {
            int ch = read();
            if (!ASCII.isHexDigit(ch)) {
                throw error("Illegal Unicode escape sequence");
            }
            n = n * 16 + ASCII.toDigit(ch);
        }
        return n;
    }
    private int u() {
        int n = uxxxx();
        if (Character.isHighSurrogate((char)n)) {
            int cur = cursor();
            if (read() == '\\' && read() == 'u') {
                int n2 = uxxxx();
                if (Character.isLowSurrogate((char)n2))
                    return Character.toCodePoint((char)n, (char)n2);
            }
            setcursor(cur);
        }
        return n;
    }
    private int N() {
        if (read() == '{') {
            int i = cursor;
            while (read() != '}') {
                if (cursor >= patternLength)
                    throw error("Unclosed character name escape sequence");
            }
            String name = new String(temp, i, cursor - i - 1);
            try {
                throw new IllegalArgumentException();
            } catch (IllegalArgumentException x) {
                throw error("SL_NO_DISPONIBLE \\N{" + name + "}");
            }
        }
        throw error("Illegal character name escape sequence");
    }
    private static final int countChars(CharSequence seq, int index,
                                        int lengthInCodePoints) {
        if (lengthInCodePoints == 1 && index >= 0 && index < seq.length() &&
            !Character.isHighSurrogate(seq.charAt(index))) {
            return 1;
        }
        int length = seq.length();
        int x = index;
        if (lengthInCodePoints >= 0) {
            assert ((length == 0 && index == 0) || index >= 0 && index < length);
            for (int i = 0; x < length && i < lengthInCodePoints; i++) {
                if (Character.isHighSurrogate(seq.charAt(x++))) {
                    if (x < length && Character.isLowSurrogate(seq.charAt(x))) {
                        x++;
                    }
                }
            }
            return x - index;
        }
        assert (index >= 0 && index <= length);
        if (index == 0) {
            return 0;
        }
        int len = -lengthInCodePoints;
        for (int i = 0; x > 0 && i < len; i++) {
            if (Character.isLowSurrogate(seq.charAt(--x))) {
                if (x > 0 && Character.isHighSurrogate(seq.charAt(x-1))) {
                    x--;
                }
            }
        }
        return index - x;
    }
    private static final int countCodePoints(CharSequence seq) {
        int length = seq.length();
        int n = 0;
        for (int i = 0; i < length; ) {
            n++;
            if (Character.isHighSurrogate(seq.charAt(i++))) {
                if (i < length && Character.isLowSurrogate(seq.charAt(i))) {
                    i++;
                }
            }
        }
        return n;
    }
    static final class BitClass implements BmpCharPredicate {
        final boolean[] bits;
        BitClass() {
            bits = new boolean[256];
        }
        BitClass add(int c, int flags) {
            assert c >= 0 && c <= 255;
            if ((flags & CASE_INSENSITIVE) != 0) {
                if (ASCII.isAscii(c)) {
                    bits[ASCII.toUpper(c)] = true;
                    bits[ASCII.toLower(c)] = true;
                } else if ((flags & UNICODE_CASE) != 0) {
                    bits[Character.toLowerCase(c)] = true;
                    bits[Character.toUpperCase(c)] = true;
                }
            }
            bits[c] = true;
            return this;
        }
        public boolean is(int ch) {
            return ch < 256 && bits[ch];
        }
    }
    private Node newSlice(int[] buf, int count, boolean hasSupplementary) {
        int[] tmp = new int[count];
        if (has(CASE_INSENSITIVE)) {
            if (has(UNICODE_CASE)) {
                for (int i = 0; i < count; i++) {
                    tmp[i] = Character.toLowerCase(
                                 Character.toUpperCase(buf[i]));
                }
                return hasSupplementary? new SliceUS(tmp) : new SliceU(tmp);
            }
            for (int i = 0; i < count; i++) {
                tmp[i] = ASCII.toLower(buf[i]);
            }
            return hasSupplementary? new SliceIS(tmp) : new SliceI(tmp);
        }
        for (int i = 0; i < count; i++) {
            tmp[i] = buf[i];
        }
        return hasSupplementary ? new SliceS(tmp) : new Slice(tmp);
    }
    static class Node extends Object {
        Node next;
        Node() {
            next = Pattern.accept;
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            matcher.last = i;
            matcher.groups[0] = matcher.first;
            matcher.groups[1] = matcher.last;
            return true;
        }
        boolean study(TreeInfo info) {
            if (next != null) {
                return next.study(info);
            } else {
                return info.deterministic;
            }
        }
    }
    static class LastNode extends Node {
        boolean match(Matcher matcher, int i, CharSequence seq) {
            if (matcher.acceptMode == Matcher.ENDANCHOR && i != matcher.to)
                return false;
            matcher.last = i;
            matcher.groups[0] = matcher.first;
            matcher.groups[1] = matcher.last;
            return true;
        }
    }
    static class Start extends Node {
        int minLength;
        Start(Node node) {
            this.next = node;
            TreeInfo info = new TreeInfo();
            next.study(info);
            minLength = info.minLength;
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            if (i > matcher.to - minLength) {
                matcher.hitEnd = true;
                return false;
            }
            int guard = matcher.to - minLength;
            for (; i <= guard; i++) {
                if (next.match(matcher, i, seq)) {
                    matcher.first = i;
                    matcher.groups[0] = matcher.first;
                    matcher.groups[1] = matcher.last;
                    return true;
                }
            }
            matcher.hitEnd = true;
            return false;
        }
        boolean study(TreeInfo info) {
            next.study(info);
            info.maxValid = false;
            info.deterministic = false;
            return false;
        }
    }
    static final class StartS extends Start {
        StartS(Node node) {
            super(node);
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            if (i > matcher.to - minLength) {
                matcher.hitEnd = true;
                return false;
            }
            int guard = matcher.to - minLength;
            while (i <= guard) {
                if (next.match(matcher, i, seq)) {
                    matcher.first = i;
                    matcher.groups[0] = matcher.first;
                    matcher.groups[1] = matcher.last;
                    return true;
                }
                if (i == guard)
                    break;
                if (Character.isHighSurrogate(seq.charAt(i++))) {
                    if (i < seq.length() &&
                        Character.isLowSurrogate(seq.charAt(i))) {
                        i++;
                    }
                }
            }
            matcher.hitEnd = true;
            return false;
        }
    }
    static final class Begin extends Node {
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int fromIndex = (matcher.anchoringBounds) ?
                matcher.from : 0;
            if (i == fromIndex && next.match(matcher, i, seq)) {
                matcher.first = i;
                matcher.groups[0] = i;
                matcher.groups[1] = matcher.last;
                return true;
            } else {
                return false;
            }
        }
    }
    static final class End extends Node {
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int endIndex = (matcher.anchoringBounds) ?
                matcher.to : matcher.getTextLength();
            if (i == endIndex) {
                matcher.hitEnd = true;
                return next.match(matcher, i, seq);
            }
            return false;
        }
    }
    static final class Caret extends Node {
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int startIndex = matcher.from;
            int endIndex = matcher.to;
            if (!matcher.anchoringBounds) {
                startIndex = 0;
                endIndex = matcher.getTextLength();
            }
            if (i == endIndex) {
                matcher.hitEnd = true;
                return false;
            }
            if (i > startIndex) {
                char ch = seq.charAt(i-1);
                if (ch != '\n' && ch != '\r'
                    && (ch|1) != '\u2029'
                    && ch != '\u0085' ) {
                    return false;
                }
                if (ch == '\r' && seq.charAt(i) == '\n')
                    return false;
            }
            return next.match(matcher, i, seq);
        }
    }
    static final class UnixCaret extends Node {
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int startIndex = matcher.from;
            int endIndex = matcher.to;
            if (!matcher.anchoringBounds) {
                startIndex = 0;
                endIndex = matcher.getTextLength();
            }
            if (i == endIndex) {
                matcher.hitEnd = true;
                return false;
            }
            if (i > startIndex) {
                char ch = seq.charAt(i-1);
                if (ch != '\n') {
                    return false;
                }
            }
            return next.match(matcher, i, seq);
        }
    }
    static final class LastMatch extends Node {
        boolean match(Matcher matcher, int i, CharSequence seq) {
            if (i != matcher.oldLast)
                return false;
            return next.match(matcher, i, seq);
        }
    }
    static final class Dollar extends Node {
        boolean multiline;
        Dollar(boolean mul) {
            multiline = mul;
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int endIndex = (matcher.anchoringBounds) ?
                matcher.to : matcher.getTextLength();
            if (!multiline) {
                if (i < endIndex - 2)
                    return false;
                if (i == endIndex - 2) {
                    char ch = seq.charAt(i);
                    if (ch != '\r')
                        return false;
                    ch = seq.charAt(i + 1);
                    if (ch != '\n')
                        return false;
                }
            }
            if (i < endIndex) {
                char ch = seq.charAt(i);
                 if (ch == '\n') {
                     if (i > 0 && seq.charAt(i-1) == '\r')
                         return false;
                     if (multiline)
                         return next.match(matcher, i, seq);
                 } else if (ch == '\r' || ch == '\u0085' ||
                            (ch|1) == '\u2029') {
                     if (multiline)
                         return next.match(matcher, i, seq);
                 } else {
                     return false;
                 }
            }
            matcher.hitEnd = true;
            matcher.requireEnd = true;
            return next.match(matcher, i, seq);
        }
        boolean study(TreeInfo info) {
            next.study(info);
            return info.deterministic;
        }
    }
    static final class UnixDollar extends Node {
        boolean multiline;
        UnixDollar(boolean mul) {
            multiline = mul;
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int endIndex = (matcher.anchoringBounds) ?
                matcher.to : matcher.getTextLength();
            if (i < endIndex) {
                char ch = seq.charAt(i);
                if (ch == '\n') {
                    if (multiline == false && i != endIndex - 1)
                        return false;
                    if (multiline)
                        return next.match(matcher, i, seq);
                } else {
                    return false;
                }
            }
            matcher.hitEnd = true;
            matcher.requireEnd = true;
            return next.match(matcher, i, seq);
        }
        boolean study(TreeInfo info) {
            next.study(info);
            return info.deterministic;
        }
    }
    static final class LineEnding extends Node {
        boolean match(Matcher matcher, int i, CharSequence seq) {
            if (i < matcher.to) {
                int ch = seq.charAt(i);
                if (ch == 0x0A || ch == 0x0B || ch == 0x0C ||
                    ch == 0x85 || ch == 0x2028 || ch == 0x2029)
                    return next.match(matcher, i + 1, seq);
                if (ch == 0x0D) {
                    i++;
                    if (i < matcher.to) {
                        if (seq.charAt(i) == 0x0A &&
                            next.match(matcher, i + 1, seq)) {
                            return true;
                        }
                    } else {
                        matcher.hitEnd = true;
                    }
                    return next.match(matcher, i, seq);
                }
            } else {
                matcher.hitEnd = true;
            }
            return false;
        }
        boolean study(TreeInfo info) {
            info.minLength++;
            info.maxLength += 2;
            return next.study(info);
        }
    }
    static class CharProperty extends Node {
        final CharPredicate predicate;
        CharProperty (CharPredicate predicate) {
            this.predicate = predicate;
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            if (i < matcher.to) {
                int ch = Character.codePointAt(seq, i);
                i += Character.charCount(ch);
                if (i <= matcher.to) {
                    return predicate.is(ch) &&
                           next.match(matcher, i, seq);
                }
            }
            matcher.hitEnd = true;
            return false;
        }
        boolean study(TreeInfo info) {
            info.minLength++;
            info.maxLength++;
            return next.study(info);
        }
    }
    private static class BmpCharProperty extends CharProperty {
        BmpCharProperty (BmpCharPredicate predicate) {
            super(predicate);
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            if (i < matcher.to) {
                return predicate.is(seq.charAt(i)) &&
                       next.match(matcher, i + 1, seq);
            } else {
                matcher.hitEnd = true;
                return false;
            }
        }
    }
    private static class NFCCharProperty extends Node {
        CharPredicate predicate;
        NFCCharProperty (CharPredicate predicate) {
            this.predicate = predicate;
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            if (i < matcher.to) {
                int ch0 = Character.codePointAt(seq, i);
                int n = Character.charCount(ch0);
                int j = Grapheme.nextBoundary(seq, i, matcher.to);
                if (i + n == j) {
                    if (predicate.is(ch0))
                        return next.match(matcher, j, seq);
                } else {
                    while (i + n < j) {
                        String nfc = SlNorm.normalize(
                            seq.toString().substring(i, j), null);
                        if (nfc.codePointCount(0, nfc.length()) == 1) {
                            if (predicate.is(nfc.codePointAt(0)) &&
                                next.match(matcher, j, seq)) {
                                return true;
                            }
                        }
                        ch0 = Character.codePointBefore(seq, j);
                        j -= Character.charCount(ch0);
                    }
                }
                if (j < matcher.to)
                    return false;
            } else {
                matcher.hitEnd = true;
            }
            return false;
        }
        boolean study(TreeInfo info) {
            info.minLength++;
            info.deterministic = false;
            return next.study(info);
        }
    }
    static class XGrapheme extends Node {
        boolean match(Matcher matcher, int i, CharSequence seq) {
            if (i < matcher.to) {
                i = Grapheme.nextBoundary(seq, i, matcher.to);
                return next.match(matcher, i, seq);
            }
            matcher.hitEnd = true;
            return false;
        }
        boolean study(TreeInfo info) {
            info.minLength++;
            info.deterministic = false;
            return next.study(info);
        }
    }
    static class GraphemeBound extends Node {
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int startIndex = matcher.from;
            int endIndex = matcher.to;
            if (matcher.transparentBounds) {
                startIndex = 0;
                endIndex = matcher.getTextLength();
            }
            if (i == startIndex) {
            } else if (i < endIndex) {
                if (Character.isSurrogatePair(seq.charAt(i - 1), seq.charAt(i))) {
                    return false;
                }
                if (Grapheme.nextBoundary(seq, matcher.last, endIndex) > i) {
                    return false;
                }
            } else {
                matcher.hitEnd = true;
                matcher.requireEnd = true;
            }
            return next.match(matcher, i, seq);
        }
    }
    static class SliceNode extends Node {
        int[] buffer;
        SliceNode(int[] buf) {
            buffer = buf;
        }
        boolean study(TreeInfo info) {
            info.minLength += buffer.length;
            info.maxLength += buffer.length;
            return next.study(info);
        }
    }
    static class Slice extends SliceNode {
        Slice(int[] buf) {
            super(buf);
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int[] buf = buffer;
            int len = buf.length;
            for (int j=0; j<len; j++) {
                if ((i+j) >= matcher.to) {
                    matcher.hitEnd = true;
                    return false;
                }
                if (buf[j] != seq.charAt(i+j))
                    return false;
            }
            return next.match(matcher, i+len, seq);
        }
    }
    static class SliceI extends SliceNode {
        SliceI(int[] buf) {
            super(buf);
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int[] buf = buffer;
            int len = buf.length;
            for (int j=0; j<len; j++) {
                if ((i+j) >= matcher.to) {
                    matcher.hitEnd = true;
                    return false;
                }
                int c = seq.charAt(i+j);
                if (buf[j] != c &&
                    buf[j] != ASCII.toLower(c))
                    return false;
            }
            return next.match(matcher, i+len, seq);
        }
    }
    static final class SliceU extends SliceNode {
        SliceU(int[] buf) {
            super(buf);
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int[] buf = buffer;
            int len = buf.length;
            for (int j=0; j<len; j++) {
                if ((i+j) >= matcher.to) {
                    matcher.hitEnd = true;
                    return false;
                }
                int c = seq.charAt(i+j);
                if (buf[j] != c &&
                    buf[j] != Character.toLowerCase(Character.toUpperCase(c)))
                    return false;
            }
            return next.match(matcher, i+len, seq);
        }
    }
    static final class SliceS extends Slice {
        SliceS(int[] buf) {
            super(buf);
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int[] buf = buffer;
            int x = i;
            for (int j = 0; j < buf.length; j++) {
                if (x >= matcher.to) {
                    matcher.hitEnd = true;
                    return false;
                }
                int c = Character.codePointAt(seq, x);
                if (buf[j] != c)
                    return false;
                x += Character.charCount(c);
                if (x > matcher.to) {
                    matcher.hitEnd = true;
                    return false;
                }
            }
            return next.match(matcher, x, seq);
        }
    }
    static class SliceIS extends SliceNode {
        SliceIS(int[] buf) {
            super(buf);
        }
        int toLower(int c) {
            return ASCII.toLower(c);
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int[] buf = buffer;
            int x = i;
            for (int j = 0; j < buf.length; j++) {
                if (x >= matcher.to) {
                    matcher.hitEnd = true;
                    return false;
                }
                int c = Character.codePointAt(seq, x);
                if (buf[j] != c && buf[j] != toLower(c))
                    return false;
                x += Character.charCount(c);
                if (x > matcher.to) {
                    matcher.hitEnd = true;
                    return false;
                }
            }
            return next.match(matcher, x, seq);
        }
    }
    static final class SliceUS extends SliceIS {
        SliceUS(int[] buf) {
            super(buf);
        }
        int toLower(int c) {
            return Character.toLowerCase(Character.toUpperCase(c));
        }
    }
    static final class Ques extends Node {
        Node atom;
        Qtype type;
        Ques(Node node, Qtype type) {
            this.atom = node;
            this.type = type;
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            switch (type) {
            case GREEDY:
                return (atom.match(matcher, i, seq) && next.match(matcher, matcher.last, seq))
                    || next.match(matcher, i, seq);
            case LAZY:
                return next.match(matcher, i, seq)
                    || (atom.match(matcher, i, seq) && next.match(matcher, matcher.last, seq));
            case POSSESSIVE:
                if (atom.match(matcher, i, seq)) i = matcher.last;
                return next.match(matcher, i, seq);
            default:
                return atom.match(matcher, i, seq) && next.match(matcher, matcher.last, seq);
            }
        }
        boolean study(TreeInfo info) {
            if (type != Qtype.INDEPENDENT) {
                int minL = info.minLength;
                atom.study(info);
                info.minLength = minL;
                info.deterministic = false;
                return next.study(info);
            } else {
                atom.study(info);
                return next.study(info);
            }
        }
    }
    static class CharPropertyGreedy extends Node {
        final CharPredicate predicate;
        final int cmin;
        CharPropertyGreedy(CharProperty cp, int cmin) {
            this.predicate = cp.predicate;
            this.cmin = cmin;
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int starti = i;
            int n = 0;
            int to = matcher.to;
            while (i < to) {
                int ch = Character.codePointAt(seq, i);
                int len = Character.charCount(ch);
                if (i + len > to) {
                    matcher.hitEnd = true;
                    ch = seq.charAt(i);
                    len = 1;
                }
                if (!predicate.is(ch))
                    break;
                i += len;
                n++;
            }
            if (i >= to) {
                matcher.hitEnd = true;
            }
            while (n >= cmin) {
                if (next.match(matcher, i, seq))
                    return true;
                if (n == cmin)
                    return false;
                int ch = Character.codePointBefore(seq, i);
                i = Math.max(starti, i - Character.charCount(ch));
                n--;
            }
            return false;
        }
        boolean study(TreeInfo info) {
            info.minLength += cmin;
            if (info.maxValid) {
                info.maxLength += MAX_REPS;
            }
            info.deterministic = false;
            return next.study(info);
        }
    }
    static final class BmpCharPropertyGreedy extends CharPropertyGreedy {
        BmpCharPropertyGreedy(BmpCharProperty bcp, int cmin) {
            super(bcp, cmin);
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int n = 0;
            int to = matcher.to;
            while (i < to && predicate.is(seq.charAt(i))) {
                i++; n++;
            }
            if (i >= to) {
                matcher.hitEnd = true;
            }
            while (n >= cmin) {
                if (next.match(matcher, i, seq))
                    return true;
                i--; n--;
            }
            return false;
        }
    }
    static final class Curly extends Node {
        Node atom;
        Qtype type;
        int cmin;
        int cmax;
        Curly(Node node, int cmin, int cmax, Qtype type) {
            this.atom = node;
            this.type = type;
            this.cmin = cmin;
            this.cmax = cmax;
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int j;
            for (j = 0; j < cmin; j++) {
                if (atom.match(matcher, i, seq)) {
                    i = matcher.last;
                    continue;
                }
                return false;
            }
            if (type == Qtype.GREEDY)
                return match0(matcher, i, j, seq);
            else if (type == Qtype.LAZY)
                return match1(matcher, i, j, seq);
            else
                return match2(matcher, i, j, seq);
        }
        boolean match0(Matcher matcher, int i, int j, CharSequence seq) {
            if (j >= cmax) {
                return next.match(matcher, i, seq);
            }
            int backLimit = j;
            while (atom.match(matcher, i, seq)) {
                int k = matcher.last - i;
                if (k == 0)
                    break;
                i = matcher.last;
                j++;
                while (j < cmax) {
                    if (!atom.match(matcher, i, seq))
                        break;
                    if (i + k != matcher.last) {
                        if (match0(matcher, matcher.last, j+1, seq))
                            return true;
                        break;
                    }
                    i += k;
                    j++;
                }
                while (j >= backLimit) {
                   if (next.match(matcher, i, seq))
                        return true;
                    i -= k;
                    j--;
                }
                return false;
            }
            return next.match(matcher, i, seq);
        }
        boolean match1(Matcher matcher, int i, int j, CharSequence seq) {
            for (;;) {
                if (next.match(matcher, i, seq))
                    return true;
                if (j >= cmax)
                    return false;
                if (!atom.match(matcher, i, seq))
                    return false;
                if (i == matcher.last)
                    return false;
                i = matcher.last;
                j++;
            }
        }
        boolean match2(Matcher matcher, int i, int j, CharSequence seq) {
            for (; j < cmax; j++) {
                if (!atom.match(matcher, i, seq))
                    break;
                if (i == matcher.last)
                    break;
                i = matcher.last;
            }
            return next.match(matcher, i, seq);
        }
        boolean study(TreeInfo info) {
            int minL = info.minLength;
            int maxL = info.maxLength;
            boolean maxV = info.maxValid;
            boolean detm = info.deterministic;
            info.reset();
            atom.study(info);
            int temp = info.minLength * cmin + minL;
            if (temp < minL) {
                temp = 0xFFFFFFF;
            }
            info.minLength = temp;
            if (maxV & info.maxValid) {
                temp = info.maxLength * cmax + maxL;
                info.maxLength = temp;
                if (temp < maxL) {
                    info.maxValid = false;
                }
            } else {
                info.maxValid = false;
            }
            if (info.deterministic && cmin == cmax)
                info.deterministic = detm;
            else
                info.deterministic = false;
            return next.study(info);
        }
    }
    static final class GroupCurly extends Node {
        Node atom;
        Qtype type;
        int cmin;
        int cmax;
        int localIndex;
        int groupIndex;
        boolean capture;
        GroupCurly(Node node, int cmin, int cmax, Qtype type, int local,
                   int group, boolean capture) {
            this.atom = node;
            this.type = type;
            this.cmin = cmin;
            this.cmax = cmax;
            this.localIndex = local;
            this.groupIndex = group;
            this.capture = capture;
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int[] groups = matcher.groups;
            int[] locals = matcher.locals;
            int save0 = locals[localIndex];
            int save1 = 0;
            int save2 = 0;
            if (capture) {
                save1 = groups[groupIndex];
                save2 = groups[groupIndex+1];
            }
            locals[localIndex] = -1;
            boolean ret = true;
            for (int j = 0; j < cmin; j++) {
                if (atom.match(matcher, i, seq)) {
                    if (capture) {
                        groups[groupIndex] = i;
                        groups[groupIndex+1] = matcher.last;
                    }
                    i = matcher.last;
                } else {
                    ret = false;
                    break;
                }
            }
            if (ret) {
                if (type == Qtype.GREEDY) {
                    ret = match0(matcher, i, cmin, seq);
                } else if (type == Qtype.LAZY) {
                    ret = match1(matcher, i, cmin, seq);
                } else {
                    ret = match2(matcher, i, cmin, seq);
                }
            }
            if (!ret) {
                locals[localIndex] = save0;
                if (capture) {
                    groups[groupIndex] = save1;
                    groups[groupIndex+1] = save2;
                }
            }
            return ret;
        }
        boolean match0(Matcher matcher, int i, int j, CharSequence seq) {
            int min = j;
            int[] groups = matcher.groups;
            int save0 = 0;
            int save1 = 0;
            if (capture) {
                save0 = groups[groupIndex];
                save1 = groups[groupIndex+1];
            }
            for (;;) {
                if (j >= cmax)
                    break;
                if (!atom.match(matcher, i, seq))
                    break;
                int k = matcher.last - i;
                if (k <= 0) {
                    if (capture) {
                        groups[groupIndex] = i;
                        groups[groupIndex+1] = i + k;
                    }
                    i = i + k;
                    break;
                }
                for (;;) {
                    if (capture) {
                        groups[groupIndex] = i;
                        groups[groupIndex+1] = i + k;
                    }
                    i = i + k;
                    if (++j >= cmax)
                        break;
                    if (!atom.match(matcher, i, seq))
                        break;
                    if (i + k != matcher.last) {
                        if (match0(matcher, i, j, seq))
                            return true;
                        break;
                    }
                }
                while (j > min) {
                    if (next.match(matcher, i, seq)) {
                        if (capture) {
                            groups[groupIndex+1] = i;
                            groups[groupIndex] = i - k;
                        }
                        return true;
                    }
                    i = i - k;
                    if (capture) {
                        groups[groupIndex+1] = i;
                        groups[groupIndex] = i - k;
                    }
                    j--;
                }
                break;
            }
            if (capture) {
                groups[groupIndex] = save0;
                groups[groupIndex+1] = save1;
            }
            return next.match(matcher, i, seq);
        }
        boolean match1(Matcher matcher, int i, int j, CharSequence seq) {
            for (;;) {
                if (next.match(matcher, i, seq))
                    return true;
                if (j >= cmax)
                    return false;
                if (!atom.match(matcher, i, seq))
                    return false;
                if (i == matcher.last)
                    return false;
                if (capture) {
                    matcher.groups[groupIndex] = i;
                    matcher.groups[groupIndex+1] = matcher.last;
                }
                i = matcher.last;
                j++;
            }
        }
        boolean match2(Matcher matcher, int i, int j, CharSequence seq) {
            for (; j < cmax; j++) {
                if (!atom.match(matcher, i, seq)) {
                    break;
                }
                if (capture) {
                    matcher.groups[groupIndex] = i;
                    matcher.groups[groupIndex+1] = matcher.last;
                }
                if (i == matcher.last) {
                    break;
                }
                i = matcher.last;
            }
            return next.match(matcher, i, seq);
        }
        boolean study(TreeInfo info) {
            int minL = info.minLength;
            int maxL = info.maxLength;
            boolean maxV = info.maxValid;
            boolean detm = info.deterministic;
            info.reset();
            atom.study(info);
            int temp = info.minLength * cmin + minL;
            if (temp < minL) {
                temp = 0xFFFFFFF;
            }
            info.minLength = temp;
            if (maxV & info.maxValid) {
                temp = info.maxLength * cmax + maxL;
                info.maxLength = temp;
                if (temp < maxL) {
                    info.maxValid = false;
                }
            } else {
                info.maxValid = false;
            }
            if (info.deterministic && cmin == cmax) {
                info.deterministic = detm;
            } else {
                info.deterministic = false;
            }
            return next.study(info);
        }
    }
    static final class BranchConn extends Node {
        BranchConn() {}
        boolean match(Matcher matcher, int i, CharSequence seq) {
            return next.match(matcher, i, seq);
        }
        boolean study(TreeInfo info) {
            return info.deterministic;
        }
    }
    static final class Branch extends Node {
        Node[] atoms = new Node[2];
        int size = 2;
        Node conn;
        Branch(Node first, Node second, Node branchConn) {
            conn = branchConn;
            atoms[0] = first;
            atoms[1] = second;
        }
        void add(Node node) {
            if (size >= atoms.length) {
                Node[] tmp = new Node[atoms.length*2];
                System.arraycopy(atoms, 0, tmp, 0, atoms.length);
                atoms = tmp;
            }
            atoms[size++] = node;
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            for (int n = 0; n < size; n++) {
                if (atoms[n] == null) {
                    if (conn.next.match(matcher, i, seq))
                        return true;
                } else if (atoms[n].match(matcher, i, seq)) {
                    return true;
                }
            }
            return false;
        }
        boolean study(TreeInfo info) {
            int minL = info.minLength;
            int maxL = info.maxLength;
            boolean maxV = info.maxValid;
            int minL2 = Integer.MAX_VALUE;
            int maxL2 = -1;
            for (int n = 0; n < size; n++) {
                info.reset();
                if (atoms[n] != null)
                    atoms[n].study(info);
                minL2 = Math.min(minL2, info.minLength);
                maxL2 = Math.max(maxL2, info.maxLength);
                maxV = (maxV & info.maxValid);
            }
            minL += minL2;
            maxL += maxL2;
            info.reset();
            conn.next.study(info);
            info.minLength += minL;
            info.maxLength += maxL;
            info.maxValid &= maxV;
            info.deterministic = false;
            return false;
        }
    }
    static final class GroupHead extends Node {
        int localIndex;
        GroupTail tail;
        GroupHead(int localCount) {
            localIndex = localCount;
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int save = matcher.locals[localIndex];
            matcher.locals[localIndex] = i;
            boolean ret = next.match(matcher, i, seq);
            matcher.locals[localIndex] = save;
            return ret;
        }
    }
    static final class GroupTail extends Node {
        int localIndex;
        int groupIndex;
        GroupTail(int localCount, int groupCount) {
            localIndex = localCount;
            groupIndex = groupCount + groupCount;
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int tmp = matcher.locals[localIndex];
            if (tmp >= 0) {
                int groupStart = matcher.groups[groupIndex];
                int groupEnd = matcher.groups[groupIndex+1];
                matcher.groups[groupIndex] = tmp;
                matcher.groups[groupIndex+1] = i;
                if (next.match(matcher, i, seq)) {
                    return true;
                }
                matcher.groups[groupIndex] = groupStart;
                matcher.groups[groupIndex+1] = groupEnd;
                return false;
            } else {
                matcher.last = i;
                return true;
            }
        }
    }
    static final class Prolog extends Node {
        Loop loop;
        Prolog(Loop loop) {
            this.loop = loop;
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            return loop.matchInit(matcher, i, seq);
        }
        boolean study(TreeInfo info) {
            return loop.study(info);
        }
    }
    static class Loop extends Node {
        Node body;
        int countIndex;
        int beginIndex;
        int cmin, cmax;
        int posIndex;
        Loop(int countIndex, int beginIndex) {
            this.countIndex = countIndex;
            this.beginIndex = beginIndex;
            this.posIndex = -1;
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            if (i > matcher.locals[beginIndex]) {
                int count = matcher.locals[countIndex];
                if (count < cmin) {
                    matcher.locals[countIndex] = count + 1;
                    boolean b = body.match(matcher, i, seq);
                    if (!b)
                        matcher.locals[countIndex] = count;
                    return b;
                }
                if (count < cmax) {
                    if (posIndex != -1 &&
                        matcher.localsPos[posIndex].contains(i)) {
                        return next.match(matcher, i, seq);
                    }
                    matcher.locals[countIndex] = count + 1;
                    boolean b = body.match(matcher, i, seq);
                    if (b)
                        return true;
                    matcher.locals[countIndex] = count;
                    if (posIndex != -1) {
                        matcher.localsPos[posIndex].add(i);
                    }
                }
            }
            return next.match(matcher, i, seq);
        }
        boolean matchInit(Matcher matcher, int i, CharSequence seq) {
            int save = matcher.locals[countIndex];
            boolean ret;
            if (posIndex != -1 && matcher.localsPos[posIndex] == null) {
                matcher.localsPos[posIndex] = new IntHashSet();
            }
            if (0 < cmin) {
                matcher.locals[countIndex] = 1;
                ret = body.match(matcher, i, seq);
            } else if (0 < cmax) {
                matcher.locals[countIndex] = 1;
                ret = body.match(matcher, i, seq);
                if (ret == false)
                    ret = next.match(matcher, i, seq);
            } else {
                ret = next.match(matcher, i, seq);
            }
            matcher.locals[countIndex] = save;
            return ret;
        }
        boolean study(TreeInfo info) {
            info.maxValid = false;
            info.deterministic = false;
            return false;
        }
    }
    static final class LazyLoop extends Loop {
        LazyLoop(int countIndex, int beginIndex) {
            super(countIndex, beginIndex);
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            if (i > matcher.locals[beginIndex]) {
                int count = matcher.locals[countIndex];
                if (count < cmin) {
                    matcher.locals[countIndex] = count + 1;
                    boolean result = body.match(matcher, i, seq);
                    if (!result)
                        matcher.locals[countIndex] = count;
                    return result;
                }
                if (next.match(matcher, i, seq))
                    return true;
                if (count < cmax) {
                    matcher.locals[countIndex] = count + 1;
                    boolean result = body.match(matcher, i, seq);
                    if (!result)
                        matcher.locals[countIndex] = count;
                    return result;
                }
                return false;
            }
            return next.match(matcher, i, seq);
        }
        boolean matchInit(Matcher matcher, int i, CharSequence seq) {
            int save = matcher.locals[countIndex];
            boolean ret = false;
            if (0 < cmin) {
                matcher.locals[countIndex] = 1;
                ret = body.match(matcher, i, seq);
            } else if (next.match(matcher, i, seq)) {
                ret = true;
            } else if (0 < cmax) {
                matcher.locals[countIndex] = 1;
                ret = body.match(matcher, i, seq);
            }
            matcher.locals[countIndex] = save;
            return ret;
        }
        boolean study(TreeInfo info) {
            info.maxValid = false;
            info.deterministic = false;
            return false;
        }
    }
    static class BackRef extends Node {
        int groupIndex;
        BackRef(int groupCount) {
            super();
            groupIndex = groupCount + groupCount;
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int j = matcher.groups[groupIndex];
            int k = matcher.groups[groupIndex+1];
            int groupSize = k - j;
            if (j < 0)
                return false;
            if (i + groupSize > matcher.to) {
                matcher.hitEnd = true;
                return false;
            }
            for (int index=0; index<groupSize; index++)
                if (seq.charAt(i+index) != seq.charAt(j+index))
                    return false;
            return next.match(matcher, i+groupSize, seq);
        }
        boolean study(TreeInfo info) {
            info.maxValid = false;
            return next.study(info);
        }
    }
    static class CIBackRef extends Node {
        int groupIndex;
        boolean doUnicodeCase;
        CIBackRef(int groupCount, boolean doUnicodeCase) {
            super();
            groupIndex = groupCount + groupCount;
            this.doUnicodeCase = doUnicodeCase;
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int j = matcher.groups[groupIndex];
            int k = matcher.groups[groupIndex+1];
            int groupSizeChars = k - j;
            if (j < 0)
                return false;
            if (i + groupSizeChars > matcher.to) {
                matcher.hitEnd = true;
                return false;
            }
            int x = i;
            int groupCodepoints = groupSizeChars;
            for (int index=0; index<groupCodepoints; index++) {
                int c1 = Character.codePointAt(seq, x);
                int c2 = Character.codePointAt(seq, j);
                if (c1 != c2) {
                    if (doUnicodeCase) {
                        int cc1 = Character.toUpperCase(c1);
                        int cc2 = Character.toUpperCase(c2);
                        if (cc1 != cc2 &&
                            Character.toLowerCase(cc1) !=
                            Character.toLowerCase(cc2))
                            return false;
                    } else {
                        if (ASCII.toLower(c1) != ASCII.toLower(c2))
                            return false;
                    }
                }
                x += Character.charCount(c1);
                j += Character.charCount(c2);
                if(c1 >= Character.MIN_SUPPLEMENTARY_CODE_POINT) {
                    groupCodepoints--;
                }
            }
            return next.match(matcher, i+groupSizeChars, seq);
        }
        boolean study(TreeInfo info) {
            info.maxValid = false;
            return next.study(info);
        }
    }
    static final class First extends Node {
        Node atom;
        First(Node node) {
            this.atom = BnM.optimize(node);
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            if (atom instanceof BnM) {
                return atom.match(matcher, i, seq)
                    && next.match(matcher, matcher.last, seq);
            }
            for (;;) {
                if (i > matcher.to) {
                    matcher.hitEnd = true;
                    return false;
                }
                if (atom.match(matcher, i, seq)) {
                    return next.match(matcher, matcher.last, seq);
                }
                i += countChars(seq, i, 1);
                matcher.first++;
            }
        }
        boolean study(TreeInfo info) {
            atom.study(info);
            info.maxValid = false;
            info.deterministic = false;
            return next.study(info);
        }
    }
    static final class Pos extends Node {
        Node cond;
        Pos(Node cond) {
            this.cond = cond;
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int savedTo = matcher.to;
            boolean conditionMatched;
            if (matcher.transparentBounds)
                matcher.to = matcher.getTextLength();
            try {
                conditionMatched = cond.match(matcher, i, seq);
            } finally {
                matcher.to = savedTo;
            }
            return conditionMatched && next.match(matcher, i, seq);
        }
    }
    static final class Neg extends Node {
        Node cond;
        Neg(Node cond) {
            this.cond = cond;
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int savedTo = matcher.to;
            boolean conditionMatched;
            if (matcher.transparentBounds)
                matcher.to = matcher.getTextLength();
            try {
                if (i < matcher.to) {
                    conditionMatched = !cond.match(matcher, i, seq);
                } else {
                    matcher.requireEnd = true;
                    conditionMatched = !cond.match(matcher, i, seq);
                }
            } finally {
                matcher.to = savedTo;
            }
            return conditionMatched && next.match(matcher, i, seq);
        }
    }
    static class LookBehindEndNode extends Node {
        private LookBehindEndNode() {}
        static LookBehindEndNode INSTANCE = new LookBehindEndNode();
        boolean match(Matcher matcher, int i, CharSequence seq) {
            return i == matcher.lookbehindTo;
        }
    }
    static class Behind extends Node {
        Node cond;
        int rmax, rmin;
        Behind(Node cond, int rmax, int rmin) {
            this.cond = cond;
            this.rmax = rmax;
            this.rmin = rmin;
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int savedFrom = matcher.from;
            boolean conditionMatched = false;
            int startIndex = (!matcher.transparentBounds) ?
                             matcher.from : 0;
            int from = Math.max(i - rmax, startIndex);
            int savedLBT = matcher.lookbehindTo;
            matcher.lookbehindTo = i;
            if (matcher.transparentBounds)
                matcher.from = 0;
            for (int j = i - rmin; !conditionMatched && j >= from; j--) {
                conditionMatched = cond.match(matcher, j, seq);
            }
            matcher.from = savedFrom;
            matcher.lookbehindTo = savedLBT;
            return conditionMatched && next.match(matcher, i, seq);
        }
    }
    static final class BehindS extends Behind {
        BehindS(Node cond, int rmax, int rmin) {
            super(cond, rmax, rmin);
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int rmaxChars = countChars(seq, i, -rmax);
            int rminChars = countChars(seq, i, -rmin);
            int savedFrom = matcher.from;
            int startIndex = (!matcher.transparentBounds) ?
                             matcher.from : 0;
            boolean conditionMatched = false;
            int from = Math.max(i - rmaxChars, startIndex);
            int savedLBT = matcher.lookbehindTo;
            matcher.lookbehindTo = i;
            if (matcher.transparentBounds)
                matcher.from = 0;
            for (int j = i - rminChars;
                 !conditionMatched && j >= from;
                 j -= j>from ? countChars(seq, j, -1) : 1) {
                conditionMatched = cond.match(matcher, j, seq);
            }
            matcher.from = savedFrom;
            matcher.lookbehindTo = savedLBT;
            return conditionMatched && next.match(matcher, i, seq);
        }
    }
    static class NotBehind extends Node {
        Node cond;
        int rmax, rmin;
        NotBehind(Node cond, int rmax, int rmin) {
            this.cond = cond;
            this.rmax = rmax;
            this.rmin = rmin;
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int savedLBT = matcher.lookbehindTo;
            int savedFrom = matcher.from;
            boolean conditionMatched = false;
            int startIndex = (!matcher.transparentBounds) ?
                             matcher.from : 0;
            int from = Math.max(i - rmax, startIndex);
            matcher.lookbehindTo = i;
            if (matcher.transparentBounds)
                matcher.from = 0;
            for (int j = i - rmin; !conditionMatched && j >= from; j--) {
                conditionMatched = cond.match(matcher, j, seq);
            }
            matcher.from = savedFrom;
            matcher.lookbehindTo = savedLBT;
            return !conditionMatched && next.match(matcher, i, seq);
        }
    }
    static final class NotBehindS extends NotBehind {
        NotBehindS(Node cond, int rmax, int rmin) {
            super(cond, rmax, rmin);
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int rmaxChars = countChars(seq, i, -rmax);
            int rminChars = countChars(seq, i, -rmin);
            int savedFrom = matcher.from;
            int savedLBT = matcher.lookbehindTo;
            boolean conditionMatched = false;
            int startIndex = (!matcher.transparentBounds) ?
                             matcher.from : 0;
            int from = Math.max(i - rmaxChars, startIndex);
            matcher.lookbehindTo = i;
            if (matcher.transparentBounds)
                matcher.from = 0;
            for (int j = i - rminChars;
                 !conditionMatched && j >= from;
                 j -= j>from ? countChars(seq, j, -1) : 1) {
                conditionMatched = cond.match(matcher, j, seq);
            }
            matcher.from = savedFrom;
            matcher.lookbehindTo = savedLBT;
            return !conditionMatched && next.match(matcher, i, seq);
        }
    }
    static final class Bound extends Node {
        static final int LEFT = 0x1;
        static final int RIGHT= 0x2;
        static final int BOTH = 0x3;
        static final int NONE = 0x4;
        int type;
        boolean useUWORD;
        Bound(int n, boolean useUWORD) {
            type = n;
            this.useUWORD = useUWORD;
        }
        boolean isWord(int ch) {
            return useUWORD ? CharPredicates.WORD().is(ch)
                            : CharPredicates.ASCII_WORD().is(ch);
        }
        int check(Matcher matcher, int i, CharSequence seq) {
            int ch;
            boolean left = false;
            int startIndex = matcher.from;
            int endIndex = matcher.to;
            if (matcher.transparentBounds) {
                startIndex = 0;
                endIndex = matcher.getTextLength();
            }
            if (i > startIndex) {
                ch = Character.codePointBefore(seq, i);
                left = (isWord(ch) ||
                    ((Character.getType(ch) == Character.NON_SPACING_MARK)
                     && hasBaseCharacter(matcher, i-1, seq)));
            }
            boolean right = false;
            if (i < endIndex) {
                ch = Character.codePointAt(seq, i);
                right = (isWord(ch) ||
                    ((Character.getType(ch) == Character.NON_SPACING_MARK)
                     && hasBaseCharacter(matcher, i, seq)));
            } else {
                matcher.hitEnd = true;
                matcher.requireEnd = true;
            }
            return ((left ^ right) ? (right ? LEFT : RIGHT) : NONE);
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            return (check(matcher, i, seq) & type) > 0
                && next.match(matcher, i, seq);
        }
    }
    private static boolean hasBaseCharacter(Matcher matcher, int i,
                                            CharSequence seq)
    {
        int start = (!matcher.transparentBounds) ?
            matcher.from : 0;
        for (int x=i; x >= start; x--) {
            int ch = Character.codePointAt(seq, x);
            if (Character.isLetterOrDigit(ch))
                return true;
            if (Character.getType(ch) == Character.NON_SPACING_MARK)
                continue;
            return false;
        }
        return false;
    }
    static class BnM extends Node {
        int[] buffer;
        int[] lastOcc;
        int[] optoSft;
        static Node optimize(Node node) {
            if (!(node instanceof Slice)) {
                return node;
            }
            int[] src = ((Slice) node).buffer;
            int patternLength = src.length;
            if (patternLength < 4) {
                return node;
            }
            int i, j;
            int[] lastOcc = new int[128];
            int[] optoSft = new int[patternLength];
            for (i = 0; i < patternLength; i++) {
                lastOcc[src[i]&0x7F] = i + 1;
            }
NEXT:       for (i = patternLength; i > 0; i--) {
                for (j = patternLength - 1; j >= i; j--) {
                    if (src[j] == src[j-i]) {
                        optoSft[j-1] = i;
                    } else {
                        continue NEXT;
                    }
                }
                while (j > 0) {
                    optoSft[--j] = i;
                }
            }
            optoSft[patternLength-1] = 1;
            if (node instanceof SliceS)
                return new BnMS(src, lastOcc, optoSft, node.next);
            return new BnM(src, lastOcc, optoSft, node.next);
        }
        BnM(int[] src, int[] lastOcc, int[] optoSft, Node next) {
            this.buffer = src;
            this.lastOcc = lastOcc;
            this.optoSft = optoSft;
            this.next = next;
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int[] src = buffer;
            int patternLength = src.length;
            int last = matcher.to - patternLength;
NEXT:       while (i <= last) {
                for (int j = patternLength - 1; j >= 0; j--) {
                    int ch = seq.charAt(i+j);
                    if (ch != src[j]) {
                        i += Math.max(j + 1 - lastOcc[ch&0x7F], optoSft[j]);
                        continue NEXT;
                    }
                }
                matcher.first = i;
                boolean ret = next.match(matcher, i + patternLength, seq);
                if (ret) {
                    matcher.first = i;
                    matcher.groups[0] = matcher.first;
                    matcher.groups[1] = matcher.last;
                    return true;
                }
                i++;
            }
            matcher.hitEnd = true;
            return false;
        }
        boolean study(TreeInfo info) {
            info.minLength += buffer.length;
            info.maxValid = false;
            return next.study(info);
        }
    }
    static final class BnMS extends BnM {
        int lengthInChars;
        BnMS(int[] src, int[] lastOcc, int[] optoSft, Node next) {
            super(src, lastOcc, optoSft, next);
            for (int cp : buffer) {
                lengthInChars += Character.charCount(cp);
            }
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int[] src = buffer;
            int patternLength = src.length;
            int last = matcher.to - lengthInChars;
NEXT:       while (i <= last) {
                int ch;
                for (int j = countChars(seq, i, patternLength), x = patternLength - 1;
                     j > 0; j -= Character.charCount(ch), x--) {
                    ch = Character.codePointBefore(seq, i+j);
                    if (ch != src[x]) {
                        int n = Math.max(x + 1 - lastOcc[ch&0x7F], optoSft[x]);
                        i += countChars(seq, i, n);
                        continue NEXT;
                    }
                }
                matcher.first = i;
                boolean ret = next.match(matcher, i + lengthInChars, seq);
                if (ret) {
                    matcher.first = i;
                    matcher.groups[0] = matcher.first;
                    matcher.groups[1] = matcher.last;
                    return true;
                }
                i += countChars(seq, i, 1);
            }
            matcher.hitEnd = true;
            return false;
        }
    }
    private static CharPredicate and(CharPredicate p1, CharPredicate p2,
                                     boolean bmpChar) {
        if (bmpChar) {
            return (BmpCharPredicate)(ch -> p1.is(ch) && p2.is(ch));
        } else {
            return (CharPredicate)(ch -> p1.is(ch) && p2.is(ch));
        }
    }
    private static CharPredicate union(CharPredicate p1, CharPredicate p2,
                                       boolean bmpChar) {
        if (bmpChar) {
            return (BmpCharPredicate)(ch -> p1.is(ch) || p2.is(ch));
        } else {
            return (CharPredicate)(ch -> p1.is(ch) || p2.is(ch));
        }
    }
    private static CharPredicate union(CharPredicate p1, CharPredicate p2,
                                       CharPredicate p3, boolean bmpChar) {
        if (bmpChar) {
            return (BmpCharPredicate)(ch -> p1.is(ch) || p2.is(ch) || p3.is(ch));
        } else {
            return (CharPredicate)(ch -> p1.is(ch) || p2.is(ch) || p3.is(ch));
        }
    }
    private static CharPredicate negate(CharPredicate p1) {
        return (CharPredicate)(ch -> !p1.is(ch));
    }
    @FunctionalInterface
    static interface CharPredicate {
        boolean is(int ch);
        default CharPredicate and(CharPredicate p) {
            return Pattern.and(this, p, false);
        }
        default CharPredicate union(CharPredicate p) {
            return Pattern.union(this, p, false);
        }
        default CharPredicate union(CharPredicate p1,
                                    CharPredicate p2) {
            return Pattern.union(this, p1, p2, false);
        }
        default CharPredicate negate() {
            return Pattern.negate(this);
        }
    }
    static interface BmpCharPredicate extends CharPredicate {
        default CharPredicate and(CharPredicate p) {
            return Pattern.and(this, p, p instanceof BmpCharPredicate);
        }
        default CharPredicate union(CharPredicate p) {
            return Pattern.union(this, p, p instanceof BmpCharPredicate);
        }
        default CharPredicate union(CharPredicate p1,
                                    CharPredicate p2) {
            return Pattern.union(this, p1, p2,
                                 p1 instanceof BmpCharPredicate &&
                                 p2 instanceof BmpCharPredicate);
        }
    }
    static BmpCharPredicate VertWS() {
        return cp -> (cp >= 0x0A && cp <= 0x0D) ||
            cp == 0x85 || cp == 0x2028 || cp == 0x2029;
    }
    static BmpCharPredicate HorizWS() {
        return cp ->
            cp == 0x09 || cp == 0x20 || cp == 0xa0 || cp == 0x1680 ||
            cp == 0x180e || cp >= 0x2000 && cp <= 0x200a ||  cp == 0x202f ||
            cp == 0x205f || cp == 0x3000;
    }
    static CharPredicate ALL() {
        return ch -> true;
    }
    static CharPredicate DOT() {
        return ch ->
            (ch != '\n' && ch != '\r'
            && (ch|1) != '\u2029'
            && ch != '\u0085');
    }
    static CharPredicate UNIXDOT() {
        return ch ->  ch != '\n';
    }
    static CharPredicate SingleS(int c) {
        return ch -> ch == c;
    }
    static BmpCharPredicate Single(int c) {
        return ch -> ch == c;
    }
    static BmpCharPredicate SingleI(int lower, int upper) {
        return ch -> ch == lower || ch == upper;
    }
    static CharPredicate SingleU(int lower) {
        return ch -> lower == ch ||
                     lower == Character.toLowerCase(Character.toUpperCase(ch));
    }
    private static boolean inRange(int lower, int ch, int upper) {
        return lower <= ch && ch <= upper;
    }
    static CharPredicate Range(int lower, int upper) {
        if (upper < Character.MIN_HIGH_SURROGATE ||
            lower > Character.MAX_LOW_SURROGATE &&
            upper < Character.MIN_SUPPLEMENTARY_CODE_POINT)
            return (BmpCharPredicate)(ch -> inRange(lower, ch, upper));
        return ch -> inRange(lower, ch, upper);
    }
    static CharPredicate CIRange(int lower, int upper) {
        return ch -> inRange(lower, ch, upper) ||
                     ASCII.isAscii(ch) &&
                     (inRange(lower, ASCII.toUpper(ch), upper) ||
                      inRange(lower, ASCII.toLower(ch), upper));
    }
    static CharPredicate CIRangeU(int lower, int upper) {
        return ch -> {
            if (inRange(lower, ch, upper))
                return true;
            int up = Character.toUpperCase(ch);
            return inRange(lower, up, upper) ||
                   inRange(lower, Character.toLowerCase(up), upper);
        };
    }
    static final Node accept = new Node();
    static final Node lastAccept = new LastNode();
    public Predicate<String> asPredicate() {
        return s -> matcher(s).find();
    }
    public Predicate<String> asMatchPredicate() {
        return s -> matcher(s).matches();
    }
    public Stream<String> splitAsStream(final CharSequence input) {
        class MatcherIterator implements Iterator<String> {
            private Matcher matcher;
            private int current;
            private String nextElement;
            private int emptyElementCount;
            public String next() {
                if (!hasNext())
                    throw new NoSuchElementException();
                if (emptyElementCount == 0) {
                    String n = nextElement;
                    nextElement = null;
                    return n;
                } else {
                    emptyElementCount--;
                    return "";
                }
            }
            public boolean hasNext() {
                if (matcher == null) {
                    matcher = matcher(input);
                    emptyElementCount = input.length() == 0 ? 1 : 0;
                }
                if (nextElement != null || emptyElementCount > 0)
                    return true;
                if (current == input.length())
                    return false;
                while (matcher.find()) {
                    nextElement = input.subSequence(current, matcher.start()).toString();
                    current = matcher.end();
                    if (!nextElement.isEmpty()) {
                        return true;
                    } else if (current > 0) {
                        emptyElementCount++;
                    }
                }
                nextElement = input.subSequence(current, input.length()).toString();
                current = input.length();
                if (!nextElement.isEmpty()) {
                    return true;
                } else {
                    emptyElementCount = 0;
                    nextElement = null;
                    return false;
                }
            }
        }
        return StreamSupport.stream(Spliterators.spliteratorUnknownSize(
                new MatcherIterator(), Spliterator.ORDERED | Spliterator.NONNULL), false);
    }
}
final class Matcher implements MatchResult {
    Pattern parentPattern;
    int[] groups;
    int from, to;
    int lookbehindTo;
    CharSequence text;
    static final int ENDANCHOR = 1;
    static final int NOANCHOR = 0;
    int acceptMode = NOANCHOR;
    int first = -1, last = 0;
    int oldLast = -1;
    int lastAppendPosition = 0;
    int[] locals;
    IntHashSet[] localsPos;
    boolean hitEnd;
    boolean requireEnd;
    boolean transparentBounds = false;
    boolean anchoringBounds = true;
    int modCount;
    private Map<String, Integer> namedGroups;
    Matcher() {
    }
    Matcher(Pattern parent, CharSequence text) {
        this.parentPattern = parent;
        this.text = text;
        int parentGroupCount = Math.max(parent.capturingGroupCount, 10);
        groups = new int[parentGroupCount * 2];
        locals = new int[parent.localCount];
        localsPos = new IntHashSet[parent.localTCNCount];
        reset();
    }
    public Pattern pattern() {
        return parentPattern;
    }
    public MatchResult toMatchResult() {
        int minStart;
        String capturedText;
        if (hasMatch()) {
            minStart = minStart();
            capturedText = text.subSequence(minStart, maxEnd()).toString();
        } else {
            minStart = -1;
            capturedText = null;
        }
        return new ImmutableMatchResult(first, last, groupCount(),
                groups.clone(), capturedText,
                namedGroups(), minStart);
    }
    private int minStart() {
        int r = text.length();
        for (int group = 0; group <= groupCount(); ++group) {
            int start = groups[group * 2];
            if (start >= 0) {
                r = Math.min(r, start);
            }
        }
        return r;
    }
    private int maxEnd() {
        int r = 0;
        for (int group = 0; group <= groupCount(); ++group) {
            int end = groups[group * 2 + 1];
            if (end >= 0) {
                r = Math.max(r, end);
            }
        }
        return r;
    }
    private static class ImmutableMatchResult implements MatchResult {
        private final int first;
        private final int last;
        private final int groupCount;
        private final int[] groups;
        private final String text;
        private final Map<String, Integer> namedGroups;
        private final int minStart;
        ImmutableMatchResult(int first, int last, int groupCount,
                             int[] groups, String text,
                             Map<String, Integer> namedGroups, int minStart) {
            this.first = first;
            this.last = last;
            this.groupCount = groupCount;
            this.groups = groups;
            this.text = text;
            this.namedGroups = namedGroups;
            this.minStart = minStart;
        }
        @Override
        public int start() {
            checkMatch();
            return first;
        }
        @Override
        public int start(int group) {
            checkMatch();
            checkGroup(group);
            return groups[group * 2];
        }
        @Override
        public int end() {
            checkMatch();
            return last;
        }
        @Override
        public int end(int group) {
            checkMatch();
            checkGroup(group);
            return groups[group * 2 + 1];
        }
        @Override
        public int groupCount() {
            return groupCount;
        }
        @Override
        public String group() {
            checkMatch();
            return group(0);
        }
        @Override
        public String group(int group) {
            checkMatch();
            checkGroup(group);
            if ((groups[group * 2] == -1) || (groups[group * 2 + 1] == -1))
                return null;
            return text.substring(groups[group * 2] - minStart, groups[group * 2 + 1] - minStart);
        }
        @Override
        public Map<String, Integer> namedGroups() {
            return namedGroups;
        }
        @Override
        public boolean hasMatch() {
            return first >= 0;
        }
        private void checkGroup(int group) {
            if (group < 0 || group > groupCount)
                throw new IndexOutOfBoundsException("No group " + group);
        }
        private void checkMatch() {
            if (!hasMatch())
                throw new IllegalStateException("No match found");
        }
    }
    public Matcher usePattern(Pattern newPattern) {
        if (newPattern == null)
            throw new IllegalArgumentException("Pattern cannot be null");
        parentPattern = newPattern;
        namedGroups = null;
        int parentGroupCount = Math.max(newPattern.capturingGroupCount, 10);
        groups = new int[parentGroupCount * 2];
        locals = new int[newPattern.localCount];
        for (int i = 0; i < groups.length; i++)
            groups[i] = -1;
        for (int i = 0; i < locals.length; i++)
            locals[i] = -1;
        localsPos = new IntHashSet[parentPattern.localTCNCount];
        modCount++;
        return this;
    }
    public Matcher reset() {
        first = -1;
        last = 0;
        oldLast = -1;
        for(int i=0; i<groups.length; i++)
            groups[i] = -1;
        for(int i=0; i<locals.length; i++)
            locals[i] = -1;
        for (int i = 0; i < localsPos.length; i++) {
            if (localsPos[i] != null)
                localsPos[i].clear();
        }
        lastAppendPosition = 0;
        from = 0;
        to = getTextLength();
        modCount++;
        return this;
    }
    public Matcher reset(CharSequence input) {
        text = input;
        return reset();
    }
    public int start() {
        checkMatch();
        return first;
    }
    public int start(int group) {
        checkMatch();
        checkGroup(group);
        return groups[group * 2];
    }
    public int start(String name) {
        return groups[getMatchedGroupIndex(name) * 2];
    }
    public int end() {
        checkMatch();
        return last;
    }
    public int end(int group) {
        checkMatch();
        checkGroup(group);
        return groups[group * 2 + 1];
    }
    public int end(String name) {
        return groups[getMatchedGroupIndex(name) * 2 + 1];
    }
    public String group() {
        return group(0);
    }
    public String group(int group) {
        checkMatch();
        checkGroup(group);
        if ((groups[group*2] == -1) || (groups[group*2+1] == -1))
            return null;
        return getSubSequence(groups[group * 2], groups[group * 2 + 1]).toString();
    }
    public String group(String name) {
        int group = getMatchedGroupIndex(name);
        if ((groups[group*2] == -1) || (groups[group*2+1] == -1))
            return null;
        return getSubSequence(groups[group * 2], groups[group * 2 + 1]).toString();
    }
    public int groupCount() {
        return parentPattern.capturingGroupCount - 1;
    }
    public boolean matches() {
        return match(from, ENDANCHOR);
    }
    public boolean find() {
        int nextSearchIndex = last;
        if (nextSearchIndex == first)
            nextSearchIndex++;
        if (nextSearchIndex < from)
            nextSearchIndex = from;
        if (nextSearchIndex > to) {
            for (int i = 0; i < groups.length; i++)
                groups[i] = -1;
            return false;
        }
        return search(nextSearchIndex);
    }
    public boolean find(int start) {
        int limit = getTextLength();
        if ((start < 0) || (start > limit))
            throw new IndexOutOfBoundsException("Illegal start index");
        reset();
        return search(start);
    }
    public boolean lookingAt() {
        return match(from, NOANCHOR);
    }
    public static String quoteReplacement(String s) {
        if ((s.indexOf('\\') == -1) && (s.indexOf('$') == -1))
            return s;
        StringBuilder sb = new StringBuilder();
        for (int i=0; i<s.length(); i++) {
            char c = s.charAt(i);
            if (c == '\\' || c == '$') {
                sb.append('\\');
            }
            sb.append(c);
        }
        return sb.toString();
    }
    public Matcher appendReplacement(StringBuffer sb, String replacement) {
        checkMatch();
        int curLen = sb.length();
        try {
            sb.append(text, lastAppendPosition, first);
            appendExpandedReplacement(sb, replacement);
        } catch (IllegalArgumentException e) {
            sb.setLength(curLen);
            throw e;
        }
        lastAppendPosition = last;
        modCount++;
        return this;
    }
    public Matcher appendReplacement(StringBuilder sb, String replacement) {
        checkMatch();
        int curLen = sb.length();
        try {
            sb.append(text, lastAppendPosition, first);
            appendExpandedReplacement(sb, replacement);
        } catch (IllegalArgumentException e) {
            sb.setLength(curLen);
            throw e;
        }
        lastAppendPosition = last;
        modCount++;
        return this;
    }
    private void appendExpandedReplacement(Appendable app, String replacement) {
        try {
            int cursor = 0;
            while (cursor < replacement.length()) {
                char nextChar = replacement.charAt(cursor);
                if (nextChar == '\\') {
                    cursor++;
                    if (cursor == replacement.length())
                        throw new IllegalArgumentException(
                                "character to be escaped is missing");
                    nextChar = replacement.charAt(cursor);
                    app.append(nextChar);
                    cursor++;
                } else if (nextChar == '$') {
                    cursor++;
                    if (cursor == replacement.length())
                        throw new IllegalArgumentException(
                                "Illegal group reference: group index is missing");
                    nextChar = replacement.charAt(cursor);
                    int refNum = -1;
                    if (nextChar == '{') {
                        cursor++;
                        int begin = cursor;
                        while (cursor < replacement.length()) {
                            nextChar = replacement.charAt(cursor);
                            if (ASCII.isLower(nextChar) ||
                                    ASCII.isUpper(nextChar) ||
                                    ASCII.isDigit(nextChar)) {
                                cursor++;
                            } else {
                                break;
                            }
                        }
                        if (begin == cursor)
                            throw new IllegalArgumentException(
                                    "named capturing group has 0 length name");
                        if (nextChar != '}')
                            throw new IllegalArgumentException(
                                    "named capturing group is missing trailing '}'");
                        String gname = replacement.substring(begin, cursor);
                        if (ASCII.isDigit(gname.charAt(0)))
                            throw new IllegalArgumentException(
                                    "capturing group name {" + gname +
                                            "} starts with digit character");
                        Integer number = namedGroups().get(gname);
                        if (number == null)
                            throw new IllegalArgumentException(
                                    "No group with name {" + gname + "}");
                        refNum = number;
                        cursor++;
                    } else {
                        refNum = nextChar - '0';
                        if ((refNum < 0) || (refNum > 9))
                            throw new IllegalArgumentException(
                                    "Illegal group reference");
                        cursor++;
                        boolean done = false;
                        while (!done) {
                            if (cursor >= replacement.length()) {
                                break;
                            }
                            int nextDigit = replacement.charAt(cursor) - '0';
                            if ((nextDigit < 0) || (nextDigit > 9)) {
                                break;
                            }
                            int newRefNum = (refNum * 10) + nextDigit;
                            if (groupCount() < newRefNum) {
                                done = true;
                            } else {
                                refNum = newRefNum;
                                cursor++;
                            }
                        }
                    }
                    if (start(refNum) != -1 && end(refNum) != -1)
                        app.append(text, start(refNum), end(refNum));
                } else {
                    app.append(nextChar);
                    cursor++;
                }
            }
        } catch (IOException e) {
            throw new AssertionError(e.getMessage());
        }
    }
    public StringBuffer appendTail(StringBuffer sb) {
        sb.append(text, lastAppendPosition, getTextLength());
        return sb;
    }
    public StringBuilder appendTail(StringBuilder sb) {
        sb.append(text, lastAppendPosition, getTextLength());
        return sb;
    }
    public String replaceAll(String replacement) {
        reset();
        boolean result = find();
        if (result) {
            StringBuilder sb = new StringBuilder();
            do {
                appendReplacement(sb, replacement);
                result = find();
            } while (result);
            appendTail(sb);
            return sb.toString();
        }
        return text.toString();
    }
    public String replaceAll(Function<MatchResult, String> replacer) {
        Objects.requireNonNull(replacer);
        reset();
        boolean result = find();
        if (result) {
            StringBuilder sb = new StringBuilder();
            do {
                int ec = modCount;
                String replacement =  replacer.apply(this);
                if (ec != modCount)
                    throw new ConcurrentModificationException();
                appendReplacement(sb, replacement);
                result = find();
            } while (result);
            appendTail(sb);
            return sb.toString();
        }
        return text.toString();
    }
    public Stream<MatchResult> results() {
        class MatchResultIterator implements Iterator<MatchResult> {
            int state = -1;
            int expectedCount = -1;
            @Override
            public MatchResult next() {
                if (expectedCount >= 0 && expectedCount != modCount)
                    throw new ConcurrentModificationException();
                if (!hasNext())
                    throw new NoSuchElementException();
                state = -1;
                return toMatchResult();
            }
            @Override
            public boolean hasNext() {
                if (state >= 0)
                    return state == 1;
                if (expectedCount >= 0 && expectedCount != modCount)
                    return true;
                boolean found = find();
                state = found ? 1 : 0;
                expectedCount = modCount;
                return found;
            }
            @Override
            public void forEachRemaining(Consumer<? super MatchResult> action) {
                if (expectedCount >= 0 && expectedCount != modCount)
                    throw new ConcurrentModificationException();
                int s = state;
                if (s == 0)
                    return;
                state = 0;
                expectedCount = -1;
                if (s < 0 && !find())
                    return;
                do {
                    int ec = modCount;
                    action.accept(toMatchResult());
                    if (ec != modCount)
                        throw new ConcurrentModificationException();
                } while (find());
            }
        }
        return StreamSupport.stream(Spliterators.spliteratorUnknownSize(
                new MatchResultIterator(), Spliterator.ORDERED | Spliterator.NONNULL), false);
    }
    public String replaceFirst(String replacement) {
        if (replacement == null)
            throw new NullPointerException("replacement");
        reset();
        if (!find())
            return text.toString();
        StringBuilder sb = new StringBuilder();
        appendReplacement(sb, replacement);
        appendTail(sb);
        return sb.toString();
    }
    public String replaceFirst(Function<MatchResult, String> replacer) {
        Objects.requireNonNull(replacer);
        reset();
        if (!find())
            return text.toString();
        StringBuilder sb = new StringBuilder();
        int ec = modCount;
        String replacement = replacer.apply(this);
        if (ec != modCount)
            throw new ConcurrentModificationException();
        appendReplacement(sb, replacement);
        appendTail(sb);
        return sb.toString();
    }
    public Matcher region(int start, int end) {
        if ((start < 0) || (start > getTextLength()))
            throw new IndexOutOfBoundsException("start");
        if ((end < 0) || (end > getTextLength()))
            throw new IndexOutOfBoundsException("end");
        if (start > end)
            throw new IndexOutOfBoundsException("start > end");
        reset();
        from = start;
        to = end;
        return this;
    }
    public int regionStart() {
        return from;
    }
    public int regionEnd() {
        return to;
    }
    public boolean hasTransparentBounds() {
        return transparentBounds;
    }
    public Matcher useTransparentBounds(boolean b) {
        transparentBounds = b;
        return this;
    }
    public boolean hasAnchoringBounds() {
        return anchoringBounds;
    }
    public Matcher useAnchoringBounds(boolean b) {
        anchoringBounds = b;
        return this;
    }
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Matcher")
                .append("[pattern=").append(pattern())
                .append(" region=")
                .append(regionStart()).append(',').append(regionEnd())
                .append(" lastmatch=");
        if ((first >= 0) && (group() != null)) {
            sb.append(group());
        }
        sb.append(']');
        return sb.toString();
    }
    public boolean hitEnd() {
        return hitEnd;
    }
    public boolean requireEnd() {
        return requireEnd;
    }
    boolean search(int from) {
        this.hitEnd = false;
        this.requireEnd = false;
        from        = from < 0 ? 0 : from;
        this.first  = from;
        this.oldLast = oldLast < 0 ? from : oldLast;
        for (int i = 0; i < groups.length; i++)
            groups[i] = -1;
        for (int i = 0; i < localsPos.length; i++) {
            if (localsPos[i] != null)
                localsPos[i].clear();
        }
        acceptMode = NOANCHOR;
        boolean result = parentPattern.root.match(this, from, text);
        if (!result)
            this.first = -1;
        this.oldLast = this.last;
        this.modCount++;
        return result;
    }
    boolean match(int from, int anchor) {
        this.hitEnd = false;
        this.requireEnd = false;
        from        = from < 0 ? 0 : from;
        this.first  = from;
        this.oldLast = oldLast < 0 ? from : oldLast;
        for (int i = 0; i < groups.length; i++)
            groups[i] = -1;
        for (int i = 0; i < localsPos.length; i++) {
            if (localsPos[i] != null)
                localsPos[i].clear();
        }
        acceptMode = anchor;
        boolean result = parentPattern.matchRoot.match(this, from, text);
        if (!result)
            this.first = -1;
        this.oldLast = this.last;
        this.modCount++;
        return result;
    }
    int getTextLength() {
        return text.length();
    }
    CharSequence getSubSequence(int beginIndex, int endIndex) {
        return text.subSequence(beginIndex, endIndex);
    }
    char charAt(int i) {
        return text.charAt(i);
    }
    int getMatchedGroupIndex(String name) {
        Objects.requireNonNull(name, "Group name");
        checkMatch();
        Integer number = namedGroups().get(name);
        if (number == null)
            throw new IllegalArgumentException("No group with name <" + name + ">");
        return number;
    }
    private void checkGroup(int group) {
        if (group < 0 || group > groupCount())
            throw new IndexOutOfBoundsException("No group " + group);
    }
    private void checkMatch() {
        if (!hasMatch())
            throw new IllegalStateException("No match found");
    }
    @Override
    public Map<String, Integer> namedGroups() {
        if (namedGroups == null) {
            return namedGroups = parentPattern.namedGroups();
        }
        return namedGroups;
    }
    @Override
    public boolean hasMatch() {
        return first >= 0;
    }
}
interface MatchResult {
    int start();
    int start(int group);
    default int start(String name) {
        return start(groupNumber(name));
    }
    int end();
    int end(int group);
    default int end(String name) {
        return end(groupNumber(name));
    }
    String group();
    String group(int group);
    default String group(String name) {
        return group(groupNumber(name));
    }
    int groupCount();
    default Map<String,Integer> namedGroups() {
        throw new UnsupportedOperationException("namedGroups()");
    }
    private int groupNumber(String name) {
        Objects.requireNonNull(name, "Group name");
        Integer number = namedGroups().get(name);
        if (number != null) {
            return number;
        }
        throw new IllegalArgumentException("No group with name <" + name + ">");
    }
    default boolean hasMatch() {
        throw new UnsupportedOperationException("hasMatch()");
    }
}
class PatternSyntaxException
    extends IllegalArgumentException
{
    private static final long serialVersionUID = -3864639126226059218L;
    private final String desc;
    private final String pattern;
    private final int index;
    public PatternSyntaxException(String desc, String regex, int index) {
        this.desc = desc;
        this.pattern = regex;
        this.index = index;
    }
    public int getIndex() {
        return index;
    }
    public String getDescription() {
        return desc;
    }
    public String getPattern() {
        return pattern;
    }
    public String getMessage() {
        StringBuilder sb = new StringBuilder();
        sb.append(desc);
        if (index >= 0) {
            sb.append(" near index ");
            sb.append(index);
        }
        sb.append(System.lineSeparator());
        sb.append(pattern);
        if (index >= 0 && pattern != null && index < pattern.length()) {
            sb.append(System.lineSeparator());
            for (int i = 0; i < index; i++) {
                sb.append((pattern.charAt(i) == '\t') ? '\t' : ' ');
            }
            sb.append('^');
        }
        return sb.toString();
    }
}
final class ASCII {
    static final int UPPER   = 0x00000100;
    static final int LOWER   = 0x00000200;
    static final int DIGIT   = 0x00000400;
    static final int SPACE   = 0x00000800;
    static final int PUNCT   = 0x00001000;
    static final int CNTRL   = 0x00002000;
    static final int BLANK   = 0x00004000;
    static final int HEX     = 0x00008000;
    static final int UNDER   = 0x00010000;
    static final int ASCII   = 0x0000FF00;
    static final int ALPHA   = (UPPER|LOWER);
    static final int ALNUM   = (UPPER|LOWER|DIGIT);
    static final int GRAPH   = (PUNCT|UPPER|LOWER|DIGIT);
    static final int WORD    = (UPPER|LOWER|UNDER|DIGIT);
    static final int XDIGIT  = (HEX);
    private static final int[] ctype = new int[] {
        CNTRL,
        CNTRL,
        CNTRL,
        CNTRL,
        CNTRL,
        CNTRL,
        CNTRL,
        CNTRL,
        CNTRL,
        SPACE+CNTRL+BLANK,
        SPACE+CNTRL,
        SPACE+CNTRL,
        SPACE+CNTRL,
        SPACE+CNTRL,
        CNTRL,
        CNTRL,
        CNTRL,
        CNTRL,
        CNTRL,
        CNTRL,
        CNTRL,
        CNTRL,
        CNTRL,
        CNTRL,
        CNTRL,
        CNTRL,
        CNTRL,
        CNTRL,
        CNTRL,
        CNTRL,
        CNTRL,
        CNTRL,
        SPACE+BLANK,
        PUNCT,
        PUNCT,
        PUNCT,
        PUNCT,
        PUNCT,
        PUNCT,
        PUNCT,
        PUNCT,
        PUNCT,
        PUNCT,
        PUNCT,
        PUNCT,
        PUNCT,
        PUNCT,
        PUNCT,
        DIGIT+HEX+0,
        DIGIT+HEX+1,
        DIGIT+HEX+2,
        DIGIT+HEX+3,
        DIGIT+HEX+4,
        DIGIT+HEX+5,
        DIGIT+HEX+6,
        DIGIT+HEX+7,
        DIGIT+HEX+8,
        DIGIT+HEX+9,
        PUNCT,
        PUNCT,
        PUNCT,
        PUNCT,
        PUNCT,
        PUNCT,
        PUNCT,
        UPPER+HEX+10,
        UPPER+HEX+11,
        UPPER+HEX+12,
        UPPER+HEX+13,
        UPPER+HEX+14,
        UPPER+HEX+15,
        UPPER+16,
        UPPER+17,
        UPPER+18,
        UPPER+19,
        UPPER+20,
        UPPER+21,
        UPPER+22,
        UPPER+23,
        UPPER+24,
        UPPER+25,
        UPPER+26,
        UPPER+27,
        UPPER+28,
        UPPER+29,
        UPPER+30,
        UPPER+31,
        UPPER+32,
        UPPER+33,
        UPPER+34,
        UPPER+35,
        PUNCT,
        PUNCT,
        PUNCT,
        PUNCT,
        PUNCT|UNDER,
        PUNCT,
        LOWER+HEX+10,
        LOWER+HEX+11,
        LOWER+HEX+12,
        LOWER+HEX+13,
        LOWER+HEX+14,
        LOWER+HEX+15,
        LOWER+16,
        LOWER+17,
        LOWER+18,
        LOWER+19,
        LOWER+20,
        LOWER+21,
        LOWER+22,
        LOWER+23,
        LOWER+24,
        LOWER+25,
        LOWER+26,
        LOWER+27,
        LOWER+28,
        LOWER+29,
        LOWER+30,
        LOWER+31,
        LOWER+32,
        LOWER+33,
        LOWER+34,
        LOWER+35,
        PUNCT,
        PUNCT,
        PUNCT,
        PUNCT,
        CNTRL,
    };
    static int getType(int ch) {
        return ((ch & 0xFFFFFF80) == 0 ? ctype[ch] : 0);
    }
    static boolean isType(int ch, int type) {
        return (getType(ch) & type) != 0;
    }
    static boolean isAscii(int ch) {
        return ((ch & 0xFFFFFF80) == 0);
    }
    static boolean isAlpha(int ch) {
        return isType(ch, ALPHA);
    }
    static boolean isDigit(int ch) {
        return ((ch-'0')|('9'-ch)) >= 0;
    }
    static boolean isAlnum(int ch) {
        return isType(ch, ALNUM);
    }
    static boolean isGraph(int ch) {
        return isType(ch, GRAPH);
    }
    static boolean isPrint(int ch) {
        return ((ch-0x20)|(0x7E-ch)) >= 0;
    }
    static boolean isPunct(int ch) {
        return isType(ch, PUNCT);
    }
    static boolean isSpace(int ch) {
        return isType(ch, SPACE);
    }
    static boolean isHexDigit(int ch) {
        return isType(ch, HEX);
    }
    static boolean isOctDigit(int ch) {
        return ((ch-'0')|('7'-ch)) >= 0;
    }
    static boolean isCntrl(int ch) {
        return isType(ch, CNTRL);
    }
    static boolean isLower(int ch) {
        return ((ch-'a')|('z'-ch)) >= 0;
    }
    static boolean isUpper(int ch) {
        return ((ch-'A')|('Z'-ch)) >= 0;
    }
    static boolean isWord(int ch) {
        return isType(ch, WORD);
    }
    static int toDigit(int ch) {
        return (ctype[ch & 0x7F] & 0x3F);
    }
    static int toLower(int ch) {
        return isUpper(ch) ? (ch + 0x20) : ch;
    }
    static int toUpper(int ch) {
        return isLower(ch) ? (ch - 0x20) : ch;
    }
}
class CharPredicates {
    static final Pattern.CharPredicate ALPHABETIC() {
        return Character::isAlphabetic;
    }
    static final Pattern.CharPredicate DIGIT() {
        return Character::isDigit;
    }
    static final Pattern.CharPredicate LETTER() {
        return Character::isLetter;
    }
    static final Pattern.CharPredicate IDEOGRAPHIC() {
        return SlNorm.no("isIdeographic");
    }
    static final Pattern.CharPredicate LOWERCASE() {
        return Character::isLowerCase;
    }
    static final Pattern.CharPredicate UPPERCASE() {
        return Character::isUpperCase;
    }
    static final Pattern.CharPredicate TITLECASE() {
        return Character::isTitleCase;
    }
    static final Pattern.CharPredicate WHITE_SPACE() {
        return ch ->
            ((((1 << Character.SPACE_SEPARATOR) |
               (1 << Character.LINE_SEPARATOR) |
               (1 << Character.PARAGRAPH_SEPARATOR)) >> Character.getType(ch)) & 1)
            != 0 || (ch >= 0x9 && ch <= 0xd) || (ch == 0x85);
    }
    static final Pattern.CharPredicate CONTROL() {
        return ch -> Character.getType(ch) == Character.CONTROL;
    }
    static final Pattern.CharPredicate PUNCTUATION() {
        return ch ->
            ((((1 << Character.CONNECTOR_PUNCTUATION) |
               (1 << Character.DASH_PUNCTUATION) |
               (1 << Character.START_PUNCTUATION) |
               (1 << Character.END_PUNCTUATION) |
               (1 << Character.OTHER_PUNCTUATION) |
               (1 << Character.INITIAL_QUOTE_PUNCTUATION) |
               (1 << Character.FINAL_QUOTE_PUNCTUATION)) >> Character.getType(ch)) & 1)
            != 0;
    }
    static final Pattern.CharPredicate HEX_DIGIT() {
        return DIGIT().union(ch -> (ch >= 0x0030 && ch <= 0x0039) ||
                (ch >= 0x0041 && ch <= 0x0046) ||
                (ch >= 0x0061 && ch <= 0x0066) ||
                (ch >= 0xFF10 && ch <= 0xFF19) ||
                (ch >= 0xFF21 && ch <= 0xFF26) ||
                (ch >= 0xFF41 && ch <= 0xFF46));
    }
    static final Pattern.CharPredicate ASSIGNED() {
        return ch -> Character.getType(ch) != Character.UNASSIGNED;
    }
    static final Pattern.CharPredicate NONCHARACTER_CODE_POINT() {
        return ch -> (ch & 0xfffe) == 0xfffe || (ch >= 0xfdd0 && ch <= 0xfdef);
    }
    static final Pattern.CharPredicate ALNUM() {
        return ALPHABETIC().union(DIGIT());
    }
    static final Pattern.CharPredicate BLANK() {
        return ch ->
            Character.getType(ch) == Character.SPACE_SEPARATOR ||
            ch == 0x9;
    }
    static final Pattern.CharPredicate GRAPH() {
        return ch ->
            ((((1 << Character.SPACE_SEPARATOR) |
               (1 << Character.LINE_SEPARATOR) |
               (1 << Character.PARAGRAPH_SEPARATOR) |
               (1 << Character.CONTROL) |
               (1 << Character.SURROGATE) |
               (1 << Character.UNASSIGNED)) >> Character.getType(ch)) & 1)
            == 0;
    }
    static final Pattern.CharPredicate PRINT() {
        return GRAPH().union(BLANK()).and(CONTROL().negate());
    }
    static final Pattern.CharPredicate JOIN_CONTROL() {
        return ch -> ch == 0x200C || ch == 0x200D;
    }
    static final Pattern.CharPredicate WORD() {
        return ALPHABETIC().union(ch -> ((((1 << Character.NON_SPACING_MARK) |
                                  (1 << Character.ENCLOSING_MARK) |
                                  (1 << Character.COMBINING_SPACING_MARK) |
                                  (1 << Character.DECIMAL_DIGIT_NUMBER) |
                                  (1 << Character.CONNECTOR_PUNCTUATION))
                                 >> Character.getType(ch)) & 1) != 0,
                         JOIN_CONTROL());
    }
    private static Pattern.CharPredicate getPosixPredicate(String name, boolean caseIns) {
        return switch (name) {
            case "ALPHA" -> ALPHABETIC();
            case "LOWER" -> caseIns
                                ? LOWERCASE().union(UPPERCASE(), TITLECASE())
                                : LOWERCASE();
            case "UPPER" -> caseIns
                                ? UPPERCASE().union(LOWERCASE(), TITLECASE())
                                : UPPERCASE();
            case "SPACE" -> WHITE_SPACE();
            case "PUNCT" -> PUNCTUATION();
            case "XDIGIT" -> HEX_DIGIT();
            case "ALNUM" -> ALNUM();
            case "CNTRL" -> CONTROL();
            case "DIGIT" -> DIGIT();
            case "BLANK" -> BLANK();
            case "GRAPH" -> GRAPH();
            case "PRINT" -> PRINT();
            default -> null;
        };
    }
    private static Pattern.CharPredicate getUnicodePredicate(String name, boolean caseIns) {
        return switch (name) {
            case "ALPHABETIC" -> ALPHABETIC();
            case "ASSIGNED" -> ASSIGNED();
            case "CONTROL" -> CONTROL();
            case "EMOJI" -> EMOJI();
            case "EMOJI_PRESENTATION" -> EMOJI_PRESENTATION();
            case "EMOJI_MODIFIER" -> EMOJI_MODIFIER();
            case "EMOJI_MODIFIER_BASE" -> EMOJI_MODIFIER_BASE();
            case "EMOJI_COMPONENT" -> EMOJI_COMPONENT();
            case "EXTENDED_PICTOGRAPHIC" -> EXTENDED_PICTOGRAPHIC();
            case "HEXDIGIT", "HEX_DIGIT" -> HEX_DIGIT();
            case "IDEOGRAPHIC" -> IDEOGRAPHIC();
            case "JOINCONTROL", "JOIN_CONTROL" -> JOIN_CONTROL();
            case "LETTER" -> LETTER();
            case "LOWERCASE" -> caseIns
                                    ? LOWERCASE().union(UPPERCASE(), TITLECASE())
                                    : LOWERCASE();
            case "NONCHARACTERCODEPOINT", "NONCHARACTER_CODE_POINT" -> NONCHARACTER_CODE_POINT();
            case "TITLECASE" -> caseIns
                                    ? TITLECASE().union(LOWERCASE(), UPPERCASE())
                                    : TITLECASE();
            case "PUNCTUATION" -> PUNCTUATION();
            case "UPPERCASE" -> caseIns
                                    ? UPPERCASE().union(LOWERCASE(), TITLECASE())
                                    : UPPERCASE();
            case "WHITESPACE", "WHITE_SPACE" -> WHITE_SPACE();
            case "WORD" -> WORD();
            default -> null;
        };
    }
    public static Pattern.CharPredicate forUnicodeProperty(String propName, boolean caseIns) {
        propName = propName.toUpperCase(Locale.ROOT);
        Pattern.CharPredicate p = getUnicodePredicate(propName, caseIns);
        if (p != null)
            return p;
        return getPosixPredicate(propName, caseIns);
    }
    public static Pattern.CharPredicate forPOSIXName(String propName, boolean caseIns) {
        return getPosixPredicate(propName.toUpperCase(Locale.ENGLISH), caseIns);
    }
    static Pattern.CharPredicate forUnicodeScript(String name) {
        return null;
    }
    static Pattern.CharPredicate forUnicodeBlock(String name) {
        final Character.UnicodeBlock block;
        try {
            block = Character.UnicodeBlock.forName(name);
            return ch -> block == Character.UnicodeBlock.of(ch);
        } catch (IllegalArgumentException iae) {}
         return null;
    }
    static Pattern.CharPredicate forProperty(String name, boolean caseIns) {
        return switch (name) {
            case "Cn" -> category(1 << Character.UNASSIGNED);
            case "Lu" -> category(caseIns ? (1 << Character.LOWERCASE_LETTER) |
                                            (1 << Character.UPPERCASE_LETTER) |
                                            (1 << Character.TITLECASE_LETTER)
                                          : (1 << Character.UPPERCASE_LETTER));
            case "Ll" -> category(caseIns ? (1 << Character.LOWERCASE_LETTER) |
                                            (1 << Character.UPPERCASE_LETTER) |
                                            (1 << Character.TITLECASE_LETTER)
                                          : (1 << Character.LOWERCASE_LETTER));
            case "Lt" -> category(caseIns ? (1 << Character.LOWERCASE_LETTER) |
                                            (1 << Character.UPPERCASE_LETTER) |
                                            (1 << Character.TITLECASE_LETTER)
                                          : (1 << Character.TITLECASE_LETTER));
            case "Lm" -> category(1 << Character.MODIFIER_LETTER);
            case "Lo" -> category(1 << Character.OTHER_LETTER);
            case "Mn" -> category(1 << Character.NON_SPACING_MARK);
            case "Me" -> category(1 << Character.ENCLOSING_MARK);
            case "Mc" -> category(1 << Character.COMBINING_SPACING_MARK);
            case "Nd" -> category(1 << Character.DECIMAL_DIGIT_NUMBER);
            case "Nl" -> category(1 << Character.LETTER_NUMBER);
            case "No" -> category(1 << Character.OTHER_NUMBER);
            case "Zs" -> category(1 << Character.SPACE_SEPARATOR);
            case "Zl" -> category(1 << Character.LINE_SEPARATOR);
            case "Zp" -> category(1 << Character.PARAGRAPH_SEPARATOR);
            case "Cc" -> category(1 << Character.CONTROL);
            case "Cf" -> category(1 << Character.FORMAT);
            case "Co" -> category(1 << Character.PRIVATE_USE);
            case "Cs" -> category(1 << Character.SURROGATE);
            case "Pd" -> category(1 << Character.DASH_PUNCTUATION);
            case "Ps" -> category(1 << Character.START_PUNCTUATION);
            case "Pe" -> category(1 << Character.END_PUNCTUATION);
            case "Pc" -> category(1 << Character.CONNECTOR_PUNCTUATION);
            case "Po" -> category(1 << Character.OTHER_PUNCTUATION);
            case "Sm" -> category(1 << Character.MATH_SYMBOL);
            case "Sc" -> category(1 << Character.CURRENCY_SYMBOL);
            case "Sk" -> category(1 << Character.MODIFIER_SYMBOL);
            case "So" -> category(1 << Character.OTHER_SYMBOL);
            case "Pi" -> category(1 << Character.INITIAL_QUOTE_PUNCTUATION);
            case "Pf" -> category(1 << Character.FINAL_QUOTE_PUNCTUATION);
            case "L" -> category(((1 << Character.UPPERCASE_LETTER) |
                                  (1 << Character.LOWERCASE_LETTER) |
                                  (1 << Character.TITLECASE_LETTER) |
                                  (1 << Character.MODIFIER_LETTER) |
                                  (1 << Character.OTHER_LETTER)));
            case "M" -> category(((1 << Character.NON_SPACING_MARK) |
                                  (1 << Character.ENCLOSING_MARK) |
                                  (1 << Character.COMBINING_SPACING_MARK)));
            case "N" -> category(((1 << Character.DECIMAL_DIGIT_NUMBER) |
                                  (1 << Character.LETTER_NUMBER) |
                                  (1 << Character.OTHER_NUMBER)));
            case "Z" -> category(((1 << Character.SPACE_SEPARATOR) |
                                  (1 << Character.LINE_SEPARATOR) |
                                  (1 << Character.PARAGRAPH_SEPARATOR)));
            case "C" -> category(((1 << Character.CONTROL) |
                                  (1 << Character.FORMAT) |
                                  (1 << Character.PRIVATE_USE) |
                                  (1 << Character.SURROGATE) |
                                  (1 << Character.UNASSIGNED)));
            case "P" -> category(((1 << Character.DASH_PUNCTUATION) |
                                  (1 << Character.START_PUNCTUATION) |
                                  (1 << Character.END_PUNCTUATION) |
                                  (1 << Character.CONNECTOR_PUNCTUATION) |
                                  (1 << Character.OTHER_PUNCTUATION) |
                                  (1 << Character.INITIAL_QUOTE_PUNCTUATION) |
                                  (1 << Character.FINAL_QUOTE_PUNCTUATION)));
            case "S" -> category(((1 << Character.MATH_SYMBOL) |
                                  (1 << Character.CURRENCY_SYMBOL) |
                                  (1 << Character.MODIFIER_SYMBOL) |
                                  (1 << Character.OTHER_SYMBOL)));
            case "LC" -> category(((1 << Character.UPPERCASE_LETTER) |
                                   (1 << Character.LOWERCASE_LETTER) |
                                   (1 << Character.TITLECASE_LETTER)));
            case "LD" -> category(((1 << Character.UPPERCASE_LETTER) |
                                   (1 << Character.LOWERCASE_LETTER) |
                                   (1 << Character.TITLECASE_LETTER) |
                                   (1 << Character.MODIFIER_LETTER) |
                                   (1 << Character.OTHER_LETTER) |
                                   (1 << Character.DECIMAL_DIGIT_NUMBER)));
            case "L1" -> range(0x00, 0xFF);
            case "all" -> Pattern.ALL();
            case "ASCII" -> range(0x00, 0x7F);
            case "Alnum" -> ctype(ASCII.ALNUM);
            case "Alpha" -> ctype(ASCII.ALPHA);
            case "Blank" -> ctype(ASCII.BLANK);
            case "Cntrl" -> ctype(ASCII.CNTRL);
            case "Digit" -> range('0', '9');
            case "Graph" -> ctype(ASCII.GRAPH);
            case "Lower" -> caseIns ? ctype(ASCII.ALPHA)
                                    : range('a', 'z');
            case "Print" -> range(0x20, 0x7E);
            case "Punct" -> ctype(ASCII.PUNCT);
            case "Space" -> ctype(ASCII.SPACE);
            case "Upper" -> caseIns ? ctype(ASCII.ALPHA)
                                    : range('A', 'Z');
            case "XDigit" -> ctype(ASCII.XDIGIT);
            case "javaLowerCase" -> caseIns ? c -> Character.isLowerCase(c) ||
                                                   Character.isUpperCase(c) ||
                                                   Character.isTitleCase(c)
                                            : Character::isLowerCase;
            case "javaUpperCase" -> caseIns ? c -> Character.isUpperCase(c) ||
                                                   Character.isLowerCase(c) ||
                                                   Character.isTitleCase(c)
                                            : Character::isUpperCase;
            case "javaAlphabetic" -> Character::isAlphabetic;
            case "javaIdeographic" -> SlNorm.no("isIdeographic");
            case "javaTitleCase" -> caseIns ? c -> Character.isTitleCase(c) ||
                                                   Character.isLowerCase(c) ||
                                                   Character.isUpperCase(c)
                                            : Character::isTitleCase;
            case "javaDigit" -> Character::isDigit;
            case "javaDefined" -> Character::isDefined;
            case "javaLetter" -> Character::isLetter;
            case "javaLetterOrDigit" -> Character::isLetterOrDigit;
            case "javaJavaIdentifierStart" -> Character::isJavaIdentifierStart;
            case "javaJavaIdentifierPart" -> Character::isJavaIdentifierPart;
            case "javaUnicodeIdentifierStart" -> Character::isUnicodeIdentifierStart;
            case "javaUnicodeIdentifierPart" -> Character::isUnicodeIdentifierPart;
            case "javaIdentifierIgnorable" -> Character::isIdentifierIgnorable;
            case "javaSpaceChar" -> Character::isSpaceChar;
            case "javaWhitespace" -> Character::isWhitespace;
            case "javaISOControl" -> Character::isISOControl;
            case "javaMirrored" -> SlNorm.no("isMirrored");
            default -> null;
        };
    }
    private static Pattern.CharPredicate category(final int typeMask) {
        return ch -> (typeMask & (1 << Character.getType(ch))) != 0;
    }
    private static Pattern.CharPredicate range(final int lower, final int upper) {
        return (Pattern.BmpCharPredicate)ch -> lower <= ch && ch <= upper;
    }
    private static Pattern.CharPredicate ctype(final int ctype) {
        return (Pattern.BmpCharPredicate)ch -> ch < 128 && ASCII.isType(ch, ctype);
    }
    static final Pattern.BmpCharPredicate ASCII_DIGIT() {
        return ch -> ch < 128 && ASCII.isDigit(ch);
    }
    static final Pattern.BmpCharPredicate ASCII_WORD() {
        return ch -> ch < 128 && ASCII.isWord(ch);
    }
    static final Pattern.BmpCharPredicate ASCII_SPACE() {
        return ch -> ch < 128 && ASCII.isSpace(ch);
    }
    static final Pattern.CharPredicate EMOJI() {
        return SlNorm.no("isEmoji");
    }
    static final Pattern.CharPredicate EMOJI_PRESENTATION() {
        return SlNorm.no("isEmojiPresentation");
    }
    static final Pattern.CharPredicate EMOJI_MODIFIER() {
        return SlNorm.no("isEmojiModifier");
    }
    static final Pattern.CharPredicate EMOJI_MODIFIER_BASE() {
        return SlNorm.no("isEmojiModifierBase");
    }
    static final Pattern.CharPredicate EMOJI_COMPONENT() {
        return SlNorm.no("isEmojiComponent");
    }
    static final Pattern.CharPredicate EXTENDED_PICTOGRAPHIC() {
        return SlNorm.no("isExtendedPictographic");
    }
}
class IntHashSet {
    private int[] entries;
    private int[] hashes;
    private int pos = 0;
    public IntHashSet() {
        this.entries = new int[16 << 1];
        this.hashes = new int[(16 / 2) | 1];
        Arrays.fill(this.entries, -1);
        Arrays.fill(this.hashes, -1);
    }
    public boolean contains(int i) {
        int h = hashes[i % hashes.length];
        while (h != -1) {
            if (entries[h] == i)
                return true;
            h = entries[h + 1];
        }
        return false;
    }
    public void add(int i) {
        int h0 = i % hashes.length;
        int next = hashes[h0];
        int next0 = next;
        while (next0 != -1) {
            if (entries[next0 ] == i)
                return;
            next0 = entries[next0 + 1];
        }
        hashes[h0] = pos;
        entries[pos++] = i;
        entries[pos++] = next;
        if (pos == entries.length)
            expand();
    }
    public void clear() {
        Arrays.fill(this.entries, -1);
        Arrays.fill(this.hashes, -1);
        pos = 0;
    }
    private void expand() {
        int[] old = entries;
        int[] es = new int[old.length << 1];
        int hlen = (old.length / 2) | 1;
        int[] hs = new int[hlen];
        Arrays.fill(es, -1);
        Arrays.fill(hs, -1);
        for (int n = 0; n < pos;) {
            int i = old[n];
            int hsh = i % hlen;
            int next = hs[hsh];
            hs[hsh] = n;
            es[n++] = i;
            es[n++] = next;
        }
        this.entries = es;
        this.hashes = hs;
    }
}
final class Grapheme {
    public static int nextBoundary(CharSequence src, int off, int limit) {
        Objects.checkFromToIndex(off, limit, src.length());
        int ch0 = Character.codePointAt(src, off);
        int ret = off + Character.charCount(ch0);
        int t0 = getType(ch0);
        int riCount = t0 == RI ? 1 : 0;
        boolean gb11 = t0 == EXTENDED_PICTOGRAPHIC;
        while (ret < limit) {
            int ch1 = Character.codePointAt(src, ret);
            int t1 = getType(ch1);
            if (gb11 && t0 == ZWJ && t1 == EXTENDED_PICTOGRAPHIC) {
            } else if (riCount % 2 == 1 && t0 == RI && t1 == RI) {
            } else if (rules[t0][t1]) {
                if (ret > off) {
                    break;
                } else {
                    gb11 = t1 == EXTENDED_PICTOGRAPHIC;
                    riCount = 0;
                }
            }
            riCount += (t1 == RI) ? 1 : 0;
            t0 = t1;
            ret += Character.charCount(ch1);
        }
        return ret;
    }
    private static final int OTHER = 0;
    private static final int CR = 1;
    private static final int LF = 2;
    private static final int CONTROL = 3;
    private static final int EXTEND = 4;
    private static final int ZWJ = 5;
    private static final int RI = 6;
    private static final int PREPEND = 7;
    private static final int SPACINGMARK = 8;
    private static final int L = 9;
    private static final int V = 10;
    private static final int T = 11;
    private static final int LV = 12;
    private static final int LVT = 13;
    private static final int EXTENDED_PICTOGRAPHIC = 14;
    private static final int FIRST_TYPE = 0;
    private static final int LAST_TYPE = 14;
    private static final boolean[][] rules;
    static {
        rules = new boolean[LAST_TYPE + 1][LAST_TYPE + 1];
        for (int i = FIRST_TYPE; i <= LAST_TYPE; i++)
            for (int j = FIRST_TYPE; j <= LAST_TYPE; j++)
                rules[i][j] = true;
        rules[L][L] = false;
        rules[L][V] = false;
        rules[L][LV] = false;
        rules[L][LVT] = false;
        rules[LV][V] = false;
        rules[LV][T] = false;
        rules[V][V] = false;
        rules[V][T] = false;
        rules[LVT][T] = false;
        rules[T][T] = false;
        for (int i = FIRST_TYPE; i <= LAST_TYPE; i++) {
            rules[i][EXTEND] = false;
            rules[i][ZWJ] = false;
            rules[i][SPACINGMARK] = false;
            rules[PREPEND][i] = false;
        }
        for (int i = FIRST_TYPE; i <= LAST_TYPE; i++)
            for (int j = CR; j <= CONTROL; j++) {
                rules[i][j] = true;
                rules[j][i] = true;
            }
        rules[CR][LF] = false;
        rules[EXTENDED_PICTOGRAPHIC][EXTEND] = false;
        rules[EXTENDED_PICTOGRAPHIC][ZWJ] = false;
    }
    private static final int SYLLABLE_BASE = 0xAC00;
    private static final int LCOUNT = 19;
    private static final int VCOUNT = 21;
    private static final int TCOUNT = 28;
    private static final int NCOUNT = VCOUNT * TCOUNT;
    private static final int SCOUNT = LCOUNT * NCOUNT;
    static boolean isExcludedSpacingMark(int cp) {
       return  cp == 0x102B || cp == 0x102C || cp == 0x1038 ||
               cp >= 0x1062 && cp <= 0x1064 ||
               cp >= 0x1067 && cp <= 0x106D ||
               cp == 0x1083 ||
               cp >= 0x1087 && cp <= 0x108C ||
               cp == 0x108F ||
               cp >= 0x109A && cp <= 0x109C ||
               cp == 0x1A61 || cp == 0x1A63 || cp == 0x1A64 ||
               cp == 0xAA7B || cp == 0xAA7D;
    }
    @SuppressWarnings("fallthrough")
    static int getType(int cp) {
        if (cp < 0x007F) {
            if (cp < 32) {
                if (cp == 0x000D)
                    return CR;
                if (cp == 0x000A)
                    return LF;
                return CONTROL;
            }
            return OTHER;
        }
        if (false) {
            return EXTENDED_PICTOGRAPHIC;
        }
        int type = Character.getType(cp);
        switch(type) {
        case Character.UNASSIGNED:
            if (cp == 0x0378)
                return OTHER;
        case Character.CONTROL:
        case Character.LINE_SEPARATOR:
        case Character.PARAGRAPH_SEPARATOR:
        case Character.SURROGATE:
            return CONTROL;
        case Character.FORMAT:
            if (cp == 0x200C ||
                cp >= 0xE0020 && cp <= 0xE007F)
                return EXTEND;
            if (cp == 0x200D)
                return ZWJ;
            if (cp >= 0x0600 && cp <= 0x0605 ||
                cp == 0x06DD || cp == 0x070F ||
                cp == 0x0890 || cp == 0x0891 ||
                cp == 0x08E2 || cp == 0x110BD || cp == 0x110CD)
                return PREPEND;
            return CONTROL;
        case Character.NON_SPACING_MARK:
        case Character.ENCLOSING_MARK:
            return EXTEND;
        case  Character.COMBINING_SPACING_MARK:
            if (isExcludedSpacingMark(cp))
                return OTHER;
            return SPACINGMARK;
        case Character.OTHER_SYMBOL:
            if (cp >= 0x1F1E6 && cp <= 0x1F1FF)
                return RI;
            return OTHER;
        case Character.MODIFIER_LETTER:
        case Character.MODIFIER_SYMBOL:
            if (cp == 0xFF9E || cp == 0xFF9F ||
                cp >= 0x1F3FB && cp <= 0x1F3FF)
                return EXTEND;
            return OTHER;
        case Character.OTHER_LETTER:
            if (cp == 0x0E33 || cp == 0x0EB3)
                return SPACINGMARK;
            if (cp >= 0x1100 && cp <= 0x11FF) {
                if (cp <= 0x115F)
                    return L;
                if (cp <= 0x11A7)
                    return V;
                return T;
            }
            int sindex = cp - SYLLABLE_BASE;
            if (sindex >= 0 && sindex < SCOUNT) {
                if (sindex % TCOUNT == 0)
                    return LV;
                return LVT;
            }
            if (cp >= 0xA960 && cp <= 0xA97C)
                return L;
            if (cp >= 0xD7B0 && cp <= 0xD7C6)
                return V;
            if (cp >= 0xD7CB && cp <= 0xD7FB)
                return T;
            switch (cp) {
                case 0x0D4E:
                case 0x111C2:
                case 0x111C3:
                case 0x1193F:
                case 0x11941:
                case 0x11A3A:
                case 0x11A84:
                case 0x11A85:
                case 0x11A86:
                case 0x11A87:
                case 0x11A88:
                case 0x11A89:
                case 0x11D46:
                case 0x11F02:
                    return PREPEND;
            }
        }
        return OTHER;
    }
}
final class SlNorm {
  static Pattern.CharPredicate no(String q){ return ch -> { throw new UnsupportedOperationException("SL_NO_DISPONIBLE " + q); }; } static String normalize(CharSequence s, Object f){ return s.toString(); } }
