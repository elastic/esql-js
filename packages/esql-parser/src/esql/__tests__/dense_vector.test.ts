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

      const withOption = cmd.args.find(
        (arg): arg is ESQLCommandOption =>
          'type' in arg && arg.type === 'option' && arg.name === 'with'
      );
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
  });

  describe('incorrectly formatted', () => {
    it('errors on just the command keyword with no fields', () => {
      const { ast, errors } = EsqlQuery.fromSrc(`FROM logs | DENSE_VECTOR`);
      const cmd = getDenseVector(ast);

      expect(errors.length).toBeGreaterThan(0);
      expect(cmd).toMatchObject({
        name: 'dense_vector',
        incomplete: true,
      });
    });
  });
});
