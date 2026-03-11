# Printer — Wadler-Lindig Pretty-Printer

A pretty-printing library based on the Wadler-Lindig document algebra
(Philip Wadler, *"A prettier printer"*, 2003; Christian Lindig's strict
formulation). The implementation draws heavily from Prettier's internal
`doc-printer`.

## How it works

Pretty-printing is a two-phase process:

1. **Build** a *document tree* (`Doc`) using combinators (see below). The tree
   describes the *structure* of possible layouts — it contains no concrete line
   breaks or indentation yet.
2. **Layout** the tree into a concrete string. The layout engine fits as much
   content on each line as possible (up to `printWidth`), breaking `group`
   nodes when the flat representation would exceed the available width.

Example:

```ts
import { text, group, indent, line, softline, join, layout } from './printer';

const doc = group([
  text('SELECT'),
  indent([line, join(
    [text(','), line],
    [text('a'), text('b'), text('c')])]
  ),
  line,
  text('FROM t'),
]);

layout(doc, { printWidth: 40 });
// SELECT
//   a,
//   b,
//   c
// FROM t

layout(doc, { printWidth: 80 });
// SELECT a, b, c FROM t
```

## `layout(tree, opts?)`

The main entry point. Takes a *print tree* and returns the formatted string.

Options:

| Option       | Type                                   | Default | Description                              |
|--------------|----------------------------------------|---------|------------------------------------------|
| `printWidth` | `number`                               | `80`    | Target maximum line width.               |
| `tabWidth`   | `number`                               | `2`     | Spaces per indentation level.            |
| `useTabs`    | `boolean`                              | `false` | Indent with tabs instead of spaces.      |
| `endOfLine`  | `'\n'` \| `'\r\n'` \| `'\r'` | `'\n'`  | Line-ending character(s).                          |


## Combinators / Commands

The printer provides a set of combinators (or "commands") for building print
trees. These are the building blocks for describing the structure of the output.

### Primitives

- `text(string)` &mdash; Literal text, printed as-is. Must **not** contain
  newline characters.
- `Doc[]` (array) &mdash; Concatenation. An array of docs is rendered left to
  right.

### Line breaks

- `line` &mdash; Space `" "` in flat mode; *newline + indent* in break mode.
- `softline` &mdash; Nothing `""` in flat mode; *newline + indent* in break mode.
- `hardline` &mdash; Always a *newline + indent*. Forces the enclosing group to
  break.
- `hardlineWithoutBreakParent` &mdash; Like `hardline` but does **not** force
  the parent group to break.
- `literalline` &mdash; Hard line break that indents to the *root* position
  (set by `markAsRoot`) instead of the current nesting level. Preserves
  trailing whitespace. Forces enclosing groups to break.
- `literallineWithoutBreakParent` &mdash; Like `literalline` but does **not**
  force the parent group to break.

### Grouping

- `group(tree, opts?)` &mdash; The core break-decision unit. Tries to render
  print tree node flat (single line). If it exceeds the remaining width, switches
  to break mode. Options: `shouldBreak` (force break), `id` (symbol for
  cross-referencing with `ifBreak`/`indentIfBreak`).
- `conditionalGroup(states, opts?)` &mdash; Multi-state group. Provide
  alternative layouts from most compact to most expanded. The engine tries each
  in order and uses the first one that fits; if none fits, the last state is
  rendered in break mode.
- `fill(parts)` &mdash; Wrapping layout. `parts` alternate between content and
  line-break docs: `[item, line, item, line, ...]`. Fills each line with as
  many items as fit before breaking — unlike `group`, which is all-or-nothing.

### Indentation

- `indent(tree)` &mdash; Increase indentation by one tab level.
- `align(n, tree)` &mdash; Increase indentation by exactly `n` spaces (not a
  tab level). Special values: `-1` (dedent one level),
  `Number.NEGATIVE_INFINITY` (reset to root), `{ type: 'root' }` (mark current
  indent as root).
- `dedent(tree)` &mdash; Decrease indentation by one level. Shorthand for
  `align(-1, tree)`.
- `dedentToRoot(tree)` &mdash; Reset indentation to root (column 0 or the
  position set by `markAsRoot`).
- `markAsRoot(tree)` &mdash; Mark the current indentation as the "root"
  position for `literalline`.

### Conditional content

- `ifBreak(breakDoc, flatDoc?, opts?)` &mdash; Emit `breakDoc` when the
  enclosing group (or a group referenced by `groupId`) is in break mode;
  otherwise emit `flatDoc`.
- `indentIfBreak(tree, opts)` &mdash; Conditionally indent `doc` based on a
  referenced group's mode. Optimized form of
  `ifBreak(indent(tree), doc, { groupId })`. Set `negate: true` to reverse.
- `breakParent` &mdash; Force all ancestor groups to break. Propagated during
  a pre-pass (`propagateBreaks`).

### Comments & line suffixes

- `lineSuffix(tree)` &mdash; Buffer `doc` and emit it at the end of the current
  line, just before the next line break. Used for trailing comments.
- `lineSuffixBoundary` &mdash; Force-flush any pending `lineSuffix` content.
  Prevents trailing comments from leaking past syntactic boundaries.

### Miscellaneous

- `label(lbl, tree)` &mdash; Annotate a doc with an opaque label for
  language-specific heuristic introspection. No effect on layout.
- `trim` &mdash; Remove all trailing whitespace from the output at the current
  position.
- `cursor` &mdash; Placeholder for cursor-position tracking. The layout engine
  emits a sentinel; callers can locate it to preserve cursor position after
  formatting.
- `join(separator, trees)` &mdash; Join an array of docs with `separator`
  between each pair.
- `bracketedList(open, close, sep, items)` &mdash; Convenience for a grouped,
  indented, bracketed list. Flat: `(a, b, c)`. Broken:
  ```
  (
    a,
    b,
    c
  )
  ```
- `addAlignmentToDoc(doc, size, tabWidth)` &mdash; Convert an absolute
  indentation size into nested `indent`/`align` wrappers inside `dedentToRoot`.
  Used for embedded content needing a specific indentation level.

## Traversal

- `traverse(doc, { onEnter?, onExit? })` &mdash; Generic depth-first traversal
  of a doc tree using an explicit stack (no recursion). Return `false` from
  `onEnter` to skip a node's children.
