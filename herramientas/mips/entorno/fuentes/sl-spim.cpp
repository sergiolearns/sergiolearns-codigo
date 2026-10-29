/* sl-spim.cpp - SergioLearns front-end for the SPIM core compiled to WebAssembly (WASI reactor).
   SPIM S20 is Copyright (c) 1990-2017 James R. Larus, BSD license (see the CPU sources).
   This front-end: SergioLearns, 2026. */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
#include "spim.h"
#include "string-stream.h"
#include "spim-utils.h"
#include "inst.h"
#include "reg.h"
#include "mem.h"
#include "data.h"
#include "sym-tbl.h"
#include "version.h"
#include "exc_s.h"

#define EX(n) __attribute__((export_name(n)))

bool bare_machine = false, delayed_branches = false, delayed_loads = false;
bool accept_pseudo_insts = true, quiet = false, mapped_io = false;
char *exception_file_name = (char *) "@exc";
port message_out, console_out, console_in;
int spim_return_value;
unsigned int sl_icount = 0;
int sl_waiting_input = 0, sl_parse_errors = 0, sl_run_errored = 0;

/* ---- growable byte buffers shared with JavaScript ---- */
typedef struct { char *p; int n, cap; } buf;
static buf OUT, MSG, INP, SRC; static int INP_pos = 0;
static void bput (buf *b, const char *s, int n) {
  if (b->n + n + 1 > b->cap) { b->cap = (b->n + n + 1) * 2 + 256; b->p = (char *) realloc (b->p, b->cap); }
  memcpy (b->p + b->n, s, n); b->n += n; b->p[b->n] = 0;
}
static void bvprintf (buf *b, const char *fmt, va_list ap) {
  char tmp[4096]; int n = vsnprintf (tmp, sizeof tmp, fmt, ap);
  if (n < 0) return; if (n >= (int) sizeof tmp) n = sizeof tmp - 1; bput (b, tmp, n);
}

FILE *sl_open_source (char *name) {
  if (!strcmp (name, "@exc")) return fmemopen ((void *) SL_EXC_S, strlen (SL_EXC_S), "r");
  if (!strcmp (name, "@prog") && SRC.n) return fmemopen (SRC.p, SRC.n, "r");
  return NULL;
}

void error (char *fmt, ...) { va_list a; va_start (a, fmt); bvprintf (&MSG, fmt, a); va_end (a); }
void run_error (char *fmt, ...) { sl_run_errored = 1; va_list a; va_start (a, fmt); bvprintf (&MSG, fmt, a); va_end (a); }
void fatal_error (char *fmt, ...) { va_list a; va_start (a, fmt); bvprintf (&MSG, fmt, a); va_end (a); force_break = true; }
void write_output (port fp, char *fmt, ...) {
  va_list a; va_start (a, fmt); bvprintf (fp.i == 1 ? &OUT : &MSG, fmt, a); va_end (a);
}
/* fgets semantics on the input typed by the reader (one line at a time). */
void read_input (char *str, int str_size) {
  char *ptr = str;
  while (1 < str_size && INP_pos < INP.n) {
    char c = INP.p[INP_pos++]; *ptr++ = c; str_size -= 1;
    if (c == '\n') break;
  }
  if (0 < str_size) *ptr = '\0';
}
int console_input_available () { return INP_pos < INP.n; }
char get_console_char () { return INP_pos < INP.n ? INP.p[INP_pos++] : 0; }
void put_console_char (char c) { bput (&OUT, &c, 1); }

/* A read syscall needs a complete line (or one char for read_char). */
int sl_syscall_needs_input (void) {
  int v0 = R[REG_V0];
  if (v0 != 5 && v0 != 6 && v0 != 7 && v0 != 8 && v0 != 12) return 0;
  if (v0 == 12) return !(INP_pos < INP.n);
  if (v0 == 8 && R[REG_A1] <= 1) return 0;
  for (int i = INP_pos; i < INP.n; i++) if (INP.p[i] == '\n') return 0;
  return 1;
}

