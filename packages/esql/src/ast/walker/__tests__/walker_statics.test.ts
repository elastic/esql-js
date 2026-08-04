/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Builder } from '../../builder';
import { PromQLBuilder } from '../../../embedded_languages/promql/ast/builder';
import { parse } from '../../../parser';
import { BasicPrettyPrinter } from '../../../pretty_print';
import { EsqlQuery } from '../../../composer/query';
import type {
  ESQLAstItem,
  ESQLAstRerankCommand,
  ESQLCommandOption,
  ESQLIntegerLiteral,
  ESQLMap,
  ESQLNumericLiteral,
  ESQLStringLiteral,
} from '../../../types';
import { Walker } from '../walker';

describe('Walker static methods', () => {
  describe('Walker.commands()', () => {
    test('can collect all commands', () => {
      const { ast } = parse(
        'FROM index | STATS a = 123 | WHERE 123 | LIMIT 10 | RERANK "query" ON field WITH id'
      );
      const commands = Walker.commands(ast);

      expect(commands.map(({ name }) => name).sort()).toStrictEqual([
        'from',
        'limit',
        'rerank',
        'stats',
        'where',
      ]);
    });
  });

  describe('Walker.params()', () => {
    test('can collect all params', () => {
      const query = 'ROW x = ?';
      const { ast } = parse(query);
      const params = Walker.params(ast);

      expect(params).toMatchObject([
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'unnamed',
        },
      ]);
    });

    test('can collect double params from PromQL label lists', () => {
      const { root } = parse('PROMQL sum by (??labels) (bytes)');
      const params = Walker.params(root);

      expect(params).toMatchObject([
        {
          dialect: 'promql',
          type: 'literal',
          literalType: 'param',
          paramKind: '??',
          paramType: 'named',
          value: 'labels',
        },
      ]);
    });

    test('can collect single named param from PromQL label matcher value', () => {
      const { root } = parse('PROMQL metric{job=?job}');
      const params = Walker.params(root);

      expect(params).toMatchObject([
        {
          dialect: 'promql',
          type: 'literal',
          literalType: 'param',
          paramKind: '?',
          paramType: 'named',
          value: 'job',
        },
      ]);
    });

    test('can collect positional param from PromQL label matcher value', () => {
      const { root } = parse('PROMQL metric{job=?1}');
      const params = Walker.params(root);

      expect(params).toMatchObject([
        {
          dialect: 'promql',
          type: 'literal',
          literalType: 'param',
          paramKind: '?',
          paramType: 'positional',
          value: 1,
        },
      ]);
    });

    test('can collect param from PROMQL command named arguments', () => {
      const { root } = parse('PROMQL k=?v bytes_in{job="test"}');
      const params = Walker.params(root);

      expect(params).toMatchObject([
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: 'v',
        },
      ]);
    });

    test('collects params from both ES|QL and PromQL parts of a query', () => {
      const { root } = parse('PROMQL step=?step sum by (??labels) (bytes) | WHERE x == ?other');
      const params = Walker.params(root);

      expect(params).toMatchObject([
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: 'step',
        },
        {
          dialect: 'promql',
          type: 'literal',
          literalType: 'param',
          paramKind: '??',
          paramType: 'named',
          value: 'labels',
        },
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: 'other',
        },
      ]);
    });

    test('can collect params from nested PromQL expressions', () => {
      const { root } = parse('PROMQL sum by (??labels) (rate(bytes{host=?host})) | LIMIT ?lim');
      const params = Walker.params(root);

      expect(params).toMatchObject([
        {
          dialect: 'promql',
          paramKind: '??',
          paramType: 'named',
          value: 'labels',
        },
        {
          dialect: 'promql',
          paramKind: '?',
          paramType: 'named',
          value: 'host',
        },
        {
          paramType: 'named',
          value: 'lim',
        },
      ]);
    });

    test('does not clobber caller-supplied literal visitors', () => {
      const { root } = parse('PROMQL step=?step sum by (??labels) (bytes)');
      const esqlLiterals: unknown[] = [];
      const promqlLiterals: unknown[] = [];

      const params = Walker.params(root, {
        visitLiteral: (node) => esqlLiterals.push(node),
        promql: {
          visitPromqlLiteral: (node) => promqlLiterals.push(node),
        },
      });

      expect(params).toMatchObject([{ value: 'step' }, { value: 'labels' }]);
      expect(esqlLiterals.length).toBeGreaterThanOrEqual(1);
      expect(promqlLiterals.length).toBeGreaterThanOrEqual(1);
    });

    test('can collect all params from grouping functions', () => {
      const query =
        'ROW x=1, time=2024-07-10 | stats z = avg(x) by bucket(time, 20, ?_tstart,?_tend)';
      const { ast } = parse(query);
      const params = Walker.params(ast);

      expect(params).toMatchObject([
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: '_tstart',
        },
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: '_tend',
        },
      ]);
    });

    test('can collect params from column names', () => {
      const query = 'ROW ?a.?b';
      const { ast } = parse(query);
      const params = Walker.params(ast);

      expect(params).toMatchObject([
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: 'a',
        },
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: 'b',
        },
      ]);
    });

    test('can collect params from column names, where first part is not a param', () => {
      const query = 'ROW a.?b';
      const { ast } = parse(query);
      const params = Walker.params(ast);

      expect(params).toMatchObject([
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: 'b',
        },
      ]);
    });

    test('can collect all types of param from column name', () => {
      const query = 'ROW ?.?0.?a';
      const { ast } = parse(query);
      const params = Walker.params(ast);

      expect(params).toMatchObject([
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'unnamed',
        },
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'positional',
          value: 0,
        },
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: 'a',
        },
      ]);
    });

    test('can collect params from function names', () => {
      const query = 'FROM a | STATS ?lala()';
      const { ast } = parse(query);
      const params = Walker.params(ast);

      expect(params).toMatchObject([
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: 'lala',
        },
      ]);
    });

    test('can collect params from function names (unnamed)', () => {
      const query = 'FROM a | STATS ?()';
      const { ast } = parse(query);
      const params = Walker.params(ast);

      expect(params).toMatchObject([
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'unnamed',
        },
      ]);
    });

    test('can collect params from function names (positional)', () => {
      const query = 'FROM a | STATS agg(test), ?123()';
      const { ast } = parse(query);
      const params = Walker.params(ast);

      expect(params).toMatchObject([
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'positional',
          value: 123,
        },
      ]);
    });

    test('can collect params from function trailing map argument', () => {
      const query =
        'FROM a | WHERE MATCH( aws.s3.bucket.name, ?variable, {"minimum_should_match": ?min_should_match})';
      const { ast } = parse(query);
      const params = Walker.params(ast);

      expect(params).toMatchObject([
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: 'variable',
        },
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: 'min_should_match',
        },
      ]);
    });
  });

  describe('Walker.find()', () => {
    test('can find a bucket() function', () => {
      const query = 'FROM b | STATS var0 = bucket(bytes, 1 hour), fn(1), fn(2), agg(true)';
      const fn = Walker.find(
        parse(query).ast!,
        (node) => node.type === 'function' && node.name === 'bucket'
      );

      expect(fn).toMatchObject({
        type: 'function',
        name: 'bucket',
      });
    });

    test('can find RERANK by inference_id in WITH map', () => {
      const isWithOption = (arg: ESQLAstItem): arg is ESQLCommandOption =>
        !!arg && !Array.isArray(arg) && arg.type === 'option' && arg.name === 'with';

      const getWithString = (cmd: ESQLAstRerankCommand, key: string): string | undefined => {
        const map = cmd.args.find(isWithOption)!.args[0] as ESQLMap;
        const entry = map.entries.find(
          (e) =>
            e.key.type === 'literal' &&
            e.key.literalType === 'keyword' &&
            e.key.valueUnquoted === key
        );
        const { valueUnquoted } = entry?.value as ESQLStringLiteral;

        return valueUnquoted;
      };

      const query =
        'FROM b | RERANK "query" ON field WITH { "inference_id": "abc" } | RERANK "query" ON field WITH { "inference_id": "my_id" } | LIMIT 10';

      const command = Walker.find(
        parse(query).root,
        (node) =>
          node.type === 'command' &&
          node.name === 'rerank' &&
          getWithString(node as ESQLAstRerankCommand, 'inference_id') === 'my_id'
      );

      expect(getWithString(command as ESQLAstRerankCommand, 'inference_id')).toBe('my_id');
    });

    test('finds the first "fn" function', () => {
      const query = 'FROM b | STATS var0 = bucket(bytes, 1 hour), fn(1), fn(2), agg(true)';
      const fn = Walker.find(
        parse(query).ast!,
        (node) => node.type === 'function' && node.name === 'fn'
      );

      expect(fn).toMatchObject({
        type: 'function',
        name: 'fn',
        args: [
          {
            type: 'literal',
            value: 1,
          },
        ],
      });
    });

    test('can find a function inside a PromQL expression', () => {
      const { root } = parse('PROMQL sum by (job) (rate(bytes{host="a"}[5m])) | LIMIT 10');
      const fn = Walker.find(root, (node) => node.type === 'function' && node.name === 'rate');

      expect(fn).toMatchObject({
        dialect: 'promql',
        type: 'function',
        name: 'rate',
      });
    });

    test('does not clobber caller-supplied any-node visitors', () => {
      const { root } = parse('PROMQL sum(bytes) | LIMIT 10');
      const esqlNodes: unknown[] = [];
      const promqlNodes: unknown[] = [];

      const found = Walker.find(root, (node) => node.type === 'selector', {
        visitAny: (node) => esqlNodes.push(node),
        promql: {
          visitPromqlAny: (node) => promqlNodes.push(node),
        },
      });

      expect(found).toMatchObject({ dialect: 'promql', type: 'selector' });
      expect(esqlNodes.length).toBeGreaterThanOrEqual(1);
      expect(promqlNodes.length).toBeGreaterThanOrEqual(1);
    });

    test('aborts traversal once a PromQL node matches', () => {
      const { root } = parse('PROMQL sum(rate(bytes[5m])) | LIMIT 10');
      const seen: string[] = [];
      const found = Walker.find(root, (node) => {
        seen.push(node.type);
        return node.type === 'selector';
      });

      expect(found).toMatchObject({ dialect: 'promql', type: 'selector' });
      expect(seen.filter((type) => type === 'command')).toHaveLength(1);
    });
  });

  describe('Walker.findAll()', () => {
    test('find all "fn" functions', () => {
      const query = 'FROM b | STATS var0 = bucket(bytes, 1 hour), fn(1), fn(2), agg(true)';
      const list = Walker.findAll(
        parse(query).ast!,
        (node) => node.type === 'function' && node.name === 'fn'
      );

      expect(list).toMatchObject([
        {
          type: 'function',
          name: 'fn',
          args: [
            {
              type: 'literal',
              value: 1,
            },
          ],
        },
        {
          type: 'function',
          name: 'fn',
          args: [
            {
              type: 'literal',
              value: 2,
            },
          ],
        },
      ]);
    });

    test('collects functions from both dialects in source order', () => {
      const { root } = parse('PROMQL sum(rate(bytes[5m])) | STATS avg(x)');
      const list = Walker.findAll(root, (node) => node.type === 'function');

      expect(list).toMatchObject([
        { dialect: 'promql', name: 'sum' },
        { dialect: 'promql', name: 'rate' },
        { name: 'avg' },
      ]);
    });

    test('does not clobber caller-supplied any-node visitors', () => {
      const { root } = parse('PROMQL sum(bytes) | LIMIT 10');
      const esqlNodes: unknown[] = [];
      const promqlNodes: unknown[] = [];

      const list = Walker.findAll(root, (node) => node.type === 'function', {
        visitAny: (node) => esqlNodes.push(node),
        promql: {
          visitPromqlAny: (node) => promqlNodes.push(node),
        },
      });

      expect(list).toMatchObject([{ dialect: 'promql', name: 'sum' }]);
      expect(esqlNodes.length).toBeGreaterThanOrEqual(1);
      expect(promqlNodes.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Walker.match()', () => {
    test('can find a bucket() function', () => {
      const query = 'FROM b | STATS var0 = bucket(bytes, 1 hour), fn(1), fn(2), agg(true)';
      const fn = Walker.match(parse(query).ast!, {
        type: 'function',
        name: 'bucket',
      });

      expect(fn).toMatchObject({
        type: 'function',
        name: 'bucket',
      });
    });

    test('finds the first "fn" function', () => {
      const query = 'FROM b | STATS var0 = bucket(bytes, 1 hour), fn(1), fn(2), agg(true)';
      const fn = Walker.match(parse(query).ast!, { type: 'function', name: 'fn' });

      expect(fn).toMatchObject({
        type: 'function',
        name: 'fn',
        args: [
          {
            type: 'literal',
            value: 1,
          },
        ],
      });
    });

    test('can find a deeply nested column', () => {
      const query =
        'FROM index | WHERE 123 == add(1 + fn(NOT 10 + -(a.b.c::ip)::INTEGER /* comment */))';
      const { root } = parse(query);
      const res = Walker.match(root, {
        type: 'column',
        name: 'a.b.c',
      });

      expect(res).toMatchObject({
        type: 'column',
        name: 'a.b.c',
      });
    });

    test('can find map and inside map', () => {
      const query = 'ROW F(1, {"b": ?var, "a": 123})';
      const { root } = parse(query);
      const map = Walker.match(root, {
        type: 'map',
      });
      const number = Walker.match(root, {
        type: 'literal',
        value: 123,
      });
      const param = Walker.match(root, {
        type: 'literal',
        literalType: 'param',
      });

      expect(map).toMatchObject({
        type: 'map',
      });
      expect(number).toMatchObject({
        type: 'literal',
        value: 123,
      });
      expect(param).toMatchObject({
        type: 'literal',
        literalType: 'param',
      });
    });

    test('can find WHERE command by its type', () => {
      const query = 'FROM index | LEFT JOIN a | RIGHT JOIN b';
      const { root } = parse(query);

      const join1 = Walker.match(root, {
        type: 'command',
        name: 'join',
        commandType: 'left',
      })!;
      const source1 = Walker.match(join1, {
        type: 'source',
        name: 'a',
      })!;
      const join2 = Walker.match(root, {
        type: 'command',
        name: 'join',
        commandType: 'right',
      })!;
      const source2 = Walker.match(join2, {
        type: 'source',
        name: 'b',
      })!;

      expect(source1).toMatchObject({
        name: 'a',
      });
      expect(source2).toMatchObject({
        name: 'b',
      });
    });

    test('can match a PromQL node by template', () => {
      const { root } = parse('PROMQL sum by (job) (rate(bytes{host="a"}[5m])) | LIMIT 10');
      const selector = Walker.match(root, { type: 'selector' });

      expect(selector).toMatchObject({
        dialect: 'promql',
        type: 'selector',
        name: 'bytes',
      });
    });
  });

  describe('Walker.matchAll()', () => {
    test('find all "fn" functions', () => {
      const query = 'FROM b | STATS var0 = bucket(bytes, 1 hour), fn(1), fn(2), agg(true)';
      const list = Walker.matchAll(parse(query).ast!, {
        type: 'function',
        name: 'fn',
      });

      expect(list).toMatchObject([
        {
          type: 'function',
          name: 'fn',
          args: [
            {
              type: 'literal',
              value: 1,
            },
          ],
        },
        {
          type: 'function',
          name: 'fn',
          args: [
            {
              type: 'literal',
              value: 2,
            },
          ],
        },
      ]);
    });

    test('find all "fn" and "agg" functions', () => {
      const query = 'FROM b | STATS var0 = bucket(bytes, 1 hour), fn(1), fn(2), agg(true)';
      const list = Walker.matchAll(parse(query).ast!, {
        type: 'function',
        name: ['fn', 'agg'],
      });

      expect(list).toMatchObject([
        {
          type: 'function',
          name: 'fn',
          args: [
            {
              type: 'literal',
              value: 1,
            },
          ],
        },
        {
          type: 'function',
          name: 'fn',
          args: [
            {
              type: 'literal',
              value: 2,
            },
          ],
        },
        {
          type: 'function',
          name: 'agg',
        },
      ]);
    });

    test('find all functions which start with "b" or "a"', () => {
      const query = 'FROM b | STATS var0 = bucket(bytes, 1 hour), fn(1), fn(2), agg(true)';
      const list = Walker.matchAll(parse(query).ast!, {
        type: 'function',
        name: /^a|b/i,
      });

      expect(list).toMatchObject([
        {
          type: 'function',
          name: 'bucket',
        },
        {
          type: 'function',
          name: 'agg',
        },
      ]);
    });

    test('collects literals from both dialects in source order', () => {
      const { root } = parse('PROMQL step=1m sum by (job) (rate(bytes{host="a"}[5m])) | LIMIT 10');
      const literals = Walker.matchAll(root, { type: 'literal' });

      expect(literals).toMatchObject([
        { literalType: 'keyword', value: '1m' },
        { dialect: 'promql', literalType: 'string', value: '"a"' },
        { dialect: 'promql', literalType: 'time', value: '5m' },
        { literalType: 'integer', value: 10 },
      ]);
    });

    test('returns identical results for ES|QL-only queries', () => {
      const { root } = parse('FROM index | WHERE a > 1 | LIMIT 10');
      const literals = Walker.matchAll(root, { type: 'literal' });

      expect(literals.some((node) => 'dialect' in node)).toBe(false);
      expect(literals).toMatchObject([{ value: 'index' }, { value: 1 }, { value: 10 }]);
    });
  });

  describe('Walker.findFunction()', () => {
    test('can find a function by name', () => {
      const query1 = 'FROM a | STATS bucket(bytes, 1 hour)';
      const query2 = 'FROM b | STATS var0 == bucket(bytes, 1 hour)';
      const has1 = Walker.hasFunction(parse(query1).ast!, '==');
      const has2 = Walker.hasFunction(parse(query2).ast!, '==');

      expect(has1).toBe(false);
      expect(has2).toBe(true);
    });

    test('by default does not match PromQL functions', () => {
      const { root } = parse('PROMQL sum(rate(bytes[5m])) | STATS avg(x)');

      expect(Walker.findFunction(root, 'rate')).toBe(undefined);
      expect(Walker.findFunction(root, 'avg')).toMatchObject({ type: 'function', name: 'avg' });
    });

    test('matches PromQL functions when the "promql" dialect is included', () => {
      const { root } = parse('PROMQL sum(rate(bytes[5m])) | STATS avg(x)');
      const fn = Walker.findFunction(root, 'rate', { dialects: ['esql', 'promql'] });

      expect(fn).toMatchObject({
        dialect: 'promql',
        type: 'function',
        name: 'rate',
      });
    });

    test('does not match ES|QL functions when only the "promql" dialect is selected', () => {
      const { root } = parse('PROMQL sum(rate(bytes[5m])) | STATS avg(x)');

      expect(Walker.findFunction(root, 'avg', { dialects: ['promql'] })).toBe(undefined);
      expect(Walker.findFunction(root, 'sum', { dialects: ['promql'] })).toMatchObject({
        dialect: 'promql',
        name: 'sum',
      });
    });

    test('can find a PromQL function by predicate', () => {
      const { root } = parse('PROMQL sum(rate(bytes[5m]))');
      const fn = Walker.findFunction(root, (node) => node.name.startsWith('ra'), {
        dialects: ['esql', 'promql'],
      });

      expect(fn).toMatchObject({ dialect: 'promql', name: 'rate' });
    });
  });

  describe('Walker.hasFunction()', () => {
    test('can find binary expression expression', () => {
      const query1 = 'FROM a | STATS a(b(1), c(2), d(3))';
      const { ast } = EsqlQuery.fromSrc(query1);
      const fn1 = Walker.findFunction(ast, 'a');
      const fn2 = Walker.findFunction(ast, 'b');
      const fn3 = Walker.findFunction(ast, 'c');
      const fn4 = Walker.findFunction(ast, 'd');

      expect(fn1).toMatchObject({ type: 'function', name: 'a' });
      expect(fn2).toMatchObject({ type: 'function', name: 'b' });
      expect(fn3).toMatchObject({ type: 'function', name: 'c' });
      expect(fn4).toMatchObject({ type: 'function', name: 'd' });
    });
  });

  describe('Walker.parent()', () => {
    test('can find parent node (FROM command) of a source', () => {
      const { ast } = EsqlQuery.fromSrc('FROM index');
      const child = Walker.match(ast, { type: 'source' })!;
      const parent = Walker.parent(ast, child)!;
      const grandParent = Walker.parent(ast, parent);

      expect(child).toMatchObject({
        type: 'source',
        name: 'index',
      });
      expect(parent).toMatchObject({
        type: 'command',
        name: 'from',
      });
      expect(grandParent).toMatchObject({
        type: 'query',
      });
    });

    test('can find the parent of a PromQL node', () => {
      const { root } = parse('PROMQL rate(bytes{host="a"}[5m])');
      const selector = Walker.match(root, { type: 'selector' })!;
      const parent = Walker.parent(root, selector);

      expect(parent).toMatchObject({
        dialect: 'promql',
        type: 'function',
        name: 'rate',
      });
    });

    test('reports the PROMQL command as parent of the PromQL query root', () => {
      const { root } = parse('PROMQL rate(bytes[5m])');
      const promqlQuery = Walker.find(root, (node) => 'dialect' in node && node.type === 'query')!;
      const parent = Walker.parent(root, promqlQuery);

      expect(parent).toMatchObject({
        type: 'command',
        name: 'promql',
      });
    });
  });

  describe('Walker.parents()', () => {
    test('can find all parents of a source', () => {
      const { ast } = EsqlQuery.fromSrc('FROM index');
      const child = Walker.match(ast, { type: 'source' })!;
      const ancestry = Walker.parents(ast, child);

      expect(ancestry).toMatchObject([
        {
          type: 'command',
          name: 'from',
        },
        {
          type: 'query',
        },
      ]);
    });

    test('can find all parents of a nested function', () => {
      const { ast } = EsqlQuery.fromSrc('FROM index | STATS a = agg(1 - b(3 + c(4)))');
      const four = Walker.match(ast, { type: 'literal', value: 4 })!;
      const ancestry = Walker.parents(ast, four);

      expect(ancestry).toMatchObject([
        {
          type: 'function',
          name: 'c',
        },
        {
          type: 'function',
          name: '+',
        },
        {
          type: 'function',
          name: 'b',
        },
        {
          type: 'function',
          name: '-',
        },
        {
          type: 'function',
          name: 'agg',
        },
        {
          type: 'function',
          name: '=',
        },
        {
          type: 'command',
          name: 'stats',
        },
        {
          type: 'query',
        },
      ]);
    });

    test('ancestry of a PromQL node crosses the dialect boundary', () => {
      const { root } = parse('PROMQL sum(rate(bytes{host="a"}[5m])) | LIMIT 10');
      const label = Walker.match(root, { type: 'label' })!;
      const ancestry = Walker.parents(root, label);

      expect(ancestry).toMatchObject([
        { dialect: 'promql', type: 'label-map' },
        { dialect: 'promql', type: 'selector', name: 'bytes' },
        { dialect: 'promql', type: 'function', name: 'rate' },
        { dialect: 'promql', type: 'function', name: 'sum' },
        { dialect: 'promql', type: 'query' },
        { type: 'command', name: 'promql' },
        { type: 'query' },
      ]);
    });
  });

  describe('Walker.visitComments()', () => {
    test('visits ES|QL comments with their attachment', () => {
      const { root } = parse(
        `// top comment
        FROM index | LIMIT 10 // trailing comment`,
        { withFormatting: true }
      );
      const comments: string[] = [];

      Walker.visitComments(root, (comment, node, attachment) => {
        comments.push(`${node.type}/${attachment}:${comment.text.trim()}`);
      });

      expect(comments).toEqual([
        'command/top:top comment',
        'literal/rightSingleLine:trailing comment',
      ]);
    });

    test('visits comments inside embedded PromQL expressions', () => {
      const { root } = parse(
        `PROMQL
          # top comment
          rate(bytes[5m]) # trailing comment
        | LIMIT 10 // esql comment`,
        { withFormatting: true }
      );
      const comments: string[] = [];

      Walker.visitComments(root, (comment, node, attachment) => {
        const dialect = 'dialect' in node ? node.dialect : 'esql';
        comments.push(`${dialect}/${attachment}:${comment.text.trim()}`);
      });

      expect(comments).toEqual([
        'promql/top:top comment',
        'promql/rightSingleLine:trailing comment',
        'esql/rightSingleLine:esql comment',
      ]);
    });
  });

  describe('Walker.replace()', () => {
    test('can replace a node with another node', () => {
      const { ast } = EsqlQuery.fromSrc('FROM index | WHERE a == 123');
      const newNode = Builder.expression.literal.integer(456);
      Walker.replace(ast, { type: 'literal', value: 123 }, newNode);

      expect(BasicPrettyPrinter.print(ast)).toBe('FROM index | WHERE a == 456');
    });

    test('can replace using a callback', () => {
      const { ast } = EsqlQuery.fromSrc('FROM index | WHERE a == 123');
      Walker.replace(ast, { type: 'literal', value: 123 }, (oldNode) => {
        const node = oldNode as ESQLIntegerLiteral;
        return Builder.expression.literal.integer(Number(node.value) * 2);
      });

      expect(BasicPrettyPrinter.print(ast)).toBe('FROM index | WHERE a == 246');
    });

    test('can find node by predicate function', () => {
      const { ast } = EsqlQuery.fromSrc('FROM index | EVAL a = "x" | WHERE a == 123 | LIMIT 10');
      const newNode = Builder.expression.literal.integer(456);
      Walker.replace(ast, (n) => (n as ESQLNumericLiteral<'integer'>).value === 123, newNode);

      expect(BasicPrettyPrinter.print(ast)).toBe(
        'FROM index | EVAL a = "x" | WHERE a == 456 | LIMIT 10'
      );
    });

    test('replaces only the first found node', () => {
      const { ast } = EsqlQuery.fromSrc('FROM index | WHERE a == 123 AND b > 123');
      const newNode = Builder.expression.literal.integer(456);

      Walker.replace(ast, { type: 'literal', value: 123 }, newNode);

      expect(BasicPrettyPrinter.print(ast)).toBe('FROM index | WHERE a == 456 AND b > 123');

      Walker.replace(ast, { type: 'literal', value: 123 }, newNode);

      expect(BasicPrettyPrinter.print(ast)).toBe('FROM index | WHERE a == 456 AND b > 456');
    });

    test('returns replaced node', () => {
      const { ast } = EsqlQuery.fromSrc('FROM index | WHERE a == 123');
      const newNode = Builder.expression.literal.integer(456);
      const replaced = Walker.replace(ast, { type: 'literal', value: 123 }, newNode);

      expect(replaced).toMatchObject({
        type: 'literal',
        value: 456,
      });
    });

    test('can inline a param inside a PromQL expression', () => {
      const { root } = parse('PROMQL rate(bytes{host=?host}[5m])');
      const replaced = Walker.replace(
        root,
        { type: 'literal', literalType: 'param', value: 'host' },
        PromQLBuilder.expression.literal.string('web-01')
      );

      expect(replaced).toMatchObject({
        dialect: 'promql',
        type: 'literal',
        literalType: 'string',
      });
      expect(BasicPrettyPrinter.print(root)).toBe('PROMQL rate(bytes{host="web-01"}[5m])');
    });
  });

  describe('Walker.replaceAll()', () => {
    test('replaces all instances of a match', () => {
      const { ast } = EsqlQuery.fromSrc('FROM index | WHERE a == 123 AND b > 123');
      const newNode = Builder.expression.literal.integer(456);

      Walker.replaceAll(ast, { type: 'literal', value: 123 }, newNode);

      expect(BasicPrettyPrinter.print(ast)).toBe('FROM index | WHERE a == 456 AND b > 456');
    });

    test('can replace using a callback all matches', () => {
      const { ast } = EsqlQuery.fromSrc('FROM index | WHERE a == 123 AND b > 123');
      Walker.replaceAll(ast, { type: 'literal', value: 123 }, (oldNode) => {
        const node = oldNode as ESQLIntegerLiteral;
        return Builder.expression.literal.integer(Number(node.value) * 2);
      });

      expect(BasicPrettyPrinter.print(ast)).toBe('FROM index | WHERE a == 246 AND b > 246');
    });

    test('returns list of updated nodes', () => {
      const { ast } = EsqlQuery.fromSrc('FROM index | WHERE a == 123 AND b > 123');
      const newNode = Builder.expression.literal.integer(456);

      const updatedNodes = Walker.replaceAll(ast, { type: 'literal', value: 123 }, newNode);

      expect(updatedNodes).toMatchObject([
        {
          type: 'literal',
          value: 456,
        },
        {
          type: 'literal',
          value: 456,
        },
      ]);
    });

    test('can replace a param used in both dialects', () => {
      const { root } = parse('PROMQL bytes{host=?x} | WHERE y == ?x');
      const updatedNodes = Walker.replaceAll(
        root,
        { type: 'literal', literalType: 'param', value: 'x' },
        (node) =>
          'dialect' in node
            ? PromQLBuilder.expression.literal.string('web-01')
            : Builder.expression.literal.string('web-01')
      );

      expect(updatedNodes).toHaveLength(2);
      expect(BasicPrettyPrinter.print(root)).toBe(
        'PROMQL bytes{host="web-01"} | WHERE y == "web-01"'
      );
    });
  });
});
