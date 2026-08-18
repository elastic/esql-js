/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the MIT license (the "License"); you may
 * not use this file except in compliance with the License.
 */

/// <reference types="vite/client" />

import * as React from 'react';
import type { HLJSApi } from 'highlight.js';
import esqlMinUrl from '../../lib/esql.min.js?url';

const HLJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.12.0/highlight.min.js';
const THEME_CDN =
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.12.0/styles/github.min.css';

const scriptPromises = new Map<string, Promise<void>>();

const loadScript = (src: string): Promise<void> => {
  let promise = scriptPromises.get(src);

  if (!promise) {
    promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');

      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
    scriptPromises.set(src, promise);
  }

  return promise;
};

const getGlobalHljs = (): HLJSApi => (window as unknown as { hljs: HLJSApi }).hljs;

export interface CdnHighlightedCodeProps {
  code: string;
}

export const CdnHighlightedCode: React.FC<CdnHighlightedCodeProps> = ({ code }) => {
  const [ready, setReady] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    loadScript(HLJS_CDN)
      .then(() => loadScript(esqlMinUrl))
      .then(() => setReady(true))
      .catch((err) => setError(err instanceof Error ? err.message : String(err)));
  }, []);

  const html = React.useMemo(() => {
    if (!ready) return '';
    try {
      return getGlobalHljs().highlight(code, { language: 'esql' }).value;
    } catch (err) {
      return `Failed to highlight: ${err instanceof Error ? err.message : String(err)}`;
    }
  }, [ready, code]);

  if (error) {
    return <p style={{ fontFamily: 'sans-serif', color: 'crimson' }}>{error}</p>;
  }

  if (!ready) {
    return <p style={{ fontFamily: 'sans-serif' }}>Loading highlight.js from CDN…</p>;
  }

  return (
    <>
      <link rel="stylesheet" href={THEME_CDN} />
      <pre style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
        <code
          className="hljs"
          style={{ display: 'block', padding: 16, borderRadius: 8 }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>
    </>
  );
};
