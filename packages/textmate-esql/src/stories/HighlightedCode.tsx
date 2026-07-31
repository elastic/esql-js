/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the MIT license (the "License"); you may
 * not use this file except in compliance with the License.
 */

import * as React from 'react';
import { createHighlighter, type Highlighter, type LanguageRegistration } from 'shiki';
import { grammar } from '../index';

export const themes = ['github-light', 'github-dark', 'nord', 'dracula', 'one-light'] as const;

export type ThemeName = (typeof themes)[number];

const esqlLang = { ...grammar, name: 'esql' } as unknown as LanguageRegistration;

let highlighterPromise: Promise<Highlighter> | undefined;

const getHighlighter = () => {
  highlighterPromise ??= createHighlighter({
    themes: [...themes],
    langs: [esqlLang],
  });

  return highlighterPromise;
};

export interface HighlightedCodeProps {
  code: string;
  theme?: ThemeName;
}

export const HighlightedCode: React.FC<HighlightedCodeProps> = ({
  code,
  theme = 'github-light',
}) => {
  const [html, setHtml] = React.useState('');

  React.useEffect(() => {
    let cancelled = false;

    getHighlighter().then((highlighter) => {
      if (cancelled) return;
      setHtml(highlighter.codeToHtml(code, { lang: 'esql', theme }));
    });

    return () => {
      cancelled = true;
    };
  }, [code, theme]);

  return (
    <div style={{ fontSize: 14, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: html }} />
  );
};
