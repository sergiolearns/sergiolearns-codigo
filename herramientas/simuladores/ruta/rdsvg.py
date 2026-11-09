"""rd(): la ruta de datos monociclo de MIPS (apuntes, T5) dibujada en SVG con la marca de SergioLearns, al estilo de la
figura del examen (Patterson y Hennessy), ES y EN. Reutilizable en el tema 10.
  rd(name, lang, hl=None, show=None, sig=None, vals=None, mods=(), legend=True, title=..., desc=..., cap=...)
  - hl:   conjunto de cables y bloques que recorre una instrucción (coral; lo demás, gris claro).
  - show: si se da, solo se dibujan esos cables y bloques (rutas individuales y montaje por partes).
  - sig:  valores de las señales de control ({'RegDst': '1', ...}) junto a su nombre.
  - vals: etiquetas con el valor de un cable: {'clave': (x, y, 'texto')}.
  - mods: ampliaciones: 'link' (jal: muxes Link para $ra y PC + 4) y 'bne' (señal BranchNE con Zero negado);
    tema 10: 'uc' (la unidad de control principal dibujada, con op = [31-26] de entrada) y 'ext3' (unidad de
    extensión de tres modos con la señal ExtOp: signo, ceros o parte alta, para ori y lui; leyenda 11 = or).
Letra mínima 12,5 (13-16 en casi todo). El SVG mide unos 910 de ancho: en pantallas estrechas va dentro de un
contenedor con desplazamiento horizontal (min-width 760 px) para que los rótulos no se encojan."""
import html
from svg import T, R, INK, INK2, MUTED, SOFT, LINE, PAPER, WHITE, VIOLET, CORAL, CORALT, GREEN, BLUE, RED, AMBER, SANS, MONO, HEAD, save

e = lambda s: html.escape(str(s), quote=True)
FADE = '#CFCBDC'; FADETXT = '#ADA9BF'; HLC = CORAL; HLF = '#FFE9E3'; CF = '#F1EEFF'; SIGC = VIOLET
FS = 13.5   # rótulos de los puertos
TX = {
 'im': ('Memoria de', 'Instruction'), 'im2': ('instrucciones', 'memory'), 'rf': ('Banco de registros', 'Registers'),
 'dm': ('Memoria', 'Data'), 'dm2': ('de datos', 'memory'), 'se': ('Extensión', 'Sign-'), 'se2': ('de signo', 'extend'),
 'sh': ('Desplaz.', 'Shift'), 'sh2': ('izq. 2', 'left 2'), 'aluc': ('Control', 'ALU'), 'aluc2': ('ALU', 'control'),
 'r1': ('Registro|lectura 1', 'Read|register 1'), 'r2': ('Registro|lectura 2', 'Read|register 2'),
 'wr': ('Registro|a escribir', 'Write|register'), 'wd': ('Dato|a escribir', 'Write|data'),
 'd1': ('Dato|leído 1', 'Read|data 1'), 'd2': ('Dato|leído 2', 'Read|data 2'), 'dir': ('Dirección', 'Address'),
 'dl': ('Dato|leído', 'Read|data'), 'de': ('Dato|a escribir', 'Write|data'), 'ins': ('Instrucción', 'Instruction'),
 'rir': ('Dirección|a leer', 'Read|address'), 'res': ('Resultado', 'Result'),
 'f2521': ('[25-21] rs', '[25-21] rs'), 'f2016': ('[20-16] rt', '[20-16] rt'), 'f1511': ('[15-11] rd', '[15-11] rd'),
 'f150': ('[15-0]', '[15-0]'), 'f50': ('[5-0] funct', '[5-0] funct'), 'f250': ('[25-0]', '[25-0]'),
 'jaddr': ('Dirección de salto [31-0]', 'Jump address [31-0]'), 'pc428': ('PC + 4 [31-28]', 'PC + 4 [31-28]'),
 'leg': ('ALUOp', 'ALUOp'), 'l00': ('00  sumar', '00  add'), 'l01': ('01  restar', '01  subtract'),
 'l10': ('10  según funct', '10  from funct'), 'l11': ('11  sin usar', '11  unused'), 'l11s': ('11  slt (slti)', '11  slt (slti)'),
 'l11o': ('11  or (ori)', '11  or (ori)'), 'ext': ('Extensión', 'Extend'), 'ext2': ('3 modos', '3 modes'),
 'uc': ('Control', 'Control'), 'ucop': ('[31-26] op', '[31-26] op'), 'ucs': ('señales en violeta', 'signals in violet'),
}

