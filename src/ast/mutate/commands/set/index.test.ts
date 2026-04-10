/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Parser } from '../../../../parser';
import { BasicPrettyPrinter } from '../../../../pretty_print';
import * as commands from '..';

describe('commands.set', () => {
  describe('.list()', () => {
    it('lists all SET header commands', () => {
      const src = 'SET approximation = true; SET unmapped_fields = "DEFAULT"; FROM index';
      const { root } = Parser.parse(src);

      const nodes = [...commands.set.list(root)];

      expect(nodes).toHaveLength(2);
    });

    it('returns empty iterator when no SET commands exist', () => {
      const src = 'FROM index | LIMIT 10';
      const { root } = Parser.parse(src);

      const nodes = [...commands.set.list(root)];

      expect(nodes).toHaveLength(0);
    });
  });

  describe('.findBySettingName()', () => {
    it('finds a SET command by setting name', () => {
      const src = 'SET approximation = true; SET unmapped_fields = "DEFAULT"; FROM index';
      const { root } = Parser.parse(src);

      const node = commands.set.findBySettingName(root, 'unmapped_fields');

      expect(node).toMatchObject({
        type: 'header-command',
        name: 'set',
        args: [
          {
            type: 'function',
            subtype: 'binary-expression',
            name: '=',
            args: [
              { type: 'identifier', name: 'unmapped_fields' },
              { type: 'literal', literalType: 'keyword', valueUnquoted: 'DEFAULT' },
            ],
          },
        ],
      });
    });

    it('returns undefined when the setting does not exist', () => {
      const src = 'SET approximation = true; FROM index';
      const { root } = Parser.parse(src);

      const node = commands.set.findBySettingName(root, 'unmapped_fields');

      expect(node).toBeUndefined();
    });
  });

  describe('.set()', () => {
    it('modifies the value of an existing setting', () => {
      const src = 'SET unmapped_fields = "DEFAULT"; FROM index';
      const { root } = Parser.parse(src);

      commands.set.set(root, 'unmapped_fields', 'LOAD');
      const printed = BasicPrettyPrinter.print(root);

      expect(printed).toBe('SET unmapped_fields = "LOAD"; FROM index');
    });

    it('returns undefined when the setting does not exist', () => {
      const src = 'SET approximation = TRUE; FROM index';
      const { root } = Parser.parse(src);

      const node = commands.set.set(root, 'unmapped_fields', 'LOAD');
      const printed = BasicPrettyPrinter.print(root);
      expect(printed).toBe('SET approximation = TRUE; FROM index');
      expect(node).toBeUndefined();
    });

    it('only modifies the targeted setting when multiple exist', () => {
      const src = 'SET approximation = TRUE; SET unmapped_fields = "DEFAULT"; FROM index';
      const { root } = Parser.parse(src);

      commands.set.set(root, 'unmapped_fields', 'LOAD');
      const printed = BasicPrettyPrinter.print(root);

      expect(printed).toBe('SET approximation = TRUE; SET unmapped_fields = "LOAD"; FROM index');
    });
  });

  describe('.upsert()', () => {
    it('modifies the value when the setting already exists', () => {
      const src = 'SET unmapped_fields = "DEFAULT"; FROM index';
      const { root } = Parser.parse(src);

      const node = commands.set.upsert(root, 'unmapped_fields', 'LOAD');
      const printed = BasicPrettyPrinter.print(root);

      expect(printed).toBe('SET unmapped_fields = "LOAD"; FROM index');
      expect(node).toMatchObject({
        type: 'header-command',
        name: 'set',
      });
    });

    it('adds a new SET command when the setting does not exist', () => {
      const src = 'FROM index | LIMIT 10';
      const { root } = Parser.parse(src);

      const node = commands.set.upsert(root, 'unmapped_fields', 'LOAD');
      const printed = BasicPrettyPrinter.print(root);

      expect(printed).toBe('SET unmapped_fields = "LOAD"; FROM index | LIMIT 10');
      expect(node).toMatchObject({
        type: 'header-command',
        name: 'set',
        args: [
          {
            type: 'function',
            subtype: 'binary-expression',
            name: '=',
            args: [
              { type: 'identifier', name: 'unmapped_fields' },
              { type: 'literal', literalType: 'keyword', valueUnquoted: 'LOAD' },
            ],
          },
        ],
      });
    });

    it('appends alongside existing SET commands', () => {
      const src = 'SET approximation = TRUE; FROM index';
      const { root } = Parser.parse(src);

      commands.set.upsert(root, 'unmapped_fields', 'LOAD');
      const printed = BasicPrettyPrinter.print(root);

      expect(printed).toBe('SET approximation = TRUE; SET unmapped_fields = "LOAD"; FROM index');
    });
  });
});
