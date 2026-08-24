/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import * as fixtures from './fixtures_visitor';
import type { ESQLAstForkCommand } from '@elastic/esql-types';
import { CommandVisitorContext, WhereCommandVisitorContext, Visitor } from '../index';

test('can collect all command names in type safe way', () => {
  const visitor = new Visitor()
    .on('visitCommand', (ctx) => {
      return ctx.node.name;
    })
    .on('visitQuery', (ctx) => {
      const cmds = [];
      for (const cmd of ctx.visitCommands()) {
        cmds.push(cmd);
      }
      return cmds;
    });

  const ast = fixtures.fromLimit().commands;
  const res = visitor.visitQuery(ast);

  expect(res).toEqual(['from', 'limit']);
});

test('can pass inputs to visitors', () => {
  const visitor = new Visitor()
    .on('visitCommand', (ctx, prefix: string) => {
      return prefix + ctx.node.name;
    })
    .on('visitQuery', (ctx) => {
      const cmds = [];
      for (const cmd of ctx.visitCommands('pfx:')) {
        cmds.push(cmd);
      }
      return cmds;
    });

  const ast = fixtures.fromLimit().commands;
  const res = visitor.visitQuery(ast);

  expect(res).toEqual(['pfx:from', 'pfx:limit']);
});

test('a query can have a parent fork command', () => {
  const ast = fixtures.fromFork().commands;

  let parentCount = 0;
  new Visitor()
    .on('visitCommand', (ctx) => {
      if (ctx.node.name === 'fork') {
        const forkCommand = ctx.node as ESQLAstForkCommand;

        forkCommand.args.forEach((parens) => {
          ctx.visitSubQuery(parens.child);
        });
      }
    })
    .on('visitQuery', (ctx) => {
      if (ctx.parent) parentCount++;

      for (const _cmdResult of ctx.visitCommands()) {
        // nothing
      }
    })
    .visitQuery(ast);

  expect(parentCount).toBe(2);
});

test('can specify specific visitors for commands', () => {
  const ast = fixtures.fromSortWhereEnrichLimit().commands;
  const res = new Visitor()
    .on('visitWhereCommand', () => 'where')
    .on('visitSortCommand', () => 'sort')
    .on('visitEnrichCommand', () => 'very rich')
    .on('visitCommand', () => 'DEFAULT')
    .on('visitQuery', (ctx) => [...ctx.visitCommands()])
    .visitQuery(ast);

  expect(res).toEqual(['DEFAULT', 'sort', 'where', 'very rich', 'DEFAULT']);
});

test('a command can access parent query node', () => {
  const root = fixtures.fromSortWhereEnrichLimit();
  new Visitor()
    .on('visitWhereCommand', (ctx) => {
      if (ctx.parent!.node !== root) {
        throw new Error('Expected parent to be query node');
      }
    })
    .on('visitCommand', (ctx) => {
      if (ctx.parent!.node !== root) {
        throw new Error('Expected parent to be query node');
      }
    })
    .on('visitQuery', (ctx) => [...ctx.visitCommands()])
    .visitQuery(root);
});

test('specific commands receive specific visitor contexts', () => {
  const root = fixtures.fromSortWhereEnrichLimit();

  new Visitor()
    .on('visitWhereCommand', (ctx) => {
      if (!(ctx instanceof WhereCommandVisitorContext)) {
        throw new Error('Expected WhereCommandVisitorContext');
      }
      if (!(ctx instanceof CommandVisitorContext)) {
        throw new Error('Expected WhereCommandVisitorContext');
      }
    })
    .on('visitCommand', (ctx) => {
      if (!(ctx instanceof CommandVisitorContext)) {
        throw new Error('Expected CommandVisitorContext');
      }
    })
    .on('visitQuery', (ctx) => [...ctx.visitCommands()])
    .visitQuery(root);

  new Visitor()
    .on('visitCommand', (ctx) => {
      if (!(ctx instanceof CommandVisitorContext)) {
        throw new Error('Expected CommandVisitorContext');
      }
      if (ctx instanceof WhereCommandVisitorContext) {
        throw new Error('Did not expect WhereCommandVisitorContext');
      }
    })
    .on('visitQuery', (ctx) => [...ctx.visitCommands()])
    .visitQuery(root);
});