WIRES = {
 'loop':      [(814, 138), (892, 138), (892, 14), (8, 14), (8, 335), (16, 335)],
 'pc':        [(56, 335), (80, 335)],
 'pc_add':    [(68, 335), (68, 112), (110, 112)],
 'four':      [(100, 168), (110, 168)],
 'pc4':       [(160, 140), (730, 140)],
 'pc4_top':   [(470, 140), (470, 46)],
 'pc4_add2':  [(600, 140), (600, 196), (640, 196)],
 'inst':      [(200, 355), (224, 355)],
 'bus':       [(224, 46), (224, 560)],
 'f250':      [(224, 46), (286, 46)],
 'jaddr':     [(374, 46), (774, 46), (774, 104), (790, 104)],
 'f2521':     [(224, 304), (340, 304)],
 'f2016':     [(224, 344), (340, 344)],
 'f2016_dst': [(292, 344), (292, 372), (306, 372)],
 'f1511':     [(224, 408), (306, 408)],
 'regdst_out':[(326, 390), (340, 390)],
 'f150':      [(224, 510), (372, 510)],
 'f50':       [(224, 560), (556, 560), (556, 520), (575, 520)],
 'rd1':       [(510, 328), (590, 328)],
 'rd2':       [(510, 400), (546, 400)],
 'rd2_mem':   [(520, 400), (520, 476), (700, 476)],
 'ext':       [(468, 510), (532, 510), (532, 440)],
 'ext_mux':   [(532, 440), (546, 440)],
 'ext_up':    [(532, 440), (532, 236), (540, 236)],
 'sh2b_out':  [(620, 236), (640, 236)],
 'add2_out':  [(690, 216), (710, 216), (710, 190), (730, 190)],
 'alusrc_out':[(568, 420), (590, 420)],
 'aluctl':    [(625, 494), (625, 434)],
 'alures':    [(660, 405), (680, 405)],
 'alures_mem':[(680, 405), (700, 405)],
 'alures_byp':[(680, 405), (680, 530), (840, 530), (840, 450), (850, 450)],
 'zero':      [(660, 345), (676, 345), (676, 290), (700, 290)],
 'memrd':     [(820, 392), (850, 392)],
 'wb':        [(872, 421), (884, 421), (884, 580), (332, 580), (332, 430), (340, 430)],
 'pcsrc_out': [(754, 165), (790, 165)],
 'andout':    [(728, 282), (742, 282), (742, 210)],
}
EXTRA_W = {'pc4_back': [(160, 140), (250, 140), (250, 14), (8, 14), (8, 335), (16, 335)]}
ARROWLESS = {'bus', 'alures', 'ext', 'zero2', 'and1o', 'and2o', 'pc4_top'}
JUNCT = {'pc_add': (68, 335), 'pc4_top': (470, 140), 'pc4_add2': (600, 140), 'f2521': (224, 304), 'f2016': (224, 344),
         'f2016_dst': (292, 344), 'f1511': (224, 408), 'f150': (224, 510), 'rd2_mem': (520, 400), 'ext_mux': (532, 440),
         'alures_mem': (680, 405), 'f250': (224, 46), 'f50': (224, 560), 'pc4_link': (600, 140), 'zero2': (676, 328)}

BADGE = {'pc_add': (68, 230), 'pc4': (300, 140), 'rd1': (550, 328), 'alusrc_out': (579, 420), 'ext': (500, 510),
         'alures': (680, 470), 'alures_mem': (689, 392), 'memrd': (835, 392), 'rd2_mem': (610, 476), 'wb': (600, 580), 'regdst_out': (333, 390),
         'zero': (676, 318), 'add2_out': (700, 216), 'jaddr': (620, 46), 'pcsrc_out': (772, 165), 'loop': (892, 80),
         'f150': (300, 510), 'sh2b_out': (630, 236), 'f250': (264, 46), 'inst': (212, 355), 'f2521': (300, 304), 'f2016': (300, 344),
         'f1511': (262, 408)}

def mux(x, y, w, h, i0, i1, top='0'):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{w / 2}" fill="{{F}}" stroke="{{S}}" stroke-width="1.5"/>'
            + f'<text x="{x + w / 2}" y="{i0 + 4.5}" font-family="{SANS}" font-size="12.5" font-weight="700" fill="{{TC}}" text-anchor="middle">{top}</text>'
            + f'<text x="{x + w / 2}" y="{i1 + 4.5}" font-family="{SANS}" font-size="12.5" font-weight="700" fill="{{TC}}" text-anchor="middle">{"1" if top == "0" else "0"}</text>')

def alu_shape(x, y, w, h):
    n = h * 0.115
    pts = [(x, y), (x + w, y + h * 0.25), (x + w, y + h * 0.75), (x, y + h), (x, y + h / 2 + n), (x + 14, y + h / 2), (x, y + h / 2 - n)]
    return '<polygon points="' + ' '.join(f'{a:.1f},{b:.1f}' for a, b in pts) + '" fill="{F}" stroke="{S}" stroke-width="1.5"/>'

