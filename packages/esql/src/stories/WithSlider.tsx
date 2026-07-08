/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useState } from 'react';

export interface WithSliderProps {
  initialValue?: number;
  min?: number;
  max?: number;
  render: (value: number) => React.ReactNode;
}

export const WithSlider: React.FC<WithSliderProps> = ({
  render,
  initialValue = 80,
  min = 10,
  max = 200,
}) => {
  const [printWidth, setPrintWidth] = useState(initialValue);

  return (
    <div style={{ fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <label htmlFor="promql-width-slider">Width:</label>
        <input
          id="promql-width-slider"
          type="range"
          min={min}
          max={max}
          value={printWidth}
          onChange={(e) => setPrintWidth(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ minWidth: 32, textAlign: 'right' }}>{printWidth}</span>
      </div>
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
        {render(printWidth)}
      </div>
    </div>
  );
};
