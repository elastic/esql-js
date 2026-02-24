import babelEslint from '@babel/eslint-parser';

const licenseHeader = `/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */`;

export const requireLicenseHeader = {
  meta: {
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          license: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create: (context) => {
    return {
      Program(program) {
        const license = init(context, program, function () {
          const parsed = babelEslint.parse(licenseHeader, { requireConfigFile: false });
          assert(!parsed.body.length, '"license" option must only include a single comment');
          assert(
            parsed.comments.length === 1,
            '"license" option must only include a single comment'
          );

          return {
            source: licenseHeader,
            nodeValue: normalizeWhitespace(parsed.comments[0].value),
          };
        });

        if (!license) {
          return;
        }

        const sourceCode = context.sourceCode;
        const comment = sourceCode
          .getAllComments()
          .find((node) => normalizeWhitespace(node.value) === license.nodeValue);

        // no license comment
        if (!comment) {
          context.report({
            message: 'File must start with a license header',
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: sourceCode.lines[0].length - 1 },
            },
            fix(fixer) {
              if (isHashbang(sourceCode.lines[0])) {
                return undefined;
              }

              return fixer.replaceTextRange([0, 0], licenseHeader + '\n\n');
            },
          });
          return;
        }

        // ensure there is nothing before the comment
        const sourceBeforeNode = sourceCode
          .getText()
          .slice(0, sourceCode.getIndexFromLoc(comment.loc.start));
        if (sourceBeforeNode.length && !isHashbang(sourceBeforeNode)) {
          context.report({
            node: comment,
            message: 'License header must be at the very beginning of the file',
            fix(fixer) {
              // replace leading whitespace if possible
              if (sourceBeforeNode.trim() === '') {
                return fixer.replaceTextRange([0, sourceBeforeNode.length], '');
              }

              // inject content at top and remove node from current location
              // if removing whitespace is not possible
              return [
                fixer.remove(comment),
                fixer.replaceTextRange([0, 0], license.source + '\n\n'),
              ];
            },
          });
        }
      },
    };
  },
};

function isHashbang(text) {
  return text.trim().startsWith('#!') && !text.trim().includes('\n');
}

function assert(truth, message) {
  if (truth) {
    return;
  }

  const error = new Error(message);
  error.failedAssertion = true;
  throw error;
}

function normalizeWhitespace(string) {
  return string.replace(/\s+/g, ' ');
}

function init(context, program, initStep) {
  try {
    return initStep();
  } catch (error) {
    if (error.failedAssertion) {
      context.report({
        node: program,
        message: error.message,
      });
    } else {
      throw error;
    }
  }
}
