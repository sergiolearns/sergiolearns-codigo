"""Cambios al núcleo de SPIM para el navegador (WASI): sin temporizadores, espera de entrada sin bloquear,
contador de instrucciones, lectura de fuentes desde memoria, recuento de errores y manejador de excepciones incrustado."""
import json
s = open('run.cpp').read()
a = s.index('#ifdef _WIN32\n\t  SleepEx(0, TRUE);'); b = s.index('#endif', a) + len('#endif')
s = s[:a] + '/* sl: WASI has no interval timers; CP0 timer not simulated */' + s[b:]
i = s.index('\nstart_CP0_timer ()'); j = s.index('\n{', i); k = s.index('\n}\n', j)
s = s[:j] + '\n{\n  /* sl: no timer under WASI */\n' + s[k:]
s = s.replace('#include <signal.h>\n#include <sys/time.h>', '/* sl: no signal/itimer under WASI */')
old = '''	    case Y_SYSCALL_OP:
	      if (!do_syscall ())
		return false;
	      break;'''
assert old in s
s = s.replace(old, '''	    case Y_SYSCALL_OP:
	      if (sl_syscall_needs_input ())
		{ sl_waiting_input = 1; return true; }	/* sl: PC stays on the syscall */
	      if (!do_syscall ())
		return false;
	      break;''')
s = s.replace('#include "spim.h"', '#include "spim.h"\nextern int sl_waiting_input; int sl_syscall_needs_input (void);', 1)
old = '''	  /* After instruction executes: */
	  PC += BYTES_PER_WORD;'''
assert old in s
s = s.replace(old, old + '\n	  { extern unsigned int sl_icount; sl_icount++; }')
open('run.cpp', 'w').write(s)
s = open('spim-utils.cpp').read()
s = s.replace('  FILE *file = fopen (name, "rt");', '  extern FILE *sl_open_source (char *name);\n  FILE *file = sl_open_source (name);')
open('spim-utils.cpp', 'w').write(s)
s = open('parser_yacc.cpp').read()
s = s.replace('yyerror (char *s)\n{\n  parse_error_occurred = true;', 'yyerror (char *s)\n{\n  { extern int sl_parse_errors; sl_parse_errors++; }\n  parse_error_occurred = true;')
open('parser_yacc.cpp', 'w').write(s)
open('exc_s.h', 'w').write('static const char SL_EXC_S[] = ' + json.dumps(open('exceptions.s', encoding='latin-1').read()) + ';\n')
