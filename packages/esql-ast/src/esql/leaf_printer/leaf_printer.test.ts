/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type {
  ESQLAstComment,
  ESQLAstCommentMultiLine,
  ESQLColumn,
  ESQLIdentifier,
  ESQLParam,
  ESQLParamKinds,
  ESQLSource,
  ESQLStringLiteral,
} from '@elastic/esql-types';
import { LeafPrinter } from './leaf_printer';

const loc = { min: 0, max: 0 };
const base = { name: '', text: '', location: loc, incomplete: false };

function id(name: string): ESQLIdentifier {
  return { ...base, name, type: 'identifier' };
}

function strLit(valueUnquoted: string, unquoted?: boolean): ESQLStringLiteral {
  return {
    ...base,
    name: valueUnquoted,
    type: 'literal',
    literalType: 'keyword',
    value: valueUnquoted,
    valueUnquoted,
    unquoted,
  };
}

function param(
  paramType: ESQLParam['paramType'],
  value: string | number,
  paramKind: ESQLParamKinds = '?'
): ESQLParam {
  return {
    ...base,
    name: '',
    type: 'literal',
    literalType: 'param',
    paramKind,
    paramType,
    value,
  } as ESQLParam;
}

describe('LeafPrinter', () => {
  describe('source()', () => {
    test('prints name-based source', () => {
      const node: ESQLSource = { ...base, name: 'my-index', type: 'source', sourceType: 'index' };
      expect(LeafPrinter.source(node)).toBe('my-index');
    });

    test('prints quoted index', () => {
      const node: ESQLSource = {
        ...base,
        type: 'source',
        sourceType: 'index',
        index: strLit('my-index'),
      };
      expect(LeafPrinter.source(node)).toBe('"my-index"');
    });

    test('prints unquoted index', () => {
      const node: ESQLSource = {
        ...base,
        type: 'source',
        sourceType: 'index',
        index: strLit('my-index', true),
      };
      expect(LeafPrinter.source(node)).toBe('my-index');
    });

    test('prepends prefix with colon', () => {
      const node: ESQLSource = {
        ...base,
        name: 'idx',
        type: 'source',
        sourceType: 'index',
        prefix: strLit('cluster', true),
      };
      expect(LeafPrinter.source(node)).toBe('cluster:idx');
    });

    test('appends selector with double colon', () => {
      const node: ESQLSource = {
        ...base,
        name: 'idx',
        type: 'source',
        sourceType: 'index',
        selector: strLit('failures', true),
      };
      expect(LeafPrinter.source(node)).toBe('idx::failures');
    });

    test('prints source with prefix, index, and selector', () => {
      const node: ESQLSource = {
        ...base,
        type: 'source',
        sourceType: 'index',
        prefix: strLit('cluster', true),
        index: strLit('idx', true),
        selector: strLit('failures', true),
      };
      expect(LeafPrinter.source(node)).toBe('cluster:idx::failures');
    });
  });

  describe('identifier()', () => {
    test('prints simple identifier without quotes', () => {
      expect(LeafPrinter.identifier(id('myField'))).toBe('myField');
    });

    test('prints identifier starting with underscore unquoted', () => {
      expect(LeafPrinter.identifier(id('_private'))).toBe('_private');
    });

    test('prints identifier starting with @ unquoted', () => {
      expect(LeafPrinter.identifier(id('@timestamp'))).toBe('@timestamp');
    });

    test('prints identifier with alphanumeric parts unquoted', () => {
      expect(LeafPrinter.identifier(id('field123'))).toBe('field123');
    });

    test('wraps identifier containing hyphen in backticks', () => {
      expect(LeafPrinter.identifier(id('field-name'))).toBe('`field-name`');
    });

    test('wraps identifier starting with digit in backticks', () => {
      expect(LeafPrinter.identifier(id('123field'))).toBe('`123field`');
    });

    test('wraps identifier containing space in backticks', () => {
      expect(LeafPrinter.identifier(id('field name'))).toBe('`field name`');
    });

    test('escapes backtick chars inside a quoted identifier', () => {
      expect(LeafPrinter.identifier(id('field`name'))).toBe('`field``name`');
    });

    test('wraps ES|QL keyword in backticks', () => {
      // 'from' is a reserved keyword in the ES|QL grammar
      expect(LeafPrinter.identifier(id('from'))).toBe('`from`');
    });
  });

  describe('column()', () => {
    function col(...names: string[]): ESQLColumn {
      return { ...base, type: 'column', args: names.map(id), parts: names, quoted: false };
    }

    test('prints single-part column', () => {
      expect(LeafPrinter.column(col('field'))).toBe('field');
    });

    test('prints multi-part column joined with dots', () => {
      expect(LeafPrinter.column(col('a', 'b', 'c'))).toBe('a.b.c');
    });

    test('prints column containing a param arg', () => {
      const node: ESQLColumn = {
        ...base,
        type: 'column',
        args: [id('prefix'), param('unnamed', '')],
        parts: ['prefix'],
        quoted: false,
      };
      expect(LeafPrinter.column(node)).toBe('prefix.?');
    });

    test('prints qualified column with bracket notation', () => {
      const qualifier = id('myIndex');
      const node: ESQLColumn = {
        ...base,
        type: 'column',
        qualifier,
        args: [qualifier, id('col')],
        parts: ['myIndex', 'col'],
        quoted: false,
      };
      expect(LeafPrinter.column(node)).toBe('[myIndex].[col]');
    });

    test('prints qualified multi-part column', () => {
      const qualifier = id('idx');
      const node: ESQLColumn = {
        ...base,
        type: 'column',
        qualifier,
        args: [qualifier, id('a'), id('b')],
        parts: ['idx', 'a', 'b'],
        quoted: false,
      };
      expect(LeafPrinter.column(node)).toBe('[idx].[a.b]');
    });
  });

  describe('string()', () => {
    test('wraps string in double quotes', () => {
      expect(LeafPrinter.string({ valueUnquoted: 'hello', unquoted: false })).toBe('"hello"');
    });

    test('returns unquoted string as-is when unquoted=true', () => {
      expect(LeafPrinter.string({ valueUnquoted: 'hello', unquoted: true })).toBe('hello');
    });

    test('escapes backslash', () => {
      expect(LeafPrinter.string({ valueUnquoted: 'a\\b' })).toBe('"a\\\\b"');
    });

    test('escapes double quote', () => {
      expect(LeafPrinter.string({ valueUnquoted: 'say "hi"' })).toBe('"say \\"hi\\""');
    });

    test('escapes newline', () => {
      expect(LeafPrinter.string({ valueUnquoted: 'line1\nline2' })).toBe('"line1\\nline2"');
    });

    test('escapes carriage return', () => {
      expect(LeafPrinter.string({ valueUnquoted: 'a\rb' })).toBe('"a\\rb"');
    });

    test('escapes tab', () => {
      expect(LeafPrinter.string({ valueUnquoted: 'a\tb' })).toBe('"a\\tb"');
    });
  });

  describe('literal()', () => {
    test('prints NULL literal', () => {
      expect(
        LeafPrinter.literal({ ...base, type: 'literal', literalType: 'null', value: '' })
      ).toBe('NULL');
    });

    test('prints TRUE boolean', () => {
      expect(
        LeafPrinter.literal({ ...base, type: 'literal', literalType: 'boolean', value: 'TRUE' })
      ).toBe('TRUE');
    });

    test('prints FALSE boolean', () => {
      expect(
        LeafPrinter.literal({ ...base, type: 'literal', literalType: 'boolean', value: 'false' })
      ).toBe('FALSE');
    });

    test('prints integer literal', () => {
      expect(
        LeafPrinter.literal({ ...base, type: 'literal', literalType: 'integer', value: 42 })
      ).toBe('42');
    });

    test('prints rounded double with .0 suffix', () => {
      expect(
        LeafPrinter.literal({ ...base, type: 'literal', literalType: 'double', value: 3 })
      ).toBe('3.0');
    });

    test('prints non-rounded double without suffix', () => {
      expect(
        LeafPrinter.literal({ ...base, type: 'literal', literalType: 'double', value: 3.14 })
      ).toBe('3.14');
    });

    test('prints keyword literal as quoted string', () => {
      expect(LeafPrinter.literal(strLit('hello'))).toBe('"hello"');
    });

    test('prints time_duration literal', () => {
      expect(
        LeafPrinter.literal({
          ...base,
          type: 'literal',
          literalType: 'time_duration',
          value: '5d',
          quantity: 5,
          unit: 'd',
        })
      ).toBe('5d');
    });

    test('prints date_period literal', () => {
      expect(
        LeafPrinter.literal({
          ...base,
          type: 'literal',
          literalType: 'date_period',
          value: '3 months',
          quantity: 3,
          unit: 'months',
        })
      ).toBe('3 months');
    });

    test('prints param literal', () => {
      expect(LeafPrinter.literal(param('unnamed', ''))).toBe('?');
    });
  });

  describe('param()', () => {
    test('prints unnamed param as ?', () => {
      expect(LeafPrinter.param(param('unnamed', ''))).toBe('?');
    });

    test('prints named param', () => {
      expect(LeafPrinter.param(param('named', 'myParam'))).toBe('?myParam');
    });

    test('prints positional param', () => {
      expect(LeafPrinter.param(param('positional', 2))).toBe('?2');
    });

    test('uses ?? kind for double-question-mark unnamed param', () => {
      expect(LeafPrinter.param(param('unnamed', '', '??'))).toBe('??');
    });

    test('uses ?? kind for double-question-mark named param', () => {
      expect(LeafPrinter.param(param('named', 'opt', '??'))).toBe('??opt');
    });
  });

  describe('timespan()', () => {
    test('prints single-char unit without space', () => {
      expect(
        LeafPrinter.timespan({
          ...base,
          type: 'literal',
          literalType: 'time_duration',
          value: '5d',
          quantity: 5,
          unit: 'd',
        })
      ).toBe('5d');
    });

    test('prints multi-char unit with space', () => {
      expect(
        LeafPrinter.timespan({
          ...base,
          type: 'literal',
          literalType: 'time_duration',
          value: '5 days',
          quantity: 5,
          unit: 'days',
        })
      ).toBe('5 days');
    });
  });

  describe('comment()', () => {
    test('prints single-line comment', () => {
      const node: ESQLAstComment = { type: 'comment', subtype: 'single-line', text: ' hello' };
      expect(LeafPrinter.comment(node)).toBe('// hello');
    });

    test('prints multi-line comment', () => {
      const node: ESQLAstComment = { type: 'comment', subtype: 'multi-line', text: ' block ' };
      expect(LeafPrinter.comment(node)).toBe('/* block */');
    });
  });

  describe('commentList()', () => {
    test('returns empty string for empty list', () => {
      expect(LeafPrinter.commentList([])).toBe('');
    });

    test('prints single comment', () => {
      const node: ESQLAstCommentMultiLine = {
        type: 'comment',
        subtype: 'multi-line',
        text: ' one ',
      };
      expect(LeafPrinter.commentList([node])).toBe('/* one */');
    });

    test('joins multiple comments with space', () => {
      const a: ESQLAstCommentMultiLine = { type: 'comment', subtype: 'multi-line', text: ' a ' };
      const b: ESQLAstCommentMultiLine = { type: 'comment', subtype: 'multi-line', text: ' b ' };
      expect(LeafPrinter.commentList([a, b])).toBe('/* a */ /* b */');
    });
  });

  describe('print()', () => {
    test('dispatches source node', () => {
      const node: ESQLSource = { ...base, name: 'idx', type: 'source', sourceType: 'index' };
      expect(LeafPrinter.print(node)).toBe('idx');
    });

    test('dispatches identifier node', () => {
      expect(LeafPrinter.print(id('field'))).toBe('field');
    });

    test('dispatches column node', () => {
      const node: ESQLColumn = {
        ...base,
        type: 'column',
        args: [id('x')],
        parts: ['x'],
        quoted: false,
      };
      expect(LeafPrinter.print(node)).toBe('x');
    });

    test('dispatches literal node', () => {
      expect(LeafPrinter.print(strLit('hello'))).toBe('"hello"');
    });

    test('dispatches comment node', () => {
      const node: ESQLAstComment = { type: 'comment', subtype: 'multi-line', text: ' c ' };
      expect(LeafPrinter.print(node)).toBe('/* c */');
    });
  });
});
