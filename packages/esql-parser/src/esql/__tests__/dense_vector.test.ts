/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EsqlQuery } from './query';
import { Walker } from '@elastic/esql-traversal';
import type {
  ESQLAstDenseVectorCommand,
  ESQLAstQueryExpression,
  ESQLCommandOption,
  ESQLMap,
} from '@elastic/esql-types';

describe('DENSE_VECTOR', () => {
  const getDenseVector = (ast: ESQLAstQueryExpression): ESQLAstDenseVectorCommand =>
    Walker.match(ast, {
      type: 'command',
      name: 'dense_vector',
    }) as ESQLAstDenseVectorCommand;

  const getWithOption = (cmd: ESQLAstDenseVectorCommand): ESQLCommandOption | undefined =>
    cmd.args.find(
      (arg): arg is ESQLCommandOption =>
        'type' in arg && arg.type === 'option' && arg.name === 'with'
    );

  describe('correctly formatted', () => {
    it('parses a single field', () => {
      const src = `FROM logs | DENSE_VECTOR my_vector`;
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const cmd = getDenseVector(ast);

      expect(errors).toHaveLength(0);
      expect(cmd).toMatchObject({
        type: 'command',
        name: 'dense_vector',
        incomplete: false,
      });
      expect(cmd.fields).toHaveLength(1);
      expect(cmd.fields[0]).toMatchObject({ type: 'column', name: 'my_vector' });
      expect(cmd.namedParameters).toBeUndefined();
      expect(cmd.args).toHaveLength(1);
    });

    it('parses multiple fields', () => {
      const src = `FROM logs | DENSE_VECTOR field_a, field_b, field_c`;
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const cmd = getDenseVector(ast);

      expect(errors).toHaveLength(0);
      expect(cmd.fields).toHaveLength(3);
      expect(cmd.fields[0]).toMatchObject({ type: 'column', name: 'field_a' });
      expect(cmd.fields[1]).toMatchObject({ type: 'column', name: 'field_b' });
      expect(cmd.fields[2]).toMatchObject({ type: 'column', name: 'field_c' });
      expect(cmd.args).toHaveLength(3);
    });

    it('parses dotted field names', () => {
      const src = `FROM logs | DENSE_VECTOR nested.field`;
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const cmd = getDenseVector(ast);

      expect(errors).toHaveLength(0);
      expect(cmd.fields[0]).toMatchObject({ type: 'column' });
      expect(cmd.fields[0].parts).toEqual(['nested', 'field']);
    });

    it('parses WITH named parameters', () => {
      const src = `FROM logs | DENSE_VECTOR my_vector WITH { "dims": 128 }`;
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const cmd = getDenseVector(ast);

      expect(errors).toHaveLength(0);
      expect(cmd.namedParameters).toMatchObject({
        type: 'map',
        entries: [
          {
            type: 'map-entry',
            key: { type: 'literal', valueUnquoted: 'dims' },
            value: { type: 'literal', value: 128 },
          },
        ],
      });

      const withOption = getWithOption(cmd);
      expect(withOption).toBeDefined();
      expect((withOption!.args[0] as ESQLMap).entries).toHaveLength(1);
    });

    it('parses multiple fields WITH named parameters', () => {
      const src = `FROM logs | DENSE_VECTOR vec_a, vec_b WITH { "normalize": true }`;
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const cmd = getDenseVector(ast);

      expect(errors).toHaveLength(0);
      expect(cmd.fields).toHaveLength(2);
      expect(cmd.namedParameters).toMatchObject({ type: 'map' });
    });
  });

  describe('incomplete flag', () => {
    it('is false for a valid single field', () => {
      const { ast } = EsqlQuery.fromSrc(`FROM logs | DENSE_VECTOR my_vector`);
      const cmd = getDenseVector(ast);

      expect(cmd.incomplete).toBe(false);
    });

    it('is false for valid fields with valid named parameters', () => {
      const { ast } = EsqlQuery.fromSrc(
        `FROM logs | DENSE_VECTOR a, b WITH { "dims": 128, "normalize": true }`
      );
      const cmd = getDenseVector(ast);

      expect(cmd.incomplete).toBe(false);
      expect(getWithOption(cmd)!.incomplete).toBe(false);
      expect(cmd.namedParameters!.incomplete).toBe(false);
    });
  });

  describe('`.incomplete` flag', () => {
    it('bubbles up from the placeholder field when no fields are given', () => {
      const { ast, errors } = EsqlQuery.fromSrc(`FROM logs | DENSE_VECTOR`);
      const cmd = getDenseVector(ast);

      expect(errors.length).toBeGreaterThan(0);
      expect(cmd).toMatchObject({ name: 'dense_vector', incomplete: true });

      expect(cmd.fields).toHaveLength(1);
      expect(cmd.fields[0]).toMatchObject({
        type: 'column',
        name: '',
        parts: [],
        incomplete: true,
      });
      expect(cmd.args).toHaveLength(1);
    });

    it('bubbles up from a trailing comma', () => {
      const { ast, errors } = EsqlQuery.fromSrc(`FROM logs | DENSE_VECTOR a,`);
      const cmd = getDenseVector(ast);

      expect(errors.length).toBeGreaterThan(0);
      expect(cmd.incomplete).toBe(true);
      expect(cmd.fields).toHaveLength(2);
      expect(cmd.fields[0]).toMatchObject({ name: 'a', incomplete: false });
      expect(cmd.fields[1]).toMatchObject({ name: '', parts: [], incomplete: true });
    });

    it('bubbles up from a lone comma', () => {
      const { ast, errors } = EsqlQuery.fromSrc(`FROM logs | DENSE_VECTOR ,`);
      const cmd = getDenseVector(ast);

      expect(errors.length).toBeGreaterThan(0);
      expect(cmd.incomplete).toBe(true);
      expect(cmd.fields).toHaveLength(2);
      expect(cmd.fields.every((field) => field.incomplete)).toBe(true);
    });

    it('bubbles up from fields independently of a valid WITH clause', () => {
      const { ast, errors } = EsqlQuery.fromSrc(`FROM logs | DENSE_VECTOR WITH { "dims": 128 }`);
      const cmd = getDenseVector(ast);

      expect(errors.length).toBeGreaterThan(0);
      expect(cmd.incomplete).toBe(true);
      expect(cmd.fields[0].incomplete).toBe(true);

      // The named parameters parsed cleanly — only the field channel is broken.
      expect(cmd.namedParameters).toMatchObject({ type: 'map', incomplete: false });
      expect(getWithOption(cmd)!.incomplete).toBe(false);
    });

    it('bubbles up from a trailing comma before a valid WITH clause', () => {
      const { ast } = EsqlQuery.fromSrc(`FROM logs | DENSE_VECTOR a, WITH { "dims": 128 }`);
      const cmd = getDenseVector(ast);

      expect(cmd.incomplete).toBe(true);
      expect(cmd.fields).toHaveLength(2);
      expect(cmd.fields[1].incomplete).toBe(true);
      expect(getWithOption(cmd)!.incomplete).toBe(false);
      expect(cmd.args).toHaveLength(3);
    });

    it('does not swallow the commands that follow it', () => {
      const { ast } = EsqlQuery.fromSrc(`FROM logs | DENSE_VECTOR a, | LIMIT 1`);
      const cmd = getDenseVector(ast);

      expect(cmd.incomplete).toBe(true);
      expect(cmd.fields[1].incomplete).toBe(true);
      expect(Walker.match(ast, { type: 'command', name: 'limit' })).toMatchObject({
        name: 'limit',
        incomplete: false,
      });
    });
  });

  describe('incomplete bubbles up from WITH named parameters', () => {
    it('bubbles up from a dangling WITH keyword', () => {
      const { ast, errors } = EsqlQuery.fromSrc(`FROM logs | DENSE_VECTOR a WITH`);
      const cmd = getDenseVector(ast);

      expect(errors.length).toBeGreaterThan(0);
      expect(cmd.incomplete).toBe(true);
      expect(cmd.fields[0]).toMatchObject({ name: 'a', incomplete: false });
      expect(getWithOption(cmd)!.incomplete).toBe(true);
      expect(cmd.namedParameters).toMatchObject({ type: 'map', incomplete: true, entries: [] });
    });

    it('bubbles up from an unterminated map', () => {
      const { ast, errors } = EsqlQuery.fromSrc(`FROM logs | DENSE_VECTOR a WITH {`);
      const cmd = getDenseVector(ast);

      expect(errors.length).toBeGreaterThan(0);
      expect(cmd.incomplete).toBe(true);
      expect(cmd.fields[0].incomplete).toBe(false);
      expect(getWithOption(cmd)!.incomplete).toBe(true);
    });

    it('bubbles up from an empty map even when there are no syntax errors', () => {
      const { ast, errors } = EsqlQuery.fromSrc(`FROM logs | DENSE_VECTOR a WITH { }`);
      const cmd = getDenseVector(ast);

      expect(errors).toHaveLength(0);
      expect(cmd.incomplete).toBe(true);
      expect(cmd.fields[0].incomplete).toBe(false);
      expect(cmd.namedParameters).toMatchObject({ type: 'map', incomplete: true, entries: [] });
      expect(getWithOption(cmd)!.incomplete).toBe(true);
    });

    it('bubbles up from a map entry with a missing value', () => {
      const { ast, errors } = EsqlQuery.fromSrc(`FROM logs | DENSE_VECTOR a WITH { "dims": }`);
      const cmd = getDenseVector(ast);

      expect(errors.length).toBeGreaterThan(0);
      expect(cmd.incomplete).toBe(true);
      expect(cmd.fields[0].incomplete).toBe(false);
      expect(cmd.namedParameters!.entries).toHaveLength(1);
      expect(cmd.namedParameters!.entries[0].incomplete).toBe(true);
      expect(getWithOption(cmd)!.incomplete).toBe(true);
    });

    it('bubbles up when only one of several map entries is incomplete', () => {
      const { ast } = EsqlQuery.fromSrc(`FROM logs | DENSE_VECTOR a WITH { "a": 1, "b": }`);
      const cmd = getDenseVector(ast);

      expect(cmd.incomplete).toBe(true);

      const entries = cmd.namedParameters!.entries;
      expect(entries).toHaveLength(2);
      expect(entries[0].incomplete).toBe(false);
      expect(entries[1].incomplete).toBe(true);
      expect(getWithOption(cmd)!.incomplete).toBe(true);
    });

    it('keeps the WITH option and the command flag in sync', () => {
      const cases = [
        `FROM logs | DENSE_VECTOR a WITH { }`,
        `FROM logs | DENSE_VECTOR a WITH { "dims": }`,
        `FROM logs | DENSE_VECTOR a WITH { "dims": 128 }`,
      ];

      for (const src of cases) {
        const { ast } = EsqlQuery.fromSrc(src);
        const cmd = getDenseVector(ast);
        const withOption = getWithOption(cmd)!;

        expect(withOption.incomplete).toBe(cmd.namedParameters!.incomplete);
        expect(cmd.incomplete).toBe(withOption.incomplete);
      }
    });
  });

  describe('syntax errors do not by themselves imply an incomplete AST', () => {
    it('stays complete when the map is missing its closing brace', () => {
      const { ast, errors } = EsqlQuery.fromSrc(`FROM logs | DENSE_VECTOR a WITH { "dims": 128`);
      const cmd = getDenseVector(ast);

      expect(errors.length).toBeGreaterThan(0);
      expect(cmd.incomplete).toBe(false);
      expect(cmd.namedParameters).toMatchObject({ type: 'map', incomplete: false });
    });

    it('stays complete for a trailing comma inside the map', () => {
      const { ast, errors } = EsqlQuery.fromSrc(`FROM logs | DENSE_VECTOR a WITH { "dims": 128, }`);
      const cmd = getDenseVector(ast);

      expect(errors.length).toBeGreaterThan(0);
      expect(cmd.incomplete).toBe(false);
      expect(cmd.namedParameters!.entries).toHaveLength(1);
    });
  });
});