def blocks(L, mods):
    t = lambda k: TX[k][0 if L == 'es' else 1]
    def two(x, y, txt, anc, size=FS, w=400):   # rótulo en dos líneas centrado en el puerto
        a, b = txt.split('|')
        return T(x, y - 3, a, size, '{TC}', SANS, w, anc) + T(x, y + 12, b, size, '{TC}', SANS, w, anc)
    B = {
     'pc': R(16, 300, 40, 70, fill='{F}', stroke='{S}', rx=4) + T(36, 340, 'PC', 15, '{TC}', HEAD, 700),
     'im': R(80, 290, 120, 130, fill='{F}', stroke='{S}', rx=4) + two(86, 335, t('rir'), 'start')
           + T(194, 372, t('ins'), FS, '{TC}', SANS, 400, 'end') + two(140, 400, t('im') + '|' + t('im2'), 'middle', 14, 700),
     'add1': alu_shape(110, 90, 50, 100) + T(140, 145, 'Add', 14, '{TC}', SANS, 700) + T(96, 173, '4', 14, '{TC}', MONO, 700, 'end'),
     'rf': R(340, 290, 170, 180, fill='{F}', stroke='{S}', rx=4) + T(425, 462, t('rf'), 14, '{TC}', SANS, 700)
           + two(346, 304, t('r1'), 'start') + two(346, 344, t('r2'), 'start') + two(346, 390, t('wr'), 'start')
           + two(346, 430, t('wd'), 'start') + two(504, 328, t('d1'), 'end') + two(504, 400, t('d2'), 'end'),
     'regdst': mux(306, 360, 20, 60, 372, 408),
     'se': f'<ellipse cx="420" cy="510" rx="48" ry="28" fill="{{F}}" stroke="{{S}}" stroke-width="1.5"/>'
           + T(420, 506, t('se'), 13, '{TC}', SANS, 700) + T(420, 521, t('se2'), 13, '{TC}', SANS, 700)
           + T(356, 502, '16', 12.5, '{TC}', MONO, 400) + T(490, 502, '32', 12.5, '{TC}', MONO, 400),
     'alusrc': mux(546, 384, 22, 72, 400, 440),
     'alu': alu_shape(590, 296, 70, 156) + T(624, 381, 'ALU', 16, '{TC}', HEAD, 700)
            + T(655, 350, 'Zero', 12.5, '{TC}', SANS, 400, 'end') + T(655, 409, t('res'), 12.5, '{TC}', SANS, 400, 'end'),
     'aluc': f'<ellipse cx="625" cy="520" rx="50" ry="26" fill="{{F}}" stroke="{{S}}" stroke-width="1.5"/>'
             + T(625, 516, t('aluc'), 13, '{TC}', SANS, 700) + T(625, 531, t('aluc2'), 13, '{TC}', SANS, 700),
     'dm': R(700, 360, 120, 140, fill='{F}', stroke='{S}', rx=4) + T(706, 409, t('dir'), FS, '{TC}', SANS, 400, 'start')
           + two(814, 392, t('dl'), 'end') + two(706, 476, t('de'), 'start') + two(760, 447, t('dm') + '|' + t('dm2'), 'middle', 14, 700),
     'mtr': mux(850, 376, 22, 90, 392, 450, '1'),
     'sh2b': f'<ellipse cx="580" cy="236" rx="40" ry="20" fill="{{F}}" stroke="{{S}}" stroke-width="1.5"/>'
             + T(580, 233, t('sh'), 12.5, '{TC}', SANS, 700) + T(580, 247, t('sh2'), 12.5, '{TC}', SANS, 700),
     'add2': alu_shape(640, 176, 50, 80) + T(670, 221, 'Add', 14, '{TC}', SANS, 700),
     'pcsrc': mux(730, 120, 24, 90, 140, 190),
     'and': '<path d="M700,268 h14 a14,14 0 0 1 0,28 h-14 z" fill="{F}" stroke="{S}" stroke-width="1.5"/>',
     'sh2j': f'<ellipse cx="330" cy="46" rx="44" ry="20" fill="{{F}}" stroke="{{S}}" stroke-width="1.5"/>'
             + T(330, 43, t('sh'), 12.5, '{TC}', SANS, 700) + T(330, 57, t('sh2'), 12.5, '{TC}', SANS, 700)
             + T(268, 68, '26', 12.5, '{TC}', MONO, 400) + T(392, 68, '28', 12.5, '{TC}', MONO, 400),
     'jmux': mux(790, 86, 24, 104, 104, 165, '1'),
    }
    if 'link' in mods:
        B['regdst'] = mux(270, 360, 20, 60, 372, 408)
        B['link1'] = mux(306, 366, 20, 60, 380, 412)
        B['c31'] = T(296, 466, '31', 13, '{TC}', MONO, 700)
        B['link2'] = mux(892, 404, 20, 66, 421, 456)
    if 'ext3' in mods:
        B['se'] = (f'<ellipse cx="420" cy="510" rx="48" ry="28" fill="{{F}}" stroke="{{S}}" stroke-width="1.5"/>'
                   + T(420, 506, t('ext'), 13, '{TC}', SANS, 700) + T(420, 521, t('ext2'), 13, '{TC}', SANS, 700)
                   + T(356, 502, '16', 12.5, '{TC}', MONO, 400) + T(490, 502, '32', 12.5, '{TC}', MONO, 400))
    if 'uc' in mods:
        B['uc'] = (f'<ellipse cx="292" cy="214" rx="50" ry="30" fill="{{F}}" stroke="{{S}}" stroke-width="1.8"/>'
                   + T(292, 219, t('uc'), 15, '{TC}', HEAD, 700))
    if 'bne' in mods:
        B['and2'] = ('<path d="M700,306 h14 a14,14 0 0 1 0,28 h-14 z" fill="{F}" stroke="{S}" stroke-width="1.5"/>'
                     '<circle cx="696.5" cy="328" r="3.5" fill="{F}" stroke="{S}" stroke-width="1.3"/>')
        B['or'] = '<path d="M742,272 q12,0 26,30 q-14,30 -26,30 q9,-30 0,-60 z" fill="{F}" stroke="{S}" stroke-width="1.5"/>'
    return B

