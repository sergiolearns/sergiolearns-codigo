	} elseif ( 'ruta-de-datos' === $slug && sl_v21() ) {   // la RD monociclo en miniatura con el camino de lw en coral (PC, memoria, registros, ALU, memoria de datos, MemtoReg)
		$bk = array( array( 2, 26, 18, 22, 'PC' ), array( 28, 16, 34, 42, 'MI' ), array( 72, 16, 40, 42, 'Reg' ), array( 124, 20, 26, 34, 'ALU' ), array( 160, 16, 36, 42, 'MD' ), array( 204, 24, 12, 26, '' ) );
		$wires = array( array( 20, 37, 28, 37 ), array( 62, 37, 72, 37 ), array( 112, 30, 124, 30 ), array( 150, 37, 160, 37 ), array( 196, 33, 204, 33 ), array( 216, 37, 224, 37, 224, 66, 66, 66, 66, 50, 72, 50 ), array( 112, 44, 118, 44, 118, 62, 196, 62, 196, 44, 204, 44 ) );
		foreach ( $wires as $k => $w2 ) {
			$pts = array();
			for ( $i = 0; $i < count( $w2 ); $i += 2 ) {
				$pts[] = $w2[ $i ] . ',' . $w2[ $i + 1 ];
			}
			$c .= '<polyline points="' . implode( ' ', $pts ) . '" fill="none" stroke="' . ( 6 === $k ? '#4A4466' : '#FF6B4A' ) . '" stroke-width="' . ( 6 === $k ? '1.4' : '2.2' ) . '"/>';
		}
		foreach ( $bk as $b ) {
			$c .= '<rect x="' . $b[0] . '" y="' . $b[1] . '" width="' . $b[2] . '" height="' . $b[3] . '" rx="' . ( '' === $b[4] ? 6 : 3 ) . '" fill="#3A2A3A" stroke="#FF6B4A" stroke-width="1.3"/>';
			if ( '' !== $b[4] ) {
				$c .= '<text x="' . ( $b[0] + $b[2] / 2 ) . '" y="' . ( $b[1] + $b[3] / 2 + 3.5 ) . '" text-anchor="middle" font-size="9.5" font-weight="700" font-family="JetBrains Mono,monospace" fill="#FAFAF7">' . $b[4] . '</text>';
			}
		}
		$c .= '<text x="115" y="9" text-anchor="middle" font-size="9" font-weight="700" font-family="JetBrains Mono,monospace" fill="#A99EF5">lw $t0, 8($s0)</text>';
	} elseif ( 'un-numero-todas-sus-formas' === $slug && sl_v21() ) {   // −58 en 8 bits: signo-magnitud, C1 y C2 (el bit de signo en coral)
		$rows = array( array( 'SM', '10111010' ), array( 'C1', '11000101' ), array( 'C2', '11000110' ) );
		$bw   = ( $w - 30 ) / 8;
		foreach ( $rows as $r => $x ) {
			$y  = 3 + $r * 24;
			$c .= '<text x="0" y="' . ( $y + 14 ) . '" font-size="9.5" font-weight="700" font-family="JetBrains Mono,monospace" fill="#A99EF5">' . $x[0] . '</text>';
			for ( $k = 0; $k < 8; $k++ ) {
				$on = '1' === $x[1][ $k ];
				$c .= '<rect x="' . round( 30 + $k * $bw, 1 ) . '" y="' . $y . '" width="' . round( $bw - 3, 1 ) . '" height="19" rx="3" fill="' . ( 0 === $k ? '#FF6B4A' : ( $on ? '#5B4BDB' : '#2A2640' ) ) . '" stroke="#3A3554"/>';
				$c .= '<text x="' . round( 30 + $k * $bw + ( $bw - 3 ) / 2, 1 ) . '" y="' . ( $y + 13.5 ) . '" text-anchor="middle" font-size="10" font-weight="700" font-family="JetBrains Mono,monospace" fill="' . ( $on || 0 === $k ? '#fff' : '#8E8AA3' ) . '">' . $x[1][ $k ] . '</text>';
			}
		}
	} elseif ( 'explorador-ieee-754' === $slug && sl_v21() ) {   // 37,6875 = 0x4216C000: signo, exponente y mantisa en sus colores
		$wd = 0x4216C000;
		$bw = ( $w - 6 ) / 32;
		for ( $i = 0; $i < 32; $i++ ) {
			$bit = ( $wd >> ( 31 - $i ) ) & 1;
			$col = 0 === $i ? '#FF6B4A' : ( $i <= 8 ? '#A99EF5' : '#F5A524' );
			$x   = $i * $bw + ( $i >= 1 ? 3 : 0 ) + ( $i >= 9 ? 3 : 0 );
			$c  .= '<rect x="' . round( $x, 1 ) . '" y="4" width="' . round( $bw - 1, 1 ) . '" height="24" rx="1.5" fill="' . $col . '" fill-opacity="' . ( $bit ? '1' : '.22' ) . '"/>';
		}
		$c .= '<text x="0" y="46" font-size="9" font-family="JetBrains Mono,monospace" fill="#8E8AA3">37,6875 = 1,00101101 × 2^5</text>';
		$c .= '<text x="0" y="66" font-size="15" font-weight="700" font-family="JetBrains Mono,monospace" fill="#FF9B80">4216 C000</text>';
	} elseif ( 'hamming-en-vivo' === $slug && sl_v21() ) {   // el mando de la tele: 0101101 enviada, 0111101 recibida (bit 5) y corregida
		$rows = array( array( '0101101', 0, '#16794B' ), array( '0111101', 5, '#C2362B' ) );
		$cw   = $w / 7;
		foreach ( $rows as $r => $x ) {
			$y = 6 + $r * 32;
			for ( $k = 0; $k < 7; $k++ ) {
				$pos = 7 - $k;
				$par = in_array( $pos, array( 1, 2, 4 ), true );
				$bad = ( $pos === $x[1] );
				$c  .= '<rect x="' . round( $k * $cw + 2, 1 ) . '" y="' . $y . '" width="' . round( $cw - 4, 1 ) . '" height="24" rx="4" fill="' . ( $bad ? '#C2362B' : '#2A2640' ) . '" stroke="' . ( $par ? '#FF6B4A' : '#A99EF5' ) . '" stroke-width="1.6"/>';
				$c  .= '<text x="' . round( $k * $cw + $cw / 2, 1 ) . '" y="' . ( $y + 16.5 ) . '" text-anchor="middle" font-size="12" font-weight="700" font-family="JetBrains Mono,monospace" fill="#FAFAF7">' . $x[0][ $k ] . '</text>';
			}
		}
	} elseif ( 'codigos-bcd-gray-utf8' === $slug && sl_v21() ) {   // 58 + 67 en BCD: 0101 1000 + 0110 0111 = 0001 0010 0101 (125)
		$rows = array( array( '', '0101', '1000' ), array( '+', '0110', '0111' ), array( '0001', '0010', '0101' ) );
		$cw   = $w / 3;
		foreach ( $rows as $r => $x ) {
			$y = 3 + $r * 24;
			foreach ( $x as $k => $v ) {
				if ( '' === $v ) {
					continue;
				}
				$res = ( 2 === $r );
				if ( '+' === $v ) {
					$c .= '<text x="' . round( $cw / 2, 1 ) . '" y="' . ( $y + 14 ) . '" text-anchor="middle" font-size="13" font-weight="700" fill="#C9C5DC">+</text>';
					continue;
				}
				$c .= '<rect x="' . round( $k * $cw + 3, 1 ) . '" y="' . $y . '" width="' . round( $cw - 6, 1 ) . '" height="19" rx="4" fill="' . ( $res ? '#FF6B4A' : '#2A2640' ) . '" stroke="#3A3554"/>';
				$c .= '<text x="' . round( $k * $cw + $cw / 2, 1 ) . '" y="' . ( $y + 13.5 ) . '" text-anchor="middle" font-size="11" font-weight="700" font-family="JetBrains Mono,monospace" fill="' . ( $res ? '#1E1B2E' : '#FAFAF7' ) . '">' . $v . '</text>';
			}
		}
	} elseif ( 'rendimiento-y-entrada-salida' === $slug && sl_v21() ) {   // Amdahl con el benchmark de 120 s: CPU ×5 (30 → 6 s), memoria 40 y disco 50
		$parts = array( array( 30, 6, '#5B4BDB' ), array( 40, 40, '#FF6B4A' ), array( 50, 50, '#16794B' ) );
		$sc    = ( $w - 4 ) / 120;
		foreach ( array( 0, 1 ) as $r ) {
			$x = 0;
			$y = 8 + $r * 30;
			foreach ( $parts as $p ) {
				$wd2 = $p[ $r ] * $sc;
				$c  .= '<rect x="' . round( $x, 1 ) . '" y="' . $y . '" width="' . round( max( 1, $wd2 - 1.5 ), 1 ) . '" height="20" rx="3" fill="' . $p[2] . '"/>';
				$x  += $wd2;
			}
			$c .= '<text x="' . round( $x + 4, 1 ) . '" y="' . ( $y + 14 ) . '" font-size="9.5" font-weight="700" font-family="JetBrains Mono,monospace" fill="#C9C5DC">' . ( $r ? '96 s' : '' ) . '</text>';
		}
		$c .= '<text x="4" y="22" font-size="9.5" font-weight="700" font-family="JetBrains Mono,monospace" fill="#fff">120 s</text>';
		$c .= '<text x="4" y="71" font-size="9" font-family="JetBrains Mono,monospace" fill="#FF9B80">G = 1,25</text>';
