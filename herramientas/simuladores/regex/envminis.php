/** Animaciones de los entornos (SL_V23_PUBLICO), gráficas como las de los simuladores (Sergio, 9 nov 2026: «no código, algo gráfico»).
 *  $c = true: versión compacta (230 × 52) para el recuadro pequeño de la portada; si no, 340 × 96 (tarjetas de los hubs). */
function sl19_env_scene( $slug, $c = false ) {
	$en  = sl19_en();
	$ok  = '#8FE3B0';
	$M   = '#8E8AA3';
	$fx  = function ( $x, $y, $t, $col, $size = 11, $w = 400, $anchor = '' ) {
		$h = sl19_tx( $x, $y, array( array( $t, $col ) ), $size, $w );
		return $anchor ? str_replace( '<text ', '<text text-anchor="' . $anchor . '" ', $h ) : $h;
	};
	if ( 'python' === $slug ) {   // las notas en barras y la media que sale del programa
		$v  = array( 7, 8.5, 9 );
		$b0 = $c ? 48 : 82;
		$k  = $c ? 4 : 6.4;
		$bw = $c ? 22 : 38;
		$it = array( array( 'm' => '<rect x="0" y="' . $b0 . '" width="' . ( $c ? 96 : 196 ) . '" height="1.5" fill="#3A3554"/>', 'a' => 2 ) );
		foreach ( $v as $i => $n ) {
			$x    = ( $c ? 6 : 18 ) + $i * ( $c ? 30 : 58 );
			$h    = $n * $k;
			$it[] = array( 'm' => '<rect x="' . $x . '" y="' . round( $b0 - $h, 1 ) . '" width="' . $bw . '" height="' . round( $h, 1 ) . '" rx="' . ( $c ? 3 : 5 ) . '" fill="#A99EF5" fill-opacity=".85"/>', 'a' => 6 + $i * 8, 'gy' => 1 );
			if ( ! $c ) {
				$it[] = array( 'm' => $fx( $x + $bw / 2, round( $b0 - 10, 1 ), str_replace( '.', $en ? '.' : ',', (string) $n ), '#1E1B2E', 12, 700, 'middle' ), 'a' => 12 + $i * 8 );
			}
		}
		$y    = round( $b0 - ( 24.5 / 3 ) * $k, 1 );
		$it[] = array( 'm' => '<path pathLength="100" d="M0 ' . $y . 'H' . ( $c ? 96 : 196 ) . '" stroke="' . $ok . '" stroke-width="2"/>', 'a' => 40, 'dr' => 1 );
		$num  = $en ? '8.17' : '8,17';
		if ( $c ) {
			$it[] = array( 'm' => $fx( 106, 22, $num, $ok, 15, 700 ) . $fx( 106, 40, $en ? 'mean' : 'media', $M, 11 ), 'a' => 50 );
			return sl19_tl( 'pyc', $it, 230, 52 );
		}
		$it[] = array( 'm' => $fx( 210, round( $y - 4, 1 ), $en ? 'mean' : 'media', $M, 11 ) . $fx( 210, round( $y + 16, 1 ), $num, $ok, 18, 700 ), 'a' => 50 );
		return sl19_tl( 'py', $it );
	}
	if ( 'java' === $slug ) {   // dos clases; javac las recorre, quedan compiladas y sale el resultado
		$box = function ( $x, $y, $w, $h, $n, $col, $small ) use ( $fx ) {
			return '<rect x="' . $x . '" y="' . $y . '" width="' . $w . '" height="' . $h . '" rx="7" fill="' . $col . '" fill-opacity=".08" stroke="' . $col . '" stroke-width="1.4"/>'
				. $fx( $x + 10, $y + ( $small ? 15 : 19 ), $n, $col, $small ? 11 : 12, 700 )
				. '<rect x="' . $x . '" y="' . ( $y + ( $small ? 21 : 27 ) ) . '" width="' . $w . '" height="1" fill="' . $col . '" fill-opacity=".5"/>'
				. '<rect x="' . ( $x + 10 ) . '" y="' . ( $y + ( $small ? 27 : 36 ) ) . '" width="' . round( $w * .55 ) . '" height="' . ( $small ? 4 : 6 ) . '" rx="2" fill="#C9C5DC" fill-opacity=".35"/>'
				. ( $small ? '' : '<rect x="' . ( $x + 10 ) . '" y="' . ( $y + 48 ) . '" width="' . round( $w * .4 ) . '" height="6" rx="2" fill="#C9C5DC" fill-opacity=".35"/>' );
		};
		$chk = function ( $x, $y ) use ( $ok ) {
			return '<circle cx="' . $x . '" cy="' . $y . '" r="8" fill="#16794B"/><path d="M' . ( $x - 3.6 ) . ' ' . $y . 'l2.6 2.6 4.6-5" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
		};
		$cor = '#FF9B80';
		if ( $c ) {
			return sl19_tl( 'jvc', array(
				array( 'm' => $box( 1, 6, 66, 40, 'Main', $cor, true ), 'a' => 3 ),
				array( 'm' => $box( 96, 6, 74, 40, 'Notas', $cor, true ), 'a' => 10 ),
				array( 'm' => '<path pathLength="100" d="M67 26H90" stroke="' . $M . '" stroke-width="1.4"/><path d="M86 22l5 4-5 4" stroke="' . $M . '" stroke-width="1.4" fill="none"/>', 'a' => 18 ),
				array( 'm' => '<rect x="0" y="4" width="172" height="44" rx="8" fill="#FF6B4A" fill-opacity=".22"/>', 'a' => 28, 'b' => 36, 'g' => 1 ),
				array( 'm' => $chk( 64, 8 ) . $chk( 167, 8 ), 'a' => 40 ),
				array( 'm' => '<rect x="180" y="15" width="48" height="22" rx="11" fill="#16794B" fill-opacity=".25" stroke="' . $ok . '"/>' . $fx( 204, 30.5, '7.58', $ok, 11, 700, 'middle' ), 'a' => 52 ),
			), 230, 52 );
		}
		return sl19_tl( 'jv', array(
			array( 'm' => $box( 2, 12, 96, 66, 'Main', $cor, false ), 'a' => 3 ),
			array( 'm' => $box( 140, 12, 112, 66, 'Notas', $cor, false ), 'a' => 11 ),
			array( 'm' => '<path pathLength="100" d="M98 45H134" stroke="' . $M . '" stroke-width="1.6"/><path d="M129 40l6 5-6 5" stroke="' . $M . '" stroke-width="1.6" fill="none"/>', 'a' => 19 ),
			array( 'm' => $fx( 100, 92, 'javac', '#FF6B4A', 10, 700 ), 'a' => 28, 'b' => 38 ),
			array( 'm' => '<rect x="0" y="9" width="256" height="72" rx="10" fill="#FF6B4A" fill-opacity=".2"/>', 'a' => 28, 'b' => 36, 'g' => 1 ),
			array( 'm' => $chk( 95, 13 ) . $chk( 249, 13 ), 'a' => 40 ),
			array( 'm' => '<rect x="266" y="32" width="70" height="26" rx="13" fill="#16794B" fill-opacity=".25" stroke="' . $ok . '"/>' . $fx( 301, 49.5, '7.58', $ok, 13, 700, 'middle' ) . $fx( 301, 24, $en ? 'output' : 'salida', $M, 10, 400, 'middle' ), 'a' => 52 ),
		) );
	}
	if ( 'c' === $slug ) {   // fork(): el proceso se parte en padre e hijo
		$Y  = '#F5C06B';
		$P  = '#FF9B80';
		$H  = '#9CC3FF';
		$nd = function ( $x, $y, $r, $col ) {
			return '<circle cx="' . $x . '" cy="' . $y . '" r="' . $r . '" fill="' . $col . '" fill-opacity=".18" stroke="' . $col . '" stroke-width="1.6"/>';
		};
		if ( $c ) {
			return sl19_tl( 'cc', array(
				array( 'm' => $nd( 9, 26, 7, $Y ), 'a' => 3 ),
				array( 'm' => '<path pathLength="100" d="M16 26H54" stroke="' . $Y . '" stroke-width="2"/>', 'a' => 8, 'dr' => 1 ),
				array( 'm' => '<circle cx="56" cy="26" r="3.5" fill="' . $Y . '"/>', 'a' => 16 ),
				array( 'm' => '<path pathLength="100" d="M56 26C66 12 70 11 82 11" stroke="' . $P . '" stroke-width="2" fill="none"/><path pathLength="100" d="M56 26C66 40 70 41 82 41" stroke="' . $H . '" stroke-width="2" fill="none"/>', 'a' => 20, 'dr' => 1 ),
				array( 'm' => $nd( 89, 11, 7, $P ) . $fx( 102, 15, ( $en ? 'parent ' : 'padre ' ) . '4310', $P, 11, 700 ), 'a' => 30 ),
				array( 'm' => $nd( 89, 41, 7, $H ) . $fx( 102, 45, ( $en ? 'child ' : 'hijo ' ) . '4311', $H, 11, 700 ), 'a' => 38 ),
			), 230, 52 );
		}
		return sl19_tl( 'c', array(
			array( 'm' => $nd( 20, 48, 13, $Y ) . $fx( 20, 26, 'main', $Y, 10, 700, 'middle' ), 'a' => 3 ),
			array( 'm' => '<path pathLength="100" d="M33 48H96" stroke="' . $Y . '" stroke-width="2.4"/>', 'a' => 8, 'dr' => 1 ),
			array( 'm' => '<circle cx="100" cy="48" r="5" fill="' . $Y . '"/>' . $fx( 64, 66, 'fork()', $Y, 10, 700, 'middle' ), 'a' => 16 ),
			array( 'm' => '<path pathLength="100" d="M104 46C124 20 132 18 158 18" stroke="' . $P . '" stroke-width="2.4" fill="none"/><path pathLength="100" d="M104 50C124 76 132 78 158 78" stroke="' . $H . '" stroke-width="2.4" fill="none"/>', 'a' => 22, 'dr' => 1 ),
			array( 'm' => $nd( 171, 18, 12, $P ) . $fx( 192, 15, $en ? 'parent' : 'padre', $P, 12, 700 ) . $fx( 192, 30, 'pid 4310', $M, 10 ), 'a' => 32 ),
			array( 'm' => $nd( 171, 78, 12, $H ) . $fx( 192, 75, $en ? 'child' : 'hijo', $H, 12, 700 ) . $fx( 192, 90, 'pid 4311', $M, 10 ), 'a' => 40 ),
		) );
	}
	if ( 'mips' === $slug ) {   // registros y memoria: $t0 recibe 5, suma 1 y el sw lo guarda en «vidas»
		$B    = '#9CC3FF';
		$v    = $en ? 'lives' : 'vidas';
		$cell = function ( $x, $y, $w, $h, $lab, $col ) use ( $fx ) {
			return '<rect x="' . $x . '" y="' . $y . '" width="' . $w . '" height="' . $h . '" rx="6" fill="' . $col . '" fill-opacity=".1" stroke="' . $col . '" stroke-width="1.3"/>' . $fx( $x + 8, $y + $h / 2 + 4, $lab, $col, 11 );
		};
		$val = function ( $x, $y, $t, $col, $size ) use ( $fx ) {
			return $fx( $x, $y, $t, $col, $size, 700, 'end' );
		};
		if ( $c ) {
			return sl19_tl( 'mipsc', array(
				array( 'm' => $cell( 0, 10, 96, 32, '$t0', $B ) . $cell( 132, 10, 96, 32, $v, $M ), 'a' => 2 ),
				array( 'm' => $val( 88, 31, '5', '#E8E6F5', 14 ), 'a' => 4, 'b' => 26 ),
				array( 'm' => $val( 88, 31, '6', $ok, 14 ), 'a' => 28 ),
				array( 'm' => $val( 220, 31, '3', '#E8E6F5', 14 ), 'a' => 2, 'b' => 56 ),
				array( 'm' => '<path pathLength="100" d="M98 26H126" stroke="' . $ok . '" stroke-width="2"/><path d="M121 21l6 5-6 5" stroke="' . $ok . '" stroke-width="2" fill="none"/>', 'a' => 44 ),
				array( 'm' => $val( 220, 31, '6', $ok, 14 ), 'a' => 58 ),
			), 230, 52 );
		}
		$ins = array( array( 'li   $t0, 5', 4, 26 ), array( 'addi $t0, $t0, 1', 28, 48 ), array( 'sw   $t0, ' . $v, 50, 88 ) );
		$it  = array();
		foreach ( $ins as $x ) {
			$it[] = array( 'm' => '<rect x="0" y="0" width="150" height="20" rx="10" fill="' . $B . '" fill-opacity=".14"/><path d="M8 5.5l6 4.5-6 4.5z" fill="' . $B . '"/>' . $fx( 20, 14, $x[0], $B, 11, 700 ), 'a' => $x[1], 'b' => $x[2] );
		}
		$it[] = array( 'm' => $fx( 0, 40, $en ? 'registers' : 'registros', $M, 10 ) . $cell( 70, 28, 84, 22, '$t0', $B ) . $cell( 162, 28, 84, 22, '$t1', '#5A566E' ) . $cell( 254, 28, 84, 22, '$t2', '#5A566E' ) . $val( 238, 43, '0', '#8E8AA3', 12 ) . $val( 330, 43, '0', '#8E8AA3', 12 ), 'a' => 2 );
		$it[] = array( 'm' => $fx( 0, 82, $en ? 'memory' : 'memoria', $M, 10 ) . $cell( 70, 70, 84, 22, $v, $M ) . $cell( 162, 70, 84, 22, $en ? 'level' : 'nivel', '#5A566E' ) . $cell( 254, 70, 84, 22, $en ? 'score' : 'puntos', '#5A566E' ) . $val( 238, 85, '1', '#8E8AA3', 12 ) . $val( 330, 85, '0', '#8E8AA3', 12 ), 'a' => 2 );
		$it[] = array( 'm' => $val( 146, 43, '0', '#8E8AA3', 12 ), 'a' => 2, 'b' => 6 );
		$it[] = array( 'm' => '<rect x="70" y="28" width="84" height="22" rx="6" fill="' . $B . '" fill-opacity=".3"/>' . $val( 146, 43, '5', '#E8E6F5', 12 ), 'a' => 8, 'b' => 30 );
		$it[] = array( 'm' => '<rect x="70" y="28" width="84" height="22" rx="6" fill="#16794B" fill-opacity=".35"/>' . $val( 146, 43, '6', $ok, 12 ), 'a' => 32 );
		$it[] = array( 'm' => $val( 146, 85, '3', '#E8E6F5', 12 ), 'a' => 2, 'b' => 60 );
		$it[] = array( 'm' => '<path pathLength="100" d="M112 50V68" stroke="' . $ok . '" stroke-width="2"/><path d="M107 63l5 6 5-6" stroke="' . $ok . '" stroke-width="2" fill="none"/>', 'a' => 54, 'dr' => 1 );
		$it[] = array( 'm' => '<rect x="70" y="70" width="84" height="22" rx="6" fill="#16794B" fill-opacity=".35"/>' . $val( 146, 85, '6', $ok, 12 ), 'a' => 62 );
		return sl19_tl( 'mips', $it );
	}
	return '';
}
function sl19_env_mini2( $slug ) {
	return sl19_env_scene( $slug, false );
}
function sl19_env_mini3( $slug ) {
	return sl19_env_scene( $slug, true );
}
