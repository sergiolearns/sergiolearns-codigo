<?php
require 'stubs.php'; require '../sergiolearns-bot.php';
$html = '<!-- wp:rank-math/toc-block --><div class="wp-block-rank-math-toc-block"><nav><a href="#a">Tabla</a></nav></div><!-- /wp:rank-math/toc-block -->
<p>Intro con <code>&amp;x</code> y <strong>negrita</strong>.</p>
<h2 class="wp-block-heading" id="declarar">Declarar un puntero</h2><p>El * de la declaración.</p>
<pre class="EnlighterJSRAW" data-enlighter-language="c">int x = 1;
if (a &lt; b &amp;&amp; c) { *p = 5; }</pre>
<div class="wp-block-group sl-callout sl-callout--error"><p>No inicializar el puntero.</p></div>
<h3 class="wp-block-heading" id="sub">Subapartado</h3><figure><svg><title>Memoria y punteros</title><rect/></svg><figcaption>Figura 1</figcaption></figure>
<table><tr><th>Op</th><th>Qué hace</th></tr><tr><td>&amp;</td><td>dirección</td></tr></table>
<h2 id="cuest">Cuestionario</h2><div class="sl-quiz" data-quiz="t1"><div class="sl-q" data-type="unica" data-id="t1-01"><p class="sl-q__enunciado">¿Qué guarda un puntero?</p><ol class="sl-q__ops"><li data-why="No, eso es el valor."><label><input type="radio">El valor</label></li><li data-ok="" data-why="Exacto."><label><input type="radio">Una dirección</label></li></ol><details class="sl-q__sol"><summary>Solución</summary><p>Una dirección de memoria.</p></details></div></div>
<h2 id="fin">Resumen</h2><p>Fin con un enlace.</p>';
$post = (object) array('ID'=>763,'post_content'=>$html,'post_modified_gmt'=>'x','post_status'=>'publish','post_type'=>'post');
$S = slb_secciones($post);
echo "ANCLAS: ", json_encode($S['anclas'], JSON_UNESCAPED_UNICODE), "\n";
foreach ($S['secs'] as $s) echo "=== [{$s[0]}] {$s[1]}\n{$s[2]}\n";
echo "\n--- QUIZ ---\n", slb_quiz($post,'t1-01');
$c = slb_contexto($post, array('sec'=>'declarar','h3'=>'sub','sel'=>'*p = 5','quiz'=>array('id'=>'t1-01','ok'=>0)), 'ligero', false, '¿Qué es un puntero?');
echo "\n--- CONTEXTO ---\n", $c['texto'], "\nURLS: ", implode(' ', $c['urls']), "\n";
echo "\n--- LINKS ---\n", slb_limpia_enlaces("Mira [la sección](https://sergiolearns.com/punteros-en-c/#declarar) y [otra](https://sergiolearns.com/inventada/) o https://sergiolearns.com/falsa/ y [PT](https://pythontutor.com/c.html). ```c\nint x;```", $c['urls']), "\n";
