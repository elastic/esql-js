/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { WithSlider } from './WithSlicer';
import { FormatPromQL, FormatPromQLProps } from './FormatPromQL';

export interface InteractivePromQLProps extends FormatPromQLProps {
  /** Initial slider value. @default 80 */
  initialWidth?: number;
}

export const InteractivePromQL: React.FC<InteractivePromQLProps> = ({
  initialWidth = 80,
  ...rest
}) => {
  return (
    <WithSlider
      initialValue={initialWidth}
      render={(width) => <FormatPromQL {...rest} printWidth={width} />}
    />
  );
};
