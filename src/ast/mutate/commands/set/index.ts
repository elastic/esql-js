/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Builder } from '../../../builder';
import { isAssignment } from '../../../is';
import { Parser } from '../../../../parser';
import type {
  ESQLAstQueryExpression,
  ESQLAstSetHeaderCommand,
  ESQLBinaryExpression,
  BinaryExpressionAssignmentOperator,
  ESQLIdentifier,
} from '../../../../types';

/**
 * Lists all SET header commands in the query AST.
 *
 * @param ast The root AST node.
 * @returns An iterable of SET header commands.
 */
export const list = function* (
  ast: ESQLAstQueryExpression
): IterableIterator<ESQLAstSetHeaderCommand> {
  if (!ast.header) return;
  for (const cmd of ast.header) {
    if (cmd.name === 'set') {
      yield cmd as ESQLAstSetHeaderCommand;
    }
  }
};

/**
 * Finds a SET header command by its setting name.
 *
 * @param ast The root AST node.
 * @param settingName The name of the setting to find (e.g. "unmapped_fields").
 * @returns The matching SET header command, or undefined.
 */
export const findBySettingName = (
  ast: ESQLAstQueryExpression,
  settingName: string
): ESQLAstSetHeaderCommand | undefined => {
  for (const cmd of list(ast)) {
    const assignment = cmd.args[0];
    if (isAssignment(assignment)) {
      const identifier = assignment.args[0] as ESQLIdentifier;
      if (identifier.name === settingName) {
        return cmd;
      }
    }
  }
  return undefined;
};

/**
 * Updates the value of an existing SET setting. Returns the modified header
 * command, or `undefined` if no matching setting was found.
 *
 * @param ast The root AST node.
 * @param settingName The name of the setting to modify.
 * @param value The new string value for the setting.
 * @returns The modified SET header command, or undefined if not found.
 */
export const update = (
  ast: ESQLAstQueryExpression,
  settingName: string,
  value: string
): ESQLAstSetHeaderCommand | undefined => {
  const cmd = findBySettingName(ast, settingName);
  if (!cmd) return undefined;

  const newNode = Parser.parseExpression(value).root;

  const assignment = cmd.args[0] as ESQLBinaryExpression<BinaryExpressionAssignmentOperator>;
  assignment.args[1] = newNode;

  return cmd;
};

/**
 * Updates the value of an existing SET setting, or inserts a new SET header
 * command if the setting does not exist. The new command is inserted as the last
 * command in the header.
 *
 * @param ast The root AST node.
 * @param settingName The name of the setting (e.g. "unmapped_fields").
 * @param value The string value for the setting.
 * @returns The modified or newly created SET header command.
 */
export const upsert = (
  ast: ESQLAstQueryExpression,
  settingName: string,
  value: string
): ESQLAstSetHeaderCommand => {
  const existing = update(ast, settingName, value);
  if (existing) return existing;

  const identifier = Builder.identifier(settingName);
  const newNode = Parser.parseExpression(value).root;
  const assignment = Builder.expression.func.binary('=', [identifier, newNode]);
  const cmd = Builder.header.command.set([
    assignment as ESQLBinaryExpression<BinaryExpressionAssignmentOperator>,
  ]);

  if (!ast.header) {
    ast.header = [];
  }
  ast.header.push(cmd);

  return cmd;
};

/**
 * Removes a SET header command by its setting name.
 *
 * @param ast The root AST node.
 * @param settingName The name of the setting to remove.
 * @returns The removed SET header command, or undefined if not found.
 */
export const remove = (
  ast: ESQLAstQueryExpression,
  settingName: string
): ESQLAstSetHeaderCommand | undefined => {
  const cmd = findBySettingName(ast, settingName);
  if (!cmd || !ast.header) return;

  const index = ast.header.indexOf(cmd);
  if (index === -1) return;

  ast.header.splice(index, 1);
  return cmd;
};
