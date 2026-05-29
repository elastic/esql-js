---
name: grammar-sync-update
description: >
  Use this skill when a grammar sync PR has landed (updating src/parser/antlr/) and a follow-up PR
  is needed to wire a new ES|QL command or update an existing one in the AST layer. Covers all files
  that need changes and the exact patterns to follow for both new and existing commands.
---

# Grammar Sync Update

## When to use

After the automated grammar sync bot merges a PR, this skill covers two scenarios:

**Scenario A — New command** (7 files to change): A brand-new `xxxCommand` rule appeared in the grammar with no handler anywhere in the TypeScript layer.

**Scenario B — Existing command update** (1–3 files to change): An existing command's grammar rule gained a new option, new labeled field, or new sub-rule (e.g. `CHANGE_POINT` gained `BY`, `WHERE IN` gained subquery support).

**You do NOT need this skill when:**
- The grammar sync PR only updated ANTLR-generated files with no new grammar rules (`.ts`, `.interp`, `.tokens` only) — those are handled automatically.

**You DO need this skill when:**
- A new `xxxCommand` rule appears in `src/parser/antlr/esql_parser.g4` with no corresponding `fromXxxCommand()` in `cst_to_ast_converter.ts`. → **Use Scenario A below.**
- The `esql_parser_listener.ts` has new `enterXxxCommand` / `exitXxxCommand` entries with no converter handler. → **Use Scenario A below.**
- An existing command's grammar rule changed (new context method, new labeled alternative, new keyword option) and the converter no longer covers it. → **Use Scenario B below.**

## How to detect what changed

```bash
# 1. See the full grammar diff
git diff HEAD~1 -- src/parser/antlr/esql_parser.g4

# 2. Identify new command rules (Scenario A)
git diff HEAD~1 -- src/parser/antlr/esql_parser.g4 | grep "^+.*[Cc]ommand\b"

# 3. Cross-check: listener entries without a converter handler (Scenario A)
grep "enter.*Command" src/parser/antlr/esql_parser_listener.ts | \
  sed 's/.*enter\([A-Za-z]*\)Command.*/\1/' | \
  while read cmd; do
    grep -q "from${cmd}Command" src/parser/core/cst_to_ast_converter.ts || echo "MISSING: $cmd"
  done

# 4. Identify changed rules for existing commands (Scenario B)
# Look for new labeled alternatives (_newField), new keyword tokens (BY, WITH, AS),
# or new sub-rule methods (ctx.newSubRule()) added to an existing command rule.
git diff HEAD~1 -- src/parser/antlr/esql_parser.g4 | grep "^[+-]" | grep -v "^---\|^+++"
```

If step 2/3 shows an entirely new command → **Scenario A**.
If step 4 shows additions inside an existing command rule → **Scenario B**.

---

## Files to change (all 7, in order)

### 1. `src/types.ts`

**Add a typed interface** if the command has named fields (target field, inference ID, optional config, etc.):

```ts
export interface ESQLAstXxxCommand extends ESQLCommand<'xxx'> {
  targetField: ESQLColumn;          // if there's a <qualifiedName> = <expr> pattern
  expression?: ESQLAstExpression;   // the RHS
  namedParameters?: ESQLMap;        // if there's a WITH { map } clause
}
```

Add it to the `ESQLAstCommand` union (search for `ESQLAstCommand` type definition):

```ts
export type ESQLAstCommand =
  | ESQLCommand
  | ...
  | ESQLAstXxxCommand;   // ← add here
```

If the command is trivial (only generic `args`, no named fields), use `ESQLCommand<'xxx'>` directly and skip the interface.

---

### 2. `src/ast/visitor/contexts.ts`

Add a visitor context class before the `// Expressions` comment (search for that comment to find the spot):

```ts
// XXX <qualifiedName> = <primaryExpression> [WITH <map>]
export class XxxCommandVisitorContext<
  Methods extends VisitorMethods = VisitorMethods,
  Data extends SharedData = SharedData,
> extends CommandVisitorContext<Methods, Data, ESQLAstXxxCommand> {}
```

Also add the import for `ESQLAstXxxCommand` at the top of the file.

---

### 3. `src/ast/visitor/types.ts`

Three additions. Search for `agent-marker` comments to find the exact insertion points:

**A — `CommandVisitorInput` union** (search for `agent-marker: append new VisitorInput entries here`):
```ts
VisitorInput<Methods, 'visitXxxCommand'> &
```

**B — `CommandVisitorOutput` union** (search for `agent-marker: append new VisitorOutput entries here`):
```ts
| VisitorOutput<Methods, 'visitXxxCommand'>
```

**C — `VisitorMethods` interface** (search for `visitUserAgentCommand?` — the last method — and append after it):
```ts
visitXxxCommand?: Visitor<contexts.XxxCommandVisitorContext<Visitors, Data>, any, any>;
```

---

### 4. `src/ast/visitor/global_visitor_context.ts`

Two additions:

**A — dispatcher `switch` case** (search for `visitCommandSpecific` — add a new `case` inside the `switch`):
```ts
case 'xxx': {
  if (!this.methods.visitXxxCommand) break;
  return this.visitXxxCommand(
    parent,
    commandNode as ESQLAstXxxCommand,
    input as any
  );
}
```

**B — public visitor method** (search for `visitUserAgentCommand` — the last public visitor method — and append after it):
```ts
public visitXxxCommand(
  parent: contexts.VisitorContext | null,
  node: ESQLAstXxxCommand,
  input: types.VisitorInput<Methods, 'visitXxxCommand'>
): types.VisitorOutput<Methods, 'visitXxxCommand'> {
  const context = new contexts.XxxCommandVisitorContext(this, node, parent);
  return this.visitWithSpecificContext('visitXxxCommand', context, input);
}
```

Add the import for `ESQLAstXxxCommand` at the top of the file.

---

### 5. `src/parser/core/cst_to_ast_converter.ts`

Two additions:

**A — dispatcher** (search for `agent-marker: append new command dispatcher branches here` and add before it):
```ts
const xxxCommandCtx = ctx.xxxCommand();

if (xxxCommandCtx) {
  return this.fromXxxCommand(xxxCommandCtx);
}
```

**B — converter method**:

```ts
private fromXxxCommand(ctx: cst.XxxCommandContext): ast.ESQLAstXxxCommand {
  const command = this.createCommand<'xxx', ast.ESQLAstXxxCommand>('xxx', ctx);

  // Assignment pattern: targetField = expression
  if (ctx._targetField && ctx.ASSIGN()) {
    const targetField = this.toColumn(ctx._targetField);
    const expression = this.fromPrimaryExpression(ctx.primaryExpression());
    const assignment = this.toFunction('=', ctx, undefined, 'binary-expression') as ast.ESQLBinaryExpression;
    assignment.args.push(targetField, expression);
    assignment.location = this.extendLocationToArgs(assignment);
    command.targetField = targetField;
    command.expression = expression;
    command.args.push(assignment);
  }

  // Optional WITH { map } clause
  const withOption = this.fromOptionalNamedParametersWithOption(ctx.namedParametersWithOption());
  if (withOption) {
    command.namedParameters = withOption.args[0] as ast.ESQLMap;
    command.args.push(withOption);
  }

  if (ctx.exception) {
    command.incomplete = true;
  }

  return command;
}
```

**Patterns by grammar shape** — pick the one that matches:

| Grammar shape | Converter call |
|---|---|
| Single column / qualified name | `this.toColumn(ctx._field)` |
| Primary expression | `this.fromPrimaryExpression(ctx.primaryExpression())` |
| Constant literal | `this.fromConstantToArray(ctx.constant())` |
| String token | `this.fromStringToken(ctx.STRING().symbol)` |
| Repeated sub-rule list | `ctx.xxxConfiguration_list()` loop |
| Boolean expression | `this.fromBooleanExpression(ctx.booleanExpression())` |
| Named option (`KEYWORD field`) | `Builder.option({ name: 'keyword', args: [...] }, { location })` |
| Assignment `target = expr` | `this.toFunction('=', ctx, undefined, 'binary-expression')` |
| WITH `{ map }` | `this.fromOptionalNamedParametersWithOption(ctx.namedParametersWithOption())` |

---

### 6. `src/pretty_print/constants.ts`

The pretty printer is visitor-based and **requires no changes** for most new commands.

Only update when:
- Command args have **no commas** between them → add to `commandsWithNoCommaArgSeparator`
- A command option uses `=` instead of a space before its value → add to `commandOptionsWithEqualsSeparator`

```ts
export const commandsWithNoCommaArgSeparator = new Set([
  'dissect', 'sample', 'fork', 'promql',
  'xxx', // ← add only if needed
]);
```

---

### 7. `src/parser/__tests__/xxx.test.ts` (new file)

Minimum coverage:
1. Parses basic syntax without errors
2. AST shape matches expected structure (`toMatchObject`)
3. Verifies `incomplete` flag for partial input
4. Round-trips through the pretty-printer

```ts
import { parse } from '..';
import { BasicPrettyPrinter } from '../../pretty_print';

describe('XXX command', () => {
  it('parses basic syntax', () => {
    const { ast, errors } = parse('FROM a | XXX target = field');
    expect(errors).toHaveLength(0);
    expect(ast[1]).toMatchObject({
      type: 'command',
      name: 'xxx',
      targetField: { type: 'column', name: 'target' },
    });
  });

  it('round-trips through the printer', () => {
    const src = 'FROM a | XXX target = field';
    const { ast } = parse(src);
    expect(BasicPrettyPrinter.query(ast)).toBe(src.toUpperCase());
  });
});
```

Reference test files: `src/parser/__tests__/user_agent.test.ts`, `src/parser/__tests__/change_point.test.ts`

---

## Checklist — Scenario A (new command)