# señales: nombre → (x, y del texto, puntos del trazo discontinuo hasta el bloque, ancla)
SIGS = {
 'RegDst':   (232, 452, [(316, 420), (316, 438)], 'start'),
 'RegWrite': (425, 280, [(425, 283), (425, 290)], 'middle'),
 'ALUSrc':   (570, 372, [(557, 376), (557, 384)], 'end'),
 'ALUOp':    (690, 552, [(668, 536), (686, 546)], 'start'),
 'MemWrite': (788, 350, [(790, 353), (790, 360)], 'end'),
 'MemRead':  (760, 520, [(760, 500), (760, 508)], 'middle'),
 'MemtoReg': (898, 366, [(861, 369), (861, 376)], 'end'),
 'Branch':   (694, 278, [(694, 274), (700, 274)], 'end'),
 'Jump':     (810, 78, [(802, 79), (802, 86)], 'start'),
}
PATH = {
 'fetch': {'pc', 'im', 'pc_add', 'four', 'add1', 'inst', 'pc4', 'pcsrc', 'pcsrc_out', 'jmux', 'loop', 'bus'},
 'R':   {'f2521', 'f2016', 'f1511', 'regdst', 'regdst_out', 'rf', 'rd1', 'rd2', 'alusrc', 'alusrc_out', 'alu', 'aluc', 'aluctl',
         'f50', 'alures', 'alures_byp', 'mtr', 'wb'},
 'lw':  {'f2521', 'f2016', 'f2016_dst', 'regdst', 'regdst_out', 'rf', 'rd1', 'f150', 'se', 'ext', 'ext_mux', 'alusrc', 'alusrc_out',
         'alu', 'aluc', 'aluctl', 'alures', 'alures_mem', 'dm', 'memrd', 'mtr', 'wb'},
 'sw':  {'f2521', 'f2016', 'rf', 'rd1', 'rd2', 'rd2_mem', 'f150', 'se', 'ext', 'ext_mux', 'alusrc', 'alusrc_out', 'alu', 'aluc',
         'aluctl', 'alures', 'alures_mem', 'dm'},
 'beq': {'f2521', 'f2016', 'rf', 'rd1', 'rd2', 'alusrc', 'alusrc_out', 'alu', 'aluc', 'aluctl', 'zero', 'and', 'andout', 'f150', 'se',
         'ext', 'ext_up', 'sh2b', 'sh2b_out', 'add2', 'add2_out', 'pc4_add2'},
 'j':   {'pc', 'im', 'pc_add', 'four', 'add1', 'inst', 'bus', 'f250', 'sh2j', 'jaddr', 'pc4', 'pc4_top', 'jmux', 'loop'},
}
for k in ('R', 'lw', 'sw', 'beq'):
    PATH[k] |= PATH['fetch']
PATH['bne'] = PATH['beq'] | {'and2', 'or', 'zero2', 'and1o', 'and2o'}
PATH['slti'] = (PATH['lw'] - {'alures_mem', 'dm', 'memrd'}) | {'alures_byp'}
PATH['jal'] = PATH['j'] | {'link1', 'c31', 'link_reg', 'rf', 'link2', 'wb2', 'pc4_link', 'mtrlink'}