/* ---- exports ---- */
EX("sl_alloc") char *sl_alloc (int n) { return (char *) malloc (n + 1); }
EX("sl_free") void sl_free (char *p) { free (p); }
EX("sl_out") char *sl_out () { return OUT.p ? OUT.p : (char *) ""; }
EX("sl_out_len") int sl_out_len () { return OUT.n; }
EX("sl_msg") char *sl_msg () { return MSG.p ? MSG.p : (char *) ""; }
EX("sl_msg_len") int sl_msg_len () { return MSG.n; }
EX("sl_clear_io") void sl_clear_io () { OUT.n = 0; MSG.n = 0; }
EX("sl_input") void sl_input (char *p, int n) { bput (&INP, p, n); }
EX("sl_input_pending") int sl_input_pending () { return INP.n - INP_pos; }

/* opts: 1 = bare machine, 2 = delayed branches, 4 = delayed loads, 8 = no pseudo-instructions,
   16 = do not load the exception handler. Returns 1 if the program assembled without errors. */
EX("sl_load") int sl_load (char *src, int n, int opts) {
  message_out.i = 2; console_out.i = 1; console_in.i = 0;
  bare_machine = opts & 1; delayed_branches = opts & 2; delayed_loads = opts & 4;
  accept_pseudo_insts = !(opts & 8);
  SRC.n = 0; bput (&SRC, src, n);
  initialize_world ((opts & 16) ? NULL : (char *) "@exc", false);
  initialize_run_stack (0, NULL);
  sl_parse_errors = 0;
  bool ok = read_assembly_file ((char *) "@prog");
  PC = starting_address ();
  sl_waiting_input = 0;
  return ok && sl_parse_errors == 0;
}

/* Runs up to STEPS instructions. Returns 0 = finished, 1 = can continue, 2 = breakpoint,
   3 = waiting for input, 4 = stopped by an error. */
EX("sl_run") int sl_run (int steps, int cont_bkpt) {
  bool continuable, bp;
  mem_addr addr = PC == 0 ? starting_address () : PC;
  sl_waiting_input = 0; sl_run_errored = 0; force_break = false;
  bp = run_program (addr, steps, false, cont_bkpt, &continuable);
  if (sl_waiting_input) return 3;
  if (!continuable) return sl_run_errored ? 4 : 0;
  if (bp) return 2;
  return 1;
}
EX("sl_icount") unsigned int sl_icount_get () { return sl_icount; }
EX("sl_exit_code") int sl_exit_code () { return spim_return_value; }
EX("sl_regs") reg_word *sl_regs () { return R; }
EX("sl_fpr") double *sl_fpr () { return FPR; }
static unsigned int SPEC[16];
EX("sl_spec") unsigned int *sl_spec () {
  SPEC[0] = PC; SPEC[1] = CP0_EPC; SPEC[2] = CP0_Cause; SPEC[3] = CP0_BadVAddr; SPEC[4] = CP0_Status;
  SPEC[5] = HI; SPEC[6] = LO; SPEC[7] = FIR; SPEC[8] = FCSR; SPEC[9] = FCCR; SPEC[10] = FEXR; SPEC[11] = FENR;
  SPEC[12] = data_top; SPEC[13] = text_top; SPEC[14] = k_text_top; SPEC[15] = stack_bot;
  return SPEC;
}
static str_stream SS;
EX("sl_text") char *sl_text (int kernel) {
  ss_clear (&SS);
  if (kernel) format_insts (&SS, K_TEXT_BOT, k_text_top); else format_insts (&SS, TEXT_BOT, text_top);
  return ss_to_string (&SS);
}
EX("sl_inst") char *sl_inst (unsigned int addr) { return inst_to_string (addr); }
/* Memory for the data views, read without side effects (no exceptions). */
EX("sl_data_seg") mem_word *sl_data_seg () { return data_seg; }
EX("sl_stack_seg") mem_word *sl_stack_seg () { return stack_seg; }
EX("sl_kdata_seg") mem_word *sl_kdata_seg () { return k_data_seg; }
EX("sl_kdata_top") unsigned int sl_kdata_top () { return k_data_top; }
EX("sl_bp_add") void sl_bp_add (unsigned int a) { add_breakpoint (a); }
EX("sl_bp_del") void sl_bp_del (unsigned int a) { delete_breakpoint (a); }
EX("sl_set_reg") void sl_set_reg (int r, int v) { if (r > 0 && r < 32) R[r] = v; else if (r == 32) PC = v; else if (r == 33) HI = v; else if (r == 34) LO = v; }
EX("sl_sym") unsigned int sl_sym (char *name) { return find_symbol_address (name); }
EX("sl_version") const char *sl_version () { return SPIM_VERSION; }
