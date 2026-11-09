	} elseif ( 'pipeline-mips' === $slug && sl_v20() ) {   // la caja de la cafetería con anticipación: escalera de etapas, la burbuja del load-use y su flecha
		$col  = array( '#5B4BDB', '#2F5FD0', '#FF6B4A', '#F5A524', '#16794B' );
		$rows = array( array( 0, 0 ), array( 1, 0 ), array( 2, 1 ), array( 4, 0 ), array( 5, 0 ) );   // IF de cada una y burbujas antes de su ID
		$cw   = $w / 11;
		foreach ( $rows as $r => $x ) {
			$y = 1 + $r * 14.6;
			$c .= '<rect x="' . round( $x[0] * $cw + 1, 1 ) . '" y="' . $y . '" width="' . round( $cw - 2, 1 ) . '" height="12" rx="2.5" fill="' . $col[0] . '"/>';
			for ( $b = 0; $b < $x[1]; $b++ ) {
				$c .= '<rect x="' . round( ( $x[0] + 1 + $b ) * $cw + 1, 1 ) . '" y="' . $y . '" width="' . round( $cw - 2, 1 ) . '" height="12" rx="2.5" fill="#A99EF5" fill-opacity=".28" stroke="#A99EF5" stroke-dasharray="2 2"/>';
			}
			for ( $k = 1; $k < 5; $k++ ) {
				$c .= '<rect x="' . round( ( $x[0] + $x[1] + $k ) * $cw + 1, 1 ) . '" y="' . $y . '" width="' . round( $cw - 2, 1 ) . '" height="12" rx="2.5" fill="' . $col[ $k ] . '"/>';
			}
		}
		$c .= '<path d="M' . round( 4.5 * $cw, 1 ) . ',' . ( 1 + 14.6 + 12 ) . ' C' . round( 4.5 * $cw, 1 ) . ',' . ( 1 + 2 * 14.6 + 6 ) . ' ' . round( 5 * $cw - 6, 1 ) . ',' . ( 1 + 2 * 14.6 + 6 ) . ' ' . round( 5 * $cw + 1, 1 ) . ',' . ( 1 + 2 * 14.6 + 6 ) . '" fill="none" stroke="#FF9B80" stroke-width="1.6"/>';
	} elseif ( 'cache-paso-a-paso' === $slug && sl_v20() ) {   // caché directa de 4 líneas: bloques 0 1 0 4 1 0 4 2 (obligatorios, aciertos y conflictos)
		$seq  = array( array( 0, 'o' ), array( 1, 'o' ), array( 0, 'h' ), array( 4, 'o' ), array( 1, 'h' ), array( 0, 'c' ), array( 4, 'c' ), array( 2, 'o' ) );
		$kc   = array( 'o' => '#5B4BDB', 'h' => '#16794B', 'c' => '#FF6B4A' );
		$st   = array( null, null, null, null );
		$cw   = $w / 8;
		foreach ( $seq as $j => $x ) {
			$li        = $x[0] % 4;
			$st[ $li ] = $x[0];
			foreach ( $st as $r => $v ) {
				if ( null === $v ) {
					continue;
				}
				$y   = 1 + $r * 14.5;
				$cur = ( $r === $li );
				if ( $cur ) {
					$c .= '<rect x="' . round( $j * $cw + 2, 1 ) . '" y="' . $y . '" width="' . round( $cw - 4, 1 ) . '" height="12" rx="3" fill="' . $kc[ $x[1] ] . '"/>';
				}
				$c .= '<text x="' . round( $j * $cw + $cw / 2, 1 ) . '" y="' . ( $y + 9.5 ) . '" text-anchor="middle" font-size="9" font-weight="700" font-family="JetBrains Mono,monospace" fill="' . ( $cur ? ( 'c' === $x[1] ? '#1E1B2E' : '#fff' ) : '#8E8AA3' ) . '">' . $v . '</text>';
			}
			$c .= '<rect x="' . round( $j * $cw + 4, 1 ) . '" y="62" width="' . round( $cw - 8, 1 ) . '" height="8" rx="2" fill="' . $kc[ $x[1] ] . '" fill-opacity=".85"/>';
		}
	} elseif ( 'codificador-mips' === $slug && sl_v20() ) {   // add $t1, $t1, $t0 = 0x01284820: los 32 bits por campos y sus 8 cifras hexadecimales
		$wd   = 0x01284820;
		$flds = array( array( 6, '#5B4BDB' ), array( 5, '#2F5FD0' ), array( 5, '#16794B' ), array( 5, '#FF6B4A' ), array( 5, '#8E8AA3' ), array( 6, '#F5A524' ) );
		$bw   = ( $w - 10 ) / 32;
		$i    = 0;
		foreach ( $flds as $f => $fl ) {
			for ( $k = 0; $k < $fl[0]; $k++, $i++ ) {
				$bit = ( $wd >> ( 31 - $i ) ) & 1;
				$x   = $i * $bw + $f * 2;
				$c  .= '<rect x="' . round( $x, 1 ) . '" y="4" width="' . round( $bw - 1, 1 ) . '" height="22" rx="1.5" fill="' . $fl[1] . '" fill-opacity="' . ( $bit ? '1' : '.25' ) . '"/>';
			}
		}
		$hx = strtoupper( str_pad( dechex( $wd ), 8, '0', STR_PAD_LEFT ) );
		$hw = $w / 8;
		for ( $k = 0; $k < 8; $k++ ) {
			$c .= '<rect x="' . round( $k * $hw + 3, 1 ) . '" y="38" width="' . round( $hw - 6, 1 ) . '" height="30" rx="5" fill="#2A2640" stroke="#3A3554"/>';
			$c .= '<text x="' . round( $k * $hw + $hw / 2, 1 ) . '" y="58" text-anchor="middle" font-size="14" font-weight="700" font-family="JetBrains Mono,monospace" fill="#FF9B80">' . $hx[ $k ] . '</text>';
		}