def rd(name, lang, hl=None, show=None, sig=None, vals=None, mods=(), legend=True, title='', desc='', cap='', extra='', h=600, w=910):
    L = lang; t = lambda k: TX[k][0 if L == 'es' else 1]
    W = dict(WIRES); J = dict(JUNCT)
    W.update({k: v for k, v in EXTRA_W.items() if show and k in show})
    if 'link' in mods:
        w = max(w, 932)
        W['f2016_dst'] = [(256, 344), (256, 372), (270, 372)]; J['f2016_dst'] = (256, 344)
        W['f1511'] = [(224, 408), (270, 408)]
        W['regdst_out'] = [(290, 390), (298, 390), (298, 380), (306, 380)]
        W['c31'] = [(296, 452), (296, 412), (306, 412)]
        W['link_reg'] = [(326, 396), (333, 396), (333, 390), (340, 390)]
        W.pop('wb'); W['mtrlink'] = [(872, 421), (892, 421)]
        W['wb2'] = [(912, 438), (922, 438), (922, 580), (332, 580), (332, 430), (340, 430)]
        W['pc4_link'] = [(600, 140), (600, 70), (878, 70), (878, 456), (892, 456)]
    if 'bne' in mods:
        W['zero2'] = [(676, 328), (693, 328)]
        W['and1o'] = [(728, 282), (746, 282)]
        W['and2o'] = [(728, 320), (746, 320)]
        W['andout'] = [(768, 302), (780, 302), (780, 226), (742, 226), (742, 210)]
    B = blocks(L, mods)
    vis = lambda k: show is None or k in show
    defs = '<defs>' + ''.join(f'<marker id="{name}-a{i}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{c}"/></marker>'
                              for i, c in enumerate((INK2, FADE, HLC))) + '</defs>'
    body = ''
    for k in sorted(W, key=lambda k: (hl is not None and k in hl)):   # lo resaltado, encima
        if not vis(k): continue
        on = hl is not None and k in hl
        c = INK2 if hl is None else (HLC if on else FADE); wd = 2.8 if on else 1.6; mi = 0 if hl is None else (2 if on else 1)
        arr = '' if k in ARROWLESS else f' marker-end="url(#{name}-a{mi})"'
        body += f'<polyline points="{" ".join(f"{a},{b}" for a, b in W[k])}" fill="none" stroke="{c}" stroke-width="{wd}" stroke-linejoin="round"{arr}/>'
        if k in J: body += f'<circle cx="{J[k][0]}" cy="{J[k][1]}" r="3.5" fill="{c}"/>'
    ftxt = lambda k: FADETXT if hl is not None and k not in hl else INK2
    labs = [('f2521', 230, 297), ('f2016', 230, 337), ('f1511', 230, 401), ('f150', 230, 503), ('f50', 230, 553), ('f250', 230, 31)]
    for k, x, y in labs:
        if vis(k):
            s = t(k).split()[-1] if ('link' in mods and k in ('f2016', 'f1511')) else t(k)
            body += T(x, y, s, 12.5, ftxt(k), SANS, 600, 'start')
    if vis('jaddr'): body += T(600, 36, t('jaddr'), 13, ftxt('jaddr'), SANS, 400)
    if vis('pc4_top'): body += T(478, 98, t('pc428'), 13, ftxt('pc4_top'), SANS, 400, 'start')
    for k, s in B.items():
        if not vis(k): continue
        if hl is None: F, S, TC = CF, INK2, INK
        elif k in hl: F, S, TC = HLF, HLC, INK
        else: F, S, TC = '#F7F6FA', FADE, FADETXT
        if k in ('regdst', 'alusrc', 'mtr', 'pcsrc', 'jmux', 'link1', 'link2') and (hl is None or k not in hl): F = WHITE
        body += s.replace('{F}', F).replace('{S}', S).replace('{TC}', TC)
    sigs = dict(SIGS)
    if 'link' in mods:
        sigs['RegDst'] = (232, 452, [(280, 420), (280, 438)], 'start')
        sigs['Link'] = (902, 396, [(902, 398), (902, 404)], 'middle')
        sigs['MemtoReg'] = (846, 490, [(861, 466), (861, 478)], 'start')
        sigs['Link '] = (316, 356, [(316, 359), (316, 366)], 'middle')
    if 'ext3' in mods:
        sigs['ExtOp'] = (476, 545, [(458, 528), (472, 537)], 'start')
    if 'bne' in mods:
        sigs['BranchNE'] = (694, 318, [(694, 314), (700, 312)], 'end')
    owner = {'RegDst': 'regdst', 'RegWrite': 'rf', 'ALUSrc': 'alusrc', 'ALUOp': 'aluc', 'MemWrite': 'dm', 'MemRead': 'dm',
             'MemtoReg': 'mtr', 'Branch': 'and', 'Jump': 'jmux', 'Link': 'link2', 'Link ': 'link1', 'BranchNE': 'and2', 'ExtOp': 'se'}
    for s, (x, y, pts, anc) in sigs.items():
        if not vis(owner[s]): continue
        nm = s.strip()
        txt = f'{nm} = {sig[nm]}' if sig and nm in sig else nm
        col = CORALT if sig and nm in sig and sig[nm] not in ('0', '00', 'X', 'XX') else SIGC
        body += f'<polyline points="{" ".join(f"{a},{b}" for a, b in pts)}" fill="none" stroke="{SIGC}" stroke-width="1.4" stroke-dasharray="3 2"/>'
        body += T(x, y, txt, 13, col, MONO, 700, anc)
    for k, v in (vals or {}).items():   # número en un círculo sobre el cable (el valor va en una tabla del artículo)
        if isinstance(v, tuple):
            x, y, v = v; wv = len(v) * 8 + 12
            body += R(x - wv / 2, y - 13, wv, 20, fill=INK, stroke=INK, rx=5, sw=1) + T(x, y + 2, v, 13, WHITE, MONO, 700)
        else:
            x, y = BADGE[k]
            body += f'<circle cx="{x}" cy="{y}" r="10.5" fill="{INK}" stroke="{WHITE}" stroke-width="1.5"/>' + T(x, y + 4.5, v, 12.5, WHITE, SANS, 700)
    if legend:
        body += R(16, 444, 176, 106, fill=WHITE, stroke=LINE, rx=8) + T(28, 466, t('leg'), 14, INK, MONO, 700, 'start')
        for i, k in enumerate(('l00', 'l01', 'l10', 'l11s' if 'slti' in mods else ('l11o' if 'ext3' in mods else 'l11'))):
            body += T(28, 486 + i * 17, t(k), 13, INK2, MONO, 400, 'start')
    if 'uc' in mods and vis('uc'):   # op entra por la izquierda desde el bus; las señales salen hacia la derecha
        c = INK2 if hl is None else HLC
        body += f'<polyline points="224,214 238,214" fill="none" stroke="{c}" stroke-width="2.2" marker-end="url(#{name}-a{0 if hl is None else 2})"/>'
        body += f'<circle cx="224" cy="214" r="3.5" fill="{c}"/>' + T(232, 178, t('ucop'), 12.5, ftxt('uc'), SANS, 600, 'start')
        for k in range(4):
            yy = 200 + k * 9
            body += f'<polyline points="342,{yy} 372,{yy}" fill="none" stroke="{SIGC}" stroke-width="1.6" stroke-dasharray="3 2" marker-end="url(#{name}-a0)"/>'
        body += T(292, 262, t('ucs'), 12.5, SIGC, SANS, 700)
    body += extra
    svg = (f'<svg viewBox="0 0 {w} {h}" width="100%" role="img" aria-labelledby="{name}-t {name}-d" xmlns="http://www.w3.org/2000/svg" '
           f'style="display:block;min-width:760px;max-width:{w}px;height:auto;margin:0 auto"><title id="{name}-t">{e(title)}</title><desc id="{name}-d">{e(desc)}</desc>{defs}'
           f'{R(0.75, 0.75, w - 1.5, h - 1.5, fill=PAPER, stroke=LINE, rx=16)}{body}</svg>')
    capt = f'<figcaption style="margin-top:10px;font-size:14px;line-height:1.5;color:{SOFT};text-align:center">{e(cap)}</figcaption>'
    return f'<figure class="sl-diagram" style="margin:32px 0"><div style="overflow-x:auto;-webkit-overflow-scrolling:touch">{svg}</div>{capt}</figure>'

