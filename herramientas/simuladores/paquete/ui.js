/* SergioLearns — interfaz de «El viaje de un paquete» (.sl-sim[data-sim="paquete"]). Necesita kit.js y engine.js. */
(function () {
  'use strict';
  var K6 = window.SL6K, ico = K6.ico, esc = K6.esc, fill = K6.fill;
  var C = { data: '#A99EF5', l4: '#2F5FD0', ip: '#16794B', eth: '#FF6B4A', bits: '#5B4BDB' }, INK = { data: 1, eth: 1, fcs: 1 };
  var hex = function (n) { return '0x' + ('0000' + n.toString(16)).slice(-4); };
  var TX = {
    es: {
      title: 'sergio@learns: ~/laboratorio/simuladores', ps: 'sergio@learns:~/laboratorio/simuladores$', cmd: 'envia', mo: '--modelo', da: '--datos', ms: '--mss', udp: '--udp', fT: 'practica.pdf', fU: 'consulta.dns', fR: 'reto.pdf',
      modelL: 'Modelo', protoL: 'Transporte', datosL: 'Datos (B)', mssL: 'MSS', ex: 'Ejemplo', rnd: 'Aleatorio', share: 'Compartir',
      desc: { tcp: 'TCP: entrega fiable y ordenada; trocea los datos en segmentos de como mucho el MSS (1460 B en Ethernet). Es lo que usa HTTPS para subir tu práctica al campus.', udp: 'UDP: sin conexión ni troceo, solo 8 B de cabecera; si el datagrama no cabe en una trama, lo trocea IP (fragmentación). Ejemplo: una consulta DNS al puerto 53.' },
      segs: 'segmentos', segsU: 'fragmentos', steps: 'paso a paso', enc: 'encapsulado del trozo {n}', route: 'el viaje', results: 'resultados', who: 'quién lee qué',
      th: { n: 'nº', sec: 'sec', off: 'desp.', mf: 'MF', data: 'datos', seg: 'segm.', dg: 'datag.', fr: 'trama', bits: 'bits' },
      L: { app: 'Aplicación', pres: 'Presentación', ses: 'Sesión', tr: 'Transporte', inet: 'Internet', red: 'Red', acc: 'Acceso a la red', enl: 'Enlace de datos', fis: 'Física' },
      pdu: { app: 'Datos', tr: 'Segmento', trU: 'Datagrama UDP', inet: 'Datagrama', red: 'Paquete', acc: 'Trama', fis: 'Bits' },
      noHdr: 'sin cabecera propia en Internet', dataW: 'Datos', fcs: 'FCS', pad: 'relleno',
      nodes: [['Portátil', '10.110.7.24'], ['Switch', 'aula 7'], ['Router', 'facultad'], ['Router', 'CPD del campus'], ['Servidor', '10.200.1.80']],
      wire: 'en este tramo', mac: 'MAC', ttl: 'TTL', sum: 'suma IP',
      start: 'Pulsa Paso para bajar capa a capa y seguir el viaje, o Ejecutar para verlo entero.',
      e: {
        app: 'Aplicación ({ap}): entrega {d} B de datos.',
        pres: 'Presentación: en OSI daría formato a los datos y los cifraría. En Internet no tiene cabecera propia: lo hace la aplicación (en HTTPS, TLS).',
        ses: 'Sesión: en OSI organizaría el diálogo entre los dos extremos. En TCP/IP tampoco tiene cabecera propia.',
        tcp: 'Transporte (TCP): trocea los {d} B en {k} {seg} de como mucho {mss} B (el MSS) y a cada uno le pone 20 B de cabecera: puertos {sp} → {dp}, número de secuencia y suma de comprobación. Este trozo: {x} + 20 = <b>{s} B</b> (segmento).',
        udp: 'Transporte (UDP): no trocea. Añade 8 B de cabecera (puertos {sp} → {dp}, longitud y suma): {d} + 8 = <b>{s} B</b>.',
        ip: 'Internet (IP): añade 20 B con las direcciones {src} → {dst}, el TTL {ttl} y el protocolo {pr}: <b>{g} B</b> (datagrama).',
        ipF: ' El datagrama UDP ({u} B + 20) no cabe en la MTU de Ethernet (1500 B): IP lo parte en {k} fragmentos de como mucho 1480 B, con el mismo identificador, el desplazamiento en unidades de 8 B y el bit MF (quedan más). Este es el fragmento {n}: desplazamiento {o} (= {ob} B), MF = {mf}.',
        eth: 'Acceso a la red (Ethernet): añade 14 B delante (MAC de destino <b>{md}</b>, que es la del router y no la del servidor; MAC de origen y tipo 0x0800) y 4 B de FCS detrás{pad}: <b>{f} B</b> (trama).',
        padT: '; la carga es menor de 46 B, así que se rellena con {p} B',
        fis: 'Física: la trama sale como <b>{b} bits</b> por el cable (o por el aire).',
        sw: 'Switch del aula: solo abre hasta la capa 2. Mira la MAC de destino ({md}), la busca en su tabla y saca la trama por el puerto del router. No cambia nada.',
        r1: 'Router de la facultad: quita Ethernet y mira la IP de destino, {dst}. No es de su red 10.110.7.0/24, así que la manda al router del campus. Resta 1 al TTL ({t1} → {t2}), recalcula la suma de la cabecera ({s1} → {s2}) y pone Ethernet nueva: {m1} → {m2}.',
        r2: 'Router del CPD: {dst} está en su red 10.200.1.0/24 → entrega directa al servidor (antes, ARP le da su MAC). TTL {t1} → {t2}, suma {s1} → {s2} y Ethernet nueva: {m1} → {m2}.',
        srv: 'Servidor: la MAC es la suya, la IP es la suya y el puerto {dp} es el de {ap}. Quita las cabeceras capa a capa y entrega {x} B a la aplicación.',
        srvT: ' Con los {k} segmentos, TCP los ordena por el número de secuencia y reconstruye los {d} B.', srvF: ' Antes, IP junta los {k} fragmentos (mismo identificador) y se los da a UDP.',
        end: 'Total: {k} {tramas}, {t} B en el cable para {d} B de datos. Las cabeceras son {h} B ({p} %).'
      },
      seg1: 'segmento', segN: 'segmentos', tr1: 'trama', trN: 'tramas',
      res: { tot: 'bytes en el cable', head: 'cabeceras (y relleno)', pct: 'parte de cabeceras', frames: 'tramas', bits: 'bits en total' },
      whoR: [['Switch', 'MAC de destino', 'capa 2: decide el puerto de salida en la LAN'], ['Router', 'IP de destino', 'capa 3: decide la red siguiente y resta 1 al TTL'], ['Servidor', 'puerto de destino', 'capa 4: a qué aplicación se entrega']],
      fl: {
        tcp: [['Puerto de origen', '{sp}'], ['Puerto de destino', '{dp} (HTTPS)'], ['Número de secuencia', '{sec} (relativo: primer byte del trozo)'], ['Número de acuse', '1 (relativo)'], ['Longitud de cabecera', '5 × 4 = 20 B'], ['Indicadores', '{fl}'], ['Ventana', '64240'], ['Suma de comprobación', 'cabecera + datos'], ['Puntero urgente', '0']],
        udp: [['Puerto de origen', '{sp}'], ['Puerto de destino', '{dp} (DNS)'], ['Longitud', '{u} B'], ['Suma de comprobación', 'cabecera + datos']],
        ip: [['Versión', '4'], ['Longitud de cabecera (IHL)', '5 × 4 = 20 B'], ['Tipo de servicio', '0'], ['Longitud total', '{g} B'], ['Identificación', '{id}'], ['Indicadores', 'DF = {df}, MF = {mf}'], ['Desplazamiento', '{off}'], ['TTL', '{ttl}'], ['Protocolo', '{pr}'], ['Suma de la cabecera', '{sum}'], ['IP de origen', '{src}'], ['IP de destino', '{dst}']],
        eth: [['MAC de destino', '{md}'], ['MAC de origen', '{mo}'], ['Tipo', '0x0800 (IPv4)']],
        fcs: [['FCS', 'CRC-32, 4 B']], data: [['Datos', '{x} B']], bits: [['Bits', '{b}']], pad: [['Relleno', '{p} B a cero']]
      },
      fn: { tcp: 'Cabecera TCP · 20 B', udp: 'Cabecera UDP · 8 B', ip: 'Cabecera IP · 20 B', eth: 'Cabecera Ethernet · 14 B', fcs: 'Cola Ethernet · 4 B', data: 'Datos', bits: 'Física', pad: 'Relleno' },
      fp: { tcp: 'La lee el servidor: el puerto dice a qué aplicación va; la secuencia, en qué orden se juntan los trozos.', udp: 'La lee el servidor: el puerto dice a qué aplicación va. Sin secuencia ni acuses: si se pierde, se pierde.', ip: 'La lee cada router: con la IP de destino decide la red siguiente. Cada router resta 1 al TTL y recalcula la suma (es la real de esta cabecera).', eth: 'La lee el switch y el siguiente salto: solo vale para un tramo de la LAN. Cada router la quita y pone una nueva.', fcs: 'El receptor recalcula el CRC de toda la trama y, si no coincide, la descarta.', data: 'Lo que la aplicación quiere mandar. No cambia en ninguna capa: solo crecen los sobres.', bits: 'Lo que viaja de verdad: unos y ceros (sin contar el preámbulo).', pad: 'Ethernet exige al menos 46 B de carga: si falta, se rellena.' },
      rules: 'Cabeceras mínimas (sin opciones): TCP 20 B, UDP 8 B, IP 20 B y Ethernet 14 B + 4 B de FCS, sin preámbulo; MTU de 1500 B. Números de secuencia relativos (empiezan en 1). Las MAC, el CPD y el puerto de origen son de ejemplo; las IP son las de la teoría. La suma de comprobación IP es la de verdad para esta cabecera.',
      gDesc: 'Encapsulado del trozo {n}: {rows}.',
      reto: 'Reto: haz tú las cuentas', retoLead: 'Te doy unos datos y un MSS (TCP sobre Ethernet). Calcula en papel y rellena las casillas; luego di qué mira cada aparato.',
      rf: { k: 'número de segmentos', last: 'datos del último segmento (B)', lf: 'tamaño de la última trama (B)', tot: 'bytes en el cable' },
      opts: ['MAC de destino', 'IP de destino', 'puerto de destino'], ask: '¿Qué mira…?', who3: ['el switch', 'el router', 'el servidor'], choose: 'elige',
      allOk: 'Todo bien. Así se hace en el examen.', someBad: 'Revisa lo que está en rojo: el error más común es olvidar que Ethernet suma 18 B (14 delante y 4 de FCS detrás).', got: '{a} de {n} bien'
    },
    en: {
      title: 'sergio@learns: ~/lab/simulators', ps: 'sergio@learns:~/lab/simulators$', cmd: 'send', mo: '--model', da: '--data', ms: '--mss', udp: '--udp', fT: 'assignment.pdf', fU: 'query.dns', fR: 'challenge.pdf',
      modelL: 'Model', protoL: 'Transport', datosL: 'Data (B)', mssL: 'MSS', ex: 'Example', rnd: 'Random', share: 'Share',
      desc: { tcp: 'TCP: reliable, ordered delivery; it splits the data into segments of at most the MSS (1460 B on Ethernet). It is what HTTPS uses to upload your assignment to the campus site.', udp: 'UDP: no connection and no splitting, just an 8 B header; if the datagram does not fit in a frame, IP splits it (fragmentation). Example: a DNS query to port 53.' },
      segs: 'segments', segsU: 'fragments', steps: 'step by step', enc: 'encapsulation of piece {n}', route: 'the journey', results: 'results', who: 'who reads what',
      th: { n: 'no.', sec: 'seq', off: 'off.', mf: 'MF', data: 'data', seg: 'segm.', dg: 'datag.', fr: 'frame', bits: 'bits' },
      L: { app: 'Application', pres: 'Presentation', ses: 'Session', tr: 'Transport', inet: 'Internet', red: 'Network', acc: 'Network access', enl: 'Data link', fis: 'Physical' },
      pdu: { app: 'Data', tr: 'Segment', trU: 'UDP datagram', inet: 'Datagram', red: 'Packet', acc: 'Frame', fis: 'Bits' },
      noHdr: 'no header of its own on the Internet', dataW: 'Data', fcs: 'FCS', pad: 'padding',
      nodes: [['Laptop', '10.110.7.24'], ['Switch', 'room 7'], ['Router', 'faculty'], ['Router', 'campus data centre'], ['Server', '10.200.1.80']],
      wire: 'on this link', mac: 'MAC', ttl: 'TTL', sum: 'IP checksum',
      start: 'Press Step to go down layer by layer and follow the journey, or Run to watch it all.',
      e: {
        app: 'Application ({ap}): hands over {d} B of data.',
        pres: 'Presentation: in OSI it would format and encrypt the data. On the Internet it has no header of its own: the application does it (in HTTPS, TLS).',
        ses: 'Session: in OSI it would organise the dialogue between both ends. In TCP/IP it has no header of its own either.',
        tcp: 'Transport (TCP): splits the {d} B into {k} {seg} of at most {mss} B (the MSS) and gives each one a 20 B header: ports {sp} → {dp}, sequence number and checksum. This piece: {x} + 20 = <b>{s} B</b> (segment).',
        udp: 'Transport (UDP): no splitting. It adds an 8 B header (ports {sp} → {dp}, length and checksum): {d} + 8 = <b>{s} B</b>.',
        ip: 'Internet (IP): adds 20 B with the addresses {src} → {dst}, TTL {ttl} and protocol {pr}: <b>{g} B</b> (datagram).',
        ipF: ' The UDP datagram ({u} B + 20) does not fit in the Ethernet MTU (1500 B): IP splits it into {k} fragments of at most 1480 B, with the same identification, the offset in 8-byte units and the MF bit (more to come). This is fragment {n}: offset {o} (= {ob} B), MF = {mf}.',
        eth: 'Network access (Ethernet): adds 14 B in front (destination MAC <b>{md}</b>, the router’s and not the server’s; source MAC and type 0x0800) and a 4 B FCS at the end{pad}: <b>{f} B</b> (frame).',
        padT: '; the payload is under 46 B, so {p} B of padding are added',
        fis: 'Physical: the frame leaves as <b>{b} bits</b> on the cable (or over the air).',
        sw: 'Classroom switch: it only opens up to layer 2. It reads the destination MAC ({md}), looks it up in its table and sends the frame out of the router’s port. It changes nothing.',
        r1: 'Faculty router: removes Ethernet and reads the destination IP, {dst}. It is not on its network 10.110.7.0/24, so it sends it to the campus router. It subtracts 1 from the TTL ({t1} → {t2}), recalculates the header checksum ({s1} → {s2}) and adds a new Ethernet header: {m1} → {m2}.',
        r2: 'Data centre router: {dst} is on its network 10.200.1.0/24 → direct delivery to the server (ARP gives it the MAC first). TTL {t1} → {t2}, checksum {s1} → {s2} and a new Ethernet header: {m1} → {m2}.',
        srv: 'Server: the MAC is its own, the IP is its own and port {dp} is {ap}. It removes the headers layer by layer and hands {x} B to the application.',
        srvT: ' With the {k} segments, TCP orders them by sequence number and rebuilds the {d} B.', srvF: ' First, IP puts the {k} fragments back together (same identification) and hands them to UDP.',
        end: 'Total: {k} {tramas}, {t} B on the cable for {d} B of data. The headers take {h} B ({p} %).'
      },
      seg1: 'segment', segN: 'segments', tr1: 'frame', trN: 'frames',
      res: { tot: 'bytes on the cable', head: 'headers (and padding)', pct: 'header share', frames: 'frames', bits: 'bits in total' },
      whoR: [['Switch', 'destination MAC', 'layer 2: picks the output port on the LAN'], ['Router', 'destination IP', 'layer 3: picks the next network and subtracts 1 from the TTL'], ['Server', 'destination port', 'layer 4: which application gets it']],
      fl: {
        tcp: [['Source port', '{sp}'], ['Destination port', '{dp} (HTTPS)'], ['Sequence number', '{sec} (relative: first byte of the piece)'], ['Acknowledgement number', '1 (relative)'], ['Header length', '5 × 4 = 20 B'], ['Flags', '{fl}'], ['Window', '64240'], ['Checksum', 'header + data'], ['Urgent pointer', '0']],
        udp: [['Source port', '{sp}'], ['Destination port', '{dp} (DNS)'], ['Length', '{u} B'], ['Checksum', 'header + data']],
        ip: [['Version', '4'], ['Header length (IHL)', '5 × 4 = 20 B'], ['Type of service', '0'], ['Total length', '{g} B'], ['Identification', '{id}'], ['Flags', 'DF = {df}, MF = {mf}'], ['Fragment offset', '{off}'], ['TTL', '{ttl}'], ['Protocol', '{pr}'], ['Header checksum', '{sum}'], ['Source IP', '{src}'], ['Destination IP', '{dst}']],
        eth: [['Destination MAC', '{md}'], ['Source MAC', '{mo}'], ['Type', '0x0800 (IPv4)']],
        fcs: [['FCS', 'CRC-32, 4 B']], data: [['Data', '{x} B']], bits: [['Bits', '{b}']], pad: [['Padding', '{p} B of zeros']]
      },
      fn: { tcp: 'TCP header · 20 B', udp: 'UDP header · 8 B', ip: 'IP header · 20 B', eth: 'Ethernet header · 14 B', fcs: 'Ethernet trailer · 4 B', data: 'Data', bits: 'Physical', pad: 'Padding' },
      fp: { tcp: 'Read by the server: the port says which application it goes to; the sequence number, in which order the pieces fit together.', udp: 'Read by the server: the port says which application it goes to. No sequence or acknowledgements: if it gets lost, it is lost.', ip: 'Read by every router: the destination IP decides the next network. Each router subtracts 1 from the TTL and recalculates the checksum (this is the real one for this header).', eth: 'Read by the switch and the next hop: it is only valid for one LAN link. Every router removes it and adds a new one.', fcs: 'The receiver recalculates the CRC of the whole frame and drops it if it does not match.', data: 'What the application wants to send. It never changes in any layer: only the envelopes grow.', bits: 'What really travels: ones and zeros (not counting the preamble).', pad: 'Ethernet needs at least 46 B of payload: if there is less, it is padded.' },
      rules: 'Minimum headers (no options): TCP 20 B, UDP 8 B, IP 20 B and Ethernet 14 B + a 4 B FCS, no preamble; 1500 B MTU. Relative sequence numbers (they start at 1). The MACs, the data centre and the source port are examples; the IPs are the ones from the theory article. The IP checksum is the real one for this header.',
      gDesc: 'Encapsulation of piece {n}: {rows}.',
      reto: 'Challenge: do the maths yourself', retoLead: 'Here are some data and an MSS (TCP over Ethernet). Work it out on paper and fill in the boxes; then say what each device reads.',
      rf: { k: 'number of segments', last: 'data in the last segment (B)', lf: 'size of the last frame (B)', tot: 'bytes on the cable' },
      opts: ['destination MAC', 'destination IP', 'destination port'], ask: 'What does … read?', who3: ['the switch', 'the router', 'the server'], choose: 'choose',
      allOk: 'All correct. That is exactly how the exam goes.', someBad: 'Check what is in red: the most common mistake is forgetting that Ethernet adds 18 B (14 in front and a 4 B FCS at the end).', got: '{a} of {n} right'
    }
  };
  function init(el) {
    var K = K6.mount(el, ''), t = TX[K.lang], L = K.lang, N = SLPaquete.NET;
    K.title = t.title;
    var S = { mo: 'tcpip', pr: 'tcp', d: 3000, mss: 1460, sel: 0 }, R = null, ST = [], FH = null;
    (function () { var s = K6.hashState() || K6.store('sl_sim_paquete'); if (!s) return; try { var o = {}; s.split(';').forEach(function (p) { var i = p.indexOf('='); o[p.slice(0, i)] = p.slice(i + 1); });
      if (/^(tcpip|osi)$/.test(o.m) && /^(tcp|udp)$/.test(o.p)) { S.mo = o.m; S.pr = o.p; S.d = clampD(+o.d || 3000); S.mss = Math.max(88, Math.min(1460, +o.s || 1460)); } } catch (e) {} })();
    function clampD(v) { return Math.max(1, Math.min(S.pr === 'udp' ? 9000 : 20000, Math.round(v) || 1)); }
    var enc = function () { return 'm=' + S.mo + ';p=' + S.pr + ';d=' + S.d + ';s=' + S.mss; };
    var seg2 = function (id, items, lab) { return '<div class="sl6-seg" role="group" aria-label="' + esc(lab) + '">' + items.map(function (x) { return '<button type="button" data-' + id + '="' + x[0] + '">' + esc(x[1]) + '</button>'; }).join('') + '</div>'; };
    var ctl = '<div class="sl6-ctl">' + seg2('mo', [['tcpip', 'TCP/IP'], ['osi', 'OSI']], t.modelL) + seg2('pr', [['tcp', 'TCP'], ['udp', 'UDP']], t.protoL)
      + '<div class="sl6-q sl6-pk-d"><span>' + esc(t.datosL) + '</span><button type="button" data-a="d-" aria-label="−100">−</button><input type="number" min="1" max="20000" inputmode="numeric" aria-label="' + esc(t.datosL) + '" style="width:72px!important"><button type="button" data-a="d+" aria-label="+100">+</button></div>'
      + '<div class="sl6-q sl6-pk-m"><span>' + esc(t.mssL) + '</span><input type="number" min="88" max="1460" inputmode="numeric" aria-label="' + esc(t.mssL) + '" style="width:64px!important"></div>'
      + '<div class="sl6-ctl__r"><button type="button" class="sl6-btn sl6-btn--g" data-a="ex">' + ico('file', 16) + esc(t.ex) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-a="rnd">' + ico('dice', 16) + esc(t.rnd) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-a="share">' + ico('link', 16) + '<span>' + esc(t.share) + '</span></button></div></div>';
    var body = ctl + '<p class="sl6-desc"></p>'
      + '<div class="sl6-top"><section class="sl6-pan"><h3 class="sl6-h sl6-pk-segh"></h3><div class="sl6-pk-segs sl6-res"></div></section><section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.steps) + '</h3>' + K6.toolsHTML(K) + '<ol class="sl6-log" aria-live="polite"></ol></section></div>'
      + '<section class="sl6-pan sl6-pan--gantt"><h3 class="sl6-h sl6-pk-ench"></h3><div class="sl6-pk-enc"><div class="sl6-pk-stack"></div><div class="sl6-pk-f" aria-live="polite"></div></div></section>'
      + '<section class="sl6-pan sl6-pan--gantt"><h3 class="sl6-h">── ' + esc(t.route) + '</h3><div class="sl6-pk-route"></div><p class="sl6-note sl6-pk-wire"></p></section>'
      + '<div class="sl6-bot"><section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.results) + '</h3><div class="sl6-pk-res"></div></section><section class="sl6-pan"><h3 class="sl6-h">── ' + esc(t.who) + '</h3><div class="sl6-pk-who"></div></section></div>'
      + '<p class="sl6-rules">' + esc(t.rules) + '</p>';
    el.innerHTML = K6.winHTML(K, t.ps, body) + K6.tryHTML(K);
    K6.themeBtn(K);
    var q = K.q, dIn = q('.sl6-pk-d input'), mIn = q('.sl6-pk-m input'), log = q('.sl6-log');
    function layers() { // capas de arriba abajo: id, nombre, nivel, paso en que aparece
      var tcp = S.pr === 'tcp';
      if (S.mo === 'osi') return [{ id: 'app', n: t.L.app, lv: 7 }, { id: 'pres', n: t.L.pres, lv: 6, none: 1 }, { id: 'ses', n: t.L.ses, lv: 5, none: 1 }, { id: 'tr', n: t.L.tr, lv: 4, pdu: tcp ? t.pdu.tr : t.pdu.trU }, { id: 'inet', n: t.L.red, lv: 3, pdu: t.pdu.red }, { id: 'acc', n: t.L.enl, lv: 2, pdu: t.pdu.acc }, { id: 'fis', n: t.L.fis, lv: 1, pdu: t.pdu.fis }];
      return [{ id: 'app', n: t.L.app, lv: 5 }, { id: 'tr', n: t.L.tr, lv: 4, pdu: tcp ? t.pdu.tr : t.pdu.trU }, { id: 'inet', n: t.L.inet, lv: 3, pdu: t.pdu.inet }, { id: 'acc', n: t.L.acc, lv: 2, pdu: t.pdu.acc }, { id: 'fis', n: t.L.fis, lv: 1, pdu: t.pdu.fis }];
    }
    var LINK = [{ s: N.pc.mac, d: N.fac.a, h: 0 }, { s: N.fac.b, d: N.cpd.a, h: 1 }, { s: N.cpd.b, d: N.srv.mac, h: 2 }];
    function buildSteps() {
      var e = t.e, r = R.rows[S.sel] || R.rows[0], tcp = R.tcp, k = R.rows.length, ap = tcp ? 'HTTPS' : 'DNS', a = [];
      var Ls = layers(), top = Ls[0].lv;
      Ls.forEach(function (l) {
        if (l.id === 'app') a.push({ k: 'enc', l: 'app', f: 'data', x: fill(e.app, { ap: ap, d: R.datos }) });
        else if (l.id === 'pres') a.push({ k: 'enc', l: 'pres', f: 'data', x: e.pres });
        else if (l.id === 'ses') a.push({ k: 'enc', l: 'ses', f: 'data', x: e.ses });
        else if (l.id === 'tr') a.push({ k: 'enc', l: 'tr', f: tcp ? 'tcp' : 'udp', x: tcp ? fill(e.tcp, { d: R.datos, k: k, seg: k === 1 ? t.seg1 : t.segN, mss: R.mss, sp: R.sport, dp: R.dport, x: r.data, s: r.seg }) : fill(e.udp, { sp: R.sport, dp: R.dport, d: R.datos, s: R.datos + 8 }) });
        else if (l.id === 'inet') a.push({ k: 'enc', l: 'inet', f: 'ip', x: fill(e.ip, { src: N.pc.ip, dst: N.srv.ip, ttl: R.ttl, pr: tcp ? '6 (TCP)' : '17 (UDP)', g: r.dgram }) + (R.frag ? fill(e.ipF, { u: R.datos + 8, k: k, n: r.n, o: r.off, ob: r.off * 8, mf: r.mf }) : '') });
        else if (l.id === 'acc') a.push({ k: 'enc', l: 'acc', f: 'eth', x: fill(e.eth, { md: N.fac.a, pad: r.pad ? fill(e.padT, { p: r.pad }) : '', f: r.frame }) });
        else a.push({ k: 'enc', l: 'fis', f: 'bits', x: fill(e.fis, { b: r.bits }) });
      });
      a.push({ k: 'hop', at: 1, lv: 2, link: 0, f: 'eth', x: fill(e.sw, { md: N.fac.a }) });
      a.push({ k: 'hop', at: 2, lv: 3, link: 1, f: 'ip', x: fill(e.r1, { dst: N.srv.ip, t1: r.ttls[0], t2: r.ttls[1], s1: hex(r.sums[0]), s2: hex(r.sums[1]), m1: N.fac.b, m2: N.cpd.a }) });
      a.push({ k: 'hop', at: 3, lv: 3, link: 2, f: 'ip', x: fill(e.r2, { dst: N.srv.ip, t1: r.ttls[1], t2: r.ttls[2], s1: hex(r.sums[1]), s2: hex(r.sums[2]), m1: N.cpd.b, m2: N.srv.mac }) });
      a.push({ k: 'hop', at: 4, lv: top, link: 2, f: tcp ? 'tcp' : 'udp', x: fill(e.srv, { dp: R.dport, ap: ap, x: tcp ? r.data : R.datos }) + (tcp && k > 1 ? fill(e.srvT, { k: k, d: R.datos }) : '') + (R.frag ? fill(e.srvF, { k: k }) : '') + '<br>' + fill(e.end, { k: k, tramas: k === 1 ? t.tr1 : t.trN, t: R.total, d: R.datos, h: R.head, p: K6.num(R.pct, L, 1) }) });
      return a;
    }
    function segTable() {
      var tcp = R.tcp, h = t.th;
      q('.sl6-pk-segh').textContent = '── ' + (R.frag ? t.segsU : t.segs) + ' (' + R.rows.length + ')';
      var head = '<tr><th scope="col">' + h.n + '</th>' + (tcp ? '<th scope="col">' + h.sec + '</th>' : '<th scope="col">' + h.off + '</th><th scope="col">' + h.mf + '</th>') + '<th scope="col">' + h.data + '</th><th scope="col">' + h.seg + '</th><th scope="col">' + h.dg + '</th><th scope="col">' + h.fr + '</th><th scope="col">' + h.bits + '</th></tr>';
      var b = R.rows.map(function (r, i) { return '<tr data-i="' + i + '" tabindex="0"' + (i === S.sel ? ' class="is-on" aria-current="true"' : '') + '><th scope="row">' + r.n + '</th>' + (tcp ? '<td>' + r.sec + '</td>' : '<td>' + r.off + '</td><td>' + r.mf + '</td>') + '<td>' + r.data + '</td><td>' + r.seg + '</td><td>' + r.dgram + '</td><td>' + r.frame + '</td><td>' + r.bits + '</td></tr>'; }).join('');
      q('.sl6-pk-segs').innerHTML = '<table><thead>' + head + '</thead><tbody>' + b + '</tbody></table>';
    }
    function stack() {
      var r = R.rows[S.sel], tcp = R.tcp, Ls = layers(), box = q('.sl6-pk-stack'), w = Math.max(280, box.clientWidth || 600), narrow = w < 520;
      var lw = narrow ? 0 : 136, rw = narrow ? 0 : 88, rh = narrow ? 52 : 36, bh = 24, W = w, x0 = lw, inner = W - lw - rw - 4, H = Ls.length * rh + 6, id = K.id;
      var hd = { l4: tcp ? 20 : 8 }, hw = narrow ? 40 : 54, fw = narrow ? 30 : 38;
      var desc = [], g = '<svg class="sl6-pk-g" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-labelledby="' + id + '-pt"><title id="' + id + '-pt"></title>';
      Ls.forEach(function (l, i) {
        var y = 4 + i * rh + (narrow ? 18 : (rh - bh) / 2), parts = [];
        if (l.id === 'app' || l.id === 'pres' || l.id === 'ses') parts = [];
        if (l.lv <= 4 && l.id !== 'fis') { if (r.hasL4) parts.push(['l4', tcp ? 'tcp' : 'udp', (tcp ? 'TCP' : 'UDP') + (narrow ? '' : ' ' + r.l4)]); }
        if (l.lv <= 3 && l.id !== 'fis') parts.unshift(['ip', 'ip', narrow ? 'IP' : 'IP 20']);
        if (l.lv === 2) parts.unshift(['eth', 'eth', narrow ? 'ETH' : 'ETH 14']);
        var tail = l.lv === 2 ? (r.pad ? [['pad', 'pad', '+' + r.pad], ['eth', 'fcs', 'FCS 4']] : [['eth', 'fcs', 'FCS 4']]) : [];
        var size = l.id === 'app' || l.none ? r.data : l.id === 'tr' ? r.seg : l.id === 'inet' ? r.dgram : l.id === 'acc' ? r.frame : r.bits;
        g += '<g class="sl6-pk-row" data-l="' + l.id + '" data-lv="' + l.lv + '">';
        if (narrow) g += '<text class="sl6-pk-l" x="0" y="' + (y - 6) + '">' + esc(l.n) + (l.pdu ? ' <tspan class="sl6-pk-l2">· ' + esc(l.pdu) + '</tspan>' : '') + '</text><text class="sl6-pk-sz" x="' + W + '" y="' + (y - 6) + '" text-anchor="end">' + (l.id === 'fis' ? size + ' bits' : size + ' B') + '</text>';
        else g += '<text class="sl6-pk-l" x="' + (lw - 12) + '" y="' + (y + bh / 2 - 1) + '" text-anchor="end">' + esc(l.n) + '</text>' + (l.pdu ? '<text class="sl6-pk-l2" x="' + (lw - 12) + '" y="' + (y + bh / 2 + 11) + '" text-anchor="end">' + esc(l.pdu) + '</text>' : '') + '<text class="sl6-pk-sz" x="' + (W - 2) + '" y="' + (y + bh / 2 + 4) + '" text-anchor="end">' + (l.id === 'fis' ? size + ' bits' : size + ' B') + '</text>';
        if (l.id === 'fis') {
          var bits = '', seed = r.frame * 7 + 3; for (var b = 0; b < 80; b++) { seed = (seed * 1103515245 + 12345) & 0x7fffffff; bits += (seed >> 16) & 1; if (b % 8 === 7) bits += ' '; }
          g += '<rect class="sl6-pk-box" data-h="bits" x="' + x0 + '" y="' + y + '" width="' + inner + '" height="' + bh + '" rx="5" fill="' + C.bits + '" fill-opacity=".18"/><text class="sl6-pk-bits" x="' + (x0 + 8) + '" y="' + (y + bh / 2 + 4) + '">' + bits.slice(0, Math.floor(inner / 7.2)) + '…</text>';
        } else {
          var fixed = parts.length * hw + tail.reduce(function (s, p) { return s + (p[0] === 'pad' ? fw : fw); }, 0), dw = Math.max(narrow ? 56 : 90, inner - fixed), x = x0;
          parts.forEach(function (p) { g += '<rect class="sl6-pk-box" data-h="' + p[1] + '" x="' + x + '" y="' + y + '" width="' + hw + '" height="' + bh + '" rx="5" fill="' + C[p[0]] + '"/><text class="sl6-pk-bt' + (INK[p[1]] ? ' ink' : '') + '" x="' + (x + hw / 2) + '" y="' + (y + bh / 2 + 4) + '" text-anchor="middle">' + p[2] + '</text>'; x += hw; });
          if (l.none) g += '<rect class="sl6-pk-none" x="' + x + '" y="' + y + '" width="' + dw + '" height="' + bh + '" rx="5"/><text class="sl6-pk-nt" x="' + (x + 10) + '" y="' + (y + bh / 2 + 4) + '">' + esc(narrow ? t.noHdr : t.dataW + ' · ' + r.data + ' B · ' + t.noHdr) + '</text>';
          else g += '<rect class="sl6-pk-box" data-h="data" x="' + x + '" y="' + y + '" width="' + dw + '" height="' + bh + '" rx="5" fill="' + C.data + '"/><text class="sl6-pk-bt ink" x="' + (x + 10) + '" y="' + (y + bh / 2 + 4) + '">' + esc(t.dataW + ' · ' + r.data + ' B') + '</text>';
          x += dw;
          tail.forEach(function (p) { g += '<rect class="sl6-pk-box" data-h="' + p[1] + '" x="' + x + '" y="' + y + '" width="' + fw + '" height="' + bh + '" rx="5" fill="' + C.eth + '"' + (p[0] === 'pad' ? ' fill-opacity=".45"' : '') + '/><text class="sl6-pk-bt ink" x="' + (x + fw / 2) + '" y="' + (y + bh / 2 + 4) + '" text-anchor="middle">' + (p[0] === 'pad' ? p[2] : 'FCS') + '</text>'; x += fw; });
        }
        g += '</g>';
        desc.push(l.n + ' ' + size + (l.id === 'fis' ? ' bits' : ' B'));
      });
      g += '</svg>';
      box.innerHTML = g;
      box.querySelector('title').textContent = fill(t.gDesc, { n: r.n, rows: desc.join(', ') });
      q('.sl6-pk-ench').textContent = '── ' + fill(t.enc, { n: r.n });
    }
    function fields(h, linkI) {
      FH = h; var r = R.rows[S.sel], lk = LINK[linkI || 0], tcp = R.tcp, fl = t.fl[h] || [], hop = lk.h;
      var v = { sp: R.sport, dp: R.dport, sec: r.sec, fl: r.last ? 'ACK, PSH' : 'ACK', u: R.datos + 8, g: r.dgram, id: hex(r.id), df: r.df, mf: r.mf, off: r.off + (r.off ? ' (× 8 = ' + r.off * 8 + ' B)' : ''), ttl: r.ttls[hop], pr: tcp ? '6 (TCP)' : '17 (UDP)', sum: hex(r.sums[hop]), src: N.pc.ip, dst: N.srv.ip, md: lk.d, mo: lk.s, x: r.data, b: r.bits, p: r.pad };
      var chg = hop > 0 ? { TTL: 1 } : {};
      var html = '<h4 style="--c:' + (h === 'tcp' || h === 'udp' ? C.l4 : h === 'ip' ? C.ip : h === 'eth' || h === 'fcs' || h === 'pad' ? C.eth : h === 'bits' ? C.bits : C.data) + '"><i></i>' + esc(t.fn[h]) + '</h4><table><tbody>' + fl.map(function (f, i) {
        var isChg = hop > 0 && ((h === 'ip' && (i === 7 || i === 9)) || h === 'eth' && i < 2);
        return '<tr><th scope="row">' + esc(f[0]) + '</th><td' + (isChg ? ' class="is-chg"' : '') + '>' + esc(fill(f[1], v)) + '</td></tr>';
      }).join('') + '</tbody></table><p>' + esc(t.fp[h]) + '</p>';
      q('.sl6-pk-f').innerHTML = html;
      [].forEach.call(K.qa('.sl6-pk-box'), function (b) { b.classList.toggle('is-sel', b.getAttribute('data-h') === h); });
    }
    var ICON = {
      pc: '<rect x="4" y="5" width="16" height="10" rx="1.5"/><path d="M2 19h20"/>',
      sw: '<rect x="3" y="8" width="18" height="8" rx="2"/><path d="M7 12h.01M11 12h.01M15 12h.01"/>',
      rt: '<circle cx="12" cy="12" r="7"/><path d="M9 9l6 6M15 9l-6 6"/>',
      sv: '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 8h6M9 12h6"/>'
    };
    function route() {
      var box = q('.sl6-pk-route'), w = Math.max(280, box.clientWidth || 700), vert = w < 600, nodes = t.nodes, Ls = layers(), top = Ls[0].lv, lv = [top, 2, 3, 3, top], ic = ['pc', 'sw', 'rt', 'rt', 'sv'];
      var nw = vert ? 150 : Math.min(130, (w - 20) / 5 - 14), nh = 92, gap, W, H, pos = [];
      if (vert) { W = w; H = 5 * nh + 4 * 30 + 10; for (var i = 0; i < 5; i++) pos.push([8, 5 + i * (nh + 30)]); }
      else { W = w; H = nh + 40; gap = (W - 10 - 5 * nw) / 4; for (i = 0; i < 5; i++) pos.push([5 + i * (nw + gap), 30]); }
      var g = '<svg class="sl6-pk-rg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(t.route) + ': ' + nodes.map(function (n) { return n.join(' '); }).join(' → ') + '">';
      for (i = 0; i < 4; i++) {
        var a = pos[i], b = pos[i + 1];
        g += vert ? '<line class="sl6-pk-link" data-i="' + i + '" x1="' + (a[0] + 30) + '" x2="' + (b[0] + 30) + '" y1="' + (a[1] + nh) + '" y2="' + b[1] + '"/>' : '<line class="sl6-pk-link" data-i="' + i + '" x1="' + (a[0] + nw) + '" x2="' + b[0] + '" y1="' + (a[1] + 32) + '" y2="' + (b[1] + 32) + '"/>';
      }
      pos.forEach(function (p, i) {
        var lays = '', n = Ls.length, bw2 = vert ? 70 : nw - 20, bh2 = Math.max(4, Math.floor(30 / n) - 1);
        Ls.forEach(function (l, j) { lays += '<rect x="' + (vert ? p[0] + nw + 14 : p[0] + 10) + '" y="' + ((vert ? p[1] + 30 : p[1] + 54) + j * (bh2 + 1.5)) + '" width="' + bw2 + '" height="' + bh2 + '" rx="1.5" fill="' + (l.lv === 1 ? C.bits : l.lv === 2 ? C.eth : l.lv === 3 ? C.ip : l.lv === 4 ? C.l4 : C.data) + '" class="' + (l.lv > lv[i] ? 'off' : '') + '"/>'; });
        g += '<g class="sl6-pk-node" data-n="' + i + '"><rect x="' + p[0] + '" y="' + p[1] + '" width="' + (vert ? 60 : nw) + '" height="' + (vert ? nh - 20 : 50) + '" rx="12"/>';
        if (vert) g += '<svg x="' + (p[0] + 18) + '" y="' + (p[1] + 24) + '" width="24" height="24" viewBox="0 0 24 24"><g class="ic">' + ICON[ic[i]] + '</g></svg><text class="sl6-pk-nn" x="' + (p[0] + nw + 14) + '" y="' + (p[1] + 12) + '">' + esc(nodes[i][0]) + '</text><text class="sl6-pk-na" x="' + (p[0] + nw + 14) + '" y="' + (p[1] + 25) + '">' + esc(nodes[i][1]) + '</text><g class="sl6-pk-lay">' + lays + '</g>';
        else g += '<svg x="' + (p[0] + 8) + '" y="' + (p[1] + 13) + '" width="24" height="24" viewBox="0 0 24 24"><g class="ic">' + ICON[ic[i]] + '</g></svg><text class="sl6-pk-nn" x="' + (p[0] + 38) + '" y="' + (p[1] + 23) + '">' + esc(nodes[i][0]) + '</text><text class="sl6-pk-na" x="' + (p[0] + 38) + '" y="' + (p[1] + 37) + '">' + esc(nodes[i][1].length > 14 && nw < 125 ? nodes[i][1].slice(0, 13) + '…' : nodes[i][1]) + '</text><g class="sl6-pk-lay">' + lays + '</g>';
        g += '</g>';
      });
      g += '<g class="sl6-pk-env" style="display:none"><rect x="-13" y="-9" width="26" height="18" rx="3"/><path d="M-13 -8l13 9 13-9"/></g></svg>';
      box.innerHTML = g; K.rpos = pos; K.rvert = vert; K.rnw = nw;
    }
    function results() {
      var row = function (a, b) { return '<tr><th scope="row">' + esc(a) + '</th><td>' + b + '</td></tr>'; }, s = t.res;
      q('.sl6-pk-res').innerHTML = '<table class="sl6-tbl2"><tbody>' + row(s.frames, R.rows.length) + row(s.tot, R.total + ' B') + row(s.head, R.head + ' B') + row(s.bits, R.total * 8) + '</tbody><tfoot>' + row(s.pct, K6.num(R.pct, L, 1) + ' %') + '</tfoot></table>';
      q('.sl6-pk-who').innerHTML = '<table class="sl6-pk-who"><tbody>' + t.whoR.map(function (x) { return '<tr><th scope="row">' + esc(x[0]) + '</th><td>' + esc(x[1]) + '</td><td>' + esc(x[2]) + '</td></tr>'; }).join('') + '</tbody></table>';
    }
    function draw(k, going) {
      var s = going ? ST[k] : null, Ls = layers(), nEnc = Ls.length;
      [].forEach.call(K.qa('.sl6-pk-row'), function (g, i) {
        var lv = +g.getAttribute('data-lv');
        g.classList.toggle('is-fut', going && k < nEnc && i > k);
        g.classList.toggle('is-now', going && k < nEnc && i === k);
        g.style.opacity = s && s.k === 'hop' && lv > s.lv ? .3 : '';
      });
      // la ruta
      var at = !s ? -1 : s.k === 'enc' ? 0 : s.at, env = q('.sl6-pk-env'), P = K.rpos;
      [].forEach.call(K.qa('.sl6-pk-node'), function (n) { n.classList.toggle('is-on', +n.getAttribute('data-n') === at); });
      [].forEach.call(K.qa('.sl6-pk-link'), function (l) { l.classList.toggle('is-done', at > +l.getAttribute('data-i')); });
      if (env && P) {
        if (at < 0) env.style.display = 'none';
        else { env.style.display = ''; var p = P[at], x = K.rvert ? p[0] + 30 : p[0] + K.rnw / 2, y = K.rvert ? p[1] - 2 : p[1] - 14; env.setAttribute('transform', 'translate(' + x + ',' + y + ')'); env.style.transform = 'translate(' + x + 'px,' + y + 'px)'; }
      }
      var lk = s && s.k === 'hop' ? s.link : 0, r = R.rows[S.sel], L0 = LINK[lk];
      q('.sl6-pk-wire').innerHTML = '<b>' + esc(t.wire) + ':</b> ' + esc(t.mac) + ' ' + L0.s + ' → ' + L0.d + ' · IP ' + N.pc.ip + ' → ' + N.srv.ip + ' · ' + esc(t.ttl) + ' ' + r.ttls[L0.h] + ' · ' + esc(t.sum) + ' ' + hex(r.sums[L0.h]);
      if (s) fields(s.f, lk); else if (!FH) fields(R.tcp ? 'tcp' : 'udp', 0);
      [].forEach.call(log.children, function (li) { var d = li.getAttribute('data-k'); if (d == null) { li.hidden = going; return; } d = +d; li.hidden = !going || d > k; li.classList.toggle('is-cur', going && d === k); });
      var cur = log.querySelector('.is-cur'); if (cur) log.scrollTop = cur.offsetTop - log.clientHeight + cur.offsetHeight + 8;
    }
    K.N = function () { return ST.length; }; K.draw = draw;
    var P = K6.player(K);
    function rebuildSteps() {
      ST = buildSteps();
      log.innerHTML = ST.map(function (s, j) { return '<li data-k="' + j + '" hidden><span class="sl6-log__t">' + (j + 1) + '</span><span class="sl6-log__x">' + s.x + '</span></li>'; }).join('') + '<li class="sl6-log__0">' + esc(t.start) + '</li>';
    }
    function update() {
      P.stop(); S.d = clampD(S.d);
      R = SLPaquete({ datos: S.d, mss: S.mss, proto: S.pr }); if (S.sel >= R.rows.length) S.sel = 0;
      [].forEach.call(K.qa('[data-mo]'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-mo') === S.mo); });
      [].forEach.call(K.qa('[data-pr]'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-pr') === S.pr); });
      dIn.value = S.d; dIn.max = S.pr === 'udp' ? 9000 : 20000; mIn.value = S.mss; q('.sl6-pk-m').classList.toggle('is-off', S.pr !== 'tcp');
      q('.sl6-cmdl').innerHTML = esc(t.cmd) + ' <span class="o">' + t.mo + '</span> <b>' + (S.mo === 'osi' ? 'osi' : 'tcpip') + '</b>' + (S.pr === 'udp' ? ' <span class="o">' + t.udp + '</span>' : '') + ' <span class="o">' + t.da + '</span> <b>' + S.d + '</b>' + (S.pr === 'tcp' ? ' <span class="o">' + t.ms + '</span> <b>' + S.mss + '</b>' : '') + ' ' + esc(S.pr === 'tcp' ? t.fT : t.fU);
      q('.sl6-desc').textContent = t.desc[S.pr];
      var st = enc(); K6.store('sl_sim_paquete', st); K6.keepHash(st);
      FH = null; segTable(); stack(); route(); results(); rebuildSteps(); P.reset();
    }
    function select(i) { S.sel = i; P.stop(); segTable(); stack(); rebuildSteps(); P.reset(); }
    el.addEventListener('click', function (e) {
      var tr = e.target.closest('.sl6-pk-segs tbody tr'); if (tr) { select(+tr.getAttribute('data-i')); return; }
      var bx = e.target.closest('.sl6-pk-box'); if (bx) { var cur = K.el.classList.contains('is-going') ? ST[Math.max(0, +q('.sl6-clock').textContent.split('/')[0] - 1)] : null; fields(bx.getAttribute('data-h'), cur && cur.k === 'hop' ? cur.link : 0); return; }
      var b = e.target.closest('button'); if (!b || !el.contains(b) || b.closest('.sl6-reto')) return;
      var a = b.getAttribute('data-a');
      if (b.hasAttribute('data-mo')) { S.mo = b.getAttribute('data-mo'); update(); return; }
      if (b.hasAttribute('data-pr')) { S.pr = b.getAttribute('data-pr'); if (S.pr === 'udp' && S.d > 9000) S.d = 120; S.sel = 0; update(); return; }
      if (a === 'theme') K6.toggleTheme(K);
      else if (a === 'd-' || a === 'd+') { S.d = clampD(S.d + (a === 'd+' ? 100 : -100)); S.sel = 0; update(); }
      else if (a === 'ex') { S.mo = 'tcpip'; S.pr = 'tcp'; S.d = 3000; S.mss = 1460; S.sel = 0; update(); }
      else if (a === 'rnd') { S.pr = Math.random() < .7 ? 'tcp' : 'udp'; S.d = S.pr === 'tcp' ? 200 + Math.floor(Math.random() * 6000) : [40, 120, 900, 2000, 3500][Math.floor(Math.random() * 5)]; S.mss = [536, 1000, 1200, 1460][Math.floor(Math.random() * 4)]; S.sel = 0; update(); }
      else if (a === 'share') K6.share(K, b, enc());
    });
    el.addEventListener('keydown', function (e) { var tr = e.target.closest && e.target.closest('.sl6-pk-segs tbody tr'); if (tr && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); select(+tr.getAttribute('data-i')); } });
    dIn.addEventListener('change', function () { S.d = clampD(+dIn.value); S.sel = 0; update(); });
    mIn.addEventListener('change', function () { S.mss = Math.max(88, Math.min(1460, Math.round(+mIn.value) || 1460)); S.sel = 0; update(); });
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { stack(); route(); P.draw(); }, 150); });
    // ---------------------------------------------------------------- reto
    var box = q('.sl6-reto'), RT = null;
    function reto() {
      var d = 600 + Math.floor(Math.random() * 7000), m = [536, 1000, 1200, 1460][Math.floor(Math.random() * 4)];
      RT = SLPaquete({ datos: d, mss: m, proto: 'tcp' }); var lr = RT.rows[RT.rows.length - 1];
      RT.ans = { k: RT.rows.length, last: lr.data, lf: lr.frame, tot: RT.total };
      var h = '<h3 class="sl6-reto__h">' + esc(t.reto) + '</h3><p class="sl6-reto__lead">' + esc(t.retoLead) + '</p><p class="sl6-cmd sl6-cmd--s"><span class="sl6-ps">$</span> <code>' + esc(t.cmd) + ' <span class="o">' + t.da + '</span> <b>' + d + '</b> <span class="o">' + t.ms + '</span> <b>' + m + '</b> ' + esc(t.fR) + '</code></p><div class="sl6-reto__w sl6-sn-reto"><table><tbody>';
      ['k', 'last', 'lf', 'tot'].forEach(function (k) { h += '<tr><th scope="row">' + esc(t.rf[k]) + '</th><td><input type="text" inputmode="numeric" data-k="' + k + '" aria-label="' + esc(t.rf[k]) + '"></td></tr>'; });
      h += '</tbody></table></div><div class="sl6-pk-ans"><p class="sl6-help" style="margin:0!important">' + esc(t.ask) + '</p>' + t.who3.map(function (w, i) { return '<label>' + esc(w) + '<select data-w="' + i + '"><option value="">' + esc(t.choose) + '</option>' + t.opts.map(function (o, j) { return '<option value="' + j + '">' + esc(o) + '</option>'; }).join('') + '</select></label>'; }).join('') + '</div>';
      h += '<div class="sl6-reto__act"><button type="button" class="sl6-btn sl6-btn--p" data-r="check">' + ico('check', 16) + esc(K.t.check) + '</button><button type="button" class="sl6-btn" data-r="sol">' + esc(K.t.sol) + '</button><button type="button" class="sl6-btn sl6-btn--g" data-r="new">' + ico('dice', 16) + esc(K.t.retoNew) + '</button></div><p class="sl6-reto__msg" aria-live="polite"></p>';
      box.innerHTML = h; RT.d = d; RT.m = m;
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var a = b.getAttribute('data-r');
      if (a === 'new') reto();
      else if (a === 'check') {
        var good = 0, n = 0;
        [].forEach.call(box.querySelectorAll('input'), function (x) { var v = x.value.trim().replace(/[.\s]/g, ''), ok = /^\d+$/.test(v) && +v === RT.ans[x.getAttribute('data-k')]; x.classList.toggle('is-ok', ok); x.classList.toggle('is-bad', !ok); n++; if (ok) good++; });
        [].forEach.call(box.querySelectorAll('select'), function (x) { var ok = x.value === x.getAttribute('data-w'); x.classList.toggle('is-ok', ok); x.classList.toggle('is-bad', !ok); n++; if (ok) good++; });
        box.querySelector('.sl6-reto__msg').innerHTML = '<b>' + esc(fill(t.got, { a: good, n: n })) + '.</b> ' + esc(good === n ? t.allOk : t.someBad);
      } else if (a === 'sol') { S.mo = 'tcpip'; S.pr = 'tcp'; S.d = RT.d; S.mss = RT.m; S.sel = RT.rows.length - 1; update(); q('.sl6-win').scrollIntoView({ behavior: K6.reduced ? 'auto' : 'smooth', block: 'start' }); setTimeout(P.run, K6.reduced ? 0 : 500); }
    });
    update(); reto();
  }
  K6.boot('.sl-sim[data-sim="paquete"]', init);
})();
