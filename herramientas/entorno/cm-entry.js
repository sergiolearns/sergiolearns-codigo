// SergioLearns — lo que se empaqueta del editor del entorno sl-ide (v1.1, 28 oct 2026). Compatible con sl-ide v1.0 (mismos nombres).
export {EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, highlightSpecialChars,
  Decoration, ViewPlugin, WidgetType, gutter, GutterMarker, dropCursor, rectangularSelection, crosshairCursor, tooltips} from '@codemirror/view';
export {EditorState, Compartment, StateField, StateEffect, RangeSetBuilder, Prec, EditorSelection} from '@codemirror/state';
export {history, defaultKeymap, historyKeymap, indentWithTab, toggleComment, insertNewlineAndIndent} from '@codemirror/commands';
export {indentOnInput, bracketMatching, syntaxHighlighting, HighlightStyle, indentUnit, foldGutter, foldKeymap, syntaxTree} from '@codemirror/language';
export {closeBrackets, closeBracketsKeymap, autocompletion, completionKeymap, startCompletion, closeCompletion, acceptCompletion, snippetCompletion} from '@codemirror/autocomplete';
export {highlightSelectionMatches, search, searchKeymap, openSearchPanel, gotoLine} from '@codemirror/search';
export {python, pythonLanguage} from '@codemirror/lang-python';
export {java, javaLanguage} from '@codemirror/lang-java';
export {tags, styleTags} from '@lezer/highlight';
export const version = '6.0.2-sl1.1';
