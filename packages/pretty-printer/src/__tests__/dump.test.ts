/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { dump } from '../dump';
import {
  text,
  line,
  softline,
  hardline,
  breakParent,
  group,
  conditionalGroup,
  indent,
  indentIfBreak,
  align,
  fill,
  ifBreak,
  lineSuffix,
  lineSuffixBoundary,
  label,
  trim,
  cursor,
} from '../builders';

describe('dump', () => {
  test('prints a plain text string', () => {
    expect(dump(text('hello'))).toBe('text "hello"');
  });

  test('prints an empty string', () => {
    expect(dump('')).toBe('text ""');
  });

  test('prints a line node', () => {
    expect(dump(line)).toBe('line');
  });

  test('prints a softline node', () => {
    expect(dump(softline)).toBe('line (soft)');
  });

  test('prints a hardline (array with line + break-parent)', () => {
    expect('\n' + dump(hardline)).toBe(`
[]
├─ line (hard)
└─ break-parent`);
  });

  test('prints break-parent', () => {
    expect(dump(breakParent)).toBe('break-parent');
  });

  test('prints trim', () => {
    expect(dump(trim)).toBe('trim');
  });

  test('prints cursor', () => {
    expect(dump(cursor)).toBe('cursor');
  });

  test('prints line-suffix-boundary', () => {
    expect(dump(lineSuffixBoundary)).toBe('line-suffix-boundary');
  });

  test('prints a group with text contents', () => {
    expect('\n' + dump(group('hello'))).toBe(`
group
└─ contents: text "hello"`);
  });

  test('prints a group with shouldBreak', () => {
    expect('\n' + dump(group('x', { shouldBreak: true }))).toBe(`
group (shouldBreak)
└─ contents: text "x"`);
  });

  test('prints indent node', () => {
    expect('\n' + dump(indent('abc'))).toBe(`
indent
└─ contents: text "abc"`);
  });

  test('prints align node with numeric n', () => {
    expect('\n' + dump(align(4, 'x'))).toBe(`
align (n=4)
└─ contents: text "x"`);
  });

  test('prints fill node', () => {
    expect('\n' + dump(fill(['a', line, 'b', line, 'c']))).toBe(`
fill
├─ parts[0]: text "a"
├─ parts[1]: line
├─ parts[2]: text "b"
├─ parts[3]: line
└─ parts[4]: text "c"`);
  });

  test('prints ifBreak node', () => {
    expect('\n' + dump(ifBreak('broken', 'flat'))).toBe(`
if-break
├─ breakContents: text "broken"
└─ flatContents: text "flat"`);
  });

  test('prints lineSuffix node', () => {
    expect('\n' + dump(lineSuffix(' // comment'))).toBe(`
line-suffix
└─ contents: text " // comment"`);
  });

  test('prints label node', () => {
    expect('\n' + dump(label('myLabel', 'content'))).toBe(`
label (label = "myLabel")
└─ contents: text "content"`);
  });

  test('prints indentIfBreak node', () => {
    const id = Symbol('test');
    const node = indentIfBreak('x', { groupId: id });

    expect('\n' + dump(node)).toBe(`
indent-if-break
└─ contents: text "x"`);
  });

  test('prints conditionalGroup with expanded states', () => {
    const node = conditionalGroup(['compact', 'medium', 'expanded']);

    expect('\n' + dump(node)).toBe(`
group
├─ contents: text "compact"
├─ expandedStates[0]: text "medium"
└─ expandedStates[1]: text "expanded"`);
  });

  test('prints a nested array (concatenation)', () => {
    expect('\n' + dump(['FROM', ' ', 'index'])).toBe(`
[]
├─ text "FROM"
├─ text " "
└─ text "index"`);
  });

  test('prints a nested tree', () => {
    const doc = group([indent([softline, 'hello', line, 'world']), softline]);

    expect('\n' + dump(doc)).toBe(`
group
└─ contents: []
   ├─ indent
   │  └─ contents: []
   │     ├─ line (soft)
   │     ├─ text "hello"
   │     ├─ line
   │     └─ text "world"
   └─ line (soft)`);
  });
});