- [ ] `src/types.ts` — new interface + union updated
- [ ] `src/ast/visitor/contexts.ts` — `XxxCommandVisitorContext` added
- [ ] `src/ast/visitor/types.ts` — input union, output union, `VisitorMethods` updated
- [ ] `src/ast/visitor/global_visitor_context.ts` — switch case + public method added
- [ ] `src/parser/core/cst_to_ast_converter.ts` — dispatcher + `fromXxxCommand()` added
- [ ] `src/pretty_print/constants.ts` — updated only if needed
- [ ] `src/parser/__tests__/xxx.test.ts` — tests added
- [ ] `yarn test` passes
- [ ] `yarn build` passes (no TypeScript errors)
- [ ] `yarn lint` passes

---

## Scenario B — Existing command update

The grammar changed an **existing** command's rule: it gained a new option keyword (`BY`, `WITH`, `AS`), a new labeled alternative (`_newField`), or a new sub-rule. The converter method already exists — you only need to extend it.

### Files to change

#### `src/parser/core/cst_to_ast_converter.ts`

Find the existing `fromXxxCommand()` method and add handling for what's new.

**New keyword option** (e.g. `CHANGE_POINT … BY field1, field2`):
```ts
if (ctx.BY()) {
  const args = (ctx._groupings ?? [])
    .filter((e) => !e.exception)
    .map((e) => this.fromBooleanExpressionToExpressionOrUnknown(e));

  const byOption = this.toByOption(ctx, args);
  if (byOption) {
    command.args.push(byOption);
    command.incomplete ||= byOption.incomplete;
  }
}
```

**New labeled field** (e.g. `_targetField` added to an existing rule):
```ts
if (ctx._targetField) {
  const col = this.toColumn(ctx._targetField);
  command.targetField = col;   // only if types.ts interface has this field
  command.args.push(col);
}
```

**New sub-rule variant** (e.g. `WHERE IN` gained a `LogicalInSubquery` alternative):
```ts
// In the existing expression handler, add a branch before the current logic:
if (ctx instanceof cst.LogicalInSubqueryContext) {
  return this.fromLogicalInSubquery(ctx);
}
// then add the new private method:
private fromLogicalInSubquery(ctx: cst.LogicalInSubqueryContext): ast.ESQLAstExpression {
  const left = this.fromLogicalInLeft(ctx.valueExpression());
  const right = this.fromSubquery(ctx.subquery());
  return this.toLogicalInFunction(ctx, left, right, ctx.stop?.stop ?? right.location.max);
}
```

#### `src/types.ts` — only if the command gains new named fields

If the existing interface (e.g. `ESQLAstChangePointCommand`) needs to expose the new option as a typed field, add it:
```ts
export interface ESQLAstChangePointCommand extends ESQLCommand<'change_point'> {
  value: ESQLColumn;
  key?: ESQLColumn;
  target?: { type: ESQLColumn; pvalue: ESQLColumn };
  // ← add new field only if consumers need typed access
}
```

Skip this if the new option is only accessible via generic `args` — that's fine for options that don't need first-class API access.

#### Tests

Always update or add tests. For an existing command update, add to the existing test file (`src/parser/__tests__/xxx.test.ts`) rather than creating a new one.

Cover:
1. The new option/field parses correctly
2. The AST shape is correct (`toMatchObject`)
3. The pretty-printer round-trips the new syntax
4. Walker traversal visits any new nodes (if the new option introduces new AST nodes)

**Real example — `CHANGE_POINT BY`** (PR #104):
- Added 21 lines to `change_point.test.ts`
- Added 14 lines to `fromChangePointCommand()` in `cst_to_ast_converter.ts`
- No `types.ts` change (BY option fits in generic `args`)
- No visitor changes

**Real example — `WHERE IN` subquery** (PR #107):
- Refactored `fromLogicalIn()` in `cst_to_ast_converter.ts` into smaller methods + added subquery branch
- Added tests to `src/parser/__tests__/function.test.ts` and `src/ast/walker/__tests__/walker.test.ts`
- Added pretty-printer tests to 4 existing test files
- No `types.ts` or visitor changes (subquery uses existing `ESQLParens` type)

### Checklist — Scenario B (existing command update)

- [ ] `src/parser/core/cst_to_ast_converter.ts` — existing handler extended
- [ ] `src/types.ts` — interface updated only if new named fields are needed
- [ ] Tests added/extended in existing test file
- [ ] Pretty-printer tests added if new syntax affects printing
- [ ] Walker tests added if new syntax introduces new traversable nodes
- [ ] `yarn test` passes
- [ ] `yarn build` passes
- [ ] `yarn lint` passes

---

## Reference: simple vs complex existing commands

| Command | Interface | Visitor context | Test file |
|---|---|---|---|
| `SAMPLE` | none (generic) | none | `sample.test.ts` |
| `URI_PARTS` | `ESQLAstUriPartsCommand` | `UriPartsCommandVisitorContext` | `uri_parts.test.ts` |
| `USER_AGENT` | `ESQLAstUserAgentCommand` | `UserAgentCommandVisitorContext` | `user_agent.test.ts` |
| `CHANGE_POINT` | `ESQLAstChangePointCommand` | none (no typed visitor) | `change_point.test.ts` |
| `RERANK` | `ESQLAstRerankCommand` | `RerankCommandVisitorContext` | `rerank.test.ts` |
