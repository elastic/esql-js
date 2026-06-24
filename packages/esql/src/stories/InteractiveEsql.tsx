/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { WithSlider } from './WithSlider';
import { FormatEsql, FormatEsqlProps } from './FormatEsql';

export interface InteractiveEsqlProps extends FormatEsqlProps {
  /** Initial slider value. @default 80 */
  initialWidth?: number;
}

export const InteractiveEsql: React.FC<InteractiveEsqlProps> = ({ initialWidth = 80, ...rest }) => {
  return (
    <WithSlider
      initialValue={initialWidth}
      render={(width) => <FormatEsql {...rest} wrap={width} />}
    />
  );
};
