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
import hljs from 'highlight.js/lib/core';
import githubCss from 'highlight.js/styles/github.css?inline';
import githubDarkCss from 'highlight.js/styles/github-dark.css?inline';
import atomOneDarkCss from 'highlight.js/styles/atom-one-dark.css?inline';
import nordCss from 'highlight.js/styles/nord.css?inline';
import { esql } from '../index';

hljs.registerLanguage('esql', esql);

export const themes = ['github', 'github-dark', 'atom-one-dark', 'nord'] as const;

export type ThemeName = (typeof themes)[number];

const themeCss: Record<ThemeName, string> = {
  github: githubCss,
  'github-dark': githubDarkCss,
  'atom-one-dark': atomOneDarkCss,
  nord: nordCss,
};

export interface HighlightedCodeProps {
  code: string;
  theme?: ThemeName;
}

export const HighlightedCode: React.FC<HighlightedCodeProps> = ({ code, theme = 'github' }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const html = React.useMemo(() => {
    try {
      return hljs.highlight(code, { language: 'esql' }).value;
    } catch (error) {
      return `Failed to highlight: ${error instanceof Error ? error.message : String(error)}`;
    }
  }, [code]);

  React.useEffect(() => {
    const host = ref.current;
    if (!host) return;

    const root = host.shadowRoot ?? host.attachShadow({ mode: 'open' });

    root.innerHTML =
      `<style>${themeCss[theme]}` +
      `pre{margin:0;font-size:14px;line-height:1.5}` +
      `code.hljs{display:block;padding:16px;border-radius:8px}</style>` +
      `<pre><code class="hljs">${html}</code></pre>`;
  }, [html, theme]);

  return <div ref={ref} />;
};