describe('header commands', () => {
  test('can visit header commands', () => {
    const root = fixtures.setTimeoutFromLimit();
    const headerNames: string[] = [];

    new Visitor()
      .on('visitHeaderCommand', (ctx) => {
        headerNames.push(ctx.node.name);
      })
      .on('visitQuery', (ctx) => {
        for (const _headerResult of ctx.visitHeaderCommands()) {
          // Visit header commands
        }
      })
      .visitQuery(root);

    expect(headerNames).toEqual(['set']);
  });

  test('can visit multiple header commands', () => {
    const root = fixtures.setThreeFrom();
    const headerNames: string[] = [];

    new Visitor()
      .on('visitHeaderCommand', (ctx) => {
        headerNames.push(ctx.name());
      })
      .on('visitQuery', (ctx) => {
        for (const _headerResult of ctx.visitHeaderCommands()) {
          // Visit header commands
        }
      })
      .visitQuery(root);

    expect(headerNames).toEqual(['SET', 'SET', 'SET']);
  });

  test('can visit header command arguments', () => {
    const root = fixtures.setTimeoutFrom();
    const identifiers: string[] = [];
    const literals: string[] = [];

    new Visitor()
      .on('visitExpression', (ctx) => {
        // Default expression visitor
      })
      .on('visitFunctionCallExpression', (ctx) => {
        // Visit function arguments recursively
        for (const _arg of ctx.visitArguments(undefined)) {
          // Process arguments
        }
      })
      .on('visitHeaderCommand', (ctx) => {
        for (const _argResult of ctx.visitArgs(undefined)) {
          // Visit arguments
        }
      })
      .on('visitIdentifierExpression', (ctx) => {
        if (ctx.node.name !== '=') {
          identifiers.push(ctx.node.name);
        }
      })
      .on('visitLiteralExpression', (ctx) => {
        if (ctx.node.literalType === 'keyword') {
          literals.push(ctx.node.valueUnquoted || '');
        }
      })
      .on('visitQuery', (ctx) => {
        for (const _headerResult of ctx.visitHeaderCommands()) {
          // Visit header commands
        }
      })
      .visitQuery(root);

    expect(identifiers).toEqual(['timeout']);
    expect(literals).toEqual(['30s']);
  });

  test('header commands are visited before regular commands', () => {
    const root = fixtures.setOneFromLimit();
    const visitOrder: string[] = [];

    new Visitor()
      .on('visitHeaderCommand', (ctx) => {
        visitOrder.push(`header:${ctx.node.name}`);
      })
      .on('visitCommand', (ctx) => {
        visitOrder.push(`command:${ctx.node.name}`);
      })
      .on('visitQuery', (ctx) => {
        for (const _headerResult of ctx.visitHeaderCommands()) {
          // Visit header commands first
        }
        for (const _cmdResult of ctx.visitCommands()) {
          // Then visit regular commands
        }
      })
      .visitQuery(root);

    expect(visitOrder).toEqual(['header:set', 'command:from', 'command:limit']);
  });

  test('can iterate through header commands', () => {
    const root = fixtures.setTwoFrom();
    const headerCommandCount = [
      ...new Visitor().on('visitQuery', (ctx) => ctx.headerCommands()).visitQuery(root),
    ].length;

    expect(headerCommandCount).toBe(2);
  });

  test('header command context has correct parent', () => {
    const root = fixtures.setTimeoutFrom();

    new Visitor()
      .on('visitHeaderCommand', (ctx) => {
        if (ctx.parent!.node !== root) {
          throw new Error('Expected parent to be query node');
        }
      })
      .on('visitQuery', (ctx) => {
        for (const _headerResult of ctx.visitHeaderCommands()) {
          // Visit header commands
        }
      })
      .visitQuery(root);
  });

  test('can visit header command directly', () => {
    const root = fixtures.setTimeoutFrom();
    const headerCommand = root.header![0];

    const result = new Visitor()
      .on('visitHeaderCommand', (ctx) => {
        return `visited:${ctx.node.name}`;
      })
      .visitHeaderCommand(headerCommand);

    expect(result).toBe('visited:set');
  });

  test('header commands with various value types', () => {
    const root = fixtures.setMixedFrom();
    const literals: (string | number | boolean)[] = [];

    new Visitor()
      .on('visitExpression', (ctx) => {
        // Default expression visitor
      })
      .on('visitFunctionCallExpression', (ctx) => {
        // Visit function arguments recursively
        for (const _arg of ctx.visitArguments(undefined)) {
          // Process arguments
        }
      })
      .on('visitHeaderCommand', (ctx) => {
        for (const _argResult of ctx.visitArgs(undefined)) {
          // Visit arguments
        }
      })
      .on('visitLiteralExpression', (ctx) => {
        literals.push(ctx.node.value);
      })
      .on('visitQuery', (ctx) => {
        for (const _headerResult of ctx.visitHeaderCommands()) {
          // Visit header commands
        }
      })
      .visitQuery(root);

    expect(literals).toContain(1);
    expect(literals).toContain('"value"');
    expect(literals).toContain('true');
  });

  test('can return values from header command visitor', () => {
    const root = fixtures.setTwoFrom();

    const results = new Visitor()
      .on('visitHeaderCommand', (ctx) => {
        return `header-${ctx.node.name}`;
      })
      .on('visitQuery', (ctx) => {
        return [...ctx.visitHeaderCommands()];
      })
      .visitQuery(root);

    expect(results).toEqual(['header-set', 'header-set']);
  });
});
