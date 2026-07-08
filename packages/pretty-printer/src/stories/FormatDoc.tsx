/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { text, group, indent, line, join, layout } from '..';

export interface FormatDocProps {
  /** Number of list items to render inside the bracketed list. */
  items: number;
  /** Target maximum line width passed to the layout engine. */
  printWidth: number;
}

const buildDoc = (items: number) =>
  group([
    text('SELECT'),
    indent([
      line,
      join(
        [text(','), line],
        Array.from({ length: items }, (_, i) => text(`column_${i + 1}`))
      ),
    ]),
    line,
    text('FROM events'),
  ]);

/**
 * Demonstrates the Wadler-Lindig layout engine: the same `Doc` tree renders
 * flat or broken depending on whether it fits within `printWidth`.
 */
export const FormatDoc: React.FC<FormatDocProps> = ({ items, printWidth }) => {
  const output = layout(buildDoc(items), { printWidth });

  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre' }}>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: `${printWidth}ch`,
            bottom: 0,
            borderLeft: '1px dashed #ccc',
            pointerEvents: 'none',
          }}
        />
        {output}
      </div>
    </div>
  );
};