if __name__ == '__main__':
    for L in ('es', 'en'):
        save('t-rd', L, rd('t-rd-' + L, L, title='RD', desc='d', cap='c'))
        save('t-lw', L, rd('t-lw-' + L, L, hl=PATH['lw'], sig={'RegDst': '0', 'ALUSrc': '1', 'MemtoReg': '1', 'RegWrite': '1', 'MemRead': '1', 'MemWrite': '0', 'Branch': '0', 'ALUOp': '00', 'Jump': '0'},
                            vals={'rd1': (550, 318, '0x10010000'), 'alures': (690, 380, '0x10010008')}, title='lw', desc='d', cap='c'))
        save('t-link', L, rd('t-link-' + L, L, hl=PATH['jal'], mods=('link',), title='jal', desc='d', cap='c'))
        save('t-bne', L, rd('t-bne-' + L, L, hl=PATH['bne'], mods=('bne',), title='bne', desc='d', cap='c'))


# ------------------------------------------------------------------ tema 11: la ruta de datos SEGMENTADA
# rdseg(name, lang, stages=None, hl=(), path=None, regs=True, title, desc, cap)
#  - stages: {'IF': 'lw $t0, 0($s0)', ...} escribe encima de cada etapa la instrucción que hay en ella (diagrama de un ciclo).
#  - hl:     etapas cuyo fondo se tiñe de coral (la etapa que se explica).
#  - path:   'lw' pinta en coral los cables que usa lw; None, todos en tinta.
#  - regs:   False quita los registros de segmentación (la RD monociclo cortada en etapas).
# El número del registro destino viaja con la instrucción por los cuatro registros (línea de abajo), como en la versión
# corregida del libro. El salto se decide al final de EX/MEM en el dibujo (primera versión del libro); el texto lo explica.
SEGX = {'IF': (14, 222), 'ID': (240, 448), 'EX': (466, 670), 'MEM': (688, 852), 'WB': (870, 966)}
SEGR = {'IF/ID': 224, 'ID/EX': 450, 'EX/MEM': 672, 'MEM/WB': 854}
SEGW = {
 'pcsrc_pc': [(42, 232), (54, 232)], 'pc_im': [(92, 232), (102, 232)], 'pc_add': [(97, 232), (97, 130), (112, 130)],
 'four': [(100, 162), (112, 162)], 'add_ifid': [(160, 146), (224, 146)], 'add_back': [(190, 146), (190, 96), (12, 96), (12, 214), (22, 214)],
 'im_ifid': [(214, 232), (224, 232)],
 'ifid_pc4': [(238, 146), (450, 146)], 'bus': [(238, 232), (252, 232), (252, 404)],
 'rs': [(252, 196), (276, 196)], 'rt': [(252, 228), (276, 228)], 'imm': [(252, 370), (298, 370)], 'rd': [(252, 404), (450, 404)],
 'rd1': [(406, 196), (450, 196)], 'rd2': [(406, 262), (450, 262)], 'se_idex': [(396, 370), (450, 370)],
 'idex_pc4': [(464, 146), (596, 146)], 'idex_a': [(464, 196), (584, 196)], 'idex_b': [(464, 262), (528, 262)],
 'idex_imm': [(464, 370), (504, 370), (504, 290), (528, 290)], 'imm_sh': [(504, 370), (504, 110), (510, 110)],
 'sh_add': [(590, 110), (596, 110)], 'b_mem': [(516, 262), (516, 316), (672, 316)],
 'mux_alu': [(548, 276), (584, 276)], 'add_exmem': [(644, 128), (672, 128)], 'alu_exmem': [(640, 236), (672, 236)],
 'rd_ex': [(464, 404), (672, 404)],
 'exmem_br': [(686, 128), (700, 128), (700, 40), (8, 40), (8, 250), (22, 250)],
 'exmem_addr': [(686, 236), (712, 236)], 'exmem_wd': [(686, 316), (700, 316), (700, 292), (712, 292)],
 'byp': [(694, 236), (694, 352), (854, 352)], 'rd_mem': [(686, 404), (854, 404)],
 'dm_memwb': [(832, 252), (854, 252)],
 'memwb_dm': [(868, 252), (884, 252)], 'memwb_byp': [(868, 352), (876, 352), (876, 280), (884, 280)],
 'wb_back': [(904, 266), (940, 266), (940, 440), (262, 440), (262, 300), (276, 300)],
 'rd_back': [(868, 404), (928, 404), (928, 426), (268, 426), (268, 266), (276, 266)],
}
SEGPATH = {'lw': {'pcsrc_pc', 'pc_im', 'pc_add', 'four', 'add_ifid', 'add_back', 'im_ifid', 'bus', 'rs', 'imm', 'rd', 'rd1',
                  'se_idex', 'idex_a', 'idex_imm', 'mux_alu', 'alu_exmem', 'rd_ex', 'exmem_addr', 'rd_mem', 'dm_memwb',
                  'memwb_dm', 'wb_back', 'rd_back'}}
