/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useMemo, useState } from 'react';
import { Parser } from '../parser';
import {
  WrappingPrettyPrinter,
  type WrappingPrettyPrinterOptions,
} from '../pretty_print/wrapping_pretty_printer';

export interface EsqlWrappingPlaygroundProps {
  /** Initial ES|QL query shown in the editor. */
  query?: string;
  /** Initial print width (slider value). @default 80 */
  initialWidth?: number;
  /** Initial value of the "preserve comments" toggle. @default true */
  initialWithFormatting?: boolean;
}

interface PlaygroundOptions extends WrappingPrettyPrinterOptions {
  withFormatting: boolean;
}

const DEFAULT_QUERY = `FROM kibana_sample_data_logs, other_index METADATA _index, _id
  | WHERE bytes > 1000 AND (machine.ram >= 1024 OR NOT geo.dest == "US")
  | EVAL kib = bytes / 1024.0, tag = CONCAT("x-", TO_STRING(status)), big = machine.ram::double
  | STATS total = SUM(bytes), avg_ram = AVG(machine.ram) BY geo.dest, day = BUCKET(@timestamp, 1 day)
  | SORT total DESC NULLS LAST, geo.dest ASC
  | KEEP geo.dest, total, avg_ram, day
  | LIMIT 100`;

const panel: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  border: '1px solid #d3dae6',
  borderRadius: 6,
  padding: 12,
  boxSizing: 'border-box',
};

const Checkbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    {label}
  </label>
);

export const EsqlWrappingPlayground: React.FC<EsqlWrappingPlaygroundProps> = ({
  query: initialQuery = DEFAULT_QUERY,
  initialWidth = 80,
  initialWithFormatting = true,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [opts, setOpts] = useState<PlaygroundOptions>({
    wrap: initialWidth,
    tab: '  ',
    indent: '',
    multiline: false,
    skipHeader: false,
    lowercase: false,
    lowercaseCommands: false,
    lowercaseOptions: false,
    lowercaseFunctions: false,
    lowercaseKeywords: false,
    withFormatting: initialWithFormatting,
  });
  const [nonce, setNonce] = useState(0);

  const setOpt = <K extends keyof PlaygroundOptions>(key: K, value: PlaygroundOptions[K]) =>
    setOpts((prev) => ({ ...prev, [key]: value }));

  const { output, error } = useMemo(() => {
    void nonce;
    const { withFormatting, ...printerOpts } = opts;
    try {
      const { root, errors } = Parser.parse(query, { withFormatting });
      const formatted = WrappingPrettyPrinter.print(root, printerOpts);
      return {
        output: formatted,
        error: errors.length ? errors.map((e) => e.message).join('\n') : undefined,
      };
    } catch (e) {
      return { output: '', error: String(e) };
    }
  }, [query, opts, nonce]);

  const width = opts.wrap ?? 80;

  return (
    <div style={{ fontFamily: 'monospace', fontSize: 13 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
        {/* Panel 1: editable query */}
        <div style={panel}>
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Query</div>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            spellCheck={false}
            style={{
              width: '100%',
              height: 220,
              fontFamily: 'monospace',
              fontSize: 13,
              boxSizing: 'border-box',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Panel 2: printer options */}
        <div style={panel}>
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Options</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <label htmlFor="esql-width">Width</label>
            <input
              id="esql-width"
              type="range"
              min={10}
              max={200}
              value={width}
              onChange={(e) => setOpt('wrap', Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <input
              type="number"
              min={10}
              max={200}
              value={width}
              onChange={(e) => setOpt('wrap', Number(e.target.value))}
              style={{ width: 56 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              tab
              <input
                type="text"
                value={(opts.tab ?? '  ').replace(/ /g, '·')}
                onChange={(e) => setOpt('tab', e.target.value.replace(/·/g, ' '))}
                style={{ width: 56 }}
              />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              indent
              <input
                type="text"
                value={opts.indent ?? ''}
                onChange={(e) => setOpt('indent', e.target.value)}
                style={{ width: 56 }}
              />
            </label>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 6,
              marginBottom: 12,
            }}
          >
            <Checkbox
              label="multiline"
              checked={!!opts.multiline}
              onChange={(v) => setOpt('multiline', v)}
            />
            <Checkbox
              label="skipHeader"
              checked={!!opts.skipHeader}
              onChange={(v) => setOpt('skipHeader', v)}
            />
            <Checkbox
              label="withFormatting"
              checked={opts.withFormatting}
              onChange={(v) => setOpt('withFormatting', v)}
            />
            <Checkbox
              label="lowercase"
              checked={!!opts.lowercase}
              onChange={(v) => setOpt('lowercase', v)}
            />
            <Checkbox
              label="lowercaseCommands"
              checked={!!opts.lowercaseCommands}
              onChange={(v) => setOpt('lowercaseCommands', v)}
            />
            <Checkbox
              label="lowercaseOptions"
              checked={!!opts.lowercaseOptions}
              onChange={(v) => setOpt('lowercaseOptions', v)}
            />
            <Checkbox
              label="lowercaseFunctions"
              checked={!!opts.lowercaseFunctions}
              onChange={(v) => setOpt('lowercaseFunctions', v)}
            />
            <Checkbox
              label="lowercaseKeywords"
              checked={!!opts.lowercaseKeywords}
              onChange={(v) => setOpt('lowercaseKeywords', v)}
            />
          </div>

          <button
            type="button"
            onClick={() => setNonce((n) => n + 1)}
            style={{ padding: '6px 16px' }}
          >
            Reprint
          </button>
        </div>
      </div>

      {/* Output */}
      <div style={{ ...panel, marginTop: 12, position: 'relative' }}>
        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
          Output <span style={{ color: '#69707d', fontWeight: 'normal' }}>(width = {width})</span>
        </div>
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: `${width}ch`,
              bottom: 0,
              borderLeft: '1px dashed #c2cad6',
              pointerEvents: 'none',
            }}
          />
          <pre style={{ margin: 0, whiteSpace: 'pre' }}>
            <code>{output}</code>
          </pre>
        </div>
        {error && (
          <pre style={{ color: '#bd271e', fontSize: '0.85em', marginTop: '0.75em' }}>{error}</pre>
        )}
      </div>
    </div>
  );
};
