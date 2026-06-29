/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';

export interface FormatTextProps {
  text: string;
  error?: React.ReactNode;
}

export const FormatText: React.FC<FormatTextProps> = ({ text, error }) => {
  return (
    <div>
      <pre>
        <code>{text}</code>
      </pre>
      {error && <pre style={{ color: 'red', fontSize: '0.85em', marginTop: '0.5em' }}>{error}</pre>}
    </div>
  );
};