SEGTX = {'im': (['Memoria de', 'instrucciones'], ['Instruction', 'memory']), 'rf': (['Banco de', 'registros'], ['Registers', '']),
         'se': (['Extensión', 'de signo'], ['Sign-', 'extend']), 'sh': (['Desplaz.', 'izq. 2'], ['Shift', 'left 2']),
         'dm': (['Memoria', 'de datos'], ['Data', 'memory']), 'stage': {'IF': ('IF: buscar', 'IF: fetch'), 'ID': ('ID: decodificar y leer', 'ID: decode and read'),
         'EX': ('EX: ejecutar', 'EX: execute'), 'MEM': ('MEM: memoria', 'MEM: memory'), 'WB': ('WB', 'WB')},
         'r1': ('Reg. 1', 'Read reg 1'), 'r2': ('Reg. 2', 'Read reg 2'), 'wr': ('Reg. escr.', 'Write reg'), 'wd': ('Dato escr.', 'Write data'),
         'd1': ('Dato 1', 'Data 1'), 'd2': ('Dato 2', 'Data 2'), 'dir': ('Dirección', 'Address'), 'dl': ('Dato leído', 'Read data'),
         'de': ('Dato escr.', 'Write data'), 'rdt': ('rd / rt', 'rd / rt')}


def rdseg(name, lang, stages=None, hl=(), path=None, regs=True, title='', desc='', cap=''):
    from svg import ML, wrap as _w, marker
    L = 0 if lang == 'es' else 1
    pick = lambda t: t[L]
    W, H = 980, 470
    on = SEGPATH.get(path) if path else None
    b = ''
    for st, (x0, x1) in SEGX.items():   # bandas de las etapas
        lit = st in hl
        b += R(x0, 52, x1 - x0, 400, fill='#FFF4F0' if lit else '#FFFFFF', stroke='#FFD2C6' if lit else LINE, rx=8, sw=1)
        b += T((x0 + x1) / 2, 72, pick(SEGTX['stage'][st]) if st != 'WB' else 'WB', 15.5, CORALT if lit else MUTED, SANS, 700)
        if stages and st in stages:
            b += R(x0 + 2, 5, x1 - x0 - 4, 27, fill=INK, stroke=INK, rx=6)
            b += T((x0 + x1) / 2, 24, stages[st], 15, '#FFFFFF', MONO, 600)
    if regs:
        for nm, x in SEGR.items():
            b += R(x, 84, 14, 360, fill='#A99EF5', stroke=VIOLET, rx=3, sw=1.2)
            b += f'<text x="{x + 7}" y="250" font-family="{MONO}" font-size="15" font-weight="700" fill="{INK}" text-anchor="middle" transform="rotate(-90 {x + 7} 250)">{nm}</text>'
    def wire(k):
        pts = SEGW[k]
        if not regs:   # sin registros, los cables cruzan de largo
            pass
        c = (CORAL if (on and k in on) else ('#CFCBDC' if on else INK2))
        w = 2.4 if (on and k in on) else 1.6
        arrow = k not in ('bus', 'byp', 'add_back', 'exmem_br')
        mk = f' marker-end="url(#{name}-{lang}-ah-{"FF6B4A" if c == CORAL else "5A566E"})"' if arrow else ''
        return f'<polyline points="{" ".join(f"{x},{y}" for x, y in pts)}" fill="none" stroke="{c}" stroke-width="{w}"{mk}/>'
    for k in SEGW:
        b += wire(k)
    fade = lambda keys: (on is not None) and not (set(keys) & on)
    def box(x, y, w, h, lines, keys, fill='#F1EEFF', rx=8):
        f = fade(keys)
        return R(x, y, w, h, fill='#F7F6FA' if f else fill, stroke='#CFCBDC' if f else VIOLET, rx=rx) + \
               ML(x + w / 2, y + h / 2, [l for l in lines if l], 16, FADETXT if f else INK, SANS, 700, lh=19)
    def mux(x, y, h, keys):
        f = fade(keys)
        return R(x, y, 20, h, fill='#F7F6FA' if f else '#FFFFFF', stroke='#CFCBDC' if f else INK2, rx=10) + T(x + 10, y + h / 2 + 5, 'M', 14, FADETXT if f else INK2, SANS, 700)
    def adder(x, y, txt, keys):
        f = fade(keys)
        return R(x, y, 48, 52, fill='#F7F6FA' if f else '#FFFFFF', stroke='#CFCBDC' if f else INK2, rx=6) + T(x + 24, y + 31, txt, 14, FADETXT if f else INK, SANS, 700)
    b += mux(22, 200, 64, {'pcsrc_pc'})
    b += box(54, 210, 38, 44, ['PC'], {'pc_im'}, '#FFFFFF')
    b += T(96, 168, '4', 15, INK2, MONO, 700, 'end') + adder(112, 120, '+', {'add_ifid'})
    b += box(102, 186, 116, 92, pick(SEGTX['im']), {'im_ifid'})
    b += box(276, 176, 130, 144, pick(SEGTX['rf']), {'rd1'})
    b += T(256, 190, 'rs', 14.5, INK2, MONO, 700, 'start') + T(256, 222, 'rt', 14.5, INK2, MONO, 700, 'start') + T(256, 394, pick(SEGTX['rdt']), 14.5, INK2, MONO, 700, 'start')
    b += box(298, 346, 98, 48, pick(SEGTX['se']), {'se_idex'}, '#FDF1DC')
    b += box(510, 86, 80, 48, pick(SEGTX['sh']), {'sh_add'}, '#FDF1DC')
    b += adder(596, 102, '+', {'add_exmem'})
    b += mux(528, 248, 56, {'mux_alu'})
    falu = fade({'alu_exmem'})
    b += (f'<path d="M584,176 L640,206 L640,266 L584,296 L584,252 L596,236 L584,220 Z" fill="{"#F7F6FA" if falu else "#FFE9E3"}" '
          f'stroke="{"#CFCBDC" if falu else CORAL}" stroke-width="1.6"/>') + T(618, 242, 'ALU', 16, FADETXT if falu else INK, SANS, 700)
    b += box(712, 206, 120, 110, pick(SEGTX['dm']), {'dm_memwb'})
    b += mux(884, 234, 64, {'wb_back'})
    defs = '<defs>' + marker(f'{name}-{lang}', CORAL) + marker(f'{name}-{lang}', MUTED) + '</defs>'
    svg = (f'<svg viewBox="0 0 {W} {H}" width="100%" role="img" aria-labelledby="{name}-{lang}-t {name}-{lang}-d" xmlns="http://www.w3.org/2000/svg" '
           f'style="display:block;min-width:760px;max-width:{W}px;height:auto;margin:0 auto"><title id="{name}-{lang}-t">{e(title)}</title>'
           f'<desc id="{name}-{lang}-d">{e(desc)}</desc>{defs}{R(0.75, 0.75, W - 1.5, H - 1.5, fill=PAPER, stroke=LINE, rx=16)}{b}</svg>')
    capt = f'<figcaption style="margin-top:10px;font-size:14px;line-height:1.5;color:{SOFT};text-align:center">{e(cap)}</figcaption>'
    return ('<figure class="sl-diagram" style="margin:32px 0"><div style="overflow-x:auto;-webkit-overflow-scrolling:touch">'
            + svg + '</div>' + capt + '</figure>')
